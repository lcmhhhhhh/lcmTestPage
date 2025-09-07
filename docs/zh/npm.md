# 包概述

此 monorepo 包含两个主要包：`@vecli/vecli` 和 `@vecli/vecli-core`。

## `@vecli/vecli`

这是 VeCLI 的主包。它负责用户界面、命令解析以及所有其他面向用户的功能。

发布此包时，它会被捆绑成一个可执行文件。此捆绑包包括该包的所有依赖项，包括 `@vecli/vecli-core`。这意味着无论用户是使用 `npm install -g @vecli/vecli` 安装该包，还是直接使用 `npx @vecli/vecli` 运行它，他们都在使用这个单一的、自包含的可执行文件。

## `@vecli/vecli-core`

此包包含与火山引擎 API 交互的核心逻辑。它负责发出 API 请求、处理身份验证和管理本地缓存。

此包未被捆绑。发布时，它作为一个标准的 Node.js 包发布，具有自己的依赖项。这允许在需要时将其作为独立包在其他项目中使用。`dist` 文件夹中的所有转译后的 js 代码都包含在包中。

## NPM 工作区

此项目使用 [NPM 工作区](https://docs.npmjs.com/cli/v10/using-npm/workspaces) 来管理此 monorepo 中的包。这简化了开发，因为它允许我们从项目根目录管理依赖项并在多个包中运行脚本。

### 工作原理

根 `package.json` 文件定义了此项目的工作区：

```json
{
  "workspaces": ["packages/*"]
}
```

这告诉 NPM，`packages` 目录中的任何文件夹都是一个单独的包，应作为工作区的一部分进行管理。

### 工作区的优势

- **简化的依赖管理**：从项目根目录运行 `npm install` 将安装工作区中所有包的依赖项并将它们链接在一起。这意味着您无需在每个包的目录中运行 `npm install`。
- **自动链接**：工作区内的包可以相互依赖。运行 `npm install` 时，NPM 将自动在包之间创建符号链接。这意味着当您对一个包进行更改时，这些更改会立即对其依赖的其他包可用。
- **简化的脚本执行**：您可以使用 `--workspace` 标志从项目根目录运行任何包中的脚本。例如，要在 `cli` 包中运行 `build` 脚本，您可以运行 `npm run build --workspace @vecli/vecli`。