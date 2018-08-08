<template>
  <div class="videoList">
    <div class="common-search-input">
      <el-input class="input-with-icon" placeholder="搜索患者" v-model="input_videos" @keyup.enter.native="searchContactOrDoctor()">
        <el-button slot="append" icon="el-icon-search" @click="searchContactOrDoctor()"></el-button>
      </el-input>
    </div>
    <div class="common-search-order">
      <el-tabs
        v-model="editableTabsValue"
        @tab-click="handleClick">
        <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name">
        </el-tab-pane>
      </el-tabs>
      <div v-show="defaultImg" class="common-default">
        <div class="nodata-img">
          <img src="../assets/image/没有内容-缺省图标.png" alt="暂无图片" >
        </div>
        <h1>当前页面暂无内容</h1>
      </div>
      <video-table :data="orders" v-loading="loading" v-show="!defaultImg"></video-table>
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
import Vue from 'vue'
import services from '@/services/services.js'
import videoTable from '@/components/videoTable'
export default {
  name: 'videoList',
  data () {
    return {
      editableTabsValue: '1',
      editableTabs: [{
        title: '进行中',
        name: '1',
      }, {
        title: '已结束',
        name: '2',
      }],

      orders: [],
      loading: false,
      input_videos: '',
      defaultImg: false,
      page: 1,
      size: 10,
      total: 0,
    }
  },
  methods: {
    //tab点击事件
    handleClick (tab, event) {
      this.page = 1;

      switch(tab.name){
        case '1': this.searchInProgress(); break;
        case '2': this.searchCompleted(); break;
        case '3': this.searchContactOrDoctor(); break;
        default: break;
      }
    },
    //公共搜索功能
    handleSearch (param) {
      this.loading = true;
      let PARAM = JSON.parse(JSON.stringify(param));
      PARAM['doctorId_must_match'] = this.$tools.getSessionStorage('user_details_data').doctorId;
      this.$services.fetchVideoList(PARAM)
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
    //按患者或者医生搜索订单
    searchContactOrDoctor () {
      if(this.editableTabsValue != '3' && this.editableTabs.length == 2){
        this.editableTabs.push({
          title: '搜索结果',
          name: '3'
        })
        this.editableTabsValue = '3';
      }else if(this.editableTabsValue != '3' && this.editableTabs.length == 3) {
        this.editableTabsValue = '3';
      }

      let param = {
        'contact.name_should_match': this.input_videos || undefined,
        'minimum_should_match': 1,
        // 'doctorHeterogeneousDO.doctorName_should_match': this.input_videos || undefined,
        page: this.page,
        size: this.size,
      }
      this.handleSearch(param);
    },
    //搜索进行中订单
    searchInProgress () {
      let param = {
        orderStatus_should_match: ['NOT_PAY','WAITING_FOR_TIME','WAITING_FOR_VISIT','IN_PROGRESS'],
        page: this.page,
        size: this.size,
      }
      this.handleSearch(param);
    },
    //搜索已结束订单
    searchCompleted () {
      let param = {
        orderStatus_should_match: ['OVERTIME_COMPLETED','SUCCEEDED_COMPLETED','CANCEL'],
        page: this.page,
        size: this.size,
      }
      this.handleSearch(param);
    },
    //分页size调整
    handleSizeChange (val) {
      this.size = val;
      switch(this.editableTabsValue){
        case '1': this.searchInProgress(); break;
        case '2': this.searchCompleted(); break;
        case '3': this.searchContactOrDoctor(); break;
        default: break;
      }
    },
    //分页page跳转
    handleCurrentChange (val) {
      this.page = val;
      switch(this.editableTabsValue){
        case '1': this.searchInProgress(); break;
        case '2': this.searchCompleted(); break;
        case '3': this.searchContactOrDoctor(); break;
        default: break;
      }
    }
  },
  mounted () {
    this.searchInProgress();
  },
  components: {
    videoTable
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.videoList {
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
