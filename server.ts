/**
 * Fishers Painting — API Proxy Server
 *
 * Holds the GEMINI_API_KEY server-side so it is never exposed in the
 * client bundle. The frontend calls /api/* and this server forwards the
 * requests to the Gemini API.
 */

import express from 'express';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';
import cors from 'cors';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://blueprint-interior-visualizer.onrender.com',
  'https://blueprint-painting-estimator.onrender.com',
  'https://blueprintaiconsulting.github.io'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json({ limit: '50mb' }));

const PORT = Number(process.env.PORT || process.env.SERVER_PORT) || 4011;

if (!process.env.GEMINI_API_KEY) {
  console.error('❌  GEMINI_API_KEY is not set. Add it to your .env file.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ---------------------------------------------------------------------------
// Rate limiters
// ---------------------------------------------------------------------------
const generationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment before trying again.' }
});

const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests.' }
});

// Timeout wrapper
const withTimeout = <T>(promise: Promise<T>, ms: number, label: string): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms)),
  ]);

// Image validation
function validateImagePayload(base64: string, mime: string = '') {
  if (!base64) throw new Error('Missing imageBase64 payload');
  const rawBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
  if (rawBase64.length < 100) throw new Error('imageBase64 payload is too small to be a valid image');
  
  let activeMime = mime;
  if (!activeMime && base64.startsWith('data:image/')) {
    activeMime = base64.substring(5, base64.indexOf(';'));
  }
  
  const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
  if (activeMime && !validMimes.includes(activeMime.toLowerCase())) {
    throw new Error(`Invalid image MIME type: ${activeMime}. Must be jpeg, png, webp, or heic.`);
  }

  const roughSizeBytes = rawBase64.length * 0.75;
  if (roughSizeBytes > 20 * 1024 * 1024) throw new Error('Image exceeds 20MB safety limit');

  return rawBase64;
}

