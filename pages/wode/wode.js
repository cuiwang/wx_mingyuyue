//index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')
Page({
    //================  start   ================
    data: {
        userInfo: null,
        animationData: {},
        animationLineData: {},
        dictionarys: {},
        scoreData: {},
        srcData: {},
        storeData: {},
        windowWidth: 0,
        canAccelerometer: true,
        hideScore: true
    },
    onLoad: function (option) {


        var that = this
        if (app.userInfo) {
            //设置标题
            wx.setNavigationBarTitle({
                title: '我的'
            })

            //获取记录
            wx.getStorage({
                key: 'hideScore',
                success: function (res) {
                    console.log(res.data)
                    that.setData({
                        hideScore: res.data
                    })
                    
                }
            })
            //获取系统状态,支撑滚动
            wx.getSystemInfo({
                success: function (res) {
                    that.setData({
                        windowWidth: res.windowWidth
                    });
                }
            })

            //如果是第一次注册,就生成一次名字
            if (option.register == 1) {
                that.randOneName()
            }

        } else {
            //没有获取到登录数据,就去登录
            wx.redirectTo({ url: '../login/login' })
        }
    },
    onShow: function () {
        var that = this

        if (app.userInfo) {
            //设置数据
            that.setData({ userInfo: app.userInfo })
            //设置标题
            wx.setNavigationBarTitle({
                title: that.data.userInfo.firstName
            })
            //微信摇一摇
            that.wxYaoyiyao()
            //动画
            that.lineAnimation()

            //获取姓名释义
            that.nameExp()
            //获取姓名得分
            that.getNameScore()
            //获得姓名来源
            that.findNameInfo()
            //获取收藏信息
            that.getStore()
        } else {
            util.showToastWith('正在加载......')
        }

        //监听加速
        if (wx.startAccelerometer) {
            wx.startAccelerometer()
        }

    },
    onHide: function () {
        if (wx.stopAccelerometer) {
            wx.stopAccelerometer()
        }
    },

    //================  用户自定义   ================
    wxYaoyiyao: function () {
        var that = this
        if (wx.onAccelerometerChange) {
            wx.onAccelerometerChange(function (res) {
                if ((res.x > 0.5 && res.y > 0.5) && that.data.canAccelerometer) {
                    wx.stopAccelerometer()
                    wx.vibrateLong()
                    that.setData({
                        canAccelerometer: false
                    })
                    that.randOneName()
                }
            })
        }
    },
    //================  Line动画   ================
    lineAnimation: function () {

        var animation = wx.createAnimation({
            duration: 3000,
            timingFunction: 'linear',
        })

        this.animation = animation


        var res = wx.getSystemInfoSync()
        var width = res.windowWidth * 0.8 * 0.7 * 0.96 - 10
        animation.translateX(width).step()
        animation.translateX(0).step()
        this.setData({
            animationLineData: animation.export()
        })
        setInterval(function () {
            animation.translateX(width).step()
            animation.translateX(0).step()
            this.setData({
                animationLineData: animation.export()
            })
        }.bind(this), 6000)
    },
    //================  摇晃动画   ================
    imageAnimation: function () {
        var animation = wx.createAnimation({
            duration: 150,
            timingFunction: 'linear',
        })

        animation.rotate(45).step()
        animation.rotate(-45).step()
        animation.rotate(45).step()
        animation.rotate(-45).step()
        animation.rotate(45).step()
        animation.rotate(-45).step()
        animation.rotate(0).step()


        this.setData({
            animationData: animation.export()
        })
    },
    //================  搜索名字   ================
    searchName: function (e) {

        var value = e.detail.value
        console.log(value)
        wx.navigateTo({
            url: '../search/search?title=' + value
        })

    },
    //================  获取名字来源信息   ================
    findNameInfo: function () {
        var that = this
        var sname = app.userInfo.nickName
        var url = app.urls.FindNameInfo + app.userInfo.id + '/' + sname
        wx.request({
            url: url,
            method: 'GET',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                var data = res.data

                //返回登录信息
                if (!data.success) {
                    //错误
                    console.log('error')
                } else {
                    //正常
                    that.setData({
                        srcData: data.data
                    })


                    var sname = data.data.name
                    var hname = data.data.description

                    const ctx = wx.createCanvasContext('myCanvas')
                    ctx.setFontSize(14)
                    if (ctx.setTextAlign) {
                        ctx.setTextAlign('center')
                    }
                    // ctx.setTextAlign('center')

                    var leng = hname.length * 15;

                    for (var i = 0; i < hname.length; i++) {

                        if (sname.length > 1) {
                            if (hname[i] == sname[0] || hname[i] == sname[1]) {
                                ctx.setFillStyle('red')
                            } else {
                                ctx.setFillStyle('black')
                            }

                        } else {
                            if (hname[i] == sname[0]) {
                                ctx.setFillStyle('red')
                            } else {
                                ctx.setFillStyle('black')
                            }
                        }
                        ctx.fillText(hname[i], that.data.windowWidth / 2 - leng / 2 + i * 15, 25)
                    }

                    ctx.draw()

                }

            },
            fail: function (res) {
                console.log(res)
            },
            complete: function () {
                // wx.startAccelerometer()
            }
        },
        )
    },
    //================  获取姓名得分   ================
    getNameScore: function () {
        var that = this
        var fname = app.userInfo.firstName
        var sname = app.userInfo.nickName
        var url = app.urls.GetNameScore + fname + '/' + sname
        wx.request({
            url: url,
            method: 'GET',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                var data = res.data

                //返回登录信息
                if (!data.success) {
                    //错误
                    console.log('error')
                } else {
                    //正常
                    that.setData({
                        scoreData: data.data
                    })

                }

            },
            fail: function (res) {
                console.log(res)
            },
            complete: function () {
                // wx.startAccelerometer()
            }
        },
        )

    },
    //================  随机获取名字   ================
    randOneName: function () {
        var that = this
        if (wx.stopAccelerometer) {
            wx.stopAccelerometer()
        }

        that.imageAnimation()


        //发起网络请求
        var url = app.urls.RANDONENAME + app.userInfo.id
        wx.request({
            url: url,
            method: 'GET',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                var data = res.data

                //返回登录信息
                if (!data.success) {
                    //错误
                    console.log('error')
                } else {
                    //正常
                    //  console.log(data.data)
                    app.userInfo.nickName = data.data.name
                    that.setData({
                        userInfo: app.userInfo,
                        srcData: data.data
                    })
                    //获取得分
                    that.getNameScore()
                    //获取来源
                    that.findNameInfo()
                }

            },
            fail: function (res) {
                console.log(res)
            },
            complete: function () {
                that.setData({
                    canAccelerometer: true
                })
                wx.startAccelerometer()
                that.wxYaoyiyao()
            }
        },
        )
    },

    //================  获取姓名释义   ================
    nameExp: function () {
        var that = this
        var sname = app.userInfo.nickName
        var url = app.urls.FINDDATA + sname
        wx.request({
            url: url,
            method: 'GET',
            dataType: 'json',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                var data = res.data
                that.setData({
                    dictionarys: data.data
                })
            }
        })
    },
    //================  修改姓氏   ================
    onChange: function () {
        wx.redirectTo({ url: '../change/change' })
    },

    //================  修改名字   ================
    onChangeName: function () {
        util.showToastWith('修改姓名', 'error')
    },

    //================  进入收藏列表   ================
    onGetStore: function () {
        wx.navigateTo({
            url: '../store/store'
        })
    },
    //================  添加收藏   ================
    addStore: function () {
        var that = this

        util.showToastWith('已收藏!')

        let uid = app.userInfo.id;
        let nid = that.data.srcData.id;
        let name = that.data.srcData.name;
        let description = that.data.srcData.description;


        //修改收藏状态
        that.data.srcData.stored = 1;
        that.setData({
            srcData: that.data.srcData,
        })

        //发起网络请求
        wx.request({
            url: app.urls.AddStore,
            data: {
                user_id: uid,
                name_id: nid,
                name: name,
                first_name: app.userInfo.firstName,
                description: description,
            },
            method: 'POST',
            dataType: 'json',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                var data = res.data
                //重新获取收藏记录
                that.getStore()
            }
        })
    },
    getStore: function () {
        var that = this
        //加载数据
        var url = app.urls.GetSimpleStore + app.userInfo.id
        //发起网络请求获取更多数据
        wx.request({
            url: url,
            method: 'GET',
            dataType: 'json',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                var data = res.data
                if (!data.success) {
                    // util.showToastWith('没有更多数据了!')
                } else {
                    console.log(data.data)
                    that.setData({
                        storeData: data.data
                    })

                }

            }
        })

    },
    //隐藏
    hindScore: function () {
        var that = this
        var hided = that.data.hideScore
        if (hided) {
            that.setData({
                hideScore: false
            })

            wx.setStorage({
                key: "hideScore",
                data: false
            })
        } else {
            that.setData({
                hideScore: true
            })
            wx.setStorage({
                key: "hideScore",
                data: true
            })
        }

    },
    onShareAppMessage: function (res) {
        var that = this
        var fn = that.data.userInfo.firstName
        var ln = that.data.userInfo.nickName
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: fn + ln,
            path: '/pages/wode/wode',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
    //================  end   ================
})
