<template>
    <div style="po">
        <div class="commonline"></div>
        <!-- <div class="alertText">
            <span class="alertTextSpan">{{limitAlertText}}</span>
        </div> -->
        <div class="template-show-table">
            <el-table :data="templateList" max-height="500px" row-key="id" tooltip-effect="light" v-loading="loading">
                <el-table-column
                    :label="$t('message.templateManagement.version')"
                    align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row["version"]}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    :label="$t('message.templateManagement.templateType')"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row['type']}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    :label="$t('message.common.createTime')"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row['created_at']}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    :label="$t('message.templateManagement.address')"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.pivot?(scope.row.pivot.address?scope.row.pivot.address:""):""}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { getAssociatedTemplateList } from "@/util/api";
import router from "@/router";
export default {
    name: "templateShowDialog",
    props: {
        templateShowOptions: {
            type: Object
        }
    },
    watch: {
        
    },
    data() {
        return {
            loading:false,
            templateList: [],
        };
    },
    created(){
        
    },
    mounted() {
        let _this = this;
        _this.getAssTemplateList(_this.templateShowOptions.data.id);
    },
    methods: {
        getAssTemplateList(params){
            let _this = this;
            _this.loading = true;
            getAssociatedTemplateList(params).then(res => {
                _this.loading = false;
                if (res.data.code === 0) {
                    _this.templateList = res.data.data;
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
    .template-show-table{
        position: relative;
        margin: 15px 15px 15px 15px;
        height: 500px;
    }
</style>
