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
    userInfo: null,
    info: "加载中",
    scrollHeight: 0,
    windowWidth: 0,
    animation: null,
    animationData: {},
    dictionarys: null,
    loading_dict: false,
    search_title: null,
    nameData: null,
    selectedName:''
  },

  onLoad: function (option) {
    var that = this

    console.log(option.title)

    that.setData({
      search_title: option.title
    })


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
      title: '搜索'
    })
    //刷新页面
    this.setData({
      userInfo: app.userInfo
    })
  },

  onShow: function () {
    var that = this
    that.searchName()

  },

  //================================================
  // USER CUSTOM
  //================================================
  //================  搜索名字   ================
  searchNameClick: function (e) {
    var that = this
    var value = e.detail.value
    that.setData({
      search_title: value
    })
    that.searchName()
  },
  searchName: function () {
    var that = this

    //加载数据
    var url = app.urls.SearchName + app.userInfo.id + '/' + that.data.search_title + '/' + that.data.index
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


          var mdata = data.data


          var leng = mdata.length


          that.setData({
            list: mdata,
            size: leng,
            nomore: leng < 100 ? true : false
          })

        }

      },
      fail: function (res) {
        util.showToastWith('网络异常!')
      }
    })

  },
  scroll: function (e) {
    if (!this.data.hidden) {
      this.hiddenPopwindow()
    }
  },
  //加载更多
  loadMore: function () {
    var that = this

    if (this.data.nomore) {
      //没有数据了

    } else {
      //加载更多
      var that = this
      var nidx = that.data.index + 1;
      var url = app.urls.GetStore + app.userInfo.id + '?page=' + nidx
      //发起网络请求
      wx.request({
        url: url,
        method: 'GET',
        dataType: 'json',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          var data = res.data
          if (!data.success) {
            // todo
            //----------- 注册失败 ---------
            wx.showToast({
              title: '没有更多数据了!',
              icon: 'success',
              duration: 1000
            })

          } else {
            //存储到本地,记录进度
            // wx.setStorage({
            //   key: that.data.title,
            //   data: nidx
            // })

            // var ndata=new Array("Saab","Volvo","BMW")

            var key = app.userInfo.id

            var mdata = data.data

            var value = mdata[key]
            var leng = value.length

            var ndata = util.addObject(that.data.list, data.data)
            // var ndata = extends(that.data.list,data.data)

            // console.log(ndata)
            // var leng = Object.keys(data.data).length

            that.setData({
              list: ndata,
              size: leng,
              index: nidx,
              nomore: leng < 100 ? true : false
            })

          }

        },
        fail: function (res) {

          util.showToastWith('没有更多数据了!')

        }
      })

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
      var that = this
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
          path: '/pages/search/search',
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
