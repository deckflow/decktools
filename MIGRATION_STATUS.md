# DeckTools 迁移候选

更新：2026-09-05。源码已准备并验证，**未发布、未改远端仓库名、未移动本地目录、未切换真实消费者**。

- 分支：`codex/decktools-migration`；基线：`4a5f70677d6cb7cd5e95ee6a89a88adf942687b0`，原默认分支是 `master`，不是无关历史的 `origin/main`。
- 新 CLI/SDK：`decktools@1.0.0`、`@decktools/sdk@1.0.0`；仅 `decktools` binary。SDK 保留独立 Node 和 `@decktools/sdk/browser` 入口。不再回退 `DECKOPS_*`。
- Go module：`github.com/deckflow/decktools/sdks/go`；Python：发行名 `decktools-sdk`、import `decktools`。release/installer 名称已更新。
- 共享凭据与 UUID 只跟随 `DECKFLOW_CONFIG_DIR`，默认 `~/.deckflow/credentials` / `auth-uuid`。Node CLI 产品配置为 `~/.deckflow/decktools/config.json`，`DECKTOOLS_CONFIG_DIR` 只覆盖产品目录；不会因改名建立新的身份。
- 环境变量优先级：产品 `DECKTOOLS_*` → 共享 `DECKFLOW_*` → 存储值；运行时环境凭据不回写共享文件。Go CLI 没有新增产品偏好设置功能，继续只管理共享鉴权字段，并保留其他产品字段。
- 当前验证：`pnpm release:check` 通过（SDK 82、CLI 49）；Go SDK/CLI 测试通过；Python 26 个测试通过。真实云端 conformance 尚未执行。

当前 npm 登录检查 E401。恢复后先核实新名称、发布权限和版本，review/合并至正确默认分支；旧 GitHub 仓库更名为 `deckflow/decktools` 并更新 remote 后，按 SDK → CLI 顺序发布并验证真实安装。候选已是 1.0.0，不要在首次发布时无意执行额外版本 bump。Go/Python 发布需分别验证各通道权限。

新包可用后才移动旧本地目录和切换 deckrender、deckhtml、hyperdeck/deckhtml 的真实依赖及 lockfile，并让出旧 `deckops` 命令。DeckRender 需要移除旧 SDK Browser 源码改写脚本及相关单测、使用正式 Browser export，并清理旧工具配置 fallback。消费者临时副本的预检不等同于真实安装/部署已完成。

当前 DeckParse 的解耦已完成，新 DeckOps 不依赖本仓。名称交接之后再发布/安装新 DeckOps，并最后移动其本地目录；不得提前把两个项目放到同一路径或让同一 CLI 名指向两个产品。
