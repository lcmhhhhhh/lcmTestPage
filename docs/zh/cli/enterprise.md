# 企业版 VeCLI

本文档概述了在企业环境中部署和管理 VeCLI 的配置模式和最佳实践。通过利用系统级设置，管理员可以强制执行安全策略、管理工具访问并确保所有用户的一致体验。

> **安全说明：** 本文档中描述的模式旨在帮助管理员为使用 VeCLI 创建更受控制和安全的环境。但是，它们不应被视为万无一失的安全边界。一个拥有足够本地机器权限的 determined 用户可能仍然能够绕过这些配置。这些措施旨在防止意外误用并在受管理的环境中强制执行公司策略，而不是防御拥有本地管理权限的恶意行为者。

## 集中配置：系统设置文件

企业管理员最强大的工具是系统范围的设置文件。这些文件允许您定义基线配置 (`system-defaults.json`) 和一组适用于机器上所有用户的覆盖 (`settings.json`)。有关配置选项的完整概述，请参阅 [配置文档](./configuration.md)。

设置从四个文件中合并。单值设置（如 `theme`）的优先级顺序为：

1. 系统默认值 (`system-defaults.json`)
2. 用户设置 (`~/.ve/settings.json`)
3. 工作区设置 (`<project>/.ve/settings.json`)
4. 系统覆盖 (`settings.json`)

这意味着系统覆盖文件具有最终决定权。对于数组 (`includeDirectories`) 或对象 (`mcpServers`) 的设置，值会被合并。

**合并和优先级示例：**

以下是不同级别设置如何组合的示例。

- **系统默认值 `system-defaults.json`：**

  ```json
  {
    "ui": {
      "theme": "default-corporate-theme"
    },
    "context": {
      "includeDirectories": ["/etc/gemini-cli/common-context"]
    }
  }
  ```

- **用户 `settings.json` (`~/.ve/settings.json`)：**

  ```json
  {
    "ui": {
      "theme": "user-preferred-dark-theme"
    },
    "mcpServers": {
      "corp-server": {
        "command": "/usr/local/bin/corp-server-dev"
      },
      "user-tool": {
        "command": "npm start --prefix ~/tools/my-tool"
      }
    },
    "context": {
      "includeDirectories": ["~/gemini-context"]
    }
  }
  ```

- **工作区 `settings.json` (`<project>/.ve/settings.json`)：**

  ```json
  {
    "ui": {
      "theme": "project-specific-light-theme"
    },
    "mcpServers": {
      "project-tool": {
        "command": "npm start"
      }
    },
    "context": {
      "includeDirectories": ["./project-context"]
    }
  }
  ```

- **系统覆盖 `settings.json`：**
  ```json
  {
    "ui": {
      "theme": "system-enforced-theme"
    },
    "mcpServers": {
      "corp-server": {
        "command": "/usr/local/bin/corp-server-prod"
      }
    },
    "context": {
      "includeDirectories": ["/etc/gemini-cli/global-context"]
    }
  }
  ```

这会导致以下合并配置：

- **最终合并配置：**
  ```json
  {
    "ui": {
      "theme": "system-enforced-theme"
    },
    "mcpServers": {
      "corp-server": {
        "command": "/usr/local/bin/corp-server-prod"
      },
      "user-tool": {
        "command": "npm start --prefix ~/tools/my-tool"
      },
      "project-tool": {
        "command": "npm start"
      }
    },
    "context": {
      "includeDirectories": [
        "/etc/gemini-cli/common-context",
        "~/gemini-context",
        "./project-context",
        "/etc/gemini-cli/global-context"
      ]
    }
  }
  ```

**原因：**

- **`theme`**：使用系统覆盖中的值 (`system-enforced-theme`)，因为它具有最高优先级。
- **`mcpServers`**：对象被合并。系统覆盖中的 `corp-server` 定义优先于用户的定义。唯一的 `user-tool` 和 `project-tool` 被包含。
- **`includeDirectories`**：数组按系统默认值、用户、工作区和系统覆盖的顺序连接。

- **位置**：
  - **Linux**：`/etc/gemini-cli/settings.json`
  - **Windows**：`C:\ProgramData\gemini-cli\settings.json`
  - **macOS**：`/Library/Application Support/GeminiCli/settings.json`
  - 可以使用 `GEMINI_CLI_SYSTEM_SETTINGS_PATH` 环境变量覆盖路径。
- **控制**：此文件应由系统管理员管理，并使用适当的文件权限进行保护，以防止用户未经授权修改。

通过使用系统设置文件，您可以强制执行以下描述的安全和配置模式。

## 限制工具访问

