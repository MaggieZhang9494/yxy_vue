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
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import axios from 'axios'
import {getCookie,setCookie,delCookie} from './util/util'
import JsonViewer from "vue-json-viewer"
import errcode from './util/errcode'
import VueClipboard from 'vue-clipboard2'
import 'element-ui/lib/theme-chalk/index.css'
/*iconfont*/
import '@/assets/icon/iconfont.css'
import '@/assets/icon/iconfont.js'
import '@/assets/icon/iconfont_webaas.css'
/*public css moudle */
import '@/assets/css/common.css'
import '@/util/directives.js';
import Clickoutside from 'element-ui/src/utils/clickoutside'
import filters from './util/filter.js'
import { isNullData, isJSONStr,isMobile,timeStrToTimestamp} from './util/util'
import {message} from '@/util/resetMessage';

/* 国际化 */
import i18n from '@/i18n/i18n'
import 'babel-polyfill'
import langEn from 'element-ui/lib/locale/lang/en'
import langCn from 'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale'
//element框架语言切换
let language = localStorage.getItem("internationalization")
if (isNullData(language)) {
    //默认设置中文
    locale.use(langCn);
}else{
    //根据本地切换的语言环境来设置对应语言
    (language == 'zh-cn')?locale.use(langCn):locale.use(langEn);
}

//vxe table组件
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
Vue.use(VXETable)


import ace from 'ace-builds'
Vue.config.productionTip = false;
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = false;
axios.defaults.timeout = 60 * 1000;
Vue.use(router);
Vue.use(VueClipboard)
Vue.use(JsonViewer)
Vue.use(ace)
Vue.prototype.$axios = axios;
Vue.use(ElementUI);
Vue.use(Clickoutside)
import promise from 'es6-promise';
//compatible Promise
promise.polyfill();
Vue.prototype.$message = message;
//cookie function
Vue.prototype.getCookie = getCookie;
Vue.prototype.setCookie = setCookie;
Vue.prototype.delCookie = delCookie;
//error code
Vue.prototype.errcode = errcode;

Vue.prototype.isNullData = isNullData;
Vue.prototype.isJSONStr = isJSONStr;
Vue.prototype.isMobile = isMobile;
Vue.prototype.timeStrToTimestamp = timeStrToTimestamp;

router.beforeEach((to, from, next) => {
    let token = localStorage.getItem('token');
	let path = to.path;
    if (path == '/login') {
        next();
        return;
    }      //以防无限循环
    if (token) {
		if (localStorage.getItem("isPublicUser")==='true') {
			if (path == '/publicQuery') {
				next();
			}else{
				if (path == '/accountMsg') {
					next();
				}else{
					next({
						path: '/publicQuery'
					})
				}
			}      
		} else {
			next();
		}
		
    } else {
        next({
            path: '/login'
        })
    }
})

// require('./mock')
/* eslint-disable no-new */
new Vue({
    el: '#app',
    i18n,
    router,
    store,
    components: { App },
    template: '<App/>'
});
