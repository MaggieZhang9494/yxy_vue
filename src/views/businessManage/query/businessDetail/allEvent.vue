
<template>
<!-- style="height: 800px;overflow:auto;overflow-x:hidden;" -->
    <div style="position: relative;width:100%">
        <div v-if="nodeList && nodeList.length>=1" class="nodeClass">
            <div class="rightNodeListClass">
                <v-flow-timeline :isShowNodeMonth="true" :isHidden="false" :nodeData="nodeList"></v-flow-timeline>
            </div>
        </div>
        <div v-else style="position: relative;font-size:20px;top:150px;height:400px;color:#e5e5e5;text-align:center;">{{$t('message.common.noData')}}</div>
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
                return [
                //     [{
                //     dateDesc:"实际送达日期",
                //     date:"2018.12.12",
                //     upTime:"2018.11.23",
                //     timestamp:"4545434634564",
                //     showMonth:true,
                //     detailData:[{
                //         key:"集装箱号",
                //         value:"3456789"
                //     },{
                //         key:"箱型",
                //         value:"圆形"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     }]
                // },{
                //     dateDesc:"实际送达日期",
                //     date:"2018.12.12",
                //     upTime:"2018.11.23",
                //     timestamp:"4545434634564",
                //     detailData:[{
                //         key:"集装箱号",
                //         value:"3456789"
                //     },{
                //         key:"箱型",
                //         value:"圆形"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     }]
                // },{
                //     dateDesc:"实际送达日期",
                //     date:"2018.12.12",
                //     upTime:"2018.11.23",
                //     timestamp:"4545434634564",
                //     detailData:[{
                //         key:"集装箱号",
                //         value:"3456789"
                //     },{
                //         key:"箱型",
                //         value:"圆形"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     }]
                // },{
                //     dateDesc:"实际送达日期",
                //     date:"2018.12.12",
                //     upTime:"2018.11.23",
                //     timestamp:"4545434634564",
                //     detailData:[{
                //         key:"集装箱号",
                //         value:"3456789"
                //     },{
                //         key:"箱型",
                //         value:"圆形"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     },{
                //         key:"封志号",
                //         value:"若无若群无若群翁人情味热"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     },{
                //         key:"封志号",
                //         value:"无若群翁人情味热"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     }]
                // },{
                //     dateDesc:"实际送达日期",
                //     date:"2018.12.12",
                //     upTime:"2018.11.23",
                //     timestamp:"4545434634564",
                //     detailData:[{
                //         key:"集装箱号",
                //         value:"无若群翁人情味热"
                //     },{
                //         key:"箱型",
                //         value:"圆形"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     }]
                // },
                
                // {
                //     dateDesc:"实际送达日期",
                //     date:"2018.11.12",
                //     upTime:"2018.11.23",
                //     timestamp:"4545434634564",
                //     showMonth:true,
                //     detailData:[{
                //         key:"集装箱号",
                //         value:"3456789"
                //     },{
                //         key:"箱型",
                //         value:"圆形"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     }]
                // },{
                //     dateDesc:"实际送达日期",
                //     date:"2018.11.12",
                //     upTime:"2018.11.23",
                //     timestamp:"4545434634564",
                //     detailData:[{
                //         key:"集装箱号",
                //         value:"3456789"
                //     },{
                //         key:"箱型",
                //         value:"圆形"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     }]
                // },{
                //     dateDesc:"实际送达日期",
                //     date:"2018.11.12",
                //     upTime:"2018.11.23",
                //     timestamp:"4545434634564",
                //     detailData:[{
                //         key:"集装箱号",
                //         value:"3456789"
                //     },{
                //         key:"箱型",
                //         value:"圆形"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     }]
                // },{
                //     dateDesc:"实际送达日期",
                //     date:"2018.11.12",
                //     upTime:"2018.11.23",
                //     timestamp:"4545434634564",
                //     detailData:[{
                //         key:"集装箱号",
                //         value:"3456789"
                //     },{
                //         key:"箱型",
                //         value:"圆形"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     },{
                //         key:"封志号",
                //         value:"翁人情味热"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     },{
                //         key:"封志号",
                //         value:"无若群翁人情味热"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     }]
                // },{
                //     dateDesc:"实际送达日期",
                //     date:"2018.11.12",
                //     upTime:"2018.11.23",
                //     timestamp:"4545434634564",
                //     detailData:[{
                //         key:"集装箱号",
                //         value:"无若群无若群翁人情味热"
                //     },{
                //         key:"箱型",
                //         value:"圆形"
                //     },{
                //         key:"封志号",
                //         value:"3434555"
                //     }]
                // }]
                ]
            }
        },
    },
    data: function() {
        return {
            moreOddDialogVisible:false,
        };
    },
    mounted: function() {
        console.log("this.nodeList...",this.nodeList);
        this.nodeList.map(item=>{
            item.isPackup = false;
			return item;
			
			
        })
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
            this.moreOddDialogVisible = true;
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
        position: relative;
        /* display: inline-block; */
        margin: 20px;
        /* padding: 0px 0px 25px 0px;
        width: 100%; */
    }
    .leftNodeClass{
        display: inline-block;
        position: relative;
        width: 150px;
        vertical-align: top;
        padding: 15px 20px 0px 20px;
    }
    .rightNodeListClass{
        position:relative;
        display: inline-flex;
        width: 100%;
    }
</style>

