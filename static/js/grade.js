new Vue({
  el: '#app',
  data: function(){
    return {
      sPaths: {},
      height: '568px',
      name: '',
      grades: [
        {id: '1', name:'(101)思想政治理论', grade:''},
        {id: '2', name:'(101)思想政治理论', grade:''},
        {id: '3', name:'(101)思想政治理论', grade:''}
      ],
      show: false,
      phone: '',
      code: '',
      codeText: '发送验证码',
      isdisabled: false
    }
  },
  created() {
    this.sPaths = Cache.get('s-paths');
    if(!this.sPaths){
      window.location.href = HOST + '/index.html'
      return
    }
    this.height = window.innerHeight + 'px';
    this.initData()
  },
  methods: {
    initData: function(){
      var that=this
      if(this.sPaths){
        var id = this.sPaths.p6.id
        // var data = {Location: "US"}
        this.ajax('getSelData', id, 1).then(function(res){
          // res = {"resultCode":100,"message":null,"success":true,
          // "data":[{"id":"1","rid":"1","name":"(101)思想政治理论","pid":"0","prid":"0","pname":"N/A","level":1,"isSmall":false,"CreateTime":null},
          // {"id":"2","rid":"1","name":"(101)思想政治理论","pid":"0","prid":"0","pname":"N/A","level":1,"isSmall":false,"CreateTime":null},
          // {"id":"3","rid":"1","name":"(101)思想政治理论","pid":"0","prid":"0","pname":"N/A","level":1,"isSmall":false,"CreateTime":null}
          // ]
          // }
          if(res.data){
            var arr = []
            res.data.forEach(item => {
              var obj = {}
              obj.id = item.id
              obj.name = item.name
              obj.grade = item.grade
              arr.push(obj)
            });
            that.grades = arr
          }
        })
      }
    },
    queryHandle: function(){
      var flag = true
      // console.log(this.grades, this.name)
      this.grades.forEach( item => {
        if(item.grade === ''){
          flag = false
        }
      })
      if(!flag || !this.name){
        vant.Notify({ type: 'danger', message: '请先填写完整信息在查询！' });        
        return
      }
      this.show = true
    },
    completeHandle: function(){
      if(!this.phone || !(/^1[34578]\d{9}$/.test(this.phone))){
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
        code: this.code,
        name: this.name,
        spath: this.sPaths,
        grades: this.grades
      }
      console.log(data)
      this.ajax('complete', data).then(function(res){
        Cache.set("uinfo", res.data);
        window.location.href = HOST + '/rank.html'
      })
    },
    getCode: function(){
      var that = this
      if(this.isdisabled){
        return
      }
      if(!this.phone || !(/^1[34578]\d{9}$/.test(this.phone))){
        vant.Notify({ type: 'warning', message: '请先输入正确的手机号' });
        return
      }
      // var data = {
      //   phone: this.phone
      // }
      this.ajax('getCode', this.phone, 1).then(function(res){
        // console.log(res)
        vant.Notify({ type: 'success', message: '验证码已发送，请注意查收！' });
        that.setTime()
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
    },
    reset: function(){
      vant.Dialog.confirm({
        title: '提示',
        message: '你确定需要清除记录，重新查询吗？'
      }).then(() => {
        Cache.clear("s-paths");
        Cache.clear("uinfo");
        Cache.clear("rank");
        window.location.href = HOST + '/index.html'
      }).catch(() => {
        // on cancel
      });
    }
  }
});