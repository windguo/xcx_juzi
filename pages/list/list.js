var app = getApp();
Page({
  data: {
		height: app.globalData.height * 2 + 25,
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
    contentArray: [],
		contentArrayFlag:false,
		sizePage:1,
    page: 1,
    expertListi: [],
    expertList: [],
    expertListId: [],
    winHeight: '',
    classname: '',
    classid: '',
		userid:0,
		username:"",
		state:null
  },
	
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...'
    })
    console.log('__options__', options);
		if (options.state == "2"){
			this.setData({
				userid:options.userid,
				state: options.state,
				username: options.username,
				navbarData:{
					title:options.username + '发布的句子',
					showCapsule: true,
					home:true,
					back:true
				}
			});
			this.getUserContent();
		} else if (options.state == "3"){
			this.setData({
				classname:options.classname,
				sizePage:options.size,
				state: options.state,
				navbarData: {
					title: options.classname + '的句子',
					showCapsule: true,
					home: true,
					back: true
				}
			});
			this.getSizeData(options.size, this.data.sizePage)
		}else{
			this.setData({
				classid: options.classid,
				classname: decodeURIComponent(options.classname),
				userid: wx.getStorageSync('storageLoginedUserId'),
				navbarData: {
					title: decodeURIComponent(options.classname) + '句子',
					showCapsule: true,
					home:true,
					back:true
				}
			});
			this.getListData(options.classid, this.data.page)
		}
    this.winHeight();
    
  },
	getUserContent:function(){
		let that = this;
		wx.request({
			url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=article&userid=' + this.data.userid,
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('---======------', json.data.result);
				if (JSON.stringify(json.data.result) === '[]'){
					console.log('为发布');
					that.setData({
						contentArrayFlag:true
					})
				}else{
					that.setData({
						contentArray: json.data.result,
						contentArrayFlag: false
					})
				}
				wx.hideLoading()
			}
		})
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
	getSizeData: function (classid, page) {
		let that = this
		console.log('__page__', this.data.page)
		console.log('https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=column&size=' + page)
		wx.request({
			url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=column&size='+ page,
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('---======------', json.data.result)
				that.setData({
					contentArray: json.data.result
				})
				wx.hideLoading()
			}
		})
	},
  getListData: function (classid, page) {
    let that = this
    console.log('__page__', this.data.page)
    console.log('https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=column&classid=' + classid + '&page=' + page)
    wx.request({
      url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=column&classid=' + classid + '&page=' + page,
      method: 'GET',
      dataType: 'json',
      success: (json) => {
        console.log('---======------', json.data.result)
        that.setData({
          contentArray: json.data.result
        })
        wx.hideLoading()
      }
    })
  },
	onShareAppMessage: function (res) {
		if(this.data.state == 2){
			return {
				title: this.data.username + '发布的句子,快来围观...',
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
		}else if(this.data.state == 3){
			return {
				title: '爱句子的' + this.data.classname + '栏目列表,@你来看看有喜欢的么',
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
		}else{
			return {
				title: '爱句子的' + this.data.classname + '栏目列表,@你来看看有喜欢的么',
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
		}
	},
  scrolltolowerLoadData: function (e) {
    wx.showLoading({
      title: '加载中...'
    })
    console.log('scrolltolowerLoadData', e)
    let that = this
    this.setData({
      page: that.data.page + 1
    });
		
    if(this.data.state == 2){
			wx.request({
				url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=article&userid=' + this.data.userid + '&page=' + this.data.page,
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
		} else if (this.data.state == 3){
			console.log('https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=column&size=' + this.data.sizePage + '&page=' + this.data.page);
			wx.request({
				url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=column&size=' + this.data.sizePage + '&page=' + this.data.page,
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
		}else{
			wx.request({
				url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=column&classid=' + this.data.classid + '&page=' + that.data.page,
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
  }
})
