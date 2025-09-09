# 欢迎使用 VeCLI 文档

本文档提供了安装、使用和开发 VeCLI 的综合指南。此工具允许您通过命令行界面与火山引擎模型进行交互。

## 概述

VeCLI 将火山引擎模型的功能带到您的终端，提供一个交互式的读取-求值-打印循环 (REPL) 环境。VeCLI 由一个客户端应用程序 (`packages/cli`) 组成，它与一个本地服务器 (`packages/core`) 通信，后者负责管理对火山引擎 API 及其 AI 模型的请求。VeCLI 还包含多种工具，用于执行文件系统操作、运行 shell 和网络获取等任务，这些工具由 `packages/core` 管理。

## 导航文档

本文档组织如下：

- **[执行与部署](./deployment.md):** 运行 VeCLI 的信息。
- **[架构概述](./architecture.md):** 了解 VeCLI 的高层设计，包括其组件及交互方式。
- **CLI 使用:** `packages/cli` 的文档。
  - **[CLI 介绍](./cli/index.md):** 命令行界面的概述。
  - **[命令](./cli/commands.md):** 可用 CLI 命令的描述。
  - **[配置](./cli/configuration.md):** 配置 CLI 的信息。
  - **[检查点](./checkpointing.md):** 检查点功能的文档。
  - **[扩展](./extension.md):** 如何使用新功能扩展 CLI。
  - **[IDE 集成](./ide-integration.md):** 将 CLI 连接到您的编辑器。
- **核心详情:** `packages/core` 的文档。
  - **[核心介绍](./core/index.md):** 核心组件的概述。
  - **[工具 API](./core/tools-api.md):** 有关核心如何管理和暴露工具的信息。
- **工具:**
  - **[工具概述](./tools/index.md):** 可用工具的概述。
  - **[文件系统工具](./tools/file-system.md):** `read_file` 和 `write_file` 工具的文档。
  - **[多文件读取工具](./tools/multi-file.md):** `read_many_files` 工具的文档。
  - **[Shell 工具](./tools/shell.md):** `run_shell_command` 工具的文档。
  - **[网络获取工具](./tools/web-fetch.md):** `web_fetch` 工具的文档。
  - **[记忆工具](./tools/memory.md):** `save_memory` 工具的文档。
- **[贡献与开发指南](../CONTRIBUTING.md):** 面向贡献者和开发者的资讯，包括设置、构建、测试和编码规范。
- **[NPM](./npm.md):** 有关项目包结构的详细信息。
- **[故障排除指南](./troubleshooting.md):** 解决常见问题和 FAQ。
- **[最佳实践](./examples/vecli-12306-2.md):** 有关于使用 VeCLI 解决 12306 问题的最佳实践。
- **[版本发布](./releases.md):** 有关项目版本发布和部署节奏的信息。

我们希望本文档能帮助您充分利用 VeCLI！
