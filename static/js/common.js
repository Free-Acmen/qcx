var HOST ='//adm.kaoyanxiao.com:8099'
var baseUrl = 'https://adm.kaoyanxiao.com/api/'
// var baseUrl = 'http://192.168.7.80:5002/api/'

var Interface = {
  'getSelData': {
    url: 'HYJY/Paths/GetNextPaths',
    method: 'post'
  },
  'checkTel': {//验证手机号是否存在
    url: 'HYJY/Paths/CheckTel',
    method: 'post'
  },
  'sendVCodeLogin': {// 报考信息页面获取验证码
    url: 'HYJY/Paths/SendVCodeLogin',
    method: 'post'
  },
  'getInfoExist': {// 报考信息页面获取验证码
    url: 'HYJY/Paths/GetInfoExist',
    method: 'post'
  },
  'getCode': {// 报考信息页面获取验证码
    url: 'HYJY/Paths/SendVCode',
    method: 'post'
  },
  'complete': {//验证码填写完成接口
    url: 'HYJY/Paths/GetRank',
    method: 'post'
  },
  'getRank': {//排名页面数据
    url: 'HYJY/Paths/GetInfo',
    method: 'post'
   },
   'getWxConfig': {
       url: 'HYJY/Paths/GetWxConfig',
       method: 'post'
    },
    'getRankList': {
       url: 'HYJY/Paths/GetUsers',
       method: 'post'
    },
    'getContent':{
      url: 'HYJY/History/GetContent',
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
  },
  getUrlParams:function(){
    if(!window.location.search){
      return
    }
    let searchStr = window.location.search.slice(1)
    var jumpgoodurlparam = decodeURI(searchStr).split("&")
    var jumpgoodurlarr = {}
    jumpgoodurlparam.forEach(item => {
      let index = item.indexOf('=');
      let key = item.slice(0, index)
      let val = item.slice(index+1)
      jumpgoodurlarr[key] = val
    })
    return jumpgoodurlarr
  },
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

PFunc.ajax('getWxConfig', '', 1).then(function (res) {
    wx.config({
        debug: true,
        appId: res.data.appId, // 必填，公众号的唯一标识
        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
        signature: res.data.signature,// 必填，签名
        jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareWeibo'] // 必填，需要使用的JS接口列表
    });

    wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
        var shareConfig = {
            link: window.location.href,
            title: '前程校2022考研初试排名查询',
            desc: '我刚在这里查询了考研初试排名，很好用，你也来查一下吧！知己知彼，复试无忧！',
            imgUrl: '../images/logo@300px.png'
        }

        wx.updateAppMessageShareData({
            title: shareConfig.title, // 分享标题
            desc: shareConfig.desc, // 分享描述
            link: shareConfig.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: shareConfig.imgUrl, // 分享图标
            success: function () {
                // 设置成功
            }
        })

        wx.updateTimelineShareData({
            title: shareConfig.title, // 分享标题
            link: shareConfig.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: shareConfig.imgUrl, // 分享图标
            success: function () {
                // 设置成功
            }
        })

        wx.onMenuShareWeibo({
            title: shareConfig.title, // 分享标题
            desc: shareConfig.desc, // 分享描述
            link: shareConfig.link, // 分享链接
            imgUrl: shareConfig.imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    });
})

