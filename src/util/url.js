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

/*mgr*/
// let mgr = "http://10.6.5.184:5000" + process.env.MGR_PATH;
// console.log("mgr..."+mgr);
let mgr = process.env.MGR_PATH;
let api = process.env.LOCAL_PATH;
export default {
    // ORG_LIST: mgr +'/WeBASE-Node-Manager',// `mgr/WeBASE-Node-Manager`,
    // ORG_LIST: `${mgr}/WeBASE-Node-Manager`,
    // API_Path: `${api}`,//"http://10.6.5.184:8104",//`${api}`,//http://10.6.5.190build

    //有信运184内网地址
    // ORG_LIST: `${mgr}/WeBASE-Node-Manager`,
	// API_Path: "http://10.6.5.184:8104",
	
	//元初184内网地址
    // ORG_LIST: `${mgr}/WeBASE-Node-Manager`,
    // API_Path: "http://10.6.5.184:8105",

    //有信运252内网地址
    // ORG_LIST: `${mgr}/WeBASE-Node-Manager`,
    // API_Path: "http://demo.weinbc.com:8104",//"http://39.99.250.252:8104",//

    //公网地址 master 正式环境
    // ORG_LIST: `${mgr}/WeBASE-Node-Manager`,//`${mgr}/WeBASE-Node-Manager`,
	// API_Path: "http://www.you.xin:8104",
	
	//公网地址 master 二期测试版测试环境
    // ORG_LIST: `${mgr}/WeBASE-Node-Manager`,//`${mgr}/WeBASE-Node-Manager`,
	// API_Path: "http://www.you.xin:8106",
	
	//公网地址 master 二期正式版测试环境
    // ORG_LIST: `${mgr}/WeBASE-Node-Manager`,//`${mgr}/WeBASE-Node-Manager`,
	// API_Path: "http://test.you.xin:8107",
	
	//公网地址 master 元初二期正式版环境
    ORG_LIST: `${mgr}/WeBASE-Node-Manager`,//`${mgr}/WeBASE-Node-Manager`,
	API_Path: "http://origin.you.xin:8104",
	
	//本地环境 
    // ORG_LIST: `${mgr}/WeBASE-Node-Manager`,//`${mgr}/WeBASE-Node-Manager`,
	// API_Path: "http://10.6.5.190:80",
	
	//173内网 业务portal(元初)
    // ORG_LIST: `${mgr}/WeBASE-Node-Manager`,
	// API_Path: "http://10.6.5.173:8104",
	
	//183内网 管理portal(有信运)
    // ORG_LIST: `${mgr}/WeBASE-Node-Manager`,
    // API_Path: "http://10.6.5.183:8104",
}
