# IDE 集成

VeCLI 可以与您的 IDE 集成，以提供更无缝和上下文感知的体验。这种集成使 CLI 能够更好地理解您的工作区，并启用强大的功能，如编辑器内原生差异比较。

目前，唯一支持的 IDE 是 [Visual Studio Code](https://code.visualstudio.com/) 和其他支持 VS Code 扩展的编辑器。

## 功能

- **工作区上下文:** CLI 会自动获取对您工作区的感知，以提供更相关和准确的响应。此上下文包括：
  - 您工作区中**最近访问的 10 个文件**。
  - 您的活动光标位置。
  - 您选择的任何文本（最多 16KB；更长的选择将被截断）。

- **原生差异比较:** 当火山引擎建议代码修改时，您可以直接在 IDE 的原生差异查看器中查看更改。这允许您无缝地审查、编辑并接受或拒绝建议的更改。

- **VS Code 命令:** 您可以直接从 VS Code 命令面板 (`Cmd+Shift+P` 或 `Ctrl+Shift+P`) 访问 VeCLI 功能：
  - `VeCLI: Run`: 在集成终端中启动新的 VeCLI 会话。
  - `VeCLI: Accept Diff`: 接受活动差异编辑器中的更改。
  - `VeCLI: Close Diff Editor`: 拒绝更改并关闭活动差异编辑器。
  - `VeCLI: View Third-Party Notices`: 显示扩展的第三方通知。

## 安装和设置

有三种方法可以设置 IDE 集成：

### 1. 自动提示 (推荐)

当您在受支持的编辑器内运行 VeCLI 时，它会自动检测您的环境并提示您连接。回答“是”将自动运行必要的设置，包括安装配套扩展并启用连接。

### 2. 从 CLI 手动安装

如果您之前忽略了提示或想手动安装扩展，可以在 VeCLI 内运行以下命令：

```
/ide install
```

这将找到适合您 IDE 的正确扩展并进行安装。

### 3. 从市场手动安装

您也可以直接从市场安装扩展。

- **对于 Visual Studio Code:** 从 [VS Code 市场](https://marketplace.visualstudio.com/items?itemName=volcengine.vecli-vscode-ide-companion) 安装。
- **对于 VS Code 分支:** 为了支持 VS Code 的分支，该扩展也发布在 [Open VSX Registry](https://open-vsx.org/extension/volcengine/vecli-vscode-ide-companion) 上。请按照您的编辑器说明从该注册表安装扩展。

> 注意：
> “VeCLI Companion”扩展可能出现在搜索结果的底部。如果您没有立即看到它，请尝试向下滚动或按“新发布”排序。
>
> 手动安装扩展后，您必须在 CLI 中运行 `/ide enable` 以激活集成。

## 使用

### 启用和禁用

您可以从 CLI 内控制 IDE 集成：

- 要启用与 IDE 的连接，请运行：
  ```
  /ide enable
  ```
- 要禁用连接，请运行：
  ```
  /ide disable
  ```

启用后，VeCLI 将自动尝试连接到 IDE 配套扩展。

### 检查状态

要检查连接状态并查看 CLI 从 IDE 接收到的上下文，请运行：

```
/ide status
```

如果已连接，此命令将显示它连接到的 IDE 以及它所知道的最近打开的文件列表。

(注意：文件列表仅限于您工作区中最近访问的 10 个文件，并且仅包括磁盘上的本地文件。)

### 使用差异比较

当您要求火山引擎修改文件时，它可以直接在您的编辑器中打开一个差异视图。

**要接受差异**，您可以执行以下任何操作：

- 单击差异编辑器标题栏中的**对勾图标**。
- 保存文件（例如，使用 `Cmd+S` 或 `Ctrl+S`）。
- 打开命令面板并运行 **VeCLI: Accept Diff**。
- 在 CLI 中提示时回复 `yes`。

**要拒绝差异**，您可以：

- 单击差异编辑器标题栏中的**'x' 图标**。
- 关闭差异编辑器选项卡。
- 打开命令面板并运行 **VeCLI: Close Diff Editor**。
- 在 CLI 中提示时回复 `no`。

您还可以在差异视图中直接**修改建议的更改**，然后再接受它们。

如果您在 CLI 中选择‘Yes, allow always’，更改将不再显示在 IDE 中，因为它们将被自动接受。

## 与沙盒一起使用

如果您在沙盒内使用 VeCLI，请注意以下事项：

- **在 macOS 上:** IDE 集成需要网络访问以与 IDE 配套扩展通信。您必须使用允许网络访问的 Seatbelt 配置文件。
- **在 Docker 容器中:** 如果您在 Docker (或 Podman) 容器内运行 VeCLI，IDE 集成仍然可以连接到在您的主机上运行的 VS Code 扩展。CLI 配置为自动在 `host.docker.internal` 上查找 IDE 服务器。通常不需要特殊配置，但您可能需要确保您的 Docker 网络设置允许从容器到主机的连接。

## 故障排除

如果您在 IDE 集成方面遇到问题，以下是一些常见错误消息及其解决方法。

### 连接错误

- **消息:** `🔴 Disconnected: Failed to connect to IDE companion extension in [IDE Name]. Please ensure the extension is running. To install the extension, run /ide install.`
  - **原因:** VeCLI 无法找到必要的环境变量 (`VE_CLI_IDE_WORKSPACE_PATH` 或 `VE_CLI_IDE_SERVER_PORT`) 来连接到 IDE。这通常意味着 IDE 配套扩展未运行或未正确初始化。
  - **解决方案:**
    1.  确保您已在 IDE 中安装了 **VeCLI Companion** 扩展并且已启用。
    2.  在您的 IDE 中打开一个新终端窗口以确保它获取了正确的环境。

- **消息:** `🔴 Disconnected: IDE connection error. The connection was lost unexpectedly. Please try reconnecting by running /ide enable`
  - **原因:** 与 IDE 配套的连接丢失。
  - **解决方案:** 运行 `/ide enable` 以尝试重新连接。如果问题持续存在，请打开一个新终端窗口或重新启动您的 IDE。

### 配置错误

- **消息:** `🔴 Disconnected: Directory mismatch. VeCLI is running in a different location than the open workspace in [IDE Name]. Please run the CLI from one of the following directories: [List of directories]`
  - **原因:** CLI 的当前工作目录在您 IDE 中打开的工作区之外。
  - **解决方案:** `cd` 到您 IDE 中打开的同一目录并重新启动 CLI。

- **消息:** `🔴 Disconnected: To use this feature, please open a workspace folder in [IDE Name] and try again.`
  - **原因:** 您的 IDE 中没有打开工作区。
  - **解决方案:** 在您的 IDE 中打开一个工作区并重新启动 CLI。

### 一般错误

- **消息:** `IDE integration is not supported in your current environment. To use this feature, run VeCLI in one of these supported IDEs: [List of IDEs]`
  - **原因:** 您在不支持的 IDE 的终端或环境中运行 VeCLI。
  - **解决方案:** 从受支持的 IDE（如 VS Code）的集成终端运行 VeCLI。

- **消息:** `No installer is available for IDE. Please install the VeCLI Companion extension manually from the marketplace.`
  - **原因:** 您运行了 `/ide install`，但 CLI 没有针对您特定 IDE 的自动安装程序。
  - **解决方案:** 打开您的 IDE 的扩展市场，搜索 "VeCLI Companion"，然后 [手动安装它](#3-manual-installation-from-a-marketplace)。