// ---------------------------------------------------------------------------
// POST /api/detect-room
// Analyzes an interior photo and identifies remodel-able surfaces.
// Body: { imageBase64: string, mimeType: string, roomType: string }
// Returns: { isInteriorRoom: boolean, zones: [{name, category, maskTarget}] }
// ---------------------------------------------------------------------------
app.post('/api/detect-room', generationLimiter, async (req, res) => {
  let { imageBase64 } = req.body as { imageBase64: string };
  const { mimeType, roomType = 'kitchen' } = req.body as {
    mimeType: string; roomType: string;
  };

  if (!imageBase64) return res.status(400).json({ error: 'Missing imageBase64.' });

  // Room-specific zone detection prompts
  const ROOM_PROMPTS: Record<string, string> = {
    kitchen: `Identify ALL remodel-able surfaces in this KITCHEN photograph:
- WALLS: All painted wall surfaces visible
- UPPER CABINETS: Upper/wall cabinet door fronts (if present)
- LOWER CABINETS: Base cabinet door fronts
- ISLAND: Kitchen island cabinet fronts (if present)
- COUNTERTOPS: All counter surfaces
- BACKSPLASH: Tile/surface between countertops and upper cabinets
- FLOORING: Visible floor surface
- TRIM: Baseboards, crown molding, window casings (optional accent zone)

NEVER include: appliances (refrigerator, stove, oven, microwave, dishwasher), sink, faucet, hardware/knobs/pulls, window glass, light fixtures, food, personal items, decorations.`,

    bathroom: `Identify ALL remodel-able surfaces in this BATHROOM photograph:
- WALLS: All painted wall surfaces
- VANITY CABINET: Bathroom vanity cabinet fronts
- VANITY TOP: Countertop surface on the vanity
- SHOWER/TUB SURROUND: Tile or surface enclosing shower or tub area (if visible)
- FLOORING: Visible floor surface
- TRIM: Baseboards, window casings (optional)

NEVER include: toilet, faucet, mirror glass, shower glass/door, towels, toiletries, light fixtures, personal items.`,

    'living-room': `Identify ALL remodel-able surfaces in this LIVING ROOM photograph:
- WALLS: All painted wall surfaces
- ACCENT WALL: A visually prominent wall suitable for a contrasting color (if distinct)
- FLOORING: Visible floor surface
- TRIM: Baseboards, crown molding, window casings (optional)

NEVER include: furniture, TV, electronics, art, curtains, rugs, plants, personal items.`,

    bedroom: `Identify ALL remodel-able surfaces in this BEDROOM photograph:
- WALLS: All painted wall surfaces
- ACCENT WALL: Wall behind the headboard or a distinct feature wall (if applicable)
- FLOORING: Visible floor surface
- TRIM: Baseboards, crown molding, window casings (optional)

NEVER include: bed, furniture, lamps, curtains, bedding, art, personal items.`,
  };

  const roomPrompt = ROOM_PROMPTS[roomType] || ROOM_PROMPTS['kitchen'];

  try {
    imageBase64 = validateImagePayload(imageBase64, mimeType);
    const response = await withTimeout(ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType: mimeType || 'image/jpeg' } },
          {
            text: `You are an expert interior design analyst. Analyze this room photograph and identify every DISTINCT surface that a homeowner might want to remodel or change.

${roomPrompt}

SECTION IDENTIFICATION RULES:
- Each zone must be a DISTINCT remodel surface.
- Order zones by visual prominence (largest/most impactful first).
- For each zone, provide a "category" from: walls, cabinets, countertops, backsplash, flooring, trim, vanity, shower-surround, accent-wall, ceiling.
- For each maskTarget: describe the zone's exact location and boundaries very precisely.

CRITICAL PRE-FLIGHT CHECK: Determine if the image is actually an interior room photograph.

Return ONLY valid JSON - no markdown, no code fences:
{
  "isInteriorRoom": boolean,
  "detectedRoomType": "kitchen" | "bathroom" | "living-room" | "bedroom" | "other",
  "zones": [
    {
      "name": "descriptive name",
      "category": "surface category",
      "maskTarget": "precise segmentation instruction"
    }
  ],
  "optionalZones": [
    {
      "name": "optional accent zone name",
      "category": "surface category",
      "maskTarget": "precise segmentation instruction"
    }
  ]
}`
          },
        ],
      },
    }), 30_000, 'detect-room');

    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let parsed: Record<string, unknown>;
    try {
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace === -1 || lastBrace === -1) throw new Error('No JSON object found');
      parsed = JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
    } catch {
      console.error('[detect-room] JSON parse error. Raw:', rawText.slice(0, 300));
      return res.status(500).json({ error: 'AI returned an invalid format. Please try a clearer photo.' });
    }

    if (parsed.isInteriorRoom === false) {
      return res.status(400).json({ error: 'PREFLIGHT_FAILURE: The uploaded image does not appear to be an interior room. Please upload a clear photo of your kitchen, bathroom, or living space.' });
    }

    res.json({
      isInteriorRoom: true,
      detectedRoomType: parsed.detectedRoomType || roomType,
      zones: parsed.zones || [],
      optionalZones: parsed.optionalZones || [],
    });
  } catch (err: unknown) {
    console.error('[detect-room] error:', (err instanceof Error ? err.message : String(err)));
    res.status(500).json({ error: (err instanceof Error ? err.message : String(err)) || 'Room detection failed.' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/interior-render
// Multi-pass interior visualization — renders one surface category at a time.
// Body: { imageBase64, mimeType, roomType, renderPass, zones }
// renderPass: 'paint' | 'cabinets' | 'countertops' | 'flooring'
// Returns: { resultImage: string }
// ---------------------------------------------------------------------------
interface InteriorZonePayload {
  name: string;
  category: string;
  brand: string;
  lineName: string;
  colorName: string;
  colorHex: string;
  hue: string;
  materialType: string;
}

const PASS_CONFIGS: Record<string, {
  categories: string[];
  exclusions: string[];
  preserveNote: string;
  textureInstructions: string;
}> = {
  paint: {
    categories: ['walls', 'accent-wall', 'trim', 'ceiling'],
    exclusions: ['cabinets', 'countertops', 'backsplash', 'flooring', 'appliances', 'plumbing fixtures', 'window glass', 'light fixtures', 'furniture', 'personal items'],
    preserveNote: 'Preserve ALL non-paint surfaces exactly: cabinets, countertops, backsplash, flooring, appliances, fixtures.',
    textureInstructions: `- Paint: subtle eggshell or satin sheen, roller-applied micro-texture visible in raking light
- Trim paint: higher sheen semi-gloss finish on baseboards, crown molding, and casings
- Color must be accurate to the provided hex reference — do NOT interpret artistically`,
  },
  cabinets: {
    categories: ['cabinets', 'vanity'],
    exclusions: ['walls', 'countertops', 'backsplash', 'flooring', 'appliances', 'plumbing fixtures', 'window glass', 'light fixtures'],
    preserveNote: 'Preserve walls, countertops, backsplash, flooring, and all non-cabinet surfaces exactly as they appear.',
    textureInstructions: `- Painted cabinets: smooth painted finish with visible door panel structure (rails, stiles, center panel)
- Stained cabinets: visible natural wood grain running in the correct direction through the door style
- Cabinet door STYLE (shaker, raised panel, slab) must be clearly rendered — this is a key visual differentiator
- Hardware (knobs/pulls) should remain unchanged`,
  },
  countertops: {
    categories: ['countertops', 'backsplash', 'shower-surround'],
    exclusions: ['walls', 'cabinets', 'flooring', 'appliances', 'plumbing fixtures', 'window glass'],
    preserveNote: 'Preserve walls, cabinets, flooring, and all non-counter/tile surfaces exactly.',
    textureInstructions: `- Quartz/granite countertops: polished surface with subtle reflections, realistic veining pattern, proper edge profile
- Backsplash tile: individual tiles visible with grout lines, proper scale relative to the wall area
- Subway tile: classic brick-lay pattern with visible grout joints
- Marble-look: natural variation in veining — no two areas identical
- Shower tile: large-format pieces with minimal grout lines, or subway with proper grout spacing`,
  },
  flooring: {
    categories: ['flooring'],
    exclusions: ['walls', 'cabinets', 'countertops', 'backsplash', 'appliances', 'plumbing fixtures', 'furniture'],
    preserveNote: 'Preserve ALL surfaces above the floor: walls, cabinets, countertops, backsplash, furniture.',
    textureInstructions: `- Hardwood: individual plank variation with natural grain, correct plank width scaled to room perspective
- LVP: realistic wood-look texture with proper plank pattern, perspective-accurate
- Tile: individual tiles with grout lines, correct scale pattern
- All flooring must follow the room's perspective vanishing point accurately
- Plank direction should run toward the primary light source or longest wall`,
  },
};

app.post('/api/interior-render', generationLimiter, async (req, res) => {
  let { imageBase64 } = req.body as { imageBase64: string };
  const { mimeType, roomType, renderPass, zones } = req.body as {
    mimeType: string; roomType: string;
    renderPass: string; zones: InteriorZonePayload[];
  };

  if (!imageBase64 || !zones?.length || !renderPass) {
    return res.status(400).json({ error: 'Missing imageBase64, renderPass, or zones.' });
  }

  const passConfig = PASS_CONFIGS[renderPass];
  if (!passConfig) {
    return res.status(400).json({ error: `Invalid renderPass: ${renderPass}. Must be: paint, cabinets, countertops, or flooring.` });
  }

  // Filter zones to only those relevant for this pass
  const activeZones = zones.filter(z => passConfig.categories.includes(z.category));
  if (activeZones.length === 0) {
    // No zones for this pass — return the image unchanged
    return res.json({ resultImage: `data:${mimeType || 'image/jpeg'};base64,${imageBase64}` });
  }

  try {
    imageBase64 = validateImagePayload(imageBase64, mimeType);

    let prompt = `You are a strict, precise interior material-replacement engine for a ${roomType} remodel visualization.\n\nApply ONLY these ${renderPass.toUpperCase()} changes:\n`;
    activeZones.forEach(z => {
      prompt += `• ${z.name}: ${z.brand} ${z.lineName} "${z.colorName}" — ${z.hue} (hex ref: ${z.colorHex}) [${z.materialType}]\n`;
    });
    prompt += `\nCRITICAL RULES:
1. PRESERVATION: Map new materials to the existing room geometry. DO NOT alter the structural layout, camera perspective, room dimensions, or aspect ratio.
2. NEGATIVE CONSTRAINTS: DO NOT modify ${passConfig.exclusions.join(', ')}. Leave them 100% untouched.
3. ${passConfig.preserveNote}
4. MATERIAL TEXTURE REALISM:
${passConfig.textureInstructions}
5. LIGHTING: Maintain the EXACT same light sources, shadows, window light direction, and ambient lighting from the original photo.
6. REFLECTIONS: Preserve realistic specular reflections on glossy surfaces (polished countertops, semi-gloss paint, glass).
7. PERSPECTIVE: All materials must follow the room's existing vanishing points and perspective lines.
8. PHOTOREALISM: The result must look like a professional interior design photograph. No AI artifacts, melting edges, blurriness, or surreal distortion.
9. SCALE: Material textures (plank width, tile size, cabinet panel proportions) must be correctly scaled relative to the room's geometry and camera distance.`;

    const response = await withTimeout(ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: { parts: [{ inlineData: { data: imageBase64, mimeType: mimeType || 'image/jpeg' } }, { text: prompt }] },
    }), 90_000, `interior-render-${renderPass}`);

    let resultImage: string | null = null;
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) { resultImage = `data:image/png;base64,${part.inlineData.data}`; break; }
    }
    if (!resultImage) return res.status(500).json({ error: `AI did not return an image for ${renderPass} pass. Please try again.` });
    res.json({ resultImage });
  } catch (err: unknown) {
    console.error(`[interior-render-${renderPass}] error:`, (err instanceof Error ? err.message : String(err)));
    const msg = ((err instanceof Error ? err.message : String(err)) || '').toLowerCase();
    let errorMessage = `${renderPass} render failed. Please try again.`;
    if (msg.includes('quota')) errorMessage = 'API quota exceeded.';
    else if (msg.includes('safety')) errorMessage = 'Image flagged by safety filters.';
    else if ((err instanceof Error ? err.message : String(err))) errorMessage = `Generation failed: ${err.message}`;
    res.status(500).json({ error: errorMessage });
  }
});

