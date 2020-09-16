
<template>
    <div style="padding:0px 0px;height:auto;overflow:auto;overflow-x:hidden;">
        <div class="commonline"></div>
        <!-- style="padding:0px 20px;height:700px;overflow:auto;overflow-x:hidden;" -->
        <div >
            <div class="clientTitle">
                <span class="lineClass"></span>
                <span>{{$t('message.accountManagement.clientMsg')}}</span>
            </div>
            <div class="clientMsg">
                <el-form :model="clientForm" ref="clientForm" :label-position="labelPosition" :rules="rules" label-width="350px">
                    <el-form-item :label="$t('message.accountManagement.companyCNName')+' :'" prop="company_name">
                        <el-input size="mini" v-model="clientForm.company_name" :placeholder="$t('message.accountManagement.companyCNNameInput')" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.accountManagement.companyENName')+' :'" prop="company_name_en">
                        <el-input size="mini" v-model="clientForm.company_name_en" :placeholder="$t('message.accountManagement.companyENNameInput')" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.accountManagement.USCC')+' :'" prop="social_credit_code">
                        <el-input size="mini" v-model="clientForm.social_credit_code" :placeholder="$t('message.accountManagement.USCCInput')" maxlength="30"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.accountManagement.businessAddress')+' :'">
                        <el-input size="mini" v-model="clientForm.business_address" :placeholder="$t('message.accountManagement.businessAddressInput')" maxlength="100"></el-input>
                    </el-form-item>
					<el-form-item :label="$t('message.accountManagement.industry')+' :'">
                        <select-tree :treeData='industryList' nodeKey="node" :defaultProps="defaultProp" :isAllowSelectParentNode="false" :showSelectValue="clientForm.industry" :selectValue.sync="clientForm.industry"></select-tree>
                    </el-form-item>
                    <el-form-item :label="$t('message.accountManagement.businessLicense')+' :'" style="width:500px">
                        <el-upload
                            class="upload"
                            :auto-upload="false"
                            :on-change="elInFile"
                            accept=".jpg,.png,.pdf,.jpeg"
                            action=""
                            :disabled="headDisabled"
                            :multiple="false"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :limit="1"
                            :on-exceed="handleExceed"
                            :show-file-list="false"
                            :file-list="fileList">
                            <el-image 
                                style="position: relative;width:80px;height:80px;top: 10px;background-color: white;border-radius: 5px;"
                                fit="contain"
                                :lazy='true'
                                :src="headLocalUrl" 
                                @click="touchPreview">
                            </el-image>
                            <div  v-show="headDisabled" class="previewDiv" @click="touchPreview">
                                <i class="iconfont wbs-fangda" style="position: relative;color: white;left: 30px;bottom: 7px;"></i>
                            </div>
                            <el-image-viewer v-show="showViewer" :on-close="closeViewer" :url-list="previewImageList" />
                            <el-image v-show="headDisabled" style="position:absolute;width:20px;height:20px;left:70px;top:2px;"
                                 src="../../../../../static/image/deleteIcon.png" @click="deleteHeadIcon" circle></el-image>
                            <span slot="tip" :class="[headDisabled? 'tipUp': 'tipDown']">{{$t('message.accountManagement.businessLicenseDesc')}}</span>
                        </el-upload>
                    </el-form-item>
                    <el-form-item :label="$t('message.accountManagement.blockchainSeal')+' :'" style="width:500px">
                        <el-upload
                            class="uploadSeal"
                            :auto-upload="false"
                            :on-change="elInSealFile"
                            accept=".jpg,.png,.jpeg"
                            action=""
                            :disabled="sealDisabled"
                            :multiple="false"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :limit="1"
                            :on-exceed="handleExceed"
                            :show-file-list="false"
                            :file-list="sealList">
                            <el-image 
                                style="position: relative;width:80px;height:80px;top: 10px;background-color: white;border-radius: 5px;"
                                fit="contain"
                                :lazy='true'
                                :src="sealLocalUrl" 
                                @click="touchSealPreview">
                            </el-image>
                            <div  v-show="sealDisabled" class="previewDiv" @click="touchSealPreview">
                                <i class="iconfont wbs-fangda" style="position: relative;color: white;left: 30px;bottom: 7px;"></i>
                            </div>
                            <el-image-viewer v-show="showSealViewer" comp :on-close="closeSealViewer" :url-list="previewSealList" />
                            <el-image v-show="sealDisabled" style="position:absolute;width:20px;height:20px;left:70px;top:2px;"
                                 src="../../../../../static/image/deleteIcon.png" @click="deleteSealIcon" circle></el-image>
                            <span slot="tip" :class="[sealDisabled? 'tipSealUp': isCn==true?'tipSealDown':'EnTipSealDown']">{{$t('message.accountManagement.blockchainSealDesc')}}</span>
                        </el-upload>
                        <div style="width:100%;height:10px;"></div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="commonline"></div>
        
        <div class="dialog-footer">
            <el-button @click="modelClose">{{$t('message.common.cancel')}}</el-button>
            <el-button type="primary" @click="submit('clientForm')" :loading="loading">{{$t('message.common.confirm')}}</el-button>
        </div>
    </div>
