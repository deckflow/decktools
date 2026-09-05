**Idiomas:** [English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [Français](README.fr.md) | **Español** | [Русский](README.ru.md) | [日本語](README.ja.md)

# DeckTools

DeckTools es un monorepo pnpm para la automatización de tareas de Deckflow.

## Paquetes

- `sdks/typescript` - `@decktools/sdk`, un SDK TypeScript compatible con Node.js y navegador para subida de archivos y APIs de tareas.
- `apps/node-cli` - `decktools`, la CLI de Node.js. Consulte [apps/node-cli/README.es.md](apps/node-cli/README.es.md) para su uso.

## Instalación y compilación

```bash
pnpm install
pnpm build
pnpm typecheck
pnpm test
```

## CLI

Consulte [apps/node-cli/README.es.md](apps/node-cli/README.es.md) para la documentación completa del CLI (instalación, configuración y todos los comandos con ejemplos).

Compilar y ejecutar localmente:

```bash
pnpm --filter decktools build
node apps/node-cli/dist/cli.js --help
```

Inicio rápido:

```bash
decktools login
decktools config show
decktools convert slides.pptx --to pdf
```

## SDK

Consulte [sdks/typescript/README.es.md](sdks/typescript/README.es.md) para la API de `@decktools/sdk`.

Ejemplo básico:

```ts
import { createDeck } from '@decktools/sdk';

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

## Notas del workspace

- `root` en `createDeck({ root })` es la dirección raíz de la API y por defecto es `https://app.deckflow.com/v1`.
- `token` se envía como `X-Auth-Token`.
- `apiKey` se envía como `Authorization: Bearer {apiKey}`.
- En el futuro se podrán añadir SDKs en `sdks/go`, `sdks/python`, `sdks/java` o `sdks/rust`.
