import * as path from 'path';
import type { UserConfig } from '@rspress/core';

const config: UserConfig = {
  root: 'docs',
  outDir: 'website',
  base: '/lcmTestPage/',
  title: 'Gemini CLI Documentation',
  description: 'A comprehensive guide to installing, using, and developing Gemini CLI',
  logo: '/logo.jpeg',
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/luochunmei/lcmTestPage.github.io',
      },
    ],
    nav: [
      {
        text: 'Guide',
        link: '/index',
      },
      {
        text: 'CLI',
        link: '/cli/index',
      },
      {
        text: 'Core',
        link: '/core/index',
      },
      {
        text: 'Tools',
        link: '/tools/index',
      },
    ],
    sidebar: {
      '/': [
        {
          text: 'Getting Started',
          items: [
            {
              text: 'Introduction',
              link: '/index',
            },
            {
              text: 'Architecture',
              link: '/architecture',
            },
            {
              text: 'Deployment',
              link: '/deployment',
            },
          ],
        },
        {
          text: 'CLI Usage',
          items: [
            {
              text: 'CLI Introduction',
              link: '/cli/index',
            },
            {
              text: 'Commands',
              link: '/cli/commands',
            },
            {
              text: 'Configuration',
              link: '/cli/configuration',
            },
            {
              text: 'Authentication',
              link: '/cli/authentication',
            },
            {
              text: 'Themes',
              link: '/cli/themes',
            },
            {
              text: 'Tutorials',
              link: '/cli/tutorials',
            },
          ],
        },
        {
          text: 'Core Details',
          items: [
            {
              text: 'Core Introduction',
              link: '/core/index',
            },
            {
              text: 'Tools API',
              link: '/core/tools-api',
            },
            {
              text: 'Memport',
              link: '/core/memport',
            },
          ],
        },
        {
          text: 'Tools',
          items: [
            {
              text: 'Tools Overview',
              link: '/tools/index',
            },
            {
              text: 'File System',
              link: '/tools/file-system',
            },
            {
              text: 'Multi-File',
              link: '/tools/multi-file',
            },
            {
              text: 'Shell',
              link: '/tools/shell',
            },
            {
              text: 'Web Fetch',
              link: '/tools/web-fetch',
            },
            {
              text: 'Web Search',
              link: '/tools/web-search',
            },
            {
              text: 'Memory',
              link: '/tools/memory',
            },
            {
              text: 'MCP Server',
              link: '/tools/mcp-server',
            },
          ],
        },
        {
          text: 'Additional Resources',
          items: [
            {
              text: 'Checkpointing',
              link: '/checkpointing',
            },
            {
              text: 'Extension',
              link: '/extension',
            },
            {
              text: 'IDE Integration',
              link: '/ide-integration',
            },
            {
              text: 'Telemetry',
              link: '/telemetry',
            },
            {
              text: 'NPM',
              link: '/npm',
            },
            {
              text: 'Troubleshooting',
              link: '/troubleshooting',
            },
            {
              text: 'Releases',
              link: '/releases',
            },
          ],
        },
      ],
    },
  },
};

export default config;