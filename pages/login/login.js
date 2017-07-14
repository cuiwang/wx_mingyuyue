var app = getApp()
var util = require('../../utils/util.js')
Page({
  //================  start   ================
  data: {
    UserInfo: null,
    avatarUrl: '../../assets/images/my_s_icon.png',
    key: null,
    firstName: null,
    focus: true,
    tmp: null
  },

  onLoad: function (options) {
    var that = this
    that.getUserInfo()
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
      //提示重新授权
      if (that.data.UserInfo == null) {
        that.getUserInfo()
      }
      else {
         //可以注册 
        const self = this
        var key = self.data.key
        var userInfo = self.data.UserInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女 
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        var firstname = self.data.firstName
        console.log('准备注册')
        //发起网络请求
        wx.request({
          url: app.urls.REGISTER,
          data: {
            sessionKey: key,
            nickName: nickName,
            avatarUrl: avatarUrl,
            gender: gender,
            province: province,
            city: city,
            country: country,
            firstname: firstname,
          },
          method: 'POST',
          dataType: 'json',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            var data = res.data
            if (!data.success) {
              //注册失败
              console.log(data.data)
              util.showToastWith(data.data, 'error')
            } else {
              //注册成功
              wx.setStorage({
                key: "loginsessionkey",
                data: key
              })
              app.userInfo = data.data;
              //跳转回去
              wx.switchTab({ url: '../wode/wode?register=1' })
            }
          }
        })
      }
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
  },
  getUserInfo: function () {
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          var url = app.urls.GETCODE + res.code
          console.log(url)
          wx.request({
            url: url,
            success: function (res) {
              console.log('login code == ' + res.data + "\n")
              if (res.data.success) {
                // seesionkey
                var key = res.data.data
                //1.通过seesionkey先拿一次数据,没拿到再授权注册
                //发起网络请求
                wx.request({
                  url: app.urls.GETUSERINFO,
                  data: {
                    sessionKey: key,
                  },
                  method: 'POST',
                  header: { 'content-type': 'application/x-www-form-urlencoded' },
                  success: function (res) {
                    var data = res.data
                    if (data.success) {
                      //获取到用户数据了,设置数据后返回
                      wx.setStorage({
                        key: "loginsessionkey",
                        data: key
                      })
                      app.userInfo = data.data;
                      //跳转回去
                      wx.switchTab({ url: '../wode/wode' })
                      //返回
                    } else {
                      //没有此用户,需要注册
                      //更新数据 - 弹出授权对话框
                      wx.getUserInfo({
                        //用户授权
                        success: function (res) {
                          var userInfo = res.userInfo
                          that.setData({
                            UserInfo: userInfo,
                            key: key,
                          })
                        }
                      })
                    }
                  }
                })

              } else {
                //从服务器获取数据失败了  
                console.log(res.data)
              }
            }
          })

        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })

  },
  retryGetUserInfo: function () {
    var that = this

    wx.getUserInfo({
      //用户授权
      success: function (res) {
        var userInfo = res.userInfo
        that.setData({
          UserInfo: userInfo,
          key: key,
        })
        that.getUserInfo()
      }
    })

    /*wx.showModal({
      title: '提示',
      showCancel: false,
      confirmText: '重新授权',
      content: '没有得到您的授权,请勾选中用户信息!',
      success: function (res) {
        if (res.confirm) {
          //重新打开授权
          wx.openSetting({
            success: (res) => {
              if (res.authSetting['scope.userInfo']) {
                //更新数据 - 弹出授权对话框
                that.getUserInfo()
              } else {
                util.showToastWith('请勾中用户信息!', 'error')
              }
            }
          })
        }
      }
    })*/
  }



  //================  end   ================
})