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
    <div class="fontBg">
        
        <el-dialog :title="$t('message.nodeManagement.nodePreConfig')" :modal="false" :visible.sync="dialogVisible" :before-close="modelClose" class="setfont-dialog-wrapper" width="433px" :center="true" :show-close='false'>
            <div class="commonline"></div>
            <div style="margin:20px;">
                <el-form :model="frontFrom" :rules="rules" ref="frontFrom" :label-width="labelWidth" class="demo-ruleForm">
                    <el-form-item label="IP" prop="ip" style="width:330px">
                        <el-input size="mini" v-model="frontFrom.ip"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.nodeManagement.prepositionalPort')" prop="port" style="width:330px">
                        <el-input size="mini" v-model="frontFrom.port"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.nodeManagement.subsidiaryOrgan')" prop="company" style="width:330px">
                        <el-input size="mini" v-model="frontFrom.company"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="commonline"></div>
            <div slot="footer" class="dialog-footer">
                <el-button v-if='closeVisible' @click="modelClose">{{$t('message.common.cancel')}}</el-button>
                <el-button type="primary" :loading="loading" @click="submit('frontFrom')">{{$t('message.common.confirm')}}</el-button>
            </div>
        </el-dialog>
        
    </div>
</template>
<script>
import { addFront } from "@/util/api"
import errcode from "@/util/errcode";
export default {
    name: "setFront",
    props: ["show", 'showClose'],
    data: function () {
        return {
            loading: false,
            dialogVisible: this.show,
            closeVisible: this.showClose || false,
            frontFrom: {
                ip: "",
                port: "",
                company: "",
            },
            rules: {
                ip: [
                    {
                        required: true,
                        message: this.$i18n.t('message.nodeManagement.inputIpName'),
                        trigger: "blur"
                    },
                    {
                        pattern: /((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/,
                        message: this.$i18n.t('message.nodeManagement.ipRole'),
                        trigger: "blur"
                    }
                ],
                port: [
                    {
                        required: true,
                        message: this.$i18n.t('message.nodeManagement.portName'),
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 12,
                        message: this.$i18n.t('message.nodeManagement.length1_12'),
                        trigger: "blur"
                    },
                    {
                        pattern: /^[0-9]*[1-9][0-9]*$/,
                        message: this.$i18n.t('message.nodeManagement.portRole'),
                        trigger: "blur"
                    }
                ],
                company: [
                    {
                        required: true,
                        message: this.$i18n.t('message.nodeManagement.affiliationInput'),
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 16,
                        message: this.$i18n.t('message.nodeManagement.length1_16'),
                        trigger: "blur"
                    },
                    {
                        pattern: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,20}$/,
                        message: this.$i18n.t('message.nodeManagement.orgInputRole'),
                        trigger: "blur"
                    }
                ]
            },
            labelWidth:"100px",
        }
    },
    created(){
        if(localStorage.getItem("internationalization") == 'zh-cn'){ /* 中文版本 */
            this.labelWidth = "100px";
        }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
            this.labelWidth = "150px";
        }else{
            this.labelWidth = "100px";
        }
    },
    methods: {
        submit: function (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.setFront()
                } else {
                    return false
                }
            })
        },
        setFront: function () {
            let reqData = {
                frontIp: this.frontFrom.ip,
                frontPort: this.frontFrom.port,
                agency: this.frontFrom.company
            }
            addFront(reqData).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.$message({
                        message: this.$i18n.t('message.nodeManagement.addPreSuc'),
                        type: "success"
                    });
                    this.$emit("close")
                } else {
                    this.$message({
                        message: errcode.errCode[res.data.code].cn || this.$i18n.t('message.nodeManagement.addPreFail'),
                        type: "error"
                    });
                }
            }).catch(err => {
                this.loading = false;
                let message = this.$i18n.t('message.common.systemError');
					if(err && err.data && err.data.code){
						message = errcode.errCode.isCN?errcode.errCode[err.data.code].cn:errcode.errCode[err.data.code].en;
					}
					this.$message({
						type: "error",
						message: message
					});
            })
        },
        modelClose: function () {
            this.$emit("close")
        }
    }
}
</script>
<style scoped>
.setfont-dialog-wrapper{
	top: 70px !important;
	height: calc(100% - 70px) !important;
	background-color:rgba(66, 66, 66, 0.26);;
}

</style>
