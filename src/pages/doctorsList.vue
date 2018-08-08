<template>
  <div class="doctorsList">
    <div class="common-search-input">
      <el-input class="input-with-icon" placeholder="搜索医生" v-model="input_videos" @keyup.enter.native="handleSearch">
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>
    </div>
    <div class="common-search-order">
      <div v-show="defaultImg" class="common-default">
        <div class="nodata-img">
          <img src="../assets/image/没有内容-缺省图标.png" alt="暂无图片" >
        </div>
        <h1>当前页面暂无内容</h1>
      </div>
      <doctors-table :data="orders" v-loading="loading" v-show="!defaultImg"></doctors-table>
      <el-pagination
        v-show="!defaultImg"
        class="pagination"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="page"
        :total="total"
        :page-sizes="[10,20,30,40]"
        :page-size="size">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import services from '@/services/services'
import doctorsTable from '@/components/doctorsTable'
export default {
  name: 'doctorsList',
  data () {
    return {
      orders: [],
      loading: false,
      input_videos: '',
      page: 1,
      size: 10,
      total: 0,
      defaultImg: false
    }
  },
  methods: {
    // 搜索医生列表
    handleSearch () {
      this.loading = true;
      let param = {
        doctorName: this.input_videos,
        hospitalId: this.$tools.getSessionStorage('user_details_data').hospitalId,
        page: this.page,
        size: this.size,
      }
      let PARAM = JSON.parse(JSON.stringify(param));
      this.$services.fetchDoctorsList(PARAM)
      .then((res) => {
        this.loading = false;
        this.orders = res.results;
        this.total = res.total;
       if (res.results.length === 0){
          this.defaultImg = true;
        } else {
          this.defaultImg = false;
        }
      })
    },
    //分页size调整
    handleSizeChange (val) {
      this.size = val;
      this.handleSearch();
    },
    //分页page跳转
    handleCurrentChange (val) {
      this.page = val;
      this.handleSearch();
    }
  },
  mounted () {
    this.handleSearch();
  },
  components: {
    doctorsTable
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.doctorsList {
  height: 100%;
  display: flex;
  flex-direction: column;
  .common-search-order {
   position: relative;
    flex: auto;
    overflow: auto;
    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
    .common-default {
      text-align: center;
      .nodata-img {
        img {
          width: 144px;
          height: 123px;
          margin-top: 8%;
        }
      }
      h1 {
        margin:28px 0 0 0;
        color: #9c9c9c;
        font-weight: normal;
        font-size: 18px;
        font-family: '微软雅黑';
      }
    }
  }
}
</style>
