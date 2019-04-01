const app = getApp();

Page({
    data:{
        backUrl:''
    },
    onLoad:function(){
        wx.clearStorageSync();
				wx.switchTab({
            url: '../index/index'
        });
    }
})