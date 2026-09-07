**Langues :** [English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | **Français** | [Español](README.es.md) | [Русский](README.ru.md) | [日本語](README.ja.md)

# DeckTools

DeckTools est un monorepo pnpm pour l'automatisation des tâches Deckflow.

## Packages

- `sdks/typescript` - `@deckflow/decktools-sdk`, un SDK TypeScript compatible Node.js et navigateur pour l'upload de fichiers et les API de tâches.
- `apps/node-cli` - `decktools`, l'interface en ligne de commande Node.js. Voir [apps/node-cli/README.fr.md](apps/node-cli/README.fr.md) pour l'utilisation.

## Installation et build

```bash
pnpm install
pnpm build
pnpm typecheck
pnpm test
```

## CLI

Voir [apps/node-cli/README.fr.md](apps/node-cli/README.fr.md) pour la documentation complète du CLI (installation, configuration et toutes les commandes avec exemples).

Build et exécution en local :

```bash
pnpm --filter decktools build
node apps/node-cli/dist/cli.js --help
```

Démarrage rapide :

```bash
decktools login
decktools config show
decktools convert slides.pptx --to pdf
```

## SDK

Voir [sdks/typescript/README.fr.md](sdks/typescript/README.fr.md) pour l'API `@deckflow/decktools-sdk`.

Exemple de base :

```ts
import { createDeck } from '@deckflow/decktools-sdk';

const deck = createDeck({
  token: process.env.DECKTOOLS_TOKEN,
  spaceId: process.env.DECKTOOLS_SPACE_ID,
});

const task = await deck.convertPptToPdf({
  files: ['./slides.pptx'],
  name: 'slides',
});

const done = await deck.tasks.wait(task.id);
console.log(done.result);
```

## Notes sur l'espace de travail

- `root` dans `createDeck({ root })` est l'adresse racine de l'API et vaut par défaut `https://app.deckflow.com/v1`.
- `token` est envoyé via l'en-tête `X-Auth-Token`.
- `apiKey` est envoyé via `Authorization: Bearer {apiKey}`.
- D'autres SDK pourront être ajoutés sous `sdks/go`, `sdks/python`, `sdks/java` ou `sdks/rust`.
