#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const GITHUB_REGISTRY = 'https://npm.pkg.github.com';

const PACKAGE_JSONS = [
  'sdks/typescript/package.json',
  'apps/node-cli/package.json',
];

const args = process.argv.slice(2);
const github = args.includes('--github');

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: root });
}

function readPackage(relativePath) {
  const fullPath = join(root, relativePath);
  return {
    fullPath,
    data: JSON.parse(readFileSync(fullPath, 'utf8')),
  };
}

function writePackage(fullPath, data) {
  writeFileSync(fullPath, `${JSON.stringify(data, null, 2)}\n`);
}

function withGithubPublishConfig(fn) {
  const backups = PACKAGE_JSONS.map((relativePath) => {
    const { fullPath, data } = readPackage(relativePath);
    return { fullPath, data };
  });

  try {
    for (const { fullPath, data } of backups) {
      const next = structuredClone(data);
      next.publishConfig = {
        ...next.publishConfig,
        registry: GITHUB_REGISTRY,
      };
      writePackage(fullPath, next);
    }
    fn();
  } finally {
    for (const { fullPath, data } of backups) {
      writePackage(fullPath, data);
    }
  }
}

function publishPackages() {
  run('pnpm release:sdk');
  run('pnpm release:cli');
}

console.log(
  github
    ? `Releasing to GitHub Packages (${GITHUB_REGISTRY})`
    : 'Releasing to npm (registry.npmjs.org)',
);

run('pnpm release:check');
run(github ? 'pnpm release:bump -- --github' : 'pnpm release:bump');

if (github) {
  withGithubPublishConfig(publishPackages);
} else {
  publishPackages();
}

console.log('Release complete.');