// ---------------------------------------------------------------------------
// POST /api/interior-quick-render
// One-shot render — all changes in a single pass (faster, lower quality).
// Body: { imageBase64, mimeType, roomType, zones }
// Returns: { resultImage: string }
// ---------------------------------------------------------------------------
app.post('/api/interior-quick-render', generationLimiter, async (req, res) => {
  let { imageBase64 } = req.body as { imageBase64: string };
  const { mimeType, roomType, zones } = req.body as {
    mimeType: string; roomType: string;
    zones: InteriorZonePayload[];
  };
  if (!imageBase64 || !zones?.length) return res.status(400).json({ error: 'Missing imageBase64 or zones.' });

  try {
    imageBase64 = validateImagePayload(imageBase64, mimeType);

    let prompt = `You are a strict, precise interior material-replacement engine. Apply ALL of the following remodel changes to this ${roomType} photograph:\n\n`;
    zones.forEach(z => {
      prompt += `• ${z.name}: ${z.brand} ${z.lineName} "${z.colorName}" — ${z.hue} (hex ref: ${z.colorHex}) [${z.materialType}]\n`;
    });
    prompt += `\nCRITICAL RULES:
1. PRESERVATION: Map new materials to existing room geometry. DO NOT alter perspective, structural layout, room dimensions, or aspect ratio.
2. NEGATIVE CONSTRAINTS: DO NOT modify appliances, plumbing fixtures, sink, faucet, toilet, window glass, light fixtures, hardware (knobs/pulls), personal items, decorations, or furniture.
3. MATERIAL REALISM:
   - Paint: subtle eggshell/satin sheen with roller-applied micro-texture
   - Cabinets: visible door panel structure, consistent grain/paint finish
   - Countertops: polished surface with realistic reflections and edge profile
   - Backsplash: individual tiles with visible grout lines at correct scale
   - Flooring: correct plank/tile width with perspective-accurate pattern
4. LIGHTING: Maintain exact same light sources, shadows, and ambient lighting.
5. REFLECTIONS: Realistic specular reflections on glossy surfaces.
6. PERSPECTIVE: All materials must follow the room's vanishing points.
7. PHOTOREALISM: Result must look like a professional interior design photo. No AI artifacts.`;

    const response = await withTimeout(ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: { parts: [{ inlineData: { data: imageBase64, mimeType: mimeType || 'image/jpeg' } }, { text: prompt }] },
    }), 90_000, 'interior-quick-render');

    let resultImage: string | null = null;
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) { resultImage = `data:image/png;base64,${part.inlineData.data}`; break; }
    }
    if (!resultImage) return res.status(500).json({ error: 'AI did not return an image. Please try again.' });
    res.json({ resultImage });
  } catch (err: unknown) {
    console.error('[interior-quick-render] error:', (err instanceof Error ? err.message : String(err)));
    const msg = ((err instanceof Error ? err.message : String(err)) || '').toLowerCase();
    let errorMessage = 'Quick render failed. Please try again.';
    if (msg.includes('quota')) errorMessage = 'API quota exceeded.';
    else if (msg.includes('safety')) errorMessage = 'Image flagged by safety filters.';
    else if ((err instanceof Error ? err.message : String(err))) errorMessage = `Generation failed: ${err.message}`;
    res.status(500).json({ error: errorMessage });
  }
});

