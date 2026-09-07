**語言：** [English](README.md) | [简体中文](README.zh-CN.md) | **繁體中文** | [Français](README.fr.md) | [Español](README.es.md) | [Русский](README.ru.md) | [日本語](README.ja.md)

# DeckTools

DeckTools 是一個用於 Deckflow 任務自動化的 pnpm monorepo。

## 套件

- `sdks/typescript` - `@deckflow/decktools-sdk`，用於檔案上傳與任務 API 的 TypeScript SDK，相容 Node.js 與瀏覽器。
- `apps/node-cli` - `decktools`，Node.js 命令列工具。用法見 [apps/node-cli/README.zh-TW.md](apps/node-cli/README.zh-TW.md)。

## 安裝與建置

```bash
pnpm install
pnpm build
pnpm typecheck
pnpm test
```

## CLI

完整 CLI 文件（安裝、設定及所有命令範例）見 [apps/node-cli/README.zh-TW.md](apps/node-cli/README.zh-TW.md)。

本地建置與執行：

```bash
pnpm --filter decktools build
node apps/node-cli/dist/cli.js --help
```

快速開始：

```bash
decktools login
decktools config show
decktools convert slides.pptx --to pdf
```

## SDK

`@deckflow/decktools-sdk` API 見 [sdks/typescript/README.zh-TW.md](sdks/typescript/README.zh-TW.md)。

基本範例：

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

## 工作區說明

- `createDeck({ root })` 中的 `root` 為 API 根位址，預設為 `https://app.deckflow.com/v1`。
- `token` 透過 `X-Auth-Token` 標頭傳送。
- `apiKey` 透過 `Authorization: Bearer {apiKey}` 標頭傳送。
- 後續可在 `sdks/go`、`sdks/python`、`sdks/java` 或 `sdks/rust` 下新增更多 SDK。
