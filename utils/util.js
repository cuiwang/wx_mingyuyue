function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * Object 添加属性
 */
function addObject(obj1, obj2) {
  for (var key in obj2) {
    if (obj1.hasOwnProperty(key)) {
      obj1[key].push.apply(obj1[key], obj2[key])
    } else {
      obj1[key] = obj2[key];
    }
  }
  return obj1;
}

/**
 * 去除数组重复项
 */
function unique(arr) {
  var result = [], hash = {};
  for (var i = 0, elem; (elem = arr[i]) != null; i++) {
    if (!hash[elem]) {
      result.push(elem);
      hash[elem] = true;
    }
  }
  return result;
}

/**
 * 查找数组中的元素
 */
function contains(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return true;
    }
  }
  return false;
}

/**
 * 弹出提示框
 */
function showToastWith(msg, icon = 'success', time = 2000) {

  if (icon == 'success') {
    wx.showToast({
      title: msg,
      icon: icon,
      duration: time
    })
  } else if (icon == 'error') {
    wx.showToast({
      title: msg,
      image: '../../assets/images/error.png',
      duration: time
    })
  }
  else {
    wx.showToast({
      title: msg,
      image: '../../assets/images/info.png',
      duration: time
    })
  }


}





module.exports = {
  formatTime: formatTime,
  addObject: addObject,
  unique, unique,
  contains, contains,
  showToastWith, showToastWith
}
