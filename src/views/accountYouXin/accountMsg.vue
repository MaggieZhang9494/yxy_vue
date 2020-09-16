
<template>
    <div class="account-wrapper">
        <content-head :headTitle="'message.menuName.accountMsg'" :headTitlePath="{path:'/accountMsg'}"></content-head>
        <div class="module-wrapper">
            <div class="accountTitle">
                <span class="lineClass"></span>
                <span>{{$t('message.accountManagement.accountMsg')}}</span>
            </div>
            <div class="accountMsg">
                <el-form :label-position="labelPosition" label-width="200px">
                    <el-form-item :label="$t('message.accountManagement.head')+' :'">
                        <el-upload
                            class="upload"
                            :auto-upload="false"
                            :on-change="elInFile"
                            accept=".jpg,.png"
                            action=""
                            :multiple="false"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :limit="1"
                            :on-exceed="handleExceed"
                            :show-file-list="false"
                            :file-list="fileList">
                            <el-avatar style="position: relative;top: 10px;background-color: white;" shape="circle" :size="80" fit="contain" :src="headUrl">
                                <img src="../../../static/image/defaultHead.png"/>
                            </el-avatar>
                            <div slot="tip" class="el-upload__tip">{{$t('message.accountManagement.headDesc')}}</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item :label="$t('message.accountManagement.account')+' :'">
                        <span>{{accountDetail.account}}</span>
                    </el-form-item>
                    <el-form-item :label="$t('message.accountManagement.name')+' :'">
                        <span>{{accountDetail.nick}}</span>
                    </el-form-item>
                    <el-form-item :label="$t('message.accountManagement.role')+' :'">
                        <span>{{accountDetail.role_alias}}</span>
                    </el-form-item>
					<el-form-item :label="$t('message.accountManagement.effectiveDate')+' :'">
                        <span>{{accountDetail.effective_date}}</span>
                    </el-form-item>
					<el-form-item :label="$t('message.accountManagement.expiryDate')+' :'">
                        <span>{{accountDetail.expiration_date}}</span>
                    </el-form-item>
                </el-form>
            </div>
            <div class="accountTitle">
                <span class="lineClass"></span>
                <span>{{$t('message.accountManagement.otherMsg')}}</span>
            </div>
            <div class="accountMsg" style="padding-bottom:20px;">
                <el-form :label-position="labelPosition" label-width="200px">
                    <el-form-item :label="$t('message.accountManagement.affiliatedCompany')+' :'">
						<span v-if="isLookAll==false && accountDetail.customers.length>0" >{{accountDetail.customers[0].company_name}}</span>
                        <span v-if="isLookAll==true" style="display: block;" v-for="(company,index) in accountDetail.customers" :key="index">{{company.company_name}}</span>
						<span v-if="isLookAll==false && accountDetail.customers.length>1" style="color:#1585FF;cursor:pointer;font-size:14px;" @click="lookAll()">{{$t('message.accountManagement.lookAll')}}</span>
                    </el-form-item>
                    <el-form-item :label="$t('message.accountManagement.department')+' :'">
                        <span>{{accountDetail.dept}}</span>
                    </el-form-item>
                    <el-form-item :label="$t('message.accountManagement.duty')+' :'">
                        <span>{{accountDetail.title}}</span>
                    </el-form-item>
                    <el-form-item :label="$t('message.accountManagement.telephone')+' :'">
                        <span>{{accountDetail.work_tel}}</span>
                    </el-form-item>
                    <el-form-item :label="$t('message.accountManagement.phoneNumber')+' :'">
                        <span>{{accountDetail.cell_phone_number}}</span>
                    </el-form-item>
                    <el-form-item :label="$t('message.accountManagement.email')+' :'">
                        <span>{{accountDetail.email}}</span>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import { getAccountDetail,editHeadIcon } from "@/util/api";
