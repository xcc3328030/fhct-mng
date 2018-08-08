<template>
  <div class="agoraComponent">
    <div
      class="agora-title"
      v-drag="greet"
      id="drag">
      {{details.contact.name}}的视频问诊
    </div>
    <div class="agora-content" id="agora-content" @mousemove="hoverMouseMove()">
      <div class="agora-exhibition">
        <div class="agoraInvite" v-show="!videoCount">
          <span class="invite-word">正在等待对方加入视频诊间...</span>
          <div class="invite-button-wrap"><el-button type="info" @click="sendInvit()">发送邀请</el-button></div>
        </div>
        <div id="left-video-container">
        </div>
        <div class="agoraControllers-left" v-show="!isSpreaded">
          <el-tooltip content="挂断视频" placement="top" effect="light">
            <svg class="icon" aria-hidden="true" @click="endCall()">
              <use xlink:href="#icon-guaduan"></use>
            </svg>
          </el-tooltip>
          <el-tooltip content="全屏" placement="top" effect="light">
            <svg class="icon" aria-hidden="true" @click="changeScreen()" v-show="!screenFull">
              <use xlink:href="#icon-fangda"></use>
            </svg>
          </el-tooltip>
          <el-tooltip content="退出全屏" placement="top" effect="light">
            <svg class="icon" aria-hidden="true" @click="changeScreen()" v-show="screenFull">
              <use xlink:href="#icon-suoxiao"></use>
            </svg>
          </el-tooltip>
          <el-tooltip content="旁路推送" placement="top" effect="light">
            <svg class="icon" aria-hidden="true" @click="toggleStream()">
              <use xlink:href="#icon-qiehuan"></use>
            </svg>
          </el-tooltip>
          <el-tooltip content="旋转" placement="top" effect="light">
            <svg class="icon" aria-hidden="true" @click="rotate90()">
              <use xlink:href="#icon-xuanzhuan"></use>
            </svg>
          </el-tooltip>
        </div>
      </div>
      <div class="agora-list" :style="styleObject">
        <div id="right-video-container">
          <agora-item
            v-for="item in totalStreams"
            :itemStream="item"
            :key="item.getId()">
          </agora-item>
          <span
            class="spread-videos-wrapper"
            @click="spreadVideos()"
            v-show="!isSpreaded"
            :style="styleObject_spread">
            <div class="spread-videos-wrap">
              <img
                class="spread-videos"
                src="@/assets/image/btn_spreadVideos.png"
                alt="平铺视频">平铺视频
            </div>
          </span>
        </div>
        <div class="agoraControllers-right" v-show="isSpreaded">
          <el-tooltip content="挂断视频" placement="top" effect="light">
            <svg class="icon" aria-hidden="true" @click="endCall()">
              <use xlink:href="#icon-guaduan"></use>
            </svg>
          </el-tooltip>
          <el-tooltip content="全屏" placement="top" effect="light">
            <svg class="icon" aria-hidden="true" @click="changeScreen()" v-show="!screenFull">
              <use xlink:href="#icon-fangda"></use>
            </svg>
          </el-tooltip>
          <el-tooltip content="退出全屏" placement="top" effect="light">
            <svg class="icon" aria-hidden="true" @click="changeScreen()" v-show="screenFull">
              <use xlink:href="#icon-suoxiao"></use>
            </svg>
          </el-tooltip>
          <el-tooltip content="旁路推送" placement="top" effect="light">
            <svg class="icon" aria-hidden="true" @click="toggleStream()">
              <use xlink:href="#icon-qiehuan"></use>
            </svg>
          </el-tooltip>
          <el-tooltip content="返回列表" placement="top" effect="light">
            <svg class="icon" aria-hidden="true" @click="changeToList()">
              <use xlink:href="#icon-liebiao"></use>
            </svg>
          </el-tooltip>
        </div>
      </div>
      <div class="agora-content-hover" v-show="agoraContentHoverShow"></div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import agoraDefaultConfig from '@/services/agoraAPP'
