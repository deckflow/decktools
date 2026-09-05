**Языки:** [English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [Français](README.fr.md) | [Español](README.es.md) | **Русский** | [日本語](README.ja.md)

# DeckTools

DeckTools — это pnpm monorepo для автоматизации задач Deckflow.

## Пакеты

- `sdks/typescript` — `@decktools/sdk`, TypeScript SDK для Node.js и браузера для загрузки файлов и API задач.
- `apps/node-cli` — `decktools`, CLI для Node.js. См. [apps/node-cli/README.ru.md](apps/node-cli/README.ru.md).

## Установка и сборка

```bash
pnpm install
pnpm build
pnpm typecheck
pnpm test
```

## CLI

Полная документация CLI (установка, конфигурация и все команды с примерами) — в [apps/node-cli/README.ru.md](apps/node-cli/README.ru.md).

Сборка и локальный запуск:

```bash
pnpm --filter decktools build
node apps/node-cli/dist/cli.js --help
```

Быстрый старт:

```bash
decktools login
decktools config show
decktools convert slides.pptx --to pdf
```

## SDK

API `@decktools/sdk` описан в [sdks/typescript/README.ru.md](sdks/typescript/README.ru.md).

Базовый пример:

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

## Примечания по workspace

- `root` в `createDeck({ root })` — корневой адрес API, по умолчанию `https://app.deckflow.com/v1`.
- `token` передаётся в заголовке `X-Auth-Token`.
- `apiKey` передаётся как `Authorization: Bearer {apiKey}`.
- В будущем SDK можно добавить в `sdks/go`, `sdks/python`, `sdks/java` или `sdks/rust`.
