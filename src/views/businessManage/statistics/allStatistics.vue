/**
<el-row :gutter="15" ref="secondRow">
                    <!-- 根据订单数量统计的前10位元初客户 -->
                    <el-col :span="6">
                        <div class="second-content bg-purple" @click="top10AccEvent()">
                            <span>{{$t('message.statistics.top10Acc')}}</span>
                        </div>
                    </el-col>
                    <!-- 根据提单号(工作号)来统计的报关量 -->
                    <el-col :span="6">
                        <div class="second-content bg-purple" @click="customsEvent()">
                            <span>{{$t('message.statistics.customs')}}</span>
                        </div>
                    </el-col>
                    <!-- 订单的总体货量(航空运输) -->
                    <el-col :span="6">
                        <div class="second-content bg-purple" @click="airOrderNumEvent()">
                            <span>{{$t('message.statistics.airOrderNum')}}</span>
                        </div>
                    </el-col>
                    <!-- 订单的总体货量(水路运输) -->
                    <el-col :span="6">
                        <div class="second-content bg-purple" @click="oceanOrderNumEvent()">
                            <span>{{$t('message.statistics.oceanOrderNum')}}</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="15" ref="thirdRow">
                    <!-- 根据运输量（航空运输）统计的前10位元初客户 -->
                    <el-col :span="6">
                        <div class="third-content bg-purple" @click="top10AirAccEvent()">
                            <span>{{$t('message.statistics.top10AirAcc')}}</span>
                        </div>
                    </el-col>
                    <!-- 根据运输量（水路运输）统计的前10位元初客户 -->
                    <el-col :span="6">
                        <div class="third-content bg-purple" @click="top10OceanAccEvent()">
                            <span>{{$t('message.statistics.top10OceanAcc')}}</span>
                        </div>
                    </el-col>
                    <!-- 根据报关单来统计的报关量 -->
                    <el-col :span="6">
                        <div class="third-content bg-purple" @click="customsDeclarationVolumeEvent()">
                            <span>{{$t('message.statistics.customsDeclarationVolume')}}</span>
                        </div>
                    </el-col>
                </el-row>
				<el-row :gutter="15" ref="thirdRow">
                    <!-- Top 10 进口货源地(以启运国为基础) -->
                    <el-col :span="6">
                        <div class="third-content bg-purple" @click="topImportOriginEvent()">
                            <span>{{$t('message.statistics.top10ImportOrigin')}}</span>
                        </div>
                    </el-col>
                    <!-- Top 10 海关编号 -->
                    <el-col :span="6">
                        <div class="third-content bg-purple" @click="topHSCodeEvent()">
                            <span>{{$t('message.statistics.top10HSCode')}}</span>
                        </div>
                    </el-col>
                    <!-- 进口统计(货量/价格/税费) -->
                    <el-col :span="6">
                        <div class="third-content bg-purple" @click="importStatisticsVVDEvent()">
                            <span>{{$t('message.statistics.importVVD')}}</span>
                        </div>
                    </el-col>
					<!-- 进口税费(币制：人民币元) -->
                    <el-col :span="6">
                        <div class="third-content bg-purple" @click="importStatisticsDutyEvent()">
                            <span>{{$t('message.statistics.importDuty')}}</span>
                        </div>
                    </el-col>
                </el-row>
*/
<template>
    <div class="bg-f7f7f7">
        <v-content-head :headTitle="'message.statistics.allStatistics'" :headTitlePath="{path:'/allStatistics'}" :icon="true"></v-content-head>
        <div class="module-wrapper">
            <!-- <v-developing> </v-developing> -->
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" text-color="#000" active-text-color="#1585FF">
                <el-menu-item index="1">{{$t('message.businessSearch.portImport')}}</el-menu-item>
                <el-menu-item v-show="isYuanChuAcc!='1' && !isNoExportBus" index="2">{{$t('message.businessSearch.portExit')}}</el-menu-item>
            </el-menu>
            <!-- 口岸进口 -->
            <div class="searchView" v-if="activeIndex == 1">
                <el-row :gutter="15" ref="firstRow">
                    <!-- 每日订单状态情况一览 -->
                    <el-col v-if="perssionData.funcMenu['FUNC.DASHBOARD.CODE_01'].isSee==true" :span="6">
                        <div class="first-content bg-purple" @click="dayOrderStatusEvent()">
                            <span>{{$t('message.statistics.dayOrderStatus')}}</span>
                        </div>
                    </el-col>
                    <!-- 操作已完成的订单量 -->
                    <el-col v-if="perssionData.funcMenu['FUNC.DASHBOARD.CODE_02'].isSee==true" :span="6">
                        <div class="first-content bg-purple" @click="closeOrderEvent()">
                            <span>{{$t('message.statistics.closeOrder')}}</span>
                        </div>
                    </el-col>
                    <!-- 不同运输方式的订单量 -->
                    <el-col v-if="perssionData.funcMenu['FUNC.DASHBOARD.CODE_03'].isSee==true" :span="6">
                        <div class="first-content bg-purple" @click="transOrderEvent()">
                            <span>{{$t('message.statistics.transOrder')}}</span>
                        </div>
                    </el-col>
                    <!-- 不同进境关别的订单量 -->
                    <el-col v-if="perssionData.funcMenu['FUNC.DASHBOARD.CODE_04'].isSee==true" :span="6">
                        <div class="first-content bg-purple" @click="importOrderEvent()">
                            <span>{{$t('message.statistics.importOrder')}}</span>
                        </div>
                    </el-col>
					<!-- 根据订单数量统计的前10位元初客户 -->
                    <el-col v-if="perssionData.funcMenu['FUNC.DASHBOARD.CODE_08'].isSee==true" :span="6">
                        <div class="first-content bg-purple" @click="top10AccEvent()">
                            <span>{{$t('message.statistics.top10Acc')}}</span>
                        </div>
                    </el-col>
                    <!-- 根据提单号(工作号)来统计的报关量 -->
                    <el-col v-if="perssionData.funcMenu['FUNC.DASHBOARD.CODE_05'].isSee==true" :span="6">
                        <div class="first-content bg-purple" @click="customsEvent()">
                            <span>{{$t('message.statistics.customs')}}</span>
                        </div>
                    </el-col>
                    <!-- 订单的总体货量 -->
                    <el-col v-if="perssionData.funcMenu['FUNC.DASHBOARD.CODE_06'].isSee==true" :span="6">
                        <div class="first-content bg-purple" @click="airOrderNumEvent()">
                            <span>{{$t('message.statistics.airOrderNum')}}</span>
                        </div>
                    </el-col>
                    <!-- 订单的总体货量(水路运输) -->
                    <el-col v-if="perssionData.funcMenu['FUNC.DASHBOARD.CODE_07'].isSee==true" :span="6">
                        <div class="first-content bg-purple" @click="oceanOrderNumEvent()">
                            <span>{{$t('message.statistics.oceanOrderNum')}}</span>
                        </div>
                    </el-col>
					<!-- 根据运输量（航空运输）统计的前10位元初客户 -->
                    <el-col v-if="perssionData.funcMenu['FUNC.DASHBOARD.CODE_09'].isSee==true" :span="6">
                        <div class="first-content bg-purple" @click="top10AirAccEvent()">
                            <span>{{$t('message.statistics.top10AirAcc')}}</span>
                        </div>
                    </el-col>
                    <!-- 根据运输量（水路运输）统计的前10位元初客户 -->
                    <el-col v-if="perssionData.funcMenu['FUNC.DASHBOARD.CODE_10'].isSee==true" :span="6">
                        <div class="first-content bg-purple" @click="top10OceanAccEvent()">
                            <span>{{$t('message.statistics.top10OceanAcc')}}</span>
                        </div>
                    </el-col>
                    <!-- 根据报关单来统计的报关量 -->
                    <el-col v-if="perssionData.funcMenu['FUNC.DASHBOARD.CODE_11'].isSee==true" :span="6">
                        <div class="first-content bg-purple" @click="customsDeclarationVolumeEvent()">
                            <span>{{$t('message.statistics.customsDeclarationVolume')}}</span>
                        </div>
                    </el-col>
					<!-- Top 10 进口货源地(以启运国为基础) -->
                    <el-col v-if="perssionData.funcMenu['FUNC.DASHBOARD.CODE_12'].isSee==true" :span="6">
                        <div class="first-content bg-purple" @click="topImportOriginEvent()">
                            <span>{{$t('message.statistics.top10ImportOrigin')}}</span>
                        </div>
                    </el-col>
                    <!-- Top 10 海关编号 -->
                    <el-col v-if="perssionData.funcMenu['FUNC.DASHBOARD.CODE_13'].isSee==true" :span="6">
                        <div class="first-content bg-purple" @click="topHSCodeEvent()">
                            <span>{{$t('message.statistics.top10HSCode')}}</span>
                        </div>
                    </el-col>
                    <!-- 进口统计(货量/价格/税费) -->
                    <el-col v-if="perssionData.funcMenu['FUNC.DASHBOARD.CODE_14'].isSee==true" :span="6">
                        <div class="first-content bg-purple" @click="importStatisticsVVDEvent()">
                            <span>{{$t('message.statistics.importVVD')}}</span>
                        </div>
                    </el-col>
					<!-- 进口税费(币制：人民币元) -->
                    <el-col v-if="perssionData.funcMenu['FUNC.DASHBOARD.CODE_15'].isSee==true" :span="6">
                        <div class="first-content bg-purple" @click="importStatisticsDutyEvent()">
                            <span>{{$t('message.statistics.importDuty')}}</span>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <!-- 口岸出口 -->
            <div class="searchView"  v-if="activeIndex == 2">
                <v-developing> </v-developing>
            </div>
        </div>
    </div>
