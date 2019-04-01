var COMMONFN = require('../../../utils/util.js');
var app = getApp();
Page({
	data: {
		height: app.globalData.height * 2 + 25,
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		navbarData: {
			title: "发布句子",
			showCapsule: true,
			back: true,
			home: true
		},
		username: '',
		avatarUrl: '',
		usernames: '',
		rnd: '',
		index: 0,
		objectArray: [],
		_classid: '',
		contents: '',
		sessionkey: ''
	},
	onLoad: function (options) {
		COMMONFN.checkIsLogin();
		this.setData({
			index: (options.index) ? options.index : this.data.index,
			avatarUrl: wx.getStorageSync('storageLoginedavAtarUrl'),
			sessionkey: wx.getStorageSync('storageSessionkey'),
			rnd: wx.getStorageSync('storageRnd'),
			usernames: wx.getStorageSync('storageLoginedUsernames')
		});
		wx.request({
			url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=class&classid=7&publish=1',
			header: { 'content-type': 'application/x-www-form-urlencoded' },
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('class-json', json.data.result);
				this.setData({
					objectArray: json.data.result
				});
			}
		})
	},
	bindPickerChange: function (e) {
		console.log('bindPickerChangebindPickerChangebindPickerChange--', e);
		this.setData({
			_classid: this.data.objectArray[e.detail.value].classid,
			index: e.detail.value
		})
	},
	formSubmit: function (e) {
		let that = this;
		console.log('form发生了submit事件，携带数据为：', e.detail.value);
		if (e.detail.value.smalltext == '') {
			wx.showModal({
				content: '请输入内容',
				showCancel: false,
				confirmColor: '#ff5a00'
			})
			setTimeout(function () {
				wx.hideToast()
			}, 2000);
			return false;
		}else{
			wx.showLoading({
				title: '发布中'
			});
			console.log({
				sessionkey: this.data.sessionkey,
				smalltext: e.detail.value.smalltext.trim(),
				title: e.detail.value.smalltext.trim(),
				ecmsfrom: 'xiaochengxu',
				username: wx.getStorageSync('storageLoginedUsernames'),
				enews: 'MAddInfo',
				rnd: wx.getStorageSync('storageRnd'),
				formid: e.detail.formId,
				mid: '25',
				classid: e.detail.value['classid'],
				addnews: '提交'
			});
			wx.request({
				url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/publish.php',
				data: {
					sessionkey: this.data.sessionkey,
					smalltext: e.detail.value.smalltext.trim(),
					title: e.detail.value.smalltext.trim(),
					ecmsfrom: 'xiaochengxu',
					username: wx.getStorageSync('storageLoginedUsernames'),
					enews: 'MAddInfo',
					rnd: wx.getStorageSync('storageRnd'),
					formid: e.detail.formId,
					mid: '25',
					classid: e.detail.value['classid'],
					addnews: '提交'
				},
				header: { 'content-type': 'application/x-www-form-urlencoded' },
				method: 'POST',
				dataType: 'json',
				success: (json) => {
					console.log('---===-----json====', json);
					wx.hideLoading();
					if (json.data.status == 1) {
						// wx.showToast({
						// 	title: json.data.message,
						// 	icon: 'success',
						// 	duration: 2000,
						// 	mask: true
						// })
						wx.showModal({
							content: json.data.message,
							cancelText: '我的发布',
							confirmText: '继续发布',
							confirmColor: '#ff5a00',
							success: function (res) {
								if (res.cancel) {
									wx.redirectTo({
										url: '../../my/publish/publish'
									});
								} else {
									wx.redirectTo({
										url: '../../publish/juzi/index?index=' + that.data.index
									});
								}
							}
						})
					} else {
						wx.showModal({
							title: '提示',
							content: json.data.message,
							success: function (res) {
								if (!res.cancel) {
									wx.redirectTo({
										url: '../../loginout/loginout'
									});
								}
							}
						})
					}
				}
			})
		}
	}
})