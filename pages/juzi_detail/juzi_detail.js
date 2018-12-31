// latest.js
var Api = require('../../utils/api.js');


var app = getApp();
Page({
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log('res.target===', res.target);
            return {
                title: this.data.title,
                path: '/pages/juzi_detail/juzi_detail?id=' + this.data.id,
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
        } else {
            return {
                title: this.data.title,
                path: '/pages/juzi_detail/juzi_detail?id=' + this.data.id,
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
    data: {
        index: null,
        winHeight: "",//窗口高度
        currentTab: 0, //预设当前项的值
        scrollLeft: 0, //tab标题的滚动条位置
        expertListi: [],
        expertList: [],
        expertListId: [],
        _windowWidth: wx.getSystemInfoSync().windowWidth,
        contentArray: [],
        title:'',
        smalltext:'',
        id:'',
        newstext:''
    },
    onLoad: function (options) {
        wx.showLoading({})
        wx.setNavigationBarTitle({
            title: '句子详情页'
        })
        wx.request({
            url: 'https://www.yishuzi.com.cn/jianjie8_xiaochengxu_api/xiaochengxu/juzi/?getJson=content&id=' + options.id,
            method: 'GET',
            dataType: 'json',
            success: (json) => {
                this.setData({
                    title: json.data.result['title'],
                    smalltext: json.data.result['smalltext'],
                    id: options.id
                });
                wx.hideLoading();
            }
        });
        var that = this;
        //  高度自适应
        wx.getSystemInfo({
            success: function (res) {
                var clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                var calc = clientHeight * rpxR - 98;
                that.setData({
                    winHeight: calc
                });
            }
        });
        this.getListData(this.data.currentTab);
    },
    getListData: function (classid, more) {
        let that = this;
        let _arr = this.data.contentArray;
        wx.request({
            url: 'https://www.yishuzi.com.cn/jianjie8_xiaochengxu_api/xiaochengxu/juzi/?getJson=column&classid=' + classid,
            method: 'GET',
            dataType: 'json',
            success: (json) => {
                console.log('json.data.result---', json);
                if (more) {
                    let _newArr = [];
                    for (let index = 0; index < json.data.result.length; index++) {
                        _newArr.push({
                            classid: json.data.result[index].classid,
                            id: json.data.result[index].id,
                            title: json.data.result[index].title,
                            smalltext: json.data.result[index].smalltext
                        });
                    };
                    _arr = _arr.concat(_newArr);
                    that.setData({
                        contentArray: _arr
                    });
                } else {

                    let _newArr = [];
                    for (let index = 0; index < json.data.result.length; index++) {
                        _newArr.push({
                            classid: json.data.result[index].classid,
                            id: json.data.result[index].id,
                            title: json.data.result[index].title,
                            smalltext: json.data.result[index].smalltext
                        });
                    };
                    console.log('===', _newArr);
                    that.setData({
                        contentArray: _newArr
                    });
                };
                console.log('contentArray--==', this.data.contentArray);
                wx.hideLoading();
            }
        })
    },
    copyTBL: function (e) {
        console.log('wwweeee', e);
        var self = this;
        wx.setClipboardData({
            data: e.currentTarget.dataset.text.trim(),
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        wx.showToast({
                            title: '复制成功',
                        })
                    }
                })
            }
        })
    }
})