**语言：** [English](README.md) | **简体中文** | [繁體中文](README.zh-TW.md) | [Français](README.fr.md) | [Español](README.es.md) | [Русский](README.ru.md) | [日本語](README.ja.md)

# DeckTools

DeckTools 是一个用于 Deckflow 任务自动化的 pnpm monorepo。

## 包

- `sdks/typescript` - `@deckflow/decktools-sdk`，用于文件上传与任务 API 的 TypeScript SDK，兼容 Node.js 和浏览器。
- `apps/node-cli` - `decktools`，Node.js 命令行工具。用法见 [apps/node-cli/README.zh-CN.md](apps/node-cli/README.zh-CN.md)。

## 安装与构建

```bash
pnpm install
pnpm build
pnpm typecheck
pnpm test
```

## CLI

完整 CLI 文档（安装、配置及所有命令示例）见 [apps/node-cli/README.zh-CN.md](apps/node-cli/README.zh-CN.md)。

本地构建与运行：

```bash
pnpm --filter decktools build
node apps/node-cli/dist/cli.js --help
```

快速开始：

```bash
decktools login
decktools config show
decktools convert slides.pptx --to pdf
```

## SDK

`@deckflow/decktools-sdk` API 见 [sdks/typescript/README.zh-CN.md](sdks/typescript/README.zh-CN.md)。

基本示例：

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

## 工作区说明

- `createDeck({ root })` 中的 `root` 为 API 根地址，默认为 `https://app.deckflow.com/v1`。
- `token` 通过 `X-Auth-Token` 头发送。
- `apiKey` 通过 `Authorization: Bearer {apiKey}` 头发送。
- 后续可在 `sdks/go`、`sdks/python`、`sdks/java` 或 `sdks/rust` 下添加更多 SDK。
