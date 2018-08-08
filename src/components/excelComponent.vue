<template>
    <transition name="fade">
        <div class="excelComponent" v-if="openDialog">
            <div class="excel-center" v-loading="loading">
                <div class="excel-title">
                    <div class="excel-title-left">
                        时间选择
                    </div>
                    <div class="excel-title-right">
                        <i class="el-icon-close" @click="closeDialog"></i>
                    </div>
                </div>
                <div class="excel-main">
                    <div class="fast-select-wrap">
                        <div class="fast-select">快速选择</div>
                        <el-radio-group v-model="fast_radio" @change="handleRadio()">
                            <el-radio :label="1">近一天</el-radio>
                            <el-radio :label="2">近一周</el-radio>
                            <el-radio :label="3">近一月</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="accurate-select-wrap">
                        <div class="accurate-select">时间区间</div>
                        <el-date-picker
                            @change="handlePicker()"
                            v-model="accurate_picker"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="excel-bottom">
                    <div class="excel-bottom-export" @click="handleExport()">导出</div>
                    <div class="excel-bottom-cancel" @click="handleCancel()">取消</div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'excelComponent',
    props: {
      openDialog: {
        type: Boolean,
        default: false
      },
      input_online: {
        type: String,
        default: ''
      }
    },
    data() {
        return {
            loading: false,
            fast_radio: 1,
            accurate_picker: '',
            details: [],
            startDay: '',
            endDay: '',
            statusMap: {
                'WAITING_FOR_PAY': '等待患者支付',
                'WAITING_FOR_DELIVERY': '等待发货',
                'WAITING_FOR_RECEIPT': '等待收货',
                'SUCCEED': '完成',
                'COMPLETED': '已结束'
            },
        }
    },
    methods: {
        closeDialog () {
            this.$emit('closeDialog')
        },
        //单选框事件
        handleRadio () {
            this.accurate_picker = '';
            this.getFormatTime_fast();
        },
        //事件选择器事件
        handlePicker () {
            this.fast_radio = 0;
            this.getFormatTime_accurate();
        },
        handleExport () {
            this.loading = true;
            let param = {
                'hospitalId_must_match': this.$tools.getSessionStorage('user_details_data').hospitalId,
                'contact.name_should_match': this.input_online || undefined,
                // 'doctorHeterogeneousDO.doctorName_should_match': this.input_online || undefined,
                'createTime_must_range_gte': this.startDay + " 00:00:00",
                'createTime_must_range_lte': this.endDay + " 23:59:59",
                'page': 1,
                'size': 10000,
            };
            this.$services.fetchOnlineList(param)
            .then(res => {
                this.loading = false;
                this.details = res.results;
                this.export2Excel();
            })
        },
        handleCancel () {
            this.$emit('closeDialog')
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => {
                return filterVal.map(j => {
                    if(j === 'prescriptionStatus'){
                        return this.statusMap[v[j]];
                    }else {
                        return v[j]
                    }
                })
            })
        },
        export2Excel () {
          const { export_json_to_excel } = require('../../static/vendor/Export2Excel');
          const tHeader = ['处方编号','状态','开具时间','患者姓名','开药医生','处方金额'];
          const filterVal = ['prescriptionId', 'prescriptionStatus', 'createTime', 'medicineDoctor', 'contactName', 'totalFee'];
          const list = this.details;
          if (list.length != 0) {
              const data = this.formatJson(filterVal, list);
              export_json_to_excel(tHeader, data, '在线处方列表');
          } else {
            this.$message({
              message: '无数据导出！',
              type: 'warning',
              center: true
            })
          }
        },
        getFormatTime_fast () {
            this.endDay = this.getFormatDate(new Date(new Date().getTime()));
            switch(this.fast_radio){
                case 1: this.startDay = this.getFormatDate(new Date(new Date().getTime()-1000*60*60*24*1)); break;
                case 2: this.startDay = this.getFormatDate(new Date(new Date().getTime()-1000*60*60*24*7)); break;
                case 3: this.startDay = this.getFormatDate(new Date(new Date().getTime()-1000*60*60*24*30)); break;
                default: break;
            }
        },
        getFormatTime_accurate () {
            this.startDay = this.accurate_picker[0];
            this.endDay = this.accurate_picker[1];
        },
        getFormatDate (day) {
            let y = day.getFullYear();
            let m = day.getMonth()+1;
            let d = day.getDate();
            let theDate = y+'-'+m+'-'+d;
            return theDate;
        }
    },
    mounted () {
      this.handleRadio()
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
.excelComponent {
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
    .excel-center {
        width: 460px;
        height: 220px;
        padding: 15px 20px 20px;
        border-radius: 3px;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
        .excel-title {
            display: flex;
            justify-content: space-between;
            .excel-title-left {
                line-height: 22px;
                color: rgba(51, 51, 51, 1);
                font-size: 16px;
                text-align: left;
                font-family: PingFangSC-Medium;
            }
            .excel-title-right {
                i {
                    color: #979797;
                    cursor: pointer;
                    &:hover {
                        color: #409eff!important;
                    }
                }
            }
        }
        .excel-main {
            margin-top: 20px;
            .fast-select-wrap {
                display: flex;
                align-items: center;
                .fast-select {
                    height: 20px;
                    line-height: 20px;
                    color: rgba(51, 51, 51, 1);
                    font-size: 14px;
                    text-align: left;
                    font-family: PingFangSC-Regular;
                }
                .el-radio-group {
                    padding-left: 10px;
                    padding-right: 15px;
                    flex: auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 20px;
                    .el-radio__label {
                        line-height: 20px;
                        color: rgba(102, 102, 102, 1);
                        font-size: 14px;
                        text-align: left;
                        font-family: PingFangSC-Regular;
                    }
                }
            }
            .accurate-select-wrap {
                display: flex;
                align-items: center;
                margin-top: 28px;
                .accurate-select {
                    height: 20px;
                    line-height: 20px;
                    color: rgba(51, 51, 51, 1);
                    font-size: 14px;
                    text-align: left;
                    font-family: PingFangSC-Regular;
                }
                .el-date-editor {
                    margin-left: 10px;
                    height: 36px;
                    .el-range-separator {
                        padding: 0 2px!important;
                    }
                }
            }
        }
        .excel-bottom {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            .excel-bottom-export {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 90px;
                height: 30px;
                background-color: rgba(6, 174, 166, 1);
                border: 0.5px solid rgba(6, 174, 166, 1);
                line-height: 20px;
                color: rgba(255, 255, 255, 1);
                font-size: 14px;
                text-align: left;
                font-family: PingFangSC-Light;
                cursor: pointer;
            }
            .excel-bottom-cancel {
                margin-left: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 90px;
                height: 30px;
                background-color: rgba(255, 255, 255, 1);
                border: 0.5px solid rgba(6, 174, 166, 1);
                line-height: 20px;
                color: rgba(6, 174, 166, 1);
                font-size: 14px;
                text-align: left;
                font-family: PingFangSC-Light;
                cursor: pointer;
            }
        }
    }
}
</style>
