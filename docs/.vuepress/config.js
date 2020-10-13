module.exports = {
  title: 'myblog',
  description : '666666',
  base : '/vuepressblog/',
  themeConfig : {
    nav : [
      { text: '待定', link: '#1' },
      { text: 'aboutme', link: '#2' },
      { text: 'github', link: '#3' }
    ],
    sidebar: {
      '/blog/' : [
        "/blog/",
        "/blog/elementui-Form",
        "/blog/elementui-loading",
        "/blog/createObj",
        "/blog/http常用状态码",
        "/blog/js 防抖debounce与节流throttle",
        "/blog/LinuxData",
        "/blog/promise",
        "/blog/reduce",
        "/blog/linuxNginx自启动"
      ]
    },
    // sidebarDepth : 2
  },
  markdown: {
    lineNumbers: true
  }
}
