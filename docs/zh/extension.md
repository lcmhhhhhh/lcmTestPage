# VeCLI 扩展

VeCLI 支持可以用于配置和扩展其功能的扩展。

## 工作原理

在启动时，VeCLI 会在两个位置查找扩展：

1.  `<workspace>/.vecli/extensions`
2.  `<home>/.vecli/extensions`

VeCLI 从这两个位置加载所有扩展。如果两个位置都存在同名扩展，则工作区目录中的扩展优先。

在每个位置内，单个扩展作为一个包含 `vecli-extension.json` 文件的目录存在。例如：

`<workspace>/.vecli/extensions/my-extension/vecli-extension.json`

### `vecli-extension.json`

`vecli-extension.json` 文件包含扩展的配置。该文件具有以下结构：

```json
{
  "name": "my-extension",
  "version": "1.0.0",
  "mcpServers": {
    "my-server": {
      "command": "node my-server.js"
    }
  },
  "contextFileName": "VE.md",
  "excludeTools": ["run_shell_command"]
}
```

- `name`: 扩展的名称。这用于唯一标识扩展，并在扩展命令与用户或项目命令同名时用于冲突解决。
- `version`: 扩展的版本。
- `mcpServers`: 要配置的 MCP 服务器映射。键是服务器的名称，值是服务器配置。这些服务器将在启动时加载，就像在 [`settings.json` 文件](./cli/configuration.md) 中配置的 MCP 服务器一样。如果扩展和 `settings.json` 文件都配置了同名的 MCP 服务器，则 `settings.json` 文件中定义的服务器优先。
- `contextFileName`: 包含扩展上下文的文件名。这将用于从工作区加载上下文。如果未使用此属性，但扩展目录中存在 `VE.md` 文件，则将加载该文件。
- `excludeTools`: 要从模型中排除的工具名称数组。您还可以为支持它的工具指定命令特定的限制，例如 `run_shell_command` 工具。例如，`"excludeTools": ["run_shell_command(rm -rf)"]` 将阻止 `rm -rf` 命令。

当 VeCLI 启动时，它会加载所有扩展并合并其配置。如果存在任何冲突，工作区配置优先。

## 扩展命令

扩展可以通过在扩展目录内的 `commands/` 子目录中放置 TOML 文件来提供 [自定义命令](./cli/commands.md#custom-commands)。这些命令遵循与用户和项目自定义命令相同的格式，并使用标准命名约定。

### 示例

一个名为 `example-extension` 的扩展具有以下结构：

```
.vecli/extensions/example-extension/
├── vecli-extension.json
└── commands/
    ├── deploy.toml
    └── vecli/
        └── sync.toml
```

将提供以下命令：

- `/deploy` - 在帮助中显示为 `[example-extension] Custom command from deploy.toml`
- `/vecli:sync` - 在帮助中显示为 `[example-extension] Custom command from sync.toml`      

### 冲突解决

扩展命令具有最低优先级。当与用户或项目命令发生冲突时：

1. **无冲突**: 扩展命令使用其自然名称（例如，`/deploy`）
2. **有冲突**: 扩展命令使用扩展前缀重命名（例如，`/example-extension.deploy`）

例如，如果用户和 `example-extension` 扩展都定义了一个 `deploy` 命令：

- `/deploy` - 执行用户的 deploy 命令
- `/example-extension.deploy` - 执行扩展的 deploy 命令（标记为 `[example-extension]`）

# 变量

VeCLI 扩展允许在 `vecli-extension.json` 中进行变量替换。如果例如您需要当前目录来使用 `"cwd": "${extensionPath}${/}run.ts"` 运行 MCP 服务器，这将非常有用。

**支持的变量:**

| 变量                   | 描述                                                                                                                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `${extensionPath}`         | 用户文件系统中扩展的完全限定路径，例如 '/Users/username/.vecli/extensions/example-extension'。这不会展开符号链接。 |
| `${/} or ${pathSeparator}` | 路径分隔符（因操作系统而异）。                                                                                                                            |