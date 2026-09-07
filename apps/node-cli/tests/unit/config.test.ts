/**
 * Unit tests for Config module
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { Config } from '../../src/core/config.js';

describe('Config', () => {
  let tempDir: string;
  let config: Config;

  beforeEach(async () => {
    // Create a temporary directory for each test
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test-config-'));
    config = new Config(tempDir);
    await config.load();
  });

  afterEach(async () => {
    vi.unstubAllEnvs();
    // Clean up temporary directory
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('should create empty config', () => {
    expect(config.token).toBeUndefined();
    expect(config.spaceId).toBeUndefined();
  });

  it('should set and get token', async () => {
    await config.setToken('test-token-123');
    expect(config.token).toBe('test-token-123');

    // Reload to verify persistence
    const config2 = new Config(tempDir);
    await config2.load();
    expect(config2.token).toBe('test-token-123');
  });

  it('should have undefined spaceId by default', () => {
    expect(config.spaceId).toBeUndefined();
  });

  it('should set and get space ID', async () => {
    await config.setSpaceId('space-abc');
    expect(config.spaceId).toBe('space-abc');
  });

  it('should have API base default value', () => {
    expect(config.apiBase).toBe('https://app.deckflow.com/v1');
  });

  it('should set custom API base', async () => {
    await config.setApiBase('https://example.com/api');
    expect(config.apiBase).toBe('https://example.com/api');
  });

  it('should check if configured', async () => {
    expect(config.isConfigured()).toBe(false);

    await config.setToken('token');
    expect(config.isConfigured()).toBe(true);
    expect(config.spaceId).toBeUndefined();
  });

  it('should delete config key', async () => {
    await config.set('token', 'test-value');
    expect(config.get('token')).toBe('test-value');

    await config.delete('token');
    expect(config.get('token')).toBeUndefined();
  });

  it('should get all config', async () => {
    config.token = 'token';
    config.spaceId = 'space';
    await config.save();

    const allConfig = config.all();
    expect(allConfig.token).toBe('token');
    expect(allConfig.spaceId).toBe('space');
  });

  it('should persist to credentials and preserve shared deckhtml keys', async () => {
    await fs.writeFile(
      path.join(tempDir, 'credentials'),
      JSON.stringify(
        {
          apiKey: 'key-from-deckhtml',
          webhook: 'https://example.com/hook',
          retentionHours: 3,
        },
        null,
        2
      ) + '\n',
      'utf-8'
    );

    await config.load();
    expect(config.apiKey).toBe('key-from-deckhtml');
    expect(config.webhook).toBe('https://example.com/hook');
    expect(config.retentionHours).toBe(3);

    await config.setToken('shared-token');

    const raw = JSON.parse(await fs.readFile(path.join(tempDir, 'credentials'), 'utf-8')) as Record<
      string,
      unknown
    >;
    expect(raw.token).toBe('shared-token');
    expect(raw.apiKey).toBe('key-from-deckhtml');
    expect(raw.webhook).toBe('https://example.com/hook');
    expect(raw.retentionHours).toBe(3);
  });

  it('should treat apiKey as configured', async () => {
    expect(config.isConfigured()).toBe(false);
    await config.setApiKey('key-1');
    expect(config.isConfigured()).toBe(true);
  });

  it('keeps product settings separate from shared identity and ignores the old namespace', async () => {
    const product = path.join(tempDir, 'product');
    vi.stubEnv('DECKFLOW_CONFIG_DIR', tempDir);
    vi.stubEnv('DECKTOOLS_CONFIG_DIR', product);
    vi.stubEnv('DECKOPS_CONFIG_DIR', path.join(tempDir, 'old'));
    vi.stubEnv('DECKOPS_TOKEN', 'must-not-read');
    vi.stubEnv('DECKTOOLS_TOKEN', ''); vi.stubEnv('DECKFLOW_TOKEN', '');
    const migrated = new Config(); await migrated.load();
    expect(migrated.configFilePath).toBe(path.join(tempDir, 'credentials'));
    expect(migrated.token).toBeUndefined();
    await migrated.set('webhook', 'https://example.test/tools');
    const next = new Config(); await next.load();
    expect(next.webhook).toBe('https://example.test/tools');
    expect(JSON.parse(await fs.readFile(path.join(product, 'config.json'), 'utf8'))).toEqual({ webhook: 'https://example.test/tools' });
    expect(JSON.parse(await fs.readFile(path.join(tempDir, 'credentials'), 'utf8')).webhook).toBeUndefined();
    vi.stubEnv('DECKFLOW_TOKEN', 'shared-env'); vi.stubEnv('DECKTOOLS_TOKEN', 'tools-env');
    expect(next.token).toBe('tools-env');
    await next.setSpaceId('new-space');
    expect(JSON.parse(await fs.readFile(path.join(tempDir, 'credentials'), 'utf8')).token).toBeUndefined();
  });

  it('preserves unknown shared credential fields when updating authentication', async () => {
    await fs.writeFile(path.join(tempDir, 'credentials'), JSON.stringify({ custom: { untouched: true } }));
    await config.setToken('updated');
    const raw = JSON.parse(await fs.readFile(path.join(tempDir, 'credentials'), 'utf8'));
    expect(raw.custom).toEqual({ untouched: true });
    expect((await fs.stat(path.join(tempDir, 'credentials'))).mode & 0o777).toBe(0o600);
  });

  it('never overwrites malformed shared configuration', async () => {
    const file = path.join(tempDir, 'credentials');
    await fs.writeFile(file, '{broken');
    await expect(config.setToken('updated')).rejects.toThrow();
    expect(await fs.readFile(file, 'utf8')).toBe('{broken');
  });

  it('validates product configuration before changing shared credentials', async () => {
    const file = path.join(tempDir, 'credentials');
    await fs.writeFile(file, '{"token":"original"}');
    await fs.mkdir(path.join(tempDir, 'decktools'), { recursive: true });
    await fs.writeFile(path.join(tempDir, 'decktools/config.json'), 'null');
    await config.load();
    config.token = 'not-written';
    await expect(config.set('webhook', 'https://example.test')).rejects.toThrow('Invalid configuration object');
    expect(await fs.readFile(file, 'utf8')).toBe('{"token":"original"}');
  });
});
