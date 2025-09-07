# VeCLI 文件系统工具

VeCLI 提供了一套全面的工具来与本地文件系统进行交互。这些工具允许火山引擎模型在您的控制下读取、写入、列出、搜索和修改文件及目录，并且对于敏感操作通常需要您的确认。

**注意:** 出于安全考虑，所有文件系统工具都在一个 `rootDirectory`（通常是您启动 CLI 的当前工作目录）内运行。您提供给这些工具的路径通常应为绝对路径，或者相对于此根目录进行解析。

## 1. `list_directory` (ReadFolder)

`list_directory` 列出指定目录路径内直接包含的文件和子目录的名称。它可以选择性地忽略与提供的 glob 模式匹配的条目。

- **工具名称:** `list_directory`
- **显示名称:** ReadFolder
- **文件:** `ls.ts`
- **参数:**
  - `path` (字符串, 必需): 要列出的目录的绝对路径。
  - `ignore` (字符串数组, 可选): 要从列表中排除的 glob 模式列表 (例如, `["*.log", ".git"]`)。
  - `respect_git_ignore` (布尔值, 可选): 列出文件时是否遵守 `.gitignore` 模式。默认为 `true`。
- **行为:**
  - 返回文件和目录名称的列表。
  - 指示每个条目是否为目录。
  - 将条目排序，目录在前，然后按字母顺序排列。
- **输出 (`llmContent`):** 类似于以下的字符串: `Directory listing for /path/to/your/folder:\n[DIR] subfolder1\nfile1.txt\nfile2.png`
- **确认:** 否。

## 2. `read_file` (ReadFile)

`read_file` 读取并返回指定文件的内容。此工具处理文本、图像（PNG、JPG、GIF、WEBP、SVG、BMP）和 PDF 文件。对于文本文件，它可以读取特定的行范围。其他二进制文件类型通常会被跳过。

- **工具名称:** `read_file`
- **显示名称:** ReadFile
- **文件:** `read-file.ts`
- **参数:**
  - `path` (字符串, 必需): 要读取的文件的绝对路径。
  - `offset` (数字, 可选): 对于文本文件，从 0 开始的行号，表示从哪一行开始读取。需要设置 `limit`。
  - `limit` (数字, 可选): 对于文本文件，要读取的最大行数。如果省略，则读取默认最大值（例如，2000 行）或在可行的情况下读取整个文件。
- **行为:**
  - 对于文本文件: 返回内容。如果使用了 `offset` 和 `limit`，则仅返回该行范围的内容。如果由于行限制或行长限制而截断了内容，则会进行指示。
  - 对于图像和 PDF 文件: 将文件内容作为 base64 编码的数据结构返回，适用于模型处理。
  - 对于其他二进制文件: 尝试识别并跳过它们，返回一条消息，表明这是一个通用的二进制文件。
- **输出:** (`llmContent`):
  - 对于文本文件: 文件内容，可能会带有截断消息前缀（例如，`[File content truncated: showing lines 1-100 of 500 total lines...]\nActual file content...`）。
  - 对于图像/PDF 文件: 一个包含 `inlineData` 的对象，其中包含 `mimeType` 和 base64 `data`（例如，`{ inlineData: { mimeType: 'image/png', data: 'base64encodedstring' } }`）。
  - 对于其他二进制文件: 类似于 `Cannot display content of binary file: /path/to/data.bin` 的消息。
- **确认:** 否。

## 3. `write_file` (WriteFile)

`write_file` 将内容写入指定的文件。如果文件存在，它将被覆盖。如果文件不存在，则会创建该文件（以及任何必要的父目录）。

- **工具名称:** `write_file`
- **显示名称:** WriteFile
- **文件:** `write-file.ts`
- **参数:**
  - `file_path` (字符串, 必需): 要写入的文件的绝对路径。
  - `content` (字符串, 必需): 要写入文件的内容。
- **行为:**
  - 将提供的 `content` 写入 `file_path`。
  - 如果父目录不存在，则创建它们。
- **输出 (`llmContent`):** 成功消息，例如，`Successfully overwrote file: /path/to/your/file.txt` 或 `Successfully created and wrote to new file: /path/to/new/file.txt`。
- **确认:** 是。在写入之前，会显示更改的差异并请求用户批准。

## 4. `glob` (FindFiles)

`glob` 查找与特定 glob 模式匹配的文件（例如，`src/**/*.ts`、`*.md`），返回按修改时间排序的绝对路径（最新的在前）。

- **工具名称:** `glob`
- **显示名称:** FindFiles
- **文件:** `glob.ts`
- **参数:**
  - `pattern` (字符串, 必需): 要匹配的 glob 模式（例如，`"*.py"`、`"src/**/*.js"`）。
  - `path` (字符串, 可选): 要在其中搜索的目录的绝对路径。如果省略，则在工具的根目录中搜索。
  - `case_sensitive` (布尔值, 可选): 搜索是否区分大小写。默认为 `false`。
  - `respect_git_ignore` (布尔值, 可选): 查找文件时是否遵守 .gitignore 模式。默认为 `true`。
