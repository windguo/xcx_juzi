const app = getApp()
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    commitData: { // commitData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {}
    }
  },
  data: {
    page: 1,
		avatarUrl: wx.getStorageSync('storageLoginedavAtarUrl'),
		commitListArray:[]
  },
  lifetimes: {
    attached() {
			console.log('attached---', this.data.commitData.id)
			this._getList();
    }
  },
  methods: {
    publishCommit(e) {
      console.log('eeee', e)
      if (e.detail.value.smalltext == '') {
        wx.showModal({
          content: '请输入内容',
          showCancel: false,
          confirmColor: '#ff5a00'
        })
        setTimeout(function () {
          wx.hideToast()
        }, 2000)
        return false
      } else {
        wx.showLoading({
          title: '发布中'
        })
        console.log({
			sessionkey: wx.getStorageSync('storageSessionkey'),
			saytext: e.detail.value.saytext.trim(),
			ecmsfrom: 'xiaochengxu',
			username: wx.getStorageSync('storageLoginedUsernames'),
			enews: 'AddPl',
			userid: wx.getStorageSync('storageLoginedUserId'),
			mgroupid: wx.getStorageSync('storageLoginedGroupId'),
			rnd: wx.getStorageSync('storageRnd'),
			formid: e.detail.formId,
			id: e.detail.value.id,
			classid: e.detail.value.classid
        });
        wx.request({
          	url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/commit.php',
			data: {
				sessionkey: wx.getStorageSync('storageSessionkey'),
				saytext: e.detail.value.saytext.trim(),
				ecmsfrom: 'xiaochengxu',
				username: wx.getStorageSync('storageLoginedUsernames'),
				enews: 'AddPl',
				userid: wx.getStorageSync('storageLoginedUserId'),
				mgroupid: wx.getStorageSync('storageLoginedGroupId'),
				rnd: wx.getStorageSync('storageRnd'),
				formid: e.detail.formId,
				id: e.detail.value.id,
				classid: e.detail.value.classid
			},
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          method: 'POST',
          dataType: 'json',
          success: (json) => {
			console.log('---===-----json====', json.data);
			wx.hideLoading()
            if (json.data.status == 1) {
              wx.showModal({
                title: json.data.message,
								content:'审核通过后会收到微信消息,辛苦关注下',
								showCancel:false,
                confirmText: '我知道了',
                confirmColor: '#ff5a00',
								success: function (res) {
									if (!res.cancel) {
										wx.redirectTo({
											url: '/pages/detail/detail?id=' + e.detail.value.id + '&classid=' + e.detail.value.classid
										});
									}
								}
              })
            } else {
              wx.showModal({
                title: '提示',
                content: json.data.message
              })
            }
          }
        })
      }
    },
		_getList:function(){
			let that = this;
			console.log('https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=getCommitList&id=' + this.data.id + '&page=' + this.data.page);
			wx.request({
				url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=getCommitList&id=' + this.data.id + '&page=' + this.data.page,
				method: 'GET',
				dataType: 'json',
				success: (json) => {
					console.log('---======------', json.data.result)
					that.data.commitListArray = json.data.result;
					wx.hideLoading()
				}
			})
			
		}
  }

})
