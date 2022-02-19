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
      fileList: [],
      imgUrl:'',
      show: false,
      phone: '',
      code: '',
      codeText: '发送验证码',
      isdisabled: false
    }
  },
  created() {
    this.sPaths = Cache.get('s-paths');
    if (!this.sPaths) {
        window.location.href = './index.html'
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
        this.ajax('getSelData', id, 1).then(function(res){
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
    overSize: function(file){
      vant.Notify({ type: 'warning', message: '图片过大，请上传小于5M的图片' });
    },
    afterRead(file) {
      file.status = 'uploading';
      file.message = '上传中...';
      // 此时可以自行将文件上传至服务器
      // console.log(file);
      var formData = new FormData();
      formData.append('file', file.file);
      formData.append('name', file.file.name);

      var that = this;
      var url = "https://adm.kaoyanxiao.com/api/File/UploadFiles"
      // url = "http://192.168.7.80:5002/api/File/UploadFiles"

      $.ajax({
        url: url,
        type: "post",
        data: formData,
        contentType: false,
        processData: false,
        mimeType: "multipart/form-data",
        headers: {
          Accept: "*/*;q=0.8"
        },
        success: function (data) {
          data = JSON.parse(data)
          // console.log(data)
          file.status = 'done';
          file.message = '上传成功';

          that.imgUrl = data.data[0].FilePath
        },
        error: function (data) {
          file.status = 'failed';
          file.message = '上传失败';
        }
      });
    },
    queryHandle: function(){
      var flag = true
      // console.log(this.grades, this.name)
      this.grades.forEach( item => {
        if(item.grade === ''){
          flag = false
        }
      })
      if(!flag || !this.name || this.fileList.length <=0){
        vant.Notify({ type: 'danger', message: '请先填写完整信息在查询！' });        
        return
      }
      this.show = true
    },
    completeHandle: function(){
      if(!this.phone || !(/^1[345678]\d{9}$/.test(this.phone))){
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
        grades: this.grades,
        image: this.imgUrl
      }
      // console.log(data)
      this.ajax('complete', data,1).then(function(res){
        // debugger
        // console.log(res.data,9999)
        Cache.set("uinfo", res.data);
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
        window.location.href =  './index.html'
      }).catch(() => {
        // on cancel
      });
    }
  }
});