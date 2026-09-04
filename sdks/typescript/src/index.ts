import { createDeckClient, type DeckClient } from './client.js';
import { nodeRuntime } from './node-runtime.js';
import type { CreateDeckOptions } from './types.js';

export * from './client.js';
export { generateAuthUuid, isValidAuthUuid, resolveAuthUuid } from './auth-uuid.js';

/** Node entry point: supports local paths and persistent UUID files. */
export function createDeck(options: CreateDeckOptions = {}): DeckClient {
  return createDeckClient(options, nodeRuntime);
}
