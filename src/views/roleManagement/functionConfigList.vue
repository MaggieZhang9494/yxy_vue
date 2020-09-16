<template>
	<div v-loading="loading">
		<div>
			<span style="height:50px;line-height:50px;position:relative;margin-left:20px;">{{$t('message.roleManagement.currentConfigRole')+' "'}}{{(showRoleMsg?showRoleMsg.alias:(roleMsg?roleMsg.alias:""))+'"'}}</span>
			<div class="btnFunClass" style="display:block;float:right;height:50px;line-height:50px;margin-right:20px;">
				<el-button :disabled="!isTouchChange" @click="cancel()">{{$t('message.common.cancel')}}</el-button>
				<el-button :disabled="!isTouchChange" type="primary" @click="save()">{{$t('message.common.save')}}</el-button>
			</div>
		</div>
		<!-- <div class="listTable" style="padding:0px 20px 20px; ">
			<el-table
				ref="refTable"
				:data="tableData"
				style="width: 100%;"
				row-key="code"
				default-expand-all
				stripe
				:tree-props="{children: 'children'}">
				<el-table-column align="left">
					<template slot="header" slot-scope="scope">
						<i class="el-icon-data-analysis" style="margin-left:0px;position: relative;"></i>
						<span>{{$t('message.roleManagement.function')}}</span>
					</template>
					
	  				<template slot-scope="scope">
						<v-leftline-show :isLastCell="scope.row.isLastCell" :level="scope.row.level" :leftLineShowStatusArr="scope.row.leftLineShowList"></v-leftline-show>
						<span style="line-height: 40px;vertical-align: top;" v-if="scope.row.children && scope.row.children.length>0" @click="clickTableRow(scope.row, scope.$index)">
							<i v-if="scope.row.isOpen" style="font-size:20px" class="el-icon-caret-bottom"></i>
      						<i v-else style="font-size:20px" class="el-icon-caret-right"></i>
						</span>
						<span style="line-height: 40px;vertical-align: top;">{{scope.row.name}}</span>
					</template>
				</el-table-column>
				<el-table-column :label="$t('message.roleManagement.see')" width="180" align="center">
					<template slot-scope="scope">
						<span style="position: relative;width:20px;height:20px;"  @click="touchIsSee(scope.row, scope.$index)">
                            <img style="position: relative;top:3px;width:15px;height:15px;" src="../../../static/image/selected_true.png" v-if="scope.row.isSee === true">
                            <img style="position: relative;top:3px;width:15px;height:15px;border:1px solid lightgray;border-radius: 3px;" src="../../../static/image/selected_false.png" v-else>
                        </span>
					</template>
				</el-table-column>
				<el-table-column prop="address" :label="$t('message.roleManagement.use')" width="180" align="center">
					<template slot-scope="scope">
						<span style="position: relative;width:20px;height:20px;" @click="touchIsUse(scope.row, scope.$index)">
                            <img style="position: relative;top:3px;width:15px;height:15px;" src="../../../static/image/selected_true.png" v-if="scope.row.isUse === true">
                            <img style="position: relative;top:3px;width:15px;height:15px;border:1px solid lightgray;border-radius: 3px;" src="../../../static/image/selected_false.png" v-else>
                        </span>
					</template>
				</el-table-column>
				<el-table-column label="" align="center">
					<template slot-scope="scope">
					</template>
				</el-table-column>
			</el-table>
		</div> -->
		<!-- <div class="tree-container">
			<el-tree
				:indent="0"
				:data="tableData"
				default-expand-all
				node-key="code">
			</el-tree>
		</div> -->

		<div class="contentDiv">
			<!-- 菜单信息 -->
			<div class="blockDiv">
				<div class="titleDiv">
					<span class="titleLeftSpan">{{$t('message.roleManagement.function')}}</span>
					<div class="titleRightDiv">
						<el-button class="title-spread" size="small" type="text" @click="touchMenuSpread()">{{isMenuSpread?$t('message.businessDetail.packup'):$t('message.businessDetail.spread')}}<i :class="[isMenuSpread?'iconfont wbs-shouqi':'iconfont wbs-zhankai']" style="color:#1585FF;font-size:12px;"></i></el-button>
					</div>
				</div>
				<div v-if="isMenuSpread" class="commonline"></div>
				<div v-if="isMenuSpread" class="tableDiv">
					<vxe-table
						ref="refTable"
						:data="tableData"
						stripe
						border="inner"
						resizable
						show-overflow
						row-key
						:tree-config="{children: 'children', line: true,indent:30}">
						<vxe-table-column field="name" tree-node>
							<template v-slot:header>
								<i class="el-icon-data-analysis"></i>
								<span>{{$t('message.roleManagement.function')}}</span>
							</template>
						</vxe-table-column>
						<vxe-table-column :title="$t('message.roleManagement.see')" width="180" align="center">
							<template slot-scope="scope">
								<span style="position: relative;width:20px;height:20px;"  @click="touchIsSee(scope.row, scope.$index,scope)">
									<img style="position: relative;top:3px;width:15px;height:15px;" src="../../../static/image/selected_true.png" v-if="scope.row.isSee === true">
									<img style="position: relative;top:3px;width:15px;height:15px;border:1px solid lightgray;border-radius: 3px;" src="../../../static/image/selected_false.png" v-else>
								</span>
							</template>
						</vxe-table-column>
						<vxe-table-column :title="$t('message.roleManagement.use')" width="180" align="center">
							<template slot-scope="scope">
								<span style="position: relative;width:20px;height:20px;"  @click="touchIsUse(scope.row, scope.$index,scope)">
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

			<!-- 仪表盘 -->
			<div class="blockDiv">
				<div class="titleDiv">
					<span class="titleLeftSpan">{{$t('message.roleManagement.dashboardImport')}}</span>
					<div class="titleRightDiv">
						<el-button class="title-spread" size="small" type="text" @click="touchDashboardSpread()">{{isDashboardSpread?$t('message.businessDetail.packup'):$t('message.businessDetail.spread')}}<i :class="[isDashboardSpread?'iconfont wbs-shouqi':'iconfont wbs-zhankai']" style="color:#1585FF;font-size:12px;"></i></el-button>
					</div>
				</div>
				<div v-if="isDashboardSpread" class="commonline"></div>
				<div v-if="isDashboardSpread" class="tableDiv">
					<!-- <el-table
						ref="refDashboardTable"
						:data="tableDashboardData"
						style="width: 100%;"
						row-key="code"
						default-expand-all
						stripe
						:tree-props="{children: 'children'}">
						<el-table-column prop="name">
							<template slot="header" slot-scope="scope">
								<i class="el-icon-data-analysis"></i>
								<span>{{$t('message.roleManagement.function')}}</span>
							</template>
							<template slot-scope="scope">
								<v-leftline-show :isLastCell="scope.row.isLastCell" :level="scope.row.level" :leftLineShowStatusArr="scope.row.leftLineShowList"></v-leftline-show>
								<span style="line-height: 40px;vertical-align: top;" v-if="scope.row.children && scope.row.children.length>0" @click="clickDashboardTableRow(scope.row, scope.$index)">
									<i v-if="scope.row.isOpen" style="font-size:20px" class="el-icon-caret-bottom"></i>
									<i v-else style="font-size:20px" class="el-icon-caret-right"></i>
								</span>
								<span style="line-height: 40px;vertical-align: top;">{{scope.row.name}}</span>
							</template>
						</el-table-column>
						<el-table-column :label="$t('message.roleManagement.see')" width="180" align="center">
							<template slot-scope="scope">
								<span style="position: relative;width:20px;height:20px;"  @click="touchDashboardIsSee(scope.row, scope.$index,scope)">
									<img style="position: relative;top:3px;width:15px;height:15px;" src="../../../static/image/selected_true.png" v-if="scope.row.isSee === true">
									<img style="position: relative;top:3px;width:15px;height:15px;border:1px solid lightgray;border-radius: 3px;" src="../../../static/image/selected_false.png" v-else>
								</span>
							</template>
						</el-table-column>
						<el-table-column :label="$t('message.roleManagement.use')" width="180" align="center">
							<template slot-scope="scope">
								<span style="position: relative;width:20px;height:20px;"  @click="touchDashboardIsUse(scope.row, scope.$index,scope)">
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
						ref="refDashboardTable"
						:data="tableDashboardData"
						stripe
						border="inner"
						resizable
						show-overflow
						row-key
						:tree-config="{children: 'children', line: true,indent:30}">
						<vxe-table-column field="name" tree-node>
							<template v-slot:header>
								<i class="el-icon-data-analysis"></i>
								<span>{{$t('message.roleManagement.function')}}</span>
							</template>
						</vxe-table-column>
						<vxe-table-column :label="$t('message.roleManagement.see')" width="180" align="center">
							<template slot-scope="scope">
								<span style="position: relative;width:20px;height:20px;"  @click="touchDashboardIsSee(scope.row, scope.$index,scope)">
									<img style="position: relative;top:3px;width:15px;height:15px;" src="../../../static/image/selected_true.png" v-if="scope.row.isSee === true">
									<img style="position: relative;top:3px;width:15px;height:15px;border:1px solid lightgray;border-radius: 3px;" src="../../../static/image/selected_false.png" v-else>
								</span>
							</template>
						</vxe-table-column>
						<vxe-table-column :label="$t('message.roleManagement.use')" width="180" align="center">
							<template slot-scope="scope">
								<span style="position: relative;width:20px;height:20px;"  @click="touchDashboardIsUse(scope.row, scope.$index,scope)">
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
import { updateTableData, addParentCode, addLeftLineShowListToTableList,dealAllChildNodeSeeStatus,updateParentNodeSeeStatus,dealAllChildNodeUseStatus,updateParentNodeUseStatus  } from "@/util/role/roleDataParse";
import { format, numberFormat,formatData } from "@/util/util.js";
import router from "@/router";
import { mapState, mapActions } from 'vuex'
import Bus from "@/bus"
import leftLineShow from "./components/leftLineShow"
import { getFuncDataList,saveFuncPermissionConfig } from "@/util/api";

