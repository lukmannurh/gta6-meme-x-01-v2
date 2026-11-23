// gta6-meme-x-01 v2 entry (Node 22, standard library only).
// The entry is the X post itself: this program only hands POST.json to the
// gate at /output/POST.json. The gate reads the post from X (its first
// picture and its text) and the judge scores that dossier.
//
// Run outside the grader container with:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const raw = JSON.parse(readFileSync(join(botDir, 'POST.json'), 'utf8')) as {
  url?: unknown;
};
const postUrl = String(raw.url ?? '');
const looksReal = /^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+$/.test(postUrl);
if (!looksReal) {
  console.error('POST.json must name a real post: https://x.com/<handle>/status/<id>.');
  process.exit(1);
}

const postId = postUrl.match(/\/status\/(\d+)$/)?.[1] ?? '';
console.log(`Post id: ${postId}`);
mkdirSync(outDir, { recursive: true });
copyFileSync(join(botDir, 'POST.json'), join(outDir, 'POST.json'));
console.log(`Post handed to the gate: ${postUrl}`);
