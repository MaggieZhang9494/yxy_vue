
<template>
    <div class="developing">
        <div style="position: relative;top:30%; ">
            <el-image  style="position: relative;width:200px;height:200px;" fit="fill" src="../../static/image/developing.png"></el-image>
        </div>
        <div style="position: relative;top:31%;color:#e5e5e5;font-size:20px;">
            {{$t('message.businessDetail.building')}}
        </div>
    </div>
</template>
<script>
import contentHead from "@/components/contentHead";
import {  } from "@/util/api";
import router from "@/router";
import errcode from "@/util/errcode";

export default {
    name: "developing",
    components: {

    },
    data: function() {
        return {
            loading:false,
            activeIndex: '1', //1：所有事件 2：流程进程 3：单证文件 4：报关单详情
            currentPage: 1,
            pageSize: 10,
            total: 0,
        };
    },
    mounted: function() {
    },
    methods: {

    }
};
</script>
<style scoped>
    .developing{
        width: 100%;
        height: 500px;
        background-color: #fff;
        color:lightgray;
        text-align: center;
        display: inline-block;
        position: relative;
        /* align-items: center;
        justify-content: center; */
    }
</style>

