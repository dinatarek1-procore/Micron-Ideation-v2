#!/usr/bin/env node
/**
 * Idempotent project bootstrap: Yarn immutable-install guard, safe .npmrc,
 * and .gitignore (npm strips .gitignore from published packages, so it ships as a template).
 * Shipped with the scaffold — run `npm run setup` (or `node scripts/setup.cjs`) before install.
 * Keep templates in this folder in sync with the simulator's generateRegistryConfig (same files).
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const scriptDir = __dirname;
const npmrcTemplate = path.join(scriptDir, 'npmrc.template');
const yarnrcTemplate = path.join(scriptDir, 'yarnrc.template');
const gitignoreTemplate = path.join(scriptDir, 'gitignore.template');

function read(p) {
  return fs.readFileSync(p, 'utf8');
}

function write(p, body) {
  fs.writeFileSync(p, body, 'utf8');
}

function ensureYarnrcImmutableFlag() {
  const yarnrcPath = path.join(root, '.yarnrc.yml');
  if (!fs.existsSync(yarnrcPath)) {
    if (fs.existsSync(yarnrcTemplate)) {
      write(yarnrcPath, read(yarnrcTemplate));
      console.log('[setup] Wrote .yarnrc.yml from yarnrc.template.');
    } else {
      console.warn(
        '[setup] No .yarnrc.yml and no yarnrc.template — run doctor --fix or reinstall scaffold.'
      );
    }
    return;
  }
  let y = read(yarnrcPath);
  if (!/(^|\n)enableImmutableInstalls:\s*false/.test(y)) {
    y = `enableImmutableInstalls: false\n\n${y}`;
    write(yarnrcPath, y);
    console.log(
      '[setup] Prepended enableImmutableInstalls: false to .yarnrc.yml.'
    );
  }
}

function ensureSafeNpmrc() {
  if (!fs.existsSync(npmrcTemplate)) return;
  const npmPath = path.join(root, '.npmrc');
  const template = read(npmrcTemplate);
  if (!fs.existsSync(npmPath)) {
    write(npmPath, template);
    console.log('[setup] Wrote .npmrc from npmrc.template.');
    return;
  }
  const n = read(npmPath);
  // Legacy scaffolds shipped literal INSERT_* / YOUR_ARTIFACTORY_TOKEN as auth (E401).
  if (/INSERT_|YOUR_ARTIFACTORY_TOKEN/.test(n)) {
    write(npmPath, template);
    console.log(
      '[setup] Replaced .npmrc with npmrc.template (removed placeholder auth that causes E401).'
    );
  }
}

function ensureGitignore() {
  if (!fs.existsSync(gitignoreTemplate)) return;
  const dest = path.join(root, '.gitignore');
  if (!fs.existsSync(dest)) {
    write(dest, read(gitignoreTemplate));
    console.log('[setup] Wrote .gitignore from gitignore.template.');
  }
}

function main() {
  console.log('[setup] Normalizing package-manager files in', root);
  ensureYarnrcImmutableFlag();
  ensureSafeNpmrc();
  ensureGitignore();
  console.log(
    '[setup] Done. Next: npm install --legacy-peer-deps (or yarn install / pnpm install). If YN0082, use Artifactory Set Me Up + yarn config set -H npmRegistries… (see package README)'
  );
}

main();
