# decktools Go CLI

Go implementation of the DeckTools CLI, using the local Go SDK in `sdks/go`.

## Install

Pre-built binaries are published on [GitHub Releases](https://github.com/deckflow/decktools/releases). The installer picks the matching CPU and platform archive and installs into a user-writable directory (default `$HOME/.local/bin`). Installing there does not require administrator privileges.

### macOS (Apple Silicon or Intel)

```sh
curl --proto '=https' --tlsv1.2 -LsSf \
  https://github.com/deckflow/decktools/releases/latest/download/decktools-installer.sh | sh
```

### Linux (x64 or ARM64)

```sh
curl --proto '=https' --tlsv1.2 -LsSf \
  https://github.com/deckflow/decktools/releases/latest/download/decktools-installer.sh | sh
```

Optional environment variables:

| Variable | Meaning |
|----------|---------|
| `DECKTOOLS_VERSION` | Pin a version (e.g. `0.7.3`). Default: latest `go-cli` release. |
| `DECKTOOLS_INSTALL_DIR` | Install directory. Default: `$HOME/.local/bin`. |
| `DECKTOOLS_NO_MODIFY_PATH` | Set to `1` to skip PATH / shell profile updates. |

Example — install a specific version under a custom prefix:

```sh
curl --proto '=https' --tlsv1.2 -LsSf \
  https://github.com/deckflow/decktools/releases/latest/download/decktools-installer.sh \
  | DECKTOOLS_VERSION=0.7.3 DECKTOOLS_INSTALL_DIR="$HOME/.local/bin" sh
```

Verify:

```sh
decktools --version
```

### Windows

Download the matching `.zip` from [GitHub Releases](https://github.com/deckflow/decktools/releases) (`windows_amd64` or `windows_arm64`), extract `decktools.exe`, and place it on your `PATH`.

### Manual download

Look for assets named `decktools_<version>_<os>_<arch>.tar.gz` (or `.zip` on Windows).

| Platform | Asset suffix |
|----------|--------------|
| macOS (Apple Silicon) | `darwin_arm64` |
| macOS (Intel) | `darwin_amd64` |
| Linux (x64) | `linux_amd64` |
| Linux (ARM64) | `linux_arm64` |
| Windows (x64) | `windows_amd64.zip` |
| Windows (ARM64) | `windows_arm64.zip` |

Example (macOS Apple Silicon):

```bash
VERSION=0.7.3
curl -fsSL "https://github.com/deckflow/decktools/releases/download/go-cli/v${VERSION}/decktools_${VERSION}_darwin_arm64.tar.gz" \
  | tar -xz
sudo mv decktools /usr/local/bin/
decktools --version
```

The installer verifies downloads against `checksums.txt` when `sha256sum` or `shasum` is available. For a controlled or offline install, download the installer and archive from the same GitHub Release, inspect them locally, verify the checksum, then run the installer.

### macOS first run (Gatekeeper)

Pre-built binaries are not signed with an Apple Developer ID. On first launch, macOS may block the binary with a message such as **"cannot be opened because the developer cannot be verified"**, or ask you to allow it under **System Settings → Privacy & Security**.

This is expected for unsigned CLI tools. The installer clears the quarantine flag when possible. If you still see a prompt, use one of the following:

**Option A — remove the quarantine flag (recommended)**

```bash
xattr -d com.apple.quarantine "$(which decktools)"
```

**Option B — open once from Finder**

Right-click the `decktools` binary → **Open** → confirm **Open** in the dialog. After that, you can run it from the terminal as usual.

**Option C — build from source (no Gatekeeper prompt)**

See [Build from source](#build-from-source) below. A binary compiled on your Mac is not quarantined.

> **Tip:** Installing via the curl installer or `curl … | tar -xz` often avoids the quarantine flag. Browser downloads of the `.tar.gz` are more likely to trigger Gatekeeper.

## Build from source

```bash
go build -o decktools .
```

## Usage

```bash
decktools [--json] <command> [options]
```

The command surface mirrors `apps/node-cli`: `config`, `login`, `task`, `compress`, `extract`, `ocr`, `convert`, `join`, `create`, `translate`, and `run`.

## Release (maintainers)

Push a tag to trigger the GitHub Actions release workflow:

```bash
git tag go-cli/v0.7.0
git push origin go-cli/v0.7.0
```

This builds macOS, Linux, and Windows binaries, uploads them to GitHub Releases, and attaches `decktools-installer.sh`.
