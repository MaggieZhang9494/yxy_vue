<template>
    <div class="account-wrapper">
        <content-head :headTitle="'message.menuName.publicQuery'" :headTitlePath="{path:'/roleList'}"></content-head>
        <div class="module-wrapper bg-content">
			<!-- 统计数据显示 -->
            <div style="padding:10px 10px 6px 10px; background-color: white;">
                <el-row>
                    <el-col :xs='24' :sm="24" :md="24" :lg="24" :xl="24" v-loading="loadingNumber">
                        <div class="overview-item" :style="index===4?'padding-top:0px;':''" v-for="(item, index) in detailsList" :key="index" @click="goDetailRouter(item)" :class="item.bg">
                            <div class="overview-item-content" v-if="index != 4">
                                <div class="overview-item-title">{{item.label}}</div>
                                <div class="overview-item-number">{{item.value}}<span style="font-size:12px">{{item.unit}}</span></div>
                            </div>
                            <div class="overview-item-img" v-if="index != 4">
								<!-- <i class="wbs-icon-node1" v-if='item.icon == "#wbs-icon-node1"'></i> -->
								<svg class="overview-item-svg" aria-hidden="true" v-if='item.icon == "#wbs-icon-node1"'>
                                    <use id="svgNode" xlink:href="#wbs-icon-node1"></use>
                                </svg>
								<svg class="overview-item-svg" aria-hidden="true" v-else-if='item.icon == "#wbs-icon-transation"'>
                                    <use id="svgBlock" xlink:href="#wbs-icon-transation"></use>
                                </svg>
								<svg class="overview-item-svg" aria-hidden="true" v-else-if='item.icon == "#wbs-icon-contract"'>
                                    <use id="svgContract" xlink:href="#wbs-icon-contract"></use>
                                </svg>
                                <svg class="overview-item-svg" aria-hidden="true" v-else-if='item.icon == "#wbs-icon-block"'>
                                    <use id="svgTransation" xlink:href="#wbs-icon-block"></use>
                                </svg>
                            </div>
							<div class="overview-item-img4" v-else>
								<!-- <i class="iconfont wbs-qukuailianwangluo" style="color: white;position: relative;"></i> -->
								<svg style="width:50px;height:50px;" aria-hidden="true">
                                    <use xlink:href="#wbs-qukuailianwangluo" class="useClass"></use>
                                </svg>
							</div>
							<span class="overview-item-content4" v-if="index == 4">
								<i :class="isChain==true?'chainPot':'nochainPot'"></i>
								<span :class="isChain==true?'chainStatus':'nochainStatus'">{{isChain==true?$t('message.publicQuery.chain'):$t('message.publicQuery.nochain')}}</span>
							</span>
                        </div>
                    </el-col>
                </el-row>
            </div>
			<!-- 搜索条件 -->
			<div class="searchClass">
				<el-input :placeholder="$t('message.publicQuery.inputAlert')" v-model="searchKeyName">
					<el-button slot="append" icon="el-icon-search" @click="searchCer()">{{$t('message.common.search')}}</el-button>
				</el-input>
				<div style="text-align:left;width:600px;left: calc(50% - 300px);position: relative;">
					<span style="color:#C9CACB;font-size:12px;">{{$t('message.publicQuery.alert')}}</span>
				</div>
			</div>
			<!-- list -->
			<div class="tableClass">
				<el-table ref="refTable" :data="saveCerShowList" tooltip-effect="light" v-loading="loading">
					<el-table-column type="expand" width="1">
						<template slot-scope="scope">
							<v-savecer-detail :showData="scope.row"></v-savecer-detail>
						</template>
					</el-table-column>
                    <el-table-column v-for="head in saveCerHeader" :label="head.name" :key="head.enName" show-overflow-tooltip align="left">
                        <template slot-scope="scope">
							<span v-if="head.enName === 'cerContent'" style="cursor:pointer;" @click="clickTable(scope.row, scope.$index)"><i class="iconfont wbs-chakanxiangqing" style="color:#1585ff;font-size:12px;position: relative;margin-right: 3px;"></i>{{$t('message.publicQuery.dataSummary')}}</span>
                            <span v-else>{{scope.row[head.enName]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
				<!-- 查看全部 -->
                <div v-if="saveCerList.length>saveCerShowList.length" class="allDiv">
                    <span style="position: relative;font-size:13px;line-height:40px;width:100px;height:50px;cursor:pointer;" @click="gotoAll()">{{$t('message.publicQuery.lookAll')}}<i :class="['iconfont wbs-zhankai']" style="color:#1585FF;font-size:12px;"></i></span>
                </div>
				<div v-if="saveCerList.length>saveCerShowList.length" class="commonline"></div>
			</div>
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import saveCerDetail from "./saveCerDetail";
import { getPublicStatisticsMsg, publicCerList } from "@/util/api";
import Bus from "@/bus"
import router from "@/router";
export default {
    name: "roleList",
    components: {
		contentHead,
		"v-savecer-detail":saveCerDetail,
    },
    data() {
        return {
			loading: false,
			loadingNumber: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
			headSubTitle:"",
			isChain:false,//是否已链接，默认未链接，接口请求正常表明已链接
            //搜索条件
            searchKeyName:"",

			//顶部统计显示数据
            detailsList: [
                {
                    label: this.$i18n.t('message.dataOverview.nodeNumber'),//"节点个数",
                    name: "nodeCount",
                    value: 0,
                    icon: "#wbs-icon-node1",
                    bg: 'node-bg',
                    unit:this.$i18n.t('message.dataOverview.nodes')
				},
				{
                    label: this.$i18n.t('message.dataOverview.blockNumber'),//"区块数量",
                    name: "latestBlockNumber",
                    value: 0,
                    icon: "#wbs-icon-transation",
                    bg: "block-bg",
                    unit:this.$i18n.t('message.dataOverview.blocks')
				},
				{
                    label: this.$i18n.t('message.dataOverview.transactionNumber'),//"交易数量",
                    name: "txTotalCount",
                    value: 0,
                    icon: "#wbs-icon-block",
                    bg: 'transation-bg',
                    unit:this.$i18n.t('message.dataOverview.transactions')
				},
                {
                    label: this.$i18n.t('message.publicQuery.projectNumber'),//"项目数量",
                    name: "projectCount",
                    value: 0,
                    icon: "#wbs-icon-contract",
                    bg: 'contract-bg',
                    unit:this.$i18n.t('message.dataOverview.projects')
                },
                {
                    label: this.$i18n.t('message.dataOverview.transactionNumber'),//"已链接",
                    name: "transactionCount",
                    value: 0,
                    icon: "#wbs-icon-transation",
                    bg: 'chain-bg',
                    unit:this.$i18n.t('message.dataOverview.transactions')
                }
			],
			//statistics 统计数据
			statistics:{
				nodeNumber:10,
				blockNumber:11,
				transactionNumber:12,
				projectNumber:13,
			},
			//存证显示在列表上的数据
			saveCerShowList:[],
			//存证所有数据
			saveCerList:[],
			saveCerHeader:[
				{
                    enName: "blockNumber",
                    name: this.$i18n.t('message.publicQuery.blockHeight')
                },
                {
                    enName: "certName",
                    name: this.$i18n.t('message.publicQuery.cerName')
				},
                {
                    enName: "cerContent",
                    name: this.$i18n.t('message.publicQuery.cerContent')
				},
                {
                    enName: "userCompany",
                    name: this.$i18n.t('message.publicQuery.cerUser')
				},
				{
                    enName: "created",
                    name: this.$i18n.t('message.publicQuery.time')
                },
			],

        };
    },
    created(){
		this.dealZH_EN();
		this.dealColumWidth();
		
		if (this.isNullData(localStorage.getItem("groupId"))) {
			return;
		}
		//获取统计数据
		this.getPublicNums();
    },
    beforeDestroy: function () {
        Bus.$off("changeGroup")
    },
    mounted: function() {
        Bus.$on("changeGroup", data => {
            this.changGroup(data)
        })
        
    },
    methods: {
		changGroup(data){
			this.saveCerShowList=[];
			this.saveCerList=[];
			//获取统计数据
			this.getPublicNums();
		},
        /**
         * 处理中英文数据
         */
        dealZH_EN(){
            // if(localStorage.getItem("internationalization") == 'zh-cn'){ /* 中文版本 */
            //     this.numberWidth=50;
            //     this.accountWidth=60;
            //     this.nameWidth=100;
            //     this.operateWidth=190;
            // }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
            //     this.numberWidth=50;
            //     this.accountWidth=80;
            //     this.nameWidth=100;
            //     this.operateWidth=190;
            // }else{
            //     this.numberWidth=50;
            //     this.accountWidth=60;
            //     this.nameWidth=100;
            //     this.operateWidth=190;
            // }
        },
        //处理每列显示宽度
        dealColumWidth(){
            let _this = this;
            _this.saveCerHeader.map(item=>{
                //accountHeader,将columnWidth:写入每个对象中
                // item.columnWidth = '100px';

                // if(localStorage.getItem("internationalization") == 'zh-cn'){ /* 中文版本 */
                //     if(item.enName=='social_credit_code' ||  item.enName=='company_name' ||
                //     item.enName=='business_address' || item.enName=='company_name_en' ||
                //     item.enName=='created_at' || item.enName=='updated_at'){
                //         item.columnWidth = '150px';
                //     }
                // }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
                //     if(item.enName=='social_credit_code' ||
                //     item.enName=='business_address' ||
                //     item.enName=='created_at' || item.enName=='updated_at'){
                //         item.columnWidth = '150px';
                //     } else if(item.enName=='company_name' ||  item.enName=='company_name_en'){ //会员等级
                //         item.columnWidth = '170px';
                //     }else if(item.enName=='member_level_show'){ //会员等级
                //         item.columnWidth = '130px';
                //     } else if(item.enName=='work_tel'){ //工作电话
                //         item.columnWidth = '130px';
                //     } else if(item.enName=='cell_phone_number'){ //手机号
                //         item.columnWidth = '100px';
                //     } else if(item.enName=='email'){ //邮箱
                //         item.columnWidth = '110px';
                //     }
                // }
            })
		},
        //获取搜索条件，输出查询参数
        getSearchParams(){
            let param = {};
            if(!this.isNullData(this.searchKeyName)){
                param.txHash = this.searchKeyName;
            }
            return param;
		},
		//获取统计数据
		getPublicNums(){
			let _this = this;
			this.loadingNumber = true;
            getPublicStatisticsMsg({}).then(res => {
                this.loadingNumber = false;
                if (res.data.code === 0) {
					this.isChain = res.data.data.nodeStatus==1?true:false;
                    this.detailsList.forEach(function (value, index) {
                        for (let i in res.data.data) {
                            if (value.name === i) {
                                value.value = res.data.data[i];
                            }
                        }
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
				let message = _this.$i18n.t('message.common.systemError');
				if(err && err.data && err.data.code){
					message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
				}
				this.$message({
					type: "error",
					message: message
				});
            });
		},
		//获取项目数量
		getProjectNums(){
			let _this = this;
            getProjectNumbers({}).then(res => {
                if (res.data.code === 0) {
                    this.detailsList.forEach(function (value, index) {
						if (value.name == "projectCount") {
							value.value = res.data.data.total;
						}
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
				let message = _this.$i18n.t('message.common.systemError');
				if(err && err.data && err.data.code){
					message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
				}
				this.$message({
					type: "error",
					message: message
				});
            });
		},
		//获取存证信息
		getCerList(){
			let _this = this;

			let params = _this.getSearchParams();
			if (_this.isNullData(params.txHash)) {
				_this.$message.error(_this.$i18n.t('message.publicQuery.hashInput'));
				return;
			}
            publicCerList(params).then(res => {
                if (res.data.code === 0) {
					_this.saveCerList = res.data.data;
                    if (_this.saveCerList.length>5) {
						_this.saveCerShowList = _this.saveCerList.slice(0,5);
					}else{
						_this.saveCerShowList = _this.saveCerList.slice();
					}
					console.log("this.saveCerList...", this.saveCerList);
					console.log("this.saveCerShowList...", this.saveCerShowList);
                } else {
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
                    });
                }
            }).catch(err => {
                let message = _this.$i18n.t('message.common.systemError');
                if(err && err.data && err.data.code){
                    message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
                }
                this.$message({
                    type: "error",
                    message: message
                });
            });
		},
		//查看全部
		gotoAll(){
			this.saveCerShowList = [];
			this.saveCerShowList = this.saveCerList.slice();
		},
		searchCer(){
			//获取存证信息列表
        	this.getCerList();
		},
		clickTable(row,index,e){
			this.$refs.refTable.toggleRowExpansion(row)
        },
    }
};
</script>

<style type="text/css" scoped>
.bg-content{
	background-color: unset;
}
.node-bg {
    background: linear-gradient(to top right, #4262FF, #3D99FF);
}
.block-bg {
    background: linear-gradient(to top right, #6E5BFF, #F46C91);
}
.transation-bg {
    background: linear-gradient(to top right, #F46C91, #F79D8D);
}
.contract-bg {
    background: linear-gradient(to top right, #F79D8D, #EFD496);
}
.chain-bg {
    background: linear-gradient(to top right, #4EBBF9, #50E8F0);
}
.chainPot{
	width:10px;
	height:10px;
	border-radius:50%;
	background-color:#43EBF9;
	display:inline-block;
}
.chainStatus {
	width:auto;
	height:auto;
	display:inline-block;
	color:#fff;
}
.nochainPot{
	width:10px;
	height:10px;
	border-radius:50%;
	background-color:red;
	display:inline-block;
}
.nochainStatus {
	width:auto;
	height:auto;
	display:inline-block;
	color:red;
}

.overview-item {
    display: inline-block;
    width: calc(20% - 10px);
    max-width: 600px;
    height: 120px;
    padding: 10px 5px 10px 5px;
    margin: 8px 5px 10px 5px;
    background-color: #fff;
    box-shadow: 0 4px 12px 0 #dfe2e9;
    border-radius: 2px;
	box-sizing: border-box;
	vertical-align: top;
    /* cursor: pointer; */
}
.overview-item-img4 {
    display: inline-block;
	/* padding-top: 10px; */
    left: calc(50% - 25px);
	top: 20px;;
    position: relative;
    width: 50px;
}
.overview-item-img {
    display: inline-block;
    padding-top: 0px;
	width: 50px;
	top: 10px;
	position: relative;
}
.overview-item-content {
    position: relative;
    top:-20px;
    font-size: 12px;
    display: inline-block;
    padding-left: 10px;
    padding-top: 0px;
    width: calc(100% - 100px);
}

.overview-item-content4{
	position: relative;
    top:25px;
    font-size: 14px;
	display: inline-block;
    width:100%;
	text-align: center;
}
.overview-item-number {
    font-size: 30px;
    /* margin-top: 20px; */
    color: #fff;
}
/* 中文版本 */
.zh-cn .overview2-item-title {
    width: 100%;
    color: #fff;
}
/* 英文版本 */
.en .overview2-item-title {
    /* position: relative;
    top:10px; */
    width: 100%;
    color: #fff;
}
.overview-item-title {
    /* top:20px; */
    width: 100%;
    color: #fff;
}
.overview-item-svg {
    width: 80px;
	height: 80px;
}
@media screen and (max-width: 1142px) {
    .overview-item {
        display: inline-block;
        width: calc(49% - 15px);
        max-width: 300px;
        height: 120px;
        padding: 28px 12px;
        margin: 8px 15px 16px 0;
        background-color: #fff;
        box-shadow: 0 4px 12px 0 #dfe2e9;
        border-radius: 2px;
        box-sizing: border-box;
    }
    .overview-item-img {
        display: inline-block;
        width: 30px;
    }
    .overview-item-svg {
        width: 30px;
        height: 30px;
    }
    .overview-item-content {
        font-size: 12px;
        display: inline-block;
        padding-left: 5px;
        width: calc(100% - 45px);
    }
	.overview-item-img4 {
        display: inline-block;
        width: 30px;
		left: calc(50% - 15px);
    }
}
@media screen and (max-width: 1042px) {
    .overview-item {
        display: inline-block;
        width: calc(49% - 15px);
        max-width: 300px;
        height: 120px;
        padding: 28px 6px;
        margin: 8px 15px 16px 0;
        background-color: #fff;
        box-shadow: 0 4px 12px 0 #dfe2e9;
        border-radius: 2px;
        box-sizing: border-box;
    }
    .overview-item-img {
        display: inline-block;
        width: 30px;
    }
	.overview-item-img4 {
        display: inline-block;
        width: 30px;
		left: calc(50% - 15px);
    }
    .overview-item-svg {
        width: 30px;
        height: 30px;
    }
    .overview-item-content {
        font-size: 12px;
        display: inline-block;
        padding-left: 5px;
        width: calc(100% - 40px);
    }
}
@media screen and (max-width: 991px) {
    .overview-item {
        display: inline-block;
        width: calc(49% - 8px);
        max-width: 385px;
        height: 120px;
        padding: 28px 16px;
        margin: 8px 15px 16px 0;
        background-color: #fff;
        box-shadow: 0 4px 12px 0 #dfe2e9;
        border-radius: 2px;
        box-sizing: border-box;
    }
    .overview-item-img {
        display: inline-block;
        width: 40px;
    }
	.overview-item-img4 {
        display: inline-block;
        width: 50px;
		left: calc(50% - 25px);
    }
    .overview-item-svg {
        width: 50px;
        height: 50px;
    }
    .overview-item-content {
        font-size: 12px;
        display: inline-block;
        padding-left: 10px;
        width: calc(100% - 60px);
    }
    /* .el-col:nth-child(2){
        margin: 8px 16px 16px 0;
    } */
    .overview-item:nth-child(2) {
        margin: 8px 15px 16px 0;
    }
}

.searchClass{
	margin-top: 10px;
	padding: 30px;
	background-color: white;
	text-align: center;
}
.searchClass /deep/ .el-input {
	width: 600px;
}
.searchClass /deep/ .el-input-group__append{
	background-color: #1585FF;
}
.searchClass /deep/ .el-input-group__append button.el-button {
	color:white;
}

.tableClass{
	margin-top: 10px;
	padding: 20px;
	background-color: white;
	text-align: center;
}

.allDiv{
    position: relative;
    width: 100%;
    height: 40px;
    color: #1585FF;
    background-color: #fff;
	text-align: center;
}

.tableClass /deep/ .el-table__expand-icon>.el-icon{
    visibility:hidden;
}

.searchClass /deep/ .el-input .el-input-group__append {
	border: 1px solid #1585FF;
}

#svgNode{
	fill: #4262FF !important;  
}
#svgBlock{
	fill: #6E5BFF !important;  
}
#svgTransation{
	fill: #F46C91 !important;  
}
#svgContract{
	fill: #F79D8D !important;  
}


</style>
