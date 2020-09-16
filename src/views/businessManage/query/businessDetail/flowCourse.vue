
<template>
<!-- style="height: 800px;overflow:auto;overflow-x:hidden;" -->
    <div style="position: relative; width:100%;">
        <v-custom-step :orderMsg="orderMsg" :orderType="orderType" :perssionData="perssionData"></v-custom-step>
        <div class="commonline" style="display: flex;width: auto;position: relative; margin: 10px 20px 0px 20px;" ></div>
        <!-- overflow-y:scroll;    overflow-x: hidden; -->
        <div style="height: 100%;margin: 0px 20px 0px 20px;padding-right: 21px;">
            <div class="nodeClass"  v-for="(item, index) in nodeList" :key="index">
                <div class="leftNodeClass">
                    <div class="nodeMsgClass">
                        <span v-if="item.isHideColon==true" style="position: relative;left: 0px;display: inline-block;color:#333;font-size:14px;font-weight:600">{{item.nodeName}}</span>
                        <span v-else style="position: relative;left: 0px;display: inline-block;color:#333;font-size:14px;font-weight:600">{{item.nodeName}}:</span>
                    </div>
                    <div class="rightDetailItem" v-for="(detail,index) in item.nodeDetail" :key="index">
                        <span style="position: relative;display: inline-block;word-wrap: break-word;color:#333;font-size:14px;">{{detail.key}}: </span>

                        <span v-if="detail.key == businessDesc['DECLARATION_LIST.CUS_NO']" style="position: relative;display: inline-block;word-wrap: break-word;color:#1585FF;font-size:14px;cursor:pointer;" @click="touchBillNum(detail.value)">{{detail.value}}</span>
                        <span v-else style="position: relative;display: inline-block;word-wrap: break-word;color:#868686;font-size:14px;">{{detail.value}}</span>
                    </div>
                    <el-button v-if="item.nodeName == $t('message.businessSearch.customs') && orderMsg.DECLARATION_LIST && orderMsg.DECLARATION_LIST.length>1 && perssionData.dataMenu['DATA.FI.DECLARATION_LIST.CUS_NO'].isSee==true" type="text" style="font-size:12px;" @click="moreOddNum(item)">{{$t('message.businessSearch.moreOrderNum')}}</el-button>
                </div>
                <div class="rightNodeListClass">
                    <div class="packupBtn" v-if="item.isShowPackupBtn==true" @click="packupBtn(item,index)">
                        <i :class="[!item.isPackup?'iconfont wbs-shouqi':'iconfont wbs-zhankai']" style="color:#1585FF;" ></i>
                    </div>
                    <div class="packupBtn" style="width:17px;" v-else></div>
                    <!-- 节点数据 -->
                    <v-flow-timeline :isHidden="item.isPackup" v-show="item.nodeList" :nodeData="item.nodeList"></v-flow-timeline>
                </div>

                <el-dialog :title="$t('message.businessSearch.moreOrderNum')" :visible.sync="moreBillNumDialogVisible" width="40%" :append-to-body="false" :center="true" class="dialog-wrapper" v-if="moreBillNumDialogVisible">
                    <div class="commonline"></div>
                    <!-- overflow-x:hidden;overflow:auto; -->
                    <div style="padding:20px;height:400px;overflow-x:hidden;overflow:auto;">
                        <div style="text-align:center;" v-for="(billnum,index) in billNumArr" :key="index">
                            <span style="position: relative;display: inline-block;width:100%;word-wrap: break-word;color:#1b7aff;font-size:14px;">
                                <span style="color:#333;">{{'报关单号'}}</span> :<span style="cursor:pointer;" @click="touchBillNum(billnum)">{{billnum}}</span>
                            </span>
                        </div>
                    </div>
                </el-dialog>
                <el-dialog title="报关单" :visible.sync="billNumDetailDialogVisible" width="50%" :append-to-body="false" :center="true" class="dialog-wrapper" v-if="billNumDetailDialogVisible">
                    <div class="commonline"></div>
                    <div style="text-align:left;padding:10px 20px;">
                        <span style="position: relative;display: inline-block;width:100%;word-wrap: break-word;color:#333;font-size:14px;">
                            <span style="color:#333;">{{'报关单号'}}</span> :{{selectBillNum}}
                        </span>
                    </div>
                    <div class="commonline"></div>
                    <div style="padding:10px;height:800px;text-align:center;overflow-x:hidden;overflow:auto;">
                        <el-image src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1575865559006&di=2557f6bbf6adaf43e28de56a94a69f50&imgtype=0&src=http%3A%2F%2Fimg.yzcdn.cn%2Fupload_files%2F2015%2F12%2F05%2FFurEs2sHD808zxN5NM5COi1Bl9BP.jpg%2521730x0.jpg"> </el-image>
                    </div>
                </el-dialog>
            </div>
        </div>
        <div class="commonline" style="display: flex;width: auto;position: relative; margin: -1px 20px 0px 20px;" ></div>

    </div>
