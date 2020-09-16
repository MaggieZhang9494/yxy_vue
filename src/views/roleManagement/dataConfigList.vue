<template>
	<div v-loading="loading">
		<div>
			<span style="height:50px;line-height:50px;position:relative;margin-left:20px;">{{$t('message.roleManagement.currentConfigRole')+' "'}}{{(showRoleMsg?showRoleMsg.alias:(roleMsg?roleMsg.alias:""))+'"'}}</span>
			<div class="btnDataClass" style="display:inline-block;float:right;height:50px;line-height:50px;margin-right:20px;">
				<el-button :disabled="!isTouchChange" @click="cancel()">{{$t('message.common.cancel')}}</el-button>
				<el-button :disabled="!isTouchChange" type="primary" @click="save()">{{$t('message.common.save')}}</el-button>
			</div>
		</div>
		<div class="contentDiv">
			<!-- 口岸进口 -->
			<div class="blockDiv">
				<div class="titleDiv">
					<span class="titleLeftSpan">{{$t('message.businessSearch.portImport')}}</span>
					<div class="titleRightDiv">
						<el-button class="title-spread" size="small" type="text" @click="touchImportSpread()">{{isImportSpread?$t('message.businessDetail.packup'):$t('message.businessDetail.spread')}}<i :class="[isImportSpread?'iconfont wbs-shouqi':'iconfont wbs-zhankai']" style="color:#1585FF;font-size:12px;"></i></el-button>
					</div>
				</div>
				<div v-if="isImportSpread" class="commonline"></div>
				<div v-if="isImportSpread" class="dataTableDiv">
					<!-- <el-table
						ref="refImportTable"
						:data="tableImportData"
						style="width: 100%;"
						row-key="code"
						default-expand-all
						stripe
						:tree-props="{children: 'children'}">
						<el-table-column prop="name">
							<template slot="header" slot-scope="scope">
								<i class="el-icon-data-analysis"></i>
								<span>{{$t('message.roleManagement.data')}}</span>
							</template>
							<template slot-scope="scope">
								<v-leftline-show :isLastCell="scope.row.isLastCell" :level="scope.row.level" :leftLineShowStatusArr="scope.row.leftLineShowList"></v-leftline-show>
								<span style="line-height: 40px;vertical-align: top;" v-if="scope.row.children && scope.row.children.length>0" @click="clickImportTableRow(scope.row, scope.$index)">
									<i v-if="scope.row.isOpen" style="font-size:20px" class="el-icon-caret-bottom"></i>
									<i v-else style="font-size:20px" class="el-icon-caret-right"></i>
								</span>
								<span style="line-height: 40px;vertical-align: top;">{{scope.row.name}}</span>
							</template>
						</el-table-column>
						<el-table-column :label="$t('message.roleManagement.seeField')" width="180" align="center">
							<template slot-scope="scope">
								<span style="position: relative;width:20px;height:20px;"  @click="touchImportIsSee(scope.row, scope.$index,scope)">
									<img style="position: relative;top:3px;width:15px;height:15px;" src="../../../static/image/selected_true.png" v-if="scope.row.isSee === true">
									<img style="position: relative;top:3px;width:15px;height:15px;border:1px solid lightgray;border-radius: 3px;" src="../../../static/image/selected_false.png" v-else>
								</span>
							</template>
						</el-table-column>
						<el-table-column :label="$t('message.roleManagement.seeContent')" width="180" align="center">
							<template slot-scope="scope">
								<span style="position: relative;width:20px;height:20px;"  @click="touchImportisUse(scope.row, scope.$index,scope)">
									<img style="position: relative;top:3px;width:15px;height:15px;" src="../../../static/image/selected_true.png" v-if="scope.row.isUse === true">
									<img style="position: relative;top:3px;width:15px;height:15px;border:1px solid lightgray;border-radius: 3px;" src="../../../static/image/selected_false.png" v-else>
								</span>
							</template>
						</el-table-column>
						<el-table-column label="" align="center">
							<template slot-scope="scope">
							</template>
						</el-table-column>
					</el-table> -->
					<vxe-table
						ref="refImportTable"
						:data="tableImportData"
						stripe
						border="inner"
						resizable
						show-overflow
						row-key
						:tree-config="{children: 'children', line: true,indent:30}">
						<vxe-table-column field="name" tree-node>
							<template v-slot:header>
								<i class="el-icon-data-analysis"></i>
								<span>{{$t('message.roleManagement.data')}}</span>
							</template>
						</vxe-table-column>
						<vxe-table-column :title="$t('message.roleManagement.seeField')" width="180" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.isMustSee == true" style="position: relative;width:20px;height:20px;opacity: 0.5;">
									<img style="position: relative;top:3px;width:15px;height:15px;" src="../../../static/image/selected_true.png">
								</span>
								<span v-else style="position: relative;width:20px;height:20px;"  @click="touchImportIsSee(scope.row, scope.$index,scope)">
									<img style="position: relative;top:3px;width:15px;height:15px;" src="../../../static/image/selected_true.png" v-if="scope.row.isSee === true">
									<img style="position: relative;top:3px;width:15px;height:15px;border:1px solid lightgray;border-radius: 3px;" src="../../../static/image/selected_false.png" v-else>
								</span>
							</template>
						</vxe-table-column>
						<vxe-table-column :title="$t('message.roleManagement.seeContent')" width="180" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.isMustUse == true" style="position: relative;width:20px;height:20px;opacity: 0.5;">
									<img style="position: relative;top:3px;width:15px;height:15px;" src="../../../static/image/selected_true.png">
								</span>
								<span v-else style="position: relative;width:20px;height:20px;"  @click="touchImportisUse(scope.row, scope.$index,scope)">
									<img style="position: relative;top:3px;width:15px;height:15px;" src="../../../static/image/selected_true.png" v-if="scope.row.isUse === true">
									<img style="position: relative;top:3px;width:15px;height:15px;border:1px solid lightgray;border-radius: 3px;" src="../../../static/image/selected_false.png" v-else>
								</span>
							</template>
						</vxe-table-column>
						<vxe-table-column title="" align="center">
							<template slot-scope="scope">
							</template>
						</vxe-table-column>
					</vxe-table>
				</div>
			</div>
			<!-- 口岸出口 -->
			<div class="blockDiv">
				<div class="titleDiv">
					<span class="titleLeftSpan">{{$t('message.businessSearch.portExit')}}</span>
					<div class="titleRightDiv">
						<el-button class="title-spread" size="small" type="text" @click="touchExportSpread()">{{isExportSpread?$t('message.businessDetail.packup'):$t('message.businessDetail.spread')}}<i :class="[isExportSpread?'iconfont wbs-shouqi':'iconfont wbs-zhankai']" style="color:#1585FF;font-size:12px;"></i></el-button>
					</div>
				</div>
				<div v-if="isExportSpread" class="commonline"></div>
				<div v-if="isExportSpread" class="dataTableDiv">
					<!-- <el-table
						ref="refExportTable"
						:data="tableExportData"
						style="width: 100%;"
						row-key="code"
						default-expand-all
						stripe
						:tree-props="{children: 'children'}">
						<el-table-column prop="name">
							<template slot="header" slot-scope="scope">
								<i class="el-icon-data-analysis"></i>
								<span>{{$t('message.roleManagement.data')}}</span>
							</template>
							<template slot-scope="scope">
								<v-leftline-show :isLastCell="scope.row.isLastCell" :level="scope.row.level" :leftLineShowStatusArr="scope.row.leftLineShowList"></v-leftline-show>
								<span style="line-height: 40px;vertical-align: top;" v-if="scope.row.children && scope.row.children.length>0" @click="clickExportTableRow(scope.row, scope.$index)">
									<i v-if="scope.row.isOpen" style="font-size:20px" class="el-icon-caret-bottom"></i>
									<i v-else style="font-size:20px" class="el-icon-caret-right"></i>
								</span>
								<span style="line-height: 40px;vertical-align: top;">{{scope.row.name}}</span>
							</template>
						</el-table-column>
						<el-table-column :label="$t('message.roleManagement.seeField')" width="180" align="center">
							<template slot-scope="scope">
								<span style="position: relative;width:20px;height:20px;"  @click="touchExportIsSee(scope.row, scope.$index,scope)">
									<img style="position: relative;top:3px;width:15px;height:15px;" src="../../../static/image/selected_true.png" v-if="scope.row.isSee === true">
									<img style="position: relative;top:3px;width:15px;height:15px;border:1px solid lightgray;border-radius: 3px;" src="../../../static/image/selected_false.png" v-else>
								</span>
							</template>
						</el-table-column>
						<el-table-column :label="$t('message.roleManagement.seeContent')" width="180" align="center">
							<template slot-scope="scope">
								<span style="position: relative;width:20px;height:20px;"  @click="touchExportisUse(scope.row, scope.$index,scope)">
									<img style="position: relative;top:3px;width:15px;height:15px;" src="../../../static/image/selected_true.png" v-if="scope.row.isUse === true">
									<img style="position: relative;top:3px;width:15px;height:15px;border:1px solid lightgray;border-radius: 3px;" src="../../../static/image/selected_false.png" v-else>
								</span>
							</template>
						</el-table-column>
						<el-table-column label="" align="center">
							<template slot-scope="scope">
							</template>
						</el-table-column>
					</el-table> -->
					<vxe-table
						ref="refExportTable"
						:data="tableExportData"
						stripe
						border="inner"
						resizable
						show-overflow
						row-key
						:tree-config="{children: 'children', line: true,indent:30}">
						<vxe-table-column field="name" tree-node>
							<template v-slot:header>
								<i class="el-icon-data-analysis"></i>
								<span>{{$t('message.roleManagement.data')}}</span>
							</template>
						</vxe-table-column>
						<vxe-table-column :title="$t('message.roleManagement.seeField')" width="180" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.isMustSee == true" style="position: relative;width:20px;height:20px;opacity: 0.5;">
									<img style="position: relative;top:3px;width:15px;height:15px;" src="../../../static/image/selected_true.png">
								</span>
								<span v-else style="position: relative;width:20px;height:20px;"  @click="touchExportIsSee(scope.row, scope.$index,scope)">
									<img style="position: relative;top:3px;width:15px;height:15px;" src="../../../static/image/selected_true.png" v-if="scope.row.isSee === true">
									<img style="position: relative;top:3px;width:15px;height:15px;border:1px solid lightgray;border-radius: 3px;" src="../../../static/image/selected_false.png" v-else>
								</span>
							</template>
						</vxe-table-column>
						<vxe-table-column :title="$t('message.roleManagement.seeContent')" width="180" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.isMustUse == true" style="position: relative;width:20px;height:20px;opacity: 0.5;">
									<img style="position: relative;top:3px;width:15px;height:15px;" src="../../../static/image/selected_true.png">
								</span>
								<span v-else style="position: relative;width:20px;height:20px;"  @click="touchExportisUse(scope.row, scope.$index,scope)">
									<img style="position: relative;top:3px;width:15px;height:15px;" src="../../../static/image/selected_true.png" v-if="scope.row.isUse === true">
									<img style="position: relative;top:3px;width:15px;height:15px;border:1px solid lightgray;border-radius: 3px;" src="../../../static/image/selected_false.png" v-else>
								</span>
							</template>
						</vxe-table-column>
						<vxe-table-column label="" align="center">
							<template slot-scope="scope">
							</template>
						</vxe-table-column>
					</vxe-table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {  } from "@/util/api";
