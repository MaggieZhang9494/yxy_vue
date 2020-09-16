<template>
    <div style="padding:0px 0px;height:auto;overflow:auto;overflow-x:hidden;">
        <div class="commonline"></div>
        <!-- style="padding:0px 20px;height:700px;overflow:auto;overflow-x:hidden;" -->
        <div >
            <div class="accountTitle">
                <span class="lineClass"></span>
                <span>{{$t('message.accountManagement.accountMsg')}}</span>
            </div>
            <div class="accountMsg">
                <el-form :model="accountForm" ref="accountForm" :label-position="labelPosition" :rules="rules1" label-width="350px">
                    <el-form-item v-if="accountDialogOptions.type=='create' || accountDialogOptions.type=='clone'" :label="$t('message.accountManagement.account')+' :'" prop="account">
                        <el-input size="mini" class="inputClass" v-model="accountForm.account" :placeholder="$t('message.accountManagement.accountInput')" maxlength="12"></el-input>
                    </el-form-item>
					<el-form-item v-else :label="$t('message.accountManagement.account')+' :'">
                        <span>{{accountForm.account}}</span>
                    </el-form-item>
                    <!-- v-show="accountDialogOptions.type=='create'" -->
                    <el-form-item :label="$t('message.login.password')+' :'" prop="password" v-show="accountDialogOptions.type=='create' || accountDialogOptions.type=='clone'">
                        <el-input size="mini" class="inputClass" v-model="accountForm.password" :placeholder="$t('message.accountManagement.passwordInput')" maxlength="12"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.accountManagement.name')+' :'" prop="nick">
                        <el-input size="mini" v-model="accountForm.nick" :placeholder="$t('message.accountManagement.nameInput')" maxlength="12"></el-input>
                    </el-form-item>
					<el-form-item :label="$t('message.accountManagement.role')+' :'" prop="state">
                        <el-select v-model="accountForm.role"  size="mini" :placeholder="$t('message.common.choose')">
                            <el-option v-for="item in roleList" :key="item.value" :label="item.node" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('message.accountManagement.status')+' :'" prop="state">
                        <el-select v-model="accountForm.state"  size="mini" :placeholder="$t('message.common.choose')">
                            <el-option v-for="item in statusList" :key="item.value" :label="item.node" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('message.accountManagement.creator')+' :'" v-show="accountDialogOptions.type=='modify'">
                        <span style="font-size:12px;">{{accountForm.create_er}}</span>
                    </el-form-item>
                    <!-- 密钥信息创建及显示 -->
                    <!-- 密钥生成方式显示 -->
                    <el-form-item v-show="accountDialogOptions.type=='create' || accountDialogOptions.type=='clone'" :label="$t('message.accountManagement.secretKey')+' :'" prop="key_gen_type">
                        <el-select :disabled="isSuperAdmin" v-model="accountForm.key_gen_type"  size="mini" :placeholder="$t('message.common.choose')">
                            <el-option v-for="item in generationTypeList" :key="item.value" :label="item.node" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 公钥信息显示处理 -->
                    <el-form-item v-show="accountDialogOptions.type=='clone' && accountForm.key_gen_type=='1'" :label="$t('message.accountManagement.bindPublicKey')+' :'" prop="public_key">
                        <el-input size="mini" v-model="accountForm.public_key" :placeholder="$t('message.accountManagement.publicKeyInput')" maxlength="130"></el-input>
                    </el-form-item>
					<el-form-item v-show="accountDialogOptions.type=='create' && accountForm.key_gen_type=='1'" :label="$t('message.accountManagement.bindPublicKey')+' :'" prop="public_key">
                        <el-input size="mini" v-model="accountForm.public_key" :placeholder="$t('message.accountManagement.publicKeyInput')" maxlength="130"></el-input>
                    </el-form-item>
					<el-form-item v-show="accountDialogOptions.type=='clone' && accountForm.key_gen_type=='1'" :label="$t('message.accountManagement.bindPublicKey')+' :'" prop="public_key">
                        <el-input size="mini" v-model="accountForm.public_key" :placeholder="$t('message.accountManagement.publicKeyInput')" maxlength="130"></el-input>
                    </el-form-item>
                    <el-form-item v-show="accountDialogOptions.type=='modify' && accountForm.oldPublic_key==''" 
                    :label="$t('message.accountManagement.bindPublicKey')+' :'" prop="public_key">
                        <el-input size="mini" v-model="accountForm.public_key" :placeholder="$t('message.accountManagement.publicKeyInput')" maxlength="130"></el-input>
                    </el-form-item>
                    <el-form-item v-show="accountDialogOptions.type=='modify' && accountForm.oldPublic_key!=''" 
                    :label="$t('message.accountManagement.bindPublicKey')+' :'">
                        <span style="font-size:12px;">{{accountForm.public_key}}</span>
                    </el-form-item>
                    <!-- 公钥地址显示处理 -->
                    <el-form-item v-show="accountDialogOptions.type=='create' && accountForm.key_gen_type=='1'" :label="$t('message.accountManagement.bindPublicKeyAddress')+' :'" prop="address">
                        <el-input size="mini" v-model="accountForm.address" :placeholder="$t('message.accountManagement.publicKeyAddressInput')" maxlength="42"></el-input>
                    </el-form-item>
					<el-form-item v-show="accountDialogOptions.type=='clone' && accountForm.key_gen_type=='1'" :label="$t('message.accountManagement.bindPublicKeyAddress')+' :'" prop="address">
                        <el-input size="mini" v-model="accountForm.address" :placeholder="$t('message.accountManagement.publicKeyAddressInput')" maxlength="42"></el-input>
                    </el-form-item>
                    <el-form-item v-show="accountDialogOptions.type=='modify' && accountForm.oldAddress==''" 
                    :label="$t('message.accountManagement.bindPublicKeyAddress')+' :'" prop="address">
                        <el-input size="mini" v-model="accountForm.address" :placeholder="$t('message.accountManagement.publicKeyAddressInput')" maxlength="42"></el-input>
                    </el-form-item>
                    <el-form-item v-show="accountDialogOptions.type=='modify' && accountForm.oldAddress!=''" 
                    :label="$t('message.accountManagement.bindPublicKeyAddress')+' :'">
                        <span style="font-size:12px;">{{accountForm.address}}</span>
                    </el-form-item>
					<!-- 生效日期 -->
					<el-form-item :label="$t('message.accountManagement.effectiveDate')+' :'" prop="effective_date">
                        <el-date-picker
                            size="mini"
                            style="width: 280px;"
                            v-model="accountForm.effective_date"
                            type="date"
                            :placeholder="$t('message.accountManagement.effectiveDate')"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
					<!-- 失效日期 -->
					<el-form-item :label="$t('message.accountManagement.expiryDate')+' :'" prop="expiration_date">
                        <el-date-picker
                            size="mini"
                            style="width: 280px;"
                            v-model="accountForm.expiration_date"
                            type="date"
                            :placeholder="$t('message.accountManagement.expiryDate')"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>

                </el-form>
            </div>
            <div class="accountTitle">
                <span class="lineClass"></span>
                <span>{{$t('message.accountManagement.otherMsg')}}</span>
            </div>
            <div class="accountMsg">
                <el-form :model="accountForm" ref="accountForm" :label-position="labelPosition" :rules="rules" label-width="350px">
					<el-form-item :label="$t('message.accountManagement.affiliatedCompany')+' :'" prop="customersList">
                        <el-select v-model="accountForm.customersList"  @change="customersChange" size="mini" :multiple="isCustomerMultSelect" :placeholder="$t('message.common.choose')">
                            <el-option v-for="item in affiliatedCompany" :key="item.value" :label="item.node" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('message.accountManagement.department')+' :'">
                        <el-input size="mini" v-model="accountForm.dept" :placeholder="$t('message.accountManagement.departmentInput')" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.accountManagement.duty')+' :'">
                        <el-input size="mini" v-model="accountForm.title" :placeholder="$t('message.accountManagement.dutyInput')" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.accountManagement.telephone')+' :'">
                        <el-input size="mini" v-model="accountForm.work_tel" :placeholder="$t('message.accountManagement.telephoneInput')" maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.accountManagement.phoneNumber')+' :'">
                        <el-input size="mini" v-model="accountForm.cell_phone_number" :placeholder="$t('message.accountManagement.phoneNumberInput')" maxlength="11"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.accountManagement.email')+' :'">
                        <el-input size="mini" v-model="accountForm.email" :placeholder="$t('message.accountManagement.emailInput')" maxlength="50"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="commonline"></div>
        
        <div class="dialog-footer">
            <el-button @click="modelClose">{{$t('message.common.cancel')}}</el-button>
            <el-button type="primary" @click="submit('accountForm')" :loading="loading">{{$t('message.common.confirm')}}</el-button>
        </div>
    </div>
