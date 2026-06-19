import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverPath = path.resolve(__dirname, '../server.ts');

let content = fs.readFileSync(serverPath, 'utf8');

content = content.replace(
  /if \(roughSizeBytes > 20 \* 1024 \* 1024\) throw new Error\('Image exceeds 20MB safety limit'\);\n}/g,
  "if (roughSizeBytes > 20 * 1024 * 1024) throw new Error('Image exceeds 20MB safety limit');\n\n  return rawBase64;\n}"
);

content = content.replace(/const { imageBase64/g, 'let { imageBase64');
content = content.replace(/validateImagePayload\(imageBase64, mimeType\);/g, 'imageBase64 = validateImagePayload(imageBase64, mimeType);');

fs.writeFileSync(serverPath, content, 'utf8');
console.log('Fixed server.ts');
