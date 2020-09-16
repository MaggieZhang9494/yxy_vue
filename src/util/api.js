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
import url from './url'
import { post, get, patch, put, deleted, uploadFile,executeMultiReq } from './http'
import { reviseParam } from './util'
import qs from 'qs'

//login
export function login(data, code, token) {
    return post({
        url: `${url.ORG_LIST}/account/login?checkCode=${code}`,
        // url: `${url.ORG_LIST}/account/login`,
        method: 'post',
        data: qs.stringify(data),
        headers: {
            'Content-Type': "application/x-www-form-urlencoded",
            'token': token
        }
    })
}
//out login
export function loginOut() {
    return get({
        url: `${url.ORG_LIST}/account/logout`,
        method: 'get',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//init change passWord
export function resetPassword(data) {
    return put({
        url: `${url.ORG_LIST}/account/passwordUpdate`,
        method: 'put',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**daily transaction data */
export function getChartData(data) {
    return get({
        url: `${url.ORG_LIST}/group/transDaily/${data}`,
        method: 'get',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Chain overview */
export function getNetworkStatistics(data) {
    return get({
        url: `${url.ORG_LIST}/group/general/${data}`,
        method: 'get',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Block list */
export function getBlockPage(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/block/blockList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Node list */
export function getNodeList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/node/nodeList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** Error log query node*/
export function getErrorNodeList(data) {
    return get({
        url: `${url.ORG_LIST}/node/nodeList/${data}`,
        method: 'get',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**Organization list */
export function getOrgList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/organization/organizationList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Contract list */
export function getContractList(data) {
    return get({
        url: `${url.ORG_LIST}/contract/contractList`,
        method: 'post',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Add node */
export function addnodes(data) {
    return post({
        url: `${url.ORG_LIST}/node/nodeInfo`,
        method: 'post',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Increase organization */
export function addgroup(data) {
    return post({
        url: `${url.ORG_LIST}/organization/organizationInfo`,
        method: 'post',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**add contract */
export function saveChaincode(data) {
    return post({
        url: `${url.ORG_LIST}/contract/save`,
        method: 'post',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Compile contract */
export function setCompile(data) {
    return post({
        url: `${url.ORG_LIST}/contract/compile`,
        method: 'post',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Deployment contract */
export function getDeployStatus(data) {
    return post({
        url: `${url.ORG_LIST}/contract/deploy`,
        method: 'post',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Delete contract */
export function deleteCode(data, list) {
    const params = reviseParam(data, list);
    return deleted({
        url: `${url.ORG_LIST}/contract/${params.str}`,
        method: 'delete',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Blockchain list */
export function networkList() {
    return get({
        url: `${url.ORG_LIST}/network/all`,
        method: 'get',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Modify contract */
export function editChain(data) {
    return put({
        url: `${url.ORG_LIST}/contract/contractInfo`,
        method: 'put',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Public key or private key user list */
export function getUserList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/user/userList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**add users */
export function getAddUser(data) {
    return post({
        url: `${url.ORG_LIST}/user/userInfo`,
        method: 'post',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Modify user description */
export function getUserDescription(data) {
	console.log("getUserDescription(data)....", data);
    return put({
        url: `${url.ORG_LIST}/user/userInfo`,
        method: 'put',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Send transaction */
export function sendTransation(data) {
    return post({
        url: `${url.ORG_LIST}/contract/transaction`,
        method: 'post',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** Transaction receipt based on transaction hash*/
export function getTransactionReceipt(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/transaction/transactionReceipt/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** Get transaction information based on transaction hash*/
export function hashTransactionInfo(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/transaction/transInfo/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/** creat account*/
export function creatAccountInfo(data) {
    return post({
        url: `${url.ORG_LIST}/account/accountInfo`,
        method: 'post',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Change account information*/
export function modifyAccountInfo(data) {
    return put({
        url: `${url.ORG_LIST}/account/accountInfo`,
        method: 'put',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** deleteAccount*/
export function deleteAccountInfo(data) {
    return deleted({
        url: `${url.ORG_LIST}/account/${data}`,
        method: 'delete',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** Query role list*/
export function roleList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/role/roleList${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**Query account list*/
export function accountList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/account/accountList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** Query error log list*/
export function errorLogList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/nodeLog/nodeLogList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** Bind user*/
export function bindUser(data) {
    return post({
        url: `${url.ORG_LIST}/user/bind`,
        method: 'post',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/** Regulate user transaction information*/
export function monitorTransactionInfo(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/monitor/transList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/** Transaction list*/
export function getTransactionList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/transaction/transList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** Supervised user list*/
export function monitorUserList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/monitor/userList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**
 * 监管用户接口列表
 * @param groupId
 * @param ?userName
 * */
export function monitorUserInterfaceList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/monitor/interfaceList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**
 * 监管异常用户信息列表
 * @param groupId
 * @param pageNumber
 * @param pageSize
 * @param ?userName
 * */
export function unusualUserList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/monitor/unusualUserList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** Regulatory abnormal contract information*/
export function unusualContractList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/monitor/unusualContractList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** bytecode*/
export function getByteCode(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/web3/code/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/** Query block details based on block height*/
export function getBlockDetail(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/block/blockByNumber/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/** delete nodes*/
export function deleteNodes(data) {
    return deleted({
        url: `${url.ORG_LIST}/node/nodeInfo/${data}`,
        method: 'delete',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**  Collection node metric*/
export function metricInfo(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/performance/ratio/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/** Machine configuration information*/
export function nodesHostInfo(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/performance/config/${params.str}`,
        method: 'get',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}

export function nodesHealth(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/chain/mointorInfo/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}

export function addFront(data) {
    return get({
        url: `${url.ORG_LIST}/front/new`,
        method: 'post',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
export function getGroups() {
    return get({
        url: `${url.ORG_LIST}/group/all`,
        method: 'get',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
export function getFronts(data) {
    return get({
        url: `${url.ORG_LIST}/front/find`,
        method: 'get',
        params: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
export function deleteFront(data) {
    return deleted({
        url: `${url.ORG_LIST}/front/${data}`,
        method: 'delete',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}

export function addFunctionAbi(data) {
    return post({
        url: `${url.ORG_LIST}/method/add`,
        method: 'post',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
export function getFunctionAbi(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/method/findById/${params.str}`,
        method: 'get',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
export function getAbi(data) {
    // const params = reviseParam(data, list);
    return post({
        url: `${url.ORG_LIST}/contract/findByPartOfBytecodeBin`,
        method: 'post',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//获取图片验证码
export function getPictureCheckCode() {
    return get({
        url: `${url.ORG_LIST}/account/pictureCheckCode`,
        method: 'get'
    })
}

// permission post
export function postPermission(data) {
    return post({
        url: `${url.ORG_LIST}/permission`,
        method: 'post',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// permission delete
export function deletePermission(data) {
    return deleted({
        url: `${url.ORG_LIST}/permission`,
        method: 'delete',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// permission get
export function getPermission(data) {
    return get({
        url: `${url.ORG_LIST}/permission`,
        method: 'get',
        params: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// permission  full get
export function getPermissionFull(data) {
    return get({
        url: `${url.ORG_LIST}/permission/full`,
        method: 'get',
        params: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// consensus node id
export function consensusNodeId(data) {
    return post({
        url: `${url.ORG_LIST}/precompiled/consensus`,
        method: 'post',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// consensus node id list 
export function getConsensusNodeId(data) {
    return get({
        url: `${url.ORG_LIST}/precompiled/consensus/list`,
        method: 'get',
        params: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// sys config 
export function querySysConfig(data) {
    return post({
        url: `${url.ORG_LIST}/sys/config`,
        method: 'post',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// sys config list
export function querySysConfigList(data) {
    return get({
        url: `${url.ORG_LIST}/sys/config/list`,
        method: 'get',
        params: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// cns list
export function queryCnsList(data) {
    return get({
        url: `${url.ORG_LIST}/precompiled/cns/list`,
        method: 'get',
        params: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}

// CRUD service
export function queryCrudService(data) {
    return post({
        url: `${url.ORG_LIST}/precompiled/crud`,
        method: 'post',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//permission/sorted get批量权限
export function getPermissionSorted(list) {
    return get({
        url: `${url.ORG_LIST}/permission/sorted`,
        method: 'get',
        params: list,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}

//permission/sorted post添加权限

export function postPermissionSorted(data) {
    return post({
        url: `${url.ORG_LIST}/permission/sorted`,
        method: 'post',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
//上传证书文件 post：/cert
export function importCert(data) {
    return post({
        url: `${url.ORG_LIST}/cert`,
        method: 'post',
        data: data,
        // responseType: 'blob/json',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// 导出证书文件list get: /cert
export function exportCert(list) {
    return get({
        url: `${url.ORG_LIST}/cert`,
        method: 'get',
        params: list,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// get证书文件list get: /cert/list
export function certList(list) {
    return get({
        url: `${url.ORG_LIST}/cert/list`,
        method: 'get',
        params: list,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}
// delete 证书 /cert 
export function deleteCert(data) {
    return deleted({
        url: `${url.ORG_LIST}/cert`,
        method: 'delete',
        data: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/******************* 公共模块 *******************/
//获取图片验证码
export function getYXPictureCheckCode() {
    return get({
        url: `${url.API_Path}/api/captcha`,
        method: 'get'
    })
}

//有信运登录
export function loginYX(data, code, token) {
    return post({
        url: `${url.API_Path}/api/login?checkCode=${code}`,
        // url: `${url.ORG_LIST}/account/login`,
        method: 'post',
        data: qs.stringify(data),
        headers: {
            'Content-Type': "application/x-www-form-urlencoded",
            'token': token
        }
    })
}
//有信运退出登录
export function loginOutYX() {
    return get({
        url: `${url.API_Path}/api/logout`,
        method: 'get',
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    })
}

//设置语言
export function setLanguage(data) {
    return post({
        url: `${url.API_Path}/api/language`,
        method: 'post',
        data:data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

/******************* 模板管理模块 *******************/
//获取模板类型列表
export function getSchemaTypeList(data) {
    return get({
        url: `${url.API_Path}/api/options/schema-type`,
        method: 'get',
        params:data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}
//添加模板
export function addTemplate(data){
    return uploadFile({
        uploadApi: `${url.API_Path}/api/schema`,
        params: data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    })
}

//获取模板列表
export function templateList(data){
    return get({
        url: `${url.API_Path}/api/schema`,
        method: 'get',
        params:data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

//获取模板详情
export function templateDetail(data,list){
    const params = reviseParam(data, list);
    console.log("params...",params);
    return get({
        url: `${url.API_Path}/api/schema/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

//删除模板
export function deleteTemplate(data,param){
    const params = reviseParam(data, param);
    console.log("params...",params);
    return deleted({
        url: `${url.API_Path}/api/schema/${params.str}`,
        method: 'delete',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

//设置为默认模板
export function setDefaultTemplate(data,param){
    const params = reviseParam(data, param);
    console.log("params...",params);
    return put({
        url: `${url.API_Path}/api/schema/${params.str}/set/default`,
        method: 'put',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

//获取所属管理员下拉项
export function getBlongsAccList(param){
    return get({
        url: `${url.API_Path}/api/options/schema-admins`,
        method: 'get',
        params: param,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

/************************************** 用户、帐号管理模块 **************************************/
//查询帐号列表
export function getAccountList(param) {
    return get({
        url: `${url.API_Path}/api/account`,
        method: 'get',
        params:param,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}
//获取帐号详情
export function getAccountDetail(data, param) {
    const params = reviseParam(data, param);
    return get({
        url: `${url.API_Path}/api/account/${params.str}`,
        method: 'get',
        params:params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}
//添加帐号
export function addAccount(data) {
    return post({
        url: `${url.API_Path}/api/account`,
        method: 'post',
        data:data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}
//编辑帐号
export function modifyAccount(data,param,urlData) {
    const params = reviseParam(urlData, param);
    return put({
        url: `${url.API_Path}/api/account/${params.str}`,
        method: 'put',
        params:params.querys,
        data:qs.stringify(data),
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

//删除帐号
export function deleteAccount(data, param) {
    const params = reviseParam(data, param);
    return deleted({
        url: `${url.API_Path}/api/account/${params.str}`,
        method: 'delete',
        params:params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

//重置帐号密码
export function resetAccountPwd(data,param,urlData) {
    const params = reviseParam(urlData, param);
    return put({
        url: `${url.API_Path}/api/account/${params.str}/reset/password`,
        method: 'put',
        params:params.querys,
        data:qs.stringify(data),
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

//获取行业下拉项
export function getIndustryList(param){
    return get({
        url: `${url.API_Path}/api/options/industry`,
        method: 'get',
        params: param,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

//获取会员级别下拉项
export function getMemberLevelList(param){
    return get({
        url: `${url.API_Path}/api/options/member-level`,
        method: 'get',
        params: param,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

//上传营业执照
export function uploadBusinessLicense(param){
    return uploadFile({
        uploadApi: `${url.API_Path}/api/upload/business/license`,
        params: param,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    })
}

//上传区块链存证章
export function uploadBlockchainSeal(param){
    return uploadFile({
        uploadApi: `${url.API_Path}/api/upload/seal`,
        params: param,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    })
}

//修改头像
export function editHeadIcon(data,param){
    const params = reviseParam(data, param);
    return uploadFile({
        uploadApi: `${url.API_Path}/api/account/${params.str}/modify/avatar`,
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    })
}

//获取角色选择下拉项
export function getRolePullList(params){
    return get({
        url: `${url.API_Path}/api/options/roles`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

//获取账号关联公司下拉项
export function getCustomersPullList(params){
    return get({
        url: `${url.API_Path}/api/options/customers`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

/************************************** 业务管理模块 **************************************/
/**
 * 获取国家/港口列表
 * @param {*} params 
 */
export function countryPortList(params){
    return get({
        url: `${url.API_Path}/api/port`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}
//获取订单列表
export function orderList(params,that){
    return get({
        url: `${url.API_Path}/api/order`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true,that)
}

//获取业务描述信息
export function getBusinessDesc(params){
    return get({
        url: `${url.API_Path}/api/order/description`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

//获取业务订单详情
export function getBusinessOrderDetail(data,param){
    const params = reviseParam(data, param);
    return get({
        url: `${url.API_Path}/api/order/${params.str}`,
        method: 'get',
        params:params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

//显示pdf内容
export function getPdfContent(data,param){
    const params = reviseParam(data, param);
	let urlStr = `${url.API_Path}/api/order/pdf/${params.str}`;
	// "&account="+localStorage.getItem("user")+
    urlStr = urlStr+"?language="+localStorage.getItem("internationalization")+"&token="+localStorage.getItem("token")+"&groupId="+localStorage.getItem("groupId");
    return urlStr;

    // const params = reviseParam(data, param);
    // return get({
    //     url: `${url.API_Path}/api/order/pdf/${params.str}`,
    //     method: 'get',
    //     params:params.querys,
    //     headers: {
    //         Authorization: "Token " + localStorage.getItem("token") || "",
    //         token:localStorage.getItem("token") || ""
    //     }
    // },true,that)
}

/**
 * 获取筛选查询条件下拉选项
 * @param {*} params 
 */
export function getFiltrateList(params){
    return get({
        url: `${url.API_Path}/api/options/option-keys`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}
/**
 * 获取运输方式下拉选项
 * @param {*} params 
 */
export function getTransModeList(params){
    return get({
        url: `${url.API_Path}/api/options/trade-tool`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}
/**
 * 获取行业种类下拉选项
 * @param {*} params 
 */
export function getBusinessKindList(params){
    return get({
        url: `${url.API_Path}/api/options/business-type`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

/**
 * 获取订单状态下拉选项
 * @param {*} params 
 */
export function getOrderStatusList(params){
    return get({
        url: `${url.API_Path}/api/options/order-status`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

/**
 * 数据导出-预览
 * @param {*} params 
 */
export function getExportPreviewData(params){
    return get({
        url: `${url.API_Path}/api/order/preview`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

/**
 * 数据导出-导出（获取导出id）
 * @param {*} params 
 */
export function getExportId(params){
    return get({
        url: `${url.API_Path}/api/order/export`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 查询导出任务结果url
 * @param {*} data 
 */
export function getExportDownUrl(data){
    const params = reviseParam(data, {});
    return get({
        url: `${url.API_Path}/api/task/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 导出 -- 选择导出项列表
 * @param {*} params 
 */
export function getExportTypeList(params){
    return get({
        url: `${url.API_Path}/api/options/export-items`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/************************************** 业务仪表盘模块 **************************************/

/**
 * 过滤日期条件
 * @param {*} params 
 */
export function getFilterDateList(params){
    return get({
        url: `${url.API_Path}/api/options/filter-date`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 汇总方式获取
 * @param {*} params 
 */
export function getSummaryModeList(params){
    return get({
        url: `${url.API_Path}/api/options/summary-mode`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 进境关别获取
 * @param {*} params 
 */
export function getEntryCustomsList(params){
    return get({
        url: `${url.API_Path}/api/options/JJKA`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 整拼类型获取
 * @param {*} params 
 */
export function getEntireTypeList(params){
    return get({
        url: `${url.API_Path}/api/options/trade-cont-type`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 完成下拉项获取
 * @param {*} params 
 */
export function getFinishTypeList(params){
    return get({
        url: `${url.API_Path}/api/options/finish-type`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 启运国下拉项获取
 * @param {*} params 
 */
export function getPolCountryList(params){
    return get({
        url: `${url.API_Path}/api/options/pol_country`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 贸易国下拉项获取
 * @param {*} params 
 */
export function getTradeCountryList(params){
    return get({
        url: `${url.API_Path}/api/options/trade_country`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 每日订单状态情况统计数据
 * @param {*} params 
 */
export function getDayOrderStatistics(params){
    return get({
        url: `${url.API_Path}/api/statistics/index`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 柱状图统计数据查询
 * @param {*} params 
 */
export function getBarChartStatistics(params){
    return get({
        url: `${url.API_Path}/api/statistics/histogram`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 执行多个请求
 * @param {*} array 
 */
export function executeMultiReqest(array){
    return executeMultiReq(array);
}




/************************************** 企业微信登录模块 **************************************/
/**
 * 企业微信登录接口
 * @param {*} params 
 */
export function erp_wxLogin(params){
    return post({
        url: `${url.API_Path}/api/qyweixin/login`,
        method: 'post',
        params: params,
        headers: {
            // Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 企业微信绑定接口
 * @param {*} params 
 */
export function erp_wxBind(params){
    return post({
        url: `${url.API_Path}/api/qyweixin/bind`,
        method: 'post',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 企业微信解绑接口
 * @param {*} params 
 */
export function erp_wxUnbind(params){
    return post({
        url: `${url.API_Path}/api/qyweixin/unbind`,
        method: 'post',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 密钥生成方式下拉选项
 * @param {*} params 
 */
export function getKeyGenerateList(params){
    return get({
        url: `${url.API_Path}/api/options/key-generate`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 获取API密钥信息
 * @param {*} params 
 */
export function getAPIAccessKey(account){
    return get({
        url: `${url.API_Path}/api/account/${account}/get/access/key`,
        method: 'get',
        // params: {},
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 刷新 access secret(重置密钥)
 * @param {*} params 
 */
export function resetAccessSecret(account){
    return post({
        url: `${url.API_Path}/api/account/${account}/refresh/secret/key`,
        method: 'post',
        params: {},
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/************************************** 账本管理模块 **************************************/
/**
 * 获取账本(群组)列表
 * @param {*} params 
 */
export function getAccountBookList(params){
    return get({
        url: `${url.API_Path}/api/group`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 获取某一群组账本关联帐号列表
 * @param {*} params 
 */
export function getAssociatedAccountList(groupId){
    return get({
        url: `${url.API_Path}/api/group/${groupId}/bind/account`,
        method: 'get',
        params: {},
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}
/**
 * 获取所有帐号列表
 * @param {*} params 
 */
export function getAllAccountList(params){
    return get({
        url: `${url.API_Path}/api/account/get/all`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 群组账本绑定账号
 * @param {*} params 
 */
export function groupBindAccount(groupId,params){
    return post({
        url: `${url.API_Path}/api/group/${groupId}/bind/account`,
        method: 'post',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 获取某一群组账本关联模板列表
 * @param {*} params 
 */
export function getAssociatedTemplateList(groupId){
    return get({
        url: `${url.API_Path}/api/group/${groupId}/bind/schema`,
        method: 'get',
        params: {},
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 获取所有模板列表
 * @param {*} params 
 */
export function getAllTemplateList(params){
    return get({
        url: `${url.API_Path}/api/schema/get/all`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 群组账本绑定账号
 * @param {*} params 
 */
export function groupBindTemplate(groupId,params){
    return post({
        url: `${url.API_Path}/api/group/${groupId}/bind/schema`,
        method: 'post',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 编辑群组名称
 * @param {*} data 
 */
export function editGroupName(data,groupId){
    return put({
        url: `${url.API_Path}/api/group/${groupId}`,
		method: 'put',
		data:data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 获取登录用户所有群组账本
 * @param {*} params 
 */
export function getLoginUserAllGroups(params){
    return get({
        url: `${url.API_Path}/api/options/loginuser/groups`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/**
 * 获取单证文件列表
 * @param {*} params 
 */
export function getDocumentsList (params){
    return get({
        url: `${url.API_Path}/api/options/loginuser/groups`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || ""
        }
    },true)
}

/************************************** 客户管理模块 **************************************/
//查询客户列表
export function getClientList(param) {
    return get({
        url: `${url.API_Path}/api/customer`,
        method: 'get',
		params:param,
		headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

//获取客户详情
export function getClientDetail(data, param) {
    const params = reviseParam(data, param);
    return get({
        url: `${url.API_Path}/api/customer/${params.str}`,
        method: 'get',
        params:params.querys,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}
//添加客户
export function addClient(data) {
    return post({
        url: `${url.API_Path}/api/customer`,
        method: 'post',
        data:data,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}
//编辑客户
export function modifyClient(data,param,urlData) {
    const params = reviseParam(urlData, param);
    return put({
        url: `${url.API_Path}/api/customer/${params.str}`,
        method: 'put',
        params:params.querys,
		data:qs.stringify(data),
		headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

//删除客户
export function deleteClient(data, param) {
    const params = reviseParam(data, param);
    return deleted({
        url: `${url.API_Path}/api/customer/${params.str}`,
        method: 'delete',
		params:params.querys,
		headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

/************************************** 公共查询模块 **************************************/
/**
 * 获取群组下拉项
 * @param {*} params 
 */
export function getGroupsPullList(params){
    return get({
        url: `${url.API_Path}/api/options/groups`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

/**
 * 获取公共查询存证信息数据
 * @param {*} params 
 */
export function publicCerList(params){
    return get({
        url: `${url.API_Path}/api/public/query`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

/**
 * 获取公共查询统计信息数据
 * @param {*} params 
 */
export function getPublicStatisticsMsg(params){
    return get({
        url: `${url.API_Path}/api/public/query/general`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

/************************************** 角色管理模块 **************************************/
/**
 * 获取角色列表
 * @param {*} params 
 */
export function getRoleList(params){
	return get({
        url: `${url.API_Path}/api/role`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

/**
 * 获取功能、数据权限列表
 * @param {*} params 
 */
export function getFuncDataList(roleId,params){
	return get({
        url: `${url.API_Path}/api/get/permissions/${roleId}`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

//保存数据权限配置
export function saveDataPermissionConfig(roldId,data) {
    return put({
        url: `${url.API_Path}/api/store/data/permissions/${roldId}`,
        method: 'put',
		data:data,
		headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

//保存功能权限配置
export function saveFuncPermissionConfig(roldId,data) {
    return put({
        url: `${url.API_Path}/api/store/func/permissions/${roldId}`,
        method: 'put',
		data:data,
		headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}


/**
 * 获取区块链拓扑存证信息数据
 * @param {*} params 
 */
export function getBlockchainCerList(params){
    return get({
        url: `${url.API_Path}/api/block/query/tx/hash`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}

/**
 * 获取区块链拓扑统计信息数据
 * @param {*} params 
 */
export function getBlockchainStatisticsMsg(params){
    return get({
        url: `${url.API_Path}/api/block/query/general`,
        method: 'get',
        params: params,
        headers: {
            Authorization: "Token " + localStorage.getItem("token") || "",
        }
    },true)
}
