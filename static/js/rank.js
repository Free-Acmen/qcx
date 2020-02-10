new Vue({
  el: '#app',
  data: function(){
    return {
      height: '568px',
      update: false,
      communication: false,
      show: false,
      userInfo: {}
    }
  },
  created() {
    this.uinfo = Cache.get('uinfo');
    if(!this.uinfo){
      // window.location.href = HOST + '/index.html'
      // return
    }
    this.height = window.innerHeight + 'px';
    this.initData()
  },
  methods: {
    initData: function(){
      var that = this
      this.ajax('getRank', this.uinfo, 1).then(function(res){
        console.log(res)
        that.userInfo = res.data
        Cache.set("rank", res.data);
      })
    },
    updateHandle: function(){
      this.update = true
    },
    communicationHandle: function(){
      this.communication = true
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
    },
    share: function(){
      console.log('微信分享功能')
      this.show = true
    }
  }
});