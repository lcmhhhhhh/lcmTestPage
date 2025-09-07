# 使用 VeCLI 的 MCP 服务器

本文档提供了在 VeCLI 中配置和使用模型上下文协议 (MCP) 服务器的指南。

## 什么是 MCP 服务器？

MCP 服务器是一个通过模型上下文协议向 VeCLI 公开工具和资源的应用程序，使其能够与外部系统和数据源交互。MCP 服务器充当 Vecli 模型与您的本地环境或其他服务（如 API）之间的桥梁。

MCP 服务器使 VeCLI 能够：

- **发现工具：** 通过标准化的模式定义列出可用的工具、其描述和参数。
- **执行工具：** 使用定义的参数调用特定工具并接收结构化响应。
- **访问资源：** 从特定资源读取数据（尽管 VeCLI 主要专注于工具执行）。

通过 MCP 服务器，您可以扩展 VeCLI 的功能，使其能够执行超出其内置功能的操作，例如与数据库、API、自定义脚本或专用工作流交互。

## 核心集成架构

VeCLI 通过内置在核心包 (`packages/core/src/tools/`) 中的复杂发现和执行系统与 MCP 服务器集成：

### 发现阶段 (`mcp-client.ts`)

发现过程由 `discoverMcpTools()` 编排，该过程：

1. **遍历配置的服务器** 从您的 `settings.json` `mcpServers` 配置中
2. **建立连接** 使用适当的传输机制（Stdio、SSE 或可流式 HTTP）
3. **获取工具定义** 使用 MCP 协议从每个服务器获取
4. **清理和验证** 工具模式以确保与 Vecli API 兼容
5. **注册工具** 在全局工具注册表中，并解决冲突

### 执行层 (`mcp-tool.ts`)

每个发现的 MCP 工具都包装在 `DiscoveredMCPTool` 实例中，该实例：

- **处理确认逻辑** 基于服务器信任设置和用户偏好
- **管理工具执行** 通过使用正确的参数调用 MCP 服务器
- **处理响应** 用于 LLM 上下文和用户显示
- **维护连接状态** 并处理超时

### 传输机制

VeCLI 支持三种 MCP 传输类型：

- **Stdio 传输：** 生成子进程并通过 stdin/stdout 通信
- **SSE 传输：** 连接到服务器发送事件端点
- **可流式 HTTP 传输：** 使用 HTTP 流进行通信

## 如何设置您的 MCP 服务器

VeCLI 使用 `settings.json` 文件中的 `mcpServers` 配置来定位和连接到 MCP 服务器。此配置支持具有不同传输机制的多个服务器。

### 在 settings.json 中配置 MCP 服务器

您可以在 `settings.json` 文件中以两种主要方式配置 MCP 服务器：通过顶层 `mcpServers` 对象进行特定服务器定义，以及通过 `mcp` 对象进行控制服务器发现和执行的全局设置。

#### 全局 MCP 设置 (`mcp`)

`settings.json` 中的 `mcp` 对象允许您为所有 MCP 服务器定义全局规则。

- **`mcp.serverCommand`** (字符串): 启动 MCP 服务器的全局命令。
- **`mcp.allowed`** (字符串数组): 要允许的 MCP 服务器名称列表。如果设置了此项，则只会连接到此列表中的服务器（与 `mcpServers` 对象中的键匹配）。
- **`mcp.excluded`** (字符串数组): 要排除的 MCP 服务器名称列表。此列表中的服务器将不会被连接。

**示例：**

```json
{
  "mcp": {
    "allowed": ["my-trusted-server"],
    "excluded": ["experimental-server"]
  }
}
```

#### 服务器特定配置 (`mcpServers`)

`mcpServers` 对象是您定义希望 CLI 连接的每个单独 MCP 服务器的地方。

### 配置结构

将 `mcpServers` 对象添加到您的 `settings.json` 文件中：

