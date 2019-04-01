var COMMONFN = require('../../../utils/util.js');
var app = getApp();
Page({
	data: {
		height: app.globalData.height * 2 + 25,
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		navbarData: {
			title: "我的收藏",
			showCapsule: true,
			back: true,
			home: true
		},
		id:'',
		classid: '',
		usernames: '',
		avatarUrl: '',
		userid: 0,
		contentArray:[],
		page:1,
		dataHidden:false,
		winHeight:''
	},
	winHeight: function () {
		var that = this
		//  高度自适应
		wx.getSystemInfo({
			success: function (res) {
				var clientHeight = res.windowHeight,
					clientWidth = res.windowWidth,
					rpxR = 750 / clientWidth
				var calc = clientHeight * rpxR
				that.setData({
					winHeight: calc
				})
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		COMMONFN.checkIsLogin();
		wx.setNavigationBarTitle({
			title: '我的收藏',
		});
		this.setData({
			userid: wx.getStorageSync('storageLoginedUserId')
		})
		this.winHeight();
		this.getFavas();
	},
	getFavas:function(){
		console.log('https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=myfavas&userid=' + this.data.userid);
		let that = this;
		wx.request({
			url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=myfavas&userid=' + this.data.userid,
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('getFavas--json', json.data.result);
				that.setData({
					contentArray:json.data.result
				});
				if ((json.data.result).length > 0){
					that.setData({
						dataHidden: true
					});
				}
				wx.hideLoading();
			}
		})
	},
	scrolltolowerLoadData: function (e) {
		wx.showLoading({
			title: '加载中'
		})
		console.log('scrolltolowerLoadData', e)
		let that = this
		this.setData({
			page: that.data.page + 1
		});
		console.log('https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=myfavas&userid=' + this.data.userid + '&page=' + that.data.page);
		wx.request({
			url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=myfavas&userid=' + this.data.userid + '&page=' + that.data.page,
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				let _arr = this.data.contentArray
				_arr = _arr.concat(json.data.result)
				console.log('__arr__', _arr)
				that.setData({
					contentArray: _arr
				})
				wx.hideLoading()
			}
		})
	}
})