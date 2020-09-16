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
    <div class="key-dialog">
        <div class="commonline"></div>
        <div class="text-center">
            <el-radio-group v-model="timeGranularity" @change='changeKey'>
                <el-radio :label="'RIV'">{{$t('message.user.privateKeyUser')}}</el-radio>
                <el-radio :label="'PUB'">{{$t('message.user.publicKeyUser')}}</el-radio>
                <!-- <el-radio :label="1">{{$t('message.common.sec5')}}</el-radio> -->
            </el-radio-group>
            <!-- <span class="wbs-icon-radio radio-key riv-key" :style="{'color': rivKey ? '#4b8fe5':''}" @click="changeKey('RIV')">
                <span class="base-span-key" :style="{'color': rivKey ? '#2956a3':''}">私钥用户</span>
            </span>
            <span class="wbs-icon-radio radio-key pub-key" :style="{'color': pubKey ? '#4b8fe5':''}" @click="changeKey('PUB')">
                <span class="base-span-key" :style="{'color': pubKey ? '#2956a3':''}">公钥用户</span>
            </span> -->
        </div>
        <div class="divide-line"></div>
        <el-form :model="userForm" :rules="rules" ref="userForm" label-width="100px" class="demo-ruleForm">
            <el-form-item :label="$t('message.user.userName')" prop="name" style="width: 546px;">
                <el-input size="mini" v-model="userForm.name" :placeholder="$t('message.user.inputUserName')" maxlength="12"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.user.publicKeyMsg')" prop="publicKey" style="width: 546px;" v-if="pubKey">
                <el-input size="mini" v-model="userForm.publicKey" :placeholder="$t('message.user.inputPublicKeyMsgAddr')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.user.remark')" style="width: 546px">
                <el-input size="mini" type="textarea" v-model="userForm.explain" maxlength="120" :placeholder="$t('message.user.within120')"></el-input>
            </el-form-item>
        </el-form>
        <div class="commonline"></div>
        <div class="dialog-footer">
            <el-button size="small" @click="modelClose">{{$t('message.common.cancel')}}</el-button>
            <el-button size="small" type="primary" @click="submit('userForm')" :loading="loading">{{$t('message.common.confirm')}}</el-button>
        </div>
    </div>
</template>

<script>
import { getAddUser, bindUser } from "@/util/api";
import errcode from "@/util/errcode";

export default {
    name: "AddUser",
    data: function() {
        return {
            loading: false,
            pubKey: false,
            rivKey: true,
            userForm: {
                name: "",
                explain: "",
                publicKey: ""
            },
            timeGranularity: "RIV",
            rules: {
                name: [
                    {
                        required: true,
                        message: this.$i18n.t('message.user.inputUserName'),
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 12,
                        message: this.$i18n.t('message.login.char1_12Alert'),
                        trigger: "blur"
                    }
                ],
                publicKey: [
                    {
                        required: true,
                        message: this.$i18n.t('message.user.inputPublicKeyMsg'),
                        trigger: "blur"
                    }
                ]
            },
            groupId: localStorage.getItem("groupId")
        };
    },
    methods: {
        changeKey: function() {
            let type = this.timeGranularity
            this.userForm = {
                name: "",
                explain: "",
                publicKey: ""
            };
            switch (type) {
                case "PUB":
                    this.pubKey = true;
                    this.rivKey = false;
                    break;

                case "RIV":
                    this.pubKey = false;
                    this.rivKey = true;
                    break;
            }
        },
        modelClose: function() {
            this.userForm = Object.assign({
                name: "",
                publicKey: "",
                explain: ""
            });
            this.pubKey = true;
            this.loading = false;
            this.$store.state.creatUserVisible = false;
        },
        submit: function(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$confirm(this.$i18n.t('message.common.affirmSubmit'), {
                        confirmButtonText: this.$i18n.t('message.common.affirm'),
                        cancelButtonText: this.$i18n.t('message.common.cancel'),
                        center: true
                    })
                        .then(() => {
                            this.loading = true;
                            if (this.pubKey) {
                                this.getBindUser();
                            } else {
                                this.addUser();
                            }
                        })
                        .catch(() => {
                            this.modelClose();
                        });
                } else {
                    return false;
                }
            });
        },
        addUser: function() {
            let reqData = {
                groupId: this.groupId,
                userName: this.userForm.name,
                description: this.userForm.explain || ""
            };
            getAddUser(reqData)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.$emit("success");
                        this.$message({
                            type: "success",
                            message: this.$i18n.t('message.user.addUserSuc')
                        });
                        this.$emit("creatUserClose");
                        this.modelClose();
                    } else {
                        this.modelClose();
                        this.$message({
                            type: "error",
                            message: errcode.errCode[res.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: this.$i18n.t('message.user.addUserFail')
                    });
                    this.modelClose();
                });
        },
        getBindUser() {
            let reqData = {
                userName: this.userForm.name,
                publicKey: this.userForm.publicKey,
                groupId: this.groupId,
                description: this.userForm.explain || ""
            };
            bindUser(reqData)
                .then(res => {
                    this.loading = false;
                    if (res.data.code == 0) {
                        this.$message({
                            type: "success",
                            message: this.$i18n.t('message.user.addUserSuc')
                        });
                        this.$emit("bindUserClose");
                        this.modelClose();
                    } else {
                        this.modelClose();
                        this.$message({
                            type: "error",
                            message: errcode.errCode[res.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.modelClose();
                    this.$message({
                        type: "error",
                        message: this.$i18n.t('message.user.addUserFail')
                    });
                });
        }
    }
};
</script>
<style scoped>
.text-center{
    margin:15px;
}
.key-dialog {
    margin-top: 0px;
}
.dialog-footer {
    text-align: center;
    margin-top: 15px;
    margin-right: 20px;
    padding-bottom: 5px;
}
.radio-key {
    cursor: context-menu;
    font-size: 14px;
}
.base-span-key {
    margin-left: 8px;
    color: #00122c;
}
.pub-key {
    margin-left: 30px;
}
.riv-key {
    margin-left: 50px;
}

.divide-line {
    border: 1px solid #e7ebf0;
    margin-left: 30px;
    width: 514px;
    margin-top: 15px;
    margin-bottom: 25px;
}
</style>
