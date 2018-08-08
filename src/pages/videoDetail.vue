<template>
  <div class="videoDetail">
    <div class="common-back" @click="handleBack()">
      <svg class="icon backicon" aria-hidden="true">
        <use xlink:href="#icon-fanhui"></use>
      </svg>
      <span class="back-word">返回上一级</span>
    </div>
    <div class="videoDetail-content-wrap" v-loading="loading">
      <div class="videoDetail-content">
        <div class="control">
          <div class="control-wrap">
            <div class="control-left">
              <div class="control-time">
                <svg class="icon timeicon" aria-hidden="true">
                  <use xlink:href="#icon-biaoqian"></use>
                </svg>
                <span class="time-pre">就诊时间：</span>
                <span class="time-word">{{details.actualDateOfVisit || "暂未确定"}}</span>
              </div>
              <div class="control-status">
                <svg class="icon statusicon" aria-hidden="true">
                  <use xlink:href="#icon-biaoqian"></use>
                </svg>
                <span class="status-pre">当前状态：</span>
                <span class="status-word">{{statusMap[details.orderStatus]}}</span>
              </div>
            </div>
            <div class="conrtol-right" v-if="stepsMap[details.orderStatus] == 1"></div>
            <div class="control-right" v-if="stepsMap[details.orderStatus] == 2">
              <div class="common-btn-white" @click="handleInvite()">邀请其他医生</div>
              <div class="common-btn-green" @click="handleOpenVideo()">进入视频诊间</div>
              <el-popover
                popper-class="refund-wrap"
                placement="bottom-end"
                width="300"
                v-model="refund_visible">
                <div class="refund-title-wrap">
                  <img class="refund-title-left" src="@/assets/image/warning.png" alt="警告">
                  <span class="refund-title-right">您确定要取消并退款吗？</span>
                </div>
                <div class="refund-content">确认拒绝本次就诊申请，并退还患者 相关费用</div>
                <div class="refund-button-wrap">
                  <div class="refund-button-confirm" @click="comfirmRefund()">确定</div>
                  <div class="refund-button-cancel" @click="cancelRefund()">取消</div>
                </div>
                <div class="common-btn-red" slot="reference">取消并退款</div>
              </el-popover>
            </div>
            <div class="conrtol-right" v-if="stepsMap[details.orderStatus] == 3">
              <div class="common-btn-green" @click="handleOpenVideo()">进入视频诊间</div>
              <el-popover
                popper-class="end-wrap"
                placement="bottom-end"
                width="160"
                v-model="end_visible">
                <div class="end-title-wrap">
                  <img class="end-title-left" src="@/assets/image/warning.png" alt="警告">
                  <span class="end-title-right">您确定要结束问诊吗</span>
                </div>
                <div class="end-content">药品价格共计<span class="end-content-total">{{total}}</span>元，确认结束问诊？</div>
                <div class="end-button-wrap">
                  <div class="end-button-confirm" @click="comfirmEnd()">确定</div>
                  <div class="end-button-cancel" @click="cancelEnd()">取消</div>
                </div>
                <div class="common-btn-red" slot="reference">结束问诊</div>
              </el-popover>
            </div>
            <div class="conrtol-right" v-if="stepsMap[details.orderStatus] == 4 && details.prescriptionId">
              <div class="common-btn-white" @click="handleTracking()">处方跟踪</div>
            </div>
            <agora-component
              v-if="openAgora"
              :details="details"
              @handleEnd="handleCloseVideo()"
              @startCommunication="startCommunication()">
            </agora-component>
          </div>
        </div>
        <div class="progress-and-information">
          <div class="progress-title">
            <svg class="icon progressicon" aria-hidden="true">
              <use xlink:href="#icon-biaoqian1"></use>
            </svg>
            <span class="progress-title-word">问诊进度</span>
          </div>
          <el-steps align-center :active="stepsMap[details.orderStatus]-1" finish-status="success">
            <el-step v-for="(item, index) in stepsEnum" :title="item" :key="item"></el-step>
          </el-steps>
          <div class="information-title">
            <svg class="icon informationicon" aria-hidden="true">
              <use xlink:href="#icon-biaoqian1"></use>
            </svg>
            <span class="information-title-word">就诊信息</span>
          </div>
          <div class="information-content">
            <el-row>
              <el-col :span="8">
                <div class="information-pre">患者姓名：</div>
                <div class="information-item">{{details.contact.name}}</div>
              </el-col>
              <el-col :span="8">
                <div class="information-pre">性别：</div>
                <div class="information-item">{{details.contact.gender}}</div>
              </el-col>
              <el-col :span="8">
                <div class="information-pre">年龄：</div>
                <div class="information-item">{{new Date().getFullYear()-details.contact.birthday.slice(0,4)}}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <div class="information-pre">就诊卡号：</div>
                <div class="information-item">{{details.contact.contactId}}</div>
              </el-col>
              <el-col :span="8">
                <div class="information-pre">身份证：</div>
                <div class="information-item">{{details.contact.cardNo}}</div>
              </el-col>
              <el-col :span="8">
                <div class="information-pre">电话：</div>
                <div class="information-item">{{details.contact.phone}}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <div class="information-pre">预约专家：</div>
                <div class="information-item">{{details.doctorHeterogeneousDO.doctorName}}</div>
              </el-col>
              <el-col :span="8">
                <div class="information-pre">挂号费用：</div>
                <div class="information-item">{{details.orderFee}}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="information-pre">病情描述：</div>
                <div class="information-item">{{details.diseaseDescription}}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="information-pre">问诊照片：</div>
                <div class="information-item" v-if="!details.picturesOfDisease.length">无</div>
                <img class="information-item-image" v-for="(x, index) in details.picturesOfDisease" :key="index" :src="'v1/image/download?fileName='+x.originPictureId" @click="openZoomInImage(x.originPictureId)" />
                <transition name="fade">
                  <div class="zoom-in-wrap" v-if="zoom" @click="closeZoomInImage()">
                    <img class="zoom-in" :src="'v1/image/download?fileName='+originPictureId" alt="">
                  </div>
                </transition>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="process" v-if="(stepsMap[details.orderStatus] >= 3 && stepsMap[details.orderStatus] != 5)">
          <div class="process-title">
            <div class="process-title-left">
              <svg class="icon processicon" aria-hidden="true">
                <use xlink:href="#icon-biaoqian1"></use>
              </svg>
              <span class="process-title-word">接诊处理</span>
            </div>
            <div class="process-title-right" v-if="stepsMap[details.orderStatus] == 3">
              <div
                class="common-btn-green"
                v-if="!details.prescriptionId"
                @click="handleSavePrescription()">
                提交处方
              </div>
              <div
                class="common-btn-green"
                v-if="details.prescriptionId && !isEditing"
                @click="isEditing=true">
                修改处方
              </div>
              <div
                class="common-btn-green"
                v-if="details.prescriptionId && isEditing"
                @click="handleSavePrescription()">
                保存处方
              </div>
            </div>
          </div>
          <div class="opinion">
            <div class="opinion-title">
              <span class="opinion-title-left">*</span>
              <span class="opinion-title-item">治疗意见：</span>
            </div>
            <el-input
              class="opinion-content"
              type="textarea"
              placeholder="请输入内容"
              v-model="textarea"
              :disabled="!isEditing">
            </el-input>
          </div>
          <div class="Traditional-Chinese-medicine">
            <div class="TCM-title">
              <span class="TCM-title-item">中药处方照片：</span>
            </div>
            <upload-component
              :keyName="'TCMUpload'"
              :keyInfo="'TCMInfo'"
              :details="details"
              :isEditing="isEditing"
              :picture="TCM_picture_original"
              :imageType="'PICTURE_OF_TCL_PRESCRIPTION'"
              @updateUrlList="updateTCMPictureId"
              @upadtePicture="upadteTCMPicture">
            </upload-component>
            <div class="TCM-info">
              <el-row>
                <el-col :span="8">
                  <span class="TCM-pre">中药金额</span>
                  <el-input
                    class="TCM-item"
                    v-model="TCM_fee_input"
                    placeholder="请输入金额"
                    v-on:input="calculate_from_input"
                    :disabled="!isEditing">
                  </el-input>
                  <span class="TCM-unit">元</span>
                </el-col>
                <el-col :span="8">
                  <span class="TCM-pre">中药贴数</span>
                  <el-input
                    class="TCM-item"
                    v-model="TCM_number_input"
                    placeholder="请输入贴数"
                    :disabled="!isEditing">
                  </el-input>
                  <span class="TCM-unit">贴</span>
                </el-col>
                <el-col :span="8">
                  <span class="TCM-pre">中药重量</span>
                  <el-input
                    class="TCM-item"
                    v-model="TCM_weight_input"
                    placeholder="请输入重量"
                    :disabled="!isEditing">
                  </el-input>
                  <span class="TCM-unit">克</span>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="Western-medicine">
            <div class="WM-title">
              <span class="WM-title-item">西药处方照片：</span>
            </div>
            <upload-component
              :keyName="'WMUpload'"
              :keyInfo="'WMInfo'"
              :details="details"
              :isEditing="isEditing"
              :picture="WM_picture_original"
              :imageType="'PICTURE_OF_WS_MEDICINE_PRESCRIPTION'"
              @updateUrlList="updateWMPictureId"
              @upadtePicture="upadteWMPicture">
            </upload-component>
            <div class="WM-info">
              <el-row>
                <el-col :span="8">
                  <span class="WM-pre">西药金额</span>
                  <el-input
                    class="WM-item"
                    v-model="WM_fee_input"
                    placeholder="请输入金额"
                    v-on:input="calculate_from_input"
                    :disabled="!isEditing">
                  </el-input>
                  <span class="WM-unit">元</span>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="money">
            <span class="money-word">费用总计：</span>
            <span class="money-number-integer">{{total_integer}}.</span><span class="money-number-decimal">{{total_decimal}}</span>
            <span class="money-word">元（不含快递费）</span>
          </div>
        </div>
        <dialog-component
          :openDialog="openDialog"
          @closeDialog="closeDialog"></dialog-component>
      </div>
    </div>
  </div>
