<template>
  <div class="onlineRecipesList">
    <div class="common-search-input">
      <div class="search-header">
        <el-input
          class="input-with-icon"
          placeholder="搜索患者"
          v-model="input_online"
          @keyup.enter.native="searchOnlineRecipes()">
          <el-button slot="append" icon="el-icon-search" @click="searchOnlineRecipes()"></el-button>
        </el-input>
        <div class="export-recipes" @click="handleOpenDialog()">导出处方列表</div>
      </div>
    </div>
    <div class="common-search-order">
      <div v-show="defaultImg" class="common-default">
        <div class="nodata-img">
          <img src="../assets/image/没有内容-缺省图标.png" alt="暂无图片" >
        </div>
        <h1>当前页面暂无内容</h1>
      </div>
      <online-table
        v-show="!defaultImg"
        :data="orders"
        v-loading="loading"
        @notifyOnline="notifyOnline">
      </online-table>
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
      <excel-component
        :openDialog="openDialog"
        :inputOnline="input_online"
        @closeDialog="handleCloseDialog">
      </excel-component>
    </div>
  </div>
</template>

<script>
import services from '@/services/services.js'
import onlineTable from '@/components/onlineTable';
import excelComponent from '@/components/excelComponent';
export default {
  name: 'onlineRecipesList',
  data () {
    return {
      openDialog: false,
      input_online: '',
      orders: [],
      loading: false,
      page: 1,
      size: 10,
      total: 0,
      defaultImg: false
    }
  },
  methods: {
    //打开导出弹窗
    handleOpenDialog () {
      this.openDialog = true;
    },
    //关闭导出弹窗
    handleCloseDialog () {
      this.openDialog = false;
    },
    //搜索
    searchOnlineRecipes () {
      this.loading = true;
      let param = {
        'hospitalId_must_match': this.$tools.getSessionStorage('user_details_data').hospitalId,
        'contact.name_should_match': this.input_online || undefined,
        // 'doctorHeterogeneousDO.doctorName_should_match': this.input_online || undefined,
        // 'minimum_should_match': 1,
        'page': this.page,
        'size': this.size,
      }
      this.$services.fetchOnlineList(param)
      .then(res => {
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
      this.searchOnlineRecipes();
    },
    //分页page跳转
    handleCurrentChange (val) {
      this.page = val;
      this.searchOnlineRecipes();
    },
    //更新处方列表
    notifyOnline () {
      this.searchOnlineRecipes();
    }
  },
  mounted () {
    this.searchOnlineRecipes();
  },
  components: {
    onlineTable,
    excelComponent
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.onlineRecipesList {
  height: 100%;
  display: flex;
  flex-direction: column;
  .common-search-input {
    .search-header {
      display: flex;
      justify-content: space-between;
    }

  }
  .export-recipes {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 183px;
    height: 32px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 1);
    border: 0.5px solid rgba(6, 174, 166, 1);
    line-height: 20px;
    color: rgba(6, 174, 166, 1);
    font-size: 14px;
    text-align: center;
    font-family: PingFangSC-Light;
    cursor: pointer;
  }
  .common-search-order {
    position: relative;
    flex: auto;
    overflow: auto;
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
    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
