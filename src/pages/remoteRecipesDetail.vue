<template>
  <div class="remoteRecipesDetail">
    <div class="common-back" @click="handleBack()">
      <svg class="icon backicon" aria-hidden="true">
        <use xlink:href="#icon-fanhui"></use>
      </svg>
      <span class="back-word">返回上一级</span>
    </div>
    <div class="remoteRecipesDetail-content-wrap" v-loading="loading">
      <div class="remoteRecipesDetail-content">
        <div class="control">
          <div class="control-wrap">
            <div class="control-left">
              <div class="control-status">
                <svg class="icon statusicon" aria-hidden="true">
                  <use xlink:href="#icon-biaoqian"></use>
                </svg>
                <span class="status-pre">当前状态：</span>
                <span class="status-word">{{statusMap[details.orderStatus]}}</span>
              </div>
            </div>
            <div class="control-right">
              <div class="status-waiting" v-if="details.orderStatus == 'WAITING'">
                <el-popover
                  popper-class="end-wrap"
                  placement="bottom-end"
                  width="160"
                  v-model="refuse_visible">
                  <div class="end-title-wrap">
                    <img class="end-title-left" src="@/assets/image/warning.png" alt="警告">
                    <span class="end-title-right">是否拒绝本次开方</span>
                  </div>
                  <div class="end-content">确认拒绝本次开方申请，并退还患者 相关费用</div>
                  <div class="end-button-wrap popover-refuse">
                    <div class="end-button-confirm" @click="comfirmRefuse()">确定</div>
                    <div class="end-button-cancel" @click="cancelRefuse()">取消</div>
                  </div>
                  <div class="common-btn-white" slot="reference">拒绝开方</div>
                </el-popover>
                <el-popover
                  popper-class="end-wrap"
                  placement="bottom-end"
                  width="160"
                  v-model="finish_visible">
                  <div class="end-title-wrap">
                    <img class="end-title-left" src="@/assets/image/warning.png" alt="警告">
                    <span class="end-title-right">您确定要完成开方吗</span>
                  </div>
                  <div class="end-content">药品价格共计<span class="end-content-total">{{total}}</span>元，确认开具远程续方？</div>
                  <div class="end-button-wrap">
                    <div class="end-button-confirm" @click="comfirmFinish()">确定</div>
                    <div class="end-button-cancel" @click="cancelFinish()">取消</div>
                  </div>
                  <div class="common-btn-green" slot="reference">完成开方</div>
                </el-popover>
              </div>
              <div
                class="common-btn-white"
                @click="handleTracking()"
                v-if="details.orderStatus != 'WAITING'">
                处方跟踪
             </div>
            </div>
          </div>
        </div>
        <div class="progress-and-information">
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
                <div class="information-item">{{details.contactDO.name}}</div>
              </el-col>
              <el-col :span="8">
                <div class="information-pre">性别：</div>
                <div class="information-item">{{details.contactDO.gender}}</div>
              </el-col>
              <el-col :span="8">
                <div class="information-pre">年龄：</div>
                <div class="information-item">{{new Date().getFullYear()-details.contactDO.birthday.slice(0,4)}}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <div class="information-pre">身份证：</div>
                <div class="information-item">{{details.contactDO.cardNo}}</div>
              </el-col>
              <el-col :span="8">
                <div class="information-pre">电话：</div>
                <div class="information-item">{{details.contactDO.phone}}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <div class="information-pre">预约专家：</div>
                <div class="information-item">{{details.doctorName}}</div>
              </el-col>
              <el-col :span="8">
                <div class="information-pre">期望就诊时间：</div>
                <div class="information-item">{{details.createTime || '暂未确定'}}</div>
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
                <div class="information-item" v-if="!details.pictureIds.length">无</div>
                <img class="information-item-image" v-for="x in details.pictureIds" :src="'v1/image/download?fileName='+x.originPictureId" @click="openZoomInImage(x.originPictureId)" />
                <transition name="fade">
                  <div class="zoom-in-wrap" v-if="zoom" @click="closeZoomInImage()">
                    <img class="zoom-in" :src="'v1/image/download?fileName='+originPictureId" alt="">
                  </div>
                </transition>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="process" v-show="recepteShow">
          <div class="process-title">
            <div class="process-title-left">
              <svg class="icon processicon" aria-hidden="true">
                <use xlink:href="#icon-biaoqian1"></use>
              </svg>
              <span class="process-title-word">接诊处理</span>
            </div>
            <div class="process-title-right">
              <div
                class="common-btn-green"
                v-if="!details.prescriptionId"
                @click="handleSavePrescription()">
                提交处方
              </div>
              <div
                class="common-btn-green"
                v-if="details.prescriptionId && !isEditing"
                @click="handleEditPrescription()">
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
      </div>
    </div>
  </div>
</template>

