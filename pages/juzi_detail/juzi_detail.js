// latest.js
var Api = require('../../utils/api.js')
var WxParse = require('../../wxParse/wxParse.js')

var app = getApp()
Page({
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('res.target===', res.target)
      return {
        title: this.data.title,
        path: '/pages/juzi_detail/juzi_detail?id=' + this.data.id,
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
        path: '/pages/juzi_detail/juzi_detail?id=' + this.data.id,
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
    smalltext: '',
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
    newstext: ''
  },
  onLoad: function (options) {
    wx.showLoading({})
    console.log('---==--options--', options)
    wx.setNavigationBarTitle({
      title: '句子详情页'
    })
    this.setData({
      username: wx.getStorageSync('storageLoginedNickName'),
      avatarUrl: wx.getStorageSync('storageLoginedavAtarUrl'),
      classid: options.classid,
      id: options.id.replace(/[^0-9]/ig, ''),
      usernames: wx.getStorageSync('storageLoginedUsernames')
    })
    wx.request({
      url: getApp().globalData.apiUrl + '/xiaochengxu/juzi/?getJson=content&id=' + this.data.id,
      method: 'GET',
      dataType: 'json',
      success: (json) => {
        console.log('juzi_detail---', json.data)
        var that = this
        WxParse.wxParse('article', 'html', json.data.result['smalltext'], that, 5)
        this.setData({
          title: json.data.result['title'],
          smalltext: json.data.result['smalltext'],
          id: this.data.id
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
    this.getListData(this.data.classid)
  },
  randOne: function () {
    let that = this
    wx.request({
      url: getApp().globalData.apiUrl + '/xiaochengxu/juzi/?getJson=column&pageSize=1&classid=' + that.data.classid,
      method: 'GET',
      dataType: 'json',
      success: (json) => {
        wx.redirectTo({
          url: '../juzi_detail/juzi_detail?classid=' + that.data.classid + '&id=' + json.data.result[0].id
        })
      }
    })
  },
  getListData: function (classid, more) {
    let that = this
    let _arr = this.data.contentArray
    wx.request({
      url: getApp().globalData.apiUrl + '/xiaochengxu/juzi/?getJson=column&classid=' + classid,
      method: 'GET',
      dataType: 'json',
      success: (json) => {
        console.log('json.data.result--column-', json.data)
        if (more) {
          let _newArr = []
          for (let index = 0; index < json.data.result.length; index++) {
            _newArr.push({
              classid: json.data.result[index].classid,
              id: json.data.result[index].id,
              title: json.data.result[index].title,
              smalltext: json.data.result[index].smalltext.replace(/<[^<>]+>/g, '')
            })
          }
          _arr = _arr.concat(_newArr)
          that.setData({
            contentArray: _arr
          })
        } else {
          let _newArr = []
          for (let index = 0; index < json.data.result.length; index++) {
            _newArr.push({
              classid: json.data.result[index].classid,
              id: json.data.result[index].id,
              title: json.data.result[index].title,
              smalltext: json.data.result[index].smalltext.replace(/<[^<>]+>/g, '')
            })
          }
          console.log('===', _newArr)
          that.setData({
            contentArray: _newArr
          })
        }
        console.log('contentArray--==', this.data.contentArray)
        wx.hideLoading()
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
    // console.log('https://www.yishuzi.com.cn/e/api/jianjie8_xiaochengxu/juzi_xiaochengxu_qrode.php?path=' + encodeURIComponent('pages/juzi_detail/juzi_detail') + '&scene=start_index&width=100')
    let that = this
    wx.getImageInfo({
      //   src: 'https://www.yishuzi.com.cn/e/api/jianjie8_xiaochengxu/juzi_xiaochengxu_qrode.php?path=' + encodeURIComponent('pages/juzi_detail/juzi_detail') + '&scene=start_index&width=100',
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
