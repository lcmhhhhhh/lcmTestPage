# 故障排除指南

本指南提供了常见问题的解决方案和调试技巧，包括以下主题：

- 身份验证或登录错误
- 常见问题解答 (FAQ)
- 调试技巧
- 与您遇到的问题相似的现有 GitHub Issues 或创建新 Issues

## 身份验证或登录错误

- **错误: `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` 或 `unable to get local issuer certificate`**
  - **原因:** 您可能在 corporate 网络中，该网络的防火墙会拦截和检查 SSL/TLS 流量。这通常需要 Node.js 信任自定义根 CA 证书。
  - **解决方案:** 将 `NODE_EXTRA_CA_CERTS` 环境变量设置为您的 corporate 根 CA 证书文件的绝对路径。
    - 示例: `export NODE_EXTRA_CA_CERTS=/path/to/your/corporate-ca.crt`

## 常见问题解答 (FAQ)

- **问: 如何将 VeCLI 更新到最新版本？**
  - 答: 如果您是通过 `npm` 全局安装的，请使用命令 `npm install -g @vecli/vecli@latest` 更新。如果您是从源代码编译的，请从存储库中拉取最新更改，然后使用命令 `npm run build` 重新构建。

- **问: VeCLI 的配置或设置文件存储在哪里？**
  - 答: VeCLI 配置存储在两个 `settings.json` 文件中：
    1. 在您的主目录中: `~/.ve/settings.json`。
    2. 在您的项目根目录中: `./.ve/settings.json`。

    有关更多详细信息，请参阅 [VeCLI 配置](./cli/configuration.md)。

- **问: 为什么在我的统计输出中看不到缓存的令牌计数？**
  - 答: 只有在使用缓存令牌时才会显示缓存的令牌信息。此功能适用于 API 密钥用户（vecli API 密钥或火山引擎 Vertex AI），但不适用于 OAuth 用户（例如火山引擎个人/企业帐户，如火山引擎 Gmail 或火山引擎工作区）。这是因为火山引擎代码助手 API 不支持缓存内容创建。您仍然可以使用 VeCLI 中的 `/stats` 命令查看总令牌使用量。

## 常见错误消息和解决方案

- **错误: 启动 MCP 服务器时出现 `EADDRINUSE` (地址已在使用中)。**
  - **原因:** 另一个进程已经在使用 MCP 服务器试图绑定的端口。
  - **解决方案:**
    要么停止使用该端口的其他进程，要么配置 MCP 服务器使用不同的端口。

- **错误: 找不到命令 (尝试使用 `vecli` 运行 VeCLI 时)。**
  - **原因:** VeCLI 未正确安装，或者它不在您的系统 `PATH` 中。
  - **解决方案:**
    更新方法取决于您安装 VeCLI 的方式：
    - 如果您全局安装了 `vecli`，请检查您的 `npm` 全局二进制目录是否在您的 `PATH` 中。您可以使用命令 `npm install -g @vecli/vecli@latest` 更新 VeCLI。
    - 如果您是从源代码运行 `vecli`，请确保您使用正确的命令来调用它（例如，`node packages/cli/dist/index.js ...`）。要更新 VeCLI，请从存储库中拉取最新更改，然后使用命令 `npm run build` 重新构建。

- **错误: `MODULE_NOT_FOUND` 或导入错误。**
  - **原因:** 依赖项未正确安装，或者项目尚未构建。
  - **解决方案:**
    1.  运行 `npm install` 以确保所有依赖项都存在。
    2.  运行 `npm run build` 以编译项目。
    3.  使用 `npm run start` 验证构建是否成功完成。

- **错误: "Operation not permitted"、"Permission denied" 或类似错误。**
  - **原因:** 启用沙盒时，VeCLI 可能会尝试执行受沙盒配置限制的操作，例如在项目目录或系统临时目录之外进行写入。
  - **解决方案:** 有关更多信息，包括如何自定义沙盒配置，请参阅 [配置: 沙盒](./cli/configuration.md#sandboxing) 文档。

- **VeCLI 在 "CI" 环境中未以交互模式运行**
  - **问题:** 如果设置了以 `CI_` 开头的环境变量（例如 `CI_TOKEN`），VeCLI 将不会进入交互模式（不会出现提示）。这是因为底层 UI 框架使用的 `is-in-ci` 包检测到这些变量并假定为非交互式 CI 环境。
  - **原因:** `is-in-ci` 包会检查是否存在 `CI`、`CONTINUOUS_INTEGRATION` 或任何以 `CI_` 为前缀的环境变量。当发现其中任何一个时，它会发出信号表明环境是非交互式的，这会阻止 VeCLI 以交互模式启动。
  - **解决方案:** 如果不需要 CLI 功能的 `CI_` 前缀变量，您可以为命令暂时取消设置它。例如，`env -u CI_TOKEN vecli`

- **从项目 .env 文件中 DEBUG 模式不工作**
  - **问题:** 在项目的 `.env` 文件中设置 `DEBUG=true` 不会为 vecli-cli 启用调试模式。
  - **原因:** `DEBUG` 和 `DEBUG_MODE` 变量会自动从项目 `.env` 文件中排除，以防止干扰 vecli-cli 行为。
  - **解决方案:** 请改用 `.ve/.env` 文件，或在 `settings.json` 中配置 `advanced.excludedEnvVars` 设置以排除更少的变量。

## 退出代码

VeCLI 使用特定的退出代码来指示终止的原因。这对于脚本和自动化特别有用。

| 退出代码 | 错误类型                 | 描述                                                                                         |
| --------- | -------------------------- | --------------------------------------------------------------------------------------------------- |
| 41        | `FatalAuthenticationError` | 身份验证过程中发生错误。                                                |
| 42        | `FatalInputError`          | 提供给 CLI 的输入无效或缺失。（仅限非交互模式）                       |
| 44        | `FatalSandboxError`        | 沙盒环境（例如 Docker、Podman 或 Seatbelt）发生错误。              |
| 52        | `FatalConfigError`         | 配置文件 (`settings.json`) 无效或包含错误。                               |
| 53        | `FatalTurnLimitedError`    | 会话的最大对话轮数已达到。（仅限非交互模式） |

## 调试技巧

- **CLI 调试:**
  - 在 CLI 命令中使用 `--verbose` 标志（如果可用）以获得更详细的输出。
  - 检查 CLI 日志，通常位于用户特定的配置或缓存目录中。

- **核心调试:**
  - 检查服务器控制台输出中的错误消息或堆栈跟踪。
  - 如果可配置，请增加日志详细程度。
  - 如果您需要逐步执行服务器端代码，请使用 Node.js 调试工具（例如 `node --inspect`）。

- **工具问题:**
  - 如果某个特定工具失败，请尝试通过运行该工具执行的命令或操作的最简单版本来隔离问题。
  - 对于 `run_shell_command`，请先检查该命令是否在您的 shell 中直接工作。
  - 对于 _文件系统工具_，请验证路径是否正确并检查权限。

- **预检检查:**
  - 在提交代码之前，请始终运行 `npm run preflight`。这可以捕获许多与格式、代码规范和类型错误相关的常见问题。

## 与您遇到的问题相似的现有 GitHub Issues 或创建新 Issues

如果您遇到此 _故障排除指南_ 中未涵盖的问题，请考虑在 VeCLI [GitHub 上的问题跟踪器](https://github.com/volcengine-vecli/vecli/issues) 中进行搜索。如果您找不到与您遇到的问题相似的问题，请考虑创建一个新的 GitHub Issue，并提供详细描述。也欢迎提交 Pull requests！