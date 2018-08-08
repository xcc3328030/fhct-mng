<template>
  <div id="app">
    <div class="header">
      <div class="header-left">
        <svg class="icon collapseicon" aria-hidden="true" v-show="!isCollapse" @click="handlePanel()">
          <use xlink:href="#icon-shouqi"></use>
        </svg>
        <svg class="icon collapseicon" aria-hidden="true" v-show="isCollapse" @click="handlePanel()">
          <use xlink:href="#icon-zhankai"></use>
        </svg>
        <img class="logo" src="@/assets/image/方回春堂.png"/>
        <div class="name">互联网医院工作站</div>
      </div>
      <div class="header-right">
        <svg class="icon xiaoxi" aria-hidden="true">
          <use xlink:href="#icon-xiaoxi"></use>
        </svg>
        <div class="user" @click="quit()">{{firstName}}</div>
        <el-dialog
          :visible.sync="centerDialogVisible"
          width="30%"
          center
          class="dialog-login-out">
          <i class="el-icon-warning"></i>
          <span>您确认要退出登录吗？</span>
          <span slot="footer" class="dialog-footer">
            <el-button class="yesbtn" @click="yesCallBack">确定</el-button>
            <el-button class="nobtn" @click="noCallBack">取消</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <div class="content">
      <el-menu
        class="el-menu-vertical-demo"
        :default-active="currentPath"
        @select="handleSelect"
        :collapse="isCollapse">
        <el-menu-item index="videos">
          <div class="menu-active"></div>
          <i class="menuicon iconfont icon-shipinwenzhenicon" style="font-size: 16px"></i>
          <span slot="title">视频问诊</span>
        </el-menu-item>
        <el-menu-item index="remoteRecipes">
          <div class="menu-active"></div>
          <i class="menuicon iconfont icon-yuanchengxufangicon"></i>
          <span slot="title">远程续方</span>
        </el-menu-item>
        <el-menu-item index="onlineRecipes">
          <div class="menu-active"></div>
          <i class="menuicon iconfont icon-zaixianchufangicon"></i>
          <span slot="title">在线处方</span>
        </el-menu-item>
        <el-menu-item index="doctors">
          <div class="menu-active"></div>
          <i class="menuicon iconfont icon-yishengguanliicon"></i>
          <span slot="title">医生管理</span>
        </el-menu-item>
      </el-menu>
      <div class="main">
        <router-view/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'App',
  data () {
    return {
      centerDialogVisible: false,
      isCollapse: false,
      user: '',
      doctor: '',
      firstName: ''
    }
  },
  computed: {
    currentPath: function () {
      return this.$route.path.split('/')[1];
    }
  },
  methods: {
    handlePanel () {
      this.isCollapse = !this.isCollapse;
    },
    handleSelect (key, keyPath) {
      this.$router.push({
        path: '/' +  key,
      })
    },
    logOut () {
      document.querySelector('#logoutForm').submit();
    },
    quit () {
      this.centerDialogVisible = true;
    },
    yesCallBack () {
      this.logOut()
    },
    noCallBack () {
      this.centerDialogVisible = false;
    }
  },
  mounted () {
    this.$store.dispatch('GET_DEVICES');

    this.$services.fetchUser()
    .then(res => {
      this.user = res.results.doctorDetail;
      this.doctor = this.user.doctorName;
      this.firstName = this.doctor.slice(0,1);
      this.$tools.setSessionStorage('user_details_data',this.user);
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "./assets/icon/iconfont.css";
  @import "@/style/common.scss";
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: middle;
    fill: currentColor;
    overflow: hidden;
  }
  #app {
    position: relative;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 64px;
      padding: 0 16px 0 27px;
      background-color: #00bdb1;
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      .header-left {
        display: flex;
        align-items: center;
        .collapseicon {
          cursor: pointer;
        }
        .logo {
          margin-left: 30px;
          width: 90px;
        }
        .name {
          margin-left: 20px;
          padding-left: 20px;
          border-left: 2px solid white;
          height: 23px;
          line-height: 23px;
          color: rgba(255, 255, 255, 1);
          font-size: 18px;
          text-align: left;
          font-family: PingFangSC-Regular;
        }
      }
      .header-right {
        display: flex;
        align-items: center;
        justify-content: center;
        .xiaoxi {
          margin-right: 22px;
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
        .user {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: rgba(0, 120, 114, 1);
          line-height: 20px;
          color: rgba(255, 255, 255, 1);
          font-size: 14px;
          font-family: PingFangSC-Regular;
          cursor: pointer;
        }
      }
    }
    .content {
      position: absolute;
      top: 64px;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 180px;
      }
      .el-menu {
        height: 100%;
        border-right: none!important;
        background-color: rgba(255,255,255,1);
        box-shadow: 0px 1px 4px 0px rgba(202,202,202,0.5);
        .el-menu-item {
          position: relative;
          height: 52px;
          color: rgba(51, 51, 51, 1);
          font-size: 14px;
          text-align: left;
          font-family: PingFangSC-Medium;
          .menu-active {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            display: none;
            width: 4px;
            height: 37.44px;
            background-color: rgba(6, 174, 166, 1);
            transition: all .2s;
          }
          .icon {
            font-size: 20px;
          }
          span {
            margin-left: 10px;
          }
        }
        .is-active {
          background-color: rgba(245,247,248,1);
          .menu-active {
            display: inline-block!important;
          }
        }
      }
      .menuicon {
        margin-left: 2px;
        color: #666666!important;
        font-size: 20px;
      }
      .main {
        overflow: auto;
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 10px 20px 20px;;
        background-color: #f4f5f6;
      }
    }
  }
</style>
