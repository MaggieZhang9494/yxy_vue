<template>
    <div >
        <div class="commonline"></div>
        <div class="formContent">
            <el-form :model="nameForm" :rules="rules" ref="nameForm" :label-width="labelWidth" class="demo-ruleForm">
                <el-form-item :label="$t('message.accountbookManage.accBookName')" prop="groupName" style="width: 250px;">
                    <el-input size="mini" v-model="nameForm.groupName" :placeholder="$t('message.accountbookManage.accBookNameInput')">
                        
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="commonline"></div>
        <div class="dialog-footer">
            <el-button @click="modelClose">{{$t('message.common.cancel')}}</el-button>
            <el-button type="primary" @click="submit('nameForm')" :loading="loading">{{$t('message.common.confirm')}}</el-button>
        </div>
    </div>
</template>

<script>
import Bus from "@/bus"
import {
    editGroupName
} from "@/util/api";
// import { isNullData, isJSONStr} from './util/util'

export default {
    name: "editNameDialog",
    props: {
        editNameDialogOptions: {
            type: Object
        }
    },
    watch: {
        
    },
    data() {
        return {
			loading: false,
			nameForm:{
				groupName:""
			},
            rules: {
                groupName: [
                    {
                        required: true,
                        message: this.$i18n.t('message.accountbookManage.accBookNameInput'),
                        trigger: "blur"
                    }
                ],
            },
            labelWidth:"100px",
        };
    },
    created(){
        if(localStorage.getItem("internationalization") == 'zh-cn'){ /* 中文版本 */
            this.labelWidth = "100px";
        }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
            this.labelWidth = "150px";
        }else{
            this.labelWidth = "100px";
		}
		this.nameForm.groupName = this.editNameDialogOptions.data.name;
    },
    mounted() {
        
    },
    methods: {
        isVerifyPass(params){
            if(!params){
                this.$message.error(this.$i18n.t('message.common.noParamsAlert'))
                return false;
            };

            if(this.isNullData(params.groupName)){
                this.$message.error(this.$i18n.t('message.accountbookManage.accBookNameInput'))
                return false;
            }

            return true;
        },
        modelClose: function() {
            this.$emit("close", false);
        },
        submit: function(formName) {
			let _this = this;
            if(!this.isVerifyPass(this.nameForm)){
                return;
            }

            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$confirm(this.$i18n.t('message.common.affirmSubmit'),this.$i18n.t('message.common.submit'), {
                        confirmButtonText: this.$i18n.t('message.common.affirm'),
                        cancelButtonText: this.$i18n.t('message.common.cancel'),
                    })
                    .then(() => {
                        _this.loading = true;
                        let reqData = {
                            label:_this.nameForm.groupName,
						};
						let groupId = _this.editNameDialogOptions.data.id+'';
                        editGroupName(reqData,groupId).then(res => {
                            _this.loading = false;
                            if (res.data.code === 0) {
								let currentGroupId = localStorage.getItem("groupId");
								if(groupId === currentGroupId){
									localStorage.setItem("groupName", _this.nameForm.groupName);
									Bus.$emit('editGroupName', _this.nameForm.groupName);
								}
			
                                this.$message({
                                    type: "success",
                                    message: this.$i18n.t('message.common.modifySucc')
								});
								this.$emit("success", true);
                                this.modelClose();
                            } else {
                                let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                                this.$message({
                                    type: "error",
                                    message: message
                                });
                            }
                        })
                        .catch(err => {
                            this.loading = false;
                            let message = this.$i18n.t('message.common.systemError');
                            if(err && err.data && err.data.code){
                                message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
                            }
                            this.$message({
                                type: "error",
                                message: message
                            });
                        });
                    })
                    .catch(() => {
                        
                    });
                } else {
                    return false;
                }
            });
        },
    }
};
</script>

<style scoped>
.formContent{
    padding: 20px;
}
.dialog-footer {
    text-align: center;
    margin-right: 20px;
    padding-bottom: 0px;
    padding-top: 10px;
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
.el-input{
    width: 240px;
    height: 25px;
    line-height: 25px;
}
.el-input /deep/ .el-input__inner {
    height: 30px;
    line-height: 30px;
}
.el-input /deep/ .el-input__icon {
    line-height: 30px;
}
.el-input /deep/ .el-input__suffix{
    top:2px;
}

.el-form-item.is-error.is-required{
    margin-bottom: 25px;
    margin-top: 0px;
}
.el-form-item.is-required{
    margin-bottom: 0px;
    margin-top: 0px;
}
.el-form-item{
    margin-bottom: 0px;
    margin-top: 0px;
}

</style>