<template>
    <div class="contentClass">
        <div >
            <div class="rightDetailItem">
               <span class="showMsgSpan"><span style="color:black;">{{$t('message.templateManagement.version')}}</span> ：{{templateDialogOptions.version}}</span> 
            </div>
            <div class="rightDetailItem">
               <span class="showMsgSpan"><span style="color:black;">{{$t('message.templateManagement.templateType')}}</span> ：{{templateDialogOptions.type}}</span> 
            </div>
            <div class="rightDetailItem">
               <span class="showMsgSpan"><span style="color:black;">{{$t('message.common.createTime')}}</span> ：{{templateDialogOptions.created_at}}</span> 
            </div>
            <!-- <div class="rightDetailItem">
               <span class="showMsgSpan"><span style="color:black;">{{$t('message.templateManagement.blongAccount')}}</span> ：{{templateDialogOptions.admin_account}}</span> 
            </div> -->
            <!-- <div class="rightDetailItem">
               <span class="showMsgSpan"><span style="color:black;">{{$t('message.templateManagement.address')}}</span> ：{{templateDialogOptions.address}}</span> 
            </div> -->
            <div class="rightDetailItem">
                <span class="showMsgSpan"><span style="color:black;">{{'Json Scheme'}} ：</span></span>
                <el-input
                :readonly="true"
                type="textarea"
                :rows="5"
                :placeholder="$t('message.templateManagement.noData')"
                v-model="templateDialogOptions.json_schema">
                </el-input>
            </div>
        </div>
<!--         
        
        <div class="dialog-footer">
            <el-button @click="modelClose">{{$t('message.common.cancel')}}</el-button>
            <el-button type="primary" @click="submit" :loading="loading">{{$t('message.common.confirm')}}</el-button>
        </div> -->
    </div>
</template>

<script>
import {

} from "@/util/api";

export default {
    name: "templateDialog",
    props: {
        templateDialogOptions: {
            type: Object
        }
    },
    watch: {
        
    },
    data() {
        return {
            loading: false,
            textarea:"",
            inputType: "password",
        };
    },
    mounted() {

    },
    methods: {
        modelClose: function() {
            this.$emit("close", false);
        },
        submit: function() {
            this.modelClose();
        },

    }
};
</script>

<style scoped>
.contentClass{
    vertical-align: top;
    padding: 10px 30px 20px 40px;
}
.showMsgSpan{
    position: relative;
    display: inline-block;
    width:100%;
    word-wrap: break-word;
}
.rightDetailItem{
        display: inline-block;
        position: relative;
        width: 100%;
    }
.schemeClass{
    position: relative;
    margin-bottom: 10px;
}
.el-textarea{
    margin-top: 10px !important;
}
.dialog-footer {
    text-align: right;
    margin-right: -5px;
    padding-bottom: 20px;
    padding-top: 12px;
}
.isNone {
    display: none;
}
.isShow {
    display: block;
}
.demo-ruleForm >>> .el-form-item__error {
    padding-top: 0
}
</style>