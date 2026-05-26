const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf-8');

// Replace `let parsed: any;`
content = content.replace('let parsed: any;', 'let parsed: Record<string, unknown>;');

// Replace `catch (err: any) {` with `catch (err: unknown) {`
content = content.replace(/catch \(err: any\) \{/g, 'catch (err: unknown) {');

// We also need to fix `err?.message` since `err: unknown` doesn't have `message`.
// To do this simply, we will find `err?.message` inside the catch blocks and replace it with `(err instanceof Error ? err.message : String(err))`
// But it's easier to just do `const errMsg = err instanceof Error ? err.message : String(err);`
// Let's replace `err?.message` with `(err instanceof Error ? err.message : String(err))`
content = content.replace(/err\?\.message/g, '(err instanceof Error ? err.message : undefined)');
content = content.replace(/err\.message/g, '(err instanceof Error ? err.message : String(err))');
// The double replace above might be messy. Let's refine:
// First, revert the err.message
content = fs.readFileSync('server.ts', 'utf-8');
content = content.replace('let parsed: any;', 'let parsed: Record<string, unknown>;');
content = content.replace(/catch \(err: any\) \{/g, 'catch (err: unknown) {');
content = content.replace(/err\?\.message/g, '(err instanceof Error ? err.message : String(err))');

// For the one with `(part as any)`, let's change to `(part as Record<string, unknown>)`
content = content.replace(/\(part as any\)\.inlineData/g, '((part as Record<string, any>).inlineData as any)');

fs.writeFileSync('server.ts', content);
