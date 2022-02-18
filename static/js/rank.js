var codeObj={
  '1-10032':{name:'北语',code1:'./static/images/1-10032/销售码.jpg', code2:'./static/images/1-10032/复试群.jpg'},
  '1-10036':{name:'贸大',code1:'./static/images/1-10036/销售码.jpg', code2:'./static/images/1-10036/复试群.jpg'},
  '1-10038':{name:'首经贸',code1:'./static/images/1-10038/销售码.jpg', code2:'./static/images/1-10038/复试群.jpg'},
  '1-10052':{name:'民大',code1:'./static/images/1-10052/销售码.jpg', code2:'./static/images/1-10052/复试群.jpg'},
  '2-10068':{name:'天外',code1:'./static/images/2-10068/销售码.jpg', code2:'./static/images/2-10068/复试群.jpg'},
  '2-10070':{name:'天财',code1:'./static/images/2-10070/销售码.jpg', code2:'./static/images/2-10070/复试群.jpg'},
  '15-10423':{name:'海大',code1:'./static/images/15-10423/销售码.png', code2:'./static/images/15-10423/复试群.jpg'},
  '15-10422':{name:'山大',code1:'./static/images/15-10422/销售码.png', code2:'./static/images/15-10422/复试群.jpg'},
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
      code2:'./static/images/other/复试群.jpg',
      Content:''
    }
  },
  created() {
    this.uinfo = Cache.get('uinfo');
    var telPhone = this.uinfo
    // console.log(typeof this.uinfo!=='objet', this.uinfo)
    if(typeof this.uinfo=='string'){
      this.uinfo={
        exist: false,
        tel: telPhone
      }
    }
    if(this.uinfo.exist){
      this.$dialog.alert({
        title: '温馨提示',
        message: '您好，您之前录入的数据已经通过审核，不能再次更新，如需要更新数据请联系群里的管理员协助处理，谢谢。',
      }).then(() => {});
    }
    if (!this.uinfo.tel) {
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
    // console.log(this.uinfo.tel,888)

      this.ajax('getRank', this.uinfo.tel, 1).then(function(res){
        that.userInfo = res.data

        let schoolCode=that.userInfo.p2id
        if(codeObj[schoolCode]){
          that.code1=codeObj[schoolCode].code1
          that.code2=codeObj[schoolCode].code2
        }else{
          that.code1=codeObj['other'].code1
          that.code2=codeObj['other'].code2
        }
        that.getContent()
        Cache.set("rank", res.data);
      })
    },
    onLoad() {
      var that = this
      this.ajax('getRankList', this.uinfo.tel, 1).then(function (res) {
        that.loading = false;
        that.list = res.data
        
        that.finished = true;
      })
    },
    getContent: function(){
      var that = this
      var data={
        p1id: this.userInfo.p1id,
        p2id: this.userInfo.p2id,
        p3id: this.userInfo.p3id,
        p4id: this.userInfo.p4id
      }
      this.ajax('getContent', data, 1).then(function (res) {
        if(res.data){
          that.Content=res.data.Content       
        }
      })
      // this.Content="<p>这是历史成绩</p>\n<p>录取人数256人，录取分数386</p>\n<p><img class=\"wscnph\" src=\"//adm.kaoyanxiao.com/dat/Uploads/HYJY/e21c29885d3c42fc83287bfed81045f0.jpg\" width=\"300\" /></p>"
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