import { updateTableData, addParentCode, addLeftLineShowListToTableList,dealAllChildNode,updateParentNodeStatus, dealAllChildNodeSeeContentStatus,updateParentNodeSeeContentStatus  } from "@/util/role/roleDataParse";
import { format, numberFormat,formatData } from "@/util/util.js";
import router from "@/router";
import { mapState, mapActions } from 'vuex'
import Bus from "@/bus"
import leftLineShow from "./components/leftLineShow"
import { getFuncDataList,saveDataPermissionConfig } from "@/util/api";

export default {
	name: "dataConfigList",
    components: {
		"v-leftline-show":leftLineShow,
	},
	props: {
        roleMsg: {
            type: Object
        }
    },
    data: function() {
        return {
			loading:false,
			
			isImportSpread:true,
			isExportSpread:false,

			//进口数据
			tableImportData: [],
			oldTableImportData: [],
			//出口数据
			tableExportData: [],
			oldTableExportData: [],

			//选中口岸进口code数组
			selectImportCodeArr:[],
			//选中口岸出口code数组
			selectExportCodeArr:[],

			//是否点击有变更
			isTouchChange:false,

			showRoleMsg:null,
        };
    },
    created(){
		let _this = this;

		_this.getDataList();
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
        ...mapActions([

        ]),
        changGroup(val){
            
		},
		//获取数据权限列表
		getDataList () {
			let _this = this;
            _this.loading = true;
           	let param = {group:2};
            getFuncDataList(_this.roleMsg.id,param).then(res => {
                _this.loading = false;
                if (res.data.code === 0) {
					_this.showRoleMsg = res.data.data.role;
					if(!_this.isNullData(res.data.data) && res.data.data.length != 0){
						//进口数据
						_this.tableImportData = [];
						_this.tableImportData = _this.dealMustNeedSeeData(res.data.data.DATA.FI,'FI');
						_this.oldTableImportData = JSON.parse(JSON.stringify(res.data.data.DATA.FI));

						console.log("_this.tableImportData.....", _this.tableImportData);
			
						//出口数据
						_this.tableExportData = [];
						_this.tableExportData = _this.dealMustNeedSeeData(res.data.data.DATA.FE,'FE');
						_this.oldTableExportData = JSON.parse(JSON.stringify(res.data.data.DATA.FE));

						console.log("_this.tableExportData.....", _this.tableExportData);
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
        //处理搜索条件参数
        dealSearchParams(){
            let _this = this;
		},
		//处理数据中必须可见字段项
		dealMustNeedSeeData(dataList,orderType){
			let _this = this;
			let newItemList = [];
			newItemList = dataList.map(item=>{
				if (orderType == 'FE') {
					if (_this.getExportIsMustNeedSee(item)==true) {
						item.isMustSee = true;
						item.isMustUse = true;
					}
				}else{
					if (_this.getImportIsMustNeedSee(item)==true) {
						item.isMustSee = true;
						item.isMustUse = true;
					}
				}
				if (item.children && item.children.length>0) {
					item.children = _this.dealMustNeedSeeData(item.children,orderType);
				}
				return item;
			});
			return newItemList;
		},
		//根据数据列表数据 获取选中数据code
		getSelectCode(nodeList){
			let _this = this;

			let selectArr = [];
			nodeList.forEach(element => {
				if (element.isSee) {
					let node = {};
					node.code = element.code;
					node.isSee = element.isSee;
					node.isUse = element.isUse;

					selectArr.push(node);

					if (element.children && element.children.length>0) {
						selectArr = selectArr.concat(_this.getSelectCode(element.children));
					}
				}
			});
			return selectArr;
		},

		//取消
		cancel(){
			let _this = this;
			this.isTouchChange = false;

			//进口数据恢复
			_this.tableImportData = [];
			_this.tableImportData = JSON.parse(JSON.stringify(_this.oldTableImportData));
			//出口数据恢复
			_this.tableExportData = [];
			_this.tableExportData = JSON.parse(JSON.stringify(_this.oldTableExportData));
		},
		//保存
		save(){
			let _this = this;

			_this.selectImportCodeArr = _this.getSelectCode(_this.tableImportData);
			_this.selectExportCodeArr = _this.getSelectCode(_this.tableExportData);

			console.log("_this.selectImportCodeArr.....", _this.selectImportCodeArr);
			console.log("_this.selectExportCodeArr.....", _this.selectExportCodeArr);

			let reqData = {
				fi:_this.selectImportCodeArr,
				fe:_this.selectExportCodeArr,
			}
			_this.loading = true;
			saveDataPermissionConfig(_this.roleMsg.id,reqData).then(res => {
				_this.loading = false;
                if (res.data.code === 0) {
					_this.isTouchChange = false;
					this.$message({
                        type: "success",
                        message: this.$i18n.t('message.common.saveSuc')
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
		//获取进口对应数据字段是否为必须可见字段
		getImportIsMustNeedSee(row){
			let isMustNeedSee = false;
			if (row.code == "DATA.FI.ORDER_NO" || //工作号
				row.code == "DATA.FI.ORDER_STATUS" || //订单状态
				row.code == "DATA.FI.ACCEPT_DATE" || //客户委托日期
				row.code == "DATA.FI.DZQQ_DATE" || //单证齐全日期
				row.code == "DATA.FI.FIN_SWITCH_BILL_DATE" || //换单日期
				row.code == "DATA.FI.FST_SWITCH_BILL_DATE" || //头程换单日期
				row.code == "DATA.FI.TRADE_CONT_TYPE" || //整拼类型
				row.code == "DATA.FI.ETD" || //预计离港日
				row.code == "DATA.FI.ATD" || //实际离港日
				row.code == "DATA.FI.ETA" || //预计到港日
				row.code == "DATA.FI.ATA" || //实际到港日
				row.code == "DATA.FI.ORDER_SERVE_TRANSPORT_LIST" || //运输信息
				row.code == "DATA.FI.CONT_INFO_LIST" || //集装箱信息
				row.code == "DATA.FI.DECLARATION_LIST" || //报关单信息
				row.code == "DATA.FI.BG_DATE" || //报关完成时间
				row.code == "DATA.FI.TRANS_DATE" || //运输完成时间
				row.code == "DATA.FI.FX_DATE" || //通关货物放行时间
				row.code == "DATA.FI.ORDER_SERVE_TRANSPORT_LIST.TRACKING_NO" || //运输单号
				row.code == "DATA.FI.ORDER_SERVE_TRANSPORT_LIST.TRANS_SUB_DATE" || //运输委托日期
				row.code == "DATA.FI.ORDER_SERVE_TRANSPORT_LIST.TRANS_FIN_DATE" || //实际送达日期
				row.code == "DATA.FI.CONT_INFO_LIST.TRACKING_NO" || //运输单号
				row.code == "DATA.FI.DECLARATION_LIST.CUS_NO" || //报关单号
				row.code == "DATA.FI.DECLARATION_LIST.SBDATE" || //申报日期
				row.code == "DATA.FI.DECLARATION_LIST.FXDATE" || //通关货物放行日期
				row.code == "DATA.FI.DECLARATION_LIST.IE_DATE" //进口日期
				// row.code == "DATA.FI.DECLARATION_LIST.DECLARATION_DUTY.DUTY_TYPE" //税种
			) {
				isMustNeedSee = true;
				if (row.isSee==false) {
					this.isTouchChange = true;
					row.isSee = true;
				}
				if (row.isUse==false) {
					this.isTouchChange = true;
					row.isUse = true;
				}
			}
			return isMustNeedSee;
		},

		//获取出口对应数据字段是否为必须可见字段
		getExportIsMustNeedSee(row){
			let isMustNeedSee = false;
			if (row.code == "DATA.FE.ORDER_NO" || //工作号
				row.code == "DATA.FE.ORDER_STATUS" || //订单状态
				row.code == "DATA.FE.ACCEPT_DATE" || //客户委托日期
				row.code == "DATA.FE.DZQQ_DATE" || //单证齐全日期
				row.code == "DATA.FE.BOOKING_DATE" || //订舱日期
				row.code == "DATA.FE.BL_CONFIRM_DATE" || //提单确认日期
				row.code == "DATA.FE.TRADE_CONT_TYPE" || //整拼类型
				row.code == "DATA.FE.ETD" || //预计离港日
				row.code == "DATA.FE.ATD" || //实际离港日
				row.code == "DATA.FE.ETA" || //预计到港日
				row.code == "DATA.FE.ATA" || //实际到港日
				row.code == "DATA.FE.ORDER_SERVE_TRANSPORT_LIST" || //运输信息
				row.code == "DATA.FE.CONT_INFO_LIST" || //集装箱信息
				row.code == "DATA.FE.DECLARATION_LIST" || //报关单信息
				row.code == "DATA.FE.BG_DATE" || //报关完成时间
				row.code == "DATA.FE.TRANS_DATE" || //运输完成时间
				row.code == "DATA.FE.FX_DATE" || //通关货物放行时间
				row.code == "DATA.FE.ORDER_SERVE_TRANSPORT_LIST.TRACKING_NO" || //运输单号
				row.code == "DATA.FE.ORDER_SERVE_TRANSPORT_LIST.TRANS_SUB_DATE" || //运输委托日期
				row.code == "DATA.FE.ORDER_SERVE_TRANSPORT_LIST.TRANS_FIN_DATE" || //实际送达日期
				row.code == "DATA.FE.CONT_INFO_LIST.TRACKING_NO" || //运输单号
				row.code == "DATA.FE.DECLARATION_LIST.CUS_NO" || //报关单号
				row.code == "DATA.FE.DECLARATION_LIST.SBDATE" || //申报日期
				row.code == "DATA.FE.DECLARATION_LIST.FXDATE" //通关货物放行日期
				// row.code == "DATA.FE.DECLARATION_LIST.IE_DATE"//出口日期
			) {
				isMustNeedSee = true;
				if (row.isSee==false) {
					this.isTouchChange = true;
					row.isSee = true;
				}
				if (row.isUse==false) {
					this.isTouchChange = true;
					row.isUse = true;
				}
			}
			return isMustNeedSee;
		},
		
		//口岸进口展开收缩
		touchImportSpread(){
			this.isImportSpread = !this.isImportSpread;
		},
		//点击口岸进口数据是否可见字段字段
		touchImportIsSee(item, index, scope){
			console.log("import item......",item);
			if (this.getImportIsMustNeedSee(item) == true) {
				return;
			}

			this.isTouchChange = true;

			item.isSee = !item.isSee;
			//如果点击项是包含子节点的，则默认全选或全不选子节点
			if (item.children && item.children.length>0) {
				item = dealAllChildNode(item);
			}

			//保留选择的项
			let oldItem = JSON.parse(JSON.stringify(item));

			///***********************先更新可见字段列状态****************************/
			item = updateParentNodeStatus(this.tableImportData,item);

			this.tableImportData = updateTableData(this.tableImportData, item); 

			//取消可见字段，可见内容也取消选择
			if (!oldItem.isSee) {
				oldItem.isUse = oldItem.isSee;

				//如果点击项是包含子节点的，则默认全选或全不选子节点
				if (oldItem.children && oldItem.children.length>0) {
					oldItem = dealAllChildNodeSeeContentStatus(oldItem);
				}
				//处理节点父节点可见内容状态
				oldItem = updateParentNodeSeeContentStatus(this.tableImportData,oldItem);

				this.tableImportData = updateTableData(this.tableImportData, oldItem);
			}else{ 
				//如果选择可见字段，可见内容状态不变
			}
		},
		//点击口岸进口数据是否可见内容
		touchImportisUse(item, index, scope){
			this.isTouchChange = true;

			item.isUse = !item.isUse;
			//如果点击项是包含子节点的，则默认全选或全不选子节点
			if (item.children && item.children.length>0) {
				item = dealAllChildNodeSeeContentStatus(item);
			}

			//保留选择的项
			let oldItem = JSON.parse(JSON.stringify(item));

			///***********************先更新可见内容列状态****************************/
			item = updateParentNodeSeeContentStatus(this.tableImportData,item);

			this.tableImportData = updateTableData(this.tableImportData, item);

			//选择可见内容，可见字段也选择
			if (oldItem.isUse) {
				oldItem.isSee = oldItem.isUse;

				//如果点击项是包含子节点的，则默认全选或全不选子节点
				if (oldItem.children && oldItem.children.length>0) {
					oldItem = dealAllChildNode(oldItem);
				}
				//处理节点父节点可见字段状态
				oldItem = updateParentNodeStatus(this.tableImportData,oldItem);

				this.tableImportData = updateTableData(this.tableImportData, oldItem);
			}else{ 
				//如果取消选择可见内容，可见字段状态不变
			}
		},
		clickImportTableRow(row,index){
			row.isOpen = !row.isOpen;

			this.$refs.refImportTable.toggleRowExpansion(row)
		},
		
		//口岸出口展开收缩
		touchExportSpread(){
			this.isExportSpread = !this.isExportSpread;
		},
		//点击口岸进口数据是否可见
		touchExportIsSee(item, index, scope){
			console.log("ecport item......",item);
			if (this.getExportIsMustNeedSee(item) == true) {
				return;
			}

			this.isTouchChange = true;

			item.isSee = !item.isSee;
			//如果点击项是包含子节点的，则默认全选或全不选子节点
			if (item.children && item.children.length>0) {
				item = dealAllChildNode(item);
			}

			//保留选择的项
			let oldItem = JSON.parse(JSON.stringify(item));

			///***********************先更新可见字段列状态****************************/
			item = updateParentNodeStatus(this.tableExportData,item);

			this.tableExportData = updateTableData(this.tableExportData, item);

			//取消可见字段，可见内容也取消选择
			if (!oldItem.isSee) {
				oldItem.isUse = oldItem.isSee;

				//如果点击项是包含子节点的，则默认全选或全不选子节点
				if (oldItem.children && oldItem.children.length>0) {
					oldItem = dealAllChildNodeSeeContentStatus(oldItem);
				}
				//处理节点父节点可见内容状态
				oldItem = updateParentNodeSeeContentStatus(this.tableExportData,oldItem);

				this.tableExportData = updateTableData(this.tableExportData, oldItem);
			}else{ 
				//如果选择可见字段，可见内容状态不变
			}
		},

		//点击口岸出口数据是否可见内容
		touchExportisUse(item, index, scope){
			this.isTouchChange = true;

			item.isUse = !item.isUse;
			//如果点击项是包含子节点的，则默认全选或全不选子节点
			if (item.children && item.children.length>0) {
				item = dealAllChildNodeSeeContentStatus(item);
			}

			//保留选择的项
			let oldItem = JSON.parse(JSON.stringify(item));

			///***********************先更新可见内容列状态****************************/
			item = updateParentNodeSeeContentStatus(this.tableExportData,item);

			this.tableExportData = updateTableData(this.tableExportData, item);

			//选择可见内容，可见字段也选择
			if (oldItem.isUse) {
				oldItem.isSee = oldItem.isUse;

				//如果点击项是包含子节点的，则默认全选或全不选子节点
				if (oldItem.children && oldItem.children.length>0) {
					oldItem = dealAllChildNode(oldItem);
				}
				//处理节点父节点可见字段状态
				oldItem = updateParentNodeStatus(this.tableExportData,oldItem);

				this.tableExportData = updateTableData(this.tableExportData, oldItem);
			}else{ 
				//如果取消选择可见内容，可见字段状态不变
			}
		},

		clickExportTableRow(row,index){
			row.isOpen = !row.isOpen;

			this.$refs.refExportTable.toggleRowExpansion(row)
		},
    }
}
</script>

<style>
	.contentDiv{
		margin:0px 20px 0px;
		padding:0px;
	}
	.blockDiv{
		border: solid;
        border-width: 1px;
        border-color: rgb(231, 231, 231); 
		margin-bottom:5px;
	}
	.titleDiv{
		background-color: #F3F4F6;
	}
	.titleLeftSpan{
		height:40px;
		line-height:40px;
		position:relative;
		margin-left:10px;
		font-size: 12px;
		font-weight: 600;
	}
	.titleRightDiv{
		display:block;
		float:right;
		height:40px;
		line-height:40px;
		margin-right:10px;
	}

	.contentDiv /deep/ .el-table {
		margin-bottom: 0px !important;
	}
	/* 去掉最下面的那一条线 */
	.tableDiv /deep/ .el-table::before {
		height: 0px;
	}

	.tableDiv /deep/ .el-table--striped .el-table__body tr.el-table__row--striped td{
		background-color: #FAFBFE;
	}

	.tableDiv /deep/ .el-table__expand-icon .el-table__expand-icon--expanded {
		-webkit-transform: rotate(0deg);
  		transform: rotate(0deg);
	}

	.tableDiv /deep/ .el-icon-caret-right:before {
		content: "\e791";
		font-size: 18px;
		top: 2px;;
		position: relative;
	}

	.tableDiv /deep/ .el-icon-caret-bottom:before {
		content: "\e790";
		font-size: 18px;
		top: 2px;;
		position: relative;
	}
	

	.tableDiv /deep/ .el-table__expand-icon {
		display: none !important;
		line-height: 0px !important;
		height: 40px;
	}

	.tableDiv /deep/ .el-table__indent {
		display: none;
	}
	.tableDiv /deep/ .el-table .cell {
		line-height: 40px;
		height: 40px;
	}
	
	.tableDiv /deep/ .el-table__placeholder {
		display: none;
	}
	.tableDiv /deep/ .el-table td .el-table_1_column_1 .is-left > .cell::before {
		content: "12313123";
		left: 10px;
		right: auto;
		border-width: 1px;
	}


	/* .tableDiv /deep/ .vxe-cell--tree-node {
		position: relative;
		padding-left: 16px;
	} */
	.dataTableDiv /deep/ .vxe-table.has--tree-line .vxe-tree--btn-wrapper {
		margin-left: 20px;
	}
	.dataTableDiv /deep/ .vxe-table .vxe-body--column.col--ellipsis>.vxe-cell .vxe-tree-cell {
		margin-left: 15px;
	}
	.dataTableDiv /deep/ .vxe-table .vxe-body--row.row--stripe{
		background-color: #FAFBFE;
	}
	.dataTableDiv /deep/ .vxe-table .vxe-tree--line {
		content: "";
		position: absolute;
		bottom: -.9em;
		width: 1.3em;
		border-width: 0 0 1px 1px;
		border-style: dotted dotted solid dotted;
		border-color: #D2D8E5;
		pointer-events: none;
	}
	.dataTableDiv /deep/ .vxe-table.has--tree-line .vxe-body--row .vxe-body--column {
		height: 40px;
	}
	.dataTableDiv /deep/ .vxe-table .vxe-body--column:not(.col--ellipsis), .vxe-table .vxe-footer--column:not(.col--ellipsis), .vxe-table .vxe-header--column:not(.col--ellipsis){
		padding: 8px 0px;
	}
	.dataTableDiv /deep/ .vxe-table .vxe-table--border-line {
		border: 0px solid #e8eaec !important;
	}

	.btnDataClass /deep/ .el-button--primary:disabled {
		color: #fff;
		background-color: rgb(231, 231, 231) !important;
		border-color: rgb(231, 231, 231) !important;
		padding: 7px 10px;
		font-size: 12px;
	}

</style>