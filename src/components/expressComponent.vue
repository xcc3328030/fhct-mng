<template>
    <div class="expressComponent">
        <el-popover
            popper-class="dispensing-wrap"
            placement="bottom-end"
            width="450"
            v-model="visible">
            <div class="dispensing-title-wrap">
                <span class="dispensing-title">填写发药信息</span>
            </div>
            <div class="dispensing-content">
                <div class="courier-company">
                    <span class="dispensing-pre">*</span>
                    <span class="dispensing-word">快递公司</span>
                    <el-select class="courier-company-select" v-model="expressName_select" placeholder="请选择快递公司">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </div>
                <div class="courier-number">
                    <span class="dispensing-pre">*</span>
                    <span class="dispensing-word">快递单号</span>
                    <el-input class="courier-number-input" v-model="expressId_input" placeholder="请输入快递单号"></el-input>
                </div>
            </div>
            <div class="dispensing-button-wrap">
                <div class="dispensing-button-confirm" @click="comfirmDispense()">确定</div>
                <div class="dispensing-button-cancel" @click="cancelDispense()">取消</div>
            </div>
            <div class="dispensing" slot="reference">发药</div>
        </el-popover>
    </div>
</template>

<script>
export default {
    name: 'expressComponent',
    props: ['data'],
    data() {
        return {
            loading: false,
            visible: false,
            options: [{
                value: '顺丰',
                label: '顺丰',
                disabled: false
            }, {
                value: '中通',
                label: '中通',
                disabled: true
            }, {
                value: '圆通',
                label: '圆通',
                disabled: true
            }, {
                value: '百世汇通',
                label: '百世汇通',
                disabled: true
            }, {
                value: '韵达',
                label: '韵达',
                disabled: true
            }],
            expressName_select: '顺丰',
            expressId_input: '',
        }
    },
    computed: {

    },
    methods: {
        //快递发药049958988205
        comfirmDispense() {

            if(this.expressId_input == ''){
                this.$message({
                    message: '未填写单号!',
                    type: 'warning',
                    center: true
                });
            }else{
                this.visible = false;
                let param = {
                    expressId: this.expressId_input,
                    expressName: this.expressName_select,
                    prescriptionId: this.data.prescriptionId,
                }
                this.$services.setExpressInfo(param)
                .then(res => {
                    if(res.state == 200){
                        this.$message({
                            message: '快递保存成功!',
                            type: 'success',
                            center: true
                        });
                    }else {
                        this.$message({
                            message: '快递保存失败!',
                            type: 'warning',
                            center: true
                        });
                    }

                    //更新处方
                    this.$emit("notifyTable");
                })
            }
        },
        //取消发药
        cancelDispense () {
            this.visible = false;
        }
    }
}
</script>

<style lang="scss">
.expressComponent {
    .dispensing {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 20px;
        width: 60px;
        height: 26px;
        background-color: rgba(255, 255, 255, 1);
        border: 0.5px solid rgba(6, 174, 166, 1);
        line-height: 17px;
        color: rgba(6, 174, 166, 1);
        font-size: 12px;
        text-align: left;
        font-family: PingFangSC-Light;
        cursor: pointer;
        &:hover {
            color: #20a0ff;
            border-color: #20a0ff;
        }
    }
}
</style>