```json
{ ...文件包含其他配置对象
  "mcpServers": {
    "serverName": {
      "command": "path/to/server",
      "args": ["--arg1", "value1"],
      "env": {
        "API_KEY": "$MY_API_TOKEN"
      },
      "cwd": "./server-directory",
      "timeout": 30000,
      "trust": false
    }
  }
}
```

### 配置属性

每个服务器配置支持以下属性：

#### 必需（以下之一）

- **`command`** (字符串): Stdio 传输的可执行文件路径
- **`url`** (字符串): SSE 端点 URL（例如，`"http://localhost:8080/sse"`）
- **`httpUrl`** (字符串): HTTP 流端点 URL

#### 可选

- **`args`** (字符串[]): Stdio 传输的命令行参数
- **`headers`** (对象): 使用 `url` 或 `httpUrl` 时的自定义 HTTP 标头
- **`env`** (对象): 服务器进程的环境变量。值可以使用 `$VAR_NAME` 或 `${VAR_NAME}` 语法引用环境变量
- **`cwd`** (字符串): Stdio 传输的工作目录
- **`timeout`** (数字): 请求超时时间（毫秒）（默认值：600,000ms = 10 分钟）
- **`trust`** (布尔值): 当为 `true` 时，绕过此服务器的所有工具调用确认（默认值：`false`）
- **`includeTools`** (字符串[]): 要从此 MCP 服务器包含的工具名称列表。指定时，仅此处列出的工具将从此服务器可用（允许列表行为）。如果未指定，则默认启用服务器中的所有工具。
- **`excludeTools`** (字符串[]): 要从此 MCP 服务器排除的工具名称列表。此处列出的工具将不可用于模型，即使服务器公开了它们。**注意：** `excludeTools` 优先于 `includeTools` - 如果一个工具在两个列表中，则会被排除。

### 远程 MCP 服务器的 OAuth 支持

VeCLI 支持使用 SSE 或 HTTP 传输对需要身份验证的远程 MCP 服务器进行 OAuth 2.0 身份验证。这可以安全地访问需要身份验证的 MCP 服务器。

#### 自动 OAuth 发现

对于支持 OAuth 发现的服务器，您可以省略 OAuth 配置，让 CLI 自动发现它：

```json
{
  "mcpServers": {
    "discoveredServer": {
      "url": "https://api.example.com/sse"
    }
  }
}
```

CLI 将自动：

- 检测服务器何时需要 OAuth 身份验证（401 响应）
- 从服务器元数据发现 OAuth 端点
- 如果支持，执行动态客户端注册
- 处理 OAuth 流和令牌管理

#### 身份验证流

连接到启用了 OAuth 的服务器时：

1. **初始连接尝试** 失败，返回 401 未授权
2. **OAuth 发现** 找到授权和令牌端点
3. **浏览器打开** 用于用户身份验证（需要本地浏览器访问）
4. **授权码** 兑换为访问令牌
5. **令牌安全存储** 以供将来使用
6. **连接重试** 使用有效令牌成功

#### 浏览器重定向要求

**重要：** OAuth 身份验证要求您的本地机器能够：

- 打开 Web 浏览器进行身份验证
- 在 `http://localhost:7777/oauth/callback` 上接收重定向

此功能在以下环境中无法工作：

- 没有浏览器访问权限的无头环境
- 没有 X11 转发的远程 SSH 会话
- 没有浏览器支持的容器化环境

#### 管理 OAuth 身份验证

使用 `/mcp auth` 命令管理 OAuth 身份验证：

```bash
# 列出需要身份验证的服务器
/mcp auth

# 使用特定服务器进行身份验证
/mcp auth serverName

# 如果令牌过期则重新进行身份验证
/mcp auth serverName
```

#### OAuth 配置属性

- **`enabled`** (布尔值): 为此服务器启用 OAuth
- **`clientId`** (字符串): OAuth 客户端标识符（可选，使用动态注册时）
- **`clientSecret`** (字符串): OAuth 客户端密钥（可选，用于公共客户端）
- **`authorizationUrl`** (字符串): OAuth 授权端点（如果省略则自动发现）
- **`tokenUrl`** (字符串): OAuth 令牌端点（如果省略则自动发现）
- **`scopes`** (字符串[]): 所需的 OAuth 范围
- **`redirectUri`** (字符串): 自定义重定向 URI（默认为 `http://localhost:7777/oauth/callback`）
- **`tokenParamName`** (字符串): SSE URL 中令牌的查询参数名称
- **`audiences`** (字符串[]): 令牌有效的受众

