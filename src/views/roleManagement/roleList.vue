<template>
    <div class="account-wrapper">
        <content-head :headTitle="'message.menuName.roleManagement'" :headTitlePath="{path:'/roleList'}"></content-head>
        <div class="module-wrapper">
            <div class="role-table">
                <el-table :data="roleList" tooltip-effect="light" v-loading="loading">
                    <!-- <el-table-column
                        align="center"
                        fixed="left"
                        :label="$t('message.businessSearch.number')"
                        :width="numberWidth">
                        <template slot-scope="scope">
                            <span>{{scope.row['number']}}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column v-for="head in roleHeader" :min-width="head.columnWidth" :label="head.name" :key="head.enName" show-overflow-tooltip align="left">
                        <template slot-scope="scope">
                            <span>{{scope.row[head.enName]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('message.common.operate')"
                        :width="operateWidth">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.name !== 'admin'" type="text" size="small" @click="authorConfig(scope.row)" style="color:#1585FF">{{$t('message.roleManagement.authorConfig')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination> -->
            </div>

        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import { getRoleList } from "@/util/api";
import Bus from "@/bus"
import router from "@/router";
export default {
    name: "roleList",
    components: {
        contentHead,
    },
    data() {
        return {
            accountName: "",
            loading: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            headSubTitle:"",

            roleHeader: [
                {
                    enName: "id",
                    name: this.$i18n.t('message.roleManagement.id')
                },
                {
                    enName: "alias",
                    name: this.$i18n.t('message.roleManagement.role')
                },
            ],
            //列表数组
            roleList: [],

            //列表视图对应列的宽度
            numberWidth:50,//序号
            accountWidth:60,//帐号
            nameWidth:100,//姓名
			operateWidth:160,//操作
			
			currentRoleNum:0,//当前登录用户角色数字
			isSuperAdmin:localStorage.getItem("IsSuperAdmin")==='true'?true:false,
        };
    },
    created(){

    },
    beforeDestroy: function () {
        Bus.$off("changeGroup")
    },
    mounted: function() {
        Bus.$on("changeGroup", data => {
            this.changGroup(data)
        })
        this.dealZH_EN();
        this.dealColumWidth();

        this.getRolesList();
    },
    methods: {
        /**
         * 处理中英文数据
         */
        dealZH_EN(){
            if(localStorage.getItem("internationalization") == 'zh-cn'){ /* 中文版本 */
                this.numberWidth=50;
                this.accountWidth=60;
                this.nameWidth=100;
                this.operateWidth=190;
            }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
                this.numberWidth=50;
                this.accountWidth=80;
                this.nameWidth=100;
                this.operateWidth=190;
            }else{
                this.numberWidth=50;
                this.accountWidth=60;
                this.nameWidth=100;
                this.operateWidth=190;
            }
        },
        //处理每列显示宽度
        dealColumWidth(){
            let _this = this;
            _this.roleHeader.map(item=>{
                //accountHeader,将columnWidth:写入每个对象中
                item.columnWidth = '100px';
            })
		},
		//权限配置
		authorConfig(val){
			localStorage.removeItem("roleMsg");

			router.push({path: '/authorManagement', query:{roleMsg:val}});
		},
        changGroup(val){
            this.getRolesList();
        },
        //获取搜索条件，输出查询参数
        getSearchParams(){
            let param = {
                pageNumber: this.currentPage,
                pageSize: this.pageSize
            };

            return param;
        },
        //获取帐号列表
        getRolesList() {
            if (this.isNullData(localStorage.getItem("groupId"))) {
                return;
            }
            this.loading = true;
            let param = {};
            getRoleList(param).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
					let roleArr = [];
					if (!this.isSuperAdmin) {
						let listArr = res.data.data.data || [];
						listArr.forEach(element => {
							if (element.name != 'admin') {
								roleArr.push(element)
							}
						});
					}else{
						roleArr = res.data.data.data || [];
					}
					
                    this.roleList = roleArr.map((item,index)=>{
						item.number = (this.currentPage-1)*this.pageSize+index+1;
						if (item.role == 'admin') { //超级管理员
							item.roleNum = 6;
						} else if (item.role == 'platform_admin') { //平台管理员
							item.roleNum = 5;
						} else if (item.role == 'business_manager') { //业务经理
							item.roleNum = 4;
						} else if (item.role == 'senior_member') { //高级会员
							item.roleNum = 3;
						} else if (item.role == 'standard_member') { //标准会员
							item.roleNum = 3;
						} else if (item.role == 'trial_member') { //试用会员
							item.roleNum = 3;
						}
                        return item;
                    })
					this.total = res.data.data.total;
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
        handleSizeChange: function(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getRolesList();
        },
        handleCurrentChange: function(val) {
            this.currentPage = val;
            this.getRolesList();
        },
    }
};
</script>

<style scoped>
    .role-table{
        padding: 20px;
    }
    .addAccount{
        position: relative;
        text-align: left;
        padding: 20px 20px 0px 20px;
    }
    .search-item {
        display: inline-block;
        margin-left: 10px;
    }
    .search-item > span {
        margin-right: 0px;
    }
    .inputStyle{
        position: relative;
        width:200px;
    }
    .search-part-left-btn{
        height: 30px;
        display: flex;
        float: right;
        align-items: center; /*定义body的元素垂直居中*/
        justify-content: center; /*定义body的里的元素水平居中*/
    }
    /* .el-button--primary{
        float:right;
        position: relative;
        margin-right: 15px;
    } */
    .account-table /deep/ .el-button--text {
        margin-left: 5px !important;
        margin-right: 5px !important;
    }
</style>
