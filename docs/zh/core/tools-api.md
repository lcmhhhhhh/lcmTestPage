# VeCLI 核心：工具 API

VeCLI 核心 (`packages/core`) 具有一个强大的系统，用于定义、注册和执行工具。这些工具扩展了火山引擎模型的功能，使其能够与本地环境交互、获取网络内容并执行各种超越简单文本生成的操作。

## 核心概念

- **工具 (`tools.ts`):** 一个接口和基类 (`BaseTool`)，它定义了所有工具的契约。每个工具必须具有：
  - `name`: 一个唯一的内部名称（在调用火山引擎 API 时使用）。
  - `displayName`: 一个用户友好的名称。
  - `description`: 对工具功能的清晰解释，该解释将提供给火山引擎模型。
  - `parameterSchema`: 定义工具接受的参数的 JSON 模式。这对于火山引擎模型理解如何正确调用工具至关重要。
  - `validateToolParams()`: 一个用于验证传入参数的方法。
  - `getDescription()`: 一个在执行前提供工具将使用特定参数执行什么操作的用户可读描述的方法。
  - `shouldConfirmExecute()`: 一个用于确定执行前是否需要用户确认的方法（例如，对于潜在的破坏性操作）。
  - `execute()`: 执行工具操作并返回 `ToolResult` 的核心方法。

- **`ToolResult` (`tools.ts`):** 定义工具执行结果结构的接口：
  - `llmContent`: 要包含在发送回 LLM 以供上下文使用的历史记录中的事实内容。这可以是一个简单的字符串或 `PartListUnion`（一个 `Part` 对象和字符串的数组）以支持富内容。
  - `returnDisplay`: 一个用户友好的字符串（通常是 Markdown）或特殊对象（如 `FileDiff`），用于在 CLI 中显示。

- **返回富内容:** 工具不仅限于返回简单文本。`llmContent` 可以是一个 `PartListUnion`，它是一个可以包含 `Part` 对象（用于图像、音频等）和 `string` 的混合数组。这允许单个工具执行返回多个富内容片段。

- **工具注册表 (`tool-registry.ts`):** 一个类 (`ToolRegistry`)，负责：
  - **注册工具:** 持有所有可用内置工具的集合（例如，`ReadFileTool`、`ShellTool`）。
  - **发现工具:** 它还可以动态发现工具：
    - **基于命令的发现:** 如果在设置中配置了 `tools.discoveryCommand`，则会执行此命令。它应该输出描述自定义工具的 JSON，然后将这些工具注册为 `DiscoveredTool` 实例。
    - **基于 MCP 的发现:** 如果配置了 `mcp.serverCommand`，注册表可以连接到模型上下文协议 (MCP) 服务器以列出和注册工具 (`DiscoveredMCPTool`)。
  - **提供模式:** 将所有已注册工具的 `FunctionDeclaration` 模式暴露给火山引擎模型，以便它知道哪些工具可用以及如何使用它们。
  - **检索工具:** 允许核心通过名称获取特定工具以供执行。

## 内置工具

核心包含一套预定义的工具，通常位于 `packages/core/src/tools/` 中。这些工具包括：

- **文件系统工具:**
  - `LSTool` (`ls.ts`): 列出目录内容。
  - `ReadFileTool` (`read-file.ts`): 读取单个文件的内容。它接受一个 `absolute_path` 参数，该参数必须是绝对路径。
  - `WriteFileTool` (`write-file.ts`): 将内容写入文件。
  - `GrepTool` (`grep.ts`): 在文件中搜索模式。
  - `GlobTool` (`glob.ts`): 查找与 glob 模式匹配的文件。
  - `EditTool` (`edit.ts`): 对文件执行就地修改（通常需要确认）。
  - `ReadManyFilesTool` (`read-many-files.ts`): 从多个文件或 glob 模式读取并连接内容（在 CLI 中由 `@` 命令使用）。
- **执行工具:**
  - `ShellTool` (`shell.ts`): 执行任意 shell 命令（需要仔细的沙盒和用户确认）。
- **网络工具:**
  - `WebFetchTool` (`web-fetch.ts`): 从 URL 获取内容。
  - `WebSearchTool` (`web-search.ts`): 执行网络搜索。
- **记忆工具:**
  - `MemoryTool` (`memoryTool.ts`): 与 AI 的记忆交互。

这些工具都扩展了 `BaseTool` 并实现了其特定功能所需的方法。

## 工具执行流程

1.  **模型请求:** 火山引擎模型根据用户的提示和提供的工具模式，决定使用一个工具，并在其响应中返回一个 `FunctionCall` 部分，指定工具名称和参数。
2.  **核心接收请求:** 核心解析此 `FunctionCall`。
3.  **工具检索:** 它在 `ToolRegistry` 中查找请求的工具。
4.  **参数验证:** 调用工具的 `validateToolParams()` 方法。
5.  **确认 (如果需要):**
    - 调用工具的 `shouldConfirmExecute()` 方法。
    - 如果它返回确认详情，核心会将其传达回 CLI，CLI 会提示用户。
    - 用户的决定（例如，继续、取消）会被发送回核心。
6.  **执行:** 如果已验证并确认（或者如果不需要确认），核心会使用提供的参数和 `AbortSignal`（用于潜在取消）调用工具的 `execute()` 方法。
7.  **结果处理:** 从 `execute()` 接收到的 `ToolResult` 会被核心接收。
8.  **对模型的响应:** `ToolResult` 中的 `llmContent` 会被打包为 `FunctionResponse` 并发送回火山引擎模型，以便它能够继续生成面向用户的响应。
9.  **向用户显示:** `ToolResult` 中的 `returnDisplay` 会被发送到 CLI 以向用户显示工具执行了什么操作。

## 使用自定义工具扩展

虽然在提供的文件中没有明确详细说明普通最终用户可以直接以编程方式注册新工具的主要工作流程，但架构通过以下方式支持扩展：

- **基于命令的发现:** 高级用户或项目管理员可以在 `settings.json` 中定义 `tools.discoveryCommand`。当 VeCLI 核心运行此命令时，该命令应输出一个 `FunctionDeclaration` 对象的 JSON 数组。然后核心会将这些作为 `DiscoveredTool` 实例提供。相应的 `tools.callCommand` 将负责实际执行这些自定义工具。
- **MCP 服务器:** 对于更复杂的场景，可以设置一个或多个 MCP 服务器，并通过 `settings.json` 中的 `mcpServers` 设置进行配置。VeCLI 核心然后可以发现并使用这些服务器暴露的工具。如前所述，如果您有多个 MCP 服务器，工具名称将使用您配置中的服务器名称作为前缀（例如，`serverAlias__actualToolName`）。

此工具系统提供了一种灵活而强大的方式来增强火山引擎模型的功能，使 VeCLI 成为处理各种任务的多功能助手。