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
        <v-contentHead :headTitle="'message.menuName.privateKeyManagement'" :headTitlePath="{path:'/privateKeyManagement'}" @changGroup="changGroup"></v-contentHead>
        <div class="module-wrapper">
            <div class="search-part">
                <div class="search-part-left" v-if="!disabled">
                    <el-button type="primary" class="search-part-left-btn"  @click="$store.dispatch('switch_creat_user_dialog')">{{$t('message.user.addUser')}}</el-button>
                    <el-tooltip effect="dark" :content="$t('message.user.addTip')" placement="top-start">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </div>
                <div class="search-part-right">
                    <el-input size="mini" :placeholder="$t('message.user.inputNameAddress')" v-model="userName" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </div>
            </div>
            <div class="search-table">
                <el-table :data="rivateKeyList" tooltip-effect="dark" v-loading="loading">
                    <el-table-column v-for="head in rivateKeyHead" :label="head.name" :key="head.enName" show-overflow-tooltip :width="tdWidth[head.enName] || ''" align="left">
                        <template slot-scope="scope">
                            <template v-if="head.enName!='operate'">
                                <span v-if="head.enName ==='userStatus'" :style="{'color': statusColor(scope.row[head.enName])}">{{userStatus(scope.row[head.enName])}}</span>
                                <span v-else-if="head.enName ==='address'">
                                    <i class="wbs-icon-copy font-12 copy-public-key" @click="copyPubilcKey(scope.row[head.enName])" :title="$t('message.user.copyPublicKey')"></i>
                                    {{scope.row[head.enName]}}
                                </span>
                                <span v-else-if="head.enName ==='userId'">
                                    <el-tooltip :content="scope.row['hasPk'] == 1 ? $t('message.user.privateKey'):$t('message.user.publicKey')" placement="top" effect="dark">
                                        <i class="wbs-icon-key-b font-12" :style="{'color': scope.row['hasPk'] == 1 ? '#FFC31F':'#4F9DFF'}"></i>
                                    </el-tooltip>
                                    {{scope.row[head.enName]}}
                                </span>
                                <span v-else>{{scope.row[head.enName]}}</span>
                            </template>
                            <template v-else>
                                <el-button :disabled="disabled" type="text" size="small" :class="{'grayColor': disabled}" @click="modifyDescription(scope.row)">{{$t('message.common.modify')}}</el-button>
                            </template>
                        </template>

                    </el-table-column>

                </el-table>
                <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog :visible.sync="$store.state.creatUserVisible" :title="$t('message.user.addUser')" width="621px" :append-to-body="true" class="dialog-wrapper" v-if='$store.state.creatUserVisible' center>
            <v-creatUser @creatUserClose="creatUserClose" @bindUserClose="bindUserClose" ref="creatUser"></v-creatUser>
        </el-dialog>
    </div>
</template>


<script>
import contentHead from "@/components/contentHead";
import creatUser from "./components/creatUser";
import { getUserList, getUserDescription } from "@/util/api";
import errcode from "@/util/errcode";
import Bus from "@/bus"
export default {
    name: "RivateKeyManagement",
    components: {
        "v-contentHead": contentHead,
        "v-creatUser": creatUser
    },
    data() {
        return {
            userName: this.$route.query.userName || "",
            loading: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            rivateKeyList: [],
            rivateKeyHead: [
                {
                    enName: "userName",
                    name: this.$i18n.t('message.user.userName')
                },
                {
                    enName: "userId",
                    name: this.$i18n.t('message.user.userId')
                },
                {
                    enName: "description",
                    name: this.$i18n.t('message.user.userDesc')
                },
                {
                    enName: "address",
                    name: this.$i18n.t('message.user.userPublicKeyMsg')
                },
                {
                    enName: "userStatus",
                    name: this.$i18n.t('message.user.userStatus')
                },
                {
                    enName: "operate",
                    name: this.$i18n.t('message.common.operate')
                }
            ],
            tdWidth: {
                publicKey: 450
            },
            disabled: false
        };
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
        this.getUserInfoData();
    },
    methods: {
        changGroup() {
            this.getUserInfoData()
        },
        getUserInfoData() {
            this.loading = true;
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                pageNumber: this.currentPage,
                pageSize: this.pageSize
            },
                reqQuery = {
                    userParam: this.userName.replace(/^\s+|\s+$/g, "")
                };
            getUserList(reqData, reqQuery)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.rivateKeyList = res.data.data || [];
                        this.total = res.data.totalCount;
                    } else {
                        this.$message({
                            type: "error",
                            message: errcode.errCode[res.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.loading = false;
                    let message = this.$i18n.t('message.common.systemError');
					if(err && err.data && err.data.code){
						message = errcode.errCode.isCN?errcode.errCode[err.data.code].cn:errcode.errCode[err.data.code].en;
					}
					this.$message({
						type: "error",
						message: message
					});
                });
        },
        search() {
            this.currentPage = 1;
            this.getUserInfoData();
        },
        handleSizeChange: function (val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getUserInfoData();
        },
        handleCurrentChange: function (val) {
            this.currentPage = val;
            this.getUserInfoData();
        },
        creatUserInfo() { },
        creatUserClose() {
            this.getUserInfoData();
        },
        bindUserClose() {
            this.getUserInfoData();
        },
        handleClose: function () {
            this.$refs.creatUser.modelClose();
        },
        modifyDescription(params) {
			console.log("params.......", params);
            this.$prompt(this.$i18n.t('message.user.inputUserDesc'), this.$i18n.t('message.common.hint'), {
                confirmButtonText: this.$i18n.t('message.common.affirm'),
				cancelButtonText: this.$i18n.t('message.common.cancel'),
				inputValue:params.description,
            })
                .then(({ value }) => {
                    this.userDescriptionInfo(value, params);
                })
                .catch(() => {
                    // this.$message({
                    //     type: "info",
                    //     message: this.$i18n.t('message.common.cancel')
                    // });
                });
        },
        userDescriptionInfo(value, params) {
            let reqData = {
                userId: params.userId,
                description: value
            };
            getUserDescription(reqData)
                .then(res => {
                    if (res.data.code == 0) {
                        this.getUserInfoData();
                        this.$message({
                            type: "success",
                            message: this.$i18n.t('message.user.modifyUserSuc')
                        });
                    } else {
                        this.$message({
                            type: "error",
                            message: errcode.errCode[res.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: this.$i18n.t('message.user.modifyUserFail')
                    });
                });
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
        userStatus(key) {
            let str = "";
            switch (key) {
                case 1:
                    str = this.$i18n.t('message.user.normal');
                    break;
                case 2:
                    str = this.$i18n.t('message.user.stopUse');
                    break;
                default:
                    str = this.$i18n.t('message.user.normal');
                    break;
            }
            return str;
        },
        statusColor(key) {
            let color = "";
            switch (key) {
                case 1:
                    color = "#58cb7d";
                    break;
                case 2:
                    color = "#ed5454";
                    break;
                default:
                    color = "#58cb7d";
                    break;
            }
            return color;
        }
    }
};
</script>
<style scoped>
@import "./rivateKeyManagement.css";
</style>
