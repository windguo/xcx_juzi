const app = getApp()
Component({
	options: {
		addGlobalClass: true,
	},
	properties: {
		textData: {   //textData   由父页面传递的数据，变量名字自命名
			type: Object,
			value: {},
			observer: function (newVal, oldVal) { }
		}
	},
	data: {
		todayUpdate: 0,
		total: 0,
		snewstime: '',
		registertime: '',
		userid: '',
		username: '',
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		height: '',
		member_newArray:[],
		//默认值  默认显示左上角
		textData: {
			showCapsule: 1
		}
	},
	attached: function () {
		let that = this;
		//统计数据
		wx.request({
			url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=total',
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				this.setData({
					snewstime: json.data.result.newstime,
					todayUpdate: json.data.result.toady,
					total: json.data.result.count
				})
			}
		});
		wx.request({
			url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=member_new&pageSize=1',
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('---======------', json.data.result[0])
				that.setData({
					registertime: json.data.result[0].registertime,
					userid: json.data.result[0].userid,
					username: json.data.result[0].username
				})
				wx.hideLoading()
			}
		})
	},
	methods: {
		// 返回上一页面
		_navback() {
			wx.navigateBack()
		},
		//返回到首页
		_backhome() {
			wx.switchTab({
				url: '/pages/index/index',
			})
		}
	}

}) 