#### 令牌管理

OAuth 令牌会自动：

- **安全存储** 在 `~/.ve/mcp-oauth-tokens.json` 中
- **刷新** 当过期时（如果有刷新令牌可用）
- **验证** 在每次连接尝试之前
- **清理** 当无效或过期时

#### 身份验证提供者类型

您可以使用 `authProviderType` 属性指定身份验证提供者类型：

- **`authProviderType`** (字符串): 指定身份验证提供者。可以是以下之一：
  - **`dynamic_discovery`** (默认): CLI 将自动从服务器发现 OAuth 配置。
  - **`volcengine_credentials`**: CLI 将使用 Volcengine 应用默认凭据 (ADC) 对服务器进行身份验证。使用此提供者时，您必须指定所需的范围。

```json
{
  "mcpServers": {
    "volcengineServer": {
      "httpUrl": "https://my-gcp-service.run.app/mcp",
      "authProviderType": "volcengine_credentials",
      "oauth": {
        "scopes": ["https://www.volcengineapis.com/auth/userinfo.email"]
      }
    }
  }
}
```

### 示例配置

#### Python MCP 服务器 (Stdio)

```json
{
  "mcpServers": {
    "pythonTools": {
      "command": "python",
      "args": ["-m", "my_mcp_server", "--port", "8080"],
      "cwd": "./mcp-servers/python",
      "env": {
        "DATABASE_URL": "$DB_CONNECTION_STRING",
        "API_KEY": "${EXTERNAL_API_KEY}"
      },
      "timeout": 15000
    }
  }
}
```

#### Node.js MCP 服务器 (Stdio)

```json
{
  "mcpServers": {
    "nodeServer": {
      "command": "node",
      "args": ["dist/server.js", "--verbose"],
      "cwd": "./mcp-servers/node",
      "trust": true
    }
  }
}
```

#### 基于 Docker 的 MCP 服务器

```json
{
  "mcpServers": {
    "dockerizedServer": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "API_KEY",
        "-v",
        "${PWD}:/workspace",
        "my-mcp-server:latest"
      ],
      "env": {
        "API_KEY": "$EXTERNAL_SERVICE_TOKEN"
      }
    }
  }
}
```

#### 基于 HTTP 的 MCP 服务器

```json
{
  "mcpServers": {
    "httpServer": {
      "httpUrl": "http://localhost:3000/mcp",
      "timeout": 5000
    }
  }
}
```

#### 带有自定义标头的基于 HTTP 的 MCP 服务器

```json
{
  "mcpServers": {
    "httpServerWithAuth": {
      "httpUrl": "http://localhost:3000/mcp",
      "headers": {
        "Authorization": "Bearer your-api-token",
        "X-Custom-Header": "custom-value",
        "Content-Type": "application/json"
      },
      "timeout": 5000
    }
  }
}
```

#### 带有工具过滤的 MCP 服务器

```json
{
  "mcpServers": {
    "filteredServer": {
      "command": "python",
      "args": ["-m", "my_mcp_server"],
      "includeTools": ["safe_tool", "file_reader", "data_processor"],
      // "excludeTools": ["dangerous_tool", "file_deleter"],
      "timeout": 30000
    }
  }
}
```

## 发现阶段深入

当 VeCLI 启动时，它通过以下详细过程执行 MCP 服务器发现：

### 1. 服务器迭代和连接

对于 `mcpServers` 中配置的每个服务器：

1. **状态跟踪开始：** 服务器状态设置为 `CONNECTING`
2. **传输选择：** 基于配置属性：
   - `httpUrl` → `StreamableHTTPClientTransport`
   - `url` → `SSEClientTransport`
   - `command` → `StdioClientTransport`
