
var cityKey = {'北京市':{id: "1", name: "北京市"}};
var collegesKey = {'北京语言大学':{id: "1-10032", name: "北京语言大学"}};
var systemKey = {};
var majorKey = {};
var directionKey = {};
var subjectKey = {};

// -- 对外经济贸易大学  惠园教育  1-10036
// -- 首都经济贸易大学 首经贸考研校 1-10038
// -- 中国海洋大学 海大考研校 15-10423
// -- 青岛大学 青大考研校 15-11065
// -- 天津财经大学 天财考研校  2-10070
// -- 山东财经大学 山财考研校 15-10456
// -- 华南师范大学  华南师范考研校  19-10574
// -- 北京语言大学  北语考研校 1-10032
// -- 云南大学  云大考研校 25-10673

// https://pm.kaoyanxiao.com/1-10036/index.html
// https://pm.kaoyanxiao.com/1-10038/index.html
// https://pm.kaoyanxiao.com/15-10423/index.html
// https://pm.kaoyanxiao.com/15-11065/index.html
// https://pm.kaoyanxiao.com/2-10070/index.html
// https://pm.kaoyanxiao.com/15-10456/index.html
// https://pm.kaoyanxiao.com/19-10574/index.html
// https://pm.kaoyanxiao.com/1-10032/index.html
// https://pm.kaoyanxiao.com/25-10673/index.html



