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
    <div>
        <el-dialog :title="$t('message.contractIDE.chooseCatalog')" :visible.sync="dialogVisible" :before-close="close" class="dialog-wrapper" width="433px" :center="true">
            <div>
                <el-form :model="folderFrom" :rules="rules" ref="folderFrom" label-width="100px" class="demo-ruleForm">
                    <el-form-item :label="$t('message.contractIDE.folderName')" prop="folderName" style="width:330px">
                        <el-select v-model="folderFrom.folderName" :placeholder="$t('message.common.choose')" class="block-network">
                            <el-option
                            v-for="item in options"
                            :key="item.folderName"
                            :label="item.folderName"
                            :value="item.folderName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="close" >{{$t('message.common.cancel')}}</el-button>
                <el-button type="primary" @click="submit('folderFrom')">{{$t('message.common.confirm')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "selectCatalog",
    props: ['show'],
    data: function(){
        return {
            options: [],
            folderFrom: {
                folderName: ""
            },
            rules: {
                folderName: [
                    {
                        required: true,
                        message: this.$i18n.t('message.contractIDE.chooseFolder'),
                        trigger: "blur"
                    }
                ]
            },
            dialogVisible: this.show
        }
    },
    mounted: function(){
        this.changeOptions();
    },
    methods: {
         changeOptions: function(){
            this.options = [{
                folderName: "/",
                folderId: 1,
            }];
            if(localStorage.getItem("folderList")){
                let arry = JSON.parse(localStorage.getItem("folderList"));
                for(let i = 0; i < arry.length; i++){
                    if(arry[i].groupId == localStorage.getItem("groupId")){
                        this.options.push(arry[i])
                    }
                }
            }
            this.folderFrom.folderName = this.options[0].folderName
        },
        submit: function(formName){
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$emit("success",this.folderFrom.folderName)
                }else{
                    return false
                }
            })
        },
        close: function(){
            this.$emit("close")
        }
    }
}
</script>

