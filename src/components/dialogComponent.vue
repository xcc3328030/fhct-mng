<template>
    <transition name="fade">
        <div class="dialogComponent" v-if="openDialog">
            <div class="dialog-center">
                <div class="dialog-title">
                    <div class="dialog-title-left">
                        邀请其他专家
                    </div>
                    <div class="dialog-title-right">
                        <i class="el-icon-close" @click="closeDialog"></i>
                    </div>
                </div>
                <div class="dialog-main">
                    <div class="dialog-main-left">

                    </div>
                    <div class="dialog-main-right">

                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'dialogComponent',
    props: [
        'openDialog'
    ],
    data() {
        return {

        }
    },
    computed: {

    },
    methods: {
        closeDialog () {
            this.$emit('closeDialog')
        }
    }
}
</script>

<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.dialogComponent {
    position: absolute;
    z-index: 2;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.3);
    .dialog-center {
        width: 720px;
        height: 357px;
        border-radius: 3px;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
        .dialog-title {
            display: flex;
            justify-content: space-between;
            padding: 20px;
            .dialog-title-left {
                line-height: 22px;
                color: rgba(51, 51, 51, 1);
                font-size: 16px;
                text-align: left;
                font-family: PingFangSC-Medium;
            }
            .dialog-title-right {
                i {
                    color: #979797;
                    cursor: pointer;
                    &:hover {
                        color: #409eff!important;
                    }
                }
            }
        }
        .dialog-main {
            .dialog-main-left {

            }
            .dialog-main-right {

            }
        }
    }
}
</style>