您可以通过控制 Gemini 模型可以使用哪些工具来显著增强安全性。这是通过 `tools.core` 和 `tools.exclude` 设置实现的。有关可用工具的列表，请参阅 [工具文档](../tools/index.md)。

### 使用 `coreTools` 进行允许列表

最安全的方法是将允许用户执行的工具和命令明确添加到允许列表中。这可以防止使用任何未在批准列表中的工具。

**示例：** 仅允许安全的只读文件操作和列出文件。

```json
{
  "tools": {
    "core": ["ReadFileTool", "GlobTool", "ShellTool(ls)"]
  }
}
```

### 使用 `excludeTools` 进行阻止列表

或者，您可以将环境中被认为危险的特定工具添加到阻止列表中。

**示例：** 防止使用 shell 工具删除文件。

```json
{
  "tools": {
    "exclude": ["ShellTool(rm -rf)"]
  }
}
```

**安全说明：** 使用 `excludeTools` 进行阻止列表不如使用 `coreTools` 进行允许列表安全，因为它依赖于阻止已知的坏命令，而聪明的用户可能会找到绕过基于字符串的简单阻止的方法。**建议使用允许列表方法。**

## 管理自定义工具 (MCP 服务器)

如果您的组织通过 [模型上下文协议 (MCP) 服务器](../core/tools-api.md) 使用自定义工具，则必须了解如何管理服务器配置以有效应用安全策略。

### MCP 服务器配置如何合并

VeCLI 从三个级别加载 `settings.json` 文件：系统、工作区和用户。当涉及到 `mcpServers` 对象时，这些配置会被**合并**：

1.  **合并：** 来自所有三个级别的服务器列表被合并成一个单一列表。
2.  **优先级：** 如果在多个级别定义了具有**相同名称**的服务器（例如，在系统和用户设置中都存在名为 `corp-api` 的服务器），则使用最高优先级级别的定义。优先级顺序为：**系统 > 工作区 > 用户**。

这意味着用户**无法**覆盖已在系统级设置中定义的服务器定义。但是，他们**可以**添加具有唯一名称的新服务器。

### 强制执行工具目录

MCP 工具生态系统安全性取决于定义规范服务器并将它们的名称添加到允许列表的组合。

### 限制 MCP 服务器内的工具

为了获得更高的安全性，尤其是在处理第三方 MCP 服务器时，您可以限制从服务器暴露给模型的特定工具。这是通过在服务器定义中使用 `includeTools` 和 `excludeTools` 属性来完成的。这允许您使用服务器工具的子集，而不允许潜在的危险工具。

遵循最小权限原则，强烈建议使用 `includeTools` 创建一个仅包含必要工具的允许列表。

**示例：** 仅允许来自第三方 MCP 服务器的 `code-search` 和 `get-ticket-details` 工具，即使该服务器提供其他工具如 `delete-ticket`。

```json
{
  "mcp": {
    "allowed": ["third-party-analyzer"]
  },
  "mcpServers": {
    "third-party-analyzer": {
      "command": "/usr/local/bin/start-3p-analyzer.sh",
      "includeTools": ["code-search", "get-ticket-details"]
    }
  }
}
```

#### 更安全的模式：在系统设置中定义并添加到允许列表

为了创建一个安全的、集中管理的工具目录，系统管理员**必须**在系统级 `settings.json` 文件中执行以下两项操作：

1.  **定义完整配置**：在 `mcpServers` 对象中为每个已批准的服务器定义完整配置。这确保即使用户定义了同名服务器，安全的系统级定义也会优先。
2.  **添加名称**：使用 `mcp.allowed` 设置将这些服务器的名称添加到允许列表中。这是一个关键的安全步骤，可以防止用户运行任何不在该列表中的服务器。如果省略此设置，CLI 将合并并允许用户定义的任何服务器。

**示例系统 `settings.json`：**

1. 将所有已批准服务器的_名称_添加到允许列表中。
   这将防止用户添加自己的服务器。

2. 为允许列表中的每个服务器提供规范的_定义_。

```json
{
  "mcp": {
    "allowed": ["corp-data-api", "source-code-analyzer"]
  },
  "mcpServers": {
    "corp-data-api": {
      "command": "/usr/local/bin/start-corp-api.sh",
      "timeout": 5000
    },
    "source-code-analyzer": {
      "command": "/usr/local/bin/start-analyzer.sh"
    }
  }
}
```

这种模式更安全，因为它同时使用了定义和允许列表。用户定义的任何服务器要么被系统定义覆盖（如果它有相同的名称），要么因为它的名称不在 `mcp.allowed` 列表中而被阻止。

