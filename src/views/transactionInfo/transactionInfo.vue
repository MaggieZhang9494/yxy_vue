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
    <div class="bg-f7f7f7">
        <v-content-head :headTitle="'message.menuName.transactionInfo'" :headTitlePath="{path:'/transactionInfo'}" :icon="true" @changGroup="changGroup"></v-content-head>
        <div class="module-wrapper">
            <div class="search-part">
                <div class="search-part-left-bg">
                    <span>{{$t('message.common.total')}}</span>
                    <span>{{numberFormat(total, 0, ".", ",")}}</span>
                    <span>{{$t('message.common.strip')}}</span>
                </div>
                <div class="search-part-right">
                    <el-input size="mini" :placeholder="$t('message.transactionInfo.transactionInput')" v-model="searchKey.value" class="input-with-select" @clear="clearText">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </div>
            </div>
            <div class="search-table">
                <el-table  :data="transactionList" class="block-table-content" :row-key="getRowKeys" :expand-row-keys="expands" v-loading="loading" @row-click="clickTable" ref="refTable">
                    <el-table-column type="expand" align="left">
                        <template slot-scope="scope">
                            <v-transaction-detail :transHash="scope.row.transHash"></v-transaction-detail>
                        </template>
                    </el-table-column>
                    <el-table-column prop="transHash" :label="$t('message.transactionInfo.transactionHash')" align="left" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>
                                <i class="wbs-icon-copy font-12 copy-key" @click="copyPubilcKey(scope.row['transHash'])" :title="$t('message.common.copyHash')"></i>
                                {{scope.row['transHash']}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="blockNumber" :label="$t('message.blockInfo.blockHeight')" width="260" align="left" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{scope.row['blockNumber']}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="blockTimestamp" :label="$t('message.common.createTime')" width="280" :show-overflow-tooltip="true" align="left">
                        <template slot-scope="scope">
                            <span>{{scope.row['blockTimestamp']}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout=" sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import contentHead from "@/components/contentHead";
import transactionDetail from "@/components/transactionDetail";
import { getTransactionList } from "@/util/api";
import router from "@/router";
import errcode from "@/util/errcode";
import { numberFormat } from "@/util/util";
import Bus from "@/bus"

export default {
    name: "transaction",
    components: {
        "v-content-head": contentHead,
        "v-transaction-detail": transactionDetail
    },
    data: function() {
        return {
            transactionList: [],
            expands: [],
            searchKey: {
                key: "",
                value: ""
            },
            currentPage: 1,
            pageSize: 10,
            total: 0,
            loading: false,
            numberFormat: numberFormat,
            getRowKeys: function(row) {
                return row.transHash;
            }
        };
    },
    beforeDestroy: function () {
        Bus.$off("changeGroup")
    },
    mounted() {
        Bus.$on("changeGroup", data => {
            this.changGroup(data)
        })
        if (this.$route.query.blockNumber) {
            this.searchKey.key = "blockNumber";
            this.searchKey.value = this.$route.query.blockNumber;
        }
        this.getTransaction();
    },
    methods: {
        changGroup(){
            this.getTransaction();
        },
        search: function() {
            if (
                this.searchKey.key == "transactionHash" &&
                this.searchKey.value.length != 66 &&
                this.searchKey.value
            ) {
                this.$message({
                    message: this.$i18n.t('message.transactionInfo.searchAlert'),
                    type: "error",
                    duration: 2000
                });
            } else {
                this.currentPage = 1
                this.getTransaction();
            }
        },
        getTransaction: function() {
            this.expands = [];
            this.loading = true;
            let groupId = localStorage.getItem("groupId");
            let reqData = {
                    groupId: groupId,
                    pageNumber: this.currentPage,
                    pageSize: this.pageSize
                },
                reqQuery = {};
            if (this.searchKey.value) {
                if (this.searchKey.value.length === 66) {
                    reqQuery.transactionHash = this.searchKey.value;
                } else {
                    reqQuery.blockNumber = this.searchKey.value;
                }
            }
            getTransactionList(reqData, reqQuery)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.transactionList = res.data.data;
                        this.total = res.data.totalCount;
                    } else {
                        console.log(this.$message,errcode.errCode[res.data.code].cn)
                        this.$message({
                            message: errcode.errCode[res.data.code].cn,
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
					this.loading = false;
					console.log("getTransactionList...error.... ", err);
					let message = this.$i18n.t('message.common.systemError');
					if(err && err.data && err.data.code){
						message = errcode.errCode.isCN?errcode.errCode[err.data.code].cn:errcode.errCode[err.data.code].en;
					}
					if(err.data.code != "102000"){
						this.$message({
							type: "error",
							message: message
						});
					}
					
                    // this.$message.error(this.$i18n.t('message.common.systemError'));
                    // this.$message.closeAll()
                });
        },
        handleSizeChange: function(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getTransaction();
        },
        handleCurrentChange: function(val) {
            this.currentPage = val;
            this.getTransaction();
        },
        clickTable: function(row,  column,$event) {
            let nodeName = $event.target.nodeName;
            if (nodeName === "I") {
                return
            }
            this.$refs.refTable.toggleRowExpansion(row);
        },
        clearText: function() {
            this.getTransaction();
        },
        copyPubilcKey(val) {
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
};
</script>
<style scoped>
.block-table-content {
    width: 100%;
    padding-bottom: 16px;
    font-size: 12px;
}
.block-table-content>>>.el-table__expanded-cell {
    padding: 12px 6px;
}
.block-table-content>>>.el-table__expand-icon > .el-icon {
    font-size: 14px;
}
.block-table-content>>>.el-table__row {
    cursor: pointer;
}
.search-part {
    padding: 30px 0px;
    overflow: hidden;
    margin: 0;
}
.search-part::after {
    display: block;
    content: "";
    clear: both;
}
.input-with-select {
    width: 610px;
}
.input-with-select>>>.el-input__inner {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    border: 1px solid #eaedf3;
    box-shadow: 0 3px 11px 0 rgba(159, 166, 189, 0.11);
}
.input-with-select>>>.el-input-group__append {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    box-shadow: 0 3px 11px 0 rgba(159, 166, 189, 0.11);
}
.input-with-select>>>.el-button {
    border: 1px solid #1585FF;
    border-radius: inherit;
    background: #1585FF;
    color: #fff;
    width: 42px;
}
.input-with-select>>>.el-input__inner {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    border: 1px solid #eaedf3;
    box-shadow: 0 3px 11px 0 rgba(159, 166, 189, 0.11);
}
.input-with-select>>>.el-input--suffix > .el-input__inner {
    box-shadow: none;
}
.input-with-select>>>.el-input-group__prepend {
    border-left-color: #fff;
}
.input-with-select>>>.el-input-group__append {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    box-shadow: 0 3px 11px 0 rgba(159, 166, 189, 0.11);
}
</style>

