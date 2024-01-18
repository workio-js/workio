import { defineConfig } from 'vitepress';

// refer https://vitepress.dev/reference/site-config for details
export default defineConfig({
  lang: 'ja-JP',
  title: 'Workio',
  description: 'The web worker framework',

  head: [
    ["link", { rel: "preload", href: "https://stackblitz.com/edit/js-y2bmps?embed=1&file=index.js&hideExplorer=1&hideNavigation=1&theme=dark&view=editor", as: "document" }],
    ["meta", { property: "og:image", content: "../../workio-ogimage.png" }],
    ["meta", { property: "og:site_name", content: "Workio - The web worker framework" }],
    ["meta", { property: "twitter:card", content: "summary" }],
    ["meta", { property: "twitter:site", content: "@*******" }],
  ],

  locales: {
    root: {
      label: 'Japanese',
      lang: 'ja',
      link: "/ja/"
    },
  },

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/workio-js/workio' },
    ],
    search: {
      provider: 'local'
    },
    appearance: 'dark',
    nav: [
      { text: 'ガイド', link: '/example' },
      {
        text: 'Playground',
        link: 'https://www.thegithubshop.com/',
        target: '_self',
        rel: 'stackblitz'
      },

      // {
      //   text: 'Dropdown Menu',
      //   items: [
      //     { text: 'Item A', link: '/item-1' },
      //     { text: 'Item B', link: '/item-2' },
      //     { text: 'Item C', link: '/item-3' },
      //   ],
      // },

      // ...
    ],

    sidebar: [
      {
        // text: 'Guide',
        items: [
          { text: 'Example', link: '/example' },
          // ...
        ],
      },
    ],
  },
});
