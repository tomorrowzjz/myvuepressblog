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
      '/' : [
        "/",
        "/html",
        "/css",
        "/error",
        "/elementui-Form",
        "/elementui-loading",
        "/createObj",
        "/http常用状态码",
        "/js 防抖debounce与节流throttle",
        "/LinuxData",
        "/promise",
        "/reduce",
        "/linuxNginx自启动"
      ]
    },
    // sidebarDepth : 2
  },
  markdown: {
    lineNumbers: true
  }
}
