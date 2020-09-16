
<template>
    <div class="account-wrapper">
        <content-head :headTitle="'message.menuName.templateUpload'" :headTitlePath="{path:'/templateUpload'}"></content-head>
        <div class="module-wrapper">
            <div class="templateMsg">
                <el-form :model="templateForm" label-width="150px">
                    <el-form-item :label="$t('message.templateManagement.version')+' :'">
                        <el-input size="mini" class="inputClass" v-model="templateForm.version" :placeholder="$t('message.templateManagement.inputVersion')" maxlength="12"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.templateManagement.templateType')+' :'">
                        <el-select size="mini" v-model="templateForm.type" :placeholder="$t('message.common.choose')">
                            <el-option v-for="item in templateTypeList" :key="item.value" :label="item.node" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item :label="$t('message.templateManagement.blongAccount')+' :'">
                        <el-select size="mini" v-model="templateForm.admin_account" :placeholder="$t('message.common.choose')">
                            <el-option v-for="item in blongsAccList" :key="item.value" :label="item.node" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="Json Schema :">
                        <el-upload
                            class="upload"
                            :auto-upload="false"
                            :on-change="elInFile"
                            accept="json"
                            action=""
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            multiple
                            :limit="1"
                            :on-exceed="handleExceed"
                            :file-list="fileList">
                            <el-button size="mini" type="nomal" icon="el-icon-upload2">{{$t('message.templateManagement.upload')}}</el-button>
                            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                        </el-upload>
                    </el-form-item>
                </el-form>
                
            </div>
            <div style="position: relative;padding: 20px 0px 20px 0px;display: flex; align-items: center;justify-content: center;">
                <el-button @click="submit" type="primary" size="mini" :loading="loading">{{$t('message.common.submit')}}</el-button>
            </div>
        </div>
        <!-- <v-load-dialog v-show="loading" :dialogVisible="loading" :isShowDeleteBtn="false"> </v-load-dialog> -->
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import { addTemplate, getSchemaTypeList, getBlongsAccList } from "@/util/api";
import { isNullData, isJSONStr} from "@/util/util";
import LoadDialog from "@/components/loadingDialog";

export default {
    name: "templateUpload",
    components: {
        contentHead,
        "v-load-dialog":LoadDialog,
    },
    data() {
        return {
            loading: false,
            templateForm:{
                type:"",
                jsonSchema:null,
                version:"",
                admin_account:"",
                account:localStorage.getItem("user"),
            },
            templateTypeList:[
                // {
                //     node:"进口",
                //     value:"进口",
                // }
            ],
            fileList:[],
            blongsAccList:[],//所属管理员帐号列表
        };
    },
    mounted() {
        let _this = this;
        _this.getTypeList();
        // _this.getBlongsAcc();
    },
    methods: {
        isVerifyPass(params){
            if(!params){
                this.$message.error(this.$i18n.t('message.common.noParamsAlert'))
                return false;
            };

            if(isNullData(params.version)){
                this.$message.error(this.$i18n.t('message.templateManagement.noVersionAlert'))
                return false;
            }

            if(isNullData(params.type)){
                this.$message.error(this.$i18n.t('message.templateManagement.noTypeAlert'))
                return false;
            }

            // if(isNullData(params.admin_account)){
            //     this.$message.error(this.$i18n.t('message.templateManagement.noAccountAlert'))
            //     return false;
            // }

            if(isNullData(params.jsonSchema)){
                this.$message.error(this.$i18n.t('message.templateManagement.noFileAlert'))
                return false;
            }

            return true;
        },
        getTypeList(){
            getSchemaTypeList().then(res => {
                if (res.data.code === 0) {
                    this.templateTypeList = res.data.data;
                } else {
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
                    });
                }
            })
            .catch(err => {
                let message = this.$i18n.t('message.common.systemError');
					if(err && err.data && err.data.code){
						message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
					}
					this.$message({
						type: "error",
						message: message
					});
            });
        },
        /**
         * 获取所属管理员帐号列表
         */
        getBlongsAcc(){
            getBlongsAccList({}).then(res => {
                if (res.data.code === 0) {
                    this.blongsAccList = res.data.data;
                } else {
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
                    });
                }
            })
            .catch(err => {
                let message = this.$i18n.t('message.common.systemError');
					if(err && err.data && err.data.code){
						message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
					}
					this.$message({
						type: "error",
						message: message
					});
            });
        },
        /**
         * 模板信息提交
         */
        submit(){
            if(!this.isVerifyPass(this.templateForm)){
                return;
            }

            this.loading = true;
            addTemplate(this.templateForm).then(res=>{
                this.loading = false;
                if (res.data.code === 0) {
                    this.templateForm = {};
                    this.fileList = [];
                    this.$message({
                        type: "success",
                        message: this.$i18n.t('message.templateManagement.addSuccess')
                    });
                } else {
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
                    });
                }
            }).
            catch(err => {
                console.log("error...", err);
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
        },
        /**
         * 文件上传相关
         */
        /**
         * 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用。
		 * @param file {@link Object}：当前上传的文件；
		 * @param fileList {@link Array}：当前文件列表；
         */
        elInFile(file, fileList){
            console.log(file, fileList);
            
            this.templateForm.jsonSchema = file.raw;
            this.read(file.raw);
        },
        /**
		 * 解析
		 * @param f {@link File}
		 */
		read(file) {
			let rd = new FileReader();
            rd.onload = e => {  //this.readAsArrayBuffer函数内，会回调this.onload函数。在这里处理结果
                console.log('e：', e);
				// let cont = rd.reading({encode: 'GBK'});
				// console.log('文件内容：', cont);
			};
			rd.readAsBinaryString(file);
		},
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {

        },
        beforeRemove(file, fileList) {
            return this.$confirm(`${this.$i18n.t('message.common.deletefileAlert')} ${ file.name }？`);
        }
    }
};
</script>

<style scoped>
    .templateMsg{
        position: relative;
        padding: 20px 20px 0px 20px;
        text-align: left;
        display: flex;
        align-items: center; /*定义body的元素垂直居中*/
        justify-content: center; /*定义body的里的元素水平居中*/
    }
    /* .el-input{
        width: 280px;
        height: 25px;
        line-height: 25px;
    }
    .el-input /deep/ .el-input__inner {
        height: 30px;
        line-height: 30px;
    } */
    .el-select{
        width: 280px;
    }
    /* .el-select /deep/ .el-input__inner {
        height: 28px;
        line-height: 28px;
    }
    .el-select /deep/ .el-input__icon {
        line-height: 28px;
    } */
    .el-form-item {
        margin-bottom: 5px;
    }
</style>
