var app = getApp();
Page({
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		titleTop: app.globalData.StatusBar,
		contentArray:[],
		keywordsArray:[],
		keywordsArrayFlag:true,
		page: 1,
		keyword:'',
		keywordFlag:false,
		onclick:'',
		focus:true,
		resu:'',
		winHeight: "",//窗口高度
	},
	delKeywords:function(){
		this.setData({
			keyword:'',
			keywordsArrayFlag:true,
			focus:true,
			keywordFlag:true,
			contentArray: []
		});
		let that = this;
		wx.request({
			url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=keyword',
			header: { 'content-type': 'application/x-www-form-urlencoded' },
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('wssss=searchKeywords===s===', json.data.result);
				if (JSON.stringify(json.data.result) === '[]') {
					that.setData({
						keywordsArrayFlag: false,
						resu: '暂无内容, 请更换关键字'
					})
				} else {
					that.setData({
						keywordsArrayFlag: true,
						keywordsArray: json.data.result
					})
				}
				wx.hideLoading();
			}
		});
	},
	bindinput:function(){
		this.setData({
			keywordFlag: false
		})
	},
	searchSubmit(e) {
		wx.pageScrollTo({
			scrollTop: -64
		});
		console.log('form发生了submit事件，携带数据为：', e.detail.value);
		if (e.detail.value.keyword == '') {
			wx.showModal({
				content: '请输入关键字',
				showCancel: false,
				confirmColor: '#ff5a00'
			});
			return false;
		};
		wx.showLoading({
			title: '搜索中'
		});
		this.setData({
			keyword: e.detail.value.keyword
		});
		let that = this;
		console.log('https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=search&key=' + e.detail.value.keyword + '&page=' + this.data.page);
		wx.request({
			url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=search&key=' + e.detail.value.keyword + '&page=' + this.data.page,
			header: { 'content-type': 'application/x-www-form-urlencoded' },
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('wssss====s===', json.data.result);
				if (JSON.stringify(json.data.result) === '[]') {
					that.setData({
						keywordsArrayFlag:false,
						resu: '暂无内容, 请更换关键字'
					})
				} else {
					that.setData({
						resu:'',
						keywordsArrayFlag: false,
						contentArray: json.data.result
					})
				}
				wx.hideLoading();
			}
		});
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
		console.log('voptions.keywordoptions.keyword', options);
		let that = this;
		console.log('1111-', JSON.stringify(options) == "{}");
		if (JSON.stringify(options) !== "{}"){
			this.setData({
				keyword: decodeURIComponent(options.keyword)
			});
		};
		if(options.state=='2'){
			this.setData({
				focus:false,
				keyword: options.keyword,
				keywordsArrayFlag:false
			})
		}
		if (this.data.keywordsArrayFlag){
			wx.request({
				url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=keyword',
				header: { 'content-type': 'application/x-www-form-urlencoded' },
				method: 'GET',
				dataType: 'json',
				success: (json) => {
					console.log('wssss=searchKeywords===s===', json.data.result);
					if (JSON.stringify(json.data.result) === '[]') {
						that.setData({
							keywordsArrayFlag: false,
							resu: '暂无内容, 请更换关键字'
						})
					} else {
						that.setData({
							keywordsArrayFlag: true,
							keywordsArray: json.data.result
						})
					}
					wx.hideLoading();
				}
			});
		}else{
			wx.request({
				url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=search&key=' + this.data.keyword + '&page=' + this.data.page,
				header: { 'content-type': 'application/x-www-form-urlencoded' },
				method: 'GET',
				dataType: 'json',
				success: (json) => {
					console.log('wssss====s===', json.data.result);
					if (JSON.stringify(json.data.result) === '[]') {
						that.setData({
							resu: '暂无内容, 请更换关键字'
						})
					} else {
						that.setData({
							keywordsArrayFlag: false,
							contentArray: json.data.result
						})
					}
					wx.hideLoading();
				}
			});
		}
		
		this.winHeight();
	},
	_back:function(){
		wx.navigateBack({
			delta: 1,
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
		})
		wx.request({
			url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=search&key=' + this.data.keyword + '&page=' + that.data.page,
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