3. **连接建立：** MCP 客户端尝试使用配置的超时连接
4. **错误处理：** 连接失败会被记录，服务器状态设置为 `DISCONNECTED`

### 2. 工具发现

连接成功后：

1. **工具列表：** 客户端调用 MCP 服务器的工具列表端点
2. **模式验证：** 验证每个工具的函数声明
3. **工具过滤：** 根据 `includeTools` 和 `excludeTools` 配置过滤工具
4. **名称清理：** 工具名称被清理以满足 Vecli API 要求：
   - 无效字符（非字母数字、下划线、点、连字符）被替换为下划线
   - 超过 63 个字符的名称会被截断，并用中间替换 (`___`)

### 3. 冲突解决

当多个服务器公开同名工具时：

1. **首次注册获胜：** 第一个注册工具名称的服务器获得未加前缀的名称
2. **自动加前缀：** 后续服务器获得加前缀的名称：`serverName__toolName`
3. **注册表跟踪：** 工具注册表维护服务器名称与其工具之间的映射

### 4. 模式处理

工具参数模式经过清理以确保与 Vecli API 兼容：

- **`$schema` 属性** 被移除
- **`additionalProperties`** 被剥离
- **带有 `default` 的 `anyOf`** 其默认值被移除（Vertex AI 兼容性）
- **递归处理** 应用于嵌套模式

### 5. 连接管理

发现后：

- **持久连接：** 成功注册工具的服务器保持其连接
- **清理：** 不提供可用工具的服务器的连接会被关闭
- **状态更新：** 最终服务器状态设置为 `CONNECTED` 或 `DISCONNECTED`

## 工具执行流程

当 Vecli 模型决定使用 MCP 工具时，会发生以下执行流程：

### 1. 工具调用

模型生成一个 `FunctionCall`，其中包含：

- **工具名称：** 注册的名称（可能加了前缀）
- **参数：** 与工具参数模式匹配的 JSON 对象

### 2. 确认过程

每个 `DiscoveredMCPTool` 实现了复杂的确认逻辑：

#### 基于信任的绕过

```typescript
if (this.trust) {
  return false; // 无需确认
}
```

#### 动态允许列表

系统为以下内容维护内部允许列表：

- **服务器级别：** `serverName` → 来自此服务器的所有工具都被信任
- **工具级别：** `serverName.toolName` → 此特定工具被信任

#### 用户选择处理

需要确认时，用户可以选择：

- **仅此一次：** 仅执行这一次
- **始终允许此工具：** 添加到工具级别允许列表
- **始终允许此服务器：** 添加到服务器级别允许列表
- **取消：** 中止执行

### 3. 执行

确认后（或信任绕过）：

1. **参数准备：** 参数根据工具的模式进行验证
2. **MCP 调用：** 底层 `CallableTool` 使用以下内容调用服务器：

   ```typescript
   const functionCalls = [
     {
       name: this.serverToolName, // 原始服务器工具名称
       args: params,
     },
   ];
   ```

3. **响应处理：** 结果被格式化为 LLM 上下文和用户显示

### 4. 响应处理

执行结果包含：

- **`llmContent`：** 用于语言模型上下文的原始响应部分
- **`returnDisplay`：** 用于用户显示的格式化输出（通常是 JSON 格式的代码块）

## 如何与您的 MCP 服务器交互

### 使用 `/mcp` 命令

`/mcp` 命令提供有关 MCP 服务器设置的全面信息：

```bash
/mcp
```

这将显示：

- **服务器列表：** 所有配置的 MCP 服务器
- **连接状态：** `CONNECTED`、`CONNECTING` 或 `DISCONNECTED`
- **服务器详细信息：** 配置摘要（不包括敏感数据）
- **可用工具：** 每个服务器的工具列表及其描述
- **发现状态：** 整体发现过程状态

### 示例 `/mcp` 输出

