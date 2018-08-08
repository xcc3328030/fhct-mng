<template>
<div class="doctors-detail"  v-loading="loading">
  <div class="common-back" @click="handleBack">
    <svg class="icon backicon" aria-hidden="true">
      <use xlink:href="#icon-fanhui"></use>
    </svg>
    <span class="back-word">返回上一级</span>
  </div>
  <div class="doctors-content">
    <div class="base-information-title title">
      <svg class="icon titleicon" aria-hidden="true">
        <use xlink:href="#icon-biaoqian1"></use>
      </svg>
      <span class="title-word">基本信息</span>
    </div>
    <div class="base-information-content">
      <div class="doctor-icon">
        医生头像：
      </div>
      <el-upload
        class="avatar-uploader clearfix"
        ref="upload"
        :action="uploadAction"
        :data="upLoadData"
        :headers="headers"
        list-type="picture-card"
        :on-preview="handlePreview"
        :on-success="handleSuccess"
        :file-list="fileList"
        :disabled="disabled"
        :on-exceed="handleExceed"
        :on-remove="onRemove"
        :on-change="onChange"
        :auto-upload="false"
        :limit="1">
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <el-row>
        <el-col :span="8">
          <span class="information-pre">医生姓名</span>
          <el-input class="information-item" v-model="details.doctorName" :disabled="disabled">
          </el-input>
        </el-col>
        <el-col :span="8">
          <span class="information-pre" style="margin-left: 28px;">性别</span>
          <el-radio-group v-model="details.gender" :disabled="disabled">
            <el-radio label="MAN">男</el-radio>
            <el-radio label="FEMALE">女</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="8">
          <span class="information-pre">工号</span>
          <el-input class="information-item" v-model="details.cardNo" :disabled="disabled"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <span class="information-pre">所属医院</span>
           <el-autocomplete :fetch-suggestions="querySearch" class="information-item"  v-model="details.hospitalName" :trigger-on-focus="false" @select="handleSelect"  :disabled="disabled">
            <template slot-scope="{ item }">
              <div class="name">{{ item.hospitalName }}</div>
            </template>
          </el-autocomplete>
        </el-col>
        <el-col :span="8">
          <span class="information-pre">所属科室</span>
          <el-select class="information-item" v-model="details.deptId" placeholder="请选择科室" :disabled="disabled">
            <el-option v-for="item in departmentsList" :key="item.dictDepartmentId" :label="item.name" :value="item.dictDepartmentId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <span class="information-pre">职称</span>
           <el-select class="information-item" v-model="details.titleValue" placeholder="请选择职称" :disabled="disabled">
            <el-option v-for="item in titleList" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <span class="information-pre">联系方式</span>
          <el-input class="information-item" v-model="details.contactPhone" :disabled="disabled"></el-input>
        </el-col>
      </el-row>
    </div>
    <div class="inquiry-right-title title">
      <svg class="icon titleicon" aria-hidden="true">
        <use xlink:href="#icon-biaoqian1"></use>
      </svg>
      <span class="title-word">问诊费用</span>
    </div>
    <div class="inquiry-right-content">
      <el-row>
        <el-col :span="8">
          <div class="information-fee">
            <div class="information-pre">视频问诊</div>
            <div class="information-pre" style="text-align: end;">挂号费</div>
          </div>
          <el-input class="information-item" v-model="details.videosClinicFee" :disabled="disabled"></el-input>
          <span class="TCM-unit">元</span>
        </el-col>
      </el-row>
    </div>
    <div class="clinic-information-title title">
      <svg class="icon titleicon" aria-hidden="true">
        <use xlink:href="#icon-biaoqian1"></use>
      </svg>
      <span class="title-word">临床信息</span>
    </div>
    <div class="clinic-information-content">
      <div class="self-introduce">
        <div class="self-introduce-title">
          个人简介：
        </div>
        <el-input class="self-introduce-content" type="textarea" placeholder="请输入内容" v-model="details.resume" :disabled="disabled"></el-input>
      </div>
      <div class="good-field">
        <div class="good-field-title">
          擅长领域：
        </div>
        <el-input class="self-introduce-content" type="textarea" placeholder="请输入内容" v-model="details.goodAt" :disabled="disabled"></el-input>
      </div>
    </div>
    <div class="save-information">
      <div class="edit-btn" v-if="disabled" @click="disabled=false">编辑</div>
      <div class="save-btn" v-else @click="handleSave">保存</div>
      <div class="cancle-btn" @click="handleBack">取消</div>
    </div>
  </div>
  <el-dialog :visible.sync="dialogVisible" :show-close="false" class="zoom-dialog-image">
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
</div>
</template>

