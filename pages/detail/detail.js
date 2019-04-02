// latest.js
var COMMONFN = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js')

var app = getApp()
Page({
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('res.target===', res.target)
      return {
        title: this.data.title,
        path: '/pages/detail/detail?id=' + this.data.id,
        success: (res) => {
          wx.showToast({
            content: '分享成功'
          })
        },
        fail: (res) => {
          wx.showToast({
            content: '分享失败,原因是' + res
          })
        }
      }
    } else {
      return {
        title: this.data.title,
        path: '/pages/detail/detail?id=' + this.data.id,
        success: (res) => {
          wx.showToast({
            content: '分享成功'
          })
        },
        fail: (res) => {
          wx.showToast({
            content: '分享失败,原因是' + res
          })
        }
      }
    }
  },
  data: {
		navbarData: {
			title: "爱句子详情页",
			showCapsule: true,
			home: true,
			back: true
		},
		page:1,
		height: app.globalData.height * 2 + 25,
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
    index: null,
    winHeight: '', // 窗口高度
    currentTab: 0, // 预设当前项的值
    scrollLeft: 0, // tab标题的滚动条位置
    expertListi: [],
    expertList: [],
    expertListId: [],
    _windowWidth: wx.getSystemInfoSync().windowWidth,
    contentArray: [],
    title: '',
    username: '',
		onclick:0,
		smalltext: '',
		newstime:'',
    avatarUrl: '',
    id: '',
    juzi_xiaochengxu_qrodeImg: '',
    width: '',
    classid: '',
    height: '',
    height: '',
    shareTempFilePath: '',
    tempFilePath: '',
    _id: '',
    smalltext: '',
		commitListArray:[]
  },
  onLoad: function (options) {
		COMMONFN.checkIsLogin();
    wx.showLoading({title:'加载中...'})
    console.log('---==--options--', options)
    this.setData({
      avatarUrl: wx.getStorageSync('storageLoginedavAtarUrl'),
			sessionkey: wx.getStorageSync('storageSessionkey'),
			rnd: wx.getStorageSync('storageRnd'),
      classid: options.classid,
      id: options.id.replace(/[^0-9]/ig, '')
    });
		console.log(getApp().globalData.apiUrl + '/?getJson=content&id=' + this.data.id);
    wx.request({
      url: getApp().globalData.apiUrl + '/?getJson=content&id=' + this.data.id,
      method: 'GET',
      dataType: 'json',
      success: (json) => {
        console.log('detail---', json.data)
        var that = this
        WxParse.wxParse('article', 'html', json.data.result['smalltext'], that, 5)
        this.setData({
          title: json.data.result['title'],
          smalltext: json.data.result['smalltext'],
					onclick: json.data.result['onclick'],
					newstime: json.data.result['newstime'],
          diggtop: json.data.result['diggtop'],
          id: this.data.id,
          username:json.data.result['username'],
          commitData: {
            id: this.data.id,
            classid:this.data.classid
          }
        })
        wx.hideLoading()
      }
    })
    var that = this
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth
        var calc = clientHeight * rpxR - 98
        that.setData({
          winHeight: calc
        })
      }
    })
    console.log('this.data.classid--', this.data.classid)
    this.getListData(this.data.classid,1);
		this.check_fava_article();
		this._getList();
  },
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
							content: '感谢您的评论,审核通过后会收到微信消息',
							showCancel: false,
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
	_getList: function () {
		let that = this;
		console.log('https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=getCommitList&id=' + this.data.id + '&page=' + this.data.page);
		wx.request({
			url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=getCommitList&id=' + this.data.id + '&page=' + this.data.page,
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('---=====eeee=------', json.data.result)
				that.setData({
					commitListArray:json.data.result
				})
				wx.hideLoading()
			}
		})
	},
	// 检测是否已经收藏
	check_fava_article: function () {
		let that = this;
		wx.request({
			url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/?getJson=check_fava_article&id=' + this.data.id + '&classid=' + this.data.classid + '&userid=' + this.data.userid,
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('---======check_fava_article------', json.data);
				if (json.data.status == 1) {
					console.log('收藏过了');
					console.log('json.data.result.favaid--', json.data.result.favaid);
					that.setData({
						favaFlag: true,
						favaid: json.data.result.favaid
					})
				} else {
					that.setData({
						favaFlag: false
					})
				}
			}
		})
	},
	diggtopFn: function (e) {
		wx.showLoading({
			title: '点赞中...',
			mask: true
		})
		let _this = this;
		console.log('eeee-', e);
		console.log('https://www.yishuzi.com.cn/juzi_xiaochengxu_api_root/e/public/digg/index.php?afrom=xiaochengxu&dotop=1&doajax=1&ajaxarea=diggnum&id=' + this.data.id + '&classid=' + this.data.classid);
		wx.request({
			url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api_root/e/public/digg/index.php?afrom=xiaochengxu&dotop=1&doajax=1&ajaxarea=diggnum&id=' + this.data.id + '&classid=' + this.data.classid,
			method: 'GET',
			dataType: 'json',
			success: (json) => {
				console.log('---======diggtopFn------', json.data);
				_this.setData({
					diggFlag: true
				})
				wx.showModal({
					content: json.data.message,
					mask: true
				})
				wx.hideLoading()
			}
		})
	},
	// 加入收藏
	favaFn: function (e) {
		wx.showLoading({
			title: '收藏中...',
			mask: true
		})
		let _this = this;
		wx.request({
			url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/fava.php',
			data: {
				sessionkey: this.data.sessionkey,
				ecmsfrom: 'xiaochengxu',
				username: this.data.username,
				enews: 'AddFava',
				rnd: this.data.rnd,
				classid: this.data.classid,
				id: this.data.id,
				Submit: '收藏'
			},
			header: { 'content-type': 'application/x-www-form-urlencoded' },
			method: 'POST',
			dataType: 'json',
			success: (json) => {
				console.log('---======favaFn------', json.data);
				_this.setData({
					favaFlag: true,
					favaid: json.data.result.favaid
				})
				wx.showModal({
					title: json.data.message,
					content: '请到【我的】-【我的收藏】查看收藏的网名',
					mask: true
				})
				console.log('this.data.favaid---', this.data.favaid);
				wx.hideLoading()
			}
		})
	},
	// 移除收藏
	favaDisFn: function (e) {
		wx.showLoading({
			title: '移除收藏中...',
			mask: true
		})
		let _this = this;
		wx.request({
			url: 'https://www.yishuzi.com.cn/juzi_xiaochengxu_api/fava.php',
			data: {
				sessionkey: this.data.sessionkey,
				ecmsfrom: 'xiaochengxu',
				username: this.data.username,
				enews: 'DelFava',
				rnd: this.data.rnd,
				classid: this.data.classid,
				id: this.data.id,
				favaid: this.data.favaid,
				Submit: '收藏'
			},
			header: { 'content-type': 'application/x-www-form-urlencoded' },
			method: 'POST',
			dataType: 'json',
			success: (json) => {
				console.log('---======favaDisFn------', json.data);
				_this.setData({
					favaFlag: false
				})
				wx.showModal({
					content: json.data.message,
					mask: true
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
  randOne: function () {
    let that = this
    wx.request({
      url: getApp().globalData.apiUrl + '/?getJson=column&pageSize=1&classid=' + that.data.classid,
      method: 'GET',
      dataType: 'json',
      success: (json) => {
        wx.redirectTo({
          url: '../detail/detail?classid=' + that.data.classid + '&id=' + json.data.result[0].id
        })
      }
    })
  },
  copyTBL: function (e) {
    console.log('wwweeee', e)
    var self = this
    wx.setClipboardData({
      data: e.currentTarget.dataset.text.trim(),
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  drawText: function (ctx, str, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0
    var lastSubStrIndex = 0; // 每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), 50, initHeight); // 绘制截取部分
        initHeight += 30; // 20为字体的高度
        lineWidth = 0
        lastSubStrIndex = i
      // titleHeight += 30
      }
      if (i == str.length - 1) { // 绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), 50, initHeight)
      }
    }
    console.log('----initHeight--', initHeight)
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 100
    return titleHeight
  },
  // 创建海报
  creat: function () {
		wx.showLoading({
			title: '生成中'
		});
    // console.log('https://www.yishuzi.com.cn/e/api/jianjie8_xiaochengxu/juzi_xiaochengxu_qrode.php?path=' + encodeURIComponent('pages/detail/detail') + '&scene=start_index&width=100')
    let that = this
    wx.getImageInfo({
      //   src: 'https://www.yishuzi.com.cn/e/api/jianjie8_xiaochengxu/juzi_xiaochengxu_qrode.php?path=' + encodeURIComponent('pages/detail/detail') + '&scene=start_index&width=100',
      src: 'https://www.yishuzi.com.cn/e/api/xiaochengxu/aijuzi_qrode.jpg',
      success: function (res) {
        console.log('that.data', res)
        that.setData({
          tempFilePath: res.path
        })
        // 开始绘画
        const ctx = wx.createCanvasContext('shareCanvas')
        let _width = 650
        ctx.fillRect(0, 0, _width, 800)
        ctx.setFontSize(20)
        ctx.fillStyle = '#555'
        ctx.lineWidth = 0
        ctx.drawImage('../../images/juzi_bg.png', 0, 0, 400, 800)
        var str = that.data.smalltext.replace(/<[^<>]+>/g, '').substring(0, 170) + '...'
        var titleHeight = 50; // 标题的高度
        var canvasWidth = _width - 360; // 计算canvas的宽度
        var initHeight = 300; // 绘制字体距离canvas顶部初始的高度
        // 标题border-bottom 线距顶部距离
        titleHeight = that.drawText(ctx, str, initHeight, titleHeight, canvasWidth); // 调用行文本换行函数
        console.log('titleHeight---', str.height)
        ctx.moveTo(130, titleHeight)

        ctx.stroke() // 绘制已定义的路径
        ctx.setFontSize(16)
        ctx.fillStyle = '#000'
        ctx.fillText('识别二维码微信搜索“爱句子”,每天更新句子', 50, 640)

        ctx.drawImage(that.data.tempFilePath, 140, 660, 120, 120)

        ctx.draw(true, setTimeout(function () {
          wx.canvasToTempFilePath({
            canvasId: 'shareCanvas',

            success: (res) => {
              that.setData({
                shareTempFilePath: res.tempFilePath
			  })
			  wx.hideLoading();
              // 预览图片
              that.previewImages(that.data.shareTempFilePath)
              that.saveImageToPhotosAlbum()
            }
          })
        }, 100))
      }
    })
  },
  scrolltolowerLoadData: function (e) {
    console.log('scrolltolowerLoadData', e)
    this.getListData(this.data.classid, true)
  },
  previewImages: function (e) {
    console.log('eee', e)
    var current = e
    wx.previewImage({
      current: current,
      urls: ['' + current + '']
    })
  },
  // 保存至相册
  saveImageToPhotosAlbum: function () {
    if (!this.data.shareTempFilePath) {
      wx.showModal({
        title: '提示',
        content: '请先点击生成句子海报',
        showCancel: false
      })
    }
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareTempFilePath,
      success: (res) => {
        if (res.errMsg == 'saveImageToPhotosAlbum:ok') {
          wx.showModal({
            content: '保存成功',
            showCancel: false,
            success: function (res) {
              console.log(res)
              wx.showModal({
                content: '是否返回首页',
                showCancel: true,
                confirmColor: '#ff5a00',
                success: function (res) {
                  console.log(res)
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '../index/index'
                    })
                  }
                }
              })
            }
          })
        }
      },
      fail: (err) => {
        console.log(err)
      }
    })
  }
})