```
MCP 服务器状态:

📡 pythonTools (已连接)
  命令: python -m my_mcp_server --port 8080
  工作目录: ./mcp-servers/python
  超时: 15000ms
  工具: calculate_sum, file_analyzer, data_processor

🔌 nodeServer (已断开)
  命令: node dist/server.js --verbose
  错误: 连接被拒绝

🐳 dockerizedServer (已连接)
  命令: docker run -i --rm -e API_KEY my-mcp-server:latest
  工具: docker__deploy, docker__status

发现状态: 已完成
```

### 工具使用

发现后，MCP 工具对 Vecli 模型来说就像内置工具一样可用。模型将自动：

1. **选择合适的工具** 基于您的请求
2. **显示确认对话框** （除非服务器受信任）
3. **执行工具** 使用正确的参数
4. **以用户友好的格式显示结果**

## 状态监控和故障排除

### 连接状态

MCP 集成跟踪几种状态：

#### 服务器状态 (`MCPServerStatus`)

- **`DISCONNECTED`:** 服务器未连接或有错误
- **`CONNECTING`:** 正在进行连接尝试
- **`CONNECTED`:** 服务器已连接并准备就绪

#### 发现状态 (`MCPDiscoveryState`)

- **`NOT_STARTED`:** 发现尚未开始
- **`IN_PROGRESS`:** 当前正在发现服务器
- **`COMPLETED`:** 发现已完成（有或没有错误）

### 常见问题和解决方案

#### 服务器无法连接

**症状：** 服务器显示 `DISCONNECTED` 状态

**故障排除：**

1. **检查配置：** 验证 `command`、`args` 和 `cwd` 是否正确
2. **手动测试：** 直接运行服务器命令以确保其正常工作
3. **检查依赖项：** 确保所有必需的包都已安装
4. **查看日志：** 在 CLI 输出中查找错误消息
5. **验证权限：** 确保 CLI 可以执行服务器命令

#### 未发现工具

**症状：** 服务器连接但没有可用的工具

**故障排除：**

1. **验证工具注册：** 确保您的服务器实际注册了工具
2. **检查 MCP 协议：** 确认您的服务器正确实现了 MCP 工具列表
3. **查看服务器日志：** 检查 stderr 输出以查找服务器端错误
4. **测试工具列表：** 手动测试服务器的工具发现端点

#### 工具无法执行

**症状：** 工具被发现但在执行期间失败

**故障排除：**

1. **参数验证：** 确保您的工具接受预期的参数
2. **模式兼容性：** 验证您的输入模式是有效的 JSON 模式
3. **错误处理：** 检查您的工具是否抛出未处理的异常
4. **超时问题：** 考虑增加 `timeout` 设置

#### 沙盒兼容性

**症状：** 启用沙盒时 MCP 服务器失败

**解决方案：**

1. **基于 Docker 的服务器：** 使用包含所有依赖项的 Docker 容器
2. **路径可访问性：** 确保沙盒环境中可以访问服务器可执行文件
3. **网络访问：** 配置沙盒以允许必要的网络连接
4. **环境变量：** 验证所需的环境变量是否已传递

### 调试技巧

1. **启用调试模式：** 使用 `--debug` 运行 CLI 以获取详细输出
2. **检查 stderr：** MCP 服务器 stderr 被捕获并记录（INFO 消息被过滤）
3. **测试隔离：** 在集成之前独立测试您的 MCP 服务器
4. **增量设置：** 在添加复杂功能之前从简单工具开始
5. **频繁使用 `/mcp`：** 在开发过程中监控服务器状态

## 重要说明

### 安全注意事项

- **信任设置：** `trust` 选项绕过所有确认对话框。请谨慎使用，仅用于您完全控制的服务器
- **访问令牌：** 配置包含 API 密钥或令牌的环境变量时要注意安全
- **沙盒兼容性：** 使用沙盒时，确保 MCP 服务器在沙盒环境中可用
- **私人数据：** 使用范围广泛的个人访问令牌可能导致存储库之间的信息泄露

### 性能和资源管理