</template>

<script>
import agoraComponent from '@/components/agoraComponent';
import dialogComponent from '@/components/dialogComponent';
import uploadComponent from '@/components/uploadComponent';
export default {
  name: 'videoDetail',
  data () {
    return {
      loading: false,
      isEditing: this.$route.query.orderStatus === 'IN_PROGRESS' && this.$route.query.prescriptionId === null ? true : false,
      statusMap: {
        'NOT_PAY': '未支付',
        'WAITING_FOR_TIME': '等待确认时间',
        'WAITING_FOR_VISIT': '等待开诊',
        'IN_PROGRESS': '正在进行',
        'OVERTIME_COMPLETED': '已结束（未支付）',
        'SUCCEEDED_COMPLETED': '已结束（正常完成）',
        'CANCEL': '已结束（拒绝并退款）'
      },
      stepsMap: {
        'NOT_PAY': 1,
        // 'WAITING_FOR_TIME': 2,
        'WAITING_FOR_VISIT': 2,
        'IN_PROGRESS': 3,
        'OVERTIME_COMPLETED': 4,
        'SUCCEEDED_COMPLETED': 4,
        'CANCEL': 5
      },
      stepsEnum: ['1.等待患者支付','2.等待开诊','3.问诊进行中','4.问诊结束'],
      orderId: this.$route.query.orderId,
      user: this.$tools.getSessionStorage('user_details_data'),
      details: {
        contact: {
          birthday: ''
        },
        doctorHeterogeneousDO: {
          doctorName: ''
        },
        picturesOfDisease: []
      },
      openAgora: false,//进入视频诊间
      refund_visible: false,//取消并退款
      end_visible: false,//结束问诊
      openDialog: false,//邀请其他医生

      textarea: '',//治疗意见
      TCM_fee_input: '',//中药金额
      TCM_number_input: '',//中药贴数
      TCM_weight_input: '',//中药重量
      TCM_picture_new: [],//中药处方照片——未提交
      TCM_picture_original: [],//中药处方照片——已提交
      WM_fee_input: '',//西药金额
      WM_picture_new:[],//西药处方照片——未提交
      WM_picture_original:[],//西药处方照片——已提交

      total: '',//费用总计
      total_integer: '',//整数位
      total_decimal: '00',//小数位

      zoom: false,
      originPictureId: '',//上传图片后返回的图片id
      prescriptionId: '',//提交处方后返回的处方id
    }
  },
  watch: {
    // TCM_fee_input: function(){
    //   this.TCM_fee_input = this.TCM_fee_input.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'');
    // },
    // WM_fee_input: function(){
    //   this.WM_fee_input=this.WM_fee_input.replace(/[^\d]/g,'');
    // }
  },
  methods: {
    //返回上一页
    handleBack () {
      this.$router.push({
        path: '/videos/list',
        name: '视频问诊列表',
      })
    },
    //upload组件增加loading
    handleLoading (payload) {

    },
    //邀请其他医生
    handleInvite () {
      this.openDialog = true;
    },
    //退出邀请弹框
    closeDialog () {
      this.openDialog = false;
    },
    //处方跟踪
     handleTracking () {
      if(this.details.prescriptionId){
        this.$router.push({
          path: '/onlineRecipes/detail',
          name: '在线处方详情',
          query: { prescriptionId: this.details.prescriptionId }
        })
      }else {
        this.$message({
          message: '处方单号为空!',
          type: 'warning',
          center: true
        });
      }
    },
    //进入视频诊间
    handleOpenVideo () {
      this.openAgora = true;
    },
    //结束视频通话
    handleCloseVideo () {
      this.openAgora = false;
    },
    //告知后台和远程开始进行视频
    startCommunication () {
      this.$services.startVideo(this.orderId)
      .then(res => {
        this.getVideoDetail();
        this.details.prescriptionId = ''
        this.isEditing = true
      })
    },
    //确认退款
    comfirmRefund () {
      this.refund_visible = false;
      this.loading = true;
      this.$services.cancelVideoOrder(this.details.orderId)
      .then(res => {
        this.loading = false;
      })
    },
    //取消退款
    cancelRefund () {
      this.refund_visible = false;
    },
    //确认结束问诊
    comfirmEnd () {
      this.finishOrder();
      this.end_visible = false;
    },
    //取消结束问诊
    cancelEnd () {
      this.end_visible = false;
    },
    //更新中药上传照片id列表——新上传
    updateTCMPictureId (param) {
      this.TCM_picture_new = param;
    },
    //更新中药上传照片id列表——已上传
    upadteTCMPicture (param) {
      this.TCM_picture_original = param;
    },
    //更新西药上传照片id列表——新上传
    updateWMPictureId (param) {
      this.WM_picture_new = param;
    },
    //更新西药上传照片id列表——已上传
    upadteWMPicture (param) {
      this.WM_picture_original = param;
    },
    //放大图片
    openZoomInImage (param) {
      this.zoom = true;
      this.originPictureId = param;
    },
    //退出放大
    closeZoomInImage () {
      this.zoom = false;
      this.originPictureId = ''
    },
    //提交处方
    handleSavePrescription () {
      this.loading = true;
      let TCM_pictureId = [...this.TCM_picture_new,...this.TCM_picture_original].map(item => item.pictureId)
      let WM_pictureId = [...this.WM_picture_new,...this.WM_picture_original].map(item => item.pictureId)
      let param_prescription = {
        // "chengyao": "string",
        "contactId": this.details.contact.contactId,
        "contactName": this.details.contact.name,
        // "decoctingWay": "string",
        // "expressFee": 0,
        // "expressId": "string",
        // "expressName": "string",
        // "expressPayWay": "string",
        "feeUnit": this.details.feeUnit,
        // "herbMedicine": "string",
        "hospitalId": this.details.hospitalDO.hospitalId,
        "hospitalName": this.details.hospitalDO.hospitalName,
        "iuid": this.details.iuid,
        // "mailAddress": "string",
        "medicineDoctor": this.user.doctorName,
        "medicineDoctorId": this.user.doctorId,
        //"payStatus": this.details.payStatus,
        "pictures": [...TCM_pictureId,...WM_pictureId],
        "prescriptionFee": this.total,
        "prescriptionStatus": "WAITING_FOR_PAY",
        // "processFee": 0,
        // "recipientName": "string",
        // "recipientTel": "string",
        // "remark": "string",
        // "reviewDoctor": "string",
        // "reviewDoctorId": "string",
        // "serviceCostFee": 0,
        "sourceOfPrescription": "视频问诊",
        // "takeWay": "string",
        "tcmCount": this.TCM_number_input,
        "tcmPrice": this.TCM_fee_input,
        "tcmWeight": this.TCM_weight_input,
        // "totalFee": 0,
        "westernMedicinePrice": this.WM_fee_input
      }

      if(!this.prescriptionId){//新增
        this.$services.addPrescription(param_prescription)
        .then(res => {
          this.loading = false;
          if(res.state == 200){
            this.isEditing = false;
            this.prescriptionId = res.results;
            this.updateOrder();
            this.$message({
              message: '处方提交成功!',
              type: 'success',
              center: true
            });
          }
        })
      }else {//更新
        param_prescription['prescriptionId'] = this.prescriptionId;
        this.$services.updatePrescription(param_prescription)
        .then(res => {
          this.loading = false;
          this.isEditing = false;
          this.getVideoDetail();
          if(res.state == 200){
            this.$message({
              message: '处方保存成功!',
              type: 'success',
              center: true
            });
          }
        })
      }
    },
    //更新订单
    updateOrder () {
      this.loading = true;
      let param_order = {
        "treatmentOpinion": this.textarea,
        "prescriptionId": this.prescriptionId,
      }
      this.$services.updateVideoOrder(this.orderId, param_order)
      .then(res => {
        this.loading = false;
        if(res.state == 200){
          this.$message({
            message: '订单更新成功!',
            type: 'success',
            center: true
          });
          this.getVideoDetail();
        }
      })
    },
    //完成订单
    finishOrder () {
      this.loading = true;
      this.$services.finishVideoOrder(this.orderId)
      .then(res => {
        this.loading = false;
        this.getVideoDetail();
      })
    },
    //获取订单详情
    getVideoDetail () {
      this.loading = true;
      this.$services.fetchVideoDetail(this.orderId)
      .then((res) => {
        this.loading = false;
        this.details = res.results;
        this.textarea = this.details.treatmentOpinion;
        if(this.details.prescriptionId){
          this.prescriptionId = this.details.prescriptionId;
          this.fetchPrescriptionDetails();
        }
      })
    },
    //获取处方详情
    fetchPrescriptionDetails () {
      this.loading = true;
      this.$services.fetchOnlineDetail(this.prescriptionId)
      .then(res => {
        this.loading = false;
        let details = res.results;
        this.TCM_fee_input = details.tcmPrice;
        this.TCM_number_input = details.tcmCount;
        this.TCM_weight_input = details.tcmWeight;
        this.WM_fee_input = details.westernMedicinePrice;
        // this.TCM_pictureId = details.pictureIds;
        // this.WM_pictureId = details.pictureIds;
        this.WM_picture_original = [];
        this.TCM_picture_original = [];
        details.pictureIds.map((item,index,input) => {
          if(item.imageType == 'PICTURE_OF_WS_MEDICINE_PRESCRIPTION'){
            this.WM_picture_original.push({
                pictureId: item.pictureId,
                originPictureId: item.originPictureId
            })
          }else if(item.imageType == 'PICTURE_OF_TCL_PRESCRIPTION'){
            this.TCM_picture_original.push({
                pictureId: item.pictureId,
                originPictureId: item.originPictureId
            })
          }
        })
        this.calculate_from_server(details.prescriptionFee);
      })
    },
    //计算金额的整数位和小数位--输入变化
    calculate_from_input () {
      this.total = (parseFloat(this.TCM_fee_input || 0) + parseFloat(this.WM_fee_input || 0)).toFixed(2);
      this.total_integer = parseInt(this.total / 1);
      var x = this.total.toString();
      this.total_decimal = x.slice(x.indexOf(".")+1,x.indexOf(".")+3);
    },
    //计算金额的整数位和小数位--服务端获取
    calculate_from_server (param) {
      this.total = (param).toFixed(2);
      this.total_integer = parseInt(this.total / 1);
      var x = this.total.toString();
      this.total_decimal = x.slice(x.indexOf(".")+1,x.indexOf(".")+3);
    },
  },
  mounted () {
    this.getVideoDetail()
  },
  components: {
    agoraComponent,
    dialogComponent,
    uploadComponent
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.videoDetail {
  display: flex;
  flex-direction: column;
  flex: 1;
  .videoDetail-content-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    .videoDetail-content {
      display: flex;
      flex-direction: column;
      flex: auto;
      height: 100%;
      overflow-y: auto;
      overflow-x: auto;
      .control {
        // min-width: 1000px;
        margin-bottom: 20px;
        padding: 20px;
        height: 80px;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0px 1px 4px 0px rgba(202, 202, 202, 0.5);
        .control-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          .control-left {
            display: flex;
            .control-time {
              display: flex;
              align-items: center;
              margin-right: 40px;
              .timeicon {
                margin-right: 10px;
                font-size: 19px;
              }
              .time-pre {
                line-height: 22px;
                color: rgba(102, 102, 102, 1);
                font-size: 16px;
                text-align: left;
                font-family: PingFangSC-Regular;
              }
              .time-word {
                line-height: 25px;
                color: rgba(6, 174, 166, 1);
                font-size: 16px;
                text-align: center;
                font-family: PingFangSC-Regular;
              }
            }
            .control-status {
              display: flex;
              align-items: center;
              .statusicon {
                margin-right: 10px;
                font-size: 19px;
              }
              .status-pre {
                line-height: 22px;
                color: rgba(102, 102, 102, 1);
                font-size: 16px;
                text-align: left;
                font-family: PingFangSC-Regular;
              }
              .status-word {
                line-height: 25px;
                color: rgba(243, 158, 105, 1);
                font-size: 16px;
                text-align: left;
                font-family: PingFangSC-Regular;
              }
            }
          }
          .control-right {
          }
        }
      }
      .progress-and-information {
        // min-width: 1000px;
        flex: 1;
        padding: 20px;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0px 1px 4px 0px rgba(202, 202, 202, 0.5);
        .progress-title {
          display: flex;
          align-items: center;
          margin-bottom: 25px;
          .progressicon {
            margin-right: 10px;
          }
          .progress-title-word {
            line-height: 14px;
            color: rgba(74, 74, 74, 1);
            font-size: 14px;
            text-align: left;
            font-family: PingFangSC-Regular;
          }
        }
        .information-title {
          display: flex;
          align-items: center;
          margin-top: 40px;
          .informationicon {
            margin-right: 10px;
          }
          .information-title-word {
            line-height: 14px;
            color: rgba(74, 74, 74, 1);
            font-size: 14px;
            text-align: left;
            font-family: PingFangSC-Regular;
          }
        }
        .information-content {
          // margin-top: 20px;
          .el-col {
            display: flex;
          }
          .information-pre {
            height: 20px;
            line-height: 20px;
            color: #4a4a4a;
            font-size: 14px;
            text-align: left;
            font-family: PingFangSC-Regular;
          }
          .information-item {
            height: 20px;
            line-height: 20px;
            color: #666666;
            font-size: 14px;
            text-align: left;
            font-family: PingFangSC-Regular;
          }
          .information-item-image {
            margin-right: 10px;
            width: 78px;
            height: 78px;
            cursor: pointer;
            // border: 1px solid white;
            // transition: all .2s;
            // &:hover {
            //   box-shadow: inset 0 0 0 1px rgba(0,0,0,.1);
            //   border: 1px solid #1e98ea;
            // }
          }
          .el-row {
            margin-top: 20px;
          }
        }
      }
      .process {
        // min-width: 1000px;
        margin-top: 20px;
        padding: 20px;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0px 1px 4px 0px rgba(202, 202, 202, 0.5);
        .process-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .process-title-left {
            .processicon {
              margin-right: 10px;
            }
            .process-title-word {
              line-height: 14px;
              color: rgba(74, 74, 74, 1);
              font-size: 14px;
              text-align: left;
              font-family: PingFangSC-Regular;
            }
          }
          .process-title-right {

          }
        }
        .opinion {
          padding: 0 0 20px 13px;
          border-bottom: 1px dashed rgba(219, 219, 219, 1);
          .opinion-title {
            margin-top: 20px;
            .opinion-title-left {
              line-height: 25px;
              color: rgba(243, 105, 105, 1);
              font-size: 18px;
              text-align: left;
              font-family: PingFangSC-Regular;
            }
            .opinion-title-item {
              line-height: 20px;
              color: rgba(102, 102, 102, 1);
              font-size: 14px;
              text-align: left;
              font-family: PingFangSC-Regular;
            }
          }
          .opinion-content {
            margin-top: 20px;
            wdith: 100%;
            height: 108px;
            textarea {
              height: 100%;
              &:focus {
                border-color: #06AEA6;
              }
            }
          }
        }
        .Traditional-Chinese-medicine {
          margin-top: 20px;
          padding: 0 0 20px 13px;
          border-bottom: 1px dashed rgba(219, 219, 219, 1);
          .TCM-title {
            margin-bottom: 20px;
            .TCM-title-item {
              line-height: 20px;
              color: rgba(102, 102, 102, 1);
              font-size: 14px;
              text-align: left;
              font-family: PingFangSC-Regular;
            }
          }
          .TCM-item-image {
            margin-right: 10px;
            width: 78px;
            height: 78px;
            cursor: pointer;
          }
          .el-upload--picture-card {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 78px;
            height: 78px;
          }
          .TCM-info {
            margin-top: 20px;
            .TCM-pre {
              margin-right: 10px;
              height: 20px;
              line-height: 20px;
              color: rgba(102, 102, 102, 1);
              font-size: 14px;
              text-align: left;
              font-family: PingFangSC-Regular;
            }
            .TCM-item {
              width: 200px;
              input {
                height: 36px;
                border-radius: 0;
                &:focus {
                  border-color: #06AEA6;
                }
              }
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
          }
        }
        .Western-medicine {
          margin-top: 20px;
          padding: 0 0 20px 13px;
          border-bottom: 1px dashed rgba(219, 219, 219, 1);
          .WM-title {
            margin-bottom: 20px;
            .WM-title-item {
              line-height: 20px;
              color: rgba(102, 102, 102, 1);
              font-size: 14px;
              text-align: left;
              font-family: PingFangSC-Regular;
            }
          }
          .WM-item-image {
            margin-right: 10px;
            width: 78px;
            height: 78px;
            cursor: pointer;
          }
          .el-upload--picture-card {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 78px;
            height: 78px;
          }
          .WM-info {
            margin-top: 20px;
            .WM-pre {
              margin-right: 10px;
              height: 20px;
              line-height: 20px;
              color: rgba(102, 102, 102, 1);
              font-size: 14px;
              text-align: left;
              font-family: PingFangSC-Regular;
            }
            .WM-item {
              width: 200px;
              input {
                height: 36px;
                border-radius: 0;
                &:focus {
                  border-color: #06AEA6;
                }
              }
            }
            .WM-unit {
              margin-left: 10px;
              height: 20px;
              line-height: 20px;
              color: rgba(102, 102, 102, 1);
              font-size: 14px;
              text-align: left;
              font-family: PingFangSC-Regular;
            }
          }
        }
        .money {
          padding: 20px 0 0 13px;
          span {
            line-height: 20px;
            color: rgba(102, 102, 102, 1);
            font-size: 14px;
            text-align: left;
            font-family: PingFangSC-Regular;
          }
          .money-number-integer {
            color: #fb686c;
          }
          .money-number-decimal {
            color: #fb686c;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
