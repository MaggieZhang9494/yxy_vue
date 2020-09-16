<template>
    <div class="bg-f7f7f7" v-loading="excelLoading">
        <v-content-head :headTitle="title" :headTitlePath="{path:'/businessList'}" :icon="true"></v-content-head>
        <div class="module-wrapper">
            <div class="contentTitle">
                <span class="title-content" style="color: black;">{{$t('message.businessSearch.date')}}：{{startDate?(startDate+' ~ '+endDate):"--"}}</span>
                <span>{{$t('message.businessSearch.totalPollNum')}}：</span>
                <span class="title-content">{{statistics.total}}</span>
                <span>{{$t('message.businessSearch.donePollNum')}}：</span>
                <span class="title-content">{{statistics.finished}}</span>
                <span>{{$t('message.businessSearch.unDonePollNum')}}：</span>
                <span class="title-content">{{statistics.unfinished}}</span>

                <el-popover
                    placement="bottom-end"
                    :width="exportViewWidth"
                    trigger="click"
                    v-model="exportVisible">
                    <div style="position: relative;padding:0px 0px 10px 0px">{{$t('message.businessSearch.dataExport')}}</div>
                    <div class="commonline"></div>
                    <div style="position: relative;padding:10px 0px 5px 20px;">
                        <div style="position: relative;padding:0px 0px 5px 0px;color:#999;">{{$t('message.businessSearch.chooseExportType')}}</div>
                        <el-radio v-for="(item, index) in exportTypeList" :key="index" v-model="exportType" :label="item.value" >{{item.node}}</el-radio>
                    </div>
                    <div class="commonline"></div>
                    <div style="text-align:right;padding:10px 0px 0px 0px">
                        <el-button @click="previewFile">{{$t('message.businessSearch.preview')}}</el-button>
                        <el-button v-if="portType=='FI' && perssionData.funcMenu['FUNC.FUNC.CODE_03.CODE_01.CODE_01.CODE_02'].isSee==true" type="primary" @click="dataExport">{{$t('message.businessSearch.export')}}</el-button>
						<el-button v-if="portType=='FE' && perssionData.funcMenu['FUNC.FUNC.CODE_03.CODE_01.CODE_02.CODE_02'].isSee==true" type="primary" @click="dataExport">{{$t('message.businessSearch.export')}}</el-button>
                    </div>
                    <el-button v-if="portType=='FI' && perssionData.funcMenu['FUNC.FUNC.CODE_03.CODE_01.CODE_01.CODE_02'].isSee==true" slot="reference" type="primary" size="medium" style="display:inline-flex;float:right;position:relative;top: -2px;">{{$t('message.businessSearch.dataExport')}}</el-button>
					<el-button v-if="portType=='FE' && perssionData.funcMenu['FUNC.FUNC.CODE_03.CODE_01.CODE_02.CODE_02'].isSee==true" slot="reference" type="primary" size="medium" style="display:inline-flex;float:right;position:relative;top: -2px;">{{$t('message.businessSearch.dataExport')}}</el-button>
                
				</el-popover>

            </div>
            <div class="line"></div>
            <div class="order-table">
                <el-table ref="tableList" :data="orderList" height="567" :row-key="getRowKeys" :expand-row-keys="expands" tooltip-effect="light" v-loading="loading">
                    <el-table-column v-if="orderList.length>0" type="expand" width="1">
                        <template slot-scope="props">
                            <div style="position: relative;width:100%;left:0px;right:0px;height:100%;">
                                <!-- 加上此样式，进行x滚动位置，设置left -->
                                <div class="cellLeftContent" style="position: relative;width:700px;">
                                    <div class="cell-item">{{$t('message.businessSearch.cochainTime')}}：{{ props.row.chain_time }}</div>
                                    <div class="cell-item">
                                        {{$t('message.businessSearch.saveCerMsg')}}：
                                        <el-tooltip v-if="props.row.isShowTip" popper-class="atooltip" effect="light" :content="$t('message.businessSearch.saveingCer')" placement="top-start">
                                            <span style='cursor:pointer;'>{{ props.row.tx_hash }}</span>
                                        </el-tooltip>
                                        <span v-else style='color: #1585FF;cursor:pointer;'  @click="goShowCertificate(props.row.tx_hash)">{{ props.row.tx_hash }}</span>
                                    </div>
                                </div>
                                <!-- 加上此样式，进行x滚动位置计算，设置right -->
                                <!-- float:left; -->
                                <div class="cellRightSteps" style="display: inline;position: relative;text-align:left;">
                                    <!-- //口岸进口订单进度 -->
                                    <!-- 进度靠右显示 v-if="props.row.stepsActive>0 && index+1<=props.row.stepsActive" -->
                                    <!-- 进度靠左占位显示 :class="index+1==props.row.stepsActive?'lastStepClass':''" :style="{'opacity':props.row.stepsActive>0 && index+1<=props.row.stepsActive?'1':'0'}" -->
                                    <el-steps v-if="portType=='FI'" :space="stepSpace" :active="props.row.stepsActive" finish-status="success" align-center>
                                        <!-- <el-step v-for="(item, index) in props.row.stepsTitle" :key="index" :title="item" :class="index+1==props.row.stepsActive+1?'lastStepClass':''" 
                                        :style="{'opacity':index<=props.row.stepsActive?'1':'0'}"></el-step> -->
                                        <el-step v-for="(item, index) in props.row.stepsTitle" :key="index" :title="item" :class="index+1==props.row.totalSteps?'lastStepClass':''" 
                                        :style="{'opacity':index+1<=props.row.totalSteps?'1':'0'}"></el-step>
                                        <!-- <el-step v-for="(item, index) in props.row.stepsTitle" :key="index" :title="item"></el-step> -->
                                        <!-- <el-step v-for="(item, index) in allNodeList" :key="index" :title="item" v-if="props.row.stepsActive>0 && index+1<=props.row.stepsActive"></el-step> -->
                                        <!-- <el-step v-for="(item, index) in allNodeList" :key="index" :title="item"></el-step> -->
                                    </el-steps>
                                    <!-- //口岸出口订单进度 -->
                                    <!-- 进度靠右显示 v-if="props.row.stepsActive>0 && index+1<=props.row.stepsActive" -->
                                    <!-- 进度靠左占位显示 :class="index+1==props.row.stepsActive?'lastStepClass':''" :style="{'opacity':props.row.stepsActive>0 && index+1<=props.row.stepsActive?'1':'0'}" -->
                                    <el-steps v-else :space="stepSpace" :active="props.row.stepsActive" finish-status="success" align-center>
                                        <!-- <el-step v-for="(item, index) in props.row.stepsTitle" :key="index" :title="item" :class="index+1==props.row.stepsActive+1?'lastStepClass':''" 
                                        :style="{'opacity':index<=props.row.stepsActive?'1':'0'}"></el-step> -->
                                        <el-step v-for="(item, index) in props.row.stepsTitle" :key="index" :title="item" :class="index+1==props.row.totalSteps?'lastStepClass':''" 
                                        :style="{'opacity':index+1<=props.row.totalSteps?'1':'0'}"></el-step>
                                        <!-- <el-step v-for="(item, index) in props.row.stepsTitle" :key="index" :title="item"></el-step> -->
                                        <!-- <el-step v-for="(item, index) in allExportNodeList" :key="index" :title="item" v-if="props.row.stepsActive>0 && index+1<=props.row.stepsActive"></el-step> -->
                                        <!-- <el-step v-for="(item, index) in allExportNodeList" :key="index" :title="item"></el-step> -->
                                    </el-steps>
                                </div>
                            </div>

                        </template>
                    </el-table-column>
					<!-- 序号 进口-->
                    <el-table-column  
						v-if="portType=='FI' && perssionData.dataMenu['DATA.FI.NUMBER'].isSee"
                        fixed="left"
                        align="center"
                        :label="$t('message.businessSearch.number')"
                        :width="busNumber"
                        type="index">
                        <template slot-scope="scope">
                            <span>{{scope.row['number']}}</span>
                        </template>
                    </el-table-column>
					<!-- 序号 出口-->
                    <el-table-column  
						v-if="portType=='FE' && perssionData.dataMenu['DATA.FE.NUMBER'].isSee"
                        fixed="left"
                        align="center"
                        :label="$t('message.businessSearch.number')"
                        :width="busNumber"
                        type="index">
                        <template slot-scope="scope">
                            <span>{{scope.row['number']}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="head in orderHeader" :min-width="head.columnWidth" :label="head.name" :key="head.enName" show-overflow-tooltip align="left">
                        <template slot-scope="scope">
                            <template v-if="head.enName=='ORDER_NO' || head.enName=='CONTRACT_NO' || head.enName=='MBL_NO'">
                                <span style="color: #1585FF;cursor:pointer;" @click="gotoOrderDetail(scope.row)">{{scope.row.row_data[head.enName]?scope.row.row_data[head.enName]:$t('message.common.noData')}}</span>
                            </template>
                            <template v-else>
                                <span>{{scope.row.row_data[head.enName]}}</span>
                            </template>
                        </template>
                    </el-table-column>
                    <!-- 件数 进口-->
                    <el-table-column v-if="portType=='FI' && perssionData.dataMenu['DATA.FI.CARGO_NUM'].isSee" :width="cargoNumWidth" :label="businessDesc.CARGO_NUM" align="right">
                        <template slot-scope="scope">
                            <span>{{scope.row.row_data['CARGO_NUM']}}</span>
                        </template>
                    </el-table-column>
					<!-- 件数 出口 -->
                    <el-table-column v-if="portType=='FE' && perssionData.dataMenu['DATA.FE.CARGO_NUM'].isSee" :width="cargoNumWidth" :label="businessDesc.CARGO_NUM" align="right">
                        <template slot-scope="scope">
                            <span>{{scope.row.row_data['CARGO_NUM']}}</span>
                        </template>
                    </el-table-column>
                    <!-- 毛重 进口-->
                    <el-table-column v-if="portType=='FI' && perssionData.dataMenu['DATA.FI.GROSS_WEIGHT'].isSee" :width="grossWeightWidth" :label="businessDesc.GROSS_WEIGHT" align="right">
                        <template slot-scope="scope">
                            <span>{{scope.row.row_data['GROSS_WEIGHT']}}</span>
                        </template>
                    </el-table-column>
					<!-- 毛重 出口-->
                    <el-table-column v-if="portType=='FE' && perssionData.dataMenu['DATA.FE.GROSS_WEIGHT'].isSee" :width="grossWeightWidth" :label="businessDesc.GROSS_WEIGHT" align="right">
                        <template slot-scope="scope">
                            <span>{{scope.row.row_data['GROSS_WEIGHT']}}</span>
                        </template>
                    </el-table-column>
                    <!-- 体积 进口-->
                    <el-table-column v-if="portType=='FI' && perssionData.dataMenu['DATA.FI.GROSS_VOLUME'].isSee" :width="grossWolumeWidth" :label="businessDesc.GROSS_VOLUME" align="right">
                        <template slot-scope="scope">
                            <span>{{scope.row.row_data['GROSS_VOLUME']}}</span>
                        </template>
                    </el-table-column>
					<!-- 体积 出口-->
                    <el-table-column v-if="portType=='FE' && perssionData.dataMenu['DATA.FE.GROSS_VOLUME'].isSee" :width="grossWolumeWidth" :label="businessDesc.GROSS_VOLUME" align="right">
                        <template slot-scope="scope">
                            <span>{{scope.row.row_data['GROSS_VOLUME']}}</span>
                        </template>
                    </el-table-column>

                </el-table>
                <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
            <el-dialog :visible.sync="previewDialogVisible" :title="previewDialogTitle" width="80%" :append-to-body="true" :center="true" class="dialog-wrapper" v-if="previewDialogVisible">
                <v-preview-dialog :previewDialogOptions="previewDialogOptions" @success="success" @close="close"></v-preview-dialog>
            </el-dialog>
        </div>
        <v-load-dialog v-if="certloading" :dialogVisible="certloading" :isShowDeleteBtn="true" :cancel="loadCancel"> </v-load-dialog>
    </div>
</template>
<script>
import contentHead from "@/components/contentHead";
import { orderList, getBusinessDesc,getPdfContent,getExportTypeList,getExportDownUrl,getExportId } from "@/util/api";
import { getStepsActive,getTotalStepsActive,getTotalStepsTitle,getExportStepsActive,getExportTotalStepsActive,getExportStepsTitle } from "@/util/orderDataParse";
import router from "@/router";
import errcode from "@/util/errcode";
import loadDialog from "@/components/loadingDialog";
import previewDialog from "./components/previewDialog";
import { mapState, mapActions } from 'vuex'
import Bus from "@/bus"
import { getOrderListHeaderShowList } from '@/util/role/menuDataShowDeal'

export default {
    name: "orderList",
    components: {
        "v-content-head": contentHead,
        "v-load-dialog":loadDialog,
        "v-preview-dialog":previewDialog,
    },
    data: function() {
        return {
            title: "",
            //搜索页面传入的参数
            searchQuery:null,
            params:null,

            //列表相关
            loading:false,
            currentPage: 1,
            pageSize: 5,
            total: 0,

            //证书加载
            certloading:false,
            //导出类型
            exportType:'MBL_NO',
            exportVisible:false,

            //顶部统计字段
            startDate:"",
            endDate:"",

            //总的统计对象，包含total、finished、unfinished
            statistics:{
                total:"0",
                finished:"0",
                unfinished:"0",
            },

            //预览视图
            previewDialogVisible:false,
            previewDialogTitle:"",
            previewDialogOptions:{},

            //列表显示
            orderHeader:[],
            orderList:[],
            // 获取row的key值
            getRowKeys(row) {
                return row.tx_hash;
            },

            // 要展开的行，数值的元素是row的key值
            expands: [],
            // 业务描述字段对象，返回字段描述的中英文
            businessDesc:{},
            //取消请求
            source:null,
            //是否是元初的客户
            isYuanChuAcc:localStorage.getItem("IsYuanChuAcc"),

            //全部进口业务流程节点
            allNodeList:[
                this.$i18n.t('message.businessSearch.order'),
                this.$i18n.t('message.businessSearch.changeOrder'),
                this.$i18n.t('message.businessSearch.customs'),
                // this.$i18n.t('message.businessSearch.auxiliaryInspection'),
                this.$i18n.t('message.businessSearch.trans'),
                // this.$i18n.t('message.businessSearch.mianInspection'),
            ],
            //全部出口业务流程节点
            allExportNodeList:[
                this.$i18n.t('message.businessSearch.order'),
                this.$i18n.t('message.businessSearch.booking'),
                this.$i18n.t('message.businessSearch.customs'),
                this.$i18n.t('message.businessSearch.trans'),
            ],
            //导出路径查询定时器
            interval:null,
            //导出表格进度显示
            excelLoading:false,
            //导出选择项列表数据
            exportTypeList:[],
            //列表视图对应列的宽度
            exportViewWidth:150,
            cargoNumWidth:60,
            grossWeightWidth:100,
            grossWolumeWidth:110,
            busNumber:50,
            //进度之间间距
            stepSpace:60,
            //是否是最后一个节点
            isLastStep:false,

            //查询的订单列表类型
			portType:"", //"FI"进口:"FE"出口
			
			//权限数据
			perssionData:{},
        };
    },
    created(){
		let _this = this;
		
		this.perssionData = JSON.parse(localStorage.getItem("MenuDataCode"));

        //处理中英文版本数据
        _this.dealZH_EN();
        //初始化列表查询参数
        _this.initSearchParams();
        //获取业务字段描述信息
        _this.getBusDesc();
        //获取导出报表类型项
        _this.getExportItemsList();


    },
    beforeDestroy: function () {
        Bus.$off("changeGroup")
    },
    mounted: function() {
        Bus.$on("changeGroup", data => {
			// this.changGroup(data)
			// this.$router.go(-1);//返回上一层
			this.$router.push("/businessSearch");//返回上一层
        })
    },
    computed: {
        ...mapState([
            'orderSearchParams',
            'orderCurrentPage',
        ])
    },
    methods: {
        ...mapActions([
            'setOrderCurrentPage'
            ]),
        /**
         * 处理中英文数据
         */
        dealZH_EN(){
            if(localStorage.getItem("internationalization") == 'zh-cn'){ /* 中文版本 */
                this.exportViewWidth = 150;
                this.cargoNumWidth=60;
                this.grossWeightWidth=100;
                this.grossWolumeWidth=120;
                this.busNumber = 50;
                this.stepSpace = this.portType=='FI'?60:60;
            }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
                this.exportViewWidth = 190;
                this.cargoNumWidth=60;
                this.grossWeightWidth=130;
                this.grossWolumeWidth=140;
                this.busNumber = 50;
                this.stepSpace = this.portType=='FI'?140:140;
            }else{
                this.exportViewWidth = 150;
                this.cargoNumWidth=60;
                this.grossWeightWidth=100;
                this.grossWolumeWidth=110;
                this.busNumber = 50;
                this.stepSpace = this.portType=='FI'?60:60;
            }
        },
        changGroup(val){
            //初始化列表查询参数
            this.initSearchParams();
            //获取业务字段描述信息
            this.getBusDesc();
            //获取导出报表类型项
            this.getExportItemsList();
        },
        //初始化列表查询参数
        initSearchParams(){
            let _this = this;

            _this.searchQuery = JSON.parse(localStorage.getItem("orderSearchParams"));
            console.log("searchParams....",_this.searchQuery);
            _this.title = _this.searchQuery.listTitle;
            _this.params = _this.searchQuery.params;
            _this.total = parseInt(_this.searchQuery.total);

            _this.startDate = _this.params.start_at;
            _this.endDate = _this.params.end_at;
            _this.statistics = _this.searchQuery.statistics;
            _this.portType = _this.params.ORDER_TYPE;

            _this.currentPage = _this.orderCurrentPage;
            console.log("currentPage...",this.currentPage);

            // if(_this.isYuanChuAcc == "1"){
            //     _this.orderHeader = [
            //         {enName: "CONTRACT_NO",name: this.$i18n.t('message.businessSearch.contractNum')},
            //         {enName: "MBL_NO",name: "承运人提单号"},
            //         {enName: "HBL_NO",name: "分单号"},
            //         {enName: "TRADE_TOOL_TYPE_NAME",name: "运输方式"},
            //         {enName: "POL_COUNTRY",name: "启运国(地区)"},
            //         {enName: "POL_NAME",name: "启运港"},
            //         {enName: "POD_COUNTRY",name: "目的国(地区)"},
            //         {enName: "POD_NAME",name: "目的港"},
            //         {enName: "ETA",name: "预计到港日"},
            //         {enName: "ATA",name: "实际到港日"},
            //         // {enName: "CARGO_NUM",name: "件数"},
            //         // {enName: "GROSS_WEIGHT",name: "毛重(kg)"},
            //         // {enName: "GROSS_VOLUME",name: "体积(m³)"},
            //     ];
            // }else{
            //     _this.orderHeader = [
            //         {enName: "BUSINESS_TYPE",name: this.$i18n.t('message.businessSearch.busKind')},
            //         {enName: "ORDER_NO",name: "工作号"},
            //         {enName: "CUST_CN",name: "客户名称"},
            //         {enName: "CONTRACT_NO",name: this.$i18n.t('message.businessSearch.contractNum')},
            //         {enName: "MBL_NO",name: "承运人提单号"},
            //         {enName: "HBL_NO",name: "分单号"},
            //         {enName: "TRADE_TOOL_TYPE_NAME",name: "运输方式"},
            //         {enName: "POL_COUNTRY",name: "启运国(地区)"},
            //         {enName: "POL_NAME",name: "启运港"},
            //         {enName: "POD_COUNTRY",name: "目的国(地区)"},
            //         {enName: "POD_NAME",name: "目的港"},
            //         {enName: "ETA",name: "预计到港日"},
            //         {enName: "ATA",name: "实际到港日"},
            //         // {enName: "CARGO_NUM",name: "件数"},
            //         // {enName: "GROSS_WEIGHT",name: "毛重(kg)"},
            //         // {enName: "GROSS_VOLUME",name: "体积(m³)"},
            //     ];
            // }

            // if(_this.portType == 'FE'){//订单出口类型
            //     _this.orderHeader.push({enName:"PRD_NAME",name:this.$i18n.t('message.businessSearch.salesUnit')});//"生产销售单位");
            // }else{
            //     _this.orderHeader.push({enName: "PRD_NAME",name: this.$i18n.t('message.businessSearch.buildingUser')});//"消费使用单位");
			// }
			
			_this.orderHeader = getOrderListHeaderShowList(_this.portType,_this.perssionData);

            console.log("_this.params.language.......",_this.params.language)
            console.log("localStorage.getItem('internationalization').......",localStorage.getItem("internationalization"))
            console.log("localStorage.getItem('groupId').......",localStorage.getItem("groupId"))
            _this.params.groupId = localStorage.getItem("groupId");
            if(_this.isNullData(_this.$route.query.queryData)){
                _this.getOrderList();
                console.log("重新加载数据.......")
            }

        },
        //处理列表展开内容初始位置
        dealTableShow(){
            let _this = this;

            let rightStepsWidth = 0;
            if(_this.portType != 'FE'){//订单进口类型
                rightStepsWidth = this.stepSpace*5;
                if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
                    
                }else{
                    rightStepsWidth -= 100;
                }
            }else {
                rightStepsWidth = this.stepSpace*3;
                if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
                    
                }else{
                    rightStepsWidth -= 60;
                }
            }
            // if(localStorage.getItem("internationalization") == 'zh-cn'){ /* 中文版本 */
            //     if(_this.portType != 'FE'){//订单进口类型
            //         rightStepsWidth = stepSpace*6;
            //     }else {
            //         rightStepsWidth = stepSpace*4;
            //     }
            // }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
            //     if(_this.portType != 'FE'){//订单进口类型
            //         rightStepsWidth = stepSpace*6;
            //     }else {
            //         rightStepsWidth = stepSpace*4;
            //     }
            // }else{
            //     if(_this.portType != 'FE'){//订单进口类型
            //         rightStepsWidth = stepSpace*6;
            //     }else {
            //         rightStepsWidth = stepSpace*4;
            //     }
            // }
			if (_this.$refs.tableList && _this.$refs.tableList.bodyWidth) {
				//设置列表展开内容初始位置
				setTimeout(()=>{
					//列表横向内容宽度
					let tableBodyWidth = _this.$refs.tableList.bodyWidth;
					tableBodyWidth = tableBodyWidth.replace(/px/, "");
					//列表横向显示宽度
					let tableShowWidth = _this.$refs.tableList.$el.clientWidth;

					let cellRightDivs = document.getElementsByClassName("cellRightSteps");
					console.log("cellRightDivs...", cellRightDivs);
					for (let index = 0; index < cellRightDivs.length; index++) {
						const element = cellRightDivs[index];
						if((700+rightStepsWidth) > tableShowWidth){
							// let newRight = tableBodyWidth-tableShowWidth-0-rightStepsWidth;
							let newRight = tableBodyWidth - (0+700+rightStepsWidth+20);
							if(newRight<0){
								element.style.right =0+"px";
							}else{
								element.style.right =newRight+"px";
							}
						}else{
							let right = tableBodyWidth-tableShowWidth-0;//+10;
							element.style.right = right+"px";
						}
					}
					_this.$refs.tableList.$el.style.height = 576+"px";
				},10)

				// 监听滚动条的位置，设置cell内容坐标
				_this.$refs.tableList.bodyWrapper.addEventListener('scroll', (res) => {
					//列表横向内容宽度
					let tableBodyWidth = _this.$refs.tableList.bodyWidth;
					tableBodyWidth = tableBodyWidth.replace(/px/, "");
					//列表横向显示宽度
					let tableShowWidth = _this.$refs.tableList.$el.clientWidth;

					let scrollLeft = res.target.scrollLeft >= (tableBodyWidth-tableShowWidth)?tableBodyWidth-tableShowWidth:res.target.scrollLeft;

					//更改元素显示坐标，让其随着滚动条变化变化
					let cellLeftDivs = document.getElementsByClassName("cellLeftContent");
					let cellRightDivs = document.getElementsByClassName("cellRightSteps");
					let leftCellWidth = 0;
					for (let index = 0; index < cellLeftDivs.length; index++) {
						const element = cellLeftDivs[index];
						element.style.left = scrollLeft+5+"px";

						leftCellWidth = element.clientWidth;
					}
					
					for (let index = 0; index < cellRightDivs.length; index++) {
						const element = cellRightDivs[index];
						// let right = tableBodyWidth-tableShowWidth-scrollLeft-10;
						// element.style.right = right+"px";
						element.style.width = rightStepsWidth+"px";;
						if(leftCellWidth+rightStepsWidth > tableShowWidth){
							// let newRight = tableBodyWidth-tableShowWidth-scrollLeft-rightStepsWidth;
							let newRight = tableBodyWidth - (scrollLeft+leftCellWidth+rightStepsWidth+20);
							if(newRight<0){
								element.style.right =0+"px";
								for (let k = 0; k < cellLeftDivs.length; k++) {
									const leftElement = cellLeftDivs[index];
									leftElement.style.left = scrollLeft+newRight+"px";
								}
							}else{
								element.style.right =newRight+"px";
							}
						}else{
							let right = tableBodyWidth-tableShowWidth-scrollLeft;//+10;
							element.style.right = right+"px";
						}
					}

					console.log("cellRightDivs...",cellRightDivs);
				},false)

				this.$refs.tableList.bodyWrapper.scrollTop = 0;
			}
            
            // this.$refs.tableList.bodyWrapper.scrollLeft= 0;
        },
        /**
         * 获取业务描述字段信息
         */
        getBusDesc(){
            let _this = this;
            let params = {
                ORDER_TYPE:_this.portType
            };
            _this.loading = true;
            getBusinessDesc(params).then(res => {

                if (res.data.code === 0) {
                    let dataDesc = res.data.data;
                    //存储业务字段描述信息
                    _this.businessDesc = dataDesc;
                    localStorage.setItem("BusinessDesc", JSON.stringify(_this.businessDesc));
                    //根据返回的业务字段信息，得出列表列显示字段列表
                    _this.orderHeader = _this.orderHeader.map(item=>{
                        //orderHeader,将columnWidth:100px写入每个对象中
                        item.columnWidth = '150px';

                        if(localStorage.getItem("internationalization") == 'zh-cn'){ /* 中文版本 */
                            if(item.enName=='CONTRACT_NO'){//合同协议号
                                item.columnWidth = '120px';
                            }else if(item.enName=='MBL_NO'){//承运人提单号
                                item.columnWidth = '160px';
                            }else if(item.enName=='ORDER_NO'){//工作号
                                item.columnWidth = '140px';
                            }else if(item.enName=='BUSINESS_TYPE'){//行业种类
                                item.columnWidth = '100px';
                            }else if(item.enName=='CUST_CN'){//客户名称
                                item.columnWidth = '240px';
                            }else if(item.enName=='TRADE_TOOL_TYPE_NAME'){//运输方式
                                item.columnWidth = '80px';
                            }else if(item.enName=='POL_COUNTRY'){//启运国(地区)
                                item.columnWidth = '120px';
                            }else if(item.enName=='ETA'){//预计到港日
                                item.columnWidth = '90px';
                            }else if(item.enName=='ATA'){//实际到港日
                                item.columnWidth = '140px';
                            }
                        }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
                            if(item.enName=='CONTRACT_NO'){//合同协议号
                                item.columnWidth = '120px';
                            }else if(item.enName=='MBL_NO'){//承运人提单号
                                item.columnWidth = '160px';
                            }else if(item.enName=='ORDER_NO'){//工作号
                                item.columnWidth = '140px';
                            }else if(item.enName=='BUSINESS_TYPE'){//行业种类
                                item.columnWidth = '125px';
                            }else if(item.enName=='CUST_CN'){//客户名称
                                item.columnWidth = '240px';
                            }else if(item.enName=='TRADE_TOOL_TYPE_NAME'){//运输方式
                                item.columnWidth = '90px';
                            }else if(item.enName=='POL_COUNTRY'){//启运国(地区)
                                item.columnWidth = '190px';
                            }else if(item.enName=='ETA'){//预计到港日
                                item.columnWidth = '180px';
                            }else if(item.enName=='ATA'){//实际到港日
                                item.columnWidth = '150px';
                            }else if(item.enName=='POD_COUNTRY'){//目的国(地区)
                                item.columnWidth = '190px';
                            }
                        }

                        for(let key in dataDesc){
                            if(item.enName == key){
                                item.name = dataDesc[key];
                                break;
                            }
                        }
                        return item;
                    });

                    //处理订单数据
					_this.expands = [];
					let isEn = localStorage.getItem("internationalization")=="en"?true:false;
                    _this.orderList = _this.searchQuery.orderList.map((item,index)=>{
						if (_this.portType=='FI' && _this.perssionData.dataMenu['DATA.FI.NUMBER'].isUse) {
							item.number = (_this.currentPage-1)*_this.pageSize+index+1;
						}else if (_this.portType=='FE' && _this.perssionData.dataMenu['DATA.FE.NUMBER'].isUse) {
							item.number = (_this.currentPage-1)*_this.pageSize+index+1;
						}else{
							item.number = "";
						}
						
						item.row_data.CUST_CN = (isEn==true)?(!_this.isNullData(item.row_data.CUST_NAME_EN)?item.row_data.CUST_NAME_EN:item.row_data.CUST_CN):item.row_data.CUST_CN;
						
                        // if(index == 0){ //因为没数据，所以默认第一条可点击
                        //     item.isShowTip = false;
                        // }else
                        {
                            if(item.row_data.ORDER_STATUS == "结算中" || item.row_data.ORDER_STATUS == "In Settlement" || 
                            item.row_data.ORDER_STATUS == "归档" || item.row_data.ORDER_STATUS == "Archived"){
                                item.isShowTip = false;
                            }else{
                                item.isShowTip = true;
                            }
                        }

                        _this.expands.push(item.tx_hash);
                        if(_this.portType == 'FI'){ //进口订单类型
                            item.totalSteps = getTotalStepsActive(item.row_data);
                            item.stepsActive = getStepsActive(item.row_data);
                            item.stepsTitle = getTotalStepsTitle(item.row_data,true);
                        }else{
                            item.totalSteps = getExportTotalStepsActive(item.row_data);
                            item.stepsActive = getExportStepsActive(item.row_data);
                            item.stepsTitle = getExportStepsTitle(item.row_data,true);
                        }
                        //测试代码
                        // if(index<=5){
                        //     item.stepsActive = index;
                        // }else{
                        //     item.stepsActive = 5;
						// }
						

                        return item;
                    })

                    _this.dealTableShow();

                    _this.loading = false;
                } else {
                    _this.loading = false;
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
        /**
         * 预览文件
         */
        previewFile(){
            let _this = this;
            _this.exportVisible = false;
            this.previewDialogVisible = true;

            _this.previewDialogOptions = {
                searchParams:_this.searchQuery.params,
                export_item:_this.exportType
            }

            _this.exportTypeList.forEach(element => {
                if(element.value == _this.exportType){
                    this.previewDialogTitle = element.node+" "+this.$i18n.t('message.businessSearch.preview');
                }
            });

            console.log("this.exportType...", _this.exportType);
            // // MBL_NO：承运人提单,CUS_NO：报关单,TRADE_CONT_TYPE：整拼类型,TRACKING_NO：运输单
            // switch (this.exportType) {
            //     case 'MBL_NO':{//承运人提单
            //         this.previewDialogVisible = true;
            //         this.previewDialogTitle = this.$i18n.t('message.businessSearch.carrierNoPreview');
            //     }
            //         break;
            //     case 'CUS_NO':{//报关单
            //         this.previewDialogVisible = true;
            //         this.previewDialogTitle = this.$i18n.t('message.businessSearch.customsDeclarationPreview');
            //     }
            //         break;
            //     case 'TRADE_CONT_TYPE':{//整拼类型
            //         this.previewDialogVisible = true;
            //         this.previewDialogTitle = this.$i18n.t('message.businessSearch.tradeContTypePreview');
            //     }
            //         break;
            //     case 'TRACKING_NO':{//运输单
            //         this.previewDialogVisible = true;
            //         this.previewDialogTitle = this.$i18n.t('message.businessSearch.trackingNoPreview');
            //     }
            //         break;
            //     case '5':{//海关商品编号
            //         this.previewDialogVisible = false;
            //         this.$message({
            //             type: "info",
            //             message: this.$i18n.t('message.businessDetail.building')
            //         });

            //         // this.previewDialogVisible = true;
            //         // this.previewDialogTitle = this.$i18n.t('message.businessSearch.CustomsCommodityNumberPreview');
            //     }
            //         break;
            //     default:
            //         break;
            // }
        },
        /**
         * 数据导出
         */
        dataExport(){
			let _this = this;
			if (_this.portType=='FI') {
				if (_this.perssionData.funcMenu["FUNC.FUNC.CODE_03.CODE_01.CODE_01.CODE_02"].isUse==false) {
					this.$message({
						type: "warning",
						message: this.$i18n.t('message.common.noPerssion')
					});
					return;
				}
			} else {
				if (_this.perssionData.funcMenu["FUNC.FUNC.CODE_03.CODE_01.CODE_02.CODE_02"].isUse==false) {
					this.$message({
						type: "warning",
						message: this.$i18n.t('message.common.noPerssion')
					});
					return;
				}
			}
			

            _this.exportVisible = false;

            if(_this.exportType == "5"){//海关商品编号
                this.previewDialogVisible = false;
                this.$message({
                    type: "info",
                    message: this.$i18n.t('message.businessDetail.building')
                });
                return;
            }

            _this.excelLoading = true;
            console.log("this.exportType...", _this.exportType);
            let params = _this.searchQuery.params;
			params.export_item = _this.exportType;
			params.export_mode = 'csv';

            getExportId(params).then(res => {
                if (res.data.code === 0) {
                    let exportTaskId = res.data.data.exportTaskId;
                    console.log("exportTaskId...", exportTaskId);
                    if(!_this.isNullData(exportTaskId)){
                        //根据exportTaskId获取下载链接
                        _this.getExportDownloadUrl(exportTaskId);
                    }else{
                        _this.excelLoading = false;
                        this.$message({
                            type: "error",
                            message: this.$i18n.t('message.businessSearch.exportFail')
                        });
                    }
                } else {
                    _this.excelLoading = false;
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
                    });
                }
            })
            .catch(err => {
                _this.excelLoading = false;
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

        //停止定时器
        stopInterval(){
            let _this = this;
            if(_this.interval!=null){//判断计时器是否为空
				clearInterval(_this.interval);
				_this.interval=null;
			}
        },
        /**
         * 根据exportTaskId获取下载链接
         */
        getExportDownloadUrl(exportTaskId){
            let _this = this;

            let data = {exportTaskId:exportTaskId};

            getExportDownUrl(data).then(res => {
                if (res.data.code === 0) {
                    let taskId = res.data.data.status;
                    if(res.data.data.status === 1){
                        _this.stopInterval();
                        _this.excelLoading = false;
                        let fileUrl = res.data.data.options.file;
                        if(!_this.isNullData(fileUrl)){
                            //进行数据下载
                            // window.open(fileUrl, '_blank');
                            window.location.href = fileUrl;
                        }else{
                            this.$message({
                                type: "error",
                                message: this.$i18n.t('message.businessSearch.exportFail')
                            });
                        }
                    }else{
                        //启动定时器轮询
                        _this.stopInterval();
                        _this.interval = setInterval(()=>{
                            _this.getExportDownloadUrl(data.exportTaskId);
                        },5000);//启动计时器
                    }
                } else {
                    _this.stopInterval();
                    _this.excelLoading = false;
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
                    });
                }
            })
            .catch(err => {
                _this.stopInterval();
                _this.excelLoading = false;
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
         * 进入订单详情
         */
        gotoOrderDetail(item){
            //清除详情页查询hash
            localStorage.removeItem("reqTxhash");
            localStorage.removeItem("OrderType");
            
            router.push({path: '/businessDetail', query:{orderMsg:item,orderType:this.portType}});
        },
        /**
         * 获取订单列表
         */
        getOrderList:function(paramsData){
            let _this = this;
            _this.loading = true;
            _this.params.pageSize = _this.pageSize;
            _this.params.pageNumber = _this.currentPage;
            //存储搜索的条件
            _this.searchQuery.params = _this.params;
            localStorage.setItem("orderSearchParams",JSON.stringify(_this.searchQuery));

            orderList(_this.params).then(res=>{
                _this.loading = false;
                if (res.data.code === 0) {
                    console.log("res...", res);
                    let orderList = res.data.data.data;
                    _this.total = res.data.data.total;
                    _this.statistics = res.data.data.statistics;
                    //处理订单数据
                    _this.expands = [];
					_this.orderList = [];
					let isEn = localStorage.getItem("internationalization")=="en"?true:false;
					console.log("isEn...", isEn);
                    _this.orderList = orderList.map((item,index)=>{
						if (_this.portType=='FI' && _this.perssionData.dataMenu['DATA.FI.NUMBER'].isUse) {
							item.number = (_this.currentPage-1)*_this.pageSize+index+1;
						}else if (_this.portType=='FE' && _this.perssionData.dataMenu['DATA.FE.NUMBER'].isUse) {
							item.number = (_this.currentPage-1)*_this.pageSize+index+1;
						}else{
							item.number = "";
						}
						item.row_data.CUST_CN = (isEn==true)?(!_this.isNullData(item.row_data.CUST_NAME_EN)?item.row_data.CUST_NAME_EN:item.row_data.CUST_CN):item.row_data.CUST_CN;
						
                        // if(index == 0){ //因为没数据，所以默认第一条可点击
                        //     item.isShowTip = false;
                        // }else
                        {
                            if(item.row_data.ORDER_STATUS == "结算中" || item.row_data.ORDER_STATUS == "In Settlement" || 
                            item.row_data.ORDER_STATUS == "归档" || item.row_data.ORDER_STATUS == "Archived"){
                                item.isShowTip = false;
                            }else{
                                item.isShowTip = true;
                            }
                        }
                        _this.expands.push(item.tx_hash);
                        if(_this.portType == 'FI'){ //进口订单类型
                            item.totalSteps = getTotalStepsActive(item.row_data);
                            item.stepsActive = getStepsActive(item.row_data);
                            item.stepsTitle = getTotalStepsTitle(item.row_data,true);
                        }else{
                            item.totalSteps = getExportTotalStepsActive(item.row_data);
                            item.stepsActive = getExportStepsActive(item.row_data);
                            item.stepsTitle = getExportStepsTitle(item.row_data,true);
                        }
                        return item;
                    })

                    _this.dealTableShow();
                } else {
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
                    });
                }
            }).catch(err=>{
                this.loading = false;
                let message = this.$i18n.t('message.common.systemError');
                if(err && err.data && err.data.code){
                    message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
                }
                this.$message({
                    type: "error",
                    message: message
                });
            })
        },
        /**
         * 显示证书
         */
        goShowCertificate(tx_hash){
            console.log("goShowCertificate...", tx_hash);
            let _this = this;
            let data = {
                tx_hash:tx_hash
            }
            // _this.certloading = true;
            window.open(getPdfContent(data,{}), '_blank');
        },
        /**
         * 获取导出列表项
         */
        getExportItemsList(tx_hash){
            let params = {
				ORDER_TYPE:this.portType
			};

            getExportTypeList(params).then(res => {
                console.log("获取导出列表项...", res);
                if (res.data.code === 0) {
                    this.exportTypeList = res.data.data;
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
        success(){

        },
        close(val){
            this.previewDialogVisible = val
        },
        cancelQuest() {
            if (typeof this.source === 'function') {
                this.source("取消请求。。。。。。。。。。。。。。"); //取消请求
            }
        },
        loadCancel:function() {
            let _this = this;
            _this.$confirm( this.$i18n.t('message.common.loadCancel'), {
                confirmButtonText: _this.$i18n.t('message.common.affirm'),
                cancelButtonText: _this.$i18n.t('message.common.cancel'),
                type: 'warning'
            }).then(() => {
                _this.certloading = false;
                _this.cancelQuest();
            }).catch(() => {
                console.log('close')
            });
        },
        handleSizeChange: function(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getOrderList();

            this.setOrderCurrentPage(val);

            console.log("OrderCurrentPage...",this.orderCurrentPage);
        },
        handleCurrentChange: function(val) {
            this.currentPage = val;
            this.getOrderList();

            this.setOrderCurrentPage(val);

            console.log("OrderCurrentPage...",this.orderCurrentPage);
        },
    }
};
</script>
<style scoped>
    .contentTitle{
        /* display: inline-flex; */
        padding: 15px 15px 15px 15px;
        /* align-items: center;
        justify-content: center;  */
    }
    .line{
        position: relative;
        margin: 0px 15px 15px 15px;
        top: 0px;
        height: 1px;
        background-color: rgb(231, 231, 231);
    }
    .order-table{
        padding: 0px 15px 0px 15px;
    }
    .title-content{
        position: relative;
        margin-right: 15px;
        color: orange;
    }
    .title-date{
        position: relative;
        margin-right: 15px;
        color: black;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .subContent{
        position: relative;
    }
    .stepClass{
        height: 0px;
        width: auto;
    }
    .el-steps--horizontal{
        justify-content: flex-end;
        top: -42px;
        position: relative;
        height: 10px;
    }
    .lastStepClass /deep/ .el-step__line {
        opacity: 0 !important;
    }
    /* 中文版本 */
    .zh-cn .cell-item{
        position: relative;
        margin-left: 55px;
        margin-top: 8px;
    }
    /* 英文版本 */
    .en .cell-item{
        position: relative;
        margin-left: 55px;
        margin-top: 8px;
    }
    /* 隐藏业务table列表页面左侧展开显示按钮 */
    /* .el-table /deep/ .undefined.el-table__expand-column{
        visibility: hidden !important;
        display: none !important;
    } */
    /* .el-table /deep/ .gutter{
        display: none !important;
    } */

    .el-table /deep/ .el-table__expand-icon>.el-icon{
        visibility:hidden;
    }

    .el-table /deep/ .el-table td, .el-table th.is-leaf {
        padding: 0px 0px 0px 0px !important;
        height: 40px !important;
    }


    /* .el-button--primary {
        color: #fff;
        background-color: #1585FF !important;
        border-color: #1585FF !important;
        padding: 5px 10px;
        margin-left: 5px;
        font-size: 12px;
    }
    .el-button--default {
        border-color: #1585FF ;
        color:#1585FF;
        padding: 5px 10px;
        font-size: 12px;
    } */
    .el-radio /deep/ .el-radio__label{
        font-family: Arial,sans-serif !important;
        font-weight:350;
        font-size: 14px;
        color: #606266;
    }
    .el-radio /deep/ .el-radio__input.is-checked+.el-radio__label{
        font-family: Arial,sans-serif !important;
        font-weight:normal;
        font-size: 14px;
        color: #1585FF;
    }

    .el-table /deep/ .el-table__fixed-body-wrapper{
        top:41px !important;
    }
    .el-radio {
        margin-bottom: 5px;
    }
    

</style>

