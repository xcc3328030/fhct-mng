<template>
  <div class="doctorsTable">
    <div class="table-header-wrap">
      <table class="table-header" border="0" cellpadding="0" cellspacing="0">
        <colgroup>
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
            <th>姓名</th>
            <th>性别</th>
            <th>科室</th>
            <th>职称</th>
            <th>所属医馆</th>
            <th>视频问诊</th>
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
          <col style="width: 8%"></col>
        </colgroup>
        <tbody>
          <tr v-for="(x,index) in data" :key="index">
            <td>{{x.doctorName}}</td>
            <td>{{x.gender === 'MAN' ? '男' : '女' }}</td>
            <td>{{x.deptValue}}</td>
            <td>{{x.titleValue}}</td>
            <td>{{x.hospitalName}}</td>
            <td>
              <span v-if="x.videosClinicFee">￥</span>
              {{x.videosClinicFee}}
            </td>
            <td><span @click="handleOpen(x,index)">查看</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'doctorsTable',
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data () {
    return {

    }
  },
  methods: {
    //打开医生详情
    handleOpen (item, index) {
      this.$router.push({
        path: '/doctors/detail',
        name: '医生详情',
        query: { doctorId: item.doctorId, hospitalId: item.hospitalId }
      })
    }
  },
  mounted () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss">
.doctorsTable {
  // height: 100%;
  overflow-x: auto;
  // overflow-y: hidden;
  .table-header-wrap {
    // min-width: 1200px;
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
          // &:nth-child(1){
          //   min-width: 270px;
          // }
          // &:nth-child(2){
          //   min-width: 120px;
          // }
          // &:nth-child(3){
          //   min-width: 170px;
          // }
          // &:nth-child(3){
          //   min-width: 150px;
          // }
          // &:nth-child(6){
          //   min-width: 170px;
          // }
          // &:nth-child(7){
          //   min-width: 170px;
          // }
        }
      }
    }
  }
  .table-body-wrap {
    // min-width: 1200px;
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
            // min-width: 270px;
            display: flex;
            align-items: center;
          }
          // &:nth-child(2){
          //   min-width: 120px;
          // }
          // &:nth-child(3){
          //   min-width: 170px;
          // }
          // &:nth-child(3){
          //   min-width: 150px;
          // }
          // &:nth-child(6){
          //   min-width: 170px;
          // }
          &:nth-child(7) {
            // min-width: 170px;
             span {
              color: #45A8E6;
              cursor: pointer;
              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
      }
    }
    .detail {
      color: #45A8E6;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
