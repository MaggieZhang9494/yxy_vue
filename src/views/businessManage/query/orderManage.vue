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
        <v-content-head :headTitle="'订单管理'" :headSubTitle="headSubTitle" :icon="false"></v-content-head>
        <div class="module-wrapper">
            <div class="order-table">
                <el-table :data="orderList" tooltip-effect="light" v-loading="loading">
                    <el-table-column v-for="head in orderHeader" :label="head.name" :key="head.enName" show-overflow-tooltip align="left">
                        <template slot-scope="scope">
                            <template v-if="head.enName=='orderNum'">
                                <!-- <span>{{scope.$index}}</span> -->
                                <span>{{scope.row[head.enName]}}</span>
                            </template>
                            <template v-else-if="head.enName=='orderDesc'">
                                <!-- <span>{{scope.row}}</span> -->
                                <span>{{scope.row[head.enName]}}</span>
                            </template>
                            <template v-else>
                                <el-button type="text" size="small" @click="deleteAccount(scope.row,'delete')" style="color:#ed5454">{{$t('message.common.delete')}}</el-button>
                                <el-button type="text" size="small" @click="modifyAccount(scope.row,'modify')">{{$t('message.common.modify')}}</el-button>
                            </template>
                        </template>

                    </el-table-column>
                </el-table>
                <!-- <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>

                <el-dialog :visible.sync="accountDialogVisible" :title="accountDialogTitle" width="433px" :append-to-body="true" :center="true" class="dialog-wrapper" v-if="accountDialogVisible">
                    <account-dialog :accountDialogOptions="accountDialogOptions" @success="success" @close="close"></account-dialog>
                </el-dialog> -->
                
            </div>
        </div>
    </div>
</template>
<script>
import contentHead from "@/components/contentHead";
import { orderList } from "@/util/api";
import router from "@/router";
import errcode from "@/util/errcode";

export default {
    name: "orderManage",
    components: {
        "v-content-head": contentHead,
    },
    data: function() {
        return {
            loading:false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            headSubTitle: "订单管理",
            orderHeader:[
                {
                    enName: "orderNum",
                    name: "订单号"
                },
                {
                    enName: "orderDesc",
                    name: "订单描述"
                },
                {
                    enName: "operate",
                    name: this.$i18n.t('message.common.operate')
                }
            ],
            orderList: [{
                orderNum: '2016-05-02',
                orderDesc: '王小虎',
            }, {
                orderNum: '2016-05-04',
                orderDesc: '上海市普陀区金沙江路 1517 弄'
            }, {
                orderNum: '2016-05-01',
                orderDesc: '上海市普陀区金沙江路 1519 弄'
            }, {
                orderNum: '2016-05-03',
                orderDesc: '上海市普陀区金沙江路 1516 弄'
            }]
        };
    },
    mounted: function() {
        this.getOrderList();
    },
    methods: {
        getOrderList:function(){
            let _this = this;
            _this.loading = true;
            orderList().then(res=>{
                _this.loading = false;
                if (res.data.code === 0) {
                    _this.orderList = res.data.data || [];
                    _this.total = res.data.totalCount;
                } else {
                    this.$message({
                        type: "error",
                        message: this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en
                    });
                }
            }).catch(err=>{
                this.loading = false;
                let errStr = err.data?this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en:err
                this.$message({
                    type: "error",
                    message: errStr || this.$i18n.t('message.common.systemError')
                });
            })
        },
        handleSizeChange: function(val) {
            this.pageSize = val;
            this.currentPage = 1;
            //this.getAccountList();
        },
        handleCurrentChange: function(val) {
            this.currentPage = val;
            //this.getAccountList();
        },
    }
};
</script>
<style scoped>

</style>

