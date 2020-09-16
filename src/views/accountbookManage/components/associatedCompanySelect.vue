<template>
    <div style="po">
        <div class="commonline"></div>
        <div class="alertText">
            <span class="alertTextSpan"><span style="color:red;">*</span>{{alertText}}</span>
        </div>
        <div class="account-select-table">
            <el-table ref="multipleTable" :select-on-indeterminate="true" :data="accountList" row-key="account" max-height="500px" tooltip-effect="light" v-loading="loading" @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    :label="$t('message.accountManagement.account')"
                    align="left">
                    <template slot-scope="scope">
                        <span>{{scope.row["account"]}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="left"
                    :label="$t('message.accountManagement.companyName')"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{(scope.row.business!=null && scope.row.business!=undefined) ?((scope.row.business.company_name!=null && scope.row.business.company_name!=undefined)?scope.row.business.company_name:""):""}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="left"
                    :label="$t('message.accountManagement.USCC')"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{(scope.row.business!=null && scope.row.business!=undefined) ?((scope.row.business.social_credit_code!=null && scope.row.business.social_credit_code!=undefined)?scope.row.business.social_credit_code:""):""}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="commonline"></div>
        <div class="dialog-footer">
            <el-button @click="modelClose">{{$t('message.common.cancel')}}</el-button>
            <el-button type="primary" @click="submit()" :loading="submitLoading">{{$t('message.common.confirm')}}</el-button>
        </div>
    </div>
</template>

<script>
import { getAssociatedAccountList, getAllAccountList, groupBindAccount } from "@/util/api";
import router from "@/router";
export default {
    name: "accountSelectDialog",
    props: {
        accountSelectOptions: {
            type: Object
        }
    },
    watch: {
        
    },
    data() {
        return {
            loading:false,
            submitLoading:false,
            accountList: [],
            selectAccountList:[],
            alertText:this.$i18n.t('message.accountbookManage.alertAccountText'),
        };
    },
    created(){
        
    },
    mounted() {
        let _this = this;
        
        _this.exeMutilReq();
    },
    methods: {
        /**
         * 执行多个请求
         * 1、获取某一群组账本关联帐号列表
         * 2、获取所有帐号列表
         */
        exeMutilReq(){
            let _this = this;

            _this.loading = true;
            Promise.all([getAllAccountList({}), getAssociatedAccountList(_this.accountSelectOptions.data.id)]).then(res=>{
                _this.loading = false;
                if(res && res.length==2){
                    if (res[0].data.code === 0) {
                        _this.accountList = res[0].data.data;
                    } else {
                        let message = res[0].data.message?res[0].data.message:this.errcode.errCode.isCN?this.errcode.errCode[res[0].data.code].cn:this.errcode.errCode[res[0].data.code].en;
                        this.$message({
                            type: "error",
                            message: message
                        });
                    }

                    if (res[1].data.code === 0) {
                         res[1].data.data.forEach(item=>{
                            for (let i = 0; i < _this.accountList.length; i++) {
                                if (_this.accountList[i].account == item.account) {
                                    _this.selectAccountList.push(_this.accountList[i]);
                                    break;
                                }
                            }
                        });
                        setTimeout(() => {
                            _this.toggleSelection(_this.selectAccountList);
                        }, 100);
                    } else {
                        let message = res[1].data.message?res[1].data.message:this.errcode.errCode.isCN?this.errcode.errCode[res[1].data.code].cn:this.errcode.errCode[res[1].data.code].en;
                        this.$message({
                            type: "error",
                            message: message
                        });
                    }
                }
            }).catch(err => {
                _this.loading = false;
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
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.selectAccountList = val;
        },
        modelClose: function() {
            this.$emit("close", false);
        },
        submit(){
            let _this = this;

            // if (_this.selectAccountList.length<=0) {
            //     this.$message({
            //             type: "warn",
            //             message: this.$i18n.t('message.accountbookManage.alertAccountText')
            //         });
            //     return ;
            // }
            
            //获取绑定账号参数
            let accountArray = [];
            _this.selectAccountList.forEach(element => {
                accountArray.push(element.account);
            });
            let accountsStr = accountArray.join();

            this.$confirm(this.$i18n.t('message.common.affirmSubmit'),this.$i18n.t('message.common.submit'), {
                confirmButtonText: this.$i18n.t('message.common.affirm'),
                cancelButtonText: this.$i18n.t('message.common.cancel'),
            })
            .then(() => {
                _this.submitLoading = true;
                groupBindAccount(_this.accountSelectOptions.data.id, {accounts:accountsStr}).then(res => {
                    _this.submitLoading = false;
                    if (res.data.code === 0) {
                        this.modelClose();
                        this.$emit("success");
                    } else {
                        let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                        this.$message({
                            type: "error",
                            message: message
                        });
                    }
                })
                .catch(err => {
                    _this.submitLoading = false;
                    let message = this.$i18n.t('message.common.systemError');
                    if(err && err.data && err.data.code){
                        message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
                    }
                    this.$message({
                        type: "error",
                        message: message
                    });
                });
            })
            .catch(() => {
                
            });
        },
    }
};
</script>
<style scoped>
    .account-select-table{
        position: relative;
        margin: 0px 15px 15px 15px;
        height: 500px;
    }
    .alertText{
        position: relative;
        text-align: left;
        width: 100%;
        height: 40px;
    }
    .alertTextSpan{
        position: relative;
        text-align: center;
        margin-left: 15px;
        line-height: 40px;
        font-size: 12px;
    }
    .dialog-footer {
        text-align: center;
        margin-right: 20px;
        padding-bottom: 0px;
        padding-top: 10px;
    }
</style>
