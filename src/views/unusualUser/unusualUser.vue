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
    <div style="height:100%">
        <content-head :headTitle="'message.menuName.unusualUser'" :headTitlePath="{path:'/unusualUser'}" @changGroup="changGroup"></content-head>
        <div class="module-wrapper" style="position: relative;">
            <div class="search-part">
                <div class="search-part-left">
                    <el-tooltip effect="dark" :content="$t('message.uusualUser.tips')" placement="top-start">
                        <i class="el-icon-info contract-icon font-15">Tips</i>
                    </el-tooltip>
                </div>

                <div class="search-part-right">
                    <el-input size="mini" :placeholder="$t('message.uusualUser.inputAcc')" v-model="userName" class="input-with-select" @clear="clearText">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </div>
            </div>
            <div class="search-table">
                <el-table :data="hashData" tooltip-effect="light" style="overflow-y: auto; height:100%" v-loading="loading">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <div class="expand-item">
                                <ul class="expand-item-ul">
                                    <li v-for="item in props.row['hashs']" :key='item.hash'>
                                        <div @click="showItem(item)" class="expand-item-div">
                                            <i :class="item.show?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
                                            <span class="expand-item-span">TxHash：
                                                <span>{{item.hash}}</span>
                                            </span>
                                        </div>
                                        <transaction-detail :transHash="item.hash" v-if="item.show"></transaction-detail>
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="head in uusualUserHead" :label="head.name" :key="head.enName" show-overflow-tooltip align="left" v-if="head.enName!=='hashs'">
                        <template slot-scope="scope">
                            <span>{{scope.row[head.enName]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
            <!-- <div class="notify-cation" v-if="noticeVisibility">
                <div style="text-align: right;"><i class="el-icon-close" @click="closeNotice"></i></div>
                <p>异常过多，已经停止审计。建议查看交易情况，找出异常原因后导入合约或用户来清理异常记录。</p>
            </div> -->
        </div>

    </div>
</template>

<script>
import { unusualUserList } from "@/util/api";
import contentHead from "@/components/contentHead";
import transactionDetail from "@/components/transactionDetail";
import Bus from "@/bus"
export default {
    name: "uusualUser",
    components: {
        contentHead,
        transactionDetail
    },
    data() {
        return {
            loading: false,
            noticeVisibility: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            userName: '',
            uusualUserHead: [
                {
                    enName: "userName",
                    name: this.$i18n.t('message.uusualUser.accName')
                },
                {
                    enName: "transCount",
                    name: this.$i18n.t('message.uusualUser.businessVol')
                },
                {
                    enName: "time",
                    name: this.$i18n.t('message.uusualUser.lateTime')
                },
                {
                    enName: "hashs",
                    name: this.$i18n.t('message.uusualUser.hash')
                }
            ],
            uusualUserList: []
        };
    },
    computed: {
        hashData() {
            var arr = this.uusualUserList,
                list = [];
            arr.forEach(item => {
                item.hashs = item["hashs"].split(",");
            });
            arr.forEach(item => {
                let hashArr = [];
                for (let i = 0; i < item.hashs.length; i++) {
                    let obj = {};
                    if (i === 0) {
                        obj.hash = item.hashs[i];
                        obj.show = true;
                    } else {
                        obj.hash = item.hashs[i];
                        obj.show = false;
                    }
                    hashArr.push(obj);
                }
                item.hashs = hashArr;
            });
            return arr;
        }
    },
    beforeDestroy: function () {
        Bus.$off("changeGroup")
    },
    mounted() {
        Bus.$on("changeGroup", data => {
            this.changGroup(data)
        })
        this.getuusualUserList();
    },
    methods: {
        changGroup() {
            this.getuusualUserList()
        },
        closeNotice() {
            this.noticeVisibility = false;
        },
        getuusualUserList() {
            this.loading = true;
            let groupId = localStorage.getItem("groupId");
            let reqData = {
                groupId: groupId,
                pageNumber: this.currentPage,
                pageSize: this.pageSize
            },
                reqQuery = {};
            reqQuery = {
                userName: this.userName
            };
            unusualUserList(reqData, reqQuery)
                .then(res => {
                    if (res.data.code === 0) {
                        this.uusualUserList = res.data.data;
                        this.total = res.data.totalCount;
                        this.loading = false;
                    } else {
                        this.loading = false;
                        this.$message({
                            message: this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en,
                            type: "error",
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    this.loading = false;
                    this.$message({
                        message: this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en ||this.$i18n.t('message.uusualUser.seachAccFail'),
                        type: "error",
                        duration: 2000
                    });
                });
        },
        hashList(val) {
            let list = [];
            list = val.split(",");
            return list;
        },
        showItem(val) {
            this.$set(val, "show", !val.show);
        },
        search() {
            this.currentPage = 1
            this.getuusualUserList();
        },
        handleSizeChange: function (val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getuusualUserList();
        },
        handleCurrentChange: function (val) {
            this.currentPage = val;
            this.getuusualUserList();
        },
        clearText: function () {
            this.getuusualUserList()
        }
    }
};
</script>

<style scoped>
.search-part-right {
    float: right;
    width: 464px;
}
.search-part-left {
    float: left;
    height: 40px;
    line-height: 40px;
}
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

.search-table >>> .el-table__expanded-cell[class*="cell"] {
    padding-left: 20px;
    padding-top: 0;
}
.search-table >>> .el-table__body-wrapper {
    overflow-y: auto;
}

.expand-item-div {
    display: block;
    cursor: context-menu;
    padding: 17px 0;
    border-bottom: 1px dashed #e8e8e8;
    border-top: 1px dashed #e8e8e8;
    margin-bottom: 5px;
    padding-left: 21px;
}

.expand-item-div:first-child {
    border-top: none;
}

.expand-item-div:hover {
    background: #f3f5f9;
}
.expand-item-span {
    margin-left: 26px;
    font-size: 12px;
    color: #00122c;
}
.expand-item-span > span {
    color: #515356;
    margin-left: 47px;
}
.notify-cation {
    margin: 0 auto;
    width: 300px;
    position: relative;
    bottom: 50%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 14px 24px 14px 13px;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    z-index: 1000;
    padding-left: 30px;
    background: #fff;
}
.notify-cation > div {
    text-align: right;
    cursor: pointer;
}
</style>
