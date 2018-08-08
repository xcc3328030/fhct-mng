<template>
  <div class="remoteTable">
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
            <th>申请时间</th>
            <th>患者姓名</th>
            <th>开药医生</th>
            <th>开药医馆</th>
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
              <div class="dot" :class="{'gray-dot': x.orderStatus!='WAITING','green-dot': x.orderStatus=='WAITING'}"></div>
              {{statusMap[x.orderStatus]}}
            </td>
            <td>{{x.createTime}}</td>
            <td>{{x.contactDO.name}}</td>
            <td>{{x.doctorName}}</td>
            <td>{{x.hospitalName}}</td>
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
  name: 'remoteTable',
  props: ['data'],
  data () {
    return {
      statusMap: {
        'WAITING': '等待开具处方',
        'SUCCEED_OPENED': '已开方',
        'REFUSED': '拒绝开方'
      }
    }
  },
  methods: {
    handleOpen (item, index) {
      this.$router.push({
        path: '/remoteRecipes/detail',
        name: '远程续方详情',
        query: { orderStatus: item.orderStatus, orderId: item.orderId, prescriptionId: item.prescriptionId }
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
    console.log(this.data)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss">
.remoteTable {
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
            min-width: 150px;
          }
          &:nth-child(2){
            min-width: 170px;
          }
          &:nth-child(6){
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
            min-width: 150px;
            display: flex;
            align-items: center;
          }
          &:nth-child(2){
            min-width: 170px;
          }
          &:nth-child(6){
            min-width: 270px;
          }
          &:nth-child(7) {
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
}
</style>
