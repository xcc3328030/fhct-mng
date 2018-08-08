<template>
  <div class="uploadComponent" v-loading="loading" element-loading-text="正在上传...">
    <div class="original-item" v-for="(item, index) in picture">
      <img
        class="original-item-image"
        :src="'v1/image/download?fileName='+item.originPictureId"
        @click="openZoomInImage(item.originPictureId)"
        alt="">
      <div
        class="original-item-delete"
        @click="deleteFile(index,item,1)"
        v-show="isEditing">一
      </div>
    </div>
    <div class="upload-item" v-for="(item, index) in urlList">
      <img
        class="upload-item-image"
        :src="'v1/image/download?fileName='+item.originPictureId"
        @click="openZoomInImage(item.originPictureId)"
        alt="">
      <div
        class="upload-item-delete"
        @click="deleteFile(index,item,2)"
        v-show="isEditing">一
      </div>
    </div>
    <transition name="fade">
      <div class="zoom-in-wrap" v-if="zoom" @click="closeZoomInImage()">
        <img class="zoom-in" :src="'v1/image/download?fileName='+zoomOriginPictureId" alt="">
      </div>
    </transition>

    <div class="upload-add" v-if="isEditing">
      <form
        class="form-image"
        action="/upload"
        method="post"
        enctype="multipart/form-data"
        :id="keyInfo">
        <input
          type="file"
          :id="keyName"
          name="file"
          multiple="multiple"
          file-model="images"
          @input="changeImage($event)"/>
        <input type="hidden" name="_csrf" value="csrf" />
        <input type="hidden" name="_csrf_header" value="X-XSRF-TOKEN" />
      </form>
      <label class="label-image" :for="keyName">
        <svg class="icon uploadicon" aria-hidden="true">
          <use xlink:href="#icon-camera"></use>
        </svg>
        添加照片
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'uploadComponent',
  props: ['keyName','keyInfo','details','imageType','isEditing','picture'],
  data () {
    return {
      loading: false,
      imageFiles: [],
      FileList: [],
      ResultsList: [],
      ResultsTempList: [],
      urlList: [],
      tenPictures: false,
      zoom: false,
      zoomOriginPictureId: '',
    }
  },
  watch: {
    isEditing: function(){
      this.imageFiles = [];
      this.FileList = [];
      this.ResultsList = [];
      this.ResultsTempList = [];
      this.urlList = [];
    },
  },
  methods: {
    //放大图片
    openZoomInImage (param) {
      this.zoom = true;
      this.zoomOriginPictureId = param;
    },
    //退出放大
    closeZoomInImage () {
      this.zoom = false;
    },
    //
    changeImage ($event) {
        let tip = false;
        let files = $event.target.files;
        this.imageFiles = [];
        for(let p in files){
            if(p == 'length'){
                break;
            }else{
                let str = files[p];
                this.imageFiles.push(str);
            }
        }

        //数量检测
        if(this.imageFiles.length + this.urlList.length > 10){
            this.$message({
              message: '上传图片总数超过十张！',
              type: 'warn'
            });
            this.clearInputValue();
            return;
        }else{
            this.tenPictures = false;
        }

        for(let i = 0;i < this.imageFiles.length;i++){
            //过滤非图片文件
            let isImage = /image\/\w+/.test(this.imageFiles[i].type);
            if(!isImage){
                this.$message({
                  message: this.imageFiles[i].name + '图片文件格式不正确！',
                  type: 'warn'
                });
                this.clearInputValue();
                return;
            }
            //过滤重复上传的图片
            for(let k = 0;k < this.FileList.length;k++){
                if(this.imageFiles[i].name == this.FileList[k].name){
                    tip = true;
                    this.$message({
                      message: this.imageFiles[i].name+"图片重复！",
                      type: 'warn'
                    });
                    this.clearInputValue();
                    return;
                }
            }
        }

        if(!tip){
            for(let j = 0;j < this.imageFiles.length;j++){
                this.readImage(this.imageFiles[j]);
            }
            this.uploadImage();
            this.clearInputValue();
        }
    },
    //
    readImage (img) {
        this.ResultsTempList = [];
        let reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = e => {//成功读取
            this.ResultsTempList.push({
                imgSrc:e.target.result,
            });
        }
    },
    //
    clearInputValue () {
        //onChange里面清除元素的value
        document.querySelector('#' + this.keyName).value = null;
    },
    //
    deleteFile (index, item, tag) {
      if(tag == 1){
        let picture = JSON.parse(JSON.stringify(this.picture));
        picture.splice(index,1);
        this.$emit("upadtePicture",picture)
      }else {
        this.FileList.splice(index,1);
        this.urlList.splice(index,1);
        this.ResultsList.splice(index,1);
        this.tenPictures = false;
        this.$emit("updateUrlList", this.urlList)
      }
      let param = {
        pictureId: item.pictureId
      }
      this.$services.deletePicture(param);
    },
    //
    uploadImage() {
        this.loading = true
        let formData = new FormData(document.getElementById(this.keyInfo));
        let obj = {
          'hospitalId': this.details.hospitalId,
          'orderId': this.details.prescriptionId || undefined,
          'ImageTypeEnum': this.imageType
        }
        this.$services.upload(obj, formData)
        .then(res => {
            this.loading = false;

            res.results.map(item => {
              this.urlList.push({
                pictureId: item.pictureId,
                originPictureId: item.originPictureId
              });
            })

            this.imageFiles.map(item => {
              this.FileList.push(item);
            })

            this.ResultsTempList.map(item => {
              this.ResultsList.push(item);
            })

            if(this.urlList.length == 10){
                this.tenPictures = true;
            }

            this.$emit("updateUrlList", this.urlList)
        })
    }

  },
  mounted () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss">
