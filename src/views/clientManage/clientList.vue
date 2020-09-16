<template>
    <div class="client-wrapper">
        <content-head :headTitle="'message.menuName.clientManagement'" :headTitlePath="{path:'/clientList'}"></content-head>
        <div class="module-wrapper">
            <div class="addClient">
				<div class="search-item">
                    <span>{{$t('message.accountManagement.companyName')}}：</span>
                    <el-input
                        size="mini"
                        class="inputStyle"
                        :placeholder="$t('message.accountManagement.companyNameInput')"
                        v-model="searchKeyCompany"
                        clearable>
                    </el-input>
                </div>
				<div class="search-item">
                    <span>{{$t('message.accountManagement.USCC')}}：</span>
                    <el-input
                        size="mini"
                        class="inputStyle"
                        :placeholder="$t('message.accountManagement.USCCInput')"
                        v-model="searchKeyUscc"
                        clearable>
                    </el-input>
                </div>
                <div style="display: inline-block;float: right;">
                    <el-button type="primary" size="small" icon="el-icon-plus" @click="creatClient">{{$t('message.accountManagement.add')}}</el-button>
                </div>
                <div style="display: inline-block;float: right;margin-right: 15px;">
                    <el-button type="primary" size="small" icon="el-icon-search" @click="searchClient">{{$t('message.accountManagement.search')}}</el-button>
                </div>
            </div>
            <div class="client-table">
                <el-table :data="clientList" tooltip-effect="light" v-loading="loading">
                    <el-table-column
                        align="center"
                        :label="$t('message.businessSearch.number')"
                        :width="numberWidth">
                        <template slot-scope="scope">
                            <span>{{scope.row['number']}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="head in clientHeader" :min-width="head.columnWidth" :label="head.name" :key="head.enName" show-overflow-tooltip :align="(head.enName =='seal_show' || head.enName =='business_license_show')?'center':'left'">
                        <template slot-scope="scope">
                            <!-- <template v-if="head.enName =='status'">
                                <span v-if="scope.row[head.enName]==1">{{'更新密码'}}</span>
                                <span v-else-if="scope.row[head.enName]==2">{{'正常'}}</span>
                                <span v-else>{{'不正常'}}</span>
                            </template>
                            <template v-else>
                                <span>{{scope.row[head.enName]}}</span>
                            </template> -->
							<!-- @click="touchLicensePreview" -->
							<el-image 
								v-if="head.enName =='seal_show' || head.enName =='business_license_show' "
								style="position: relative;width:30px;height:30px;top: 3px;border-radius: 0px;"
								fit="cover"
								:src="scope.row[head.enName]">
								<span slot="error"></span>
								<span slot="placeholder"></span>
								<!-- <img slot="error" width="30px" height="30px" src="../../../static/image/default.png"/>
								<img slot="placeholder" width="30px" height="30px" src="../../../static/image/default.png"/> -->
							</el-image>
                            <span v-else>{{scope.row[head.enName]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        :label="$t('message.common.operate')"
                        :width="operateWidth"
                        align="left">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="modifyClient(scope.row,'modify')"  style="color:#1585FF">{{$t('message.common.edit')}}</el-button>
                            <el-button type="text" size="small" @click="deleteClient(scope.row,'delete')" style="color:#1585FF">{{$t('message.common.delete')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>

                <el-dialog :visible.sync="clientDialogVisible" :title="clientDialogTitle" width="800px" :append-to-body="true" :center="true" class="dialog-wrapper" v-if="clientDialogVisible">
                    <v-client-dialog :clientDialogOptions="clientDialogOptions" @success="success" @close="close"></v-client-dialog>
                </el-dialog>
            </div>

        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import { getClientList, deleteClient, erp_wxBind, erp_wxUnbind } from "@/util/api";
import clientDialog from "./components/clientDialog";
import Bus from "@/bus"
export default {
    name: "clientList",
    components: {
        contentHead,
        "v-client-dialog":clientDialog,
    },
    data() {
        return {
            clientName: "",
            loading: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            headSubTitle:"",
            //搜索条件
            searchKeyUscc:"",
            searchKeyCompany:"",
            //客户信息对话框变量
            clientDialogVisible: false,
            clientDialogTitle: '',
            clientDialogOptions: {},
            clientHeader: [
                {
                    enName: "company_name",
                    name: this.$i18n.t('message.accountManagement.companyCNName')
                },
                {
                    enName: "company_name_en",
                    name: this.$i18n.t('message.accountManagement.companyENName')
                },
                {
                    enName: "social_credit_code",
                    name: this.$i18n.t('message.accountManagement.USCC')
                },
                {
                    enName: "business_address",
                    name: this.$i18n.t('message.accountManagement.businessAddress')
                },
                {
                    enName: "business_license_show",
                    name: this.$i18n.t('message.accountManagement.businessLicense')
                },
                {
                    enName: "seal_show",
                    name: this.$i18n.t('message.accountManagement.blockchainSeal')
                },
                {
                    enName: "create_er",
                    name: this.$i18n.t('message.accountManagement.creator')
                },
                {
                    enName: "created_at",
                    name: this.$i18n.t('message.accountManagement.createTime')
                },
                {
                    enName: "updated_at",
                    name: this.$i18n.t('message.accountManagement.updateTime')
                }
            ],
            //列表数组
            clientList: [
                // {
                //     account: "帐号",
                //     nick: "姓名",
                //     accountPwd:"null",
                //     roleId:"角色id",
                //     roleName:"角色名称",
                //     roleNameZh:"角色中文名",
                //     loginFailTime:"登录失败时间",
                //     accountStatus:"帐号状态", 
                //     description:"描述",
                //     created_at:"创建时间",
                //     member_level: "会员等级",
                //     company_name: "公司名称",
                //     social_credit_code: "统一社会信用代码",
                //     business_address: "公司营业地址",
                //     industry: "行业",
                //     dept: "部门",
                //     title: "职务",
                //     work_tel: "工作电话",
                //     cell_phone_number: "手机号",
                //     email: "邮件地址",
                //     create_er: "创建者",
                //     updated_at: "更新时间",
                //     state: "0",
                //     state_show:"启用"
                //     business_license:"营业执照接口返回的 相对path"
                //     business_license_show:"营业执照接口返回的 全path"
                // }
            ],

            //列表视图对应列的宽度
            numberWidth:50,//序号
            accountWidth:60,//帐号
            nameWidth:100,//姓名
            operateWidth:100,//操作
        };
    },
    created(){

    },
    beforeDestroy: function () {
        Bus.$off("changeGroup")
    },
    mounted: function() {
        Bus.$on("changeGroup", data => {
            this.changGroup(data)
        })
        this.dealZH_EN();
        this.dealColumWidth();

        this.getClientList();
    },
    methods: {
        /**
         * 处理中英文数据
         */
        dealZH_EN(){
            if(localStorage.getItem("internationalization") == 'zh-cn'){ /* 中文版本 */
                this.numberWidth=50;
                this.accountWidth=60;
                this.nameWidth=100;
                this.operateWidth=100;
            }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
                this.numberWidth=50;
                this.accountWidth=80;
                this.nameWidth=100;
                this.operateWidth=120;
            }else{
                this.numberWidth=50;
                this.accountWidth=60;
                this.nameWidth=100;
                this.operateWidth=150;
            }
        },
        //处理每列显示宽度
        dealColumWidth(){
            let _this = this;
            _this.clientHeader.map(item=>{
                //accountHeader,将columnWidth:写入每个对象中
                item.columnWidth = '100px';

                if(localStorage.getItem("internationalization") == 'zh-cn'){ /* 中文版本 */
                    if(item.enName=='social_credit_code' ||  item.enName=='company_name' ||
                    item.enName=='business_address' || item.enName=='company_name_en' ||
                    item.enName=='created_at' || item.enName=='updated_at'){
                        item.columnWidth = '160px';
                    }
                }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
                    if(item.enName=='social_credit_code' ||
                    item.enName=='business_address' ||
                    item.enName=='created_at' || item.enName=='updated_at'){
                        item.columnWidth = '150px';
                    } else if(item.enName=='company_name' ||  item.enName=='company_name_en'){ //中英文名称
                        item.columnWidth = '170px';
                    }else if(item.enName=='business_license_show'){ //企业营业执照
                        item.columnWidth = '150px';
                    } else if(item.enName=='seal_show'){ //区块链存证章
                        item.columnWidth = '200px';
                    }
                }
            })
        },
        changGroup(val){
            this.getClientList();
        },
        //获取搜索条件，输出查询参数
        getSearchParams(){
            let param = {
                pageNumber: this.currentPage,
                pageSize: this.pageSize
            };
            if(!this.isNullData(this.searchKeyUscc)){
                param.search_social_credit_code = this.searchKeyUscc;
            }
            if(!this.isNullData(this.searchKeyCompany)){
                param.search_company = this.searchKeyCompany;
            }

            return param;
        },
        success(){
            this.getClientList()
        },
        close(val){
            this.clientDialogVisible = val
        },
        //获取帐号列表
        getClientList() {
            if (this.isNullData(localStorage.getItem("groupId"))) {
                return;
            }
            this.loading = true;
            let param = this.getSearchParams();
            let reqQuery = {};
            getClientList(param, reqQuery).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    let listArr = res.data.data.data || [];
                    this.clientList = listArr.map((item,index)=>{
                        item.number = (this.currentPage-1)*this.pageSize+index+1;
                        return item;
                    })
                    this.total = res.data.data.total;
                } else {
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
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
        handleSizeChange: function(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getClientList();
        },
        handleCurrentChange: function(val) {
            this.currentPage = val;
            this.getClientList();
        },
        creatClient(){
            this.clientDialogVisible = true
            this.clientDialogTitle = this.$i18n.t('message.accountManagement.addClient')
            this.clientDialogOptions = {
                type:'create',
                data: {
                    account: '',
                    role: ''
                }
            }
        },
        searchClient(){
            this.currentPage = 1;
            this.pageSize = 10;
            this.total = 0;
            this.clientList = [];
            this.getClientList();
        },
        resetPwd(val, type){
            this.clientDialogOptions = {
                type: type,
                data: val
            }
            this.resetDialogVisible = true
        },
        deleteClient(val, type) {
            this.$confirm(this.$i18n.t('message.accountManagement.deleteClientAlert'), this.$i18n.t('message.accountManagement.deleteClient'), {
                confirmButtonText: this.$i18n.t('message.common.confirm'),
                cancelButtonText: this.$i18n.t('message.common.cancel'),
                type: 'warning',
            })
            .then(_ => {
                this.loading = true;
                let reqData = {
                    customId:val.id,
                };
                let reqQuery = {};
                deleteClient(reqData,reqQuery).then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
						this.getClientList();
						this.$message({
                            type: "success",
                            message: this.$i18n.t('message.common.deleteSucc')
                        });
                    } else {
                        let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                        this.$message({
                            type: "error",
                            message: message
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
            })
            .catch(_ => {

            });
        },
        modifyClient(val, type) {
            this.clientDialogOptions = {
                type: type,
                data: val
            }
            this.clientDialogVisible = true
            this.clientDialogTitle = this.$i18n.t('message.accountManagement.editClient')
        },
    }
};
</script>

<style scoped>
    .client-table{
        margin: 20px;
    }
    .addClient{
        position: relative;
        text-align: left;
        padding: 20px 20px 0px 20px;
    }
    .search-item {
        display: inline-block;
        margin-left: 10px;
    }
    .search-item > span {
        margin-right: 0px;
    }
    .inputStyle{
        position: relative;
        width:200px;
    }
    .search-part-left-btn{
        height: 30px;
        display: flex;
        float: right;
        align-items: center; /*定义body的元素垂直居中*/
        justify-content: center; /*定义body的里的元素水平居中*/
    }
    /* .el-button--primary{
        float:right;
        position: relative;
        margin-right: 15px;
    } */
    .client-table /deep/ .el-button--text {
        margin-left: 5px !important;
        margin-right: 5px !important;
    }
</style>
