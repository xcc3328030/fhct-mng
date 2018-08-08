<template>
  <div class="doctors">
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
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <el-row>
        <el-col :span="8">
          <span class="information-pre">医生姓名</span>
          <el-input
            class="information-item"
            v-model="name_input"
            placeholder="">
          </el-input>
        </el-col>
        <el-col :span="8">
          <span class="information-pre" style="margin-left: 28px;">性别</span>
          <el-radio-group v-model="sex_radio">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="8">
          <span class="information-pre">工号</span>
          <el-input
            class="information-item"
            v-model="work_nmber_input"
            placeholder="">
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <span class="information-pre">所属医院</span>
          <el-select
            class="information-item"
            v-model="hospital_select"
            placeholder="请选择医院">
            <el-option
              v-for="item in hospitals"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <span class="information-pre">所属科室</span>
          <el-select
            class="information-item"
            v-model="department_select"
            placeholder="请选择科室">
            <el-option
              v-for="item in departments"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <span class="information-pre">职称</span>
          <el-input
            class="information-item"
            v-model="title_input"
            placeholder="">
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <span class="information-pre">联系方式</span>
          <el-input
            class="information-item"
            v-model="phone_input"
            placeholder="">
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="inquiry-right-title title">
      <svg class="icon titleicon" aria-hidden="true">
        <use xlink:href="#icon-biaoqian1"></use>
      </svg>
      <span class="title-word">问诊权限</span>
    </div>
    <div class="inquiry-right-content">
      <el-row>
        <el-col :span="8">
          <span class="information-pre">视频问诊</span>
          <el-radio-group v-model="video_radio">
            <el-radio :label="1">开通</el-radio>
            <el-radio :label="2">不开通</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="8">
          <div class="information-fee">
            <div class="information-pre">视频问诊</div>
            <div class="information-pre" style="text-align: end;">挂号费</div>
          </div>
          <el-input
            class="information-item"
            v-model="video_fee_input"
            placeholder="">
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <span class="information-pre">图文问诊</span>
          <el-radio-group v-model="teletexts_radio">
            <el-radio :label="1">开通</el-radio>
            <el-radio :label="2">不开通</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="8">
          <div class="information-fee">
            <div class="information-pre">图文问诊</div>
            <div class="information-pre" style="text-align: end;">挂号费</div>
          </div>
          <el-input
            class="information-item"
            v-model="teletexts_fee_input"
            placeholder="">
          </el-input>
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
        <el-input
          class="self-introduce-content"
          type="textarea"
          placeholder="请输入内容"
          v-model="self_introduce_textarea">
        </el-input>
      </div>
      <div class="good-field">
        <div class="good-field-title">
          擅长领域：
        </div>
        <el-input
          class="self-introduce-content"
          type="textarea"
          placeholder="请输入内容"
          v-model="good_field_textarea">
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'doctors',
  data () {
    return {
      hospitals: [{
        value: '选项1',
        label: '方回春堂'
      }, {
        value: '选项2',
        label: '树兰医疗'
      }, {
        value: '选项3',
        label: '浙江第一人民医院'
      }, {
        value: '选项4',
        label: '新华医院'
      }, {
        value: '选项5',
        label: '浙江第二人民医院'
      }],
      departments: [{
        value: '选项1',
        label: '急诊'
      }, {
        value: '选项2',
        label: '皮肤科'
      }, {
        value: '选项3',
        label: '内科'
      }, {
        value: '选项4',
        label: '外科'
      }, {
        value: '选项5',
        label: '呼吸内科'
      }],
      imageUrl: '',
      sex_radio: 2,
      name_input: '',
      work_nmber_input: '',
      hospital_select: '',
      department_select: '',
      title_input: '',
      phone_input: '',
      video_radio: 1,
      video_fee_input: '',
      teletexts_radio: 1,
      teletexts_fee_input: '',
      self_introduce_textarea: '',
      good_field_textarea: '',
    }
  },
  methods: {
    handleAvatarSuccess () {

    },
    beforeAvatarUpload () {

    }
  },
  mounted () {

  },
  components: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.doctors {
  margin-top: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 4px 0px rgba(202, 202, 202, 0.5);
  overflow-x: auto;
  &>div {
    min-width: 1048px;
  }
  .information-pre {
    margin-right: 10px;
    height: 20px;
    line-height: 20px;
    color: rgba(102, 102, 102, 1);
    font-size: 14px;
    text-align: left;
    font-family: PingFangSC-Regular;
  }
  .information-item {
    width: 250px;
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
    .el-upload--picture-card {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 78px;
      height: 78px;
    }

  }
  .inquiry-right-title {
    margin-top: 40px;
  }
  .inquiry-right-content {

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
      wdith: 100%;
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
      wdith: 100%;
      height: 108px;
      textarea {
        height: 100%;
      }
    }
  }
}
</style>
