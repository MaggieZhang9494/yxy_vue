<template>
    <div style="po">
        <div class="commonline"></div>
        <!-- <div class="alertText">
            <span class="alertTextSpan">{{limitAlertText}}</span>
        </div> -->
        <div class="account-show-table">
            <el-table :data="accountList" max-height="500px" row-key="id" tooltip-effect="light" v-loading="loading">
                <el-table-column
                    :label="$t('message.accountManagement.account')"
                    align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.account}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    :label="$t('message.accountManagement.companyName')"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{(scope.row.business!=null && scope.row.business!=undefined) ?((scope.row.business.company_name!=null && scope.row.business.company_name!=undefined)?scope.row.business.company_name:""):""}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    :label="$t('message.accountManagement.USCC')"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{(scope.row.business!=null && scope.row.business!=undefined) ?((scope.row.business.social_credit_code!=null && scope.row.business.social_credit_code!=undefined)?scope.row.business.social_credit_code:""):""}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { getAssociatedAccountList } from "@/util/api";
import router from "@/router";
export default {
    name: "accountShowDialog",
    props: {
        accountShowOptions: {
            type: Object
        }
    },
    watch: {
        
    },
    data() {
        return {
            loading:false,
            accountList: [],
            limitNum:100,
            limitAlertText:"",
        };
    },
    created(){
        
    },
    mounted() {
        let _this = this;
        
        _this.getAssAccountList(_this.accountShowOptions.data.id);
    },
    methods: {
        getAssAccountList(params){
            let _this = this;
            _this.loading = true;
            getAssociatedAccountList(params).then(res => {
                _this.loading = false;
                if (res.data.code === 0) {
                    _this.accountList = res.data.data;
                } else {
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
                    });
                }
            })
            .catch(err => {
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
    }
};
</script>
<style scoped>
    .account-show-table{
        position: relative;
        margin: 15px 15px 15px 15px;
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
        margin-left: 25px;
        line-height: 40px;
        font-size: 12px;
    }
</style>