### 较不安全的模式：省略允许列表

如果管理员定义了 `mcpServers` 对象但未能同时指定 `mcp.allowed` 允许列表，则用户可能会添加自己的服务器。

**示例系统 `settings.json`：**

此配置定义了服务器但未强制执行允许列表。
管理员未包含 "mcp.allowed" 设置。

```json
{
  "mcpServers": {
    "corp-data-api": {
      "command": "/usr/local/bin/start-corp-api.sh"
    }
  }
}
```

在这种情况下，用户可以在他们的本地 `settings.json` 中添加自己的服务器。由于没有 `mcp.allowed` 列表来过滤合并结果，用户的服务器将被添加到可用工具列表中并被允许运行。

## 强制执行沙盒以确保安全

为了减轻潜在有害操作的风险，您可以强制所有工具执行都在沙盒中进行。沙盒在容器化环境中隔离工具执行。

**示例：** 强制所有工具执行都在 Docker 沙盒中进行。

```json
{
  "tools": {
    "sandbox": "docker"
  }
}
```

您还可以使用 `--sandbox-image` 命令行参数指定自定义的强化 Docker 镜像，或者通过构建自定义的 `sandbox.Dockerfile` 来实现，如 [沙盒文档](./configuration.md#sandboxing) 中所述。

## 通过代理控制网络访问

在具有严格网络策略的企业环境中，您可以配置 VeCLI 通过企业代理路由所有出站流量。这可以通过环境变量设置，但也可以通过 `mcpServers` 配置为自定义工具强制执行。

**示例（针对 MCP 服务器）：**

```json
{
  "mcpServers": {
    "proxied-server": {
      "command": "node",
      "args": ["mcp_server.js"],
      "env": {
        "HTTP_PROXY": "http://proxy.example.com:8080",
        "HTTPS_PROXY": "http://proxy.example.com:8080"
      }
    }
  }
}
```

## 遥测和审计

出于审计和监控目的，您可以配置 VeCLI 将遥测数据发送到中央位置。这使您能够跟踪工具使用情况和其他事件。有关更多信息，请参阅 [遥测文档](../telemetry.md)。

**示例：** 启用遥测并将其发送到本地 OTLP 收集器。如果未指定 `otlpEndpoint`，它默认为 `http://localhost:4317`。

```json
{
  "telemetry": {
    "enabled": true,
    "target": "gcp",
    "logPrompts": false
  }
}
```

**注意：** 在企业环境中，请确保将 `logPrompts` 设置为 `false`，以避免收集用户提示中的潜在敏感信息。

## 身份验证

您可以通过在系统级 `settings.json` 文件中设置 `enforcedAuthType` 来为所有用户强制执行特定的身份验证方法。这可以防止用户选择不同的身份验证方法。有关更多详细信息，请参阅 [身份验证文档](./authentication.md)。

**示例：** 强制所有用户使用 Google 登录。

```json
{
  "enforcedAuthType": "oauth-personal"
}
```

如果用户配置了不同的身份验证方法，系统将提示他们切换到强制的方法。在非交互模式下，如果配置的身份验证方法与强制的方法不匹配，CLI 将以错误退出。

## 综合应用：示例系统 `settings.json`

以下是一个系统 `settings.json` 文件的示例，它结合了上述几种模式，为 VeCLI 创建了一个安全、受控的环境。

```json
{
  "tools": {
    "sandbox": "docker",
    "core": [
      "ReadFileTool",
      "GlobTool",
      "ShellTool(ls)",
      "ShellTool(cat)",
      "ShellTool(grep)"
    ]
  },
  "mcp": {
    "allowed": ["corp-tools"]
  },
  "mcpServers": {
    "corp-tools": {
      "command": "/opt/gemini-tools/start.sh",
      "timeout": 5000
    }
  },
  "telemetry": {
    "enabled": true,
    "target": "gcp",
    "otlpEndpoint": "https://telemetry-prod.example.com:4317",
    "logPrompts": false
  },
  "advanced": {
    "bugCommand": {
      "urlTemplate": "https://servicedesk.example.com/new-ticket?title={title}&details={info}"
    }
  },
  "privacy": {
    "usageStatisticsEnabled": false
  }
}
```

此配置：

- 强制所有工具执行都在 Docker 沙盒中进行。
- 严格使用允许列表，仅包含少量安全的 shell 命令和文件工具。
- 定义并允许一个企业 MCP 服务器用于自定义工具。
- 启用遥测以进行审计，但不记录提示内容。
- 将 `/bug` 命令重定向到内部工单系统。
- 禁用常规使用统计信息收集。