// ---------------------------------------------------------------------------
// POST /api/paint-visualize
// Single-pass paint-only visualization for Fishers Painting.
// Body: { imageBase64, mimeType, roomType, zones }
// Returns: { resultImage: string }
// ---------------------------------------------------------------------------
interface PaintZonePayload {
  name: string;
  category: string;
  brand: string;
  lineName: string;
  colorName: string;
  colorHex: string;
  hue: string;
  swCode?: string;
  finish: string;
}

app.post('/api/paint-visualize', generationLimiter, async (req, res) => {
  let { imageBase64 } = req.body as { imageBase64: string };
  const { mimeType, roomType, zones } = req.body as {
    mimeType: string; roomType: string;
    zones: PaintZonePayload[];
  };
  if (!imageBase64 || !zones?.length) return res.status(400).json({ error: 'Missing imageBase64 or zones.' });

  try {
    imageBase64 = validateImagePayload(imageBase64, mimeType);

    let prompt = `You are a precision interior PAINT visualization engine for a professional residential painting company using Sherwin-Williams paints.\n\nApply ONLY these paint color changes to this ${roomType} photograph:\n\n`;
    zones.forEach(z => {
      prompt += `• ${z.name} (${z.category}): ${z.brand} ${z.lineName} "${z.colorName}" ${z.swCode || ''} — ${z.hue} (hex ref: ${z.colorHex}) [${z.finish}]\n`;
    });
    prompt += `\nCRITICAL RULES:
1. PAINT ONLY: You are ONLY changing paint colors on walls, accent walls, trim, and/or ceiling. NEVER modify cabinets, countertops, backsplash, flooring, furniture, appliances, fixtures, or any non-paint surface.
2. PRESERVATION: Do NOT alter the structural layout, camera perspective, room dimensions, aspect ratio, or any object placement.
3. PAINT FINISH REALISM:
   - Walls: subtle eggshell or satin sheen with roller-applied micro-texture visible in raking light
   - Trim/Baseboards: higher sheen semi-gloss finish — smooth, factory-like coat
   - Ceiling: ultra-flat finish — no sheen, diffused matte appearance
   - Accent walls: same finish as main walls but contrasting color
4. COLOR ACCURACY: The applied paint color MUST closely match the provided hex reference. Do NOT shift the hue.
5. LIGHTING: Maintain the EXACT same light sources, shadows, window light direction, and ambient lighting.
6. EDGES: Clean, precise paint boundaries at corners, trim edges, and ceiling lines. No bleeding.
7. PHOTOREALISM: The result must look like a real professional photograph of a freshly painted room.`;

    const vizPromise = withTimeout(ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: { parts: [{ inlineData: { data: imageBase64, mimeType: mimeType || 'image/jpeg' } }, { text: prompt }] },
    }), 90_000, 'paint-visualize');

    const dimPromise = withTimeout(ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [
        { inlineData: { data: imageBase64, mimeType: mimeType || 'image/jpeg' } },
        { text: 'Estimate the length, width, and height of this room in feet based on typical architectural proportions. Return JSON ONLY: { "length": 15, "width": 12, "height": 9 }' }
      ] },
    }), 15_000, 'dimension-extract').catch(e => {
      console.error('[dimension-extract] warning:', e.message);
      return null;
    });

    const [response, dimResponse] = await Promise.all([vizPromise, dimPromise]);

    let estimatedDimensions = null;
    if (dimResponse) {
      try {
        const rawText = dimResponse.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const firstBrace = cleaned.indexOf('{');
        const lastBrace = cleaned.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
          const parsed = JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
          if (parsed.length && parsed.width && parsed.height) {
            estimatedDimensions = {
              length: String(parsed.length),
              width: String(parsed.width),
              height: String(parsed.height)
            };
          }
        }
      } catch (e) {
        console.error('Failed to parse dimensions:', e);
      }
    }

    let resultImage: string | null = null;
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) { resultImage = `data:image/png;base64,${part.inlineData.data}`; break; }
    }
    if (!resultImage) return res.status(500).json({ error: 'AI did not return an image. Please try again.' });
    
    res.json({ resultImage, estimatedDimensions });
  } catch (err: unknown) {
    console.error('[paint-visualize] error:', (err instanceof Error ? err.message : String(err)));
    const msg = ((err instanceof Error ? err.message : String(err)) || '').toLowerCase();
    let errorMessage = 'Paint visualization failed. Please try again.';
    if (msg.includes('quota')) errorMessage = 'API quota exceeded.';
    else if (msg.includes('safety')) errorMessage = 'Image flagged by safety filters.';
    else if ((err instanceof Error ? err.message : String(err))) errorMessage = `Generation failed: ${err.message}`;
    res.status(500).json({ error: errorMessage });
  }
});

