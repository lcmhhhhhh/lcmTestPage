# VeCLI

在 VeCLI 中，`packages/cli` 是用户与 Vecli AI 模型及其相关工具发送和接收提示的前端。有关 VeCLI 的一般概述，请参阅 [主文档页面](../index.md)。

## 导航此部分

- **[身份验证](./authentication.md)：** 设置与 Volcengine AI 服务身份验证的指南。
- **[命令](./commands.md)：** VeCLI 命令的参考（例如，`/help`、`/tools`、`/theme`）。
- **[配置](./configuration.md)：** 使用配置文件定制 VeCLI 行为的指南。
- **[企业版](./enterprise.md)：** 企业配置指南。
- **[令牌缓存](./token-caching.md)：** 通过令牌缓存优化 API 成本。
- **[主题](./themes.md)**：使用不同主题自定义 CLI 外观的指南。
- **[教程](tutorials.md)**：展示如何使用 VeCLI 自动化开发任务的教程。

## 非交互模式

VeCLI 可以在非交互模式下运行，这对于脚本和自动化非常有用。在此模式下，您可以将输入通过管道传输到 CLI，它会执行命令，然后退出。

以下示例从您的终端将命令通过管道传输到 VeCLI：

```bash
echo "什么是微调？" | vecli
```

VeCLI 执行命令并将输出打印到您的终端。请注意，您可以通过使用 `--prompt` 或 `-p` 标志来实现相同的行为。例如：

```bash
vecli -p "什么是微调？"
```