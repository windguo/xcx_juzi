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
                imageUrl: this.data.titlepic,
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
                title: '各类经典最新句子每日更新...',
                path: '/pages/juzi/juzi',
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
        contentArray: []
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
                            smalltext: json.data.result[index].smalltext,
                            title: json.data.result[index].title
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
                            smalltext: json.data.result[index].smalltext,
                            title: json.data.result[index].title
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
    // 滚动切换标签样式
    swiperChange: function (e) {
        console.log('swiperChange==e', e);
        this.setData({
            currentTab: e.detail.current
        });
        this.getListData(this.data.expertListId[e.detail.current]);
        this.checkCor();
    },
    // 点击标题切换当前页时改变样式
    swichNav: function (e) {
        console.log('eee--click', e);
        var cur = e.target.dataset.current;
        if (this.data.currentTaB == cur) { return false; }
        else {
            this.setData({
                currentTab: cur
            })
        };
        this.getListData(this.data.expertListId[cur]);
    },
    //判断当前滚动超过一屏时，设置tab标题滚动条。
    checkCor: function () {
        wx.showLoading({}),
            this.setData({
                scrollLeft: 160 * this.data.currentTab - 200
            });
    },
    onLoad: function () {
        // wx.request({
        //     url: 'http://www.jianjie8.com/e/member/doaction.php',
        //     data: {
        //         clienttype: 'xiaochengxu',
        //         enews: 'testIsLogin'
        //     },
        //     header: {
        //         'content-type': 'application/x-www-form-urlencoded',
        //         'userid': app.globalData.userid,
        //         'token': app.globalData.token
        //     },
        //     method: 'POST',
        //     dataType: 'json',
        //     success: (json) => {
        //         console.log('jsonjsonjson----login', json);
        //     }
        // })

        wx.showLoading({})
        let _classid = [];
        let _expertListi = [];
        wx.request({
            url: 'https://www.yishuzi.com.cn/jianjie8_xiaochengxu_api/xiaochengxu/juzi/?getJson=class',
            method: 'GET',
            dataType: 'json',
            success: (json) => {
                console.log('json000class===--', json.data.result);
                for (var i = 0; i < json.data.result.length; i++) {
                    _expertListi.push(i)
                    _classid.push(json.data.result[i].classid);
                };
                this.setData({
                    expertList: json.data.result,
                    expertListi: _expertListi,
                    expertListId: _classid
                });
            }
        });
        this.getListData(this.data.currentTab);
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
    },
    scrolltolowerLoadData: function (e) {
        console.log('scrolltolowerLoadData', e);
        this.getListData(this.data.expertListId[this.data.currentTab], true);
    }
})