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
    <div id="app" class="web-font">
        <router-view></router-view>
    </div>
</template>

<script>
import {VueLoading } from 'vue-loading-template'
import { mapState, mapActions } from 'vuex'

export default {
    name: "App",
    components: {
        VueLoading 
    },
    data() {
        return {
            load: this.$root.load,
            // userForm: {
            //     password: ""
            // },
            // rules: {
            //     password: [
            //         {
            //             required: true,
            //             message: "请输入组织名称",
            //             trigger: "blur"
            //         },
            //         {
            //             min: 1,
            //             max: 12,
            //             message: this.$i18n.t('message.login.char1_12Alert'),
            //             trigger: "blur"
            //         }
            //     ]
            // }
        };
    },
    created(){
        //在页面加载时读取sessionStorage里的状态信息
        if (sessionStorage.getItem("store") ) {
            console.log("重新赋值store。。。。。。");
            this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))));
        } 

        //在页面刷新时将vuex里的信息保存到localStorage里
        window.addEventListener("beforeunload",()=>{
            console.log("beforeunload。。。。。。");
            sessionStorage.setItem("store",JSON.stringify(this.$store.state))
        })

        window.addEventListener("popstate", function(){
            //doSomething
            console.log("浏览器返回。。。。。。");
		}, false)

		if (localStorage.getItem("isPublicUser")==='true') {
			this.setTitleArray([]);
		}
    },
    mounted() {
        
    },
    methods: {
		...mapActions([
            'setTitleArray',
            ]),
    }
};
</script>

<style>
#app {
    /* min-width: 800px; */
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #edf0f5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2E384D;
}
ul,
li {
    list-style: none;
}
</style>