</template>
<script>
import contentHead from "@/components/contentHead";
import developing from "@/components/developing";
import {  } from "@/util/api";
import router from "@/router";
import errcode from "@/util/errcode";

export default {
    name: "allStatistics",
    components: {
        "v-content-head":contentHead,
        "v-developing":developing,
    },
    data: function() {
        return {
            loading:false,
            activeIndex: '1', //1：口岸进口 2：口岸出口
            //是否是元初客户
            isYuanChuAcc:localStorage.getItem("IsYuanChuAcc"),
            //是否没有口岸出口业务
			isNoExportBus:false,
			
			//权限数据
			perssionData:{},
        };
	},
	created(){
		this.perssionData = JSON.parse(localStorage.getItem("MenuDataCode"));
	},
    mounted: function() {
        let _this = this;
        // setTimeout(()=>{
            //根据每行div最终显示最高的高度，处理内部显示标签高度
            // let firstHeight = _this.$refs.firstRow.$el.clientHeight;
            // if( typeof firstHeight == 'string'){
            //     firstHeight = Number(firstHeight.replace(/px/, ""));
            // }
            
            // let firstContentDivs = document.getElementsByClassName("first-content");
            // for (let index = 0; index < firstContentDivs.length; index++) {
            //     const element = firstContentDivs[index];
            //     element.style.height = firstHeight-10+"px";
            // }

            // let secondHeight = _this.$refs.secondRow.$el.clientHeight;
            // if( typeof secondHeight == 'string'){
            //     secondHeight = Number(secondHeight.replace(/px/, ""));
            // }
            // let secondContentDivs = document.getElementsByClassName("second-content");
            // for (let index = 0; index < secondContentDivs.length; index++) {
            //     const element = secondContentDivs[index];
            //     element.style.height = secondHeight-10+"px";
            // }

            // let thirdHeight = _this.$refs.thirdRow.$el.clientHeight;
            // if( typeof thirdHeight == 'string'){
            //     thirdHeight = Number(thirdHeight.replace(/px/, ""));
            // }
            // let thirdContentDivs = document.getElementsByClassName("third-content");
            // for (let index = 0; index < thirdContentDivs.length; index++) {
            //     const element = thirdContentDivs[index];
            //     element.style.height = thirdHeight-10+"px";
            // }
        // },400)
    },
    methods: {
        /**
         * 每日订单状态情况一览
         */
        dayOrderStatusEvent(){
			if (this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_01'].isUse == false) {
				this.$message({
					type: "warning",
					message: this.$i18n.t('message.common.noPerssion')
				});
				return;
			}
            localStorage.removeItem("OrderIEType");
            localStorage.setItem("OrderIEType",this.activeIndex == 1?'FI':'FE');

            let queryData = {
                title:this.activeIndex == 1?'message.businessSearch.portImport':'message.businessSearch.portExit',
                statisticsType:"",
                orderType:this.activeIndex == 1?'FI':'FE',
            }
            router.push({
                path: '/dayOrderStatus',
                query:queryData,
            });
        },
        /**
         * 操作已完成的订单量
         */
        closeOrderEvent(){
			if (this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_02'].isUse == false) {
				this.$message({
					type: "warning",
					message: this.$i18n.t('message.common.noPerssion')
				});
				return;
			}
            localStorage.removeItem("OrderIEType");
            localStorage.setItem("OrderIEType",this.activeIndex == 1?'FI':'FE');
            let queryData = {
                title:this.activeIndex == 1?'message.businessSearch.portImport':'message.businessSearch.portExit',
                statisticsType:"",
                orderType:this.activeIndex == 1?'FI':'FE',
            }
            router.push({
                path: '/closedOrder',
                query:queryData,
            });
        },
        /**
         * 不同运输方式的订单量
         */
        transOrderEvent(){
			if (this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_03'].isUse == false) {
				this.$message({
					type: "warning",
					message: this.$i18n.t('message.common.noPerssion')
				});
				return;
			}
            localStorage.removeItem("OrderIEType");
            localStorage.setItem("OrderIEType",this.activeIndex == 1?'FI':'FE');
            let queryData = {
                title:this.activeIndex == 1?'message.businessSearch.portImport':'message.businessSearch.portExit',
                statisticsType:"",
                orderType:this.activeIndex == 1?'FI':'FE',
            }
            router.push({
                path: '/transOrder',
                query:queryData,
            });
        },
        /**
         * 不同进境关别的订单量
         */
        importOrderEvent(){
			if (this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_04'].isUse == false) {
				this.$message({
					type: "warning",
					message: this.$i18n.t('message.common.noPerssion')
				});
				return;
			}
            localStorage.removeItem("OrderIEType");
            localStorage.setItem("OrderIEType",this.activeIndex == 1?'FI':'FE');

            // this.$message(this.$i18n.t('message.businessDetail.building'));

            let queryData = {
                title:this.activeIndex == 1?'message.businessSearch.portImport':'message.businessSearch.portExit',
                statisticsType:"",
                orderType:this.activeIndex == 1?'FI':'FE',
            }
            router.push({
                path: '/importOrder',
                query:queryData,
            });
        },
        /**
         * 根据订单数量统计的前10位元初客户
         */
        top10AccEvent(){
			if (this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_08'].isUse == false) {
				this.$message({
					type: "warning",
					message: this.$i18n.t('message.common.noPerssion')
				});
				return;
			}
            localStorage.removeItem("OrderIEType");
            localStorage.setItem("OrderIEType",this.activeIndex == 1?'FI':'FE');

            let queryData = {
                title:this.activeIndex == 1?'message.businessSearch.portImport':'message.businessSearch.portExit',
                statisticsType:"",
                orderType:this.activeIndex == 1?'FI':'FE',
            }
            router.push({
                path: '/topNumAccOrder',
                query:queryData,
            });
        },
        /**
         * 根据提单号(工作号)来统计的报关量
         */
        customsEvent(){
			if (this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_05'].isUse == false) {
				this.$message({
					type: "warning",
					message: this.$i18n.t('message.common.noPerssion')
				});
				return;
			}
            localStorage.removeItem("OrderIEType");
            localStorage.setItem("OrderIEType",this.activeIndex == 1?'FI':'FE');

            let queryData = {
                title:this.activeIndex == 1?'message.businessSearch.portImport':'message.businessSearch.portExit',
                statisticsType:"",
                orderType:this.activeIndex == 1?'FI':'FE',
            }
            router.push({
                path: '/customsOrder',
                query:queryData,
            });
        },
        /**
         * 订单的总体货量
         */
        airOrderNumEvent(){
			if (this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_06'].isUse == false) {
				this.$message({
					type: "warning",
					message: this.$i18n.t('message.common.noPerssion')
				});
				return;
			}
            localStorage.removeItem("OrderIEType");
            localStorage.setItem("OrderIEType",this.activeIndex == 1?'FI':'FE');

            let queryData = {
                title:this.activeIndex == 1?'message.businessSearch.portImport':'message.businessSearch.portExit',
                statisticsType:"",
                orderType:this.activeIndex == 1?'FI':'FE',
            }
            router.push({
                path: '/airOrderNum',
                query:queryData,
            });
        },
        /**
         * 订单的总体货量(水路运输)
         */
        oceanOrderNumEvent(){
			if (this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_07'].isUse == false) {
				this.$message({
					type: "warning",
					message: this.$i18n.t('message.common.noPerssion')
				});
				return;
			}
            localStorage.removeItem("OrderIEType");
            localStorage.setItem("OrderIEType",this.activeIndex == 1?'FI':'FE');

            let queryData = {
                title:this.activeIndex == 1?'message.businessSearch.portImport':'message.businessSearch.portExit',
                statisticsType:"",
                orderType:this.activeIndex == 1?'FI':'FE',
            }
            router.push({
                path: '/oceanOrderNum',
                query:queryData,
            });
        },

        /**
         * 根据运输量（航空运输）统计的前10位元初客户
         */
        top10AirAccEvent(){
			if (this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_09'].isUse == false) {
				this.$message({
					type: "warning",
					message: this.$i18n.t('message.common.noPerssion')
				});
				return;
			}
            localStorage.removeItem("OrderIEType");
            localStorage.setItem("OrderIEType",this.activeIndex == 1?'FI':'FE');

            // this.$message(this.$i18n.t('message.businessDetail.building'));

            let queryData = {
                title:this.activeIndex == 1?'message.businessSearch.portImport':'message.businessSearch.portExit',
                statisticsType:"",
                orderType:this.activeIndex == 1?'FI':'FE',
            }
            router.push({
                path: '/topAccAirOrder',
                query:queryData,
            });
        },

        /**
         * 根据运输量（水路运输）统计的前10位元初客户
         */
        top10OceanAccEvent(){
			if (this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_10'].isUse == false) {
				this.$message({
					type: "warning",
					message: this.$i18n.t('message.common.noPerssion')
				});
				return;
			}
            localStorage.removeItem("OrderIEType");
            localStorage.setItem("OrderIEType",this.activeIndex == 1?'FI':'FE');

            // this.$message(this.$i18n.t('message.businessDetail.building'));

            let queryData = {
                title:this.activeIndex == 1?'message.businessSearch.portImport':'message.businessSearch.portExit',
                statisticsType:"",
                orderType:this.activeIndex == 1?'FI':'FE',
            }
            router.push({
                path: '/topAccOceanOrder',
                query:queryData,
            });
        },

        /**
         * 根据报关单来统计的报关量
         */
        customsDeclarationVolumeEvent(){
			if (this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_11'].isUse == false) {
				this.$message({
					type: "warning",
					message: this.$i18n.t('message.common.noPerssion')
				});
				return;
			}
            localStorage.removeItem("OrderIEType");
            localStorage.setItem("OrderIEType",this.activeIndex == 1?'FI':'FE');

            // this.$message(this.$i18n.t('message.businessDetail.building'));

            let queryData = {
                title:this.activeIndex == 1?'message.businessSearch.portImport':'message.businessSearch.portExit',
                statisticsType:"",
                orderType:this.activeIndex == 1?'FI':'FE',
            }
            router.push({
                path: '/customsVolume',
                query:queryData,
            });
        },
        handleSelect:function(val) {
            this.activeIndex = val;
		},
		
		/**
         * Top 10 进口货源地(以启运国为基础)
         */
        topImportOriginEvent(){
			if (this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_12'].isUse == false) {
				this.$message({
					type: "warning",
					message: this.$i18n.t('message.common.noPerssion')
				});
				return;
			}
            localStorage.removeItem("OrderIEType");
            localStorage.setItem("OrderIEType",this.activeIndex == 1?'FI':'FE');

            // this.$message(this.$i18n.t('message.businessDetail.building'));

            let queryData = {
                title:this.activeIndex == 1?'message.businessSearch.portImport':'message.businessSearch.portExit',
                statisticsType:"",
                orderType:this.activeIndex == 1?'FI':'FE',
            }
            router.push({
                path: '/topImportOrigin',
                query:queryData,
            });
		},
		/**
         * Top 10 海关编号
         */
        topHSCodeEvent(){
			if (this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_13'].isUse == false) {
				this.$message({
					type: "warning",
					message: this.$i18n.t('message.common.noPerssion')
				});
				return;
			}
            localStorage.removeItem("OrderIEType");
            localStorage.setItem("OrderIEType",this.activeIndex == 1?'FI':'FE');

            // this.$message(this.$i18n.t('message.businessDetail.building'));

            let queryData = {
                title:this.activeIndex == 1?'message.businessSearch.portImport':'message.businessSearch.portExit',
                statisticsType:"",
                orderType:this.activeIndex == 1?'FI':'FE',
            }
            router.push({
                path: '/topHSCode',
                query:queryData,
            });
		},
		/**
         * 进口统计(货量/价格/税费)
         */
        importStatisticsVVDEvent(){
			if (this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_14'].isUse == false) {
				this.$message({
					type: "warning",
					message: this.$i18n.t('message.common.noPerssion')
				});
				return;
			}
            localStorage.removeItem("OrderIEType");
            localStorage.setItem("OrderIEType",this.activeIndex == 1?'FI':'FE');

            // this.$message(this.$i18n.t('message.businessDetail.building'));

            let queryData = {
                title:this.activeIndex == 1?'message.businessSearch.portImport':'message.businessSearch.portExit',
                statisticsType:"",
                orderType:this.activeIndex == 1?'FI':'FE',
            }
            router.push({
                path: '/importStatisticsVVD',
                query:queryData,
            });
		},
		/**
         * 进口税费(币制：人民币元)
         */
        importStatisticsDutyEvent(){
			if (this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_15'].isUse == false) {
				this.$message({
					type: "warning",
					message: this.$i18n.t('message.common.noPerssion')
				});
				return;
			}
            localStorage.removeItem("OrderIEType");
            localStorage.setItem("OrderIEType",this.activeIndex == 1?'FI':'FE');

            // this.$message(this.$i18n.t('message.businessDetail.building'));

            let queryData = {
                title:this.activeIndex == 1?'message.businessSearch.portImport':'message.businessSearch.portExit',
                statisticsType:"",
                orderType:this.activeIndex == 1?'FI':'FE',
            }
            router.push({
                path: '/importStatisticsDuty',
                query:queryData,
            });
        },
    }
};
</script>
<style scoped>
    .searchView{
        padding: 20px 20px 10px 20px;
    }

    .el-col {
        border-radius: 4px;
        margin-bottom: 10px;
    }
    .bg-purple {
        background: #fff;
        border-radius: 4px;
        border: solid 1px #e0e0e0;
        color: #333;
        min-height: 60px;
        text-align: center;
        word-wrap:break-word;
        display: -webkit-flex; /* Safari */
        -webkit-align-items: center; /* Safari 7.0+ */
        display: flex;
        display: -webkit-box;
        align-items: center;
        justify-content: center;
    }
    .bg-purple:hover {
        background: #fff;
        border-radius: 4px;
        border: solid 1px #1585FF;
        color: #1585FF;
        min-height: 60px;
        text-align: center;
        word-wrap:break-word;
        display: -webkit-flex; /* Safari */
        -webkit-align-items: center; /* Safari 7.0+ */
        display: flex;
        display: -webkit-box;
        align-items: center;
        justify-content: center;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .span{
        height:100%;
        word-break: break-word;
        font-size: 16px;
        color: #333;
    }
</style>

