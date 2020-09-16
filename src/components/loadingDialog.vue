/*
 * Copyright 2014-2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
<template>
    <div>
        <el-dialog class="loadDialog" :visible.sync="dialogVisible" :title="dialogTitle" width="380px" 
        :closeOnClickModal='false' :append-to-body="true" :center="true" v-if="dialogVisible" :show-close="isShowDeleteBtn" :beforeClose="beforeClose">
            <div style="width:100%;height:100%;text-align: center;padding: 0px 0px 20px 0px;">
                <el-image style='width: 120px; height:120px;' src="../../static/image/loading.gif"></el-image>
                <!-- <div style='display: inline-block;width: 150px; height:100px;' v-loading="true"> </div> -->
                <div style="display: inline-block;color:block;width:100%;height:30px;left:20px;top:10px;">{{alertMsg}}</div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { networkList } from "@/util/api";
import router from "@/router";
/* 国际化 */
import i18n from '@/i18n/i18n'
export default {
    name: "loadDialog",
    props: {
        dialogVisible:{
            type: Boolean
        },
        //是否显示删除按钮，默认不显示
        isShowDeleteBtn:{
            type: Boolean,
            default:false,
        },
        alertMsg: {
            type: String,
            default: i18n.t('message.common.loadingText')
        },
        icon: {
            type: Boolean
        },
        cancel:{
            type:Function
        }
    },
    data: function() {
        return {
            dialogTitle:"",
        };
    },
    mounted: function() {
        // const h = this.$createElement;
        // let _this = this;
        // _this.$msgbox({
        //     title: '',
        //     message: h('div', { style: 'text-align: center' }, [
        //         h('img', {// 正常的 HTML 特性
        //             attrs: {
        //                 src:'../../static/image/logo-2 copy@1.5x.png'
        //             },
        //             style: 'width: 100px; height:50px'
        //         }),
        //         h('p', { style: 'color:block' }, _this.alertMsg)
        //     ]),
        //     closeOnClickModal:false,
        //     showCancelButton: false,
        //     showConfirmButton: false,
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     beforeClose: (action, instance, done) => {
        //         if (action === 'confirm') {
        //             console.log("点击确定");
        //         } else {
        //             console.log("点击取消");
        //             _this.cancel(()=>{
        //                 done();
        //             })
        //         }
        //     }
        // }).then(action => {
        //     _this.$message({
        //         type: 'info',
        //         message: 'action: ' + action
        //     });
        // });
    },
    methods: {
        beforeClose(action, instance, done){
            if (action === 'confirm') {
                console.log("点击确定");
            } else {
                console.log("点击取消");
                this.cancel()
                // if(isReturnCancel){
                    
                // }else{
                //     done();
                // }
            }
        }
    }
};
</script>
<style scoped>
    .loadDialog{
        text-align: center !important;
        
    }
</style>
