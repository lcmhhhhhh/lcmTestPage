# 教程

本页包含与 VeCLI 交互的教程。

## 设置模型上下文协议（MCP）服务器

> [!CAUTION]
> 在使用第三方 MCP 服务器之前，请确保您信任其来源并了解它提供的工具。您使用第三方服务器的风险由您自己承担。

本教程演示如何设置 MCP 服务器，以 [GitHub MCP 服务器](https://github.com/github/github-mcp-server) 为例。GitHub MCP 服务器提供与 GitHub 存储库交互的工具，例如创建问题和评论拉取请求。

### 先决条件

在开始之前，请确保您已安装并配置以下内容：

- **Docker：** 安装并运行 [Docker]。
- **GitHub 个人访问令牌（PAT）：** 创建具有必要范围的新[经典]或[细粒度] PAT。

[Docker]: https://www.docker.com/
[经典]: https://github.com/settings/tokens/new
[细粒度]: https://github.com/settings/personal-access-tokens/new

### 指南

#### 在 `settings.json` 中配置 MCP 服务器

在项目的根目录中，创建或打开 [`.ve/settings.json` 文件](./configuration.md)。在文件中，添加 `mcpServers` 配置块，该块提供如何启动 GitHub MCP 服务器的说明。

```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  }
}
```

#### 设置您的 GitHub 令牌

> [!CAUTION]
> 使用具有访问个人和私有存储库权限的广泛范围个人访问令牌可能导致私有存储库的信息泄露到公共存储库中。我们建议使用不共享对公共和私有存储库访问权限的细粒度访问令牌。

使用环境变量存储您的 GitHub PAT：

```bash
GITHUB_PERSONAL_ACCESS_TOKEN="pat_YourActualGitHubTokenHere"
```

VeCLI 在您在 `settings.json` 文件中定义的 `mcpServers` 配置中使用此值。

#### 启动 VeCLI 并验证连接

当您启动 VeCLI 时，它会自动读取您的配置并在后台启动 GitHub MCP 服务器。然后您可以使用自然语言提示要求 VeCLI 执行 GitHub 操作。例如：

```bash
"获取 'foo/bar' 存储库中分配给我的所有开放问题并对其进行优先级排序"
```