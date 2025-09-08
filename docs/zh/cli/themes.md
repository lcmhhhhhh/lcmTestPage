# 主题

VeCLI 支持各种主题来自定义其配色方案和外观。您可以通过 `/theme` 命令或 `"theme":` 配置设置来更改主题以适应您的喜好。

## 可用主题

VeCLI 预装了一些预定义主题，您可以在 VeCLI 中使用 `/theme` 命令列出这些主题：

- **深色主题：**
  - `ANSI`
  - `Atom One`
  - `Ayu`
  - `Default`
  - `Dracula`
  - `GitHub`
- **浅色主题：**
  - `ANSI Light`
  - `Ayu Light`
  - `Default Light`
  - `GitHub Light`
  - `Volcengine Code`
  - `Xcode`

### 更改主题

1.  在 VeCLI 中输入 `/theme`。
2.  会出现一个对话框或选择提示，列出可用的主题。
3.  使用箭头键选择一个主题。某些界面在您选择时可能会提供实时预览或高亮显示。
4.  确认您的选择以应用主题。

**注意：** 如果在您的 `settings.json` 文件中定义了主题（按名称或文件路径），则必须从文件中删除 `"theme"` 设置，然后才能使用 `/theme` 命令更改主题。

### 主题持久化

选定的主题会保存在 VeCLI 的 [配置](./configuration.md) 中，以便在会话之间记住您的偏好。

---

## 自定义颜色主题

VeCLI 允许您通过在 `settings.json` 文件中指定来自定义自己的颜色主题。这使您可以完全控制 CLI 中使用的调色板。

### 如何定义自定义主题

将 `customThemes` 块添加到您的用户、项目或系统 `settings.json` 文件中。每个自定义主题都定义为一个具有唯一名称和一组颜色键的对象。例如：

```json
{
  "ui": {
    "customThemes": {
      "MyCustomTheme": {
        "name": "MyCustomTheme",
        "type": "custom",
        "Background": "#181818",
        ...
      }
    }
  }
}
```

**颜色键：**

- `Background`
- `Foreground`
- `LightBlue`
- `AccentBlue`
- `AccentPurple`
- `AccentCyan`
- `AccentGreen`
- `AccentYellow`
- `AccentRed`
- `Comment`
- `Gray`
- `DiffAdded` (可选，用于 diff 中的新增行)
- `DiffRemoved` (可选，用于 diff 中的删除行)
- `DiffModified` (可选，用于 diff 中的修改行)

**必需属性：**

- `name` (必须与 `customThemes` 对象中的键匹配且为字符串)
- `type` (必须是字符串 `"custom"`)
- `Background`
- `Foreground`
- `LightBlue`
- `AccentBlue`
- `AccentPurple`
- `AccentCyan`
- `AccentGreen`
- `AccentYellow`
- `AccentRed`
- `Comment`
- `Gray`

您可以对任何颜色值使用十六进制代码（例如，`#FF0000`）**或**标准 CSS 颜色名称（例如，`coral`、`teal`、`blue`）。有关支持的名称的完整列表，请参见 [CSS 颜色名称](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#color_keywords)。

您可以通过向 `customThemes` 对象添加更多条目来定义多个自定义主题。

### 从文件加载主题

除了在 `settings.json` 中定义自定义主题外，您还可以通过在 `settings.json` 中指定文件路径直接从 JSON 文件加载主题。这对于共享主题或将它们与您的主要配置分开保存很有用。

要从文件加载主题，请在 `settings.json` 中将 `theme` 属性设置为您的主题文件的路径：

```json
{
  "ui": {
    "theme": "/path/to/your/theme.json"
  }
}
```

主题文件必须是有效的 JSON 文件，其结构与在 `settings.json` 中定义的自定义主题相同。

**示例 `my-theme.json`：**

```json
{
  "name": "My File Theme",
  "type": "custom",
  "Background": "#282A36",
  "Foreground": "#F8F8F2",
  "LightBlue": "#82AAFF",
  "AccentBlue": "#61AFEF",
  "AccentPurple": "#BD93F9",
  "AccentCyan": "#8BE9FD",
  "AccentGreen": "#50FA7B",
  "AccentYellow": "#F1FA8C",
  "AccentRed": "#FF5555",
  "Comment": "#6272A4",
  "Gray": "#ABB2BF",
  "DiffAdded": "#A6E3A1",
  "DiffRemoved": "#F38BA8",
  "DiffModified": "#89B4FA",
  "GradientColors": ["#4796E4", "#847ACE", "#C3677F"]
}
```

**安全提示：** 为了您的安全，VeCLI 只会加载位于您的主目录中的主题文件。如果您尝试从主目录之外加载主题，将显示警告并且不会加载该主题。这是为了防止从不受信任的来源加载潜在的恶意主题文件。

### 示例自定义主题

<img src="../assets/theme-custom.png" alt="自定义主题示例" width="600" />

### 使用您的自定义主题

- 在 VeCLI 中使用 `/theme` 命令选择您的自定义主题。您的自定义主题将出现在主题选择对话框中。
- 或者，通过在 `settings.json` 的 `ui` 对象中添加 `"theme": "MyCustomTheme"` 将其设置为默认值。
- 自定义主题可以在用户、项目或系统级别设置，并遵循与其他设置相同的 [配置优先级](./configuration.md)。

---

## 深色主题

### ANSI

![img](/theme-ansi.png)

### Atom OneDark

![img](/theme-atom-one.png)

### Ayu

![img](/theme-ayu.png)

### Default

![img](/theme-default.png)

### Dracula

![img](/theme-dracula.png)

### GitHub

![img](/theme-github.png)

## 浅色主题

### ANSI Light

![img](/theme-ansi-light.png)

### Ayu Light

![img](/theme-ayu-light.png)

### Default Light

![img](/theme-default-light.png)

### GitHub Light
![img](/theme-github-light.png)

### Xcode
![img](/theme-xcode-light.png)