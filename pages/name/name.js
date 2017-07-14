var util = require('../../utils/util.js')
//获取应用实例
var app = getApp()
Page({
  //--------start-------------------
  data: {
    hidden: true,
    hasRefesh: false,
    hasMore: false,
    list: null,
    index: 1,
    size: 0,
    nomore: false,
    title: '',
    from: 1,
    userInfo: null,
    info: "加载中",
    scrollHeight: 0,
    windowWidth: 0,
    animation: null,
    animationData: {},
    dictionarys: null,
    loading_dict: false,
    nameData: null,
    isLoading: false,
    selectedName:''
  },

  onLoad: function (option) {
    var that = this


    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease-in-out",
      delay: 0
    })

    that.setData({
      animation: animation
    })


    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
          windowWidth: res.windowWidth
        });
      }
    })

    //设置标题
    wx.setNavigationBarTitle({
      title: option.title
    })
    //刷新页面
    this.setData({
      from: option.id,
      title: option.title,
      userInfo: app.userInfo
    })

    //设置已点击过
    wx.getStorage({
      key: app.CONSTANT.HASREAD,
      success: function (res) {
        var oldData = res.data;
        var clickedItem = option.id;
        oldData.push(clickedItem);
        var newData = util.unique(oldData);
        wx.setStorage({
          key: app.CONSTANT.HASREAD,
          data: newData
        })
      },
      fail: function () {
        var clickedItem = option.id;
        wx.setStorage({
          key: app.CONSTANT.HASREAD,
          data: [clickedItem]
        })
      }
    })


  },

  onShow: function () {
    var that = this
    //获取上次看到的页面

    // var value = wx.getStorageSync(that.data.title)

    //  that.setData({
    //         index: value
    //       })


    that.getData(true)

  },

  //================================================
  // USER CUSTOM
  //================================================
  getData:function(refresh) {
    wx.showNavigationBarLoading()
    var that = this
    var myIndex = that.data.index;
    if (!refresh) {
      myIndex = myIndex + 1;
    }
    //加载数据
    var url = app.urls.GETNAME + this.data.from + '/' + myIndex
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

    console.log(ndata)
  },
  scroll: function (e) {
    if (!this.data.hidden) {
      this.hiddenPopwindow()
    }
  },
  //加载更多
  loadMore: function () {
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
  //点击名字
  nameClick: function (e) {

    var that = this

    //设置加载中...
    that.setData({
      loading_dict: true,
      dictionarys: null
    })

    if (this.data.hidden) {
      this.showPopwindow()
    }

    var sname = e.target.dataset.s
    var hname = e.target.dataset.hi
    var name_all = e.target.dataset.all

    that.setData({
      nameData: name_all,
      selectedName:sname
    })

    //发送打开事件给后台
    var url = app.urls.FINDDATA + sname
    wx.request({
      url: url,
      method: 'GET',
      dataType: 'json',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        var data = res.data
        that.setData({
          loading_dict: false,
          dictionarys: data.data
        })
      }
    })

    const ctx = wx.createCanvasContext('myCanvas')
    ctx.setFontSize(20)
    if (ctx.setTextAlign) {
      ctx.setTextAlign('center')
    }
    // ctx.setTextAlign('center')

    var leng = hname.length * 22;

    for (var i = 0; i < hname.length; i++) {

      if (sname.length > 1) {
        if (hname[i] == sname[0] || hname[i] == sname[1]) {
          ctx.setFillStyle('red')
        } else {
          ctx.setFillStyle('white')
        }

      } else {
        if (hname[i] == sname[0]) {
          ctx.setFillStyle('red')
        } else {
          ctx.setFillStyle('white')
        }
      }
      ctx.fillText(hname[i], this.data.windowWidth / 2 - leng / 2 + i * 22, 25)
    }

    ctx.draw()

  },
  hiddenPopwindow: function () {

    var animation = this.data.animation


    animation.translateY(-250).step()

    this.setData({
      animationData: animation.export(),
      hidden: true
    })
  },
  showPopwindow: function () {


    var animation = this.data.animation

    animation.translateY(250).step()

    this.setData({
      animationData: animation.export(),
      hidden: false
    })

  },
  pop_sure: function () {
    var that = this
    if (!that.data.hidden) {
      that.hiddenPopwindow()
    }
    util.showToastWith('已收藏!')
    that.addStore()
  },
  pop_cancel: function () {
    if (!this.data.hidden) {
      this.hiddenPopwindow()
    }
  },
  addStore: function () {

    let uid = app.userInfo.id;
    let nid = this.data.nameData.id;
    let name = this.data.nameData.name;
    let description = this.data.nameData.description;

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
        console.log(data.data)
      }
    })
  },
  onShareAppMessage: function (res) {
      var that = this
      var fn = that.data.userInfo.firstName
      var ln = that.data.selectedName
      if (res.from === 'button') {
          // 来自页面内转发按钮
          console.log(res.target)
      }
      return {
          title: fn + ln,
          path: '/pages/name/name',
          success: function (res) {
              // 转发成功
          },
          fail: function (res) {
              // 转发失败
          }
      }
  }
  //--------------end---------------------
})
