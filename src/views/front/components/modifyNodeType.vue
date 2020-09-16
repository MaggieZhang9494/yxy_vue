<template>
    <div>
        <div class="commonline"></div>
        <el-form :model="modifyForm" :rules="rules" ref="modifyForm" :label-width="labelWidth" class="demo-ruleForm">
            <el-form-item :label="$t('message.nodeManagement.administratorAcc')" prop="adminRivateKey" style="width: 320px;">
                <el-select size="mini" v-model="modifyForm.adminRivateKey" :placeholder="$t('message.common.choose')">
                    <el-option v-for="item in adminRivateKeyList" :key="item.address" :label="item.userName" :value="item.address">
                        <span>{{item.userName}}</span>
                        <span class="font-12">{{item.address | splitString}}...</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('message.nodeManagement.nodeType')" prop="adminRivateKey" style="width: 320px;">
                <el-select size="mini" v-model="modifyForm.nodeType" :placeholder="$t('message.common.choose')">
                    <el-option v-for="item in nodeTypeList" :key="item.type" :label="item.name" :value="item.type">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="commonline"></div>
        <div class="sure-btn" style="margin-top:10px">
            <el-button @click="close">{{$t('message.common.cancel')}}</el-button>
            <el-button type="primary" :loading="loading" @click="submit('modifyForm')">{{$t('message.common.affirm')}}</el-button>
        </div>
    </div>
</template>

<script>
import { getUserList, consensusNodeId } from "@/util/api";
export default {
    name: 'ModifyNodeType',

    components: {
    },

    props: {
        modifyNode: {
            type: Object
        }
    },

    data() {
        return {
            loading: false,
            adminRivateKeyList: [],
            nodeTypeList: [
                {
                    type: 'observer',
                    name: this.$i18n.t('message.nodeManagement.nodeTypeLook')
                },
                {
                    type: 'sealer',
                    name: this.$i18n.t('message.nodeManagement.nodeTypeConsensus')
                },
                {
                    type: 'remove',
                    name: this.$i18n.t('message.nodeManagement.nodeTypeFree')
                },
            ],
            modifyForm: {
                adminRivateKey: '',
                nodeType: ''
            },
            rules: {
                adminRivateKey: [
                    {
                        required: true,
                        message: this.$i18n.t('message.nodeManagement.chooseAdministratorAcc'),
                        trigger: "blur"
                    }
                ],
                nodeType: [
                    {
                        required: true,
                        message: this.$i18n.t('message.nodeManagement.chooseNodeType'),
                        trigger: "blur"
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

    created() {
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
            this.$emit("nodeModifyClose");
        },
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.modifyNode.nodeType === 'sealer' && this.modifyForm.nodeType === 'observer') {
                        this.$confirm(this.$i18n.t('message.nodeManagement.nodeTypeLookHint'), this.$i18n.t('message.common.hint'), {
                            confirmButtonText: this.$i18n.t('message.common.affirm'),
                            cancelButtonText: this.$i18n.t('message.common.cancel'),
                            type: 'warning'
                        }).then(() => {
                            this.queryConsensusNodeId()
                        }).catch(() => {
                            console.log('close')
                        });
                    }else if((this.modifyNode.nodeType === 'sealer' && this.modifyForm.nodeType === 'remove') || (this.modifyNode.nodeType === 'observer' && this.modifyForm.nodeType === 'remove')){
                        this.$confirm(this.$i18n.t('message.nodeManagement.nodeTypeFreeHint'), this.$i18n.t('message.common.hint'), {
                            confirmButtonText: this.$i18n.t('message.common.affirm'),
                            cancelButtonText: this.$i18n.t('message.common.cancel'),
                            type: 'warning'
                        }).then(() => {
                            this.queryConsensusNodeId()
                        }).catch(() => {
                            console.log('close')
                        });
                    }else if((this.modifyNode.nodeType === 'observer' && this.modifyForm.nodeType === 'sealer') || (this.modifyNode.nodeType === 'remove' && this.modifyForm.nodeType === 'sealer')){
                        this.$confirm(this.$i18n.t('message.nodeManagement.nodeTypeConsensusHint'), this.$i18n.t('message.common.hint'), {
                            confirmButtonText: this.$i18n.t('message.common.affirm'),
                            cancelButtonText: this.$i18n.t('message.common.cancel'),
                            type: 'warning'
                        }).then(() => {
                            this.queryConsensusNodeId()
                        }).catch(() => {
                            console.log('close')
                        });
                    }else {
                        this.queryConsensusNodeId()
                    }
                    
                } else {
                    return false;
                }
            });

        },
        queryConsensusNodeId() {
            this.loading = true;
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                nodeType: this.modifyForm.nodeType,
                nodeId: this.modifyNode.nodeId,
                fromAddress: this.modifyForm.adminRivateKey,
            }
            consensusNodeId(reqData)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: this.$i18n.t('message.common.modifySucc')
                        })
                        this.$emit('nodeModifySuccess')
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
                        if (this.adminRivateKeyList.length) this.modifyForm.adminRivateKey = this.adminRivateKeyList[0]['address'];
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
.demo-ruleForm{
    position: relative;
    padding: 20px 0px 20px 20px;
    /* left: 20px; */
}
.sure-btn {
    position: relative;
    text-align: center;
    padding: 5px;
}
.sure-btn /deep/ .el-button {
    padding: 9px 16px;
}
</style>
