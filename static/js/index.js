
new Vue({
  el: '#app',
  data: function(){
    return {
      height: '568px',
      cityFlag: false,
      collegesFlag: false,
      systemFlag: false,
      majorFlag: false,
      subjectFlag: false,
      loading: false,
      city:'',
      colleges: '',
      system: '',
      major: '',
      subject: '',
      cityList: [],
      collegesList: [],
      systemList: [],
      majorList: [],
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
    this.height = window.innerHeight + 'px';
    this.getInitData()
  },
  methods: {
    getInitData: function(){
      //省市数据调用
      var that = this
      this.ajax('city', {Location: "US"}).then(function(res){
        that.cityList = ['city']//res.data
      })
    },
    cellHandel: function(key, dataKey){
      var that = this
      this.resetFlag()
      var keys = key + 'Flag'
      this[keys] = true
      if(key != 'city'){
        var data = this[dataKey]
        if(!data){
          vant.Notify({ type: 'warning', message: '请先选择上级数据！' });
          this[keys] = false
          return
        }
        this.loading = true
        this.ajax(key, data, 1).then(function(res){
          var list =  key + 'List';
          that[list] = [key]//res.data;
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
    subjectConfirm: function(index){
      this.subject = this.subjectList[index]
      this.subjectFlag = false
    },
    submit: function(){
      var that = this
      var data = {
        Location: 'US'
      }
      this.ajax('submit', data).then(function(res){
        console.log(res)
        window.location.href = HOST + '/grade.html'
      })
    }
  },
});