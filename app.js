//app.js
const app = getApp();

App({
  globalData:{
    apiUrl:'https://www.yishuzi.com.cn/jianjie8_xiaochengxu_api',
    token:null,
    rnd: '',
    username: '',
    usernames: '',
    avatarUrl: '',
    logined: false,
    sessionkey:'',
    access_token:'',
    userid:null
  },
  onLaunch: function () {
    
  }
})
