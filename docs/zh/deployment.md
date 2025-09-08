# VeCLI 执行和部署

本文档描述了如何运行 VeCLI 并解释 VeCLI 使用的部署架构。

## 运行 VeCLI

有几种方法可以运行 VeCLI。您选择的选项取决于您打算如何使用 VeCLI。

---

### 1. 标准安装（推荐给典型用户）

这是推荐给最终用户安装 VeCLI 的方式。它涉及从 NPM 注册表下载 VeCLI 包。

- **全局安装：**

  ```bash
  npm i @volc-iaas-test01/vecli@latest -g
  ```

  然后，从任何地方运行 CLI：

  ```bash
  vecli
  ```

- **NPX 执行：**

  ```bash
  # 从 NPM 执行最新版本，无需全局安装
  npx @volc-iaas-test01/vecli@latest
  ```

---

### 2. 从源代码运行（推荐给 VeCLI 贡献者）

项目的贡献者将希望直接从源代码运行 CLI。

- **开发模式：**
  此方法提供热重载，对积极开发很有用。
  ```bash
  # 从存储库的根目录
  npm run start
  ```
- **类似生产的模式（链接包）：**
  此方法通过链接您的本地包来模拟全局安装。这对于在生产工作流中测试本地构建很有用。

  ```bash
  # 将本地 cli 包链接到您的全局 node_modules
  npm link packages/cli

  # 现在您可以使用 `vecli` 命令运行您的本地版本
  vecli
  ```

---

## 部署架构

上述执行方法由以下架构组件和流程实现：

**NPM 包**

VeCLI 项目是一个 monorepo，将两个核心包发布到 NPM 注册表：

- `@vecli/vecli-core`：后端，处理逻辑和工具执行。
- `@vecli/vecli`：面向用户的前端。

在执行标准安装和从源代码运行 VeCLI 时会使用这些包。

**构建和打包流程**

根据分发渠道，使用两种不同的构建流程：

- **NPM 发布：** 对于发布到 NPM 注册表，`@vecli/vecli-core` 和 `@vecli/vecli` 中的 TypeScript 源代码使用 TypeScript 编译器 (`tsc`) 转译为标准 JavaScript。生成的 `dist/` 目录是 NPM 包中发布的内容。这是 TypeScript 库的标准方法。

- **GitHub `npx` 执行：** 当直接从 GitHub 运行最新版本的 VeCLI 时，`package.json` 中的 `prepare` 脚本会触发不同的流程。该脚本使用 `esbuild` 将整个应用程序及其依赖项捆绑到一个单一的、自包含的 JavaScript 文件中。此捆绑包在用户的机器上即时创建，不会签入存储库。



## 发布流程

发布流程通过 GitHub Actions 自动化。发布工作流执行以下操作：

1.  使用 `tsc` 构建 NPM 包。
2.  将 NPM 包发布到工件注册表。
3.  创建包含捆绑资产的 GitHub 发布。