- **行为:**
  - 在指定目录中搜索与 glob 模式匹配的文件。
  - 返回绝对路径列表，按最近修改的文件优先排序。
  - 默认情况下忽略常见的干扰目录，如 `node_modules` 和 `.git`。
- **输出 (`llmContent`):** 类似于以下的消息: `Found 5 file(s) matching "*.ts" within src, sorted by modification time (newest first):\nsrc/file1.ts\nsrc/subdir/file2.ts...`
- **确认:** 否。

## 5. `search_file_content` (SearchText)

`search_file_content` 在指定目录中的文件内容中搜索正则表达式模式。可以按 glob 模式过滤文件。返回包含匹配项的行，以及它们的文件路径和行号。

- **工具名称:** `search_file_content`
- **显示名称:** SearchText
- **文件:** `grep.ts`
- **参数:**
  - `pattern` (字符串, 必需): 要搜索的正则表达式 (regex)（例如，`"function\\s+myFunction"`）。
  - `path` (字符串, 可选): 要在其中搜索的目录的绝对路径。默认为当前工作目录。
  - `include` (字符串, 可选): 用于过滤要搜索的文件的 glob 模式（例如，`"*.js"`、`"src/**/*.{ts,tsx}"`）。如果省略，则搜索大多数文件（遵守常见的忽略规则）。
- **行为:**
  - 如果在 Git 仓库中可用，则使用 `git grep` 以提高速度；否则，回退到系统 `grep` 或基于 JavaScript 的搜索。
  - 返回匹配行的列表，每行都带有其文件路径（相对于搜索目录）和行号前缀。
- **输出 (`llmContent`):** 格式化的匹配项字符串，例如:
  ```
  Found 3 matches for pattern "myFunction" in path "." (filter: "*.ts"):
  ---
  File: src/utils.ts
  L15: export function myFunction() {
  L22:   myFunction.call();
  ---
  File: src/index.ts
  L5: import { myFunction } from './utils';
  ---
  ```
- **确认:** 否。

## 6. `replace` (Edit)

`replace` 替换文件中的文本。默认情况下，替换单个匹配项，但如果指定了 `expected_replacements`，则可以替换多个匹配项。此工具旨在进行精确、有针对性的更改，并且需要 `old_string` 周围有大量上下文，以确保修改正确的位置。

- **工具名称:** `replace`
- **显示名称:** Edit
- **文件:** `edit.ts`
- **参数:**
  - `file_path` (字符串, 必需): 要修改的文件的绝对路径。
  - `old_string` (字符串, 必需): 要替换的确切文字文本。

    **关键:** 此字符串必须唯一标识要更改的单个实例。它应包含目标文本 _之前_ 和 _之后_ 至少 3 行的上下文，并且必须精确匹配空格和缩进。如果 `old_string` 为空，则该工具会尝试在 `file_path` 创建一个新文件，并将 `new_string` 作为内容。

  - `new_string` (字符串, 必需): 要替换 `old_string` 的确切文字文本。
  - `expected_replacements` (数字, 可选): 要替换的匹配项数量。默认为 `1`。

- **行为:**
  - 如果 `old_string` 为空且 `file_path` 不存在，则创建一个新文件，并将 `new_string` 作为内容。
  - 如果提供了 `old_string`，则读取 `file_path` 并尝试找到 `old_string` 的唯一匹配项。
  - 如果找到一个匹配项，则将其替换为 `new_string`。
  - **增强可靠性（多阶段编辑校正）:** 为了显著提高编辑的成功率，尤其是在模型提供的 `old_string` 可能不完全精确的情况下，该工具结合了多阶段编辑校正机制。
    - 如果初始的 `old_string` 未找到或匹配多个位置，则该工具可以利用火山引擎模型迭代地改进 `old_string`（以及可能的 `new_string`）。
    - 这种自我校正过程会尝试识别模型打算修改的唯一段落，即使初始上下文稍有不完美，也能使 `replace` 操作更加稳健。
- **失败条件:** 尽管有校正机制，但如果出现以下情况，该工具仍会失败：
  - `file_path` 不是绝对路径或在根目录之外。
  - `old_string` 不为空，但 `file_path` 不存在。
  - `old_string` 为空，但 `file_path` 已存在。
  - 尝试校正后，在文件中仍未找到 `old_string`。
  - `old_string` 找到多个匹配项，且自我校正机制无法将其解析为单个、明确的匹配项。
- **输出 (`llmContent`):**
  - 成功时: `Successfully modified file: /path/to/file.txt (1 replacements).` 或 `Created new file: /path/to/new_file.txt with provided content.`
  - 失败时: 解释原因的错误消息（例如，`Failed to edit, 0 occurrences found...`、`Failed to edit, expected 1 occurrences but found 2...`）。
- **确认:** 是。在写入文件之前，会显示建议的更改差异并请求用户批准。

这些文件系统工具为 VeCLI 提供了理解和与您的本地项目上下文交互的基础。