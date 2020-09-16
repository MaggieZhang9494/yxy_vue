<template>
    <div>
       <el-dialog v-dialogDrag  :title="$t('message.contractIDE.loadContract')" :visible.sync="editorDialog" @close="modelClose" width="450px">
           <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="$t('message.contractIDE.contractAddress')" prop="adr">
                    <el-input size="mini" v-model="ruleForm.adr" maxlength="150"></el-input>
                </el-form-item>
           </el-form>
           <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit('ruleForm')">{{$t('message.common.confirm')}}</el-button>
            </div>
       </el-dialog> 
    </div>
</template>

<script>
export default {
    name: "uploadAddress",
    props: ['show'],
    data: function(){
        return {
            ruleForm: {
                adr: "",
            },
            editorDialog: this.show,
            rules: {
                adr: [
                    {
                        required: true,
                        message: this.$i18n.t('message.contractIDE.inputConName'),
                        trigger: "blur"
                    },
                    {
                        pattern: /^[A-Za-z0-9_]+$/,
                        message: this.$i18n.t('message.contractIDE.nameInconformity'),
                        trigger: "blur"
                    }
                ]
            }

        }
    },
    methods: {
        modelClose: function(){
            this.$emit("close")
        },
        submit: function(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$emit("success",this.ruleForm.adr);
                    this.modelClose()
                } else {
                    return false;
                }
            })
        }
    }
}
</script>

<style>

</style>

