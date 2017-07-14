var app = getApp()
var util = require('../../utils/util.js')
Page({
  //================  start   ================
  data: {
    userInfo: null,
    firstName: null,
    focus: true,
  },
  onLoad: function (options) {
    var that = this
    that.setData({
      userInfo: app.userInfo
    })
  },

  //输入框变化事件 
  bindinput: function (event) {
    this.setData({ firstName: event.detail.value })
  },

  // 登录按钮点击
  bindButtonTap: function (event) {
    var that = this
    //提示输入姓名
    if (that.data.firstName == null) {
      that.showDialog()
    } else {

      var uid = that.data.userInfo.id
      var firstname = that.data.firstName
      var url = app.urls.UpdateUserFirstName + uid + '/' + firstname
      console.log(url)
      //发起网络请求
      wx.request({
        url: url,
        data: {},
        method: 'GET',
        dataType: 'json',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          var data = res.data
          app.userInfo = data.data;
          //跳转回去
          wx.switchTab({ url: '../wode/wode' })

        }
      })

    }
  },
  //==================================
  //USER CUSTOM
  //==================================
  showDialog: function () {
    var that = this
    wx.showModal({
      title: '提示',
      showCancel: false,
      confirmText: '马上输入',
      content: '请输入尊贵的姓氏 (最长两位)',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            focus: true
          })
        }
      }
    })
  }
  //================  end   ================
})