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
import Axios from 'axios'
import router from '../router'
import {message} from '@/util/resetMessage';

let axiosIns = Axios.create({
    timeout: 120 * 1000
});
let CancelToken = Axios.CancelToken;
let source = CancelToken.source();
// axiosIns.defaults.baseURL = 'http://10.6.5.184:5000';
// axiosIns.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
// axiosIns.defaults.headers['Content-Type']='application/x-www-form-urlencoded';
// axiosIns.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
axiosIns.defaults.responseType = 'json';
// axiosIns.defaults.validateStatus = function () {
//     return true
// };
// http response interceptor
axiosIns.interceptors.response.use(
    response => {
        // console.log("response",response);
        if(response.data && response.data.code === 302000) {
			console.log("302000......");
			localStorage.removeItem("headImgUrl");
            localStorage.removeItem("root");
            localStorage.removeItem("accountStatus");
			localStorage.removeItem("token");
			localStorage.removeItem("isPublicUser");
			localStorage.removeItem("IsSuperAdmin");
			localStorage.removeItem("MenuDataCode");
			response.data.message = localStorage.getItem("internationalization")=='zh-cn'?"未登录，请先登录！":"No login, Please Login!";
            router.push({
                path: '/login',
                query: {redirect: router.currentRoute.fullPath}
			})
			return JSON.parse(JSON.stringify(response));
        }else if (response.data && (response.data.code === 202052 || response.data.code === 202053)) {
			console.log("202052......");
			localStorage.removeItem("headImgUrl");
            localStorage.removeItem("root");
            localStorage.removeItem("accountStatus");
			localStorage.removeItem("token");
			localStorage.removeItem("isPublicUser");
			localStorage.removeItem("IsSuperAdmin");
			localStorage.removeItem("MenuDataCode");
			response.data.message = localStorage.getItem("internationalization")=='zh-cn'?"登录失效，请登录！":"Login failure, Please Login!";
            router.push({
                path: '/login',
                query: {redirect: router.currentRoute.fullPath}
			})
			return JSON.parse(JSON.stringify(response));
        } else{
            return JSON.parse(JSON.stringify(response));
        }
    },
    error => {
		console.log("error......",error);
		console.log("error.response......",error.response);
        if (Axios.isCancel(error)) {
            //重新赋值取消象，否则同取消请求后再次请求同样接口会连续报错
            CancelToken = Axios.CancelToken;
            source = CancelToken.source();
            console.log("Axios.isCancel");
            error.response = {
                data:{
                    code:"-0000000",
                }
            }
            return Promise.reject(error.response)
        } else {
            if(error.response && error.response.data && error.response.data.code === 302000) {
				localStorage.removeItem("headImgUrl");
				localStorage.removeItem("root");
				localStorage.removeItem("accountStatus");
				localStorage.removeItem("token");
				localStorage.removeItem("isPublicUser");
				localStorage.removeItem("IsSuperAdmin");
				localStorage.removeItem("MenuDataCode");
				error.response.data.message = localStorage.getItem("internationalization")=='zh-cn'?"未登录，请先登录！":"No login, Please Login!";
				
				router.push({
                    path: '/login',
                    query: {redirect: router.currentRoute.fullPath}
				})
				message({
					type: "error",
					message: error.response.data.message
				});
				return Promise.reject(error.response);
            }else if (error.response && error.response.data && (error.response.data.code === 202052 || error.response.data.code === 202053)) {
				localStorage.removeItem("headImgUrl");
				localStorage.removeItem("root");
				localStorage.removeItem("accountStatus");
				localStorage.removeItem("token");
				localStorage.removeItem("isPublicUser");
				localStorage.removeItem("IsSuperAdmin");
				localStorage.removeItem("MenuDataCode");
				error.response.data.message = localStorage.getItem("internationalization")=='zh-cn'?"登录失效，请登录！":"Login invalid, Please Login!";
				router.push({
                    path: '/login',
                    query: {redirect: router.currentRoute.fullPath}
				})
				message({
					type: "error",
					message: error.response.data.message
				});
				return Promise.reject(error.response);
            }else{
				if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
					return Promise.reject({data:{code:"-1000000"}});
				}
                return Promise.reject(error.response);
            }
        }
        // if (error.response) {
        //     switch (error.response.status) {
        //         case 401:
        //             store.commit(types.LOGOUT);
        //             router.replace({
        //                 path: 'login',
        //                 query: {redirect: router.currentRoute.fullPath}
        //             })
        //     }
        // }
    });

export default {
    axiosIns
}
/**post
 * @param options
 * @return {Promise}
 */