export default {
	name: "functionConfigList",
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
			
			isMenuSpread:true,
			isDashboardSpread:true,

			//菜单数据
			tableData: [],
			oldTableData: [],
			//选择功能项
			selectFunCodeArr:[],

			//仪表盘数据
			tableDashboardData: [],
			oldTableDashboardData: [],
			//选中仪表盘code数组
			selectDashboardCodeArr:[],

			//是否点击有变更
			isTouchChange:false,

			showRoleMsg:null,
        };
    },
    created(){
		console.log("functionConfigList  created....");

		//初始化数据
		let _this = this;
		_this.getFuncList();
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
		//获取功能权限数据列表
		getFuncList () {
			let _this = this;
            _this.loading = true;
            let param = {group:1};
            getFuncDataList(_this.roleMsg.id,param).then(res => {
                _this.loading = false;
                if (res.data.code === 0) {
					_this.showRoleMsg = res.data.data.role;
					if(!_this.isNullData(res.data.data) && res.data.data.length != 0){
						if (res.data.data.FUNC.FUNC) {
							//功能菜单数据
							_this.tableData = [];
							_this.tableData = res.data.data.FUNC.FUNC;
							_this.oldTableData = JSON.parse(JSON.stringify(res.data.data.FUNC.FUNC));
						}
						
						if (res.data.data.FUNC.DASHBOARD) {
							//仪表盘数据
							_this.tableDashboardData = [];
							_this.tableDashboardData = res.data.data.FUNC.DASHBOARD;
							_this.oldTableDashboardData = JSON.parse(JSON.stringify(res.data.data.FUNC.DASHBOARD));
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
		//根据数据列表数据 获取选中数据code
		getSelectCode(nodeList){
			let _this = this;

			let selectArr = [];
			nodeList.forEach(element => {
				if (element.isSee || element.isUse) {
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

			console.log("_this.oldTableData.....", _this.oldTableData);
			console.log("_this.oldTableDashboardData.....", _this.oldTableDashboardData);

			//功能菜单数据恢复
			_this.tableData = [];
			_this.tableData = JSON.parse(JSON.stringify(_this.oldTableData));

			//仪表盘数据恢复
			_this.tableDashboardData = [];
			_this.tableDashboardData = JSON.parse(JSON.stringify(_this.oldTableDashboardData));
		},
		//保存
		save(){
			let _this = this;
	
			_this.selectFunCodeArr = _this.getSelectCode(_this.tableData);
			console.log("_this.selectFunCodeArr.....", JSON.stringify(_this.selectFunCodeArr));

			_this.selectDashboardCodeArr = _this.getSelectCode(_this.tableDashboardData);
			console.log("_this.selectDashboardCodeArr.....", JSON.stringify(_this.selectDashboardCodeArr));

			let reqData = {
				func:_this.selectFunCodeArr,
				dashboard:_this.selectDashboardCodeArr,
			}
			_this.loading = true;
			saveFuncPermissionConfig(_this.roleMsg.id,reqData).then(res => {
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

		//功能展开收缩
		touchMenuSpread(){
			this.isMenuSpread = !this.isMenuSpread;
		},
		//点击是否可见
		touchIsSee(item, index){
			this.isTouchChange = true;

			item.isSee = !item.isSee;
			//如果点击项是包含子节点的，则默认全选或全不选子节点
			if (item.children && item.children.length>0) {
				item = dealAllChildNodeSeeStatus(item);
			}

			//保留当前选择更新后的节点数据
			let oldItem = JSON.parse(JSON.stringify(item));

			/***********************先更新可见列父节点****************************/
			//处理节点父节点可见状态
			item = updateParentNodeSeeStatus(this.tableData,item);

			this.tableData = updateTableData(this.tableData, item);

			/***********************如果是菜单类型，再更新可用列****************************/
			if (!oldItem.isSee) {
				oldItem.isUse = oldItem.isSee;

				//如果点击项是包含子节点的，则默认全选或全不选子节点
				if (oldItem.children && oldItem.children.length>0) {
					oldItem = dealAllChildNodeUseStatus(oldItem);
				}
				//处理节点父节点可见状态
				oldItem = updateParentNodeUseStatus(this.tableData,oldItem);

				this.tableData = updateTableData(this.tableData, oldItem);
			} else {
				// 如果是菜单类型,则可见状态与可用状态一至
				if (oldItem.type == 1) {
					oldItem.isUse = oldItem.isSee;

					//如果点击项是包含子节点的，则默认全选或全不选子节点
					if (oldItem.children && oldItem.children.length>0) {
						oldItem = dealAllChildNodeUseStatus(oldItem);
					}
					//处理节点父节点可见状态
					oldItem = updateParentNodeUseStatus(this.tableData,oldItem);

					this.tableData = updateTableData(this.tableData, oldItem);
				}
			}
		},
		//点击是否可用
		touchIsUse(item, index){
			this.isTouchChange = true;

			item.isUse = !item.isUse;
			//如果点击项是包含子节点的，则默认全选或全不选子节点
			if (item.children && item.children.length>0) {
				item = dealAllChildNodeUseStatus(item);
			}
			//保留选择的项
			let oldItem = JSON.parse(JSON.stringify(item));
			
			/***********************先更新可用列****************************/
			//处理节点父节点可见状态
			item = updateParentNodeUseStatus(this.tableData,item);

			this.tableData = updateTableData(this.tableData, item);

			//可用一定可见
			if (oldItem.isUse) {
				oldItem.isSee = oldItem.isUse;

				//如果点击项是包含子节点的，则默认全选或全不选子节点
				if (oldItem.children && oldItem.children.length>0) {
					oldItem = dealAllChildNodeSeeStatus(oldItem);
				}
				//处理节点父节点用状态
				oldItem = updateParentNodeSeeStatus(this.tableData,oldItem);

				this.tableData = updateTableData(this.tableData, oldItem);
			}else{ 
				//如果是菜单类型,则可见状态与可用状态一至
				if (oldItem.type == 1) {
					oldItem.isSee = oldItem.isUse;

					//如果点击项是包含子节点的，则默认全选或全不选子节点
					if (oldItem.children && oldItem.children.length>0) {
						oldItem = dealAllChildNodeSeeStatus(oldItem);
					}
					//处理节点父节点用状态
					oldItem = updateParentNodeSeeStatus(this.tableData,oldItem);

					this.tableData = updateTableData(this.tableData, oldItem);
				}else{//如果是行为类型,则可见状态与可用状态一至

				}
			}
		},
		clickTableRow(row,index){
			row.isOpen = !row.isOpen;

			this.$refs.refTable.toggleRowExpansion(row)
		},
		
		//仪表盘展开收缩
		touchDashboardSpread(){
			this.isDashboardSpread = !this.isDashboardSpread;
		},
		//点击仪表盘数据是否可见
		touchDashboardIsSee(item, index, scope){
			this.isTouchChange = true;

			item.isSee = !item.isSee;
			//如果点击项是包含子节点的，则默认全选或全不选子节点
			if (item.children && item.children.length>0) {
				item = dealAllChildNodeSeeStatus(item);
			}

			//保留选择的项
			let oldItem = JSON.parse(JSON.stringify(item));

			///***********************先更新可见字段列状态****************************/
			item = updateParentNodeSeeStatus(this.tableDashboardData,item);

			this.tableDashboardData = updateTableData(this.tableDashboardData, item); 

			/***********************如果是菜单类型，再更新可用列****************************/
			if (!oldItem.isSee) {
				oldItem.isUse = oldItem.isSee;

				//如果点击项是包含子节点的，则默认全选或全不选子节点
				if (oldItem.children && oldItem.children.length>0) {
					oldItem = dealAllChildNodeUseStatus(oldItem);
				}
				//处理节点父节点可见状态
				oldItem = updateParentNodeUseStatus(this.tableDashboardData,oldItem);

				this.tableDashboardData = updateTableData(this.tableDashboardData, oldItem);
			} else {
				// 如果是菜单类型,则可见状态与可用状态一至
				if (oldItem.type == 1) {
					oldItem.isUse = oldItem.isSee;

					//如果点击项是包含子节点的，则默认全选或全不选子节点
					if (oldItem.children && oldItem.children.length>0) {
						oldItem = dealAllChildNodeUseStatus(oldItem);
					}
					//处理节点父节点可见状态
					oldItem = updateParentNodeUseStatus(this.tableDashboardData,oldItem);

					this.tableDashboardData = updateTableData(this.tableDashboardData, oldItem);
				}
			}
		},
		//点击仪表盘数据是否可用
		touchDashboardIsUse(item, index, scope){
			this.isTouchChange = true;
			
			item.isUse = !item.isUse;
			//如果点击项是包含子节点的，则默认全选或全不选子节点
			if (item.children && item.children.length>0) {
				item = dealAllChildNodeUseStatus(item);
			}

			//保留选择的项
			let oldItem = JSON.parse(JSON.stringify(item));

			///***********************先更新可见内容列状态****************************/
			item = updateParentNodeUseStatus(this.tableDashboardData,item);

			this.tableDashboardData = updateTableData(this.tableDashboardData, item);

			//可用一定可见
			if (oldItem.isUse) {
				oldItem.isSee = oldItem.isUse;

				//如果点击项是包含子节点的，则默认全选或全不选子节点
				if (oldItem.children && oldItem.children.length>0) {
					oldItem = dealAllChildNodeSeeStatus(oldItem);
				}
				//处理节点父节点用状态
				oldItem = updateParentNodeSeeStatus(this.tableDashboardData,oldItem);

				this.tableDashboardData = updateTableData(this.tableDashboardData, oldItem);
			}else{ 
				//如果是菜单类型,则可见状态与可用状态一至
				if (oldItem.type == 1) {
					oldItem.isSee = oldItem.isUse;

					//如果点击项是包含子节点的，则默认全选或全不选子节点
					if (oldItem.children && oldItem.children.length>0) {
						oldItem = dealAllChildNodeSeeStatus(oldItem);
					}
					//处理节点父节点用状态
					oldItem = updateParentNodeSeeStatus(this.tableDashboardData,oldItem);

					this.tableDashboardData = updateTableData(this.tableDashboardData, oldItem);
				}else{//如果是行为类型

				}
			}
		},
		clickDashboardTableRow(row,index){
			row.isOpen = !row.isOpen;

			this.$refs.refDashboardTable.toggleRowExpansion(row)
        },
    }
}
</script>

<style>
	.contentDiv{
		padding:0px 20px 20px;
		margin:0px;
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

	/* .listTable /deep/ .el-table .cell .el-table__indent{
		background-color: aqua !important;
	} */

	/* .listTable /deep/ .el-table--striped .el-table__body tr.el-table__row--striped td{
		background-color: #FAFBFE;
	}
	.listTable /deep/ .el-table__expand-icon .el-table__expand-icon--expanded {
		-webkit-transform: rotate(0deg);
  		transform: rotate(0deg);
	}
	.listTable /deep/ .el-icon-caret-right:before {
		content: "\e791";
		font-size: 18px;
		top: 2px;;
		position: relative;
	}
	.listTable /deep/ .el-icon-caret-bottom:before {
		content: "\e790";
		font-size: 18px;
		top: 2px;;
		position: relative;
	}
	.listTable /deep/ .el-table__expand-icon {
		display: none !important;
		line-height: 0px !important;
		height: 40px;
	}
	.listTable /deep/ .el-table__indent {
		display: none;
	}
	.listTable /deep/ .el-table .cell {
		line-height: 40px;
		height: 40px;
	}
	.listTable /deep/ .el-table__placeholder {
		display: none;
	}
	.listTable /deep/ .el-table td .el-table_1_column_1 .is-left > .cell::before {
		content: "12313123";
		left: 10px;
		right: auto;
		border-width: 1px;
	} */


	.vxeTable /deep/ .vxe-cell--tree-node {
		position: relative;
		padding-left: 16px;
	}
	.tableDiv /deep/ .vxe-table.has--tree-line .vxe-tree--btn-wrapper {
		margin-left: 20px;
	}
	.tableDiv /deep/ .vxe-table .vxe-body--column.col--ellipsis>.vxe-cell .vxe-tree-cell {
		margin-left: 15px;
	}
	.tableDiv /deep/ .vxe-table .vxe-body--row.row--stripe{
		background-color: #FAFBFE;
	}
	.tableDiv /deep/ .vxe-table .vxe-tree--line {
		content: "";
		position: absolute;
		bottom: -.9em;
		width: 1.3em;
		border-width: 0 0 1px 1px;
		border-style: dotted dotted solid dotted;
		border-color: #D2D8E5;
		pointer-events: none;
	}
	.tableDiv /deep/ .vxe-table.has--tree-line .vxe-body--row .vxe-body--column {
		height: 40px;
	}
	.tableDiv /deep/ .vxe-table .vxe-body--column:not(.col--ellipsis), .vxe-table .vxe-footer--column:not(.col--ellipsis), .vxe-table .vxe-header--column:not(.col--ellipsis){
		padding: 8px 0px;
	}
	.tableDiv /deep/ .vxe-table .vxe-table--border-line {
		border: 0px solid #e8eaec !important;
	}


	.btnFunClass /deep/ .el-button--primary:disabled {
		color: #fff;
		background-color: rgb(231, 231, 231) !important;
		border-color: rgb(231, 231, 231) !important;
		padding: 7px 10px;
		font-size: 12px;
	}







	/* .tree-container /deep/ .el-tree-node__expand-icon.expanded {
		-webkit-transform: rotate(90deg);
  		transform: rotate(90deg);
	}

	.tree-container /deep/ .el-icon-caret-right:before {
		content: "\e791";
		font-size: 18px;
	}
	
	.tree-container /deep/ .el-tree-node__expand-icon{
		margin-left: 15px;
		padding: 0px;
	}
	
	.tree-container /deep/ .el-tree-node__expand-icon.is-leaf{
		margin-left: 0px;
	}

	.tree-container /deep/ .el-tree-node {
		position: relative;
		padding-left: 16px;
	}
 
	.tree-container /deep/ .el-tree-node__children {
		padding-left: 16px;
	}


	.tree-container /deep/ .el-tree > .el-tree-node:before {
      	border-left: none;
    }
 
    .tree-container /deep/ .el-tree > .el-tree-node:after {
      	border-top: none;
    }
	.tree-container /deep/ .el-tree > .el-tree-node:before {
		border-left: none;
	}
 
	.tree-container /deep/ .el-tree > .el-tree-node:after {
		border-top: none;
	}
 
	.tree-container /deep/ .el-tree-node:before {
		content: "";
		left: 10px;
		position: absolute;
		right: auto;
		border-width: 1px;
	}
 
	.tree-container /deep/ .el-tree-node:after {
		content: "";
		left: 10px;
		position: absolute;
		right: auto;
		border-width: 1px;
	}
 
	.tree-container /deep/ .el-tree-node:before {
		border-left: 1px solid #e6e6e6;
		bottom: 0px;
		height: 100%;
		top: -19px;
		width: 1px;
	}
 
	.tree-container /deep/ .el-tree-node:after {
		border-top: 1px solid #e6e6e6;
		height: 25px;
		top: 20px;
		width: 20px;
	}

	.el-tree-node :last-child:before {
      	height: 40px;
    }

	
	.tree-container {
		margin: 10px;
	}
	.tree-container /deep/ .el-tree .el-tree-node {
		position: relative;
	}
	.tree-container /deep/ .el-tree-node .el-tree-node__content {
    	height: 40px;
		padding-left: 18px;
	}
	.tree-container /deep/ .el-tree-node .el-tree-node__content::before {
		border-left: 1px solid #e6e6e6;
		height: 100%;
		top: 0;
		width: 1px;
		margin-left: 1px;
		margin-top: 0px;
		z-index: 8;
	}
	.tree-container /deep/ .el-tree-node .el-tree-node__children .el-tree-node__content::before {
		border-left: 0px solid #e6e6e6;
		height: 100%;
		top: 0;
		width: 1px;
		margin-left: 1px;
		margin-top: 0px;
		z-index: 8;
	}

	.tree-container /deep/ .el-tree-node .el-tree-node__content::after {
		border-top: 1px solid #e6e6e6;
		height: 1px;
		top: 18px;
		width: 13px;
		margin-left: 1px;
		z-index: 8;
	}
	
	.tree-container /deep/ .el-tree-node .el-tree-node__children  .el-tree-node__content::after {
		border-top: 0px solid #e6e6e6;
	}

	.tree-container .el-tree-node .el-tree-node__content::before, .tree-container .el-tree-node .el-tree-node__content::after {
		content: '';
		position: absolute;
		right: auto;
	}

	.pHead {
		height: 40px;
		margin: 0;
		background-color: #e9ebf3;
		font-size: 14px;
		font-weight: normal;
		display: block;
		min-width: 800px;
		position: relative;
	}
	.flHead {
		float: left;
		margin-left: 10px;
		line-height: 38px;
		color: #333;
	}
	.frHead {
		flex: 1;
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
		line-height: 40px;
	}
	.frHeadSpan {
		font-size: 14px;
		width: 200px;
		text-align: center;
		color: #333;
	} */

</style>