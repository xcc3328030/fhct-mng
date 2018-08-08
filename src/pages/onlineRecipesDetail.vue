<template>
  <div class="onlineRecipesDetail">
    <div class="common-back" @click="handleBack()">
      <svg class="icon backicon" aria-hidden="true">
        <use xlink:href="#icon-fanhui"></use>
      </svg>
      <span class="back-word">返回上一级</span>
    </div>
    <div class="onlineRecipesDetail-content-wrap" v-loading="loading">
      <div class="onlineRecipesDetail-content">
        <div class="progress-and-information">
          <div class="progress-title">
            <svg class="icon progressicon" aria-hidden="true">
              <use xlink:href="#icon-biaoqian1"></use>
            </svg>
            <span class="progress-title-word">处方状态</span>
          </div>
          <el-steps align-center :active="stepsMap[details.prescriptionStatus] - 1" finish-status="success">
            <el-step v-for="(item, index) in stepsEnum" :title="item" :key="item"></el-step>
          </el-steps>
          <div class="information-title recipe-information-title">
            <svg class="icon informationicon" aria-hidden="true">
              <use xlink:href="#icon-biaoqian1"></use>
            </svg>
            <span class="information-title-word">处方信息</span>
          </div>
          <div class="information-content recipe-information">
            <el-row>
              <el-col :span="10">
                <div class="information-pre">处方编号：</div>
                <div class="information-item">{{details.prescriptionId}}</div>
              </el-col>
              <el-col :span="10">
                <div class="information-pre">开方医生：</div>
                <div class="information-item">{{details.medicineDoctor}}</div>
              </el-col>
              <el-col :span="4">
                <div class="information-pre">审方医生：</div>
                <div class="information-item">{{details.reviewDoctor}}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <div class="information-pre">处方来源：</div>
                <div class="information-item">{{details.sourceOfPrescription}}</div>
              </el-col>
              <el-col :span="10">
                <div class="information-pre">开方时间：</div>
                <div class="information-item">{{details.createTime}}</div>
              </el-col>
              <el-col :span="4">
                <div class="information-pre">患者姓名：</div>
                <div class="information-item">{{details.contactName}}</div>
              </el-col>
            </el-row>
          </div>
          <div class="information-title express-information-title">
            <svg class="icon informationicon" aria-hidden="true">
              <use xlink:href="#icon-biaoqian1"></use>
            </svg>
            <span class="information-title-word">收货信息</span>
          </div>
          <div class="information-content express-information">
            <el-row>
              <el-col :span="10">
                <div class="information-pre">收件人：</div>
                <div class="information-item">{{details.recipientName}}</div>
              </el-col>
              <el-col :span="10">
                <div class="information-pre">联系电话：</div>
                <div class="information-item">{{details.recipientTel}}</div>
              </el-col>
              <el-col :span="4">
                <div class="information-pre">煎药方式：</div>
                <div class="information-item">{{decoctingWayMap[details.decoctingWay]}}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" style="display: flex">
                <div class="information-pre" style="width: 74px">收件地址：</div>
                <div class="information-item" style="flex: 1">{{details.mailAddress}}</div>
              </el-col>
              <el-col :span="10">
                <div class="information-pre">快递信息：</div>
                <div class="information-item" v-if="!details.expressId">无</div>
                <div class="information-item" v-if="details.expressId">
                {{details.expressName}} | {{details.expressId}}</div>
                <div class="information-express" v-if="details.expressId" @click="handleOpenKuaiDi100()">快递信息</div>
