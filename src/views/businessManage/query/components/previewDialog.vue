<template>
    <div style="po">
        <div class="commonline"></div>
        <div class="alertText">
            <span class="alertTextSpan">{{limitAlertText}}</span>
        </div>
        <div class="preview-table">
            <el-table :data="orderList" max-height="500px" row-key="id" tooltip-effect="light" v-loading="loading">
                <el-table-column
                    fixed="left"
                    :label="$t('message.businessSearch.number')"
                    type="index"
                    align="center"
                    width="50">
                    <template slot-scope="scope">
                        <span>{{scope.row["keyHead0"]}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column fixed="left" label="工作号" show-overflow-tooltip align="left">
                    <template slot-scope="scope">
                        <span>{{scope.row['workNum']}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column v-for="head in orderHeader" :min-width="150" :label="head.name" :key="head.enName" show-overflow-tooltip align="left">
                    <template slot-scope="scope">
                        <span>{{scope.row[head.enName]}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { getExportPreviewData } from "@/util/api";
import router from "@/router";
export default {
    name: "previewDialog",
    props: {
        previewDialogOptions: {
            type: Object
        }
    },
    watch: {
        
    },
    data() {
        return {
            loading:false,
            orderHeader:[],
            orderList: [],
            limitNum:100,
            limitAlertText:"",
        };
    },
    created(){
        this.limitAlertText = this.$i18n.t('message.businessSearch.previewAlert1')+this.limitNum+this.$i18n.t('message.businessSearch.previewAlert2');
    },
    mounted() {
        let _this = this;
        
        let params = _this.previewDialogOptions.searchParams;
        let export_item = _this.previewDialogOptions.export_item;

        params.export_item = export_item;
        params.limit = _this.limitNum;

        _this.getExportPreData(params);
    },
    methods: {
        getExportPreData(params){
            let _this = this;
            _this.loading = true;
            getExportPreviewData(params).then(res => {
                if (res.data.code === 0) {
                    let resData = res.data.data;
                    
                    _this.dealTableShowData(resData).then(res=>{
                        _this.loading = false;
                    }).catch(err => {
                        _this.loading = false;
                    })
                } else {
                    _this.loading = false;
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
         * 处理预览数据
         * */
        dealTableShowData(resData){
            let _this = this;
            return new Promise((resolve, reject) => {
                if(!resData || resData.length<1){
                    reject(_this.$i18n.t('message.common.noData'));
                }else{
                    //获取table头部显示数据
                    let heads = resData[0];
                    heads.forEach((element,index) => {
                        if(index>0){
                            let key = "keyHead"+index;
                            let value = element;
                            _this.orderHeader.push({enName:key,name:value});
                        }
                        
                    });
                    //获取table内容显示数据
                    let msgList = resData.slice(1,resData.length);
                    msgList.forEach(element => {
                        let msgObj = {};
                        element.forEach((item,index) => {
                            let key = "keyHead"+index;
                            let value = item;
                            msgObj[key] = item;
                        });
                        _this.orderList.push(msgObj);
                    });

                    resolve();
                }
            })
        }
    }
};
</script>
<style scoped>
    .preview-table{
        position: relative;
        margin: 0px 15px 20px 25px;
        height: 500px;
    }
    .preview-table /deep/ .el-table th>.cell{
        /* padding: 5px 12px; */
        line-height: 25px;
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