// 导入预览组件
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { mapState, mapActions } from 'vuex'
export default {
    name: "accountMsg",
    components: {
        contentHead,
        "el-image-viewer":ElImageViewer
    },
    data() {
        return {
            loading: false,
            labelPosition:"right",

            headUrl:"",//头像地址

            //营业执照显示
            showViewerLicense:false,
            previewLicenseList:[],//预览营业执照路径
            fileList:[],//上传组件关联数据

            //区块链存证章显示
            showViewerSeal:false,
            previewSealList:[],//预览区块链存证章路径
            sealList:[],//上传组件关联数据

			accountDetail:{},
			
			isLookAll:false,//是否查看全部
        };
    },
    created(){
        this.getAccountMsg();
    },
    mounted() {
        
    },
    methods: {
        ...mapActions([
            'setHeadShowUrl'
            ]),
        success(){
            this.getAccountMsg()
        },
        getAccountMsg() {
            this.loading = true;
            let reqData = {
                account:localStorage.getItem("user"),
            };
            let reqQuery = {};
            getAccountDetail(reqData,reqQuery).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    this.accountDetail = res.data.data;
                    if(this.isNullData(this.accountDetail.business_license_show)){
                        this.accountDetail.business_license_show = "../../../static/image/default.png";
                        this.accountDetail.seal_show = "../../../static/image/default.png";
					}
					// for (let index = 0; index < 10; index++) {
					// 	this.accountDetail.customers.push({id:10+index, company_name:"测试公司"+index});
					// }

                    this.headUrl = this.accountDetail.avatar_show;
                    localStorage.setItem("headImgUrl", this.headUrl)
                    this.previewLicenseList.push(this.isNullData(this.accountDetail.business_license_show)?"":this.accountDetail.business_license_show);
                    this.previewSealList.push(this.isNullData(this.accountDetail.seal_show)?"":this.accountDetail.seal_show);
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

        touchLicensePreview(){
            this.showViewerLicense = true;
        },
        closeLicenseViewer(){
            this.showViewerLicense = false;
        },
        touchSealPreview(){
            this.showViewerSeal = true;
        },
        closeSealViewer(){
            this.showViewerSeal = false;
        },
        
        /**
         * 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用。
		 * @param file {@link Object}：当前上传的文件；
		 * @param fileList {@link Array}：当前文件列表；
         */
        elInFile(file, fileList){
            console.log(file, fileList);
            console.log("选择的文件对象...",file.raw);
            this.fileList = [];
            // this.read(file.raw);

            //修改头像
            let data = {
                account:this.accountDetail.account,
            }
            let param = {
                avatar:file.raw,
            }
            editHeadIcon(data,param).then(res => {
                if (res.data.code === 0) {
                    // this.read(file.raw);
                    this.accountDetail.avatar = res.data.data.path;
                    localStorage.setItem("headImgUrl", res.data.data.show);
                    this.headUrl = res.data.data.show;
                    this.setHeadShowUrl(res.data.data.show);
                    this.$message({
                        type: "success",
                        message: this.$i18n.t('message.accountManagement.headChangeSuc')
                    });
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
		read(file) {
			let rd = new FileReader();
            rd.onload = e => {  //this.readAsArrayBuffer函数内，会回调this.onload函数。在这里处理结果
                console.log('e：', e);
                this.headUrl = e.target.result;
				// let cont = rd.reading({encode: 'GBK'});
				// console.log('文件内容：', cont);
			};
			rd.readAsDataURL(file);
		},
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            console.log("handleExceed ",files);
            // this.read(files[0]);
        },
        beforeFileUpload(file) {
            // const isJPG = file.type === 'image/jpeg' || file.type === 'application/pdf';
            // const isLt2M = file.size / 1024 / 1024 < 2;

            // if (!isJPG) {
            // this.$message.error(this.$i18n.t('message.accountManagement.businessLicenseTypeAlert'));
            // }
            // if (!isLt2M) {
            // this.$message.error(this.$i18n.t('message.accountManagement.businessLicenseSizeAlert'));
            // }
            // return isJPG && isLt2M;
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`${this.$i18n.t('message.common.deletefileAlert')} ${ file.name }？`);
        },
        errorHandler() {
            return true
		},
		
		lookAll(){
			this.isLookAll = !this.isLookAll;
		}
    }
};
</script>

<style scoped>
    .accountTitle{
        position:relative; 
        left: 40%;
        padding: 20px 20px 0px 20px;
    }
    .lineClass{
        position:relative; 
        margin:0px 5px; 
        padding-right:5px;
        background-color: #1585FF;
    }
    .el-form-item{
		margin-bottom: 0px;
    }
    
    .accountMsg{
        position: relative;
        padding: 20px 0px 0px 0px;
        width: 50%;
        left:calc(50% - 200px);
    }
    /* .search-part-left-btn{
        height: 30px;
        display: flex;
        float: right;
        align-items: center;
        justify-content: center;
    } */
    .previewDiv{
        position: relative;
        width: 80px;
        height: 20px;
        bottom: 22px;
        background-color: rgba(0, 0, 0, 0.3)
    }
</style>
