var COMMONFN = require('../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		usernames: '',
		avatarUrl: '',
		userid:0,
		nickname: '',
		picsItems:[]
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		COMMONFN.checkIsLogin();
		this.setData({
			avatarUrl: wx.getStorageSync('storageLoginedavAtarUrl'),
			sessionkey: wx.getStorageSync('storageSessionkey'),
			rnd: wx.getStorageSync('storageRnd'),
			userid: wx.getStorageSync('storageLoginedUserId'),
			nickname: wx.getStorageSync('storageLoginedNickName'),
			usernames: wx.getStorageSync('storageLoginedUsernames')
		});
	},
	loginout:function(){
		console.log('退出');
		wx.redirectTo({
			url: '../../loginout/loginout',
		})
	},
	copyTBL: function (e) {
		console.log('wwweeee', e);
		var self = this;
		wx.setClipboardData({
			data: e.currentTarget.dataset.text.trim(),
			success: function (res) {
				wx.getClipboardData({
					success: function (res) {
						wx.showToast({
							title: '复制成功',
						})
					}
				})
			}
		})
	}
})