export function post(options,isAddLanguageAcc) {
    if(isAddLanguageAcc){
        if(!options.data){
            options.data = {};
        }
        options.data.language = localStorage.getItem("internationalization");
        if(!options.data.account){
            options.data.account = localStorage.getItem("user");
        }
        options.data.groupId = localStorage.getItem("groupId");
    }
    // console.log("post请求。。。",options);
    
    return new Promise((resolve, reject) => {
        axiosIns(options).then(response => {
            // console.log("post请求返回。。。",response);
            resolve(response)
        })
            .catch(error => {
                reject(error)
            })
    })
};
/**get
 * @param options
 * @return {Promise}
 */
export function get(options,isAddLanguageAcc,that) {
    if(isAddLanguageAcc){
        if(!options.params){
            options.params = {};
        }
        options.params.language = localStorage.getItem("internationalization");
        if(!options.params.account){
            options.params.account = localStorage.getItem("user");
        }
        options.params.groupId = localStorage.getItem("groupId");
    }
    if(!options.headers){
        options.headers = {};
    }
    // options.headers["Access-Control-Allow-Origin"] = '*';
    // options.proxy = {
    //     host: '10.6.5.184',
    //     port: 8104,
    // };

    if(that){
        options.cancelToken = source.token;

        that.source = source;
        //  new CancelToken(function executor(c) {
        //     console.log("that...",that)
        //     that.source = c;
        //     console.log(c)
        // })
    }
    
    return new Promise((resolve, reject) => {
        axiosIns(options).then(response => {
            // console.log("get请求返回。。。",response);
            resolve(response)
        }).catch(error => {
            // 处理错误
            console.log("get请求返回错误。。。",error);
            reject(error)
        })
    })
};

/**patch
 * @param options
 * @return {Promise}
 */
export function patch(options) {
    return new Promise((resolve, reject) => {
        axiosIns(options).then(response => {
            resolve(response)
        })
            .catch(error => {
                reject(error)
            })
    })
};
/**put
 * @param options
 * @return {Promise}
 */
export function put(options,isAddLanguageAcc) {
    if(isAddLanguageAcc){
        if(!options.params){
            options.params = {};
        }
        options.params.language = localStorage.getItem("internationalization");
        if(!options.params.account){
            options.params.account = localStorage.getItem("user");
        }
        options.params.groupId = localStorage.getItem("groupId");
    }
    return new Promise((resolve, reject) => {
        axiosIns(options).then(response => {
            resolve(response)
        })
            .catch(error => {
                reject(error)
            })
    })
};
/**delete
 * @param options
 * @return {Promise}
 */
export function deleted(options,isAddLanguageAcc) {
    if(isAddLanguageAcc){
        if(!options.params){
            options.params = {};
        }
        options.params.language = localStorage.getItem("internationalization");
        if(!options.params.account){
            options.params.account = localStorage.getItem("user");
        }
        options.params.groupId = localStorage.getItem("groupId");
    }
    return new Promise((resolve, reject) => {
        axiosIns(options).then(response => {
            resolve(response)
        })
            .catch(error => {
                reject(error)
            })
    })
};

/**
 * 单个上传文件
 * @param uploadParams {Object} 上传参数
 * {
 *      uploadApi://上传的文件服务端接口地址 //必传
 *      params:{//上传formData参数
            file: 文件对象 //必传
            其他。。。。
        }
 *      headers:{} //头部
 * }
 */
export function uploadFile(uploadParams){
    return new Promise((resolve, reject) => {

        console.log("uploadParams。。。",uploadParams);
        var args = uploadParams || {};
        var formData = args.params || {};
        var uploadApi = args.uploadApi || '';
        var headers = args.headers || {};

        if(!formData.account){
            formData.account = localStorage.getItem("user");
        }
        formData = setFormData(formData)
        uploadApi = uploadApi + "?language="+localStorage.getItem("internationalization")+"&groupId="+localStorage.getItem("groupId");
        console.log("uploadApi。。。",uploadApi);
        console.log("formData",formData);
        console.log("headers。。。",headers);
        axiosIns.post(uploadApi, formData, {headers:headers}).then(res=>{
            console.log("res。。。",res);
            resolve(res)
        }).catch(err=>{
            console.log("err。。。",err);
            reject(err)
        })
    })
};

/* 执行多个请求
 * @param array
 * @return {Promise}
 */
export function executeMultiReq(array) {
    return new Promise((resolve, reject) => {
        
        Axios.all(array).then(Axios.spread(res=>{
            console.log("多个请求完成。。。",res)
            // 请求现在都执行完成
            resolve(res)
        })).catch(err=>{
            console.log("err。。。",err);
            reject(err)
        });
    })
};

function setFormData(data){
    let formData = new FormData()
    Object.keys(data).map(key=>{
        if(data[key]){
            formData.append(key, data[key])
        }
    })
    return formData
}
