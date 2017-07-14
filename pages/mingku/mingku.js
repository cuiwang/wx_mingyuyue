var util = require('../../utils/util.js')
//获取应用实例
var app = getApp()
Page({
    //---------------start-------------------
    data: {
        imgUrls: [
            { 'url': 'https://ws3.sinaimg.cn/large/006tNc79gy1fg7vruwdr7j30zk0m878n.jpg' },
            { 'url': 'https://ws3.sinaimg.cn/large/006tNc79gy1fg7vsgvro3j30jq0cb76p.jpg' },
            { 'url': 'https://ws1.sinaimg.cn/large/006tNc79gy1fg7vv69u4hj30hn08jwf3.jpg' }
        ],
        list: null,
        index: 1,
        size: 0,
        scrollHeight: 0,
        nomore: false,
        isLoading: false

    },
    onLoad: function () {
        var that = this
        that.getData(true)
        //设置标题
        wx.setNavigationBarTitle({
            title: '名库'
        })
        // 计算高度,自适应滚动视图
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    scrollHeight: res.windowHeight,
                });
            }
        })

    },



    onShow: function () {
        var that = this
    },



    //========================================================
    // USER CUSTOM
    //========================================================
    //
    //getData
    getData: function (refresh) {
        var that = this
        //防止多次加载
        that.setData({
            isLoading: false
        })
        wx.showNavigationBarLoading()
        var that = this
        var myIndex = that.data.index;
        if (!refresh) {
            myIndex = myIndex + 1;
        }
        var url = app.urls.SRCDATA + myIndex
        console.log(url)
        //发起网络请求获取更多数据
        wx.request({
            url: url,
            method: 'GET',
            dataType: 'json',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                var data = res.data
                if (!data.success) {
                    util.showToastWith('没有更多数据了!')
                } else {
                    that.setData({
                        size: data.count,
                        index: myIndex,
                        nomore: data.count < 10 ? true : false
                    })
                    that.setNewData(data.data, refresh)
                }

            },
            fail: function (res) {
                util.showToastWith('网络异常!')
            },
            complete: function () {
                wx.hideNavigationBarLoading()
                //防止多次加载
                that.setData({
                    isLoading: false
                })
            }
        })
    },
    setNewData: function (data, refresh) {
        var that = this
        var ndata = data
        if (!refresh) {
            ndata = that.data.list.concat(data)
        }
        that.setData({
            list: ndata
        })
    },
    //test todo
    clickme: function () {
        util.showToastWith('成功!')
    },
    upper: function (e) {
        console.log('upper')
        var that = this
        //防止多次加载
        if (that.data.isLoading) {
            return;
        }
        //防止多次加载
        that.setData({
            isLoading: true
        })
        that.getData(true)
    },
    //加载更多
    lower: function () {
        console.log('lower')
        var that = this
        //防止多次加载
        if (that.data.isLoading) {
            return;
        }
        if (this.data.nomore) {
            //没有数据了
            console.log('no data')

        } else {
            //防止多次加载
            that.setData({
                isLoading: true
            })
            that.getData(false)

        }


    },
    onShareAppMessage: function (res) {
        var that = this
        
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: "名余曰 - 名库",
            path: '/pages/mingku/mingku',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
    //---------------end-------------------
})
