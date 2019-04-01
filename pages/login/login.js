var COMMONFN = require('../../utils/util.js');
const app = getApp();
Page({
    data:{
        loginedInfo:'',
        hiddenmodalput: true,
        username: "",
        password: "",
        sessionkey:'',
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    bindGetUserInfo:function(){
        this.onLogin();
    },
  _back: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
	_home:function(){
		wx.switchTab({
			url: '/pages/index/index'
		})
	},
    onLogin:function(){
			COMMONFN.checkIsLogin();
			console.log('onLoginonLogin');
			wx.setNavigationBarTitle({
				title: '微信授权'
			})
			wx.showLoading({
				title: '授权中...'
			})
			this.setData({
				avatarUrl: wx.getStorageSync('storageLoginedavAtarUrl'),
				sessionkey: wx.getStorageSync('storageSessionkey'),
				rnd: wx.getStorageSync('storageRnd'),
				usernames: wx.getStorageSync('storageLoginedUsernames')
			});
			if (this.data.usernames) {
				wx.switchTab({
					url: '../index/index'
				});
			}else{
				let that = this;
				wx.login({
					success: function (res) {
						console.log('comm.code', res);
						if (res.code) {
							that.setData({
								code: res.code
							});
							//发起网络请求
							wx.request({
								url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/login.php',
								data: {
									code: res.code
								},
								success: (res) => {
									console.log('login--res.data', res.data);
									wx.setStorageSync('storageLoginedUserId', res.data.userid);
									wx.setStorageSync('storageLoginedGroupId', res.data.groupid);
									// wx.getStorageSync('storageSessionkey') = res.data.sessionkey;
									// app.globalData.rnd = res.data.rnd;
									wx.setStorageSync('storageLogined', true);
									wx.setStorageSync('storageSessionkey', res.data.sessionkey);
									wx.setStorageSync('storageRnd', res.data.rnd);
									if (res.data.isbind == 0) {
										console.log('未绑定账号');
										wx.navigateTo({
											url: '../bind/bind'
										})
										// that.setData({
										// 	hiddenmodalput: false
										// });
										// console.log('----hiddenmodalput--', that.data.hiddenmodalput);
									} else {
										console.log('已经绑定账号');
										wx.setStorageSync('storageLoginedUsernames', res.data.usernames);
										wx.setStorageSync('storageRnd', res.data.rnd);
										wx.getUserInfo({
											success: function (_res) {
												console.log('- getUserInfo -', _res.userInfo);
												wx.setStorageSync('storageLoginedavAtarUrl', _res.userInfo.avatarUrl);
												wx.setStorageSync('storageLoginedNickName', _res.userInfo.nickName);
												wx.switchTab({
													url: '../index/index'
												});
											},
											fail: function () {
												console.log('failssss');
											}
										})
									};
									wx.hideLoading();
								},
								fail: (res) => {
									console.log('fail---res', res);
								}
							})
						}
					},
					fail: function (res) {

					}
				})
			};
    }
})