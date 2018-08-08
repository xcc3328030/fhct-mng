<template>
  <div class="tableComponent">
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
          <col style="width: 8%"></col>
        </colgroup>
        <thead>
          <tr>
            <th>状态</th>
            <th>就诊时间</th>
            <th>患者姓名</th>
            <th>预约医生</th>
            <th>接诊医馆</th>
            <th>挂号费用</th>
            <th>处方编号</th>
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
          <col style="width: 8%"></col>
        </colgroup>
        <tbody>
          <tr v-for="(x,index) in data">
            <td>
              <div class="dot" :class="{'red-dot': stepsMap[x.orderStatus]==1,'yellow-dot': stepsMap[x.orderStatus]==2,'green-dot': stepsMap[x.orderStatus]==3,'gray-dot': stepsMap[x.orderStatus]==4}"></div>
              {{statusMap[x.orderStatus]}}
            </td>
            <td>{{x.actualDateOfVisit}}</td>
            <td>{{x.contact.name}}</td>
            <td>{{x.doctorHeterogeneousDO.doctorName}}</td>
            <td>{{x.hospitalDO ? x.hospitalDO.hospitalName : ''}}</td>
            <td>{{x.orderFee}}</td>
            <td
              :class="{active: x.prescriptionId}"
              @click="toOnlineRecipes(x.prescriptionId)"
              v-if="x.prescriptionId">{{x.prescriptionId}}</td>
            <td v-if="!x.prescriptionId">未开方</td>
            <td><span @click="handleOpen(x,index)">查看</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tableComponent',
  props: ['data'],
  data () {
    return {
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
        'WAITING_FOR_TIME': 2,
        'WAITING_FOR_VISIT': 2,
        'IN_PROGRESS': 3,
        'OVERTIME_COMPLETED': 4,
        'SUCCEEDED_COMPLETED': 4,
        'CANCEL': 4
      },
    }
  },
  methods: {
    //打开详情
    handleOpen (item, index) {
      this.$router.push({
        path: '/videos/detail',
        name: '视频问诊详情',
        query: { orderId: item.orderId, orderStatus: item.orderStatus, prescriptionId: item.prescriptionId }
      })
    },
    //打开在线处方详情
    toOnlineRecipes (id) {
      this.$router.push({
        path: '/onlineRecipes/detail',
        name: '在线处方详情',
        query: { prescriptionId: id }
      })
    }
  },
  mounted () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss">
.tableComponent {
  flex: auto;
  width: 100%;
  overflow-x: auto;
  .table-header-wrap {
    min-width: 1150px;
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
            min-width: 190px;
          }
          &:nth-child(2){
            min-width: 150px;
          }
          &:nth-child(4){
            min-width: 150px;
          }
          &:nth-child(7){
            min-width: 270px;
          }
        }
      }
    }
  }
  .table-body-wrap {
    min-width: 1150px;
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
            min-width: 190px;
            display: flex;
            align-items: center;
          }
          &:nth-child(2){
            min-width: 150px;
          }
          &:nth-child(4){
            min-width: 150px;
          }
          &:nth-child(7){
            min-width: 270px;
          }
          &:nth-child(8) {
            span {
              color: #45A8E6;
              cursor: pointer;
              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
        .active {
          color: rgba(69, 168, 230, 1)!important;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
  .default-picture {

  }
}
</style>
