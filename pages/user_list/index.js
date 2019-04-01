// pages/user_list/index.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfoArray:[],
		avatarUrl:'/images/h.png',
		userid: '',
		nickname: '',
		username: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.showLoading({
			title: '加载中...'
		});
		console.log('options',options);
		this.setData({
			userid:options.userid
		})
		// 获取用户信息
		this.getUserInfoFn();
	},
	getUserInfoFn:function(){
		var that = this;
		wx.request({
			url: getApp().globalData.apiUrl + '/?getJson=userInfo&userid=' + this.data.userid,
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('json.data.result---', json.data.result);
				this.setData({
					userInfoArray: json.data.result
				})
				wx.hideLoading()
			}
		})
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})