<script>
import uploadComponent from '@/components/uploadComponent';
export default {
  name: 'remoteRecipesDetail',
  data () {
    return {
      loading: false,
      isEditing: this.$route.query.orderStatus === 'WAITING' && this.$route.query.prescriptionId === null ? true : false,
      statusMap: {
        'WAITING': '等待开具处方',
        'SUCCEED_OPENED': '已开方',
        'REFUSED': '拒绝开方'
      },
      orderId: this.$route.query.orderId,
      user: this.$tools.getSessionStorage('user_details_data'),
      details: {
        contactDO: {
          birthday: ''
        },
        pictureIds: []
      },

      finish_visible: false,//完成开方
      refuse_visible: false,//拒绝开方

      TCM_fee_input: '',//中药金额
      TCM_number_input: '',//中药贴数
      TCM_weight_input: '',//中药重量
      TCM_picture_new: [],//中药处方照片——未提交
      TCM_picture_original: [],//中药处方照片——已提交
      WM_fee_input: '',//西药金额
      WM_picture_new:[],//西药处方照片——未提交
      WM_picture_original:[],//西药处方照片——已提交

      total: 0,//费用总计
      total_integer: 0,//整数位
      total_decimal: '00',//小数位

      zoom: false,
      originPictureId: '',//上传图片后返回的图片id
      prescriptionId: '',//提交处方后返回的处方id
    }
  },
  methods: {
    handleBack () {
      this.$router.push({
        path: '/remoteRecipes/list',
        name: '远程续方列表',
      })
    },
    //确认拒绝开方
    comfirmRefuse () {
      this.loading = true;
      this.$services.refuseRemoteRecipe(this.details.orderId)
      .then(res => {
        this.loading = false;
        if(res.state == 200){
          this.refuse_visible = false;
          this.$message({
            message: '已拒绝开方!',
            type: 'success',
            center: true
          });

        }
        this.getRemoteDetail();
      })
    },
    //取消拒绝开方
    cancelRefuse () {
      this.refuse_visible = false;
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
    //确认完成开方
    comfirmFinish () {
      this.finishOrder();
      this.finish_visible = false;
    },
    //取消完成开方
    cancelFinish () {
      this.finish_visible = false;
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
        "contactId": this.details.contactDO.contactId,
        "contactName": this.details.contactDO.name,
        // "decoctingWay": "string",
        // "expressFee": 0,
        // "expressId": "string",
        // "expressName": "string",
        // "expressPayWay": "string",
        "feeUnit": this.details.feeUnit,
        // "herbMedicine": "string",
        "hospitalId": this.details.hospitalId,
        "hospitalName": this.details.hospitalName,
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
        "sourceOfPrescription": "在线续方",
        // "takeWay": "string",
        "tcmCount": this.TCM_number_input || '',
        "tcmPrice": this.TCM_fee_input || '',
        "tcmWeight": this.TCM_weight_input || '',
        // "totalFee": 0,
        "westernMedicinePrice": this.WM_fee_input || ''
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
          this.getRemoteDetail();
          if(res.state == 200){
            this.isEditing = false;
            this.$message({
              message: '处方保存成功!',
              type: 'success',
              center: true
            });
          }
        })
      }
    },
    //编辑处方
    handleEditPrescription () {
      this.isEditing = true;
    },
    //更新订单
    updateOrder () {
      this.loading = true;
      this.$services.updateRemoteOrder(this.orderId, this.prescriptionId)
      .then(res => {
        this.loading = false;
        if(res.state == 200){
          this.$message({
            message: '订单更新成功!',
            type: 'success',
            center: true
          });
          this.getRemoteDetail();
        }
      })
    },
    //完成订单
    finishOrder () {
      this.loading = true;
      this.$services.finishRemoteRecipe(this.orderId)
      .then(res => {
        this.loading = false;
        this.getRemoteDetail();
      })
    },
    //获取详情
    getRemoteDetail () {
      this.loading = true;
      this.$services.fetchRemoteDetail(this.orderId)
      .then((res) => {
        this.loading = false;
        this.details = res.results;
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
    }
  },
  mounted () {
    this.getRemoteDetail();
  },
  components: {
    uploadComponent
  },
  computed: {
    recepteShow () {
      let result = true
      if (this.$route.query.orderStatus === 'SUCCEED_OPENED' || this.$route.query.orderStatus === 'REFUSED') {
        if (!this.$route.query.prescriptionId) {
          result = false
        }
      }
      return result
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.remoteRecipesDetail {
  display: flex;
  flex-direction: column;
  flex: 1;
  .remoteRecipesDetail-content-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    .remoteRecipesDetail-content {
      display: flex;
      flex-direction: column;
      flex: auto;
      height: 100%;
      overflow-y: auto;
      overflow-x: auto;
      .control {
        // min-width: 1170px;
        margin-bottom: 20px;
        padding: 20px;
        height: 80px;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0px 1px 4px 0px rgba(202, 202, 202, 0.5);
        .control-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
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
            .refund {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 150px;
              height: 40px;
              margin-left: 20px;
              border-radius: 4px;
              border: 1px solid rgba(243, 105, 105, 1);
              background-color: rgba(243, 105, 105, 1);
              font-size: 14px;
              text-align: center;
              font-family: PingFangSC-Light;
              color: rgba(255, 255, 255, 1);
              cursor: pointer;
            }
          }
        }
      }
      .progress-and-information {
        // min-width: 1170px;
        flex: 1;
        padding: 20px;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0px 1px 4px 0px rgba(202, 202, 202, 0.5);
        .information-title {
          display: flex;
          align-items: center;
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
          }
          .el-row {
            margin-top: 20px;
          }
        }
      }
      .process {
        // min-width: 1170px;
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
