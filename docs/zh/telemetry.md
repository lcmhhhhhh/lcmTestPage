# VeCLI 可观测性指南

遥测技术提供有关 VeCLI 性能、健康状况和使用情况的数据。通过启用它，您可以通过跟踪、指标和结构化日志来监控操作、调试问题和优化工具使用。

VeCLI 的遥测系统基于 **[OpenTelemetry] (OTEL)** 标准构建，允许您将数据发送到任何兼容的后端。

[OpenTelemetry]: https://opentelemetry.io/

## 启用遥测

您可以通过多种方式启用遥测。配置主要通过 [`.ve/settings.json` 文件](./cli/configuration.md) 和环境变量进行管理，但 CLI 标志可以覆盖这些设置以用于特定会话。

### 优先级顺序

以下列出了应用遥测设置的优先级，列表中较高的项目具有更高的优先级：

1.  **CLI 标志 (用于 `vecli` 命令):**
    - `--telemetry` / `--no-telemetry`: 覆盖 `telemetry.enabled`。
    - `--telemetry-target <local|ve>`: 覆盖 `telemetry.target`。
    - `--telemetry-otlp-endpoint <URL>`: 覆盖 `telemetry.otlpEndpoint`。
    - `--telemetry-log-prompts` / `--no-telemetry-log-prompts`: 覆盖 `telemetry.logPrompts`。
    - `--telemetry-outfile <path>`: 将遥测输出重定向到文件。请参阅 [导出到文件](#exporting-to-a-file)。

1.  **环境变量:**
    - `OTEL_EXPORTER_OTLP_ENDPOINT`: 覆盖 `telemetry.otlpEndpoint`。

1.  **工作区设置文件 (`.ve/settings.json`):** 来自此项目特定文件中 `telemetry` 对象的值。

1.  **用户设置文件 (`~/.ve/settings.json`):** 来自此全局用户文件中 `telemetry` 对象的值。

1.  **默认值:** 如果未通过上述任何方式设置，则应用默认值。
    - `telemetry.enabled`: `false`
    - `telemetry.target`: `local`
    - `telemetry.otlpEndpoint`: `http://localhost:4317`
    - `telemetry.logPrompts`: `true`

**对于 `npm run telemetry -- --target=<ve|local>` 脚本:**
此脚本的 `--target` 参数 _仅_ 在该脚本的持续时间和目的内覆盖 `telemetry.target`（即，选择要启动的收集器）。它不会永久更改您的 `settings.json`。该脚本将首先查看 `settings.json` 以获取 `telemetry.target` 作为其默认值。

### 示例设置

以下代码可以添加到您的工作区 (`.ve/settings.json`) 或用户 (`~/.ve/settings.json`) 设置中，以启用遥测并将输出发送到火山引擎：

```json
{
  "telemetry": {
    "enabled": true,
    "target": "ve"
  },
  "tools": {
    "sandbox": false
  }
}
```

### 导出到文件

您可以将所有遥测数据导出到文件以供本地检查。

要启用文件导出，请使用 `--telemetry-outfile` 标志并指定所需输出文件的路径。这必须使用 `--telemetry-target=local` 运行。

```bash
# 设置您想要的输出文件路径
TELEMETRY_FILE=".ve/telemetry.log"

# 使用本地遥测运行 VeCLI
# 注意: --telemetry-otlp-endpoint="" 是必需的，以覆盖默认的
# OTLP 导出器并确保遥测数据写入本地文件。
vecli --telemetry \
  --telemetry-target=local \
  --telemetry-otlp-endpoint="" \
  --telemetry-outfile="$TELEMETRY_FILE" \
  --prompt "What is OpenTelemetry?"
```

## 运行 OTEL 收集器

OTEL 收集器是一个接收、处理和导出遥测数据的服务。
CLI 可以使用 OTLP/gRPC 或 OTLP/HTTP 协议发送数据。
您可以通过 `--telemetry-otlp-protocol` 标志或 `settings.json` 文件中的 `telemetry.otlpProtocol` 设置指定要使用的协议。有关更多详细信息，请参阅 [配置文档](./cli/configuration.md#--telemetry-otlp-protocol)。

在 [documentation][otel-config-docs] 中了解更多关于 OTEL 导出器标准配置的信息。

[otel-config-docs]: https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/

### 本地

使用 `npm run telemetry -- --target=local` 命令来自动化设置本地遥测管道的过程，包括在 `.ve/settings.json` 文件中配置必要的设置。底层脚本安装 `otelcol-contrib`（OpenTelemetry 收集器）和 `jaeger`（用于查看跟踪的 Jaeger UI）。要使用它：

1.  **运行命令**:
    从存储库的根目录执行命令：

    ```bash
    npm run telemetry -- --target=local
    ```

    该脚本将：
    - 如果需要，下载 Jaeger 和 OTEL。
    - 启动一个本地 Jaeger 实例。
    - 启动一个配置为从 VeCLI 接收数据的 OTEL 收集器。
    - 自动在您的工作区设置中启用遥测。
    - 退出时，禁用遥测。

1.  **查看跟踪**:
    打开您的网络浏览器并导航到 **http://localhost:16686** 以访问 Jaeger UI。在这里您可以检查 VeCLI 操作的详细跟踪。

1.  **检查日志和指标**:
    该脚本将 OTEL 收集器输出（包括日志和指标）重定向到 `~/.ve/tmp/<projectHash>/otel/collector.log`。该脚本将提供链接以查看并在本地跟踪您的遥测数据（跟踪、指标、日志）。

1.  **停止服务**:
    在运行脚本的终端中按 `Ctrl+C` 以停止 OTEL 收集器和 Jaeger 服务。

### 火山引擎

使用 `npm run telemetry -- --target=volc` 命令来自动化设置一个本地 OpenTelemetry 收集器，该收集器将数据转发到您的火山引擎项目，包括在 `.ve/settings.json` 文件中配置必要的设置。底层脚本安装 `otelcol-contrib`。要使用它：

1.  **运行命令**:
    从存储库的根目录执行命令：

    ```bash
    npm run telemetry -- --target=ve
    ```

    该脚本将：
    - 如果需要，下载 `otelcol-contrib` 二进制文件。
    - 启动一个配置为从 VeCLI 接收数据并将其导出到您指定的火山引擎项目的 OTEL 收集器。
    - 自动在您的工作区设置 (`.ve/settings.json`) 中启用遥测并禁用沙盒模式。
    - 提供直接链接以在您的火山引擎控制台中查看跟踪、指标和日志。
    - 退出时 (Ctrl+C)，它将尝试恢复您原来的遥测和沙盒设置。

1.  **运行 VeCLI**:
    在一个单独的终端中，运行您的 VeCLI 命令。这会生成遥测数据，收集器会捕获这些数据。

1.  **在火山引擎中查看遥测数据**:
    使用脚本提供的链接导航到火山引擎控制台并查看您的跟踪、指标和日志。

1.  **检查本地收集器日志**:
    该脚本将本地 OTEL 收集器输出重定向到 `~/.ve/tmp/<projectHash>/otel/collector-ve.log`。该脚本提供链接以查看并在本地跟踪您的收集器日志。

1.  **停止服务**:
    在运行脚本的终端中按 `Ctrl+C` 以停止 OTEL 收集器。

## 日志和指标参考

以下部分描述了为 VeCLI 生成的日志和指标的结构。

- 所有日志和指标上都包含一个 `sessionId` 作为公共属性。

### 日志

日志是特定事件的时间戳记录。为 VeCLI 记录以下事件：

- `vecli.config`: 此事件在启动时发生一次，并带有 CLI 的配置。
  - **属性**:
    - `model` (字符串)
    - `embedding_model` (字符串)
    - `sandbox_enabled` (布尔值)
    - `core_tools_enabled` (字符串)
    - `approval_mode` (字符串)
    - `api_key_enabled` (布尔值)
    - `vertex_ai_enabled` (布尔值)
    - `code_assist_enabled` (布尔值)
    - `log_prompts_enabled` (布尔值)
    - `file_filtering_respect_git_ignore` (布尔值)
    - `debug_mode` (布尔值)
    - `mcp_servers` (字符串)

- `vecli.user_prompt`: 当用户提交提示时，此事件发生。
  - **属性**:
    - `prompt_length` (整数)
    - `prompt_id` (字符串)
    - `prompt` (字符串, 如果 `log_prompts_enabled` 配置为 `false`，则此属性被排除)
    - `auth_type` (字符串)

- `vecli.tool_call`: 每次函数调用时都会发生此事件。
  - **属性**:
    - `function_name`
    - `function_args`
    - `duration_ms`
    - `success` (布尔值)
    - `decision` (字符串: "accept", "reject", "auto_accept", 或 "modify", 如果适用)
    - `error` (如果适用)
    - `error_type` (如果适用)
    - `metadata` (如果适用, 字符串 -> 任何的字典)

- `vecli.file_operation`: 每次文件操作时都会发生此事件。
  - **属性**:
    - `tool_name` (字符串)
    - `operation` (字符串: "create", "read", "update")
    - `lines` (整数, 如果适用)
    - `mimetype` (字符串, 如果适用)
    - `extension` (字符串, 如果适用)
    - `programming_language` (字符串, 如果适用)
    - `diff_stat` (json 字符串, 如果适用): 一个包含以下成员的 JSON 字符串:
      - `ai_added_lines` (整数)
      - `ai_removed_lines` (整数)
      - `user_added_lines` (整数)
      - `user_removed_lines` (整数)

- `vecli.api_request`: 向火山引擎 API 发出请求时，此事件发生。
  - **属性**:
    - `model`
    - `request_text` (如果适用)

- `vecli.api_error`: 如果 API 请求失败，此事件发生。
  - **属性**:
    - `model`
    - `error`
    - `error_type`
    - `status_code`
    - `duration_ms`
    - `auth_type`

- `vecli.api_response`: 接收到 vecli API 的响应时，此事件发生。
  - **属性**:
    - `model`
    - `status_code`
    - `duration_ms`
    - `error` (可选)
    - `input_token_count`
    - `output_token_count`
    - `cached_content_token_count`
    - `thoughts_token_count`
    - `tool_token_count`
    - `response_text` (如果适用)
    - `auth_type`

- `vecli.malformed_json_response`: 当 vecli API 的 `generateJson` 响应无法解析为 json 时，此事件发生。
  - **属性**:
    - `model`

- `vecli.flash_fallback`: 当 VeCLI 切换到 flash 作为后备时，此事件发生。
  - **属性**:
    - `auth_type`

- `vecli.slash_command`: 当用户执行斜杠命令时，此事件发生。
  - **属性**:
    - `command` (字符串)
    - `subcommand` (字符串, 如果适用)

### 指标

指标是随时间推移的行为的数值测量。为 VeCLI 收集以下指标：

- `vecli.session.count` (计数器, 整数): 每次 CLI 启动时递增一次。

- `vecli.tool.call.count` (计数器, 整数): 计算工具调用次数。
  - **属性**:
    - `function_name`
    - `success` (布尔值)
    - `decision` (字符串: "accept", "reject", 或 "modify", 如果适用)
    - `tool_type` (字符串: "mcp", 或 "native", 如果适用)

- `vecli.tool.call.latency` (直方图, 毫秒): 测量工具调用延迟。
  - **属性**:
    - `function_name`
    - `decision` (字符串: "accept", "reject", 或 "modify", 如果适用)

- `vecli.api.request.count` (计数器, 整数): 计算所有 API 请求次数。
  - **属性**:
    - `model`
    - `status_code`
    - `error_type` (如果适用)

- `vecli.api.request.latency` (直方图, 毫秒): 测量 API 请求延迟。
  - **属性**:
    - `model`

- `vecli_cli.token.usage` (计数器, 整数): 计算使用的令牌数量。
  - **属性**:
    - `model`
    - `type` (字符串: "input", "output", "thought", "cache", 或 "tool")

- `vecli_cli.file.operation.count` (计数器, 整数): 计算文件操作次数。
  - **属性**:
    - `operation` (字符串: "create", "read", "update"): 文件操作的类型。
    - `lines` (整数, 如果适用): 文件中的行数。
    - `mimetype` (字符串, 如果适用): 文件的 mimetype。
    - `extension` (字符串, 如果适用): 文件的扩展名。
    - `model_added_lines` (整数, 如果适用): 模型添加/更改的行数。
    - `model_removed_lines` (整数, 如果适用): 模型删除/更改的行数。
    - `user_added_lines` (整数, 如果适用): 用户在 AI 提出的更改中添加/更改的行数。
    - `user_removed_lines` (整数, 如果适用): 用户在 AI 提出的更改中删除/更改的行数。
    - `programming_language` (字符串, 如果适用): 文件的编程语言。

- `vecli_cli.chat_compression` (计数器, 整数): 计算聊天压缩操作次数
  - **属性**:
    - `tokens_before`: (整数): 压缩前上下文中的令牌数
    - `tokens_after`: (整数): 压缩后上下文中的令牌数