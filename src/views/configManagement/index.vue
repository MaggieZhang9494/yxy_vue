<template>
    <div>
        <v-content-head :headTitle="'message.menuName.configManagement'" :headTitlePath="{path:'/configManagement'}" @changGroup="changGroup" :headTooltip="$t('message.configManagement.tips1')"></v-content-head>
        <div class="module-wrapper" style="padding: 30px 29px 0 29px;">
            <el-table :data="configList" tooltip-effect="dark" v-loading="loading" class="search-table-content" style="padding-bottom: 20px;">
                <el-table-column v-for="head in configHead" :label="head.name" :key="head.enName" show-overflow-tooltip align="left">
                    <template slot-scope="scope">
                        <template v-if="head.enName!='operate'">
                            <template v-if="head.enName==='configKey'">
                                <span>{{scope.row[head.enName]}}</span>
                                <el-tooltip effect="dark" :content="scope.row['tips']" placement="top-start">
                                    <i class="el-icon-info contract-icon font-12"></i>
                                </el-tooltip>
                            </template>
                            <template v-else>
                                <span>{{scope.row[head.enName]}}</span>
                            </template>
                        </template>
                        <template v-else>
                            <el-button :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="modifyItemConfig(scope.row)">{{$t('message.common.modify')}}</el-button>
                            <el-tooltip effect="dark" placement="top-start">
                                <span slot="content">
                                    {{$t('message.configManagement.tips2')}}：</br>
                                    {{$t('message.configManagement.tips3')}}
                                    </br>
                                    {{$t('message.configManagement.tips4')}}
                                </span>
                                <i class="el-icon-info contract-icon font-12"></i>
                            </el-tooltip>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="$t('message.configManagement.modifyConfig')" :visible.sync="modifyDialogVisible" width="400px" v-if="modifyDialogVisible" center>
            <system-config @close="close" @modifySuccess="modifySuccess" :configKey="configkey"></system-config>
        </el-dialog>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import systemConfig from "./components/systemConfig";
import { getUserList, querySysConfig, querySysConfigList } from "@/util/api";
import Bus from "@/bus"
export default {
    name: 'ConfigManagement',

    components: {
        "v-content-head": contentHead,
        systemConfig
    },

    props: {
    },

    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            total: 0,
            disabled: false,
            loading: false,
            modifyDialogVisible: false,
            configForm: {
                adminRivateKey: '',
                configKey: '',
                configValue: '',
            },
            configkey: '',
            adminRivateKeyList: [],
            configList: [],
            configHead: [
                {
                    enName: "configKey",
                    name: this.$i18n.t('message.configManagement.configName')
                },
                {
                    enName: "configValue",
                    name: this.$i18n.t('message.configManagement.configValue')
                },
                {
                    enName: "operate",
                    name: this.$i18n.t('message.common.operate')
                }
            ],
            configKeyList: [],
            rules: {
                adminRivateKey: [
                    {
                        required: true,
                        message: this.$i18n.t('message.nodeManagement.chooseAdministratorAcc'),
                        trigger: "blur"
                    }
                ],
                configKey: [
                    {
                        required: true,
                        message: this.$i18n.t('message.configManagement.chooseConfigName'),
                        trigger: "blur"
                    }
                ],
                configValue: [
                    {
                        required: true,
                        message: this.$i18n.t('message.configManagement.inputConfig'),
                        trigger: "blur"
                    }
                ]
            }
        }
    },

    computed: {
    },
    beforeDestroy: function () {
        Bus.$off("changeGroup")
    },
    mounted() {
        Bus.$on("changeGroup", data => {
            this.changGroup(data)
        })
        if (localStorage.getItem("root") === "admin") {
            this.disabled = false
        } else {
            this.disabled = true
        }
        this.getUserData()
        this.getSysConfigList()
    },

    methods: {
        changGroup() {
            this.getUserData()
            this.getSysConfigList()
        },
        getSysConfigList() {
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                pageNumber: this.currentPage,
                pageSize: this.pageSize,
            }
            querySysConfigList(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        var list = res.data.data;
                        list.forEach(item => {
                            switch (item.configKey) {
                                case "tx_gas_limit":
                                    item.tips = this.$i18n.t('message.configManagement.bigLimit')
                                    break;

                                case "tx_count_limit":
                                    item.tips = this.$i18n.t('message.configManagement.bigNum')
                                    break;
                            }
                        })
                        this.configList = res.data.data;
                        this.total = res.data.totalCount;
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
        getUserData() {
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
                    } else {
                        this.$message({
                            type: "error",
                            message: this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en
                        });
                        this.$message.closeAll();
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
                    this.$message.closeAll();
                });
        },
        modifyConfig(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.suremodifyConfig()
                } else {
                    return false;
                }
            });
        },
        suremodifyConfig() {
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                configKey: this.configForm.configKey,
                configValue: this.configForm.configValue,
                fromAddress: this.configForm.adminRivateKey,
            }
            querySysConfig(reqData)
                .then(res => {
                    if (res.data.code === 0) {
                        this.getSysConfigList()
                        this.$message({
                            type: 'success',
                            message: this.$i18n.t('message.common.modifySucc')
                        })
                    } else {
                        this.$message({
                            type: "error",
                            message: this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en
                        });
                        this.$message.closeAll()
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
                    this.$message.closeAll()
                });
        },
        modifyItemConfig(item) {
            this.configkey = item.configKey;
            this.modifyDialogVisible = true;
        },
        close() {
            this.modifyDialogVisible = false
        },
        modifySuccess() {
            this.modifyDialogVisible = false
            this.getSysConfigList()
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.queryGetPermission();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.queryGetPermission();
        },
    }
}
</script>

<style scoped>
.demo-ruleForm {
    display: flex;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: -moz-flex;
}
.item-form {
    display: flex;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: -moz-flex;
    margin-left: 10px;
}
.item-form:first-child {
    margin-left: 0px;
}
.add-btn {
    margin-left: 10px;
}
.instructions {
    margin-bottom: 30px;
    padding: 10px 10px;
    color: #2e384d;
    border-radius: 10px;
    display: inline-block;
}

.search-table-content >>> th {
    background: #fafafa;
}
</style>