// ---------------------------------------------------------------------------
// POST /api/auto-mask  (adapted for interior surfaces)
// ---------------------------------------------------------------------------
app.post('/api/auto-mask', generationLimiter, async (req, res) => {
  let { imageBase64 } = req.body as { imageBase64: string };
  const { mimeType, maskTarget } = req.body as {
    mimeType: string; maskTarget: string;
  };

  if (!imageBase64 || !maskTarget) {
    return res.status(400).json({ error: 'Missing required fields: imageBase64, maskTarget.' });
  }

  try {
    imageBase64 = validateImagePayload(imageBase64, mimeType);
    const allExclusions = ['appliances', 'refrigerator', 'stove', 'oven', 'microwave', 'dishwasher', 'sink', 'faucet', 'toilet', 'window glass', 'mirror glass', 'light fixtures', 'hardware', 'furniture', 'personal items', 'towels', 'plants', 'art'];
    const targetLower = maskTarget.toLowerCase();
    const activeExclusions = allExclusions.filter(e => !targetLower.includes(e));

    const response = await withTimeout(ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType: mimeType || 'image/png' } },
          {
            text: `Create a pixel-perfect, high-contrast binary segmentation mask (black and white only) for the following interior target: "${maskTarget}".
               
CRITICAL RULES:
1. The ${maskTarget} MUST be PURE WHITE (#FFFFFF).
2. EVERYTHING ELSE MUST be PURE BLACK (#000000).
3. EXCLUDE: ${activeExclusions.join(', ')}.
4. SHARP EDGES: Crisp, sharp boundaries. NO BLUR, NO GRADIENTS, NO GRAYSCALE.
5. ACCURACY: Follow the architectural lines and material boundaries precisely.
6. OUTPUT: Return only a flat, 2D black and white mask image.`,
          },
        ],
      },
    }), 90_000, 'auto-mask');

    let maskBase64 = '';
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        maskBase64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!maskBase64) return res.status(500).json({ error: 'No mask was generated.' });
    res.json({ maskBase64 });
  } catch (err: unknown) {
    console.error('[auto-mask] error:', (err instanceof Error ? err.message : String(err)));
    res.status(500).json({ error: (err instanceof Error ? err.message : String(err)) || 'Auto-mask generation failed.' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/enhance-image — AI Image Optimizer (reused from exterior)
// ---------------------------------------------------------------------------
app.post('/api/enhance-image', generationLimiter, async (req, res) => {
  let { imageBase64 } = req.body as { imageBase64: string };
  const { mimeType = 'image/jpeg' } = req.body as {
    mimeType?: string;
  };

  if (!imageBase64) return res.status(400).json({ error: 'imageBase64 is required' });

  try {
    imageBase64 = validateImagePayload(imageBase64, mimeType);
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: [{
        role: 'user',
        parts: [
          { inlineData: { mimeType, data: imageBase64 } },
          {
            text: `You are an image preparation specialist for a residential INTERIOR remodel visualizer. Transform this room photo to be OPTIMAL for AI-powered material replacement.

REMOVE these elements completely (fill with realistic background):
- People and pets
- Temporary clutter on countertops (dishes, food, mail)
- Personal photos or identifiable items

STRICTLY PRESERVE unchanged:
- All cabinet doors, drawers, and layout
- All countertop surfaces and edges
- All tile/backsplash surfaces
- All flooring area and pattern
- Windows, doors, and trim
- Appliances (refrigerator, stove, microwave, dishwasher)
- Plumbing fixtures (sink, faucet)
- Light fixtures
- Room proportions and perspective

OPTIMIZE:
- Brightness: surfaces clearly visible, not overexposed
- Contrast: slightly increased to show material textures
- Colors: accurate, neutral — no artistic filters
- Sharpness: crisp enough to show surface detail

Output a single photorealistic, clean, well-lit interior room photo optimized for AI material visualization.`,
          },
        ],
      }],
      config: { responseModalities: ['IMAGE', 'TEXT'], temperature: 0.2 },
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    let enhancedBase64: string | null = null;
    let outMime = 'image/png';

    for (const part of parts) {
      const partRecord = part as Record<string, unknown>;
      if (partRecord.inlineData) {
        const id = partRecord.inlineData as Record<string, string>;
        if (id.data) {
          enhancedBase64 = id.data;
          outMime = id.mimeType ?? 'image/png';
          break;
        }
      }
    }

    if (!enhancedBase64) return res.status(500).json({ error: 'No enhanced image returned. Try a different photo.' });
    res.json({ enhancedImageBase64: enhancedBase64, mimeType: outMime });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('enhance-image error:', msg);
    res.status(500).json({ error: msg });
  }
});

// ---------------------------------------------------------------------------
// POST /api/quote-request — Lead capture for interior remodel
// ---------------------------------------------------------------------------
app.post('/api/quote-request', standardLimiter, async (req, res) => {
  const { name, email, phone, address, zipCode, contactTime, projectTimeline, notes, roomType, zones, visualizationImage } =
    req.body as {
      name: string; email: string; phone: string; address: string; zipCode: string;
      contactTime: string; projectTimeline: string; notes: string;
      roomType: string;
      zones: { name: string; category: string; brand: string; lineName: string; colorName: string; colorHex: string }[];
      visualizationImage?: string;
    };

  if (!name || !email || !phone || !address || !zipCode) {
    return res.status(422).json({ error: 'Please fill in all required fields.' });
  }

  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'short' });

  console.log(`[quote-request] New lead: ${name} <${email}> ${phone} — ${address} ${zipCode} — ${roomType} — ${zones.length} zones`);
  res.json({ success: true });

  // Email in background (if configured)
  if (gmailTransport) {
    const FROM = `"Fishers Painting Visualizer" <${process.env.GMAIL_USER}>`;
    const leadRecipients = process.env.LEAD_EMAIL
      ? process.env.LEAD_EMAIL.split(',')
      : [];

    if (leadRecipients.length === 0) {
      console.warn('[quote-request] No LEAD_EMAIL configured — skipping lead notification');
      return;
    }

    const zonesHtml = zones.map(z => `
      <tr><td style="padding:6px 0;color:#64748B;width:140px">${z.name}</td>
        <td><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${z.colorHex};vertical-align:middle;margin-right:6px"></span>
        <strong>${z.lineName}</strong> — ${z.colorName}</td></tr>
    `).join('');

    const attachments: { filename: string; content: Buffer }[] = [];
    if (visualizationImage) {
      try {
        const rawBase64 = visualizationImage.includes(',') ? visualizationImage.split(',')[1] : visualizationImage;
        attachments.push({
          filename: `${name.replace(/\s+/g, '-')}-remodel-visualization.png`,
          content: Buffer.from(rawBase64, 'base64'),
        });
      } catch { /* skip */ }
    }

    gmailTransport.sendMail({
      from: FROM,
      to: leadRecipients.join(', '),
      subject: `🏠 New Remodel Quote — ${name} — ${roomType} (${zones.length} surfaces)`,
      html: `<html><body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif">
<div style="max-width:620px;margin:24px auto">
  <div style="background:#0F172A;padding:24px 28px;border-radius:12px 12px 0 0">
    <div style="color:#60A5FA;font-size:18px;font-weight:bold;letter-spacing:2px">BLUEPRINT PAINTING</div>
    <div style="color:#94A3B8;font-size:13px;margin-top:4px">New Interior Remodel Lead</div>
  </div>
  <div style="background:white;padding:28px;border:1px solid #E2E8F0;border-top:0">
    <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:14px;margin-bottom:22px">
      <strong style="color:#C2410C">🔔 New ${roomType} Remodel Request</strong>
      <p style="margin:6px 0 0;color:#9A3412;font-size:14px">A homeowner completed a visualization and requested an estimate.</p>
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:22px">
      <tr><td style="padding:6px 0;color:#64748B;width:140px">Name</td><td><strong>${name}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#64748B">Email</td><td><a href="mailto:${email}" style="color:#3B82F6">${email}</a></td></tr>
      <tr><td style="padding:6px 0;color:#64748B">Phone</td><td><a href="tel:${phone}" style="color:#3B82F6">${phone}</a></td></tr>
      <tr><td style="padding:6px 0;color:#64748B">Address</td><td>${address}, ${zipCode}</td></tr>
      <tr><td style="padding:6px 0;color:#64748B">Best Time</td><td>${contactTime}</td></tr>
      <tr><td style="padding:6px 0;color:#64748B">Timeline</td><td>${projectTimeline}</td></tr>
    </table>
    ${notes ? `<div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:6px;padding:12px;margin-bottom:22px;font-style:italic">"${notes}"</div>` : ''}
    <h3 style="color:#1E293B;font-size:14px;text-transform:uppercase;letter-spacing:1px">Visualized Design — ${roomType}</h3>
    <table style="width:100%;border-collapse:collapse">${zonesHtml}</table>
  </div>
  <div style="background:#0F172A;padding:14px 28px;border-radius:0 0 12px 12px;text-align:center;color:#475569;font-size:11px">
    <p style="margin:0">Submitted via Fishers Painting · ${timestamp}</p>
  </div>
</div></body></html>`,
      attachments,
    }).then(() => console.log(`[quote-request] Lead email sent for ${email}`))
      .catch((err: unknown) => console.error('[quote-request] Email error:', (err instanceof Error ? err.message : String(err))));
  }
});

// ---------------------------------------------------------------------------
// GET /api/ping — health check / keep-alive
// ---------------------------------------------------------------------------
app.get('/api/ping', (_req, res) => {
  res.json({ status: 'ok', uptime: Math.round(process.uptime()), ts: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Gmail transport (optional)
// ---------------------------------------------------------------------------
const gmailTransport = (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    })
  : null;
if (!gmailTransport) console.warn('⚠️  GMAIL_USER/GMAIL_APP_PASSWORD not set — emails will be skipped.');

// ---------------------------------------------------------------------------
// Static files in production
// ---------------------------------------------------------------------------
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.use((_req, response) => {
    response.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

function startServer(port: number, retries = 3) {
  const server = app.listen(port, () => {
    console.log(`✅  Fishers Painting API → http://localhost:${port}`);
    const selfUrl = process.env.RENDER_EXTERNAL_URL;
    if (selfUrl) {
      setInterval(() => {
        fetch(`${selfUrl}/api/ping`)
          .then(() => console.log('🏓 keep-alive ping'))
          .catch((e) => console.warn('keep-alive failed:', e.message));
      }, 14 * 60 * 1000);
    }
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE' && retries > 0) {
      console.warn(`⚠️  Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1, retries - 1);
    } else {
      console.error(`❌  Failed to start server:`, err.message);
      process.exit(1);
    }
  });
}

export { app };

if (!process.env.NETLIFY) {
  startServer(PORT);
}
