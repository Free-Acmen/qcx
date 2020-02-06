new Vue({
  el: '#app',
  data: function(){
    return {
      height: '568px',
      userInfo: {
        colleges: '北京师范大学',
        system: '信息系',
        major: '计算机与科学'
      },
      fields: [
        {label:'(101)思想政治理论', val:''},
        {label:'(101)思想政治理论', val:''},
        {label:'(101)思想政治理论', val:''}
      ],
      show: false,
      phone: '',
      code: '',
      codeText: '发送验证码',
      isdisabled: false
    }
  },
  created() {
    this.height = window.innerHeight + 'px';
    this.initData()
  },
  methods: {
    initData: function(){
      var that=this
      var data = {Location: "US"}
      this.ajax('getUserInfo', data).then(function(res){
        console.log(res)
        // that.userInfo = res.data.userInfo || []        
        // that.fields = res.data.fields || []
      })
    },
    queryHandle: function(){
      this.show = true
    },
    completeHandle: function(){
      var that=this
      var data = {}
      this.ajax('complete', data).then(function(res){
        console.log(res)
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
      var data = {
        phone: this.phone
      }
      this.ajax('getCode', data).then(function(res){
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
    }
  }
});