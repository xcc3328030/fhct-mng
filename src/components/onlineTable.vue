<template>
  <div class="onlineTable">
    <div class="table-header-wrap">
      <table class="table-header" border="0" cellpadding="0" cellspacing="0">
        <colgroup>
          <col style="width: 12.5%"></col>
          <col style="width: 12.5%"></col>
          <col style="width: 12.5%"></col>
          <col style="width: 12.5%"></col>
          <col style="width: 12.5%"></col>
          <col style="width: 12.5%"></col>
          <col style="width: 12.5%"></col>
        </colgroup>
        <thead>
          <tr>
            <th>处方编号</th>
            <th>状态</th>
            <th>开具时间</th>
            <th>处方来源</th>
            <th>患者姓名</th>
            <th>开药医生</th>
            <th>处方金额</th>
            <th>操作</th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="table-body-wrap">
      <table class="table-body" border="0" cellpadding="0" cellspacing="0">
        <colgroup>
          <col style="width: 12.5%"></col>
          <col style="width: 12.5%"></col>
          <col style="width: 12.5%"></col>
          <col style="width: 12.5%"></col>
          <col style="width: 12.5%"></col>
          <col style="width: 12.5%"></col>
          <col style="width: 12.5%"></col>
        </colgroup>
        <tbody>
          <tr v-for="(x,index) in data">
            <td>
              <div class="dot" :class="{'red-dot': stepsMap[x.prescriptionStatus]==1||stepsMap[x.prescriptionStatus]==3,'yellow-dot': stepsMap[x.prescriptionStatus]==2,'gray-dot': stepsMap[x.prescriptionStatus]==4}"></div>
              {{x.prescriptionId}}
            </td>
            <td>{{statusMap[x.prescriptionStatus]}}</td>
            <td>{{x.createTime}}</td>
            <td>{{x.sourceOfPrescription}}</td>
            <td>{{x.contactName}}</td>
            <td>{{x.medicineDoctor}}</td>
            <td>{{x.prescriptionFee}}</td>
            <td>
              <div class="tbody-detail">
                <span class="detail" @click="handleOpen(x,index)">处方详情</span>
              </div>
              <express-component
                :data="x"
                v-if="x.prescriptionStatus == 'WAITING_FOR_DELIVERY' && !x.expressId"
                @notifyTable="notifyTable">
              </express-component>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import expressComponent from '@/components/expressComponent';
export default {
  name: 'onlineTable',
  props: ['data'],
  data () {
    return {
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
    }
  },
  methods: {
    //打开详情
    handleOpen (item, index) {
      this.$router.push({
        path: '/onlineRecipes/detail',
        name: '在线处方详情',
        query: { prescriptionId: item.prescriptionId }
      })
    },
    //更新处方
    notifyTable () {
      this.$emit("notifyOnline")
    }
  },
  mounted () {

  },
  components: {
    expressComponent
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.onlineTable {
  // height: 100%;
  overflow-x: auto;
  // overflow-y: hidden;
  .table-header-wrap {
    min-width: 1200px;
    width: 100%;
    .table-header {
      width: 100%;
      tr {
        background: #EEEEEE;
        th {
          height: 40px;
          padding: 10px 20px;
          line-height: 20px;
          color: #333333;
          font-size: 14px;
          text-align: left;
          font-family: PingFangSC-Regular;
          &:nth-child(1){
            min-width: 270px;
          }
          &:nth-child(2){
            min-width: 120px;
          }
          &:nth-child(3){
            min-width: 170px;
          }
          &:nth-child(3){
            min-width: 150px;
          }
          &:nth-child(6){
            min-width: 170px;
          }
          &:nth-child(8){
            min-width: 170px;
          }
        }
      }
    }
  }
  .table-body-wrap {
    min-width: 1200px;
    width: 100%;
    .table-body {
      width: 100%;
      tr {
        transition: all .2s;
        &:nth-child(2n){
          background: #F5F5F5;
        }
        &:hover {
          background: #f5f7fa;
        }
        td {
          height: 40px;
          padding: 12px 20px;
          line-height: 17px;
          color: rgba(102, 102, 102, 1);
          font-size: 12px;
          text-align: left;
          font-family: PingFangSC-Regular;
          &:nth-child(1){
            min-width: 270px;
            display: flex;
            align-items: center;
          }
          &:nth-child(2){
            min-width: 120px;
          }
          &:nth-child(3){
            min-width: 170px;
          }
          &:nth-child(3){
            min-width: 150px;
          }
          &:nth-child(6){
            min-width: 170px;
          }
          &:nth-child(8) {
            // display: flex;
            // align-items: center;
            min-width: 170px;
          }
        }
      }
    }
    .tbody-detail {
      width: 50%;
      height: 100%;
      float: left;
      line-height: 28px;
      .detail {
        color: #45A8E6;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