import agoraItem from '@/components/agoraItem'
Vue.directive('drag',//自定义拖拽指令
    {bind:function (el, binding) {
            let oDiv = el;   //当前元素
            let self = this;  //上下文
            oDiv.onmousedown = function (e) {
             //鼠标按下，计算当前元素距离可视区的距离
                let disX = e.clientX - oDiv.parentNode.offsetLeft;
                let disY = e.clientY - oDiv.parentNode.offsetTop;
                document.onmousemove = function (e) {
                  //通过事件委托，计算移动的距离
                    let l = e.clientX - disX;
                    let t = e.clientY - disY;
                  //移动当前元素
                    oDiv.parentNode.style.left = l + 'px';
                    oDiv.parentNode.style.top = t + 'px';
                     //将此时的位置传出去
                    binding.value({x:e.pageX,y:e.pageY})
                };
                document.onmouseup = function (e) {
                    document.onmousemove = null;
                    document.onmouseup = null;
                 };
            };
        }
    }
);
export default {
  name: 'agoraComponent',
  props: ['details'],
  data () {
    return {
      ifInUse: false,
      localStream: '',
      remoteStream: '',
      remoteStreams: [],
      totalStreams: [],//包含本地流
      client: '',

      localStreamConfig: {
          'streamID': '',
          'audio': true,
          'video': true,
          'screen': false,
          'local': true,
          'cameraId': '',
      },

      videoCount: 0,//所有远程视频数量
      highOrLow: true,//默认大流
      agoraContentHoverShow: false,//悬浮3s
      timer: '',

      styleObject: {
        width: '197px',
        height: '788px'
      },
      styleObject_spread: {
        width: '197px',
        height: '197px'
      },

      element: '',
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
    }
  },
  watch: {
    isSpreaded: function(newVal, oldVal) {
      this.adjustStyleObject();
    },
    screenFull: function(newVal, oldVal) {
      this.adjustStyleObject();
      if(newVal){
        this.styleObject_spread = {
          width: this.screenHeight/4 + 'px',
          height: this.screenHeight/4 + 'px'
        }
      }else {
        this.styleObject_spread = {
          width: '197px',
          height: '197px'
        }
      }
    }
  },
  computed: mapState({
    camera: 'camera',
    currentStreamID: 'currentStreamID',
    isSpreaded: 'isSpreaded',
    screenFull: 'screenFull'
  }),
  methods: {
    greet () {

    },
    //挂断视频
    endCall () {
      this.$emit("handleEnd");

      let localStreamID = this.localStream.getId();
      this.localStream.close();
      $("#"+ localStreamID).remove();
      this.totalStreams.forEach((val,key) => {
          val.close();
          $("#"+val.getId()).remove();
      });
      this.client.unpublish(this.localStream);
      this.client.leave();
    },
    //平铺视频
    spreadVideos () {
      this.$store.commit('SET_ISSPREADED', true);
    },
    //发送邀请
    sendInvit () {
      this.$services.sendInvite (this.details.orderId)
      .then((res) => {
        if (res.success){
          this.$message({
            message: '已经通过微信向患者发送邀请',
            type: 'success'
          });
        }
      })
    },
    //更新所有远程视频数量
    updateVideoCount () {
      setTimeout(() => {
        this.videoCount = this.totalStreams.length - 1;
      })
    },
    //全屏or退出全屏
    changeScreen () {
      this.$store.commit('SET_SCREEN_FULL', !this.screenFull);
      this.screenFull ? this.fullScreen() : this.exitFullScreen();
    },
    //大小流
    toggleStream () {
      if(this.camera.length < 2) {
        this.$message({
          message: '没有其他输入设备！',
          type: 'warning'
        });
      }else {
          this.highOrLow = !this.highOrLow;
          let index = this.highOrLow ? 0 : 1;
          let x = this.localStream.getId();
          this.client.unpublish(this.localStream, err => console.log("Unpublish local stream failed" + err));
          this.localStream.close();
          $("#" + x).remove();
          this.localStream = '';
          this.totalStreams.pop();

          // =========================================================

          this.localStreamConfig['cameraId'] = this.camera[index].deviceId;
          this.localStream = AgoraRTC.createStream(this.localStreamConfig);
          this.localStream.setVideoProfile(agoraDefaultConfig.videoProfile);
          this.localStream.init(() => {
              this.client.publish(this.localStream,suc => console.log('suc'),err => console.log('err'));
              this.totalStreams.push(this.localStream);
          }, err => console.log(err));
      }
    },
    //旋转90度
    rotate90 () {
      if(this.currentStreamID != ''){
          let el = document.getElementsByClassName('currentStream')[0].children[1];
          let st = window.getComputedStyle(el, null);
          let tr = st.getPropertyValue("-webkit-transform") ||
                   st.getPropertyValue("-moz-transform") ||
                   st.getPropertyValue("-ms-transform") ||
                   st.getPropertyValue("-o-transform") ||
                   st.getPropertyValue("transform") ||
                   "FAIL";
          let scale = 1;
          let angle = 0;

          if(tr != 'none'){
              let values = tr.split('(')[1].split(')')[0].split(',');
              let a = values[0];
              let b = values[1];
              let c = values[2];
              let d = values[3];
              scale = Math.sqrt(a * a + b * b);

              let sin = b / scale;
              angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
          }else{
              scale = 1;
              angle = 0;
          }

          //modify scale
          if((angle / 180) % 1 === 0){
              //旋转
              if(this.screenFull){
                  scale = (this.screenWidth - this.screenHeight / 4) / this.screenHeight;
              }else{
                  scale = 3 / 4;
              }
          }else{
              //扶正
              if(this.screenFull){
                  scale = 1;
              }else{
                  scale = 1;
              }
          }

          //modify angle
          let targetDeg = angle - 90;

          el.style.transform = 'rotate('+targetDeg+'deg) scale('+scale+')';
      }
    },
    //返回列表
    changeToList () {
      this.$store.commit('SET_ISSPREADED', false);
      this.$store.commit('SET_CURRENT_STREAM_ID', this.totalStreams[0].getId());
    },
    onFullScreenChange () {
        let isFullScreen = document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || false;
        this.$store.commit('SET_SCREEN_FULL', isFullScreen);
    },
    //进入全屏
    fullScreen () {
        if(this.element.requestFullscreen) {
            this.element.requestFullscreen();
        } else if(this.element.mozRequestFullScreen) {
            this.element.mozRequestFullScreen();
        } else if(this.element.webkitRequestFullscreen) {
            this.element.webkitRequestFullscreen();
        } else if(this.element.msRequestFullscreen) {
            this.element.msRequestFullscreen();
        }
    },
    //退出全屏
    exitFullScreen () {
        if(document.exitFullscreen){
          document.exitFullscreen();
        }else if(document.mozCancelFullScreen){
          document.mozCancelFullScreen();
        }else if(document.webkitCancelFullScreen){
          document.webkitCancelFullScreen();
        }else if(document.msExitFullscreen){
          document.msExitFullscreen();
        }
    },
    //更新styleObject
    adjustStyleObject () {
      if(this.isSpreaded){//视频平铺
          if(this.screenFull){//进入全屏
              this.styleObject = {
                width: this.screenWidth + 'px',
                height: this.screenHeight + 'px'
              }
          }else {//退出全屏
              this.styleObject = {
                width: '788px',
                height: '788px'
              }
          }
      }else {//视频列表
          if(this.screenFull){//进入全屏
              this.styleObject = {
                width: this.screenHeight/4 + 'px',
                height: this.screenHeight + 'px'
              }
          }else {//退出全屏
              this.styleObject = {
                width: '197px',
                height: '788px'
              }
          }
      }
    },
    //鼠标悬停3秒
    hoverMouseMove () {
      if(this.agoraContentHoverShow){
          this.agoraContentHoverShow = false;
          return;
      }

      if(this.timer){
          clearTimeout(this.timer);
          this.timer = '';
      }

      this.timer = setTimeout(() => {
          this.agoraContentHoverShow = true;
      },3000)
    }
  },
  mounted () {
    //初始视频窗口定位
    let ele = document.getElementsByClassName('agoraComponent')[0];
    ele.style.top = window.innerHeight / 2 - 828 / 2 + 'px';
    ele.style.left = window.innerWidth / 2 - 788 / 2 + 'px';

    //全屏
    this.element = $("#agora-content")[0];
    this.element.onwebkitfullscreenchange = () => {
        this.onFullScreenChange();
    }
    this.element.onmozfullscreenchange = () => {
        this.onFullScreenChange();
    }
    this.element.onmsfullscreenchange = () => {
        this.onFullScreenChange();
    }

    //初始化agora
    this.client = AgoraRTC.createClient({mode: 'h264_interop'});
    this.client.init(agoraDefaultConfig.key,obj => console.log(obj));

    //检查摄像头
    this.client.on('error', evt => {
        if(err.reason == "ALREADY_IN_USE"){
            this.ifInUse = true;
        }
    });

    //对方离开房间
    this.client.on('peer-leave', evt => {
        if(evt.stream){
            evt.stream.stop();
            $("#"+evt.stream.getId()).remove();
        }

        this.totalStreams = this.totalStreams.filter(function(stream){
            return stream.getId() != evt.stream.getId()
        });

        this.updateVideoCount();

        //if remote stream leave from currentStream
        if(this.currentStreamID != '' && this.currentStreamID == evt.stream.getId()){
            if(this.totalStreams.length > 1){
                this.$store.commit('SET_CURRENT_STREAM_ID', this.totalStreams[0].getId());
            }else {
                this.$store.commit('SET_CURRENT_STREAM_ID', '');
            }
        }else {

        }
    });

    //对方离开房间
    this.client.on('stream-removed', evt => {
        evt.stream.stop();
        $("#"+evt.stream.getId()).remove();

        this.totalStreams = this.totalStreams.filter(function(stream){
            return stream.getId() != evt.stream.getId()
        });

        this.updateVideoCount();

        //if remote stream leave from currentStream
        if(this.currentStreamID != '' && this.currentStreamID == evt.stream.getId()){
            if(this.totalStreams.length > 1){
                this.$store.commit('SET_CURRENT_STREAM_ID', this.totalStreams[0].getId());
            }else {
                this.$store.commit('SET_CURRENT_STREAM_ID', '');
            }
        }else {

        }
    });

    //对方进入房间
    this.client.on('stream-added', evt => {
        this.client.subscribe(evt.stream,err => console.log(err))
    });

    //订阅到视频流
    this.client.on('stream-subscribed',evt => {
        /*
         * 统计是否有远程视频进行连线，并推入到第一个流的位置，更新总流数
         * 只有等待开诊状态，且在远程流进入后，才会发起start
         * 进行中状态不会发起start
         */
        if(this.details.orderStatus == 'WAITING_FOR_VISIT'){
          this.$emit("startCommunication")
        }
        evt.stream['remote'] = true;
        this.totalStreams.unshift(evt.stream);

        setTimeout(() => {
          this.updateVideoCount();
        },1000)

        //若此时无视频列表状态无主视频，则远端推入主视频
        if(this.currentStreamID == '' && !this.isSpreaded ){
          this.$store.commit('SET_CURRENT_STREAM_ID', evt.stream.getId());
        }
    });

    //本地进入房间
    if(!this.ifInUse){
        this.client.join(agoraDefaultConfig.key, this.details.orderId,0,(uid) => {
          this.localStreamConfig['streamID'] = uid;
          this.localStreamConfig['cameraId'] = this.camera[0].deviceId;
          this.localStream = AgoraRTC.createStream(this.localStreamConfig);
          this.localStream.setVideoProfile(agoraDefaultConfig.videoProfile);
          this.localStream.init(() => {
            this.client.publish(this.localStream,suc => console.log('suc'),err => console.log('err'));
            this.localStream['remote'] = false;
            this.totalStreams.push(this.localStream);
          }, err => console.log(err));
        });
    }else{
        this.$message({
          message: '摄像头已被其他设备占用，请关闭其他设备后重新刷新使用',
          type: 'warn',
          center: true
        });
    }
  },
  destroyed () {
    //归零
    this.$store.commit('SET_CURRENT_STREAM_ID', '');
    this.$store.commit('SET_ISSPREADED', false);
    this.$store.commit('SET_SCREEN_FULL', false);
  },
  components: {
    agoraItem
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss">
.agoraComponent {
  position: fixed;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  width: 788px;
  height: 828px;
  .agora-title {
    height: 40px;
    padding-left: 12px;
    display: flex;
    align-items: center;
    color: #ffffff;
    font-size: 14px;
    background-color: #004146;
    cursor: move;
    border-radius: 5px 5px 0 0;
  }
  .agora-content {
    position: relative;
    z-index: 1;
    display: flex;
    width: 100%;
    height: 788px;
    overflow: hidden;
    flex: 1;
    .agora-exhibition {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;
      flex: 1;
      background: black;
      .agoraInvite {
        position: absolute;
        top: 50%;
        transform: translateY(-60%);
        z-index: 3;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: #fff;
        user-select: none;
        .invite-word {
          line-height: 28px;
          color: rgba(255, 255, 255, 1);
          font-size: 20px;
          text-align: center;
          font-family: PingFangSC-Regular;
        }
        .invite-button-wrap {
          button {
            margin-top: 15px;
            width: 183px;
            height: 40px;
            border-radius: 4px;
            background-color: rgba(6, 174, 166, 1);
            border: 0.5px solid rgba(6, 174, 166, 1);
            span {
              line-height: 20px;
              color: rgba(255, 255, 255, 1);
              font-size: 14px;
              font-family: PingFangSC-Light;
            }
          }
        }
      }
      #left-video-container {
      }
      .agoraControllers-left {
        position: absolute;
        bottom: 18px;
        z-index: 3;
        margin: inherit !important;
        width: 415px;
        height: 60px;
        display: flex;
        justify-content: space-around;
        margin-bottom: 5px;
        .icon {
          opacity: 0.8;
          width: 60px!important;
          height: 60px!important;
          cursor: pointer;
        }
      }
    }
    .agora-list {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #404040;
      #right-video-container {
        position: relative;
        display: inline-block;
        width: 100%;
        height: 100%;
        transition: all 0.2s;
        .spread-videos-wrapper {
          position: relative;
          z-index: 2;
          display: inline-block;
          border: 1px solid white;
          overflow: hidden!important;
          cursor: pointer;
          background-color: #4b4b4b;
          .spread-videos-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            color: white;
            font-size: 14px;
            letter-spacing: 3px;
            cursor: pointer;
            .spread-videos {
              margin-bottom: 6px;
              width: 40px;
              height: 40px;
            }
          }
        }
      }
      .agoraControllers-right {
        position: absolute;
        z-index: 5;
        bottom: 18px;
        width: 400px;
        display: flex;
        justify-content: space-around;
        .icon {
          opacity: 0.8;
          width: 60px!important;
          height: 60px!important;
          cursor: pointer;
        }
      }
    }
    .agora-content-hover {
      position: absolute;
      z-index: 10;
      cursor: none;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
  }
}
</style>