<!--                 <el-popover
                  placement="top-start"
                  width="200"
                  trigger="click">
                  <div class="express-item-wrap">
                    <div class="express-item" v-for="x in express">
                      <div class="express-item-icon-wrap">
                        <div class="express-item-icon"></div>
                      </div>
                      <div class="express-item-address">{{x.address}}</div>
                      <div class="express-item-time">{{x.time}}</div>
                    </div>
                  </div>
                  <div class="information-express" slot="reference">快递信息</div>
                </el-popover> -->
              </el-col>
              <el-col :span="4" style="display: flex">
                <div class="information-pre" style="width: 74px">快递费支付:</div>
                <div class="information-item" style="flex: 1">{{details.expressPayWay}}</div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="process">
          <div class="Traditional-Chinese-medicine">
            <div class="TCM-title">
                <span class="TCM-title-item">中药处方照片：</span>
            </div>
            <img class="information-item-image" v-for="(x, index) in details.pictureIds" v-if="x.imageType === 'PICTURE_OF_TCL_PRESCRIPTION'" :key="index" :src="'v1/image/download?fileName='+x.originPictureId" @click="openZoomInImage(x.originPictureId)" />
            <transition name="fade">
              <div class="zoom-in-wrap" v-if="zoom" @click="closeZoomInImage()">
                <img class="zoom-in" :src="'v1/image/download?fileName='+originPictureId" alt="">
              </div>
            </transition>
            <div class="TCM-info">
              <el-row>
                <el-col :span="8">
                  <span class="TCM-pre">中药金额</span>
                  <el-input class="TCM-item" v-model="details.tcmPrice" placeholder="请输入金额" :disabled="true"></el-input>
                  <span class="TCM-unit">元</span>
                </el-col>
                <el-col :span="8">
                  <span class="TCM-pre">中药贴数</span>
                  <el-input class="TCM-item" v-model="details.tcmCount" placeholder="请输入贴数" :disabled="true"></el-input>
                  <span class="TCM-unit">贴</span>
                </el-col>
                <el-col :span="8">
                  <span class="TCM-pre">中药重量</span>
                  <el-input class="TCM-item" v-model="details.tcmWeight" placeholder="请输入重量" :disabled="true"></el-input>
                  <span class="TCM-unit">克</span>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="Western-medicine">
            <div class="WM-title">
              <span class="WM-title-item">西药处方照片：</span>
            </div>
            <img class="information-item-image" v-for="(x, index) in details.pictureIds" v-if="x.imageType === 'PICTURE_OF_WS_MEDICINE_PRESCRIPTION'" :key="index" :src="'v1/image/download?fileName='+x.originPictureId" @click="openZoomInImage(x.originPictureId)" />
            <transition name="fade">
              <div class="zoom-in-wrap" v-if="zoom" @click="closeZoomInImage()">
                <img class="zoom-in" :src="'v1/image/download?fileName='+originPictureId" alt="">
              </div>
            </transition>
            <div class="WM-info">
              <el-row>
                <el-col :span="8">
                  <span class="WM-pre">西药金额</span>
                  <el-input class="WM-item" v-model="details.westernMedicinePrice" placeholder="请输入金额" :disabled="true"></el-input>
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
export default {
  name: 'onlineRecipesDetail',
  data () {
    return {
      loading: false,
      statusMap: {
        'WAITING_FOR_PAY': '等待患者支付',
        'WAITING_FOR_DELIVERY': '等待发货',
        'WAITING_FOR_RECEIPT': '等待收货',
        'SUCCEED': '完成',
        'COMPLETED': '已结束'
      },
      stepsMap: {
        'WAITING_FOR_PAY': 1,
        'WAITING_FOR_DELIVERY': 2,
        'WAITING_FOR_RECEIPT': 3,
        'SUCCEED': 4,
        'COMPLETED': 4
      },
      decoctingWayMap: {
        'SELF_FRYING': '自煎',
        'DECOCT': '代煎'
      },
      stepsEnum: ['1.等待患者支付','2.等待库房发药','3.等待患者收药','4.患者已收药'],
      prescriptionId: this.$route.query.prescriptionId,
      details: {

      },
      textarea: '',
      total: 0,
      total_integer: 0,//整数位
      total_decimal: '00',//小数位
      express: [
        {
          time: '2018-3-3',
          address: '北京'
        },
        {
          time: '2018-3-4',
          address: '上海'
        },
        {
          time: '2018-3-5',
          address: '杭州'
        },
        {
          time: '2018-3-6',
          address: '下城区'
        }
      ],
      originPictureId: '',
      zoom: false
    }
  },
  methods: {
    handleBack () {
      this.$router.push({
        path: '/remoteRecipes/list',
        name: '在线处方列表',
      })
    },
    //快递100查询物流
    handleOpenKuaiDi100 () {
      let href = `https://www.kuaidi100.com/chaxun?com=shunfeng&nu=` + this.details.expressId;
      window.open(href, '_blank')
    },
    //计算金额的整数位和小数位
    calculate () {
      this.total = (this.details.prescriptionFee).toFixed(2);
      this.total_integer = parseInt(this.total / 1);
      var x = this.total.toString();
      this.total_decimal = x.slice(x.indexOf(".")+1,x.indexOf(".")+3);
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
  },
  mounted () {
    this.loading = true;
    this.$services.fetchOnlineDetail(this.prescriptionId)
    .then(res => {
      this.loading = false;
      this.details = res.results;
      this.calculate();
    })
  },
  components: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.express-item-wrap {
  max-height: 200px;
  overflow-y: auto;
  .express-item {
    line-height: 16px;
    margin-left: 15px;
    padding-left: 20px;
    padding-top: 10px;
    padding-bottom: 20px;
    color: #999;
    position: relative;
    border-left: #d8d8d8 solid 2px;
    .express-item-icon-wrap {
      position: absolute;
      left: -6px;
      width: 10px;
      height: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      .express-item-icon {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #d8d8d8;
      }
    }
    .express-item-address {

    }
    .express-item-time {

    }
    &:last-child {
      padding-bottom: 5px;
    }
  }
}
.onlineRecipesDetail {
  display: flex;
  flex-direction: column;
  flex: 1;
  .onlineRecipesDetail-content-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    .onlineRecipesDetail-content {
      display: flex;
      flex-direction: column;
      flex: auto;
      height: 100%;
      overflow-y: auto;
      overflow-x: auto;
      .progress-and-information {
        // min-width: 1170px;
        // flex: 1;
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
          .information-express {
            margin-left: 10px;
            line-height: 20px;
            color: #33ace4;
            font-size: 14px;
            text-align: left;
            font-family: PingFangSC-Regular;
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
        .Traditional-Chinese-medicine {
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
          .information-item-image {
            margin-right: 10px;
            width: 78px;
            height: 78px;
            cursor: pointer;
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
          .information-item-image {
            margin-right: 10px;
            width: 78px;
            height: 78px;
            cursor: pointer;
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
