
var cityKey = {};
var collegesKey = {};
var systemKey = {};
var majorKey = {};
var directionKey = {};
var subjectKey = {};

new Vue({
  el: '#app',
  data: function(){
    return {
      height: '568px',
      cityFlag: false,
      collegesFlag: false,
      systemFlag: false,
      majorFlag: false,
      directionFlag: false,
      subjectFlag: false,
      loading: false,
      city:'',
      colleges: '',
      system: '',
      major: '',
      direction: '',
      subject: '',
      cityList: [],
      collegesList: [],
      systemList: [],
      majorList: [],
      directionList: [],
      subjectList: [
        "(101)思想政治理论 + (201)英语一 + (303)数学三 + (432)金融学综合",
        "(101)思想政治理论 + (201)英语一 + (303)数学三 + (432)金融学综合",
        "(101)思想政治理论 + (201)英语一 + (303)数学三 + (432)金融学综合",
        "(101)思想政治理论 + (201)英语一 + (303)数学三 + (432)金融学综合"
      ],
      subjectSel: 0
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
    bannerLink: function () {
        window.location.href = 'https://mp.weixin.qq.com/s/Qz96y24qaWKsn6SYt6ODxA'
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

      // var data = {
      //   Location: 'US'
      // }
      // this.ajax('submit', data).then(function(res){
      //   console.log(res)
      //   window.location.href = HOST + '/grade.html'
      // })
    }
  },
});