new Vue({
  el: '#app',
  data: function(){
    return {
      // params:{},
      height: '568px',
      cityFlag: false,
      collegesFlag: false,
      systemFlag: false,
      majorFlag: false,
      directionFlag: false,
      subjectFlag: false,
      loading: false,
      city:'北京市',
      colleges: '北京语言大学',
      system: '',
      major: '',
      direction: '',
      subject: '',
      cityList: [],
      collegesList: [],
      systemList: [],
      majorList: [],
      directionList: [],
      subjectList: [],
      subjectSel: 0,
      show: false,
      phone: '',
      code: '',
      codeText: '发送验证码',
      isdisabled: false
    }
  },
  created() {
    var sPaths = Cache.get('s-paths');
    var rank = Cache.get('rank');
    if(rank){
      window.location.href =  './rank.html'
      return
    }
    if(sPaths){
      window.location.href =  './grade.html'
      return
    }

    this.height = window.innerHeight + 'px';
    this.getInitData()
  },
  methods: {
    getInitData: function(){
      //省市数据调用
      var that = this
      this.ajax('getSelData', '0', 1).then(function(res){
        // res = {"resultCode":100,"message":null,"success":true,"data":[{"id":"1","rid":"1","name":"北京市","pid":"0","prid":"0","pname":"N/A","level":1,"isSmall":false,"CreateTime":null}]}
        if(res.data){
          var obj = {}, arr = []
          res.data.forEach(item => {
            arr.push(item.name)
            obj[item.name] = item
          });
          cityKey = obj
          that.cityList = arr
        }
      })
    },
    bannerLink: function(flag) {
      if(flag == 1){
        window.location.href = 'https://mp.weixin.qq.com/s/bw1CeITrfb681TuyrFTb8g'
      }else{
        window.location.href = 'https://mp.weixin.qq.com/s/Qz96y24qaWKsn6SYt6ODxA'
      }
    },
    cellHandel: function(key, dataKey){
      var that = this
      this.resetFlag()
      var keys = key + 'Flag'
      this[keys] = true
      if(key != 'city'){
        // var data = {Location: "US"}
        if(!window[dataKey+'Key'][that[dataKey]]){
          vant.Notify({ type: 'warning', message: '请先选择上级数据！' });
          this[keys] = false
          return
        }
        var id = window[dataKey+'Key'][that[dataKey]].id
        this.loading = true
        this.ajax('getSelData', id, 1).then(function(res){
          var list =  key + 'List';
          // res = {"resultCode":100,"message":null,"success":true,"data":[{"id":key,"rid":"1","name":key,"pid":"0","prid":"0","pname":"N/A","level":1,"isSmall":false,"CreateTime":null}]}
          if(res.data){
            var obj = {}, arr = []
            res.data.forEach(item => {
              arr.push(item.name)
              obj[item.name] = item
            });
            window[key + 'Key'] = obj
            that[list] = arr
          }
          that.loading = false;
        })
      }
    },
    cancel: function(key){
      var keys = key + 'Flag'
      this[keys] = false
    },
    resetFlag: function(){
      this.cityFlag = false
      this.collegesFlag = false
      this.systemFlag = false
      this.majorFlag = false
      this.directionFlag = false
      this.subjectFlag = false
    },
    cityConfirm: function(value, index){
      this.city = value
      this.cityFlag = false
    },
    collegesConfirm: function(value, index){
      this.colleges = value
      this.collegesFlag = false
    },
    systemConfirm: function(value, index){
      this.system = value
      this.systemFlag = false
    },
    majorConfirm: function(value, index){
      this.major = value
      this.majorFlag = false
    },
    directionConfirm: function(value, index){
      this.direction = value
      this.directionFlag = false
    },
    subjectConfirm: function(index){
      this.subject = this.subjectList[index]
      this.subjectFlag = false
    },
    submit: function(){
      if(!(this.city&&this.colleges&&this.system&&this.major&&this.direction&&this.subject)){
        vant.Notify({ type: 'danger', message: '请先填写完整信息在提交！' });        
        return
      }
      var that = this
      var data = {
        p1: { id: cityKey[this.city].id, name: this.city},
        p2: { id: collegesKey[this.colleges].id, name: this.colleges},
        p3: { id: systemKey[this.system].id, name: this.system},
        p4: { id: majorKey[this.major].id, name: this.major},
        p5: { id: directionKey[this.direction].id, name: this.direction},
        p6: { id: subjectKey[this.subject].id, name: this.subject}
      }
      Cache.set("s-paths", data);
      window.location.href =  './grade.html'
    },
    //验证逻辑
    completeHandle: function(){
      if(!this.phone || !(/^1[3456789]\d{9}$/.test(this.phone))){
        vant.Notify({ type: 'warning', message: '请先输入正确的手机号' });
        return
      }
      if(!this.code){
        vant.Notify({ type: 'warning', message: '请先填写验证码！' });        
        return
      }
      var that = this
      var data = {
        tel: this.phone,
        code: this.code
      }
      this.ajax('getInfoExist', data, 1).then(function(res){
        // console.log(res)
        var sPaths = {
          p1: { id: res.data.p1id, name: res.data.p1name},
          p2: { id: res.data.p2id, name: res.data.p2name},
          p3: { id: res.data.p3id, name: res.data.p3name},
          p4: { id: res.data.p4id, name: res.data.p4name},
          p5: { id: res.data.p5id, name: res.data.p5name},
          p6: { id: res.data.p6id, name: res.data.p6name}
        }
        Cache.set("s-paths", sPaths);
        Cache.set("uinfo", res.data.Id);
        Cache.set("rank", res.data);
        window.location.href = './rank.html'
      })
    },
    getCode: function(){
      var that = this
      if(this.isdisabled){
        return
      }
      if(!this.phone || !(/^1[345678]\d{9}$/.test(this.phone))){
        vant.Notify({ type: 'warning', message: '请先输入正确的手机号' });
        return
      }
      
      this.ajax('checkTel', this.phone, 1).then(function(res){
        if(res.message == 'OK'){
          that.ajax('sendVCodeLogin', that.phone, 1).then(function(res){
            vant.Notify({ type: 'success', message: '验证码已发送，请注意查收！' });
            that.setTime()
          })
        }else{
          vant.Notify({ type: 'danger', message: '该手机号未提交过信息，请检查手机号是否填写错误！' });
        }
      })

    },
    setTime:function (){
      var time = 60;
      var i = 0;
      var that = this;
      this.codeText = (time)+"s";
      that.isdisabled=true
      var set = setInterval(function() {
        that.codeText = (--time)+"s";
        i++;	
        if(i==60){
          that.isdisabled=false
          that.codeText = "发送验证码";
          clearInterval(set);
        }
      }, 1000);
    }
  },
});