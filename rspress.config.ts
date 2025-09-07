import * as path from 'path';
import type { UserConfig } from '@rspress/core';

const config: UserConfig = {
  root: 'docs',
  lang: 'zh',
  outDir: 'website',
  title: 'VeCLI',
  description: 'VeCLI - 火山引擎AI命令行工具文档',
  logo: '/logo.jpeg',
  logoText: 'VeCLI',
  route: {
    cleanUrls: true,
  },
  locales: [
    {
      lang: 'en',
      // 导航栏切换语言的标签
      label: 'English',
      title: 'VeCLI',
      description: 'VeCLI - Volcano Engine AI CLI Tool Documentation',
    },
    {
      lang: 'zh',
      label: '简体中文',
      title: 'VeCLI',
      description: 'VeCLI - 火山引擎AI命令行工具文档',
    },
  ],
  themeConfig: {
    socialLinks: [
      // {
      //   icon: 'github',
      //   mode: 'link',
      //   content: 'https://github.com/luochunmei/lcmTestPage.github.io',
      // },
    ],
    nav: [
      {
        text: 'introduction',
        link: '/introduction',
      },
      {
        text: 'cli',
        link: '/cli/',
      },
      {
        text: 'core',
        link: '/core/',
      },
      {
        text: 'tools',
        link: '/tools/',
      },
    ],
    sidebar: {
      '/': [
        {
          text: '快速开始',
          items: [
            {
              text: '介绍',
              link: '/introduction',
            },
            {
              text: '部署',
              link: '/deployment',
            },
          ],
        },
        {
          text: 'CLI 使用',
          items: [
            {
              text: 'CLI 介绍',
              link: '/cli/index',
            },
            {
              text: '命令',
              link: '/cli/commands',
            },
            {
              text: '配置',
              link: '/cli/configuration',
            },
            {
              text: '认证',
              link: '/cli/authentication',
            },
            {
              text: '主题',
              link: '/cli/themes',
            },
            {
              text: '教程',
              link: '/cli/tutorials',
            },
          ],
        },
        {
          text: '核心详情',
          items: [
            {
              text: '核心介绍',
              link: '/core/index',
            },
            {
              text: '工具 API',
              link: '/core/tools-api',
            },
            {
              text: 'Memport',
              link: '/core/memport',
            },
          ],
        },
        {
          text: '工具',
          items: [
            {
              text: '工具概览',
              link: '/tools/index',
            },
            {
              text: '文件系统',
              link: '/tools/file-system',
            },
            {
              text: '多文件',
              link: '/tools/multi-file',
            },
            {
              text: 'Shell',
              link: '/tools/shell',
            },
            {
              text: 'Web 抓取',
              link: '/tools/web-fetch',
            },
            {
              text: '内存',
              link: '/tools/memory',
            },
            {
              text: 'MCP 服务器',
              link: '/tools/mcp-server',
            },
          ],
        },
        {
          text: '最佳实践',
          items: [
            {
              text: '12306订票工具通过火山引擎vefaas部署',
              link: '/examples/vecli-12306',
            },
        
          ],
        },
        {
          text: '其他资源',
          items: [
            {
              text: '检查点',
              link: '/checkpointing',
            },
            {
              text: 'IDE 集成',
              link: '/ide-integration',
            },
            {
              text: '遥测',
              link: '/telemetry',
            },
            {
              text: 'NPM',
              link: '/npm',
            },
            {
              text: '故障排除',
              link: '/troubleshooting',
            },
            {
              text: '发布',
              link: '/releases',
            },
          ],
        },
      ],
      '/en/': [
        {
          text: 'Getting Started',
          items: [
            {
              text: 'Introduction',
              link: '/en/introduction',
            },
            {
              text: 'Deployment',
              link: '/en/deployment',
            },
          ],
        },
        {
          text: 'CLI Usage',
          items: [
            {
              text: 'CLI Introduction',
              link: '/en/cli/index',
            },
            {
              text: 'Commands',
              link: '/en/cli/commands',
            },
            {
              text: 'Configuration',
              link: '/en/cli/configuration',
            },
            {
              text: 'Authentication',
              link: '/en/cli/authentication',
            },
            {
              text: 'Themes',
              link: '/en/cli/themes',
            },
            {
              text: 'Tutorials',
              link: '/en/cli/tutorials',
            },
          ],
        },
        {
          text: 'Core Details',
          items: [
            {
              text: 'Core Introduction',
              link: '/en/core/index',
            },
            {
              text: 'Tools API',
              link: '/en/core/tools-api',
            },
            {
              text: 'Memport',
              link: '/en/core/memport',
            },
          ],
        },
        {
          text: 'Tools',
          items: [
            {
              text: 'Tools Overview',
              link: '/en/tools/index',
            },
            {
              text: 'File System',
              link: '/en/tools/file-system',
            },
            {
              text: 'Multi-File',
              link: '/en/tools/multi-file',
            },
            {
              text: 'Shell',
              link: '/en/tools/shell',
            },
            {
              text: 'Web Fetch',
              link: '/en/tools/web-fetch',
            },
            {
              text: 'Memory',
              link: '/en/tools/memory',
            },
            {
              text: 'MCP Server',
              link: '/en/tools/mcp-server',
            },
          ],
        },
        {
          text: 'Best practise',
          items: [
            {
              text: '12306订票工具通过火山引擎vefaas部署',
              link: 'en/examples/vecli-12306',
            },
        
          ],
        },
        {
          text: 'Additional Resources',
          items: [
            {
              text: 'Checkpointing',
              link: '/en/checkpointing',
            },
            {
              text: 'IDE Integration',
              link: '/en/ide-integration',
            },
            {
              text: 'Telemetry',
              link: '/en/telemetry',
            },
            {
              text: 'NPM',
              link: '/en/npm',
            },
            {
              text: 'Troubleshooting',
              link: '/en/troubleshooting',
            },
            {
              text: 'Releases',
              link: '/en/releases',
            },
          ],
        },
      ],
    },
  },
};

export default config;