</template>

<script>
import {
	getRolePullList,
	getCustomersPullList,
    addAccount,
    modifyAccount,
    getKeyGenerateList,
} from "@/util/api";
import selectTree from "@/components/select-tree";
// 导入预览组件
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
const sha256 = require("js-sha256").sha256;
export default {
    name: "accountYXDialog",
    components:{
        "select-tree":selectTree,
        "el-image-viewer":ElImageViewer
    },
    props: {
        accountDialogOptions: {
            type: Object
        }
    },
    watch: {
        "accountDialogOptions.type": {
            handler(val) {
                this.type = val;
                switch (val) {
                    case "create":
                        this.accountForm = {
                            account: "",
                            nick: "",
							password:"",
							role:"",
                            dept: "",
                            title: "",
                            work_tel: "",
                            cell_phone_number: "",
                            email: "",
                            state: "",
                            create_er:localStorage.getItem("user"),
                            key_gen_type:"",//密钥生成方式
                            public_key:"",//公钥信息
							address:"",//公钥地址
							customersList:null,
							customers:"",
							effective_date:"",
							expiration_date:"",
                            disabled: false,
                            mDisabled: false,
                            dShow: true,
                            mShow: true,
                        };
                        break;
                    case "modify":
                        this.accountForm = {
                            account: this.accountDialogOptions.data["account"],
							nick: this.accountDialogOptions.data["nick"],
							role:"",//this.accountDialogOptions.data["role"],
                            dept:this.accountDialogOptions.data["dept"],
                            title:this.accountDialogOptions.data["title"],
                            work_tel:this.accountDialogOptions.data["work_tel"],
                            cell_phone_number:this.accountDialogOptions.data["cell_phone_number"],
                            email:this.accountDialogOptions.data["email"],
                            state:"",
                            create_er:this.accountDialogOptions.data["create_er"],
                            // key_gen_type:this.isNullData(this.accountDialogOptions.data["key_gen_type"])?"1":this.accountDialogOptions.data["key_gen_type"],//密钥生成方式
                            oldPublic_key:this.isNullData(this.accountDialogOptions.data["public_key"])?"":this.accountDialogOptions.data["public_key"],//公钥信息
                            oldAddress:this.isNullData(this.accountDialogOptions.data["address"])?"":this.accountDialogOptions.data["address"],//公钥地址
                            public_key:this.isNullData(this.accountDialogOptions.data["public_key"])?"":this.accountDialogOptions.data["public_key"],//公钥信息
							address:this.isNullData(this.accountDialogOptions.data["address"])?"":this.accountDialogOptions.data["address"],//公钥地址
							customersList:null,
							customers:"",
							effective_date:this.isNullData(this.accountDialogOptions.data["effective_date"])?"":this.accountDialogOptions.data["effective_date"],
							expiration_date:this.isNullData(this.accountDialogOptions.data["expiration_date"])?"":this.accountDialogOptions.data["expiration_date"],
							disabled: true,
                            mDisabled: false,
                            dShow: true,
                            mShow: false,
                        };
						break;
					case "clone":
						this.accountForm = {
							account: "",//this.accountDialogOptions.data["account"],
							nick: "",//this.accountDialogOptions.data["nick"],
							role:"",//this.accountDialogOptions.data["role"],
							dept:"",
							title:"",
							work_tel:"",
							cell_phone_number:"",
							email:"",
							state:"",//this.accountDialogOptions.data["state"],
							create_er:localStorage.getItem("user"),
							// key_gen_type:this.isNullData(this.accountDialogOptions.data["key_gen_type"])?"1":this.accountDialogOptions.data["key_gen_type"],//密钥生成方式
							oldPublic_key:"",//公钥信息
							oldAddress:"",//公钥地址
							public_key:"",//公钥信息
							address:"",//公钥地址
							customersList:null,
							customers:"",
							// customers:this.isNullData(this.accountDialogOptions.data["customers"])?"":this.accountDialogOptions.data["customers"].join(','),
							// customersList:this.isNullData(this.accountDialogOptions.data["customers"])?(this.isSuperAdmin?"":[]):this.accountDialogOptions.data["customers"],
							effective_date:this.isNullData(this.accountDialogOptions.data["effective_date"])?"":this.accountDialogOptions.data["effective_date"],
							expiration_date:this.isNullData(this.accountDialogOptions.data["expiration_date"])?"":this.accountDialogOptions.data["expiration_date"],
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
		},
		'accountForm.role': {
			handler: function() {
				//do something
				this.rules.customersList[0].required = (this.accountForm && this.accountForm.role && this.accountForm.role == "platform_admin")?true:false;
			},
		}
    },
    data() {
        return {
            type: this.accountDialogOptions.type,
            loading: false,
            isCn:localStorage.getItem("internationalization")=="zh-cn"?true:false,
            accountForm: {
				role:"",
			},
            roleList: [],
            inputType: "password",
			labelPosition:"right",
			
			effectiveDate:"",
			expiryDate:"",

			//关联公司
			affiliatedCompany:[],

            //会员状态
            statusList:[{
                node:this.$i18n.t('message.accountManagement.startUse'),
                value:"0"
            },{
                node:this.$i18n.t('message.accountManagement.forbidden'),
                value:"10"
            }],
            //密钥生成方式
            generationTypeList:[],
            //状态
            defaultProp: {
                children: 'children',
                label: 'node'
            },
            returnString:"",

            rules1: {
                account: [
                    {
                        required: true,
                        message: this.$i18n.t('message.accountManagement.accountInput'),
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 12,
                        message: this.$i18n.t('message.login.char1_12Alert'),
                        trigger: "blur"
                    },
                    {
                        pattern: /^[A-Za-z0-9]+$/,
                        message: this.$i18n.t('message.accountManagement.accountInputAlert'),
                        trigger: "blur"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: this.$i18n.t('message.accountManagement.passwordInput'),
                        trigger: "blur"
                    },
                    {
                        min: 6,
                        max: 12,
                        message: this.$i18n.t('message.login.char6_12Alert'),
                        trigger: "blur"
                    },
                    {
                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/,
                        message: this.$i18n.t('message.login.passwordAlert'),
                        trigger: "blur"
                    }
                ],
                nick: [
                    {
                        required: true,
                        message: this.$i18n.t('message.accountManagement.nameInput'),
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 12,
                        message: this.$i18n.t('message.login.char1_12Alert'),
                        trigger: "blur"
                    }
				],
				effective_date: [
                    {
                        required: true,
                        message: this.$i18n.t('message.accountManagement.effectiveDateSelect'),
                        trigger: "blur"
                    }
				],
				expiration_date: [
                    {
                        required: true,
                        message: this.$i18n.t('message.accountManagement.expiryDateSelect'),
                        trigger: "blur"
                    }
                ],
                role: [
                    {
                        required: true,
                        message: this.$i18n.t('message.accountManagement.roleSelect'),
                        trigger: "blur"
                    }
                ],
                state: [
                    {
                        required: true,
                        message: this.$i18n.t('message.accountManagement.statusSelect'),
                        trigger: "blur"
                    }
                ],
                key_gen_type:[
                    {
                        required: true,
                        message: this.$i18n.t('message.accountManagement.secretSelect'),
                        trigger: "blur"
                    }
                ],
            },
            rules: {
				customersList:[
                    {
                        required: false,
                        message: this.$i18n.t('message.accountManagement.affiliatedCompanySelect'),
                        trigger: "blur"
                    }
                ],
			},
			
			isSuperAdmin:localStorage.getItem("IsSuperAdmin")==='true'?true:false,
			isCustomerMultSelect:false,//是否多选客户
        };
    },
    created(){
        console.log("this.accountDialogOptions.data.....", this.accountDialogOptions.data);
        
        // //处理初始化显示数据
        // this.dealInitShowData();
    },
    mounted() {
		/**
         * 执行多个请求
         * 1、获取关联公司列表
         * 2、获取角色列表
         */
		this.exeMutilReq();
		
        // //获取角色列表下拉项
        // this.getRolesList();
        // //获取关联公司下拉项
        // this.getCustomersList();
        if(this.type != 'modify'){
            //获取密钥生产方式下拉选项
            this.getKeyGenerates();
        }
    },
    methods: {
        //处理初始化显示数据
        dealInitShowData(){
            if(this.type == 'modify'){
				this.accountForm.state = String(this.accountDialogOptions.data["state"]);
				this.accountForm.role = this.accountDialogOptions.data["role"];
				let customsArr = this.accountDialogOptions.data["customers"];
				if (this.accountDialogOptions.data["role"] === "platform_admin" || this.roleList.length==1) { //如果被编辑帐号是平台管理员
					this.isCustomerMultSelect = false;
					this.accountForm.customersList = "";
					this.accountForm.customers = "";
					if (customsArr && customsArr.length>0) {
						this.accountForm.customersList = customsArr[0].id;
						this.accountForm.customers = customsArr[0].id;
					}
				} else { //如果被编辑帐号不是平台管理员
					this.isCustomerMultSelect = true;
					this.accountForm.customers = "";
					this.accountForm.customersList = [];
					if (customsArr && customsArr.length>0) {
						customsArr.forEach(element => {
							this.accountForm.customersList.push(element.id);
						});
						this.accountForm.customers = this.accountForm.customersList.join(",");
					}
				}
            }else if(this.type == 'clone'){
				this.accountForm.state = String(this.accountDialogOptions.data["state"]);
				this.accountForm.role = this.accountDialogOptions.data["role"];
				let customsArr = this.accountDialogOptions.data["customers"];
				if (this.accountDialogOptions.data["role"] == "platform_admin") { //如果被克隆帐号是平台管理员
					this.isCustomerMultSelect = false;
					this.accountForm.customersList = "";
					this.accountForm.customers = "";
					if (customsArr && customsArr.length>0) {
						this.accountForm.customersList = customsArr[0].id;
						this.accountForm.customers = customsArr[0].id;
					}
				} else { //如果被克隆不是平台管理员
					this.isCustomerMultSelect = true;
					this.accountForm.customersList = [];
					this.accountForm.customers = "";
					if (customsArr && customsArr.length>0) {
						customsArr.forEach(element => {
							this.accountForm.customersList.push(element.id);
						});
						this.accountForm.customers = this.accountForm.customersList.join(",");
					}
				}
			} else{
				let customsArr = this.accountDialogOptions.data["customers"];
				if (this.isSuperAdmin) { //如果添加帐号的是超级管理员
					this.isCustomerMultSelect = false;
					this.accountForm.customersList = "";
					this.accountForm.customers = "";
				} else { //如果添加帐号的不是超级管理员
					this.isCustomerMultSelect = true;
					this.accountForm.customersList = [];
					this.accountForm.customers = "";
				}
			}

			console.log("this.accountForm.....", this.accountForm);
        },
        isVerifyPass(params){
            if(!params){
                this.$message.error(this.$i18n.t('message.common.noParamsAlert'))
                return false;
            };

            if(this.isNullData(params.account)){
                this.$message.error(this.$i18n.t('message.accountManagement.accountInput'))
                return false;
            }

            if(this.type != 'modify'){
                if(this.isNullData(params.password)){
                    this.$message.error(this.$i18n.t('message.accountManagement.nullPwd'))
                    return false;
                }

                if(this.isNullData(params.key_gen_type)){
                    this.$message.error(this.$i18n.t('message.accountManagement.secretSelect'))
                    return false;
                }
            }
            
            if(this.isNullData(params.nick)){
                this.$message.error(this.$i18n.t('message.accountManagement.nameInput'))
                return false;
            }
            if(this.isNullData(params.state)){
                this.$message.error(this.$i18n.t('message.accountManagement.statusSelect'))
                return false;
            }
            if(this.isNullData(params.create_er)){
                this.$message.error(this.$i18n.t('message.accountManagement.creatorAlert'))
                return false;
			}
			
			if(this.isNullData(params.effective_date)){ //生效日期
                this.$message.error(this.$i18n.t('message.accountManagement.effectiveDateSelect'))
                return false;
			}
			if(this.isNullData(params.expiration_date)){ //失效日期
                this.$message.error(this.$i18n.t('message.accountManagement.expiryDateSelect'))
                return false;
			}

			// 生效日期对象
			let effectiveDate = new Date(params.effective_date);
			// 失效日期对象
			let expirationDate = new Date(params.expiration_date);
			if (effectiveDate.getTime() > expirationDate.getTime()) {
				this.$message.error(this.$i18n.t('message.accountManagement.errorDateSelect'))
                return false;
			}

			if (this.accountForm.role == "platform_admin") {
				if (this.isNullData(this.accountForm.customers)) {
					this.$message.error(this.$i18n.t('message.accountManagement.affiliatedCompanySelect'))
                	return false;
				}
			}

            if(!this.isNullData(params.cell_phone_number)){
                if(!this.isMobile(params.cell_phone_number)){
                    this.$message.error(this.$i18n.t('message.accountManagement.phoneNumberError'))
                    return false;
                }
            }

            return true;
        },
        modelClose: function() {
            this.$emit("close", false);
        },
        submit: function(formName) {

            if(!this.isVerifyPass(this.accountForm)){
                return;
            }
            console.log("this.accountForm...",this.accountForm);

            this.$confirm(this.$i18n.t('message.common.affirmSubmit'),this.$i18n.t('message.common.submit'), {
                confirmButtonText: this.$i18n.t('message.common.affirm'),
                cancelButtonText: this.$i18n.t('message.common.cancel'),
            })
            .then(() => {
                this.loading = true;
                this.getAllAccountInfo();
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
            //             this.getAllAccountInfo();
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
         * 获取密钥生成方式下拉项
         */
        getKeyGenerates:function() {
            let reqQuery = {};
            getKeyGenerateList(reqQuery).then(res => {
                if (res.data.code === 0) {
					this.generationTypeList = res.data.data;
					
					if(this.type != 'modify'){
						if(this.isSuperAdmin) { //超管
							this.accountForm.key_gen_type = '1';
						}
					}
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
         * 获取角色列表下拉项
         */
        getRolesList: function() {
			let param = {};
			if (this.type === 'modify') {
				param.modifyAccount = this.accountDialogOptions.data["account"];
			}
            getRolePullList(param)
                .then(res => {
                    if (res.data.code === 0) {
                        this.roleList = res.data.data || [];
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
         * 获取关联公司下拉项
         */
        getCustomersList: function() {
			let param = {};
			if (this.type === 'modify') {
				param.modifyAccount = this.accountDialogOptions.data["account"];
			}
            getCustomersPullList(param)
                .then(res => {
                    if (res.data.code === 0) {
                        this.affiliatedCompany = res.data.data || [];
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
         * 执行多个请求
         * 1、获取关联公司列表
         * 2、获取角色列表
         */
        exeMutilReq(){
            let _this = this;

			let param = {};
			if (this.type === 'modify') {
				param.modifyAccount = _this.accountDialogOptions.data["account"];
			}

            Promise.all([getCustomersPullList(param),getRolePullList(param)]).then(res=>{
                if(res && res.length==2){
                    if (res[0].data.code === 0) {
						_this.affiliatedCompany = res[0].data.data || [];
                    } else {
                        _this.loading = false;
                        let message = res[0].data.message?res[0].data.message:this.errcode.errCode.isCN?this.errcode.errCode[res[0].data.code].cn:this.errcode.errCode[res[0].data.code].en;
                        this.$message({
                            type: "error",
                            message: message
                        });
					}
					
					if (res[1].data.code === 0) {
						_this.roleList = res[1].data.data || [];
                    } else {
                        _this.loading = false;
                        let message = res[1].data.message?res[1].data.message:this.errcode.errCode.isCN?this.errcode.errCode[res[1].data.code].cn:this.errcode.errCode[res[1].data.code].en;
                        this.$message({
                            type: "error",
                            message: message
                        });
					}
					
					//处理初始化显示数据
        			this.dealInitShowData();
                }
            }).catch(err => {
                _this.loading = false;
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
		
        getAllAccountInfo: function() {
            let type = this.type;
            switch (type) {
                case "create":
				case "clone":
                    this.getCreatAccountInfo();
                    break;
                case "modify":
                    this.getModifyAccountInfo();
                    break;
            }
        },
        getCreatAccountInfo: function() {
            let reqData = this.accountForm;
            delete reqData.disabled
            delete reqData.mDisabled
            delete reqData.dShow
            delete reqData.mShow
            addAccount(reqData, {}).then(res => {
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
        getModifyAccountInfo: function() {
            let reqData = this.accountForm;
            delete reqData.disabled
            delete reqData.mDisabled
            delete reqData.dShow
            delete reqData.mShow
            delete reqData.oldAddress
            delete reqData.oldPublic_key
            let urlData = {
                account:this.accountForm.account
            }
            modifyAccount(reqData, {}, urlData)
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

		customersChange(val){
			if (!this.isCustomerMultSelect) {
				this.accountForm.customers = this.accountForm.customersList;
			} else {
				this.accountForm.customers = this.accountForm.customersList.join(",");
			}
			
		}
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

.accountTitle{
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

.accountMsg{
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