<template>
    <div class="bgClass">
        <div class="nodeClass" v-for="(node, nodeIndex) in showNodeData">
            <div class="flowClass" v-for="(item, index) in node">
                <div v-show="isShowNodeMonth" class="showNodeMonthClass">
                    <span style="position: relative;left: 0px;top:-5px;margin-right:-10px;text-align:right;display: inline-block;width:100%;color:#333;font-size:20px;">
                        {{item.isShowMonth?item.showMonth:""}}
                    </span>
                </div>
                <div class="leftLineClass">
                    <div class="dotClass"></div>
                    <div class="verticalLineClass"></div>
                </div>
                <div class="nodeMsgClass">
                    <div>
                        <span style="position: relative;display: inline-block;word-wrap: break-word;text-align:left;font-size:14px;color:#333;">{{item.dateDesc}}：</span>
                        <span style="position: relative;display: inline-block;word-wrap: break-word;text-align:left;font-size:14px;color:#333;">{{item.date}}</span>
                        <!-- <span style="text-align:left;">{{item.date}}</span> -->
                    </div>
                    <div>
                        <span class="chainTime">{{$t('message.businessSearch.cochainTime')}}：
                            
                        </span>
                        <span class="chainTimestamp" style="">{{item.upTime}}</span>
                        
                    </div>
                    <div>
                        <span class="chainTime">{{$t('message.common.timestamp')}}：
                            
                        </span>
                        <span class="chainTimestamp">{{item.timestamp}}</span>
                        
                    </div>
                </div>
                <div :class="[isShowNodeMonth?'showMonthRightDetailClass':'rightDetailClass']">
                    <div class="rightDetailItem" v-for="(detail,index) in item.detailData" :key="index">
                    <span style="position: relative;display: inline-block;"><span style="color:#333;">{{detail.key}}</span> ：{{detail.value}}</span> 
                    </div>
                </div>
            </div>
            <div v-show="showNodeData.length != (nodeIndex+1)" class="commonline" style="left:10px;top:30px;width:calc(100%)"></div>
        </div>
        <!-- <div v-else style="position: relative;font-size:20px;color:#e5e5e5;text-align:center;">{{$t('message.common.noData')}}</div> -->
    </div>
</template>

<script>
import { networkList } from "@/util/api";
import router from "@/router";
export default {
    name: "flow_timeline",
    props: {
        //显示数据对象，key:value格式
        nodeData:{
            type:Array,
            default: ()=>{
                return []
            }
        },
        //是否隐藏节点，只留下一个，默认不隐藏
        isHidden:{
            type:Boolean,
            default:false
        },
        //是否在节点每月最近一条记录的左侧显示月份时间2019.12，默认不显示
        isShowNodeMonth:{
            type:Boolean,
            default:false
        },
    },
    watch:{
        isHidden(val) {
            console.log("val ...",val);
            let _this = this;
            if(val == true){
                _this.showNodeData = [_this.nodeData[0].slice(0,1)];
            }else{
                _this.showNodeData = _this.nodeData;
            }
        }
    },
    data: function() {
        return {
            showNodeData:[],
        };
    },
    created:function() {
        let _this = this;
        if(_this.isHidden == true){
            _this.showNodeData = [_this.nodeData[0].slice(0,1)];
        }else{
            _this.showNodeData = _this.nodeData;
        }
    },
    mounted: function() {

        // let flow = document.getElementsByClassName('flowClass');
        // let verticalLine = document.getElementsByClassName('verticalLineClass');
        // for (let index = 0; index < verticalLine.length; index++) {
        //     const element = verticalLine[index];
        //     element.style.height = (flow[0].clientHeight)+'px';
        // }
        // window.onload = ()=>{
            
        // }
        // window.onresize=()=>{
        //     let flow = document.getElementsByClassName('flowClass');
        //     let verticalLine = document.getElementsByClassName('verticalLineClass');
        //     for (let index = 0; index < verticalLine.length; index++) {
        //         const element = verticalLine[index];
        //         console.log("flow[0].clientHeight...", flow[0].clientHeight);
        //         element.style.height = (flow[0].clientHeight)+'px';
        //         console.log("element.style.height...", element.style.height);
        //     }
        // }
    },
    methods: {

    }
};
</script>
<style scoped>
    .bgClass{
        position: relative; 
        padding: 0px 0px 20px 0px;
        width: 100%;
    }
    .nodeClass{
        position: relative; 
        /* margin: 0px 0px;  */
        /* margin: 0px 0px 20px 0px; */
        padding: 0px 0px 20px 0px;
    }
    .flowClass{
        position: relative; 
        /* margin: 0px 0px;  */
        padding: 20px 0px 0px 0px;
    }
    .showNodeMonthClass{
        display: inline-block;
        position: relative;
        width: 120px;
        right: 10px;
        height: 100%;
    }
    .leftLineClass{
        display: inline-block;
        position:absolute;
        width: 11px;
        height: 100%;
        text-align: center;
    }
    .dotClass{
        display: inline-block;
        position: relative;
        width: 10px;
        height: 10px;
        left: 0.5px;
        background-color: #1585FF;
        border-radius: 10px;
        z-index: 9;
    }
    .verticalLineClass{
        display: flex;
        position: relative;
        top: -5px;
        left: 5px;
        width: 1px;
        height: calc(100% - 15px);
        background-color: rgb(231, 231, 231);
    }

    .nodeMsgClass{
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 360px;
        top: 0px;
        left: 20px;
        /* background-color: red; */
    }
    .rightDetailClass{
        display: inline-block;
        vertical-align: top;
        position: relative;
        text-align: left;
        width: calc(100% - 380px);
        /* background-color: blue; */
    }
    .showMonthRightDetailClass{
        display: inline-block;
        vertical-align: top;
        position: relative;
        text-align: left;
        width: calc(100% - 530px);
    }
    .rightDetailItem{
        display: inline-block;
        /* vertical-align: top; */
        position: relative;
        margin-left: 10px;
        height: 30px;
        width: calc(50% - 10px);
        white-space:nowrap;
    }
    /* 中文版本 */
    .zh-cn .chainTime{
        position: relative;
        display: inline-block;
        width: 80px;
        text-align:right;
        font-size:12px;
        color:#666;
    }
    /* 英文版本 */
    .en .chainTime{
        position: relative;
        display: inline-block;
        width: 100px;
        text-align:right;
        font-size:12px;
        color:#666;
    }

    .chainTimestamp{
        position: relative;
        text-align:left;
        font-size:12px;
        color:#666;
    }
</style>
