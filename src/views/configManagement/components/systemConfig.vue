<template>
    <div>
        <div class="commonline"></div>
        <el-form :model="modifyForm" :rules="rules" ref="modifyForm" :label-width="labelWidth" class="demo-ruleForm">
            <el-form-item :label="$t('message.configManagement.configName')"  style="width: 320px;margin-top:10px">
                <span>{{configKey}}</span>
            </el-form-item>
            <el-form-item :label="$t('message.nodeManagement.administratorAcc')" prop="adminRivateKey" style="width: 320px;">
                <el-select size="mini" v-model="modifyForm.adminRivateKey" style="width: 210px;" :placeholder="$t('message.common.choose')">
                    <el-option v-for="item in adminRivateKeyList" :key="item.address" :label="item.userName" :value="item.address">
                        <span>{{item.userName}}</span>
                        <span class="font-12">{{item.address | splitString}}...</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('message.configManagement.configValue')" prop="configValue" style="width: 320px;margin-bottom:20px">
                <el-input size="mini" v-model.number="modifyForm.configValue" :placeholder="configKey ==='tx_gas_limit'? $t('message.configManagement.scope') : ''"></el-input>
            </el-form-item>
        </el-form>
        <div class="commonline"></div>
        <div class="sure-btn" style="margin-top:10px">
            <el-button size="mini" @click="close">{{$t('message.common.cancel')}}</el-button>
            <el-button size="mini" type="primary" :loading="loading" @click="submit('modifyForm')">{{$t('message.common.affirm')}}</el-button>
        </div>
    </div>
</template>

<script>
import { getUserList, querySysConfig } from "@/util/api";
export default {
    name: 'SystemConfig',

    components: {
    },

    props: {
        configKey: {
            type: String
        }
    },

    data() {
        return {
            loading: false,
            adminRivateKeyList: [],
            modifyForm: {
                adminRivateKey: '',
                configValue: ''
            },
            rules: {
                adminRivateKey: [
                    {
                        required: true,
                        message: this.$i18n.t('message.nodeManagement.chooseAdministratorAcc'),
                        trigger: "blur"
                    }
                ],
                configValue: [
                    {
                        required: true,
                        message: this.$i18n.t('message.configManagement.inputConfig'),
                        trigger: "blur"
                    },
                    {
                        type: 'number',
                        message: this.$i18n.t('message.configManagement.configNumber')
                    }
                ]
            },
            labelWidth:"110px",
        }
    },

    computed: {

    },

    watch: {

    },

    created(){
        if(localStorage.getItem("internationalization") == 'zh-cn'){ /* 中文版本 */
            this.labelWidth = "110px";
        }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
            this.labelWidth = "140px";
        }else{
            this.labelWidth = "110px";
        }
    },

    mounted() {
        this.getUserData()
    },

    methods: {
        close() {
            this.$emit("close");
        },
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.queryquerySysConfig()
                } else {
                    return false;
                }
            });

        },
        queryquerySysConfig() {
            this.loading = true;
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                configKey: this.configKey,
                configValue: this.modifyForm.configValue,
                fromAddress: this.modifyForm.adminRivateKey,
            }
            querySysConfig(reqData)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.$emit('modifySuccess')
                    } else {
                        this.$message({
                            type: "error",
                            message: this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en
                        });
                    }
                })
                .catch(err => {
                    this.loading = false;
                    let message = this.$i18n.t('message.common.systemError');
					if(err && err.data && err.data.code){
						message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
					}
					this.$message({
						type: "error",
						message: message
					});
                });
        },
        changeRivateKey(val) {
            this.adminRivateKey = val
        },
        getUserData: function () {
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                pageNumber: 1,
                pageSize: 1000
            };
            getUserList(reqData, {})
                .then(res => {
                    if (res.data.code === 0) {
                        this.adminRivateKeyList = [];
                        res.data.data.forEach(value => {
                            if (value.hasPk === 1) {
                                this.adminRivateKeyList.push(value);
                            }
                        });
                        if(this.adminRivateKeyList.length) this.modifyForm.adminRivateKey = this.adminRivateKeyList[0]['address'];
                    } else {
                        this.$message({
                            type: "error",
                            message: this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en
                        });
                    }
                })
                .catch(err => {
                    let message = this.$i18n.t('message.common.systemError');
					if(err && err.data && err.data.code){
						message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
					}
					this.$message({
						type: "error",
						message: message
					});
                });
        },
    }
}
</script>

<style scoped>
.sure-btn{
    text-align: center;
    padding: 5px 0px;
}
/* .sure-btn /deep/ .el-button {
    padding: 9px 16px;
} */
</style>
