<template>
    <div class="bg-f7f7f7">
        <v-content-head :headTitle="'message.roleManagement.authorConfig'" :headTitlePath="{path:'/authorManagement'}" :icon="false"></v-content-head>
        <div class="module-wrapper">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" text-color="#000" active-text-color="#1585FF">
                <el-menu-item index="1">{{$t('message.roleManagement.function')}}</el-menu-item>
                <el-menu-item index="2">{{$t('message.roleManagement.data')}}</el-menu-item>
            </el-menu>
			<!-- 功能配置 -->
			<div v-if="activeIndex === '1'">
				<v-function-config :roleMsg="roleMsg"></v-function-config>
			</div>
			<!-- 数据配置 -->
			<div v-if="activeIndex === '2'">
				<v-data-config :roleMsg="roleMsg"></v-data-config>
			</div>
        </div>
        <v-load-dialog v-if="loading" :dialogVisible="loading" :isShowDeleteBtn="true" :cancel="loadCancel"> </v-load-dialog>
    </div>
</template>
<script>
import contentHead from "@/components/contentHead";
import dataConfig from "./dataConfigList";
import functionConfig from "./functionConfigList";
import { orderList, countryPortList, getFiltrateList, getTransModeList, getBusinessKindList,getOrderStatusList } from "@/util/api";
import { format, numberFormat,formatData } from "@/util/util.js";
import router from "@/router";
import { mapState, mapActions } from 'vuex'
import Bus from "@/bus"

export default {
    name: "authorManagement",
    components: {
		"v-content-head": contentHead,
		"v-data-config":dataConfig,
		"v-function-config":functionConfig,
    },
    data: function() {
        return {
            loading:false,
            activeIndex: '1', //1：功能 2：数据
			headSubTitle:"",
			
			roleMsg:{},//角色信息
        };
    },
    created(){

		let _this = this;

		let roleMsgStr = localStorage.getItem("roleMsg");
        if (_this.isNullData(roleMsgStr)) {
			_this.roleMsg = _this.$route.query.roleMsg;
			localStorage.setItem("roleMsg",JSON.stringify(_this.roleMsg))
        }else{
			_this.roleMsg = JSON.parse(roleMsgStr);
        } 
    },
    beforeDestroy: function () {
        Bus.$off("changeGroup")
    },
    mounted: function() {
        Bus.$on("changeGroup", data => {
            this.changGroup(data)
        })
        // this.importCountryList = this.loadAllCountryData();
        // this.importHarborList = this.loadAllHarborData();
    },
    methods: {
        ...mapActions([
            'setOrderSearchParams',
            'setOrderCurrentPage',
        ]),
        changGroup(val){
            
        },
        //处理搜索条件参数
        dealSearchParams(){
            let _this = this;
			_this.roleMsg = _this.$route.query.roleMsg;
        },
        
        handleSelect:function(val) {
            this.activeIndex = val;

        },
    }
};
</script>
<style scoped>
    .searchView{
        margin: 20px;
    }
    .search-item {
        display: inline-block;
        margin-bottom: 15px;
        margin-right: 12px;
        vertical-align: top;
    }
    .search-item > span {
        margin-right: 0px;
    }
    /* .search-item /deep/ .el-input__inner {
        height: 32px;
        line-height: 32px;
    }
    .search-item /deep/ .el-input__icon {
        line-height: 32px;
    } */
    .el-select{
        width: 250px;
    }
    /* 中文版本 */
    .zh-cn span{
        position: relative;
        display: inline-block;
        width: 90px;
        text-align: right;
    }
    .zh-cn .span1{
        position: relative;
        display: inline-block;
        width: 90px;
        text-align: right;
    }
    /* 英文版本 */
    .en span{
        position: relative;
        display: inline-block;
        width: 160px;
        text-align: right;
    }
    .en .span1{
        position: relative;
        display: inline-block;
        width: 160px;
        text-align: right;
    }

    /* 中文版本 */
    .zh-cn .el-input{
        width: 338px;
        left: 18px;
    }

    /* 英文版本 */
    .en .el-input{
        width: 408px;
        left: 18px;
    }

    .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after{
        content: none;
    }
    .selectFalse{
        float: left;
        text-align:left;
        left:0px;
        color: #333;
        font-size: 13px;
    }
    .selectTrue{
        float: left;
        text-align:left;
        left:0px;
        color: #1585FF;
        font-size: 13px;
    }
    .search-item /deep/ .el-range-editor--mini .el-range-separator{
        line-height: 25px !important;
    }
</style>

