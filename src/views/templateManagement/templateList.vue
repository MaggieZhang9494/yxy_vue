
<template>
    <div class="account-wrapper">
        <content-head :headTitle="'message.menuName.templateList'" :headTitlePath="{path:'/templateList'}"></content-head>
        <div class="module-wrapper">
            <div class="template-table">
                <el-table :data="templateListArr" tooltip-effect="light" v-loading="loading">
                    <el-table-column v-for="head in templateHeader" :min-width="head.columnWidth" :label="head.name" :key="head.enName" show-overflow-tooltip align="left">
                        <template slot-scope="scope">
                            <template  v-if="head.enName=='version'">
                                <span style="margin-left: 5px;margin-right: 10px;">{{ scope.row.version }}</span>
                                <div  class="defaultTemplate" v-show="scope.row.is_default==true">{{$t('message.templateManagement.default')}}</div>
                            </template>
                            <template v-else-if="head.enName!='operate'">
                                <span>{{scope.row[head.enName]}}</span>
                            </template>
                            <template v-else>
                                <el-button type="text" size="small" @click="templateDetail(scope.row)" style="color:#1585FF">{{$t('message.templateManagement.detail')}}</el-button>
                                <el-button type="text" size="small" @click="deleteTemplate(scope.row)" style="color:#1585FF">{{$t('message.common.delete')}}</el-button>
                                <el-button v-if="scope.row.is_default==false" type="text" size="small" @click="setDefaultTemp(scope.row)"  style="color:#1585FF">{{$t('message.templateManagement.setDefault')}}</el-button>
                            </template>
                        </template>

                    </el-table-column>
                </el-table>
                <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>

                <el-dialog :visible.sync="templateDialogVisible" :title="templateDialogTitle" width="450px" :append-to-body="true" :center="true" class="dialog-wrapper" v-if="templateDialogVisible">
                    <div class="commonline"></div>
                    <v-template-dialog :templateDialogOptions="templateDialogOptions" @success="success" @close="close"></v-template-dialog>
                </el-dialog>
                
            </div>

        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import templateDialog from "./components/templateDialog";
import { templateList,templateDetail, deleteTemplate, setDefaultTemplate } from "@/util/api";
import Bus from "@/bus"

export default {
    name: "templateList",
    components: {
        contentHead,
        "v-template-dialog":templateDialog,
    },
    data() {
        return {
            loading: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            headSubTitle:"",
            templateDialogVisible: false,
            templateDialogTitle: '',
            templateDialogOptions: {},
            templateHeader: [
                {
                    enName: "version",
                    name: this.$i18n.t('message.templateManagement.version')
                },
                {
                    enName: "type",
                    name: this.$i18n.t('message.templateManagement.templateType')
                },
                {
                    enName: "created_at",
                    name: this.$i18n.t('message.common.createTime')
                },
                // {
                //     enName: "address",
                //     name: this.$i18n.t('message.templateManagement.address')
                // },
                {
                    enName: "operate",
                    name: this.$i18n.t('message.common.operate')
                }
            ],
            templateListArr: [
                // {
                //     is_default:0,//是否默认模板
                //     id:1,
                //     type:"",//模板类型
                //     address:"企鹅窝若群二群翁人情味",//地址
                //     version:"版本"
                // }
            ],
        };
    },
    beforeDestroy: function () {
        Bus.$off("changeGroup")
    },
    mounted: function() {
        Bus.$on("changeGroup", data => {
            this.changGroup(data)
        })

        let _this = this;

        _this.templateHeader.map(item=>{
            //templateHeader,将columnWidth:50px写入每个对象中
            item.columnWidth = '140px';

            if(item.enName=='address' || item.enName=='operate'){
                item.columnWidth = '200px';
            }
        })

        _this.getTemplateList();
    },
    methods: {
        changGroup(val){
            this.getTemplateList()
        },
        success(){
            this.getTemplateList()
        },
        close(val){
            this.templateDialogVisible = val
        },
        //详情按钮
        templateDetail(item){
            let reqData = {
                id: item.id
            };
            let param = {}
            this.loading = true;
            templateDetail(reqData,param).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.templateDialogOptions = res.data.data;
                    this.templateDialogVisible = true;
                    this.templateDialogTitle = this.$i18n.t('message.templateManagement.detail');
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
        //获取模板列表
        getTemplateList() {
            this.loading = true;
            let reqData = {
                pageNumber: this.currentPage,
                pageSize: this.pageSize
            };
            templateList(reqData).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.templateListArr = res.data.data.data || [];
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
            this.getTemplateList();
        },
        handleCurrentChange: function(val) {
            this.currentPage = val;
            this.getTemplateList();
        },
        addTemplate(){
            this.templateDialogVisible = true
            this.templateDialogTitle = this.$i18n.t('message.templateManagement.add')
        },
        deleteTemplate(val) {
            this.$confirm(this.$i18n.t('message.templateManagement.sureDelete'), this.$i18n.t('message.templateManagement.delete'), {
                confirmButtonText: this.$i18n.t('message.common.confirm'),
                cancelButtonText: this.$i18n.t('message.common.cancel'),
                type: 'warning',
            })
            .then(_ => {
                let reqData = {
                    id: val.id
                };
                let param = {}
                this.loading = true;
                deleteTemplate(reqData,param).then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.getTemplateList();
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
        setDefaultTemp(val) {
            this.$confirm(this.$i18n.t('message.templateManagement.sureSetDefault'), this.$i18n.t('message.templateManagement.setDefault'), {
                confirmButtonText: this.$i18n.t('message.common.confirm'),
                cancelButtonText: this.$i18n.t('message.common.cancel'),
                type: 'info',
            })
            .then(_ => {
                let reqData = {
                    id: val.id
                };
                let param = {}
                this.loading = true;
                setDefaultTemplate(reqData,param).then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.getTemplateList();
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
        }
    }
};
</script>

<style scoped>
    .template-table{
        padding: 20px 0px 0px 0px;
        margin: 20px;
    }
    .addTemplate{
        position: relative;
        text-align: right;
        padding: 20px 20px 0px 20px;
    }
    /* 中文版本 */
    .zh-cn .defaultTemplate{
        display: inline-block;
        position: relative;
        border-radius: 23px;
        height: 23px;
        width: 70px;
        background-color: rgb(255, 159, 57);
        /* font-size:4px; */
        color: white;
        margin: 0px;
        border: none;
        text-align: center;
    }
    /* 英文版本 */
    .en .defaultTemplate{
        display: inline-block;
        position: relative;
        border-radius: 23px;
        height: 23px;
        width: 100px;
        background-color: rgb(255, 159, 57);
        /* font-size:4px; */
        color: white;
        margin: 0px;
        border: none;
        text-align: center;
    }
    .search-part-left-btn{
        height: 30px;
        display: flex;
        float: right;
        align-items: center; /*定义body的元素垂直居中*/
        justify-content: center; /*定义body的里的元素水平居中*/
    }
    .el-table .cell{
        display: contents !important;
    }
</style>
