var HOST='https://m.qianchengxiao.com'
var baseUrl = 'https://amzs.esells.cn/api/'
var Interface = {
  'getSelData': {
    url: 'HYJY/Paths/GetNextPaths',
    method: 'post'
  },
  // 'city': {//省市
  //   url: 'AMZDS/SpiderAsin/getPage',
  //   method: 'post'
  // },
  // 'colleges': {//院校
  //   url: 'AMZDS/SpiderAsin/getPage',
  //   method: 'post'
  // },
  // 'system': {//院系
  //   url: 'AMZDS/SpiderAsin/getPage',
  //   method: 'post'
  // },
  // 'major': {//专业
  //   url: 'AMZDS/SpiderAsin/getPage',
  //   method: 'post'
  // },
  // 'direction': {
  //   url: 'AMZDS/SpiderAsin/getPage',
  //   method: 'post'
  // },
  // 'subject': {//科目
  //   url: 'AMZDS/SpiderAsin/getPage',
  //   method: 'post'
  // },
  // 'submit': {// 首页提交接口
  //   url: 'AMZDS/SpiderAsin/getPage',
  //   method: 'post'
  // },
  // 'getUserInfo': {// 报考信息页面获取用户学院信息接口
  //   url: 'AMZDS/SpiderAsin/getPage',
  //   method: 'post'
  // },
  'getCode': {// 报考信息页面获取验证码
    url: 'HYJY/Paths/GetCode',
    method: 'post'
  },
  'complete': {//验证码填写完成接口
    url: 'HYJY/Paths/GetRank',
    method: 'post'
  },
  'getRank': {//排名页面数据
    url: 'HYJY/Paths/GetInfo',
    method: 'post'
  }
}

var PFunc = {
  ajax: function (name, data, k, hwnd) {
    if (k == 1) {
      data = JSON.stringify(data)
    }

    var head = {
      token: 'ce975909-7ed8-4c19-9cf8-a32ab0498d32',
      loginName: 'limenglong' 
    }
    
    if (!Interface[name]) {
      return $.Deferred().reject()
    }

    var url = Interface[name].url
    if (Interface[name].url.indexOf("http://") == -1 && Interface[name].url.indexOf("https://") == -1) {
      url = baseUrl + url
    }
    var method = Interface[name].method
    var contentType = "application/json"
    
    return HTTP({
      url: url,
      method: method,
      params: data,
      contentType: contentType
    })

    function HTTP(params) {
      var defer = $.Deferred()
      $.support.cors = true

      $.ajax({
        url: params["url"],
        type: params["method"].toLocaleLowerCase(),
        data: params["params"],
        timeout : 600 * 1000, //超时时间设置，单位毫秒
        dataType: "json",
        contentType: params["contentType"],
        headers: head,
        success: function (result) {
          if (!result.success) {
            var message = result.message || '请求出错';
            vant.Notify({ type: 'danger', message: message });
            defer.reject(result, hwnd)
          }
          defer.resolve(result, hwnd)
        },
        error: function (xhr, status, error) {
          defer.reject(xhr, status, error, hwnd)
        }
      })
      return defer
    }
  }
}

var Cache = {
  set: function(key, val, time) {
    if (!time) {
      time = 1000 * 60 * 60 * 24 * 360
    }
    window.localStorage[key] = JSON.stringify({
      data: val,
      time: new Date().getTime() + "-" + time
    });
  },
  get: function (key, out) {
    /*获取cookie参数*/
    var data = window.localStorage[key];
    if (data) {
      var dataObj = JSON.parse(data);
      if (dataObj.time) {
        var timers = dataObj.time;
        var li = (timers + "").split("\-");
        if (li.length == 2) {
          out = out || li[1];
          var oldtime = parseFloat(li[0]);
          if ((new Date().getTime() - oldtime) > out) {
            return "";
          } else {
            var s = dataObj.data;
            // if (out == 0) {
            //   s = dataObj;
            // }
            // if (s === false) {
            //   return false
            // }
            // s = s || "";
            
            return s;
          }
        } else {
          return "";
        }
      } else {
        return "";
      }
    } else {
      return "";
    }
  },
  clear: function (key) {
    window.localStorage.removeItem(key)
  }
}

Vue.prototype.ajax = PFunc.ajax
Vue.prototype.cache = Cache

