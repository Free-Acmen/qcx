var codeObj={
  '1-10002':{name:'民大',code1:'./static/images/1-10002/销售码.jpg', code2:'./static/images/1-10002/复试群.jpg'},
  '1-10032':{name:'北语',code1:'./static/images/1-10032/销售码.jpg', code2:'./static/images/1-10032/复试群.jpg'},
  '1-10036':{name:'贸大',code1:'./static/images/1-10036/销售码.jpg', code2:'./static/images/1-10036/复试群.jpg'},
  '1-10038':{name:'首经贸',code1:'./static/images/1-10038/销售码.jpg', code2:'./static/images/1-10038/复试群.jpg'},
  '2-10068':{name:'天外',code1:'./static/images/2-10068/销售码.jpg', code2:'./static/images/2-10068/复试群.jpg'},
  '2-10070':{name:'天财',code1:'./static/images/2-10070/销售码.jpg', code2:'./static/images/2-10070/复试群.jpg'},
  '15-10423':{name:'海大',code1:'./static/images/15-10423/销售码.png', code2:'./static/images/15-10423/复试群.jpg'},
  '15-10456':{name:'山大',code1:'./static/images/15-10456/销售码.png', code2:'./static/images/15-10456/复试群.jpg'},
  '15-11065':{name:'青大',code1:'./static/images/15-11065/销售码.jpg', code2:'./static/images/15-11065/复试群.jpg'},
  '19-10574':{name:'华师',code1:'./static/images/19-10574/销售码.jpg', code2:'./static/images/19-10574/复试群.jpg'},
  '25-10673':{name:'云大',code1:'./static/images/25-10673/销售码.png', code2:'./static/images/25-10673/复试群.jpg'},
  'other':{name:'其他',code1:'./static/images/other/销售码.jpg', code2:'./static/images/other/复试群.jpg'}
}

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
      finished: false,
      code1:'./static/images/other/销售码.jpg',
      code2:'./static/images/other/复试群.jpg'
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

        let schoolCode=that.userInfo.p2id
        if(codeObj[schoolCode]){
          that.code1=codeObj[schoolCode].code1
          that.code2=codeObj[schoolCode].code2
        }else{
          that.code1=codeObj['other'].code1
          that.code2=codeObj['other'].code2
        }

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
          this.update = true
          // window.location.href = 'https://mp.weixin.qq.com/s/ahTUGEGzDIWD_axgh6EdLw'
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