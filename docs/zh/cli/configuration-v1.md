# VeCLI 配置

**关于已弃用的配置格式的说明**

本文档描述了 `settings.json` 文件的旧版 v1 格式。此格式现已弃用。


有关新推荐格式的详细信息，请参阅 [当前配置文档](./configuration.md)。

VeCLI 提供了几种配置其行为的方法，包括环境变量、命令行参数和设置文件。本文档概述了不同的配置方法和可用设置。

## 配置层

配置按以下优先级顺序应用（较低的数字会被较高的数字覆盖）：

1.  **默认值：** 应用程序内的硬编码默认值。
2.  **系统默认文件：** 系统范围的默认设置，可以被其他设置文件覆盖。
3.  **用户设置文件：** 当前用户的全局设置。
4.  **项目设置文件：** 项目特定的设置。
5.  **系统设置文件：** 系统范围的设置，覆盖所有其他设置文件。
6.  **环境变量：** 系统范围或会话特定的变量，可能从 `.env` 文件加载。
7.  **命令行参数：** 启动 CLI 时传递的值。

## 设置文件

VeCLI 使用 JSON 设置文件进行持久配置。这些文件有四个位置：

- **系统默认文件：**
  - **位置：** `/etc/vecli/system-defaults.json` (Linux), `C:\ProgramData\vecli\system-defaults.json` (Windows) 或 `/Library/Application Support/VecliCli/system-defaults.json` (macOS)。路径可以使用 `VECLI_CLI_SYSTEM_DEFAULTS_PATH` 环境变量覆盖。
  - **范围：** 提供系统范围默认设置的基础层。这些设置具有最低优先级，旨在被用户、项目或系统覆盖设置覆盖。
- **用户设置文件：**
  - **位置：** `~/.ve/settings.json` (其中 `~` 是您的主目录)。
  - **范围：** 适用于当前用户的所有 VeCLI 会话。用户设置覆盖系统默认值。
- **项目设置文件：**
  - **位置：** 项目根目录中的 `.ve/settings.json`。
  - **范围：** 仅在从该特定项目运行 VeCLI 时应用。项目设置覆盖用户设置和系统默认值。
- **系统设置文件：**
  - **位置：** `/etc/vecli/settings.json` (Linux), `C:\ProgramData\vecli\settings.json` (Windows) 或 `/Library/Application Support/VecliCli/settings.json` (macOS)。路径可以使用 `VECLI_CLI_SYSTEM_SETTINGS_PATH` 环境变量覆盖。
  - **范围：** 适用于系统上的所有 VeCLI 会话，适用于所有用户。系统设置作为覆盖，优先于所有其他设置文件。对于企业中的系统管理员来说，可能有用，可以控制用户的 VeCLI 设置。

**关于设置中的环境变量的说明：** 您的 `settings.json` 文件中的字符串值可以使用 `$VAR_NAME` 或 `${VAR_NAME}` 语法引用环境变量。加载设置时，这些变量将自动解析。例如，如果您有一个环境变量 `MY_API_TOKEN`，您可以在 `settings.json` 中这样使用它：`"apiKey": "$MY_API_TOKEN"`。

> **企业用户须知：** 有关在企业环境中部署和管理 VeCLI 的指导，请参阅 [企业配置](./enterprise.md) 文档。

### 项目中的 `.ve` 目录

除了项目设置文件外，项目的 `.ve` 目录还可以包含与 VeCLI 操作相关的其他项目特定文件，例如：

