const app = getApp()
Component({
	options: {
		addGlobalClass: true,
	},
	properties: {
		navbarData: {   //navbarData   由父页面传递的数据，变量名字自命名
			type: Object,
			value: {},
			observer: function (newVal, oldVal) { }
		}
	},
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		titleTop: app.globalData.StatusBar + 6,
		height: ''
	},
	lifetimes:{
		attached(){
			console.log('attached---');
			let _this = this;
			wx.getSystemInfo({
				success: function (res) {
					console.log('res----', res);
					switch(res.model){
						case 'iPhone 5':
							_this.setData({
								titleTop: app.globalData.StatusBar + 12
							})
							break;
						case 'Nexus 5':
							_this.setData({
								titleTop: app.globalData.StatusBar + 10
							})
							break;
						case 'iPhone 6':
							_this.setData({
								titleTop: app.globalData.StatusBar + 10
							})
							break;
						default:
							_this.setData({
								titleTop: app.globalData.StatusBar + 6
							})
							break
					}
				}
			})
		}
	},
	methods: {
		// 返回上一页面
		_navback() {
			console.log('点击了返回上一页');
			wx.navigateBack()
		},
		//返回到首页
		_backhome() {
			console.log('点击了返回首页');
			wx.switchTab({
				url: '/pages/index/index',
			})
		}
	}

}) 