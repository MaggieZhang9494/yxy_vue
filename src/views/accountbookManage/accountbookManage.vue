<template>
    <div class="account-wrapper">
        <content-head :headTitle="'message.menuName.accountbookManage'" :headTitlePath="{path:'/accountbookManage'}"></content-head>
        <div class="module-wrapper">
            <div class="account-table">
                <el-table :data="accountBookList" tooltip-effect="light" :cell-style="{'padding-top':10+'px','padding-bottom':10+'px',}" v-loading="loading">
                    <el-table-column
                        align="left"
                        fixed="left"
                        :label="$t('message.accountbookManage.accountName')"
                        :width="accountNameWidth">
                        <template slot-scope="scope">
                            <span style="font-size:14px;">{{scope.row['name']}}</span>
							<el-button type="text" size="medium" @click="editAccBookName(scope.row,scope.$index)"  style="margin-left:5px;color:#1585FF">{{$t('message.common.edit')}}</el-button>
                        </template>
                    </el-table-column>
                    <!-- :width="associatedCompanyWidth" -->
                    <el-table-column
                        align="left"
                        fixed="left"
                        :label="$t('message.accountbookManage.associatedCompany')"
                        >
                        <template slot-scope="scope">
                            <span class="leftCell" v-for="(item, index) in scope.row['accounts']" :key="index" v-if="scope.row['isShowCompanyMoreBtn']==true && index<3">
                                {{item.account}}{{(item.business!=null && item.business!=undefined) ?((item.business.company_name!=null && item.business.company_name!=undefined)?(' | '+item.business.company_name):""):""}}
                            </span>
                            <!-- <span class="leftCell" v-for="(item, index) in scope.row['accounts']" :key="index" v-if="scope.row['isShowCompanyMoreBtn']==false">
                                {{item.account + " | " + (item.business!=null && item.business!=undefined) ?(item.business.company_name?item.business.company_name:""):""}}
                            </span> -->

                            <el-button type="text" size="medium" @click="associatedCompanyMore(scope.row,scope.$index)"  style="color:#1585FF" v-if="scope.row['isShowCompanyMoreBtn']==true">{{$t('message.accountbookManage.lookMore')}}</el-button>
                        </template>
                    </el-table-column>
                    <!-- :width="associatedTemplateWidth" -->
                    <el-table-column
                        align="left"
                        fixed="left"
                        :label="$t('message.accountbookManage.associatedTemplate')"
                        >
                        <template slot-scope="scope">
                            <span class="leftCell" v-for="(item, index) in scope.row['schemas']" :key="index" v-if="scope.row['isShowTemplateMoreBtn']==true && index<3">{{item.pivot?(item.pivot.address?item.pivot.address:""):""}}</span>
                            <!-- <span class="leftCell" v-for="(item, index) in scope.row['schemas']" :key="index" v-if="scope.row['isShowTemplateMoreBtn']==false">{{item.address}}</span> -->

                            <el-button type="text" size="medium" @click="associatedTemplateMore(scope.row,scope.$index)"  style="color:#1585FF" v-if="scope.row['isShowTemplateMoreBtn']==true">{{$t('message.accountbookManage.lookMore')}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        :label="$t('message.common.operate')"
                        :width="operateWidth"
                        align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="medium" @click="associatedCompanyTouch(scope.row)" style="color:#1585FF">{{$t('message.accountbookManage.associatedAccount')}}</el-button>
                            <el-button type="text" size="medium" @click="associatedTemplateTouch(scope.row)"  style="color:#1585FF">{{$t('message.accountbookManage.associatedTemplate')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
                <!-- 关联账号选择Dialog -->
                <el-dialog :visible.sync="accountSelectVisible" :title="accountSelectTitle" width="700px" :append-to-body="true" :center="true" class="dialog-wrapper" v-if="accountSelectVisible">
                    <v-account-select :accountSelectOptions="accountSelectOptions" @success="success" @close="closeAccountSelect"></v-account-select>
                </el-dialog>
                <!-- 关联账号显示Dialog -->
                <el-dialog :visible.sync="accountShowVisible" :title="accountShowTitle" width="700px" :append-to-body="true" :center="true" class="dialog-wrapper" v-if="accountShowVisible">
                    <v-account-show :accountShowOptions="accountShowOptions" @close="closeAccountShow"></v-account-show>
                </el-dialog>
                <!-- 关联模板选择Dialog -->
                <el-dialog :visible.sync="templateSelectVisible" :title="templateSelectTitle" width="800px" :append-to-body="true" :center="true" class="dialog-wrapper" v-if="templateSelectVisible">
                    <v-template-select :templateSelectOptions="templateSelectOptions" @success="success" @close="closeTemplateSelect"></v-template-select>
                </el-dialog>
                <!-- 关联模板显示Dialog -->
                <el-dialog :visible.sync="templateShowVisible" :title="templateShowTitle" width="800px" :append-to-body="true" :center="true" class="dialog-wrapper" v-if="templateShowVisible">
                    <v-template-show :templateShowOptions="templateShowOptions" @close="closeTemplateShow"></v-template-show>
                </el-dialog>

				<!-- 编辑名称 -->
				<el-dialog :visible.sync="editNameDialogVisible" :title="$t('message.common.edit')" width="433px" :append-to-body="true" :center="true" class="dialog-wrapper" v-if="editNameDialogVisible">
                    <v-editname-dialog :editNameDialogOptions="editNameDialogOptions" @success="success" @close="closeEditNameDialog"></v-editname-dialog>
                </el-dialog>
                
            </div>

        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import { getAccountBookList } from "@/util/api";
import associatedCompanySelect from "./components/associatedCompanySelect";
import associatedCompanyShow from "./components/associatedCompanyShow";
import associatedTemplateSelect from "./components/associatedTemplateSelect";
import associatedTemplateShow from "./components/associatedTemplateShow";
import editNameDialog from "./components/editNameDialog";
import Bus from "@/bus"

export default {
    name: "accountbookManage",
    components: {
        contentHead,
        "v-account-select":associatedCompanySelect,
        "v-account-show":associatedCompanyShow,
        "v-template-select":associatedTemplateSelect,
		"v-template-show":associatedTemplateShow,
		"v-editname-dialog":editNameDialog,
    },
    data() {
        return {
            accountName: "",
            loading: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            headSubTitle:"",

            accountBookList:[],

            //Dialog 变量信息
            //关联账号选择Dialog
            accountSelectVisible:false,
            accountSelectTitle:"",
            accountSelectOptions:{},

            //关联账号显示Dialog
            accountShowVisible:false,
            accountShowTitle:"",
            accountShowOptions:{},

            //关联模板选择Dialog
            templateSelectVisible:false,
            templateSelectTitle:"",
            templateSelectOptions:{},

            //关联模板显示Dialog
            templateShowVisible:false,
            templateShowTitle:"",
			templateShowOptions:{},
			
			//编辑群组名称Dialog
			editNameDialogVisible:false,
			editNameDialogOptions:{},

            //列表视图对应列的宽度
            accountNameWidth:150,//账本名称
            // associatedCompanyWidth:250,//关联公司
            // associatedTemplateWidth:250,//关联模板
            operateWidth:200,//操作
        };
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

        this.getAccBookList();
    },
    methods: {
        /**
         * 处理中英文数据
         */
        dealZH_EN(){
            if(localStorage.getItem("internationalization") == 'zh-cn'){ /* 中文版本 */
                this.accountNameWidth=150;
                // this.associatedCompanyWidth=250;
                // this.associatedTemplateWidth=250;
                this.operateWidth=200;
            }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
                this.accountNameWidth=150;
                // this.associatedCompanyWidth=250;
                // this.associatedTemplateWidth=250;
                this.operateWidth=200;
            }else{
                this.accountNameWidth=150;
                // this.associatedCompanyWidth=200;
                // this.associatedTemplateWidth=200;
                this.operateWidth=200;
            }
        },
        //处理每列显示宽度
        dealColumWidth(){
            let _this = this;
        },
        changGroup(val){
            this.getAccBookList()
        },
        //关联公司更多点击
        associatedCompanyMore(val,index){
            console.log("associatedCompanyMore...", index);
            // val.isShowCompanyMoreBtn = false;
            // this.accountBookList.splice(index,1,val)
            this.accountShowOptions = {
                data:val,
            }
            this.accountShowVisible = true;
            this.accountShowTitle = val.name+" - "+this.$i18n.t('message.accountbookManage.associatedAccount');
        },
        //关联模板更多点击
        associatedTemplateMore(val,index){
            console.log("associatedTemplateMore...", index);
            // val.isShowTemplateMoreBtn = false;
            // this.accountBookList.splice(index,1,val)

            this.templateShowOptions = {
                data:val,
            }
            this.templateShowVisible = true;
            this.templateShowTitle = val.name+" - "+this.$i18n.t('message.accountbookManage.associatedTemplate');
        },
        //关联公司按钮点击
        associatedCompanyTouch(val){
            this.accountSelectOptions = {
                data:val,
            }
            this.accountSelectVisible = true;
            this.accountSelectTitle = val.name+" - "+this.$i18n.t('message.accountbookManage.associatedAccount');
        },
        //关联模板按钮点击
        associatedTemplateTouch(val){
            this.templateSelectOptions = {
                data:val,
            }
            this.templateSelectVisible = true;
            this.templateSelectTitle = val.name+" - "+this.$i18n.t('message.accountbookManage.associatedTemplate');
        },
        //获取帐号列表
        getAccBookList() {
            this.loading = true;
            let param = {
                pageNumber: this.currentPage,
                pageSize: this.pageSize
            };
            let reqQuery = {};
            getAccountBookList(param, reqQuery).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    let listArr = res.data.data.data || [];
                    this.accountBookList = listArr.map((item,index)=>{
                        item.number = (this.currentPage-1)*this.pageSize+index+1;
                        if (!this.isNullData(item.accounts) && item.accounts.length>0) {
                            item.isShowCompanyMoreBtn = true;
                        }else{
                            item.isShowCompanyMoreBtn = false;
                        }

                        if (!this.isNullData(item.schemas) && item.schemas.length>0) {
                            item.isShowTemplateMoreBtn = true;
                        }else{
                            item.isShowTemplateMoreBtn = false;
                        }
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
		//编辑群组名称
		editAccBookName:function(val){
			this.editNameDialogOptions={
				data:val
			};
			this.editNameDialogVisible=true;
		},

        handleSizeChange: function(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getAccBookList();
        },
        handleCurrentChange: function(val) {
            this.currentPage = val;
            this.getAccBookList();
        },

        success(){
			let _this = this;
			_this.getAccBookList();
        },
        closeAccountSelect(val){
            this.accountSelectVisible = val
        },
        closeAccountShow(val){
            this.accountShowVisible = val
        },
        closeTemplateSelect(val){
            this.templateSelectVisible = val
        },
        closeTemplateShow(val){
            this.templateShowVisible = val
		},
		closeEditNameDialog(val){
            this.editNameDialogVisible = val
        },
    }
};
</script>

<style scoped>
    .account-table{
        padding: 20px 20px 0px 20px;
    }
    .leftCell{
        display: block;
        white-space: nowrap;
        text-align: left;
    }
</style>
