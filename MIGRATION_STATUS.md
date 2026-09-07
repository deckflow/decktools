# DeckTools 迁移交付

更新：2026-09-07。原 DeckOps 已更名为 DeckTools，源码合入原默认分支 master 并 push；不要合入历史无关的 origin/main。

## 已切换

- GitHub：deckflow/decktools；repository ID 1196979645 不变。
- 本地：/Volumes/workspace/caixuan/decktools。
- npm SDK：@deckflow/decktools-sdk@1.0.0（用户确认使用 deckflow 组织）。
- npm CLI：decktools@1.0.0，只提供 decktools binary；已真实 registry 安装，版本验证通过。
- Node / Browser SDK 分别提供 root 与 /browser 入口；不再回退 DECKOPS_*。
- DeckRender 0.4.1、DeckHTML 0.6.5 已更新真实 manifest / lockfile / import、提交至 main 并发布；hyperdeck/deckhtml 已 fast-forward 同步。DeckRender 删除旧 Browser 改写桥及旧工具配置 fallback。
- 新 DeckOps（原 DeckParse）已完全内聚自身所需代码，不依赖本仓、SDK、CLI 或任何新增共享客户端包。
- 原 deckops 命令已让给新解析产品，本机新工具入口为 /Users/fei/.local/bin/decktools。

## 验证与配置

- SDK 82 + Node CLI 51 测试通过；Go SDK / CLI 测试通过；Python 26 测试通过。
- review 修复了损坏配置 JSON 被覆盖的问题，验证失败时不修改任何配置文件。
- 共享 credentials / auth-uuid 仅跟随 DECKFLOW_CONFIG_DIR，默认 ~/.deckflow；产品目录 ~/.deckflow/decktools/config.json 独立，DECKTOOLS_CONFIG_DIR 不移动身份。
- DECKTOOLS_* → DECKFLOW_* → 存储值；运行时环境凭据不回写共享文件。Go CLI 保持只管理共享鉴权字段并保留未知字段。
- 一次性真实配置迁移只补缺失 apiBase，旧文件、所有已有目标字段和 UUID 保持原值，重复迁移无变化。
- 原 Python deckops 软链接保留在 /Users/fei/.local/bin/deckops.legacy-20260907，原 PDF-CLI/.venv 未修改。

## 其他语言分发

- Go SDK：github.com/deckflow/decktools/sdks/go@v1.0.0；远端模块下载验证通过。
- [Go CLI v1.0.0](https://github.com/deckflow/decktools/releases/tag/go-cli/v1.0.0)：六个平台归档、checksum、installer 已发布；下载 macOS arm64 后版本验证通过。
- GoReleaser 初次遇到同 commit 的 SDK tag 选错 Release tag，已修正 Release 归属，未重写 Git tags；b4111f6 固定后续使用触发的 CLI tag。
- [Python SDK v1.0.0](https://github.com/deckflow/decktools/releases/tag/python-sdk/v1.0.0)：wheel / sdist 已发布，独立 venv 下载安装及 import / 版本检查通过，发行名 decktools-sdk、import decktools。尚未发布 PyPI，README 提供 GitHub wheel 安装地址。

## 保留限制

真实云端 conformance 尚未执行，需专用测试凭据；不把 mock / localhost Browser 检查等同于生产云端验收。GitHub 提示既有依赖安全告警（本次 push 时 83 项），未混入大范围依赖升级，需要另行 triage。

编辑器保存的旧 DeckOps 项目必须按新 decktools 路径重新打开，避免旧任务落到已经接管 deckops 目录的新解析产品。旧 registry 历史版本保留，不添加转发包、双 CLI alias 或跨产品发布依赖。已发布版本采用修复版前进。