</template>
<script>
import customStep from "../components/customStep";
import flowTimeLine from "../components/flow_timeline";
import {  } from "@/util/api";
import router from "@/router";
import errcode from "@/util/errcode";

export default {
    name: "flowCourse",
    components: {
        "v-custom-step":customStep,
        "v-flow-timeline":flowTimeLine,
    },
    props:{
        nodeList:{
            type:Array,
            default:()=>{
                return [];
            }
        },
        orderMsg:{
            type:Object,
            default:()=>{
                return {};
            }
        },
        gotoCusNoDetail:{
            type:Function
        },
        businessDesc:{
            type:Object,
            default:()=>{
                return {};
            }
		},
		orderType:{
			type:String
		},

    },
    data: function() {
        return {
            moreOddDialogVisible:false,
            moreBillNumDialogVisible:false,

            billNumDetailDialogVisible:false,
            selectBillNum:"",
            billNumArr:[],
			
			perssionData:{},
        };
    },
    created(){
		this.perssionData = JSON.parse(localStorage.getItem("MenuDataCode"))

        this.nodeList.map(item=>{
            item.isPackup = false;
            item.isShowPackupBtn = false;
            if(item.nodeList.length>=1){
                if(item.nodeList.length>1){
                    item.isShowPackupBtn = true;
                }else {
                    if(item.nodeList[0].length>1){
                      item.isShowPackupBtn = true;
                    }else {
                      item.isShowPackupBtn = false;
                    }
                }
            }

          return item;
        })
        console.log("this.nodeList...",this.nodeList);
    },
    mounted: function() {

    },
    methods: {
        /**
         * 展开隐藏
         */
        packupBtn:function (item,index) {
            item.isPackup = !item.isPackup;
            this.nodeList.splice(index,1,item);
        },
        /**
         * 更多单号
         */
        moreOddNum:function (item) {
            this.moreBillNumDialogVisible = true;

            this.orderMsg.DECLARATION_LIST.forEach(element => {
                this.billNumArr.push(element.CUS_NO);
            });

        },
        /**
         * 点击报关单号
         */
        touchBillNum:function (billNum) {
            // this.selectBillNum = billNum;
            // this.billNumDetailDialogVisible = true;
            console.log("billNum...",billNum);
            this.gotoCusNoDetail(billNum);
        }
    }
};
</script>
<style scoped>
    .nodeClass{
        display: flex;
        border: solid;
        border-width: 1px;
        border-color: rgb(231, 231, 231);
        border-top: none;
        /* border-right: none; */
        position: relative;
        /* display: inline-block; */
        margin: 0px 0px 0px 0px;
        padding: 0px 20px 0px 0px;
        width: 100%;
    }
    .leftNodeClass{
        display: inline-block;
        position: relative;
        width: 280px;
        vertical-align: top;
        padding: 20px 0px 0px 20px;
    }
    .rightDetailItem{
        display: inline-block;
        position: relative;
        width: 200px;
    }
    .rightNodeListClass{
        position:relative;
        display: inline-flex;
        width: calc(100%);
    }
    .packupBtn{
        position: relative;
        /* margin: 0px 0px;  */
        padding: 20px 3px 20px 0px;
        height: 20px;
    }

    /* .dialog-wrapper /deep/ .el-dialog__body{
        height: 50vh !important;
        overflow: auto !important;
    } */
</style>

