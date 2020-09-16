<template>
    <div>
        <v-content-head :headTitle="'message.menuName.certificateManagement'" :headTitlePath="{path:'/certificate'}" @changGroup="changGroup"></v-content-head>
        <div class="module-wrapper">
            <div class="search-part">
                <div class="search-part-left">
                    <el-upload ref="upload" multiple action :limit="10" accept=".crt,.cer,.der" :http-request="uploadCrt" :before-upload="onBeforeUpload" :on-exceed="onUploadExceed">
                        <el-button size="small" type="primary" :disabled="disabled">{{$t('message.certificateManagement.leadCert')}}</el-button>
                        <!-- <div slot="tip">只能上传crt文件，且不超过500kb</div> -->
                    </el-upload>
                </div>
            </div>
            <div class="search-table">
                <el-table :data="certificateList" tooltip-effect="dark" v-loading="loading" class="search-table-content">
                    <el-table-column v-for="head in certificateHead" :label="head.name" :key="head.enName" :width="head.width" show-overflow-tooltip align="left">
                        <template slot-scope="scope">
                            <template v-if="head.enName!='operate'">
                                <template v-if="scope.row[head.enName]">
                                    <el-button v-if=" head.enName==='certName'" :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" :title="$t('message.businessSearch.export')" @click="sureExportCert(scope.row)">{{scope.row[head.enName]}}</el-button>
                                    <span v-else-if="head.enName==='fingerPrint'">
                                        <i class="wbs-icon-copy font-12" @click="copyFingerPrint(scope.row[head.enName])" :title="$t('message.common.copy')"></i>
                                        {{scope.row[head.enName]}}
                                    </span>
                                    <span v-else-if="head.enName==='father'">
                                        <i class="wbs-icon-copy font-12" @click="copyFingerPrint(scope.row[head.enName])" :title="$t('message.common.copy')"></i>
                                        {{scope.row[head.enName]}}
                                    </span>
                                    <span v-else-if="head.enName==='address'">
                                        <i class="wbs-icon-copy font-12" @click="copyFingerPrint(scope.row[head.enName])" :title="$t('message.common.copy')"></i>
                                        {{scope.row[head.enName]}}
                                    </span>
                                    <span v-else-if="head.enName==='publicKey'">
                                        <i class="wbs-icon-copy font-12" @click="copyFingerPrint(scope.row[head.enName])" :title="$t('message.common.copy')"></i>
                                        {{scope.row[head.enName]}}
                                    </span>
                                    <span v-else-if="head.enName==='validityFrom'">
                                        {{format(scope.row['validityFrom'],'yyyy-MM-dd HH:mm:ss')}} {{$t('message.common.to')}} {{format(scope.row['validityTo'],'yyyy-MM-dd HH:mm:ss')}}
                                    </span>
                                    <span v-else>
                                        {{scope.row[head.enName]}}
                                    </span>
                                </template>
                                <template v-else>-</template>
                            </template>
                            <template v-else>
                                <el-button :disabled="disabled" type="text" size="small" :style="{'color': disabled?'#666':''}" @click="deteleCert(scope.row)">{{$t('message.common.delete')}}</el-button>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination> -->
            </div>
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import { deleteCert, certList, exportCert, importCert } from "@/util/api";
import { format } from "@/util/util";
import Bus from "@/bus"
export default {
    name: 'Certificate',

    components: {
        "v-content-head": contentHead,
    },

    props: {
    },

    data() {
        return {
            disabled: false,
            loading: false,
            currentPage: 1,
            pageSize: 100,
            total: 0,
            certificateHead: [
                {
                    enName: 'certName',
                    name: this.$i18n.t('message.certificateManagement.certName'),
                    width: ''
                },
                {
                    enName: 'certType',
                    name: this.$i18n.t('message.certificateManagement.certType'),
                    width: ''
                },
                {
                    enName: 'fingerPrint',
                    name: this.$i18n.t('message.certificateManagement.fingerprint'),
                    width: ''
                },
                {
                    enName: 'father',
                    name: this.$i18n.t('message.certificateManagement.parentfingerprint'),
                    width: ''
                },
                {
                    enName: 'address',
                    name: this.$i18n.t('message.certificateManagement.address'),
                    width: ''
                },
                {
                    enName: 'publicKey',
                    name: 'Node Id',
                    width: ''
                },
                {
                    enName: 'validityFrom',
                    name: this.$i18n.t('message.certificateManagement.validity'),
                    width: '280'
                },
                {
                    enName: 'operate',
                    name: this.$i18n.t('message.common.operate'),
                    width: ''
                },
            ],
            certificateList: [],
            format: format
        }
    },

    computed: {
    },

    watch: {
    },

    created() {
        this.dealZH_EN();
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
        this.getCertList()
    },

    methods: {
        /**
         * 处理中英文数据
         */
        dealZH_EN(){
            if(localStorage.getItem("internationalization") == 'zh-cn'){ /* 中文版本 */
                this.cnsHead = this.cnsHead.map(item=>{
                    if(item.enName=='certName'){//证书名称
                        item.width = '';
                    }else if(item.enName=='certType'){//证书类型
                        item.width = '';
                    }else if(item.enName=='fingerPrint'){//指纹
                        item.width = '';
                    }else if(item.enName=='father'){//父级指纹
                        item.width = '';
                    }else if(item.enName=='address'){//地址
                        item.width = '';
                    }else if(item.enName=='publicKey'){//nodeid
                        item.width = '';
                    }else if(item.enName=='validityFrom'){//有效期
                        item.width = '280';
                    }else if(item.enName=='operate'){//操作
                        item.width = '';
                    }else{
                        item.width = '';
                    }
                    return item;
                })
            }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
                this.cnsHead = this.cnsHead.map(item=>{
                    if(item.enName=='certName'){//证书名称
                        item.width = '';
                    }else if(item.enName=='certType'){//证书类型
                        item.width = '';
                    }else if(item.enName=='fingerPrint'){//指纹
                        item.width = '';
                    }else if(item.enName=='father'){//父级指纹
                        item.width = '';
                    }else if(item.enName=='address'){//地址
                        item.width = '';
                    }else if(item.enName=='publicKey'){//nodeid
                        item.width = '';
                    }else if(item.enName=='validityFrom'){//有效期
                        item.width = '280';
                    }else if(item.enName=='operate'){//操作
                        item.width = '';
                    }else{
                        item.width = '';
                    }
                    return item;
                })
            }else{
                this.cnsHead = this.cnsHead.map(item=>{
                    if(item.enName=='certName'){//证书名称
                        item.width = '';
                    }else if(item.enName=='certType'){//证书类型
                        item.width = '';
                    }else if(item.enName=='fingerPrint'){//指纹
                        item.width = '';
                    }else if(item.enName=='father'){//父级指纹
                        item.width = '';
                    }else if(item.enName=='address'){//地址
                        item.width = '';
                    }else if(item.enName=='publicKey'){//nodeid
                        item.width = '';
                    }else if(item.enName=='validityFrom'){//有效期
                        item.width = '280';
                    }else if(item.enName=='operate'){//操作
                        item.width = '';
                    }else{
                        item.width = '';
                    }
                    return item;
                })
            }
        },
        changGroup() {

        },
        importCert() {

        },
        sureExportCert(row) {
            let list = {
                fingerPrint: row.fingerPrint
            }
            exportCert(list).then(res => {
                const { data } = res;
                if (data.code === 0) {
                    let fileDownload = require('js-file-download');
                    fileDownload( data.data.content ,`${data.data.certName}.crt`);
                } else {
                    this.$message({
                        type: 'error',
                        message: data.data,
                        duration: 2500
                    })
                }
            })
        },
        deteleCert(row) {
            this.$confirm(this.$i18n.t('message.common.confirmDelete'),this.$i18n.t('message.common.delete'), {
              confirmButtonText: this.$i18n.t('message.common.confirm'),
              cancelButtonText: this.$i18n.t('message.common.cancel'),
              type: 'warning'
            })
                .then(_ => {
                    this.sureDeleteCert(row)
                })
                .catch(_ => { });
        },
        sureDeleteCert(row) {
            let param = {
                fingerPrint: row.fingerPrint
            }
            deleteCert(param).then(res => {
                const { data } = res;
                if (data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: this.$i18n.t('message.common.deleteSucc'),
                    })
                    this.getCertList()
                } else {
                    this.$message({
                        type: 'error',
                        message: data.data,
                        duration: 2500
                    })
                }
            })
        },
        onBeforeUpload(file) {
            const isLt1M = Math.ceil(file.size / 1024) < 100;
            if (!isLt1M) {
                this.$message.error(this.$i18n.t('message.certificateManagement.uploadLimitTip'));
            }
            return isLt1M;
        },
        uploadCrt(param) {
            var reader = new FileReader(), self = this;
            reader.readAsText(param.file, "UTF-8");
            reader.onload = function (e) {
                var fileString = e.target.result;
                self.postCrt(fileString)
            }
            this.$refs.upload.clearFiles()
        },
        postCrt(fileString) {
            let param = {
                content: fileString
            }
            importCert(param).then(res => {
                const { data } = res;
                if (data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: this.$i18n.t('message.certificateManagement.leadSuc'),
                    })
                    this.getCertList()
                } else {
                    this.$message({
                        type: 'error',
                        message: data.data,
                        duration: 2500
                    })
                }
            })
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getCertList();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getCertList();
        },
        getCertList() {
            this.loading = true;
            let list = {
                pageNumber: this.currentPage,
                pageSize: this.pageSize,
                groupId: localStorage.getItem("groupId")
            }
            certList(list).then(res => {
                this.loading = false;
                const { data } = res;
                if (data.code === 0) {
                    this.certificateList = data.data;
                    this.total = data.totalCount;
                }
            })
        },
        onUploadExceed(files, fileList) {
            this.$message.warning(this.$i18n.t('message.common.fileAlert1') +'10'+
            this.$i18n.t('message.common.fileAlert2')+','+
            this.$i18n.t('message.common.fileAlert3')+`${files.length}`+
            this.$i18n.t('message.common.fileAlert2')+','+
            this.$i18n.t('message.common.fileAlert4')+`{${files.length + fileList.length}`+
            this.$i18n.t('message.common.fileAlert2'));
        },
        copyFingerPrint(val) {
            if (!val) {
                this.$message({
                    type: "fail",
                    showClose: true,
                    message: this.$i18n.t('message.common.noCopyAlert'),
                    duration: 2000
                });
            } else {
                this.$copyText(val).then(e => {
                    this.$message({
                        type: "success",
                        showClose: true,
                        message: this.$i18n.t('message.common.copySuc'),
                        duration: 2000
                    });
                });
            }
        },
    }
}
</script>

<style scoped>
.search-table {
    padding: 0 40px 20px 41px;
}
.search-table-content >>> td,
.search-table-content >>> th {
    padding: 8px 0;
    font-size: 12px;
}
</style>