- [自定义沙盒配置文件](#sandboxing) (例如，`.ve/sandbox-macos-custom.sb`, `.ve/sandbox.Dockerfile`)。

### `settings.json` 中的可用设置：

- **`contextFileName`** (字符串或字符串数组)：
  - **描述：** 指定上下文文件的文件名（例如，`VE.md`、`AGENTS.md`）。可以是单个文件名或接受的文件名列表。
  - **默认值：** `VE.md`
  - **示例：** `"contextFileName": "AGENTS.md"`

- **`bugCommand`** (对象)：
  - **描述：** 覆盖 `/bug` 命令的默认 URL。
  - **默认值：** `"urlTemplate": "https://github.com/volcengine/vecli/issues/new?template=bug_report.yml&title={title}&info={info}"`
  - **属性：**
    - **`urlTemplate`** (字符串)：可以包含 `{title}` 和 `{info}` 占位符的 URL。
  - **示例：**
    ```json
    "bugCommand": {
      "urlTemplate": "https://bug.example.com/new?title={title}&info={info}"
    }
    ```

- **`fileFiltering`** (对象)：
  - **描述：** 控制 @ 命令和文件发现工具的 git 感知文件过滤行为。
  - **默认值：** `"respectGitIgnore": true, "enableRecursiveFileSearch": true`
  - **属性：**
    - **`respectGitIgnore`** (布尔值)：在发现文件时是否尊重 .gitignore 模式。当设置为 `true` 时，git 忽略的文件（如 `node_modules/`、`dist/`、`.env`）会自动从 @ 命令和文件列表操作中排除。
    - **`enableRecursiveFileSearch`** (布尔值)：在提示中完成 @ 前缀时，是否启用在当前树下递归搜索文件名。
    - **`disableFuzzySearch`** (布尔值)：当 `true` 时，在搜索文件时禁用模糊搜索功能，这可以提高文件数量庞大的项目的性能。
  - **示例：**
    ```json
    "fileFiltering": {
      "respectGitIgnore": true,
      "enableRecursiveFileSearch": false,
      "disableFuzzySearch": true
    }
    ```

### 排查文件搜索性能问题

如果您遇到文件搜索性能问题（例如，使用 `@` 补全），尤其是在文件数量非常庞大的项目中，您可以尝试以下几种方法，按推荐顺序排列：

1.  **使用 `.veignore`：** 在您的项目根目录中创建一个 `.veignore` 文件，以排除包含大量您不需要引用的文件的目录（例如，构建产物、日志、`node_modules`）。减少爬取的文件总数是提高性能的最有效方法。

2.  **禁用模糊搜索：** 如果忽略文件还不够，您可以通过在 `settings.json` 文件中将 `disableFuzzySearch` 设置为 `true` 来禁用模糊搜索。这将使用一个更简单的、非模糊的匹配算法，速度可能会更快。

3.  **禁用递归文件搜索：** 作为最后的手段，您可以通过将 `enableRecursiveFileSearch` 设置为 `false` 来完全禁用递归文件搜索。这将是最快的选项，因为它避免了对项目的递归爬取。但是，这意味着您在使用 `@` 补全时需要键入文件的完整路径。

- **`coreTools`** (字符串数组)：
  - **描述：** 允许您指定应提供给模型的核心工具名称列表。这可以用于限制内置工具集。有关核心工具列表，请参阅 [内置工具](../core/tools-api.md#built-in-tools)。您还可以为支持它的工具指定命令特定的限制，例如 `ShellTool`。例如，`"coreTools": ["ShellTool(ls -l)"]` 将只允许执行 `ls -l` 命令。
  - **默认值：** 所有可供 Vecli 模型使用的核心工具。
  - **示例：** `"coreTools": ["ReadFileTool", "GlobTool", "ShellTool(ls)"]`。

- **`allowedTools`** (字符串数组)：
  - **默认值：** `undefined`
  - **描述：** 将绕过确认对话框的工具名称列表。这对于您信任并经常使用的工具有用。匹配语义与 `coreTools` 相同。
  - **示例：** `"allowedTools": ["ShellTool(git status)"]`。

- **`excludeTools`** (字符串数组)：
  - **描述：** 允许您指定应从模型中排除的核心工具名称列表。在 `excludeTools` 和 `coreTools` 中都列出的工具将被排除。您还可以为支持它的工具指定命令特定的限制，例如 `ShellTool`。例如，`"excludeTools": ["ShellTool(rm -rf)"]` 将阻止 `rm -rf` 命令。
  - **默认值**：不排除任何工具。
  - **示例：** `"excludeTools": ["run_shell_command", "findFiles"]`。
  - **安全说明：**
    `run_shell_command` 的 `excludeTools` 中的命令特定限制基于简单的字符串匹配，很容易被绕过。此功能**不是安全机制**，不应依赖它来安全地执行不受信任的代码。建议使用 `coreTools` 明确选择可以执行的命令。

- **`allowMCPServers`** (字符串数组)：
  - **描述：** 允许您指定应提供给模型的 MCP 服务器名称列表。这可以用于限制要连接的 MCP 服务器集。请注意，如果设置了 `--allowed-mcp-server-names`，这将被忽略。
  - **默认值：** 所有 MCP 服务器都可供 Vecli 模型使用。
  - **示例：** `"allowMCPServers": ["myPythonServer"]`。
  - **安全说明：** 这在 MCP 服务器名称上使用简单的字符串匹配，可以被修改。如果您是系统管理员并希望防止用户绕过此限制，请考虑在系统设置级别配置 `mcpServers`，这样用户将无法配置自己的任何 MCP 服务器。这不应被用作万无一失的安全机制。

- **`excludeMCPServers`** (字符串数组)：
  - **描述：** 允许您指定应从模型中排除的 MCP 服务器名称列表。在 `excludeMCPServers` 和 `allowMCPServers` 中都列出的服务器将被排除。请注意，如果设置了 `--allowed-mcp-server-names`，这将被忽略。
  - **默认值**：不排除任何 MCP 服务器。
  - **示例：** `"excludeMCPServers": ["myNodeServer"]`。
  - **安全说明：** 这在 MCP 服务器名称上使用简单的字符串匹配，可以被修改。如果您是系统管理员并希望防止用户绕过此限制，请考虑在系统设置级别配置 `mcpServers`，这样用户将无法配置自己的任何 MCP 服务器。这不应被用作万无一失的安全机制。

- **`autoAccept`** (布尔值)：
  - **描述：** 控制 CLI 是否自动接受和执行被认为是安全的工具调用（例如，只读操作），而无需明确的用户确认。如果设置为 `true`，CLI 将绕过被认为是安全的工具的确认提示。
  - **默认值：** `false`
  - **示例：** `"autoAccept": true`

- **`theme`** (字符串)：
  - **描述：** 设置 VeCLI 的视觉 [主题](./themes.md)。
  - **默认值：** `"Default"`
  - **示例：** `"theme": "GitHub"`

- **`vimMode`** (布尔值)：
  - **描述：** 启用或禁用用于输入编辑的 vim 模式。启用后，输入区域支持具有 NORMAL 和 INSERT 模式的 vim 风格导航和编辑命令。vim 模式状态显示在页脚中，并在会话之间保持。
  - **默认值：** `false`
  - **示例：** `"vimMode": true`

- **`sandbox`** (布尔值或字符串)：
  - **描述：** 控制是否以及如何使用沙盒进行工具执行。如果设置为 `true`，VeCLI 使用预构建的 `vecli-sandbox` Docker 镜像。有关更多信息，请参阅 [沙盒](#sandboxing)。
  - **默认值：** `false`
  - **示例：** `"sandbox": "docker"`

- **`toolDiscoveryCommand`** (字符串)：
  - **描述：** 定义一个用于从项目中发现工具的自定义 shell 命令。shell 命令必须在 `stdout` 上返回一个 [函数声明](https://ai.volcengine.dev/vecli-api/docs/function-calling#function-declarations) 的 JSON 数组。工具包装器是可选的。
  - **默认值：** 空
  - **示例：** `"toolDiscoveryCommand": "bin/get_tools"`

- **`toolCallCommand`** (字符串)：
  - **描述：** 定义一个用于调用使用 `toolDiscoveryCommand` 发现的特定工具的自定义 shell 命令。shell 命令必须满足以下条件：
    - 它必须将函数 `name`（与 [函数声明](https://ai.volcengine.dev/vecli-api/docs/function-calling#function-declarations) 中的完全相同）作为第一个命令行参数。
    - 它必须在 `stdin` 上以 JSON 格式读取函数参数，类似于 [`functionCall.args`](https://cloud.volcengine.com/vertex-ai/generative-ai/docs/model-reference/inference#functioncall)。
    - 它必须在 `stdout` 上以 JSON 格式返回函数输出，类似于 [`functionResponse.response.content`](https://cloud.volcengine.com/vertex-ai/generative-ai/docs/model-reference/inference#functionresponse)。
  - **默认值：** 空
  - **示例：** `"toolCallCommand": "bin/call_tool"`

- **`mcpServers`** (对象)：
  - **描述：** 配置与一个或多个模型上下文协议 (MCP) 服务器的连接，用于发现和使用自定义工具。VeCLI 尝试连接到每个配置的 MCP 服务器以发现可用工具。如果多个 MCP 服务器暴露了同名工具，则工具名称将使用您在配置中定义的服务器别名作为前缀（例如，`serverAlias__actualToolName`）以避免冲突。请注意，系统可能会为了兼容性而从 MCP 工具定义中剥离某些模式属性。必须至少提供 `command`、`url` 或 `httpUrl` 之一。如果指定了多个，则优先级顺序为 `httpUrl`，然后是 `url`，然后是 `command`。
  - **默认值：** 空
  - **属性：**
    - **`<SERVER_NAME>`** (对象)：命名服务器的服务器参数。
      - `command` (字符串, 可选)：通过标准 I/O 启动 MCP 服务器的命令。
      - `args` (字符串数组, 可选)：传递给命令的参数。
      - `env` (对象, 可选)：为服务器进程设置的环境变量。
      - `cwd` (字符串, 可选)：启动服务器的工作目录。
      - `url` (字符串, 可选)：使用服务器发送事件 (SSE) 进行通信的 MCP 服务器的 URL。
      - `httpUrl` (字符串, 可选)：使用可流式 HTTP 进行通信的 MCP 服务器的 URL。
      - `headers` (对象, 可选)：发送到 `url` 或 `httpUrl` 的请求的 HTTP 标头映射。
      - `timeout` (数字, 可选)：对此 MCP 服务器的请求超时时间（毫秒）。
      - `trust` (布尔值, 可选)：信任此服务器并绕过所有工具调用确认。
      - `description` (字符串, 可选)：服务器的简要描述，可能用于显示目的。
      - `includeTools` (字符串数组, 可选)：要从此 MCP 服务器包含的工具名称列表。指定时，只有此处列出的工具将从此服务器可用（允许列表行为）。如果未指定，则默认启用服务器中的所有工具。
      - `excludeTools` (字符串数组, 可选)：要从此 MCP 服务器排除的工具名称列表。此处列出的工具将不可用，即使服务器暴露了它们。**注意：** `excludeTools` 优先于 `includeTools` - 如果一个工具在两个列表中，它将被排除。
  - **示例：**
    ```json
    "mcpServers": {
      "myPythonServer": {
        "command": "python",
        "args": ["mcp_server.py", "--port", "8080"],
        "cwd": "./mcp_tools/python",
        "timeout": 5000,
        "includeTools": ["safe_tool", "file_reader"],
      },
      "myNodeServer": {
        "command": "node",
        "args": ["mcp_server.js"],
        "cwd": "./mcp_tools/node",
        "excludeTools": ["dangerous_tool", "file_deleter"]
      },
      "myDockerServer": {
        "command": "docker",
        "args": ["run", "-i", "--rm", "-e", "API_KEY", "ghcr.io/foo/bar"],
        "env": {
          "API_KEY": "$MY_API_TOKEN"
        }
      },
      "mySseServer": {
        "url": "http://localhost:8081/events",
        "headers": {
          "Authorization": "Bearer $MY_SSE_TOKEN"
        },
        "description": "An example SSE-based MCP server."
      },
      "myStreamableHttpServer": {
        "httpUrl": "http://localhost:8082/stream",
        "headers": {
          "X-API-Key": "$MY_HTTP_API_KEY"
        },
        "description": "An example Streamable HTTP-based MCP server."
      }
    }
    ```

- **`checkpointing`** (对象)：
  - **描述：** 配置检查点功能，该功能允许您保存和恢复对话和文件状态。有关更多详细信息，请参阅 [检查点文档](../checkpointing.md)。
  - **默认值：** `{"enabled": false}`
  - **属性：**
    - **`enabled`** (布尔值)：当 `true` 时，`/restore` 命令可用。

- **`preferredEditor`** (字符串)：
  - **描述：** 指定用于查看差异的首选编辑器。
  - **默认值：** `vscode`
  - **示例：** `"preferredEditor": "vscode"`

- **`telemetry`** (对象)
  - **描述：** 配置 VeCLI 的日志记录和指标收集。有关更多信息，请参阅 [遥测](../telemetry.md)。
  - **默认值：** `{"enabled": false, "target": "local", "otlpEndpoint": "http://localhost:4317", "logPrompts": true}`
  - **属性：**
    - **`enabled`** (布尔值)：是否启用遥测。
    - **`target`** (字符串)：收集的遥测数据的目的地。支持的值为 `local` 和 `gcp`。
    - **`otlpEndpoint`** (字符串)：OTLP 导出器的端点。
    - **`logPrompts`** (布尔值)：是否在日志中包含用户提示的内容。
  - **示例：**
    ```json
    "telemetry": {
      "enabled": true,
      "target": "local",
      "otlpEndpoint": "http://localhost:16686",
      "logPrompts": false
    }
    ```
- **`usageStatisticsEnabled`** (布尔值)：
  - **描述：** 启用或禁用使用统计信息的收集。有关更多信息，请参阅 [使用统计](#usage-statistics)。
  - **默认值：** `true`
  - **示例：**
    ```json
    "usageStatisticsEnabled": false
    ```

- **`hideTips`** (布尔值)：
  - **描述：** 启用或禁用 CLI 界面中的有用提示。
  - **默认值：** `false`
  - **示例：**

    ```json
    "hideTips": true
    ```

- **`hideBanner`** (布尔值)：
  - **描述：** 启用或禁用 CLI 界面中的启动横幅（ASCII 艺术徽标）。
  - **默认值：** `false`
  - **示例：**

    ```json
    "hideBanner": true
    ```

- **`maxSessionTurns`** (数字)：
  - **描述：** 设置会话的最大轮数。如果会话超过此限制，CLI 将停止处理并开始新的聊天。
  - **默认值：** `-1` (无限制)
  - **示例：**
    ```json
    "maxSessionTurns": 10
    ```

- **`summarizeToolOutput`** (对象)：
  - **描述：** 启用或禁用工具输出的摘要。您可以使用 `tokenBudget` 设置指定摘要的令牌预算。
  - 注意：目前仅支持 `run_shell_command` 工具。
  - **默认值：** `{}` (默认禁用)
  - **示例：**
    ```json
    "summarizeToolOutput": {
      "run_shell_command": {
        "tokenBudget": 2000
      }
    }
    ```

- **`excludedProjectEnvVars`** (字符串数组)：
  - **描述：** 指定应从项目 `.env` 文件加载中排除的环境变量。这可以防止项目特定的环境变量（如 `DEBUG=true`）干扰 vecli 行为。`.ve/.env` 文件中的变量永远不会被排除。
  - **默认值：** `["DEBUG", "DEBUG_MODE"]`
  - **示例：**
    ```json
    "excludedProjectEnvVars": ["DEBUG", "DEBUG_MODE", "NODE_ENV"]
    ```

- **`includeDirectories`** (字符串数组)：
  - **描述：** 指定要包含在工作区上下文中的其他绝对或相对路径数组。默认情况下，缺少的目录将被跳过并发出警告。路径可以使用 `~` 来引用用户的主目录。此设置可以与 `--include-directories` 命令行标志结合使用。
  - **默认值：** `[]`
  - **示例：**
    ```json
    "includeDirectories": [
      "/path/to/another/project",
      "../shared-library",
      "~/common-utils"
    ]
    ```

- **`loadMemoryFromIncludeDirectories`** (布尔值)：
  - **描述：** 控制 `/memory refresh` 命令的行为。如果设置为 `true`，`VE.md` 文件应从所有添加的目录加载。如果设置为 `false`，`VE.md` 应仅从当前目录加载。
  - **默认值：** `false`
  - **示例：**
    ```json
    "loadMemoryFromIncludeDirectories": true
    ```

- **`chatCompression`** (对象)：
  - **描述：** 控制聊天历史压缩的设置，包括自动压缩和通过 /compress 命令手动调用压缩。
  - **属性：**
    - **`contextPercentageThreshold`** (数字)：介于 0 和 1 之间的值，指定压缩的令牌阈值，作为模型总令牌限制的百分比。例如，值为 `0.6` 将在聊天历史超过令牌限制的 60% 时触发压缩。
  - **示例：**
    ```json
    "chatCompression": {
      "contextPercentageThreshold": 0.6
    }
    ```

- **`showLineNumbers`** (布尔值)：
  - **描述：** 控制是否在 CLI 输出的代码块中显示行号。
  - **默认值：** `true`
  - **示例：**
    ```json
    "showLineNumbers": false
    ```

- **`accessibility`** (对象)：
  - **描述：** 配置 CLI 的辅助功能。
  - **属性：**
    - **`screenReader`** (布尔值)：启用屏幕阅读器模式，调整 TUI 以更好地兼容屏幕阅读器。这也可以通过 `--screen-reader` 命令行标志启用，该标志将优先于设置。
    - **`disableLoadingPhrases`** (布尔值)：禁用操作期间加载短语的显示。
  - **默认值：** `{"screenReader": false, "disableLoadingPhrases": false}`
  - **示例：**
    ```json
    "accessibility": {
      "screenReader": true,
      "disableLoadingPhrases": true
    }
    ```

### 示例 `settings.json`：

```json
{
  "theme": "GitHub",
  "sandbox": "docker",
  "toolDiscoveryCommand": "bin/get_tools",
  "toolCallCommand": "bin/call_tool",
  "mcpServers": {
    "mainServer": {
      "command": "bin/mcp_server.py"
    },
    "anotherServer": {
      "command": "node",
      "args": ["mcp_server.js", "--verbose"]
    }
  },
  "telemetry": {
    "enabled": true,
    "target": "local",
    "otlpEndpoint": "http://localhost:4317",
    "logPrompts": true
  },
  "usageStatisticsEnabled": true,
  "hideTips": false,
  "hideBanner": false,
  "maxSessionTurns": 10,
  "summarizeToolOutput": {
    "run_shell_command": {
      "tokenBudget": 100
    }
  },
  "excludedProjectEnvVars": ["DEBUG", "DEBUG_MODE", "NODE_ENV"],
  "includeDirectories": ["path/to/dir1", "~/path/to/dir2", "../path/to/dir3"],
  "loadMemoryFromIncludeDirectories": true
}
```

## Shell 历史

CLI 会保留您运行的 shell 命令的历史记录。为了避免不同项目之间的冲突，此历史记录存储在用户主文件夹中的项目特定目录中。

- **位置：** `~/.ve/tmp/<project_hash>/shell_history`
  - `<project_hash>` 是从您的项目根路径生成的唯一标识符。
  - 历史记录存储在名为 `shell_history` 的文件中。

## 环境变量和 `.env` 文件

环境变量是配置应用程序的常见方式，特别是对于 API 密钥等敏感信息或在不同环境之间可能更改的设置。有关身份验证设置，请参阅 [身份验证文档](./authentication.md)，其中涵盖了所有可用的身份验证方法。

CLI 会自动从 `.env` 文件加载环境变量。加载顺序为：

1.  当前工作目录中的 `.env` 文件。
2.  如果未找到，它会向上搜索父目录，直到找到 `.env` 文件或到达项目根目录（由 `.git` 文件夹标识）或主目录。
3.  如果仍未找到，它会查找 `~/.env`（在用户的主目录中）。

**环境变量排除：** 某些环境变量（如 `DEBUG` 和 `DEBUG_MODE`）会自动从项目 `.env` 文件中排除，以防止干扰 vecli 行为。`.ve/.env` 文件中的变量永远不会被排除。您可以使用 `settings.json` 文件中的 `excludedProjectEnvVars` 设置自定义此行为。

- **`VECLI_API_KEY`**:
  - 您的 Vecli API 密钥。
  - 几种可用的 [身份验证方法](./authentication.md) 之一。
  - 在您的 shell 配置文件（例如 `~/.bashrc`、`~/.zshrc`）或 `.env` 文件中设置。
- **`VECLI_MODEL`**:
  - 指定要使用的默认 Vecli 模型。
  - 覆盖硬编码的默认值
  - 示例: `export VECLI_MODEL="vecli-2.5-flash"`
- **`VOLCENGINE_API_KEY`**:
  - 您的 Volcengine Cloud API 密钥。
  - 在快速模式下使用 Vertex AI 所需。
  - 确保您拥有必要的权限。
  - 示例: `export VOLCENGINE_API_KEY="YOUR_VOLCENGINE_API_KEY"`。
- **`VOLCENGINE__PROJECT`**:
  - 您的 Volcengine Cloud 项目 ID。
  - 使用代码助手或 Vertex AI 所需。
  - 如果使用 Vertex AI，请确保您在此项目中拥有必要的权限。
  - **Cloud Shell 注意：** 在 Cloud Shell 环境中运行时，此变量默认为分配给 Cloud Shell 用户的特殊项目。如果您在 Cloud Shell 的全局环境中设置了 `VOLCENGINE__PROJECT`，它将被此默认值覆盖。要在 Cloud Shell 中使用不同的项目，您必须在 `.env` 文件中定义 `VOLCENGINE__PROJECT`。
  - 示例: `export VOLCENGINE__PROJECT="YOUR_PROJECT_ID"`。
- **`VOLCENGINE_APPLICATION_CREDENTIALS`** (字符串):
  - **描述：** 您的 Volcengine 应用程序凭据 JSON 文件的路径。
  - **示例：** `export VOLCENGINE_APPLICATION_CREDENTIALS="/path/to/your/credentials.json"`
- **`OTLP_VOLCENGINE__PROJECT`**:
  - 您的 Volcengine Cloud 项目 ID，用于 Volcengine Cloud 中的遥测
  - 示例: `export OTLP_VOLCENGINE__PROJECT="YOUR_PROJECT_ID"`。
- **`VOLCENGINE__LOCATION`**:
  - 您的 Volcengine Cloud 项目位置（例如，us-central1）。
  - 在非快速模式下使用 Vertex AI 所需。
  - 示例: `export VOLCENGINE__LOCATION="YOUR_PROJECT_LOCATION"`。
- **`VECLI_SANDBOX`**:
  - `settings.json` 中 `sandbox` 设置的替代方法。
  - 接受 `true`、`false`、`docker`、`podman` 或自定义命令字符串。
- **`SEATBELT_PROFILE`** (macOS 特定):
  - 在 macOS 上切换 Seatbelt (`sandbox-exec`) 配置文件。
  - `permissive-open`: (默认) 限制写入项目文件夹（和一些其他文件夹，参见 `packages/cli/src/utils/sandbox-macos-permissive-open.sb`）但允许其他操作。
  - `strict`: 使用严格的配置文件，默认拒绝操作。
  - `<profile_name>`: 使用自定义配置文件。要定义自定义配置文件，请在项目的 `.ve/` 目录中创建一个名为 `sandbox-macos-<profile_name>.sb` 的文件（例如，`my-project/.ve/sandbox-macos-custom.sb`）。
- **`DEBUG` 或 `DEBUG_MODE`** (通常由底层库或 CLI 本身使用):
  - 设置为 `true` 或 `1` 以启用详细的调试日志记录，这对故障排除很有帮助。
  - **注意：** 默认情况下，这些变量会自动从项目 `.env` 文件中排除，以防止干扰 vecli 行为。如果需要专门为 vecli 设置这些，请使用 `.ve/.env` 文件。
- **`NO_COLOR`**:
  - 设置为任何值以禁用 CLI 中的所有颜色输出。
- **`CLI_TITLE`**:
  - 设置为字符串以自定义 CLI 的标题。
- **`CODE_ASSIST_ENDPOINT`**:
  - 指定代码助手服务器的端点。
  - 这对开发和测试很有用。

## 命令行参数

运行 CLI 时直接传递的参数可以覆盖该特定会话的其他配置。

- **`--model <model_name>`** (**`-m <model_name>`**):
  - 指定此会话要使用的 Vecli 模型。
  - 示例: `npm start -- --model vecli-1.5-pro-latest`
- **`--prompt <your_prompt>`** (**`-p <your_prompt>`**):
  - 用于直接将提示传递给命令。这会在非交互模式下调用 VeCLI。
- **`--prompt-interactive <your_prompt>`** (**`-i <your_prompt>`**):
  - 以提供的提示作为初始输入启动交互式会话。
  - 提示在交互式会话中处理，而不是在会话之前处理。
  - 在从 stdin 管道输入时不能使用。
  - 示例: `vecli -i "explain this code"`
- **`--sandbox`** (**`-s`**):
  - 为此会话启用沙盒模式。
- **`--sandbox-image`**:
  - 设置沙盒镜像 URI。
- **`--debug`** (**`-d`**):
  - 为此会话启用调试模式，提供更详细的输出。
- **`--all-files`** (**`-a`**):
  - 如果设置，则递归地将当前目录中的所有文件作为提示的上下文包含在内。
- **`--help`** (或 **`-h`**):
  - 显示有关命令行参数的帮助信息。
- **`--show-memory-usage`**:
  - 显示当前内存使用情况。
- **`--yolo`**:
  - 启用 YOLO 模式，自动批准所有工具调用。
- **`--approval-mode <mode>`**:
  - 设置工具调用的批准模式。可用模式：
    - `default`: 在每次工具调用时提示批准（默认行为）
    - `auto_edit`: 自动批准编辑工具（replace, write_file），同时提示其他工具
    - `yolo`: 自动批准所有工具调用（等同于 `--yolo`）
  - 不能与 `--yolo` 一起使用。对于新的统一方法，请使用 `--approval-mode=yolo` 而不是 `--yolo`。
  - 示例: `vecli --approval-mode auto_edit`
- **`--allowed-tools <tool1,tool2,...>`**:
  - 一个逗号分隔的工具名称列表，将绕过确认对话框。
  - 示例: `vecli --allowed-tools "ShellTool(git status)"`
- **`--telemetry`**:
  - 启用 [遥测](../telemetry.md)。
- **`--telemetry-target`**:
  - 设置遥测目标。有关更多信息，请参阅 [遥测](../telemetry.md)。
- **`--telemetry-otlp-endpoint`**:
  - 设置遥测的 OTLP 端点。有关更多信息，请参阅 [遥测](../telemetry.md)。
- **`--telemetry-otlp-protocol`**:
  - 设置遥测的 OTLP 协议 (`grpc` 或 `http`)。默认为 `grpc`。有关更多信息，请参阅 [遥测](../telemetry.md)。
- **`--telemetry-log-prompts`**:
  - 启用遥测的日志提示。有关更多信息，请参阅 [遥测](../telemetry.md)。
- **`--checkpointing`**:
  - 启用 [检查点](../checkpointing.md)。
- **`--extensions <extension_name ...>`** (**`-e <extension_name ...>`**):
  - 指定会话要使用的扩展列表。如果未提供，则使用所有可用扩展。
  - 使用特殊术语 `vecli -e none` 禁用所有扩展。
  - 示例: `vecli -e my-extension -e my-other-extension`
- **`--list-extensions`** (**`-l`**):
  - 列出所有可用扩展并退出。
- **`--proxy`**:
  - 设置 CLI 的代理。
  - 示例: `--proxy http://localhost:7890`。
- **`--include-directories <dir1,dir2,...>`**:
  - 在工作区中包含其他目录以支持多目录。
  - 可以多次指定或作为逗号分隔的值。
  - 最多可以添加 5 个目录。
  - 示例: `--include-directories /path/to/project1,/path/to/project2` 或 `--include-directories /path/to/project1 --include-directories /path/to/project2`
- **`--screen-reader`**:
  - 启用屏幕阅读器模式以实现辅助功能。
- **`--version`**:
  - 显示 CLI 的版本。

## 上下文文件（分层指令上下文）

虽然严格来说不是 CLI _行为_ 的配置，但上下文文件（默认为 `VECLI.md`，但可通过 `contextFileName` 设置配置）对于配置提供给 Vecli 模型的 _指令上下文_（也称为“内存”）至关重要。这个强大的功能允许您为 AI 提供项目特定的指令、编码风格指南或任何相关的背景信息，使其响应更加符合您的需求。CLI 包含 UI 元素，例如页脚中显示已加载上下文文件数量的指示器，以让您了解活动上下文。

- **目的：** 这些 Markdown 文件包含您希望 Vecli 模型在与您交互时了解的指令、指南或上下文。该系统旨在分层管理此指令上下文。

### 示例上下文文件内容（例如，`VECLI.md`）

以下是在 TypeScript 项目根目录中的上下文文件可能包含的概念示例：

```markdown
# 项目: 我的超棒 TypeScript 库

## 通用指令:

- 生成新的 TypeScript 代码时，请遵循现有的编码风格。
- 确保所有新函数和类都有 JSDoc 注释。
- 在适当的情况下优先使用函数式编程范式。
- 所有代码应与 TypeScript 5.0 和 Node.js 20+ 兼容。

## 编码风格:

- 使用 2 个空格进行缩进。
- 接口名称应以 `I` 为前缀（例如，`IUserService`）。
- 私有类成员应以下划线 (`_`) 为前缀。
- 始终使用严格相等 (`===` 和 `!==`)。

## 特定组件: `src/api/client.ts`

- 此文件处理所有出站 API 请求。
- 添加新的 API 调用函数时，请确保它们包含强大的错误处理和日志记录。
- 对所有 GET 请求使用现有的 `fetchWithRetry` 实用程序。

## 关于依赖项:

- 除非绝对必要，否则避免引入新的外部依赖项。
- 如果需要新的依赖项，请说明原因。
```

此示例演示了如何提供通用项目上下文、特定编码约定，甚至关于特定文件或组件的注释。您的上下文文件越相关和精确，AI 就能越好地协助您。强烈建议使用项目特定的上下文文件来建立约定和上下文。

- **分层加载和优先级：** CLI 通过从多个位置加载上下文文件（例如，`VECLI.md`）来实现复杂的分层内存系统。此列表中较低位置的文件（更具体）的内容通常会覆盖或补充较高位置（更通用）的文件内容。可以使用 `/memory show` 命令检查确切的连接顺序和最终上下文。典型的加载顺序是：
  1.  **全局上下文文件：**
      - 位置：`~/.ve/<contextFileName>`（例如，用户主目录中的 `~/.ve/VECLI.md`）。
      - 范围：为所有项目提供默认指令。
  2.  **项目根目录和祖先上下文文件：**
      - 位置：CLI 在当前工作目录中搜索配置的上下文文件，然后在每个父目录中搜索，直到项目根目录（由 `.git` 文件夹标识）或您的主目录。
      - 范围：提供与整个项目或其重要部分相关的上下文。
  3.  **子目录上下文文件（上下文/本地）：**
      - 位置：CLI 还会在当前工作目录 _下方_ 的子目录中扫描配置的上下文文件（遵守常见的忽略模式，如 `node_modules`、`.git` 等）。此搜索的广度默认限制为 200 个目录，但可以通过 `settings.json` 文件中的 `memoryDiscoveryMaxDirs` 字段进行配置。
      - 范围：允许为项目的特定组件、模块或子部分提供高度具体的指令。
- **连接和 UI 指示：** 所有找到的上下文文件的内容都会连接起来（用分隔符指示其来源和路径），并作为系统提示的一部分提供给 Vecli 模型。CLI 页脚显示已加载的上下文文件计数，为您提供关于活动指令上下文的快速视觉提示。
- **导入内容：** 您可以使用 `@path/to/file.md` 语法通过导入其他 Markdown 文件来模块化您的上下文文件。有关详细信息，请参阅 [内存导入处理器文档](../core/memport.md)。
- **内存管理命令：**
  - 使用 `/memory refresh` 强制重新扫描和重新加载所有配置位置的所有上下文文件。这会更新 AI 的指令上下文。
  - 使用 `/memory show` 显示当前加载的组合指令上下文，允许您验证 AI 使用的层次结构和内容。
  - 有关 `/memory` 命令及其子命令（`show` 和 `refresh`）的完整详细信息，请参阅 [命令文档](./commands.md#memory)。

通过理解和利用这些配置层和上下文文件的分层性质，您可以有效地管理 AI 的内存，并根据您的特定需求和项目定制 VeCLI 的响应。

## 沙盒

VeCLI 可以在沙盒环境中执行潜在的不安全操作（如 shell 命令和文件修改），以保护您的系统。

沙盒默认是禁用的，但您可以通过以下几种方式启用它：

- 使用 `--sandbox` 或 `-s` 标志。
- 设置 `VECLI_SANDBOX` 环境变量。
- 默认情况下，使用 `--yolo` 或 `--approval-mode=yolo` 时会启用沙盒。

默认情况下，它使用预构建的 `vecli-sandbox` Docker 镜像。

对于项目的特定沙盒需求，您可以在项目根目录的 `.ve/sandbox.Dockerfile` 中创建一个自定义 Dockerfile。此 Dockerfile 可以基于基础沙盒镜像：

```dockerfile
FROM vecli-sandbox

# 在此处添加您的自定义依赖项或配置
# 例如：
# RUN apt-get update && apt-get install -y some-package
# COPY ./my-config /app/my-config
```

当 `.ve/sandbox.Dockerfile` 存在时，您可以在运行 VeCLI 时使用 `BUILD_SANDBOX` 环境变量来自动构建自定义沙盒镜像：

```bash
BUILD_SANDBOX=1 vecli -s
```

## 使用统计

为了帮助我们改进 VeCLI，我们会收集匿名化的使用统计信息。这些数据帮助我们了解 CLI 的使用方式，识别常见问题，并优先考虑新功能。

**我们收集的内容：**

- **工具调用：** 我们记录被调用的工具名称、它们是成功还是失败，以及执行所需的时间。我们不收集传递给工具的参数或工具返回的任何数据。
- **API 请求：** 我们记录每个请求使用的 Vecli 模型、请求的持续时间和是否成功。我们不收集提示或响应的内容。
- **会话信息：** 我们收集有关 CLI 配置的信息，例如启用的工具和批准模式。

**我们不收集的内容：**

- **个人身份信息 (PII)：** 我们不收集任何个人信息，例如您的姓名、电子邮件地址或 API 密钥。
- **提示和响应内容：** 我们不记录您的提示或 Vecli 模型的响应内容。
- **文件内容：** 我们不记录 CLI 读取或写入的任何文件的内容。

**如何选择退出：**

您可以随时通过在 `settings.json` 文件中将 `usageStatisticsEnabled` 属性设置为 `false` 来选择退出使用统计信息收集：

```json
{
  "usageStatisticsEnabled": false
}
```