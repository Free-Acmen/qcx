new Vue({
  el: '#app',
  data: function(){
    return {
      height: '568px',
      footHeight: '1.12rem',
      update: false,
      communication: false,
      shareFlag: false,
      userInfo: {},
      listHeight: '1.8rem',
      list: [],
      loading: false,
      finished: false
    }
  },
  created() {
      this.uinfo = Cache.get('uinfo');
      if (!this.uinfo) {
         window.location.href = './index.html'
         return
      }
    this.height = window.innerHeight + 'px';
    this.initData()
    },
    mounted() {
      var that = this
        setTimeout(function() {
            // var listHeight = window.innerHeight - $(".grade-info").outerHeight() - $(".footer").outerHeight() - $(".tips").outerHeight() - $(".rank-info").outerHeight() - $(".remark").outerHeight();
            // this.listHeight = listHeight - 38 + 'px';
            that.footHeight = $(".footer").outerHeight() + 10 + 'px'
        }, 100);
    },
  methods: {
    initData: function(){
      var that = this
      this.ajax('getRank', this.uinfo, 1).then(function(res){
        that.userInfo = res.data
        Cache.set("rank", res.data);
      })
    },
      onLoad() {
          var that = this
          this.ajax('getRankList', this.uinfo, 1).then(function (res) {
             
              that.loading = false;
              that.list = res.data
              
              that.finished = true;

          })
      },
      updateHandle: function () {
          // this.update = true
          window.location.href = 'https://mp.weixin.qq.com/s/ahTUGEGzDIWD_axgh6EdLw'
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
        window.location.href =  './index.html'
      }).catch(() => {
        // on cancel
      });
    },
    share: function(){
        this.shareFlag = true;
    }
  }
});