- **连接持久性：** CLI 保持与成功注册工具的服务器的持久连接
- **自动清理：** 到不提供工具的服务器的连接会自动关闭
- **超时管理：** 根据服务器的响应特性配置适当的超时
- **资源监控：** MCP 服务器作为单独的进程运行并消耗系统资源

### 模式兼容性

- **属性剥离：** 系统会自动移除某些模式属性（`$schema`、`additionalProperties`）以确保与 Vecli API 兼容
- **名称清理：** 工具名称会自动清理以满足 API 要求
- **冲突解决：** 服务器之间的工具名称冲突通过自动加前缀解决

这种全面的集成使 MCP 服务器成为扩展 VeCLI 功能的强大方式，同时保持安全性、可靠性和易用性。

## 从工具返回富内容

MCP 工具不仅限于返回简单文本。您可以返回富多部分内容，包括文本、图像、音频和其他二进制数据，作为单个工具响应。这使您能够构建强大的工具，可以在单个回合中向模型提供多样化的信息。

所有从工具返回的数据都会被处理并作为上下文发送给模型，以供其下一次生成使用，使其能够推理或总结提供的信息。

### 工作原理

要返回富内容，您的工具响应必须遵循 MCP 规范中的 [`CallToolResult`](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#tool-result)。结果的 `content` 字段应该是一个 `ContentBlock` 对象数组。VeCLI 将正确处理此数组，将文本与二进制数据分离并打包给模型。

您可以在 `content` 数组中混合和匹配不同的内容块类型。支持的块类型包括：

- `text`
- `image`
- `audio`
- `resource` (嵌入内容)
- `resource_link`

### 示例：返回文本和图像

以下是一个有效的 MCP 工具 JSON 响应示例，该响应同时返回文本描述和图像：

```json
{
  "content": [
    {
      "type": "text",
      "text": "这是您请求的徽标。"
    },
    {
      "type": "image",
      "data": "BASE64_ENCODED_IMAGE_DATA_HERE",
      "mimeType": "image/png"
    },
    {
      "type": "text",
      "text": "徽标于 2025 年创建。"
    }
  ]
}
```

当 VeCLI 收到此响应时，它将：

1.  提取所有文本并将其组合成一个 `functionResponse` 部分供模型使用。
2.  将图像数据作为单独的 `inlineData` 部分呈现。
3.  在 CLI 中提供一个干净、用户友好的摘要，表明已收到文本和图像。

这使您能够构建复杂的工具，向 Vecli 模型提供丰富的多模态上下文。

## 作为斜杠命令的 MCP 提示

除了工具，MCP 服务器还可以公开预定义的提示，这些提示可以在 VeCLI 中作为斜杠命令执行。这使您能够为常见或复杂的查询创建快捷方式，可以通过名称轻松调用。

### 在服务器上定义提示

以下是一个定义提示的小型 stdio MCP 服务器示例：

```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'prompt-server',
  version: '1.0.0',
});

server.registerPrompt(
  'poem-writer',
  {
    title: '诗歌作家',
    description: '写一首优美的俳句',
    argsSchema: { title: z.string(), mood: z.string().optional() },
  },
  ({ title, mood }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `写一首俳句${mood ? `，情绪为 ${mood}` : ''}，标题为 ${title}。请注意，俳句是 5 个音节，然后是 7 个音节，再然后是 5 个音节 `,
        },
      },
    ],
  }),
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

这可以在 `settings.json` 中的 `mcpServers` 下包含：

```json
{
  "mcpServers": {
    "nodeServer": {
      "command": "node",
      "args": ["filename.ts"]
    }
  }
}
```

### 调用提示

发现提示后，您可以使用其名称作为斜杠命令来调用它。CLI 将自动处理参数解析。

```bash
/poem-writer --title="VeCLI" --mood="reverent"
```

或者，使用位置参数：

```bash
/poem-writer "VeCLI" reverent
```

运行此命令时，VeCLI 在 MCP 服务器上执行 `prompts/get` 方法并提供参数。服务器负责将参数代入提示模板并返回最终提示文本。CLI 然后将此提示发送给模型执行。这提供了一种方便的方式来自动化和共享常见工作流。

## 使用 `vecli mcp` 管理 MCP 服务器

虽然您总是可以通过手动编辑 `settings.json` 文件来配置 MCP 服务器，但 VeCLI 提供了一组方便的命令来以编程方式管理您的服务器配置。这些命令简化了添加、列出和删除 MCP 服务器的过程，而无需直接编辑 JSON 文件。

### 添加服务器 (`vecli mcp add`)

`add` 命令在您的 `settings.json` 中配置一个新的 MCP 服务器。根据范围 (`-s, --scope`)，它将被添加到用户配置 `~/.ve/settings.json` 或项目配置 `.ve/settings.json` 文件中。

**命令：**

```bash
vecli mcp add [options] <name> <commandOrUrl> [args...]
```

- `<name>`: 服务器的唯一名称。
- `<commandOrUrl>`: 要执行的命令（用于 `stdio`）或 URL（用于 `http`/`sse`）。
- `[args...]`: `stdio` 命令的可选参数。

**选项（标志）：**

- `-s, --scope`: 配置范围（用户或项目）。[默认: "project"]
- `-t, --transport`: 传输类型（stdio, sse, http）。[默认: "stdio"]
- `-e, --env`: 设置环境变量（例如 -e KEY=value）。
- `-H, --header`: 为 SSE 和 HTTP 传输设置 HTTP 标头（例如 -H "X-Api-Key: abc123" -H "Authorization: Bearer abc123"）。
- `--timeout`: 设置连接超时时间（毫秒）。
- `--trust`: 信任服务器（绕过所有工具调用确认提示）。
- `--description`: 设置服务器的描述。
- `--include-tools`: 以逗号分隔的要包含的工具列表。
- `--exclude-tools`: 以逗号分隔的要排除的工具列表。

#### 添加一个 stdio 服务器

这是运行本地服务器的默认传输。

```bash
# 基本语法
vecli mcp add <name> <command> [args...]

# 示例: 添加一个本地服务器
vecli mcp add my-stdio-server -e API_KEY=123 /path/to/server arg1 arg2 arg3

# 示例: 添加一个本地 python 服务器
vecli mcp add python-server python server.py --port 8080
```

#### 添加一个 HTTP 服务器

此传输用于使用可流式 HTTP 传输的服务器。

```bash
# 基本语法
vecli mcp add --transport http <name> <url>

# 示例: 添加一个 HTTP 服务器
vecli mcp add --transport http http-server https://api.example.com/mcp/

# 示例: 添加一个带有身份验证标头的 HTTP 服务器
vecli mcp add --transport http secure-http https://api.example.com/mcp/ --header "Authorization: Bearer abc123"
```

#### 添加一个 SSE 服务器

此传输用于使用服务器发送事件 (SSE) 的服务器。

```bash
# 基本语法
vecli mcp add --transport sse <name> <url>

# 示例: 添加一个 SSE 服务器
vecli mcp add --transport sse sse-server https://api.example.com/sse/

# 示例: 添加一个带有身份验证标头的 SSE 服务器
vecli mcp add --transport sse secure-sse https://api.example.com/sse/ --header "Authorization: Bearer abc123"
```

### 列出服务器 (`vecli mcp list`)

要查看当前配置的所有 MCP 服务器，请使用 `list` 命令。它显示每个服务器的名称、配置详细信息和连接状态。

**命令：**

```bash
vecli mcp list
```

**示例输出：**

```sh
✓ stdio-server: 命令: python3 server.py (stdio) - 已连接
✓ http-server: https://api.example.com/mcp (http) - 已连接
✗ sse-server: https://api.example.com/sse (sse) - 已断开
```

### 删除服务器 (`vecli mcp remove`)

要从配置中删除服务器，请使用 `remove` 命令和服务器名称。

**命令：**

```bash
vecli mcp remove <name>
```

**示例：**

```bash
vecli mcp remove my-server
```

这将根据范围 (`-s, --scope`) 在相应的 `settings.json` 文件中的 `mcpServers` 对象中查找并删除 "my-server" 条目。