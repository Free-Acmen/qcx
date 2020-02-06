new Vue({
  el: '#app',
  data: function(){
    return {
      height: '568px',
      update: false,
      communication: false,
      userInfo: {
        name: '李云龙',
        colleges: '北京师范大学',
        system: '信息系',
        score: 546
      },
      rankData: {
        school: {
          val: 90,
          total: 290
        },
        compound: {
          val: 90,
          total: 290
        },
        major: {
          val: 90,
          total: 290
        },
        time: '2020年02月13日'
      }
    }
  },
  created() {
    this.height = window.innerHeight + 'px';
    this.initData()
  },
  methods: {
    initData: function(){
      var that = this
      var data = {}
      this.ajax('getRank', data).then(function(res){
        console.log(res)
        // that.userInfo = res.data.userInfo
        // that.rankData = res.data.rankData
      })
    },
    updateHandle: function(){
      this.update = true
    },
    communicationHandle: function(){
      this.communication = true
    },
    share: function(){
      console.log('微信分享功能')
    }
  }
});