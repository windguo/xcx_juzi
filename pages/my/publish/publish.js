var COMMONFN = require('../../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
	data: {
		height: app.globalData.height * 2 + 25,
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		navbarData: {
			title: "我的发布",
			showCapsule: true,
			back: true,
			home:true
		},
		contentArray: [],
		page: 1,
		expertListi: [],
		expertList: [],
		expertListId: [],
		winHeight: '',
		classname: '',
		dataHidden:true,
		dataShow:false,
		page: 1,
		id:'',
		classid:'',
		click: 0,
		favas: 0,
		diggup: 0,
		diggdown: 0,
		favasflag: '',
		diggupflag: '',
		diggdownflag: '',
		usernames:''
	},

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		COMMONFN.checkIsLogin();
		wx.showLoading({
			title: '加载中'
		})
		console.log('__options__', options)
		this.setData({
			usernames: wx.getStorageSync('storageLoginedUsernames')
		});
		wx.setNavigationBarTitle({
			title: '我发布的头像'
		});
		this.winHeight();
		this.getListData(this.data.usernames, this.data.page);
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
	getListData: function (classid, page) {
		let that = this;
		wx.request({
			url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=myPublish&username=' + classid,
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('....', json.data.result);
				// 获取未审核的数据
				that.getReview();
				that.setData({
					contentArray: json.data.result
				});
				if ((json.data.result).length > 0) {
					that.setData({
						dataHidden: true,
						dataShow:false
					});
				}else{
					that.setData({
						dataHidden: false,
						dataShow: true
					});
				}
			}
		})
	},
	getReview:function(){
		let that = this;
		wx.request({
			url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=myPublish_review&username=' + this.data.usernames,
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('....', json.data.result);
				let __arr = this.data.contentArray;
				console.log('contentArray', this.data.contentArray);
				let ___ = json.data.result;
				__arr = ___.concat(__arr);
				console.log('__arr', __arr);
				that.setData({
					dataHidden:true,
					dataShow:false,
					contentArray: __arr
				});
				wx.hideLoading();
			}
		})
	},
	goPublish:function(){
		wx.redirectTo({
			url: '../../publish/juzi/index',
		})
	},
	onShareAppMessage: function (res) {
		return {
			title: '爱句子的' + this.data.classname + '列表,@你来看看有喜欢的么',
			success: (res) => {
				wx.showToast({
					content: '分享成功'
				});
			},
			fail: (res) => {
				wx.showToast({
					content: '分享失败,原因是' + res
				});
			}
		}
	},
	scrolltolowerLoadData: function (e) {
		wx.showLoading({
			title: '加载中'
		})
		console.log('scrolltolowerLoadData', e)
		let that = this
		this.setData({
			page: that.data.page + 1
		})
		wx.request({
			url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=myPublish&username=' + this.data.usernames + '&page=' + that.data.page,
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
