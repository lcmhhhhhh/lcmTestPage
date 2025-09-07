# 多文件读取工具 (`read_many_files`)

本文档描述了 VeCLI 的 `read_many_files` 工具。

## 描述

使用 `read_many_files` 可以从由路径或 glob 模式指定的多个文件中读取内容。此工具的行为取决于提供的文件：

- 对于文本文件，此工具将其内容连接成一个字符串。
- 对于图像（例如 PNG、JPEG）、PDF、音频（MP3、WAV）和视频（MP4、MOV）文件，如果通过名称或扩展名明确请求，它会读取并以 base64 编码的数据形式返回。

`read_many_files` 可用于执行诸如获取代码库概览、查找特定功能的实现位置、审阅文档或从多个配置文件中收集上下文等任务。

**注意:** `read_many_files` 会查找与提供的路径或 glob 模式匹配的文件。像 `"/docs"` 这样的目录路径将返回空结果；该工具需要像 `"/docs/*"` 或 `"/docs/*.md"` 这样的模式来识别相关文件。

### 参数

`read_many_files` 接受以下参数：

- `paths` (字符串列表, 必需): 一个 glob 模式或相对于工具目标目录的路径数组（例如 `["src/**/*.ts"]`、`["README.md", "docs/*", "assets/logo.png"]`）。
- `exclude` (字符串列表, 可选): 要排除的文件/目录的 glob 模式（例如 `["**/*.log", "temp/"]`）。如果 `useDefaultExcludes` 为 true，这些模式将添加到默认排除列表中。
- `include` (字符串列表, 可选): 要包含的额外 glob 模式。这些模式将与 `paths` 合并（例如 `["*.test.ts"]` 用于特别添加测试文件如果它们被广泛排除，或者 `["images/*.jpg"]` 用于包含特定图像类型）。
- `recursive` (布尔值, 可选): 是否递归搜索。这主要由 glob 模式中的 `**` 控制。默认为 `true`。
- `useDefaultExcludes` (布尔值, 可选): 是否应用默认排除模式列表（例如 `node_modules`、`.git`、非图像/PDF 二进制文件）。默认为 `true`。
- `respect_git_ignore` (布尔值, 可选): 查找文件时是否遵守 .gitignore 模式。默认为 true。

## 如何在 VeCLI 中使用 `read_many_files`

`read_many_files` 会搜索与提供的 `paths` 和 `include` 模式匹配的文件，同时遵守 `exclude` 模式和默认排除列表（如果启用）。

- 对于文本文件：它读取每个匹配文件的内容（尝试跳过未明确请求为图像/PDF 的二进制文件）并将其连接成一个字符串，在每个文件的内容之间使用分隔符 `--- {filePath} ---`。默认使用 UTF-8 编码。
- 该工具在最后一个文件之后插入 `--- End of content ---`。
- 对于图像和 PDF 文件：如果通过名称或扩展名明确请求（例如 `paths: ["logo.png"]` 或 `include: ["*.pdf"]`），该工具会读取文件并将其内容作为 base64 编码的字符串返回。
- 该工具会通过检查初始内容中的空字节来尝试检测并跳过其他二进制文件。

用法:

```
read_many_files(paths=["Your files or paths here."], include=["Additional files to include."], exclude=["Files to exclude."], recursive=False, useDefaultExcludes=false, respect_git_ignore=true)
```

## `read_many_files` 示例

读取 `src` 目录中的所有 TypeScript 文件：

```
read_many_files(paths=["src/**/*.ts"])
```

读取主 README、`docs` 目录中的所有 Markdown 文件和一个特定的 logo 图像，排除一个特定文件：

```
read_many_files(paths=["README.md", "docs/**/*.md", "assets/logo.png"], exclude=["docs/OLD_README.md"])
```

读取所有 JavaScript 文件，但明确包含测试文件和 `images` 文件夹中的所有 JPEG：

```
read_many_files(paths=["**/*.js"], include=["**/*.test.js", "images/**/*.jpg"], useDefaultExcludes=False)
```

## 重要提示

- **二进制文件处理:**
  - **图像/PDF/音频/视频文件:** 该工具可以读取常见的图像类型（PNG、JPEG 等）、PDF、音频（mp3、wav）和视频（mp4、mov）文件，并以 base64 编码数据的形式返回。这些文件 _必须_ 通过 `paths` 或 `include` 模式明确指定（例如，通过指定确切的文件名如 `video.mp4` 或模式如 `*.mov`）。
  - **其他二进制文件:** 该工具会通过检查初始内容中的空字节来尝试检测并跳过其他类型的二进制文件。该工具会从其输出中排除这些文件。
- **性能:** 读取大量文件或非常大的单个文件可能会占用大量资源。
- **路径特异性:** 确保相对于工具目标目录正确指定路径和 glob 模式。对于图像/PDF 文件，确保模式足够具体以包含它们。
- **默认排除:** 注意默认排除模式（如 `node_modules`、`.git`），如果需要覆盖它们，请使用 `useDefaultExcludes=False`，但要谨慎操作。