.uploadComponent {
  display: inline-block;
  .original-item {
    position: relative;
    display: inline-block;
    vertical-align: top;
    width: 78px;
    height: 78px;
    margin-right: 15px;
    border: 1px solid #bfbfbf;
    transition: all .2s;
    cursor: pointer;
    .original-item-image {
      width: 100%;
      height: 100%;
    }
    .original-item-delete {
      position: absolute;
      top: -10px;
      right: -10px;
      width: 20px;
      height: 20px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      color: white;
      background-color: rgba(243, 105, 105, 1);
      cursor: pointer;
    }
    // &:hover {
    //   border-color: #06AEA6;
    // }
  }
  .upload-item {
    position: relative;
    display: inline-block;
    vertical-align: top;
    width: 78px;
    height: 78px;
    margin-right: 15px;
    border: 1px solid #bfbfbf;
    transition: all .2s;
    cursor: pointer;
    .upload-item-image {
      width: 100%;
      height: 100%;
    }
    .upload-item-delete {
      position: absolute;
      top: -10px;
      right: -10px;
      width: 20px;
      height: 20px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      color: white;
      background-color: rgba(243, 105, 105, 1);
      cursor: pointer;
    }
    // &:hover {
    //   border-color: #06AEA6;
    // }
  }
  .upload-add {
    width: 78px;
    height: 78px;
    vertical-align: top;
    display: inline-block;
    border: 1px dashed #bfbfbf;
    transition: all .2s;
    &:hover {
      border-color: #06AEA6;
    }
    .form-image {
      display: none;
    }
    .label-image {
      width: 100%;
      height: 100%;
      margin: 0px;
      padding: 0px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      line-height: 16px;
      color: rgba(191, 191, 191, 1);
      font-size: 11px;
      text-align: left;
      font-family: PingFangSC-Regular;
      cursor: pointer;
      .uploadicon {
        width: 32px;
        height: 32px;

      }
    }
  }
  .el-loading-mask {
    .el-loading-spinner {
      .el-loading-text {
        font-size: 12px;
      }
    }
  }
}
</style>
