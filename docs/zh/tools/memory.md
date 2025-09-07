# 内存工具 (`save_memory`)

本文档描述了 VeCLI 的 `save_memory` 工具。

## 描述

使用 `save_memory` 可以在您的 VeCLI 会话之间保存和回忆信息。通过 `save_memory`，您可以指示 CLI 跨会话记住关键细节，从而提供个性化和有针对性的帮助。

### 参数

`save_memory` 接受一个参数：

- `fact` (字符串, 必需): 要记住的特定事实或信息片段。这应该是一个清晰、独立的、用自然语言编写的陈述。

## 如何在 VeCLI 中使用 `save_memory`

该工具将提供的 `fact` 追加到位于用户主目录 (`~/.ve/VE.md`) 中的一个特殊的 `VE.md` 文件中。此文件可以配置为不同的名称。

添加后，这些事实会存储在 `## vecli Added Memories` 部分下。此文件在后续会话中作为上下文加载，允许 CLI 回忆保存的信息。

用法:

```
save_memory(fact="Your fact here.")
```

### `save_memory` 示例

记住用户偏好:

```
save_memory(fact="My preferred programming language is Python.")
```

存储项目特定的细节:

```
save_memory(fact="The project I'm currently working on is called 'vecli'.")
```

## 重要提示

- **一般用法:** 此工具应用于简洁、重要的事实。它不适用于存储大量数据或对话历史。
- **内存文件:** 内存文件是一个纯文本 Markdown 文件，因此您可以根据需要手动查看和编辑它。