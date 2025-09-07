# Gemini CLI Documentation

这是一个使用 [Rspress](https://rspress.dev/) 构建的文档站点，托管在 GitHub Pages 上。

## 本地开发

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 构建生产版本：
```bash
npm run build
```

## 部署

项目配置了 GitHub Actions 自动部署。当代码推送到 main 或 master 分支时，会自动构建并部署到 GitHub Pages。

## 项目结构

- `docs/` - 文档源文件（Markdown 格式）
- `rspress.config.ts` - Rspress 配置文件
- `doc_build/` - 构建输出目录（自动生成）
- `.github/workflows/deploy.yml` - GitHub Actions 部署配置

## 文档编写

所有文档文件都在 `docs/` 目录下，使用 Markdown 格式编写。Rspress 支持：

- 标准 Markdown 语法
- MDX 组件
- 代码高亮
- 数学公式
- 图表支持

更多信息请参考 [Rspress 官方文档](https://rspress.dev/)。