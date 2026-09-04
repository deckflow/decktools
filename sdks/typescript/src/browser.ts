import { createDeckClient, type DeckClient } from './client.js';
import { resolveAuthUuid } from './browser-auth-uuid.js';
import type { CreateDeckOptions } from './types.js';

export * from './client.js';
export { generateAuthUuid, isValidAuthUuid, resolveAuthUuid } from './browser-auth-uuid.js';

/** Browser entry point. Auth failures and uncertain task submissions are never silently replayed. */
export function createDeck(options: CreateDeckOptions = {}): DeckClient {
  return createDeckClient(
    { allowGuestFallback: false, retryMutations: false, ...options },
    { resolveAuthUuid, useFetchStreams: true }
  );
}
