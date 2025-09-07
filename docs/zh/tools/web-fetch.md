# 网络获取工具 (`web_fetch`)

本文档描述了 VeCLI 的 `web_fetch` 工具。

## 描述

使用 `web_fetch` 来总结、比较或从网页中提取信息。`web_fetch` 工具处理嵌入在提示中的一个或多个 URL（最多 20 个）的内容。`web_fetch` 接受一个自然语言提示并返回一个生成的响应。

### 参数

`web_fetch` 接受一个参数：

- `prompt` (字符串, 必需): 一个包含要获取的 URL（最多 20 个）和如何处理其内容的具体说明的综合提示。例如：`"总结 https://example.com/article 并从 https://another.com/data 中提取要点"`。提示必须包含至少一个以 `http://` 或 `https://` 开头的 URL。

## 如何在 VeCLI 中使用 `web_fetch`

要在 VeCLI 中使用 `web_fetch`，请提供一个包含 URL 的自然语言提示。该工具在获取任何 URL 之前会要求确认。确认后，该工具将通过 Gemini API 的 `urlContext` 处理 URL。

如果 Gemini API 无法访问 URL，该工具将回退到直接从本地机器获取内容。该工具将格式化响应，包括来源归属和引用（如果可能）。然后该工具将向用户提供响应。

用法:

```
web_fetch(prompt="您的提示，包括一个 URL，例如 https://google.com。")
```

## `web_fetch` 示例

总结单篇文章:

```
web_fetch(prompt="您能总结一下 https://example.com/news/latest 的要点吗")
```

比较两篇文章:

```
web_fetch(prompt="这两篇论文的结论有什么不同：https://arxiv.org/abs/2401.0001 和 https://arxiv.org/abs/2401.0002？")
```

## 重要提示

- **URL 处理:** `web_fetch` 依赖于 Gemini API 访问和处理给定 URL 的能力。
- **输出质量:** 输出的质量将取决于提示中指令的清晰度。