/*
 * Copyright 2014-2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
<template>
    <div class="rivate-key-management-wrapper">
        <v-contentHead :headTitle="'message.menuName.contractList'" :headTitlePath="{path:'/contractList'}" @changGroup="changGroup"></v-contentHead>
        <div class="module-wrapper">
            <div class="search-part">
                <div class="search-part-right">
                    <el-input size="mini" :placeholder="$t('message.contractList.inputConAddress')" v-model="contractData" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </div>
            </div>
            <div class="search-table">
                <el-table :data="contractList" tooltip-effect="dark" v-loading="loading">
                    <el-table-column prop="contractName" :label="$t('message.contractIDE.contractName')" show-overflow-tooltip :width="nameWidth" align="left">
                        <template slot-scope="scope">
                            <span class="link" @click='open(scope.row)'>{{scope.row.contractName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="contractPath" :label="$t('message.contractList.contractCatalog')" show-overflow-tooltip :width="catalogWidth" align="left"></el-table-column>
                    <el-table-column prop="contractAddress" :label="$t('message.contractIDE.contractAddress')" show-overflow-tooltip align="left">
                        <template slot-scope="scope">
                            <i class="wbs-icon-copy font-12 copy-public-key" @click="copyPubilcKey(scope.row.contractAddress)" :title="$t('message.contractList.copyAddress')"></i>
                            <span>{{scope.row.contractAddress}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="contractAbi" :label="$t('message.contractList.contractAbi')" show-overflow-tooltip align="left">
                        <template slot-scope="scope">
                            <i class="wbs-icon-copy font-12 copy-public-key" @click="copyPubilcKey(scope.row.contractAbi)" :title="$t('message.contractList.copyContractAbi')"></i>
                            <span class="link" @click='openAbi(scope.row)'>{{scope.row.contractAbi}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="contractBin" :label="$t('message.contractList.contractBin')" show-overflow-tooltip align="left">
                        <template slot-scope="scope">
                            <i class="wbs-icon-copy font-12 copy-public-key" @click="copyPubilcKey(scope.row.contractBin)" :title="$t('message.contractList.copyContractBin')"></i>
                            <span>{{scope.row.contractBin}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" :label="$t('message.common.createTime')" show-overflow-tooltip width="150" align="left"></el-table-column>
                    <el-table-column fixed="right" :label="$t('message.common.operate')" :width="operateWidth">
                        <template slot-scope="scope">
                            <el-button :disabled="disabled" :class="{'grayColor': disabled}" @click="send(scope.row)" type="text" size="small">{{$t('message.contractIDE.sendTran')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <!-- <v-editor :show='editorShow' :data='editorData' v-if='editorShow' @close='close'></v-editor> -->
        <abi-dialog :show="abiDialogShow" v-if="abiDialogShow" :data='abiData' @close="abiClose"></abi-dialog>
        <el-dialog :title="$t('message.contractIDE.sendTran')" :visible.sync="dialogVisible" width="500px" :before-close="sendClose" v-if="dialogVisible" center class="send-dialog">
            <send-transation @success="sendSuccess($event)" @close="handleClose" ref="send" :data="data" :abi='abiData' :version='version'></send-transation>
        </el-dialog>
        <v-editor v-if='editorShow' :show='editorShow' :data='editorData' @close='editorClose'></v-editor>
    </div>
</template>
<script>
import contentHead from "@/components/contentHead";
import sendTransation from "./dialog/sendTransaction"
import editor from "./dialog/editor"
import abiDialog from "./dialog/abiDialog"
import { getContractList } from "@/util/api"
import router from '@/router'
import errcode from "@/util/errcode";
import Bus from "@/bus"
export default {
    name: "oldContract",
    components: {
        "v-contentHead": contentHead,
        "v-editor": editor,
        "abi-dialog": abiDialog,
        "send-transation": sendTransation
    },
    data: function () {
        return {
            contractList: [],
            loading: false,
            currentPage: 1,
            pageSize: 10,
            editorShow: false,
            editorData: null,
            abiDialogShow: false,
            abiData: null,
            contractData: "",
            contractName: "",
            contractAddress: "",
            version: "",
            data: null,
            dialogVisible: false,
            total: 0,
            disabled: false,

            //列表视图对应列的宽度
            nameWidth:50,//合约名称
            catalogWidth:60,//合约目录
            operateWidth:100,//操作
        }
    },
    created(){
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
        this.getContracts()
    },
    methods: {
        /**
         * 处理中英文数据
         */
        dealZH_EN(){
            if(localStorage.getItem("internationalization") == 'zh-cn'){ /* 中文版本 */
                this.nameWidth=120;
                this.catalogWidth=120;
                this.operateWidth=100;
            }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
                this.nameWidth=120;
                this.catalogWidth=120;
                this.operateWidth=130;
            }else{
                this.nameWidth=120;
                this.catalogWidth=120;
                this.operateWidth=100;
            }
        },
        changGroup: function () {
            this.getContracts()
        },
        getContracts: function () {
            let data = {
                groupId: localStorage.getItem("groupId"),
                pageNumber: this.currentPage,
                pageSize: this.pageSize,
                contractName: this.contractName,
                contractAddress: this.contractAddress,
                contractStatus: 2
            }
            getContractList(data).then(res => {
                if (res.data.code == 0) {
                    this.contractList = res.data.data || [];
                    this.total = res.data.totalCount || 0;
                } else {
                    
                    this.$message({
                        message: this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en,
                        type: "error",
                        duration: 2000
                    });
                    console.log(this.$message.closeAll())
                }
            })
        },
        copyPubilcKey: function (val) {
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
        open: function (val) {
            router.push({
                path: "/contract",
                query: {
                    contractId: val.contractId
                }
            })
            // this.editorShow = true;
            // this.editorData = val.contractSource
        },
        editorClose: function () {
            this.editorShow = false;
        },
        openAbi: function (val) {
            this.abiData = val.contractAbi;
            this.abiDialogShow = true
        },
        abiClose: function () {
            this.abiDialogShow = false;
            this.abiData = null
        },
        search: function () {
            if (this.contractData && this.contractData.length && this.contractData.length < 20) {
                this.contractName = this.contractData;
                this.contractAddress = ""
            } else if (this.contractData && this.contractData.length && (this.contractData.length > 20 || this.contractData.length == 20)) {
                this.contractName = "";
                this.contractAddress = this.contractData;
            } else {
                this.contractName = "";
                this.contractAddress = ""
            }
            this.currentPage = 1
            this.getContracts();
        },
        send: function (val) {
            this.data = val;
            this.abiData = val.contractAbi;
            this.version = val.contractVersion;
            this.dialogVisible = true
        },
        sendClose: function () {
            this.dialogVisible = false
        },
        handleClose: function () {
            this.dialogVisible = false
        },
        sendSuccess: function (val) {
            this.dialogVisible = false;
            this.editorShow = true;
            this.editorData = val;
        },
        handleSizeChange: function (val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getContracts();
        },
        handleCurrentChange: function (val) {
            this.currentPage = val;
            this.getContracts();
        },
    }
}
</script>
<style>
.input-with-select >>> .el-input__inner {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    border: 1px solid #eaedf3;
    box-shadow: 0 3px 11px 0 rgba(159, 166, 189, 0.11);
}
.input-with-select >>> .el-input-group__append {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    box-shadow: 0 3px 11px 0 rgba(159, 166, 189, 0.11);
}
.input-with-select >>> .el-button {
    border: 1px solid #1585FF;
    border-radius: inherit;
    background: #1585FF;
    color: #fff;
    width:42px;
}
.grayColor {
    color: #666 !important;
}
.el-tooltip__popper {
  max-width: 80%;
}
</style>