<script>
export default {
  name: 'doctorsDetail',
  data () {
    return {
      loading: false,
      details: {},
      hospitalsList: [],
      departmentsList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: true,
      fileList: [],
      titleList: [],
      listTypeShow: false,
      upLoadData: {
        _csrf: 'csrf',
        _csrf_header: 'X-XSRF-TOKEN'
      }
    }
  },
  methods: {
    // 返回上一级
    handleBack () {
      this.$router.push({
        path: '/doctors/list',
        name: '医生管理',
      })
    },
   handleSuccess (res, file, fileList) {
      this.updateMessage (res.results[0].compressPictureId)
    },
    onRemove (file, fileList) {
      this.fileList = fileList
    },
    onChange (file, fileList) {
      this.fileList = fileList;
    },
    // 限制只能上传一张头像
    handleExceed (files, fileList) {
      this.$message({
        message: '只能上传一张头像！',
        type: 'warning',
        center: true
      });
    },
    // 查看图片
    handlePreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 医院查询
    querySearch(queryString, cb) {
      let param = {
        hospitalName_should_match: queryString
      }
      this.$services.fetchHospitalList(param).then(res => {
        cb(res.results);
      })
    },
      // 选择医院
    handleSelect(item) {
      this.details.deptId = '';
      this.details.hospitalName = item.hospitalName;
      this.details.hospitalId = item.hospitalId;
      this.queryDepartList(item.hospitalId)
    },
    // 初始化查询
    init () {
      this.loading = true;
      // 查询医生信息
      this.$services.fetchDoctorsDetail(this.doctorsId).then(res => {
        this.loading = false;
        this.details = JSON.parse(JSON.stringify(res.results));
        if( res.results.profilePhoto) {
          this.fileList = [{name: '', url: '/v1/image/download?fileName=' + res.results.profilePhoto}]
        } else {
          this.fileList = []
        }
      })
      // 职称下拉查询
      this.$services.fetchDictionarysTitle().then(res => {
         this.titleList = res.results
      })
    },
    // 查询所属科室
    queryDepartList(hospitalId) {
      this.$services.fetchDepartList(hospitalId).then(res => {
        this.departmentsList = res.results.dictDepartmentList
      })
    },
    // 修改保存
    handleSave () {
      this.loading = true
      if (this.fileList.length > 0) {
        if(this.fileList[0].status === 'success'){
         this.updateMessage(this.details.profilePhoto)
        }
        if(this.fileList[0].status === 'ready'){
         this.$refs.upload.submit()
        }
      } else {
        this.updateMessage('')
      }
    },
    updateMessage (profilePhoto) {
      let param1 = this.doctorsId;

      let titleObj = {};
      titleObj = this.titleList.find((item)=>{
          return item.dictCode === this.details.titleId;
      });

      let deptObj = {};
      deptObj = this.departmentsList.find((item)=>{
          return item.dictDepartmentId === this.details.deptId;
      });

      let param2 = {
        authorizedCfdu: this.details.authorizedCfdu,
        authorizedPocketHospital: this.details.authorizedPocketHospital,
        cardNo: this.details.cardNo,
        contactPhone: this.details.contactPhone,
        deptId: this.details.deptId,
        deptValue: deptObj.name,
        doctorId: this.details.doctorId,
        doctorName: this.details.doctorName,
        gender: this.details.gender,
        goodAt: this.details.goodAt,
        hisCode: this.details.hisCode,
        hospitalId: this.details.hospitalId,
        hospitalName: this.details.hospitalName,
        isDeleted: this.details.isDeleted,
        // profilePhoto: res.results[0].compressPictureId,
        profilePhoto: profilePhoto,
        resume: this.details.resume,
        titleId: titleObj.dictCode,
        titleValue: titleObj.dictValue,
        videosClinicFee: this.details.videosClinicFee
      };
      this.$services.finishDoctors(param1, param2).then(res => {
        if (res.state == 200) {
          this.loading = false
          this.$message({
            message: '医生信息保存成功!',
            type: 'success',
            center: true
          });
          this.disabled = true
        }
      })
    },
    getCookie (cookieName) {
      let strCookie = document.cookie;
      let arrCookie = strCookie.split("; ");
      for(let i = 0; i < arrCookie.length; i++){
          let arr = arrCookie[i].split("=");
          if(cookieName === arr[0]){
              return arr[1];
          }
      }
      return "";
    }
  },
  mounted () {
    this.init();
    this.queryDepartList(this.hospitalId);
  },
  computed: {
    uploadAction () {
      return "/v1/image/upload?hospitalId=" + this.hospitalId + "&ImageTypeEnum=DOCTOR_AVATAR"
    },
    doctorsId () {
      return this.$route.query.doctorId
    },
    hospitalId () {
      return this.$route.query.hospitalId
    },
    headers () {
      return  { 'x-xsrf-token': this.getCookie('XSRF-TOKEN') || undefined }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.doctors-detail {
  display: flex;
  flex-direction: column;
  flex: 1;
  .doctors-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 4px 0px rgba(202, 202, 202, 0.5);
    overflow-x: auto;
    // &>div {
    //   min-width: 1048px;
    // }
    .information-pre {
      margin-right: 10px;
      height: 20px;
      line-height: 20px;
      color: rgba(102, 102, 102, 1);
      font-size: 14px;
      text-align: left;
      font-family: PingFangSC-Regular;
    }
    .TCM-unit {
      margin-left: 10px;
      height: 20px;
      line-height: 20px;
      color: rgba(102, 102, 102, 1);
      font-size: 14px;
      text-align: left;
      font-family: PingFangSC-Regular;
    }
    .information-item {
      width: 200px;
      input {
        height: 36px;
        border-radius: 0;
        &:focus {
          border-color: #06AEA6;
        }
      }
      .is-focus {
        .el-input__inner {
          border-color: #06AEA6;
        }
      }
    }
    .el-row {
      margin-top: 20px;
    }
    .el-col {
      display: flex;
      align-items: center;
      height: 36px;
    }
    .title {
      display: flex;
      align-items: center;
      .titleicon {
        margin-right: 10px;
      }
      .title-word {
        line-height: 14px;
        color: rgba(74, 74, 74, 1);
        font-size: 14px;
        text-align: left;
        font-family: PingFangSC-Regular;
      }
    }
    .base-information-content {
      .doctor-icon {
        margin-top: 20px;
        margin-bottom: 20px;
        line-height: 20px;
        color: rgba(102, 102, 102, 1);
        font-size: 14px;
        text-align: left;
        font-family: PingFangSC-Regular;
      }
      .avatar-uploader {
        .el-upload-list {
          .el-upload-list__item {
            float: left;
            width: 78px;
            height: 78px;
          }
        }
      }
      .el-upload--picture-card {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 78px;
        height: 78px;
        float: left;
      }

    }
    .inquiry-right-title {
      margin-top: 40px;
    }
    .inquiry-right-content {
      margin-top: 16px;
    }
    .clinic-information-title {
      margin-top: 40px;
    }
    .clinic-information-content {
      .self-introduce-title {
        margin-top: 20px;
        line-height: 20px;
        color: rgba(102, 102, 102, 1);
        font-size: 14px;
        text-align: left;
        font-family: PingFangSC-Regular;
      }
      .self-introduce-content {
        margin-top: 20px;
        width: 100%;
        height: 108px;
        textarea {
          height: 100%;
        }
      }
      .good-field-title {
        margin-top: 20px;
        line-height: 20px;
        color: rgba(102, 102, 102, 1);
        font-size: 14px;
        text-align: left;
        font-family: PingFangSC-Regular;
      }
      .good-field-content {
        margin-top: 20px;
        width: 100%;
        height: 108px;
        textarea {
          height: 100%;
        }
      }
    }
    .save-information {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 50px 0 28px;
      .save-btn {
        @extend .base-btn-info;
        background: #06aea6;
        margin-right: 28px;
        color: #fff;
      }
      .edit-btn {
        @extend .base-btn-info;
        background: #06aea6;
        border: 1px solid #06aea6;
        margin-right: 28px;
        color: #fff;
      }
      .cancle-btn {
        @extend .base-btn-info;
        background: #fff;
        border: 1px solid #91dbd8;
        color: #91dbd8;
      }
    }
  }
}
.zoom-dialog-image {
  .el-dialog {
    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__body {
      padding: 1px;
        img{
          vertical-align:top;
          border:none;
        }
    }
  }
}

.base-btn-info {
    font-family: PingFangSC-Regular;
    display: inline-block;
    width: 116px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 16px;
    cursor: pointer;
    border-radius: 4px;
}

</style>
