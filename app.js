//app.js
const app = getApp();

App({
	onLaunch: function () {
		wx.getSystemInfo({
			success: e => {
				this.globalData.StatusBar = e.statusBarHeight;
				let custom = wx.getMenuButtonBoundingClientRect();
				this.globalData.Custom = custom;
				this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
			}
		});
	},
  globalData:{
    apiUrl:'https://www.yishuzi.com.cn/juzi_xiaochengxu_api',
    token:null,
    rnd: '',
    username: '',
    usernames: '',
    avatarUrl: '',
    logined: false,
    sessionkey:'',
    access_token:'',
    userid:null
  }
})
