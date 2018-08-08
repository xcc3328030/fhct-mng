<template>
  <span
    class="agoraItem"
    :class="{currentStream: itemStream.getId() == currentStreamID, localStream: !itemStream.remote}"
    :style="styleObject"
    :id="itemStream.getId()"
    :data-stream-id="itemStream.getId()"
    @click="selectVideo">
    <div class="change-current-wrap" >
      <img class="change-current" src="@/assets/image/btn_changeCurrent.png" alt="" />切换成主视频
    </div>
  </span>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'agoraItem',
  props: ['itemStream'],
  data () {
    return {
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      styleObject: {
        width: '197px',
        height: '197px',
      }
    }
  },
  watch: {
    currentStreamID: function(newVal, oldVal) {
      this.adjustStyleObject();
    },
    isSpreaded: function(newVal, oldVal) {
      this.adjustStyleObject();
    },
    screenFull: function(newVal, oldVal) {
      this.adjustStyleObject();
    }
  },
  computed: mapState({
    currentStreamID: 'currentStreamID',
    isSpreaded: 'isSpreaded',
    screenFull: 'screenFull'
  }),
  methods: {
    //选中作为主视频
    selectVideo (event) {
      this.$store.commit('SET_CURRENT_STREAM_ID', event.currentTarget.getAttribute("id"));
      this.$store.commit('SET_ISSPREADED', false);
    },
    //更新styleObject
    adjustStyleObject () {
      if(this.isSpreaded){//视频平铺
          if(this.screenFull){//进入全屏
              this.styleObject = {
                width: this.screenWidth/2 + 'px',
                height: this.screenHeight/2 + 'px'
              }
          }else {//退出全屏
              this.styleObject = {
                width: '394px',
                height: '394px'
              }
          }
      }else {//视频列表
          if(this.screenFull){//进入全屏
              if(this.currentStreamID == this.itemStream.getId()){//主视频
                  this.styleObject = {
                    width: this.screenWidth - this.screenHeight/4 + 'px',
                    height: this.screenHeight + 'px'
                  }
              }else {//非主视频
                  this.styleObject = {
                    width: this.screenHeight/4 + 'px',
                    height: this.screenHeight/4 + 'px'
                  }
              }
          }else {//退出全屏
              if(this.currentStreamID == this.itemStream.getId()){//主视频
                  this.styleObject = {
                    width: '591px',
                    height: '788px'
                  }
              }else {//非主视频
                  this.styleObject = {
                    width: '197px',
                    height: '197px'
                  }
              }
          }
      }
      this.adjustScale();
    },
    adjustScale () {
        let el = document.getElementById(this.itemStream.getId()).children[1];
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
        }

        //modify scale
        if(angle % 180 != 0 && this.currentStreamID == this.itemStream.getId()){
            console.log('>>>')
            if(this.isSpreaded){
                if(this.screenFull){
                    scale = this.screenWidth / this.screenHeight;
                }else {
                    scale = 1
                }
            }else {
                if(this.screenFull){
                    scale = (this.screenWidth - this.screenHeight / 4) / this.screenHeight;
                }else {
                    scale = 3 / 4;
                }
            }
        }else{
            scale = 1;
        }
        console.log(scale)
        el.style.transform = 'rotate('+angle+'deg) scale('+scale+')';
    }
  },
  mounted () {
    //播放视频
    this.itemStream.play(this.itemStream.getId());
    this.adjustStyleObject();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss">
.agoraItem {
  position: relative;
  z-index: 2;
  display: inline-block;
  border: 1px solid white;
  overflow: hidden!important;
  vertical-align: top;
  cursor: pointer;
  div {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .change-current-wrap {
    position: absolute;
    z-index: 2!important;
    width: 100%;
    height: 100%;
    display: none;
    color: white;
    background-color: rgba(161,161,161,0.3);
    font-size: 14px;
    letter-spacing: 3px;
    .change-current {
      margin-bottom: 6px;
      width: 40px;
      height: 40px;
    }
  }
  &:hover {
    .change-current-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
}
.currentStream {
  transition: all 0.2s;
  cursor: auto!important;
  position: absolute;
  z-index: 1;
  height: 100%;
  top: 0;
  right: 100%;
  border-style: none!important;
  .change-current-wrap {
    display: none!important;
  }
}
.localStream {
  transform: scaleX(-1);
}
</style>
