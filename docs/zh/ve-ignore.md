# 忽略文件

本文档提供了 VeCLI 的 Vecli Ignore (`.veignore`) 功能的概述。

VeCLI 包含自动忽略文件的功能，类似于 `.gitignore` (由 Git 使用) 和 `.aiexclude` (由 Ve Code Assist 使用)。将路径添加到您的 `.veignore` 文件中将从支持此功能的工具中排除它们，但它们对其他服务 (如 Git) 仍然可见。

## 工作原理

当您将路径添加到 `.veignore` 文件中时，支持此文件的工具将从其操作中排除匹配的文件和目录。例如，当您使用 [`read_many_files`](./tools/multi-file.md) 命令时，`.veignore` 文件中的任何路径都将被自动排除。

在大多数情况下，`.veignore` 遵循 `.gitignore` 文件的约定：

- 空行和以 `#` 开头的行将被忽略。
- 支持标准的 glob 模式 (如 `*`、`?` 和 `[]`)。
- 在末尾加上 `/` 将只匹配目录。
- 在开头加上 `/` 会将路径相对于 `.veignore` 文件进行锚定。
- `!` 用于否定一个模式。

您可以随时更新 `.veignore` 文件。要应用更改，您必须重新启动 VeCLI 会话。

## 如何使用 `.veignore`

要启用 `.veignore`：

1. 在项目目录的根目录中创建一个名为 `.veignore` 的文件。

要将文件或目录添加到 `.veignore`：

1. 打开您的 `.veignore` 文件。
2. 添加您想要忽略的路径或文件，例如：`/archive/` 或 `apikeys.txt`。

### `.veignore` 示例

您可以使用 `.veignore` 来忽略目录和文件：

```
# 排除您的 /packages/ 目录及其所有子目录
/packages/

# 排除您的 apikeys.txt 文件
apikeys.txt
```

您可以在 `.veignore` 文件中使用 `*` 通配符：

```
# 排除所有 .md 文件
*.md
```

最后，您可以使用 `!` 将文件和目录从排除中恢复：

```
# 排除所有 .md 文件，但 README.md 除外
*.md
!README.md
```

要从 `.veignore` 文件中删除路径，请删除相关行。