</template>

<script>
import {
    roleList,
    addClient,
    modifyClient,
    getMemberLevelList,
    getIndustryList,
    uploadBusinessLicense,
    uploadBlockchainSeal,
    getKeyGenerateList,
} from "@/util/api";
import selectTree from "@/components/select-tree";
// 导入预览组件
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
const sha256 = require("js-sha256").sha256;
export default {
    name: "clientDialog",
    components:{
        "select-tree":selectTree,
        "el-image-viewer":ElImageViewer
    },
    props: {
        clientDialogOptions: {
            type: Object
        }
    },
    watch: {
        "clientDialogOptions.type": {
            handler(val) {
                this.type = val;
                switch (val) {
                    case "create":
                        this.clientForm = {
                            company_name: "",
                            company_name_en: "",
                            social_credit_code: "",
                            business_address: "",
                            industry: "",
                            business_license:"",
                            business_license_show:"",
                            seal:"",
                            seal_show:"",
                            create_er:localStorage.getItem("user"),
                            disabled: false,
                            mDisabled: false,
                            dShow: true,
                            mShow: true,
                        };
                        break;
                    case "modify":
                        this.clientForm = {
							id:this.clientDialogOptions.data["id"],
                            company_name: this.clientDialogOptions.data["company_name"],
                            company_name_en: this.clientDialogOptions.data["company_name_en"],
                            social_credit_code:this.clientDialogOptions.data["social_credit_code"],
                            business_address:this.clientDialogOptions.data["business_address"],
                            industry:this.clientDialogOptions.data["industry"],
                            business_license:this.clientDialogOptions.data["business_license"],
                            business_license_show:this.clientDialogOptions.data["business_license_show"],
                            seal:this.clientDialogOptions.data["seal"],
                            seal_show:this.clientDialogOptions.data["seal_show"],
                            create_er:this.clientDialogOptions.data["create_er"],
                            disabled: true,
                            mDisabled: false,
                            dShow: true,
                            mShow: false,
                        };
                        break;
                }
            },
            deep: true,
            immediate: true
        }
    },
    data() {
        return {
            type: this.clientDialogOptions.type,
            loading: false,
            isCn:localStorage.getItem("internationalization")=="zh-cn"?true:false,
            clientForm: {},
            roleList: [],
            labelPosition:"right",

            //营业执照上传处理相关
            headDisabled:false,
            headLocalUrl:"",//本地营业执照地址
            showViewer:false,//是否显示预览图
            previewImageList:[],//预览营业执照图片数组
            fileList:[],//上传营业执照组件关联数据

            //区块链存证章上传处理相关
            sealDisabled:false,
            sealLocalUrl:"",//本地区块链存证章地址
            showSealViewer:false,//是否显示预览图
            previewSealList:[],//预览区块链存证章图片数组
            sealList:[],//上传区块链存证章组件关联数据

			industryList:[],
			//状态
            defaultProp: {
                children: 'children',
                label: 'node'
            },
            
            rules: {
                company_name: [
                    {
                        required: true,
                        message: this.$i18n.t('message.accountManagement.companyCNNameInput'),
                        trigger: "blur"
                    }
                ],
                company_name_en: [
                    {
                        required: true,
                        message: this.$i18n.t('message.accountManagement.companyENNameInput'),
                        trigger: "blur"
                    }
                ],
                social_credit_code: [
                    {
                        required: true,
                        message: this.$i18n.t('message.accountManagement.USCCInput'),
                        trigger: "blur"
                    },
                    {
                        pattern: /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g,
                        message: this.$i18n.t('message.accountManagement.USCCInputAlert'),
                        trigger: "blur"
                    }
                ],
            },
        };
    },
    created(){
        console.log("this.clientDialogOptions.data.....", this.clientDialogOptions.data);
        
        //处理初始化显示数据
        this.dealInitShowData();
    },
    mounted() {
        //获取行业信息
        this.getIndustry();
    },
    methods: {
        //处理初始化显示数据
        dealInitShowData(){
            this.headDisabled = this.isNullData(this.clientDialogOptions.data["business_license_show"])?false:true;
            this.sealDisabled = this.isNullData(this.clientDialogOptions.data["seal_show"])?false:true;
            if(this.type == 'modify'){
                if(this.isNullData(this.clientDialogOptions.data["business_license_show"])){
                    this.headLocalUrl = "../../../../../static/image/add.png";
                }else{
                    this.previewImageList.push(this.clientDialogOptions.data["business_license_show"]);
                    this.headLocalUrl = this.clientDialogOptions.data["business_license_show"];
                }

                if(this.isNullData(this.clientDialogOptions.data["seal_show"])){
                    this.sealLocalUrl = "../../../../../static/image/add.png";
                }else{
                    this.previewSealList.push(this.clientDialogOptions.data["seal_show"]);
                    this.sealLocalUrl = this.clientDialogOptions.data["seal_show"];
				}
				
                this.clientForm.industry = String(this.clientDialogOptions.data["industry"]);

            }else{
                this.headLocalUrl = "../../../../../static/image/add.png";
                this.sealLocalUrl = "../../../../../static/image/add.png";
            }
        },
        isVerifyPass(params){
            if(!params){
                this.$message.error(this.$i18n.t('message.common.noParamsAlert'))
                return false;
            };

            if(this.isNullData(params.company_name)){
                this.$message.error(this.$i18n.t('message.accountManagement.companyCNNameInput'))
                return false;
            }
            if(this.isNullData(params.company_name_en)){
                this.$message.error(this.$i18n.t('message.accountManagement.companyENNameInput'))
                return false;
            }
            if(this.isNullData(params.social_credit_code)){
                this.$message.error(this.$i18n.t('message.accountManagement.USCCInput'))
                return false;
            }
            if(this.isNullData(params.create_er)){
                this.$message.error(this.$i18n.t('message.accountManagement.creatorAlert'))
                return false;
            }

            return true;
        },
        modelClose: function() {
            this.$emit("close", false);
        },
        submit: function(formName) {

            if(!this.isVerifyPass(this.clientForm)){
                return;
            }
            console.log("this.clientForm...",this.clientForm);

            this.$confirm(this.$i18n.t('message.common.affirmSubmit'),this.$i18n.t('message.common.submit'), {
                confirmButtonText: this.$i18n.t('message.common.affirm'),
                cancelButtonText: this.$i18n.t('message.common.cancel'),
            })
            .then(() => {
                this.loading = true;
                this.getAllClientInfo();
            })
            .catch(() => {
                // this.modelClose();
            });
            // this.$refs[formName].validate(valid => {
            //     if (valid) {
            //         this.$confirm(this.$i18n.t('message.common.affirmSubmit'), {
            //             confirmButtonText: this.$i18n.t('message.common.affirm'),
            //             cancelButtonText: this.$i18n.t('message.common.cancel'),
            //             center: true
            //         })
            //         .then(() => {
            //             this.loading = true;
            //             this.getAllClientInfo();
            //         })
            //         .catch(() => {
            //             this.modelClose();
            //         });
            //     } else {
            //         return false;
            //     }
            // });
        },
        /**
         * 获取行业信息
         */
        getIndustry: function() {
            let reqQuery = {};
            getIndustryList(reqQuery).then(res => {
                if (res.data.code === 0) {
                    this.industryList = res.data.data;
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
        getAllClientInfo: function() {
            let type = this.type;
            switch (type) {
                case "create":
                    this.getCreatClientInfo();
                    break;
                case "modify":
                    this.getModifyClientInfo();
                    break;
            }
        },
        getCreatClientInfo: function() {
            // let reqData = {
            //     account: this.clientForm.name,
            //     accountPwd: sha256(this.clientForm.password),
            //     roleId: this.clientForm.role
            // };
            let reqData = this.clientForm;
            delete reqData.disabled
            delete reqData.mDisabled
            delete reqData.dShow
            delete reqData.mShow
            delete reqData.business_license_show
            delete reqData.seal_show
            addClient(reqData, {}).then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.$message({
                            type: "success",
                            message: this.$i18n.t('message.accountManagement.addSucc')
                        });
                        this.modelClose();
                        this.$emit("success");
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
        },
        getModifyClientInfo: function() {
            // let reqData = {
            //     account: this.clientForm.name,
            //     accountPwd: sha256(this.clientForm.password),
            //     roleId: this.clientForm.role
            // };
            let reqData = this.clientForm;
            delete reqData.disabled
            delete reqData.mDisabled
            delete reqData.dShow
            delete reqData.mShow
            delete reqData.business_license_show
            delete reqData.seal_show
            let urlData = {
                customId:this.clientForm.id
			}
			console.log("", this.clientForm);
            modifyClient(reqData, {}, urlData)
            .then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.$message({
                        type: "success",
                        message: this.$i18n.t('message.common.modifySucc')
                    });
                    this.modelClose();
                    this.$emit("success");
                } else {
                    this.modelClose();
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
                    });
                }
            })
            .catch(err => {
                this.modelClose();
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
        showPassword() {
            if(this.inputType === 'password'){
                this.inputType = 'text'
            }else {
                this.inputType = 'password'
            }
        },
        /* 营业执照图片处理相关方法 */
        touchPreview(){
            if(this.headDisabled){
                this.showViewer = true;
            }
            
            console.log("touchPreview");
        },
        closeViewer(){
            this.showViewer = false;
            console.log("closeViewer");
        },
        deleteHeadIcon(){
            console.log("删除图标");
            this.headLocalUrl = "../../../../../static/image/add.png";
            this.fileList = [];
            this.previewImageList = [];
            setTimeout(()=>{
                this.headDisabled = false;
            },100)
            this.clientForm.business_license_show = "";
            this.clientForm.business_license = "";
        },
        /**
         * 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用。
		 * @param file {@link Object}：当前上传的文件；
		 * @param fileList {@link Array}：当前文件列表；
         */
        elInFile(file, fileList){
            console.log(file, fileList);
            console.log("选择的文件对象...",file.raw);
            if(!this.beforeFileUpload(file.raw)){
                this.deleteHeadIcon();
                return;
            }
            console.log("elInFile...",file.raw);
            //上传营业执照
            let param = {
                license:file.raw,
            }
            uploadBusinessLicense(param).then(res => {
                if (res.data.code === 0) {
                    this.headDisabled = true;
                    this.read(file.raw);

                    this.clientForm.business_license = res.data.data.path;
                } else {
					// this.headDisabled = true;
					// this.read(file.raw);
					this.fileList = [];
            this.previewImageList = [];
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
		 * 解析
		 * @param f {@link File}
		 */
		read(file) {
			let rd = new FileReader();
            rd.onload = e => {  //this.readAsArrayBuffer函数内，会回调this.onload函数。在这里处理结果
                console.log('e：', e);
                this.headLocalUrl = e.target.result;
                this.previewImageList.push(this.headLocalUrl);
				// let cont = rd.reading({encode: 'GBK'});
				// console.log('文件内容：', cont);
			};
			rd.readAsDataURL(file);
        },
        beforeFileUpload(file) {
            const isJPG = file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'application/pdf';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error(this.$i18n.t('message.accountManagement.businessLicenseTypeAlert'));
            }
            if (!isLt2M) {
                this.$message.error(this.$i18n.t('message.accountManagement.businessLicenseSizeAlert'));
            }
            return isJPG && isLt2M;
        },

        /* 区块链存证章图片处理相关方法 */
        touchSealPreview(){
            if(this.sealDisabled){
                this.showSealViewer = true;
            }
        },
        closeSealViewer(){
            this.showSealViewer = false;
        },
        deleteSealIcon(){
            console.log("删除图标");
            this.sealLocalUrl = "../../../../../static/image/add.png";
            this.sealList = [];
            this.previewSealList = [];
            setTimeout(()=>{
                this.sealDisabled = false;
            },100)
            this.clientForm.seal_show = "";
            this.clientForm.seal = "";
        },
        /**
         * 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用。
		 * @param file {@link Object}：当前上传的文件；
		 * @param fileList {@link Array}：当前文件列表；
         */
        elInSealFile(file, fileList){
            console.log(file, fileList);
            console.log("选择的文件对象...",file.raw);

            console.log("elInSealFile...",file.raw);
            if(!this.beforeSealFileUpload(file.raw)){
                this.deleteSealIcon();
                return;
            }
            //上传区块链存证章
            let param = {
                seal:file.raw,
            }
            uploadBlockchainSeal(param).then(res => {
                if (res.data.code === 0) {
                    this.sealDisabled = true;
                    this.readSeal(file.raw);

                    this.clientForm.seal = res.data.data.path;
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
		 * 解析
		 * @param f {@link File}
		 */
		readSeal(file) {
			let rd = new FileReader();
            rd.onload = e => {  //this.readAsArrayBuffer函数内，会回调this.onload函数。在这里处理结果
                console.log('e：', e);
                this.sealLocalUrl = e.target.result;
                this.previewSealList.push(this.sealLocalUrl);
				// let cont = rd.reading({encode: 'GBK'});
				// console.log('文件内容：', cont);
			};
			rd.readAsDataURL(file);
        },
        beforeSealFileUpload(file) {
            const isJPG = file.type == 'image/jpeg' || file.type == 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error(this.$i18n.t('message.accountManagement.blockchainSealTypeAlert'));
            }
            if (!isLt2M) {
                this.$message.error(this.$i18n.t('message.accountManagement.blockchainSealSizeAlert'));
            }
            return isJPG && isLt2M;
        },
        
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log("handlePreview....",file);
        },
        handleExceed(files, fileList) {

        },
        beforeRemove(file, fileList) {
            return this.$confirm(`${this.$i18n.t('message.common.deletefileAlert')} ${ file.name }？`);
        },
    }
};
</script>

<style scoped>
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
    width: 280px;
}
.el-select{
    width: 280px;
}

/* .el-input{
    width: 280px;
    height: 25px;
    line-height: 25px;
}
.el-input /deep/ .el-input__inner {
    height: 30px;
    line-height: 30px;
}
.el-select{
    width: 280px;
}
.el-select /deep/ .el-input__inner {
    height: 30px;
    line-height: 30px;
}
.el-select /deep/ .el-input__icon {
        line-height: 30px;
} */

.clientTitle{
    position:relative; 
    left: 150px;
    padding: 20px 20px 0px 20px;
}
.lineClass{
    position:relative; 
    margin:0px 5px; 
    padding-right:5px;
    background-color: #1585FF;
}
.el-form-item.is-error.is-required{
    margin-bottom: 15px;
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

.clientMsg{
    position: relative;
    padding: 10px 0px 15px 0px;
    width: 80%;
    left:calc(30% - 250px);
}
.previewDiv{
    position: relative;
    width: 80px;
    height: 20px;
    bottom: 22px;
    background-color: rgba(0, 0, 0, 0.3)
}
.el-upload{
    height: 92px;
}
.upload{
    height: 92px;
    width: 400px;
}
.uploadSeal{
    height: 92px;
    width: 400px;
}

.tipUp{
    position: relative;
    left:10px;
    top: -28px;
    color:#ccc;
    font-weight:normal;
}
.tipDown{
    position: relative;
    left:10px;
    top: 5px;
    color:#ccc;
    font-weight:normal;
}
.tipSealUp{
    position: relative;
    left:10px;
    top: -28px;
    color:#ccc;
    font-weight:normal;
}
/* 中文版本 */
.tipSealDown{
    /* position: relative;
    left:10px;
    top: 0px; */
    position: relative;
    display: inline-block;
    left: 90px;
    top: -30px;
    width: calc(100% - 60px);
    color:#ccc;
    font-weight:normal;
}
/* 英文版本 */
.EnTipSealDown{
    /* position: relative;
    left:10px;
    top: 0px; */
    position: relative;
    display: inline-block;
    left: 90px;
    top: -60px;
    width: calc(100% - 60px);
    color:#ccc;
    font-weight:normal;
}
</style>