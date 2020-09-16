<template>
    <div class="account-wrapper">
        <content-head :headTitle="'message.menuName.userManagement'" :headTitlePath="{path:'/accountList'}"></content-head>
        <div class="module-wrapper">
            <div class="addAccount">
                <div class="search-item" style="display: inline-block;margin-left: 0px;">
                    <span>{{$t('message.accountManagement.account')}}：</span>
                    <el-input
                        size="mini"
                        class="inputStyle"
                        :placeholder="$t('message.accountManagement.accountInput')"
                        v-model="searchKeyAccount"
                        clearable>
                    </el-input>
                </div>
                <div class="search-item">
                    <span>{{$t('message.accountManagement.name')}}：</span>
                    <el-input
                        size="mini"
                        class="inputStyle"
                        :placeholder="$t('message.accountManagement.nameInput')"
                        v-model="searchKeyName"
                        clearable>
                    </el-input>
                </div>
				<div class="search-item">
                    <span>{{$t('message.roleManagement.role')}}：</span>
                    <el-select v-model="searchRoleKey" size="mini" @change="changeNodes" :placeholder="$t('message.common.choose')">
                        <el-option v-for="item in roleList" :key="item.value" :label="item.node" :value="item.value"></el-option>
                    </el-select>
                </div>
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
                <div style="display: inline-block;float: right;">
                    <el-button type="primary" size="small" icon="el-icon-plus" @click="creatAccount">{{$t('message.accountManagement.add')}}</el-button>
                </div>
                <div style="display: inline-block;float: right;margin-right: 15px;">
                    <el-button type="primary" size="small" icon="el-icon-search" @click="searchAccount">{{$t('message.accountManagement.search')}}</el-button>
                </div>
            </div>
            <div class="account-table">
                <el-table ref="refTable" :data="accountList" v-loading="loading">
					<el-table-column type="expand" width="1">
						<template slot-scope="scope">
							<v-company-msg :companyList="scope.row.customers"></v-company-msg>
						</template>
					</el-table-column>
                    <el-table-column
                        align="center"
                        fixed="left"
                        :label="$t('message.businessSearch.number')"
                        :width="numberWidth">
                        <template slot-scope="scope">
                            <span>{{scope.row['number']}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="left"
                        fixed="left"
                        :label="$t('message.accountManagement.account')"
                        :width="accountWidth">
                        <template slot-scope="scope">
                            <span>{{scope.row['account']}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="left"
                        fixed="left"
                        :label="$t('message.accountManagement.name')"
                        :width="nameWidth">
                        <template slot-scope="scope">
                            <span>{{scope.row['nick']}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="head in accountHeader" :min-width="head.columnWidth" :label="head.name" :key="head.enName" align="left">
                        <template slot-scope="scope">
                            <span v-if="head.enName!=='affiliatedCompany'">{{scope.row[head.enName]}}</span>
							<div style="padding:5px;" v-else>
								<div  v-if="scope.row.customers && scope.row.customers.length>2">
									<span v-for="(company,index) in scope.row.customers.slice(0,2)" :key="index" style="display: block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{company.company_name}}</span>
								</div>
								<span v-else v-for="(company,index) in scope.row.customers" :key="'key'+index" style="display: block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{company.company_name}}</span>
								<span v-if="scope.row.customers && scope.row.customers.length>0" style="color:#1585FF;cursor:pointer;" @click="clickTable(scope.row, scope.$index)"><i :class="[scope.row.isSpread?'iconfont wbs-chakanxiangqing':'iconfont wbs-chakanxiangqing']" style="color:#1585FF;font-size:12px;position: relative;margin-right: 3px;"></i>{{scope.row.isSpread?$t('message.businessDetail.packup'):$t('message.businessDetail.spread')}}</span>
							</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        :label="$t('message.common.operate')"
                        :width="operateWidth"
                        align="left">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="resetPwd(scope.row,'reset')" style="color:#1585FF">{{$t('message.common.resetPwd')}}</el-button>
                            <el-button type="text" size="small" @click="modifyAccount(scope.row,'modify')"  style="color:#1585FF">{{$t('message.common.edit')}}</el-button>
                            <el-button type="text" size="small" @click="deleteAccount(scope.row,'delete')" style="color:#1585FF">{{$t('message.common.delete')}}</el-button>
                            <el-button v-if="(isSuperAdmin && scope.row.role==='platform_admin') || !isSuperAdmin" type="text" size="small" @click="copyAccount(scope.row,'clone')" style="color:#1585FF">{{$t('message.common.clone')}}</el-button>
                            <el-button v-if="(scope.row.role==='platform_admin')" type="text" size="small" @click="showAPISecretKey(scope.row)" style="color:#1585FF">{{$t('message.accountManagement.APISecretKey')}}</el-button>
                            <el-button v-if="scope.row['qywx'] == true" type="text" size="small" @click="unBindErpWX(scope.row)" style="color:#1585FF">{{$t('message.accountManagement.unBindMsg')}}</el-button>
                            <el-button v-else type="text" size="small" @click="jumpBindErpWX(scope.row)" style="color:#1585FF">{{$t('message.accountManagement.bindMsg')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>

                <el-dialog :visible.sync="secretKeyDialogVisible" :title="secretKeyDialogTitle" width="450px" :append-to-body="true" :center="true" class="dialog-wrapper" v-if="secretKeyDialogVisible">
                    <v-secretKey-dialog :secretKeyDialogOptions="secretKeyDialogOptions" @success="success" @close="close"></v-secretKey-dialog>
                </el-dialog>

                <el-dialog :visible.sync="accountDialogVisible" :title="accountDialogTitle" width="800px" :append-to-body="true" :center="true" class="dialog-wrapper" v-if="accountDialogVisible">
                    <v-account-dialog :accountDialogOptions="accountDialogOptions" @success="success" @close="close"></v-account-dialog>
                </el-dialog>

                <el-dialog :visible.sync="resetDialogVisible" :title="$t('message.common.resetPwd')" width="433px" :append-to-body="true" :center="true" class="dialog-wrapper" v-if="resetDialogVisible">
                    <v-resetpwd-dialog :accountDialogOptions="accountDialogOptions" @success="success" @close="closeReset"></v-resetpwd-dialog>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import { getRolePullList,getAccountList, deleteAccount, erp_wxBind, erp_wxUnbind } from "@/util/api";
import accountYXDialog from "./components/accountYXDialog";
import resetPwdDialog from "./components/resetPwdDialog";
import Bus from "@/bus"
import secretKeyDialog from "./components/secretKeyDialog";
import companyMsg from "./components/companyMsg";
export default {
    name: "accountList",
    components: {
        contentHead,
        "v-account-dialog":accountYXDialog,
        "v-resetpwd-dialog":resetPwdDialog,
		"v-secretKey-dialog":secretKeyDialog,
		"v-company-msg":companyMsg,
    },
    data() {
        return {
            accountName: "",
            loading: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            headSubTitle:"",
            //搜索条件
            searchKeyAccount:"",
            searchKeyName:"",
			searchKeyCompany:"",
			searchRoleKey:"",
			roleList:[],

            //API密钥对话框变量
            secretKeyDialogVisible: false,
            secretKeyDialogTitle: '',
            secretKeyDialogOptions: {},
            //重置密码对话框变量
            resetDialogVisible: false,
            //帐号信息对话框变量
            accountDialogVisible: false,
            accountDialogTitle: '',
            accountDialogOptions: {},
            accountHeader: [
				{
                    enName: "role_alias",
                    name: this.$i18n.t('message.roleManagement.role')
				},
				{
                    enName: "affiliatedCompany",
                    name: this.$i18n.t('message.accountManagement.affiliatedCompany')
                },
                {
                    enName: "dept",
                    name: this.$i18n.t('message.accountManagement.department')
                },
                {
                    enName: "title",
                    name: this.$i18n.t('message.accountManagement.duty')
                },
                {
                    enName: "work_tel",
                    name: this.$i18n.t('message.accountManagement.telephone')
                },
                {
                    enName: "cell_phone_number",
                    name: this.$i18n.t('message.accountManagement.phoneNumber')
                },
                {
                    enName: "email",
                    name: this.$i18n.t('message.accountManagement.email')
				},
				{
                    enName: "effective_date",
                    name: this.$i18n.t('message.accountManagement.effectiveDate')
                },
                {
                    enName: "expiration_date",
                    name: this.$i18n.t('message.accountManagement.expiryDate')
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
                },
                {
                    enName: "state_show",
                    name: this.$i18n.t('message.accountManagement.status')
                }
            ],
            //列表数组
            accountList: [
			],
			//关联公司
			affiliatedCompany:[],

            //列表视图对应列的宽度
            numberWidth:50,//序号
            accountWidth:60,//帐号
            nameWidth:100,//姓名
			operateWidth:210,//操作
			
			isSuperAdmin:localStorage.getItem("IsSuperAdmin")==='true'?true:false,
        };
    },
    created(){
        if(this.$route.query && !this.isNullData(this.$route.query.auth_code)){
            //获取企业微信授权成功auth_code
            let authCode = this.$route.query.auth_code;
            if (authCode.indexOf("=") != -1) {
                let array = authCode.split("="); //字符分割
                if(array.length == 2){
                    authCode = array[1];
                }
            }
            this.bindErpWX(authCode);
		}
		
		this.getRolesList();
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

        this.getAccList();
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
                this.operateWidth=210;
            }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
                this.numberWidth=50;
                this.accountWidth=80;
                this.nameWidth=100;
                this.operateWidth=220;
            }else{
                this.numberWidth=50;
                this.accountWidth=60;
                this.nameWidth=100;
                this.operateWidth=220;
            }
        },
        //处理每列显示宽度
        dealColumWidth(){
            let _this = this;
            _this.accountHeader.map(item=>{
                //accountHeader,将columnWidth:写入每个对象中
                item.columnWidth = '100px';

                if(localStorage.getItem("internationalization") == 'zh-cn'){ /* 中文版本 */
                    if(item.enName=='created_at' || item.enName=='updated_at'){
                        item.columnWidth = '150px';
                    } else if(item.enName=='affiliatedCompany'){ //关联公司
                        item.columnWidth = '250px';
                    } else if(item.enName=='role'){ //角色
                        item.columnWidth = '110px';
                    }
                }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
                    if(item.enName=='created_at' || item.enName=='updated_at'){
                        item.columnWidth = '150px';
                    } else if(item.enName=='company_name' ||  item.enName=='company_name_en'){ //会员等级
                        item.columnWidth = '170px';
                    }else if(item.enName=='work_tel'){ //工作电话
                        item.columnWidth = '130px';
                    } else if(item.enName=='cell_phone_number'){ //手机号
                        item.columnWidth = '100px';
                    } else if(item.enName=='email'){ //邮箱
                        item.columnWidth = '110px';
                    } else if(item.enName=='affiliatedCompany'){ //关联公司
                        item.columnWidth = '250px';
                    } else if(item.enName=='role'){ //角色
                        item.columnWidth = '110px';
                    }
                }
            })
        },
        changGroup(val){
            this.getAccList();
        },
        //获取搜索条件，输出查询参数
        getSearchParams(){
            let param = {
                pageNumber: this.currentPage,
                pageSize: this.pageSize
            };
            if(!this.isNullData(this.searchKeyAccount)){
                param.search_account = this.searchKeyAccount;
            }
            if(!this.isNullData(this.searchKeyName)){
                param.search_name = this.searchKeyName;
            }
            if(!this.isNullData(this.searchKeyCompany)){
                param.search_company = this.searchKeyCompany;
			}
			if(!this.isNullData(this.searchRoleKey)){
                param.search_role = this.searchRoleKey;
			}
		
            return param;
        },
        success(){
            this.getAccList()
        },
        close(val){
            this.accountDialogVisible = val
        },
        closeReset(val){
            this.resetDialogVisible = val
        },
        //获取帐号列表
        getAccList() {
            if (this.isNullData(localStorage.getItem("groupId"))) {
                return;
            }
            this.loading = true;
            let param = this.getSearchParams();
            let reqQuery = {};
            getAccountList(param, reqQuery).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    let listArr = res.data.data.data || [];
                    this.accountList = listArr.map((item,index)=>{
						item.number = (this.currentPage-1)*this.pageSize+index+1;
						item.isSpread = false;
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
		
		/**
         * 获取角色列表下拉项
         */
        getRolesList: function() {
			let param = {};
			param.isSearch = "1";
			
            getRolePullList(param).then(res => {
                if (res.data.code === 0) {
                    this.roleList = res.data.data || [];
                } else {
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
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

        handleSizeChange: function(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getAccList();
        },
        handleCurrentChange: function(val) {
            this.currentPage = val;
            this.getAccList();
        },
        creatAccount(){
            this.accountDialogVisible = true
            this.accountDialogTitle = this.$i18n.t('message.accountManagement.addAccount')
            this.accountDialogOptions = {
                type:'create',
                data: {
                    account: '',
                    role: ''
                }
            }
        },
        searchAccount(){
            this.currentPage = 1;
            this.pageSize = 10;
            this.total = 0;
            this.accountList = [];
            this.getAccList();
        },
        resetPwd(val, type){
            this.accountDialogOptions = {
                type: type,
                data: val
            }
            this.resetDialogVisible = true
        },
        deleteAccount(val, type) {
            this.$confirm(this.$i18n.t('message.accountManagement.deleteAccountAlert'), this.$i18n.t('message.accountManagement.deleteAccount'), {
                confirmButtonText: this.$i18n.t('message.common.confirm'),
                cancelButtonText: this.$i18n.t('message.common.cancel'),
                type: 'warning',
            })
            .then(_ => {
                this.loading = true;
                let reqData = {
                    account:val.account,
                };
                let reqQuery = {};
                deleteAccount(reqData,reqQuery).then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.getAccList();
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
        modifyAccount(val, type) {
            this.accountDialogOptions = {
                type: type,
                data: val
            }
            this.accountDialogVisible = true
            this.accountDialogTitle = this.$i18n.t('message.accountManagement.editAccount')
		},
		copyAccount(val, type){
			this.accountDialogOptions = {
                type: type,
                data: val
            }
            this.accountDialogVisible = true
            this.accountDialogTitle = this.$i18n.t('message.common.clone')
		},
        //显示API密钥
        showAPISecretKey(val){
            this.secretKeyDialogOptions = {
                data:val,
            }
            this.secretKeyDialogVisible = true
            this.secretKeyDialogTitle = this.$i18n.t('message.accountManagement.APISecretKey')
        },
        //解绑企业微信
        unBindErpWX(val){
            this.$confirm(this.$i18n.t('message.accountManagement.unBindMsgAlert'),this.$i18n.t('message.accountManagement.unBindMsg'),{
                confirmButtonText: this.$i18n.t('message.common.confirm'),
                cancelButtonText: this.$i18n.t('message.common.cancel'),
                type: 'warning',
            })
            .then(_ => {
                let params = {
                    account:val.account
                }
                this.loading = true;
                erp_wxUnbind(params).then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        let message = res.data.message?res.data.message:this.$i18n.t('message.accountManagement.unBindMsgSuc');
                        this.$message({
                            type: "success",
                            message: message
                        });
                        this.getAccList();
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
        //跳转绑定企业微信
        jumpBindErpWX(val){
            //存储需要绑定的用户信息
			localStorage.setItem("BindWXAccount", val.account);
			let redUri = window.location.origin + "/#/accountList";
            window.location.href="https://open.work.weixin.qq.com/wwopen/sso/3rd_qrConnect?appid=ww3dbc8b96acd45ad6&redirect_uri="+encodeURIComponent(redUri)+"&state=STATE&usertype=member";
        },
        //执行绑定企业微信
        bindErpWX(authCode){
            let params = {
                authCode:authCode,
                account:localStorage.getItem("BindWXAccount")
            }
            this.loading = true;
            erp_wxBind(params).then(res => {
                localStorage.removeItem("BindWXAccount");
                this.loading = false;
                if (res.data.code === 0) {
                    let message = res.data.message?res.data.message:this.$i18n.t('message.accountManagement.bindMsgSuc');
                    this.$message({
                        type: "success",
                        message: message
                    });
                    this.getAccList();
                } else {
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
                    });
                }
            })
            .catch(err => {
                localStorage.removeItem("BindWXAccount");
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
		
		changeNodes:function(params) {

		},
		clickTable(row,index,e){
			row.isSpread = !row.isSpread;

			this.$refs.refTable.toggleRowExpansion(row)
        },
    }
};
</script>

<style scoped>
    .account-table{
        margin: 20px;
    }
    .addAccount{
        position: relative;
        text-align: left;
        padding: 20px 20px 0px 20px;
    }
    .search-item {
        display: inline-block;
        margin: 5px 0px 5px 10px;
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
    .account-table /deep/ .el-button--text {
        margin-left: 5px !important;
        margin-right: 5px !important;
    }
	.account-table /deep/ .el-table__expand-icon>.el-icon{
    visibility:hidden;
}
</style>
