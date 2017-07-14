//app.js
App({
  onLaunch: function () {
    var that = this
    that.getUserInfo(function (userInfo) {
      if (userInfo != "error") {
        that.userInfo = userInfo
      } else {
        //登录失败,或者获取缓存失败后跳到登录页面进行绑定
        wx.redirectTo({ url: 'pages/login/login' })
      }
    })
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.userInfo) {
      typeof cb == "function" && cb(this.userInfo)
    } else {
      wx.getStorage({
        key: 'loginsessionkey',
        success: function (res) {
          //登录过,读取key
          var mkey = res.data
          // console.log(mkey)
          //发起网络请求
          wx.request({
            url: that.urls.GETUSERINFO,
            data: {
              sessionKey: mkey,
            },
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
              var data = res.data
              if (data.success) {
                typeof cb == "function" && cb(data.data)
              } else {
                typeof cb == "function" && cb('error')
              }
            },
            fail: function (res) {
              typeof cb == "function" && cb('error')
            }
          })

        },
        fail: function () {
          //未登录过,没有获取到缓存
          typeof cb == "function" && cb('error')
        }
      })
    }
  },
  //==================DATA========================
  //user info
  userInfo: null,
  //all url
  urls: {
    // 'GETCODE': 'http://name.dev/wxCode/',
    // 'GETNAME': 'http://name.dev/getName/',
    // 'GETUSERINFO': 'http://name.dev/wxInfo',
    // 'REGISTER': 'http://name.dev/wxRegister',
    // 'SRCDATA': 'http://name.dev/getSrcData/',
    // 'HASREAD': 'http://name.dev/hasRead/',
    // 'RANDONENAME': 'http://name.dev/randOneName/',
    // 'FINDDATA': 'http://name.dev/findData/',
    // 'UpdateUserFirstName': 'http://name.dev/updateUserFirstName/',
    // 'AddStore': 'http://name.dev/addStore',
    // 'GetStore': 'http://name.dev/getStore/',
    // 'GetNameScore': 'http://name.dev/getScoreData/',
    // 'FindNameInfo': 'http://name.dev/findNameInfo/',
    // 'GetSimpleStore': 'http://name.dev/getSimpleStore/',
    // //http://name.dev/searchName/1/%E5%A5%BD/1
    // 'SearchName': 'http://name.dev/searchName/',
    // 'DelStore': 'http://name.dev/delStore',
    // 'GetSrcDataDetails': 'http://name.dev/getSrcDataDetails/',

    'GETCODE': 'https://www.idoapi.com/wxCode/',
    'GETNAME': 'https://www.idoapi.com/getName/',
    'GETUSERINFO': 'https://www.idoapi.com/wxInfo',
    'REGISTER': 'https://www.idoapi.com/wxRegister',
    'SRCDATA': 'https://www.idoapi.com/getSrcData/',
    'HASREAD': 'https://www.idoapi.com/hasRead/',
    'RANDONENAME': 'https://www.idoapi.com/randOneName/',
    'FINDDATA': 'https://www.idoapi.com/findData/',
    'UpdateUserFirstName':'https://www.idoapi.com/updateUserFirstName/',
    'AddStore': 'https://www.idoapi.com/addStore',
    'GetStore': 'https://www.idoapi.com/getStore/',
    'GetNameScore': 'https://www.idoapi.com/getScoreData/',
    'FindNameInfo': 'https://www.idoapi.com/findNameInfo/',
    'GetSimpleStore': 'https://idoapi.com/getSimpleStore/',
    //http://name.dev/searchName/1/%E5%A5%BD/1
    'SearchName': 'https://idoapi.com/searchName/',
    'DelStore': 'https://idoapi.com/delStore',
    'GetSrcDataDetails': 'https://idoapi.com/getSrcDataDetails/',
  
  
  },
  //all constant
  CONSTANT: {
    'HASREAD': 'HASREAD'
  }

})