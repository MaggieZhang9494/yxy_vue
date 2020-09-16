import { isNullData, isJSONStr,timeStrToTimestamp} from '../util'
import router from "@/router";
/* 国际化 */
import i18n from '@/i18n/i18n'

// let perssionData = isNullData(localStorage.getItem("MenuDataCode"))?null:JSON.parse(localStorage.getItem("MenuDataCode"));
// let isPublicUser = localStorage.getItem("isPublicUser")==='true'?true:false;

// export {isPublicUser, perssionData};

/***********************************************************菜单功能显示数据处理***********************************************************/
//获取用户第一次进入显示在主页面的页面路由路径
export function getHomeRouterPath(){

	// let isPublicUser = localStorage.getItem("isPublicUser")==='true'?true:false;
	// if (isPublicUser) {
	// 	return "/publicQuery";
	// } else {
	// 	//超级管理员：显示所有菜单
	// 	if(loginData.roleName == "admin" && loginData.account == "admin"){
	// 		return "/main";
	// 	}
	// 	//普通管理员：显示
	// 	else if(loginData.roleName == "admin" && loginData.account != "admin"){
	// 		return "/accountList";
	// 	}
	// 	//普通成员：只显示业务管理模块
	// 	else{
	// 		return "/businessSearch";
	// 	}
	// }

	let list = getMenuShowRouterList();
	for (let index = 0; index < list.length; index++) {
		const element = list[index];
		if (element.menuShow) {
			for (let i = 0; i < element.children.length; i++) {
				const childItem = element.children[i];
				if (childItem.menuShow) {
					return childItem.path;
				}
			}
		}
	}
	return "";
}

//获取左侧菜单显示页面的路由列表
export function getMenuShowRouterList(){

	let perssionData = isNullData(localStorage.getItem("MenuDataCode"))?null:JSON.parse(localStorage.getItem("MenuDataCode"));
	let isPublicUser = localStorage.getItem("isPublicUser")==='true'?true:false;
	
	let list = JSON.parse(JSON.stringify(router.options.routes));
    list = list.map(item => {
		console.log("item.name...",item.name);
        if(item.menuShow!=undefined){
			if (isPublicUser) {
				//公共查询页面
				if(item.name === (i18n.t('message.menuName.publicQuery'))){
					item.menuShow = true;
				}else{
					item.menuShow = false;
				}
			}else{
				//公共查询页面,隐藏
				if(item.name === (i18n.t('message.menuName.publicQuery'))){
					item.menuShow = false;
				}else{
					//其他页面根据权限来控制是否显示
					if (item.name === (i18n.t('message.menuName.statistics')+" ")) { //业务仪表盘
						item.menuShow = perssionData.funcMenu["FUNC.FUNC.CODE_01"]?perssionData.funcMenu["FUNC.FUNC.CODE_01"].isSee:false;
					} else if (item.name === i18n.t('message.menuName.accountManagement')) { //帐号管理
						item.menuShow = perssionData.funcMenu["FUNC.FUNC.CODE_02"]?perssionData.funcMenu["FUNC.FUNC.CODE_02"].isSee:false;
						if (item.menuShow) {
							item.children = item.children.map(childItem => {
								if (childItem.name == i18n.t('message.menuName.userManagement')) { //用户管理
									childItem.menuShow = perssionData.funcMenu["FUNC.FUNC.CODE_02.CODE_02"]?perssionData.funcMenu["FUNC.FUNC.CODE_02.CODE_02"].isSee:false;
								} else if (childItem.name == i18n.t('message.menuName.roleManagement')) { //角色管理
									childItem.menuShow = perssionData.funcMenu["FUNC.FUNC.CODE_02.CODE_01"]?perssionData.funcMenu["FUNC.FUNC.CODE_02.CODE_01"].isSee:false;
								} else if (childItem.name == i18n.t('message.menuName.clientManagement')) { //客户管理
									childItem.menuShow = perssionData.funcMenu["FUNC.FUNC.CODE_02.CODE_03"]?perssionData.funcMenu["FUNC.FUNC.CODE_02.CODE_03"].isSee:false;
								} 
								return childItem;
							})
						}
					} else if (item.name === i18n.t('message.menuName.businessManagement')) { //业务管理
						item.menuShow = perssionData.funcMenu["FUNC.FUNC.CODE_03"]?perssionData.funcMenu["FUNC.FUNC.CODE_03"].isSee:false;
						if (item.menuShow) {
							item.children = item.children.map(childItem => {
								if (childItem.name == i18n.t('message.menuName.IEBusiness')) { //进出口业务
									childItem.menuShow = perssionData.funcMenu["FUNC.FUNC.CODE_03.CODE_01"]?perssionData.funcMenu["FUNC.FUNC.CODE_03.CODE_01"].isSee:false;
								} 
								// else if (childItem.name == i18n.t('message.menuName.analyze')) { //分析，已被拿掉
								// 	childItem.menuShow = perssionData.funcMenu["FUNC.FUNC.CODE_03.CODE_02"]?perssionData.funcMenu["FUNC.FUNC.CODE_03.CODE_02"].isSee:false;
								// } 
								else { //分析，已被拿掉
									
								}
								return childItem;
							})
						}
					} else if (item.name === 'main') { //区块链控制面板
						item.menuShow = perssionData.funcMenu["FUNC.FUNC.CODE_04"]?perssionData.funcMenu["FUNC.FUNC.CODE_04"].isSee:false;
					} 
					else if (item.name === i18n.t('message.menuName.blockBrowse')) { //区块浏览
						item.menuShow = perssionData.funcMenu["FUNC.FUNC.CODE_05"]?perssionData.funcMenu["FUNC.FUNC.CODE_05"].isSee:false;
					} else if (item.name === (i18n.t('message.menuName.nodeManagement')+" ")) { //节点管理
						item.menuShow = perssionData.funcMenu["FUNC.FUNC.CODE_06"]?perssionData.funcMenu["FUNC.FUNC.CODE_06"].isSee:false;
					} else if (item.name === i18n.t('message.menuName.contractManagement')) { //合约管理
						item.menuShow = perssionData.funcMenu["FUNC.FUNC.CODE_07"]?perssionData.funcMenu["FUNC.FUNC.CODE_07"].isSee:false;
					} else if (item.name === i18n.t('message.menuName.privateKeyManagement')) { //私钥管理
						item.menuShow = perssionData.funcMenu["FUNC.FUNC.CODE_08"]?perssionData.funcMenu["FUNC.FUNC.CODE_08"].isSee:false;
					} else if (item.name === i18n.t('message.menuName.systemManagement')) { //系统管理
						item.menuShow = perssionData.funcMenu["FUNC.FUNC.CODE_09"]?perssionData.funcMenu["FUNC.FUNC.CODE_09"].isSee:false;
					} else if (item.name === i18n.t('message.menuName.systemMonitor')) { //系统监控
						item.menuShow = perssionData.funcMenu["FUNC.FUNC.CODE_10"]?perssionData.funcMenu["FUNC.FUNC.CODE_10"].isSee:false;
					} else if (item.name === i18n.t('message.menuName.transactionAudit')) { //交易审计
						item.menuShow = perssionData.funcMenu["FUNC.FUNC.CODE_11"]?perssionData.funcMenu["FUNC.FUNC.CODE_11"].isSee:false;
					} else if (item.name === i18n.t('message.menuName.accountbookManage')) { //账本管理
						item.menuShow = perssionData.funcMenu["FUNC.FUNC.CODE_12"]?perssionData.funcMenu["FUNC.FUNC.CODE_12"].isSee:false;
					} else if (item.name === i18n.t('message.menuName.templateManagement')) { //模板管理
						item.menuShow = perssionData.funcMenu["FUNC.FUNC.CODE_13"]?perssionData.funcMenu["FUNC.FUNC.CODE_13"].isSee:false;
					} 
					else {
						
					}
				}
			}
        }
        return item;
	});

	return list;
}

/***********************************************************订单列表头部页面显示数据处理***********************************************************/
export function getOrderListHeaderShowList(portType,perssionData){
	let orderHeader = [];
	
	if (portType != 'FE'){//订单进口类型
		//行业种类
		if (perssionData.dataMenu["DATA.FI.BUSINESS_TYPE"].isSee) {
			orderHeader.push({enName: "BUSINESS_TYPE",name:""});
		}
		//工作号
		if (perssionData.dataMenu["DATA.FI.ORDER_NO"].isSee) {
			orderHeader.push({enName: "ORDER_NO",name:""});
		}
		//客户名称
		if (perssionData.dataMenu["DATA.FI.CUST_CN"].isSee) {
			orderHeader.push({enName: "CUST_CN",name:""});
		}
		//合同协议号
		if (perssionData.dataMenu["DATA.FI.CONTRACT_NO"].isSee) {
			orderHeader.push({enName: "CONTRACT_NO",name:""});
		}
		//承运人提单号
		if (perssionData.dataMenu["DATA.FI.MBL_NO"].isSee) {
			orderHeader.push({enName: "MBL_NO",name:""});
		}
		//分单号
		if (perssionData.dataMenu["DATA.FI.HBL_NO"].isSee) {
			orderHeader.push({enName: "HBL_NO",name:""});
		}
		//运输方式
		if (perssionData.dataMenu["DATA.FI.TRADE_TOOL_TYPE_NAME"].isSee) {
			orderHeader.push({enName: "TRADE_TOOL_TYPE_NAME",name:""});
		}
		//启运国(地区)
		if (perssionData.dataMenu["DATA.FI.POL_COUNTRY"].isSee) {
			orderHeader.push({enName: "POL_COUNTRY",name:""});
		}
		//启运港
		if (perssionData.dataMenu["DATA.FI.POL_NAME"].isSee) {
			orderHeader.push({enName: "POL_NAME",name:""});
		}
		//目的国(地区)
		if (perssionData.dataMenu["DATA.FI.POD_COUNTRY"].isSee) {
			orderHeader.push({enName: "POD_COUNTRY",name:""});
		}
		//目的港
		if (perssionData.dataMenu["DATA.FI.POD_NAME"].isSee) {
			orderHeader.push({enName: "POD_NAME",name:""});
		}
		//预计到港日
		if (perssionData.dataMenu["DATA.FI.ETA"].isSee) {
			orderHeader.push({enName: "ETA",name:""});
		}
		//实际到港日
		if (perssionData.dataMenu["DATA.FI.ATA"].isSee) {
			orderHeader.push({enName: "ATA",name:""});
		}
		//消费使用单位
		if (perssionData.dataMenu["DATA.FI.PRD_NAME"].isSee) {
			orderHeader.push({enName: "PRD_NAME",name:""});
		}
	}else{
		//行业种类
		if (perssionData.dataMenu["DATA.FE.BUSINESS_TYPE"].isSee) {
			orderHeader.push({enName: "BUSINESS_TYPE",name:""});
		}
		//工作号
		if (perssionData.dataMenu["DATA.FE.ORDER_NO"].isSee) {
			orderHeader.push({enName: "ORDER_NO",name:""});
		}
		//客户名称
		if (perssionData.dataMenu["DATA.FE.CUST_CN"].isSee) {
			orderHeader.push({enName: "CUST_CN",name:""});
		}
		//合同协议号
		if (perssionData.dataMenu['DATA.FE.CONTRACT_NO'].isSee) {
			orderHeader.push({enName: "CONTRACT_NO",name:""});
		}
		//承运人提单号
		if (perssionData.dataMenu['DATA.FE.MBL_NO'].isSee) {
			orderHeader.push({enName: "MBL_NO",name:""});
		}
		//分单号
		if (perssionData.dataMenu['DATA.FE.HBL_NO'].isSee) {
			orderHeader.push({enName: "HBL_NO",name:""});
		}
		//运输方式
		if (perssionData.dataMenu['DATA.FE.TRADE_TOOL_TYPE_NAME'].isSee) {
			orderHeader.push({enName: "TRADE_TOOL_TYPE_NAME",name:""});
		}
		//启运国(地区)
		if (perssionData.dataMenu['DATA.FE.POL_COUNTRY'].isSee) {
			orderHeader.push({enName: "POL_COUNTRY",name:""});
		}
		//启运港
		if (perssionData.dataMenu['DATA.FE.POL_NAME'].isSee) {
			orderHeader.push({enName: "POL_NAME",name:""});
		}
		//目的国(地区)
		if (perssionData.dataMenu['DATA.FE.POD_COUNTRY'].isSee) {
			orderHeader.push({enName: "POD_COUNTRY",name:""});
		}
		//目的港
		if (perssionData.dataMenu['DATA.FE.POD_NAME'].isSee) {
			orderHeader.push({enName: "POD_NAME",name:""});
		}
		//预计到港日
		if (perssionData.dataMenu['DATA.FE.ETA'].isSee) {
			orderHeader.push({enName: "ETA",name:""});
		}
		//实际到港日
		if (perssionData.dataMenu['DATA.FE.ATA'].isSee) {
			orderHeader.push({enName: "ATA",name:""});
		}
		//生产销售单位
		if (perssionData.dataMenu['DATA.FE.PRD_NAME'].isSee) {
			orderHeader.push({enName: "PRD_NAME",name:""});
		}
	}

	return orderHeader;
}

/***********************************************************订单详情页面顶部显示数据处理***********************************************************/
//获取订单详情顶部显示列表
export function getOrderDetailTopShowList(portType,perssionData,showKeyDesc,orderMsg){

	let isEn = localStorage.getItem("internationalization")=="en"?true:false;
	let detailShowList = [];

	if (portType != 'FE'){//订单进口类型
		//工作号
		if (perssionData.dataMenu["DATA.FI.ORDER_NO"].isSee) {
			detailShowList.push({name: showKeyDesc.ORDER_NO,value:(orderMsg?orderMsg.ORDER_NO:"")});
		}
		//行业种类
		if (perssionData.dataMenu["DATA.FI.BUSINESS_TYPE"].isSee) {
			detailShowList.push({name: showKeyDesc.BUSINESS_TYPE,value:(orderMsg?orderMsg.BUSINESS_TYPE:"")});
		}
		//客户名称
		if (perssionData.dataMenu["DATA.FI.CUST_CN"].isSee) {
			detailShowList.push({name: showKeyDesc.CUST_CN,value:(isEn?(orderMsg.CUST_NAME_EN?orderMsg.CUST_NAME_EN:orderMsg.CUST_CN):orderMsg.CUST_CN)});
		}
		//合同协议号
		if (perssionData.dataMenu["DATA.FI.CONTRACT_NO"].isSee) {
			detailShowList.push({name: (showKeyDesc.CONTRACT_NO?showKeyDesc.CONTRACT_NO:i18n.t('message.businessSearch.contractNum')),value:(orderMsg?orderMsg.CONTRACT_NO:"")});
		}
		//承运人提单号/分单号
		if (perssionData.dataMenu["DATA.FI.MBL_NO"].isSee) {
			//分单号显示
			if (perssionData.dataMenu["DATA.FI.HBL_NO"].isSee) {
				detailShowList.push({name: (showKeyDesc.MBL_NO+(showKeyDesc.HBL_NO?('/'+showKeyDesc.HBL_NO):'')),value:(orderMsg.MBL_NO+(orderMsg.HBL_NO?('/'+orderMsg.HBL_NO):''))});
			}else{
				detailShowList.push({name: showKeyDesc.MBL_NO,value:(orderMsg?orderMsg.MBL_NO:"")});
			}
		}else{
			//分单号可见
			if (perssionData.dataMenu["DATA.FI.HBL_NO"].isSee) {
				detailShowList.push({name: showKeyDesc.HBL_NO,value:(orderMsg?orderMsg.HBL_NO:"")});
			}
		}
		//启运国/启运港
		if (perssionData.dataMenu["DATA.FI.POL_COUNTRY"].isSee) {
			//启运港可见
			if (perssionData.dataMenu["DATA.FI.POL_NAME"].isSee) {
				detailShowList.push({name: (showKeyDesc.POL_COUNTRY+(showKeyDesc.POL_NAME?('/'+showKeyDesc.POL_NAME):'')),value:(orderMsg.POL_COUNTRY+(orderMsg.POL_NAME?('/'+orderMsg.POL_NAME):''))});
			} else {
				detailShowList.push({name: showKeyDesc.POL_COUNTRY,value:(orderMsg?orderMsg.POL_COUNTRY:"")});
			}
		}else{
			//启运港可见
			if (perssionData.dataMenu["DATA.FI.POL_NAME"].isSee) {
				detailShowList.push({name: showKeyDesc.POL_NAME,value:(orderMsg?orderMsg.POL_NAME:"")});
			}
		}
		//经停港
		if (perssionData.dataMenu["DATA.FI.POT_NAME"].isSee) {
			detailShowList.push({name: showKeyDesc.POT_NAME,value:(orderMsg?orderMsg.POT_NAME:"")});
		}
		//抵运国/抵运港
		if (perssionData.dataMenu["DATA.FI.POD_COUNTRY"].isSee) {
			//抵运港可见
			if (perssionData.dataMenu["DATA.FI.POD_NAME"].isSee) {
				detailShowList.push({name: (showKeyDesc.POD_COUNTRY+(showKeyDesc.POD_NAME?('/'+showKeyDesc.POD_NAME):'')),value:(orderMsg.POD_COUNTRY+(orderMsg.POD_NAME?('/'+orderMsg.POD_NAME):''))});
			} else {
				detailShowList.push({name: showKeyDesc.POD_COUNTRY,value:(orderMsg?orderMsg.POD_COUNTRY:"")});
			}
		}else{
			//抵运港可见
			if (perssionData.dataMenu["DATA.FI.POD_NAME"].isSee) {
				detailShowList.push({name: showKeyDesc.POD_NAME,value:(orderMsg?orderMsg.POD_NAME:"")});
			}
		}

		//货物种类
		if (perssionData.dataMenu["DATA.FI.CARGO_TYPE_NAME"].isSee) {
			detailShowList.push({name: showKeyDesc.CARGO_TYPE_NAME,value:(orderMsg?orderMsg.CARGO_TYPE_NAME:"")});
		}
		//承运人
		if (perssionData.dataMenu["DATA.FI.CARRIER_NAME"].isSee) {
			detailShowList.push({name: showKeyDesc.CARRIER_NAME,value:(orderMsg?orderMsg.CARRIER_NAME:"")});
		}
		//运输方式
		if (perssionData.dataMenu["DATA.FI.TRADE_TOOL_TYPE_NAME"].isSee) {
			detailShowList.push({name: showKeyDesc.TRADE_TOOL_TYPE_NAME,value:(orderMsg?orderMsg.TRADE_TOOL_TYPE_NAME:"")});
		}

		//运输工具名称及航次号
		if (perssionData.dataMenu["DATA.FI.TRANS_TOOL"].isSee) {
			//航次号
			if (perssionData.dataMenu["DATA.FI.VOYAGE_NO"].isSee) {
				detailShowList.push({name: (showKeyDesc.TRANS_TOOL+(showKeyDesc.VOYAGE_NO?('/'+showKeyDesc.VOYAGE_NO):'')),value:(orderMsg.TRANS_TOOL+(orderMsg.VOYAGE_NO?('/'+orderMsg.VOYAGE_NO):''))});
			} else {
				detailShowList.push({name: showKeyDesc.TRANS_TOOL,value:(orderMsg?orderMsg.TRANS_TOOL:"")});
			}
		}else{
			//航次号
			if (perssionData.dataMenu["DATA.FI.VOYAGE_NO"].isSee) {
				detailShowList.push({name: showKeyDesc.VOYAGE_NO,value:(orderMsg?orderMsg.VOYAGE_NO:"")});
			}
		}
		//整拼类型
		if (perssionData.dataMenu["DATA.FI.TRADE_CONT_TYPE"].isSee) {
			detailShowList.push({name: showKeyDesc.TRADE_CONT_TYPE,value:(orderMsg?orderMsg.TRADE_CONT_TYPE:"")});
		}
		//境外发货人
		if (perssionData.dataMenu["DATA.FI.OVERSEA"].isSee) {
			detailShowList.push({name: showKeyDesc.OVERSEA,value:(orderMsg?orderMsg.OVERSEA:"")});
		}
		//消费使用单位
		if (perssionData.dataMenu["DATA.FI.PRD_NAME"].isSee) {
			detailShowList.push({name: showKeyDesc.PRD_NAME,value:(orderMsg?orderMsg.PRD_NAME:"")});
		}
		//贸易国
		if (perssionData.dataMenu["DATA.FI.TRADE_COUNTRY"].isSee) {
			detailShowList.push({name: showKeyDesc.TRADE_COUNTRY,value:(orderMsg?orderMsg.TRADE_COUNTRY:"")});
		}
		//成交方式
		if (perssionData.dataMenu["DATA.FI.TRANSACTION_MODE_NAME"].isSee) {
			detailShowList.push({name: showKeyDesc.TRANSACTION_MODE_NAME,value:(orderMsg?orderMsg.TRANSACTION_MODE_NAME:"")});
		}
		//进境关别
		if (perssionData.dataMenu["DATA.FI.JJKA"].isSee) {
			detailShowList.push({name: showKeyDesc.JJKA,value:(orderMsg?orderMsg.JJKA:"")});
		}
		//入境口岸
		if (perssionData.dataMenu["DATA.FI.PORT_NAME"].isSee) {
			detailShowList.push({name: showKeyDesc.PORT_NAME,value:(orderMsg?orderMsg.PORT_NAME:"")});
		}
		//监管方式
		if (perssionData.dataMenu["DATA.FI.BRF_NAME"].isSee) {
			detailShowList.push({name: showKeyDesc.BRF_NAME,value:(orderMsg?orderMsg.BRF_NAME:"")});
		}
		//件数
		if (perssionData.dataMenu["DATA.FI.CARGO_NUM"].isSee) {
			detailShowList.push({name: showKeyDesc.CARGO_NUM,value:(orderMsg?orderMsg.CARGO_NUM:"")});
		}
		//毛重
		if (perssionData.dataMenu["DATA.FI.GROSS_WEIGHT"].isSee) {
			detailShowList.push({name: showKeyDesc.GROSS_WEIGHT,value:(orderMsg?orderMsg.GROSS_WEIGHT:"")});
		}
		//体积
		if (perssionData.dataMenu["DATA.FI.GROSS_VOLUME"].isSee) {
			detailShowList.push({name: showKeyDesc.GROSS_VOLUME,value:(orderMsg?orderMsg.GROSS_VOLUME:"")});
		}

		//包装种类
		if (perssionData.dataMenu["DATA.FI.PACKAGE_NAME"].isSee) {
			detailShowList.push({name: showKeyDesc.PACKAGE_NAME,value:(orderMsg?orderMsg.PACKAGE_NAME:"")});
		}
		//FCL\箱量/箱型有值
		if (orderMsg.TRADE_CONT_TYPE == 'FCL' && !isNullData(orderMsg?orderMsg.CONT_INFO:"")) {
			//箱量/箱型
			if (perssionData.dataMenu["DATA.FI.CONT_INFO"].isSee) {
				detailShowList.push({name: showKeyDesc.CONT_INFO,value:(orderMsg?orderMsg.CONT_INFO:"")});
			}
		}
	} else { //订单出口类型

		//工作号
		if (perssionData.dataMenu['DATA.FE.ORDER_NO'].isSee) {
			detailShowList.push({name: showKeyDesc.ORDER_NO,value:(orderMsg?orderMsg.ORDER_NO:"")});
		}
		//行业种类
		if (perssionData.dataMenu['DATA.FE.BUSINESS_TYPE'].isSee) {
			detailShowList.push({name: showKeyDesc.BUSINESS_TYPE,value:(orderMsg?orderMsg.BUSINESS_TYPE:"")});
		}
		//客户名称
		if (perssionData.dataMenu['DATA.FE.CUST_CN'].isSee) {
			detailShowList.push({name: showKeyDesc.CUST_CN,value:(isEn?(orderMsg.CUST_NAME_EN?orderMsg.CUST_NAME_EN:orderMsg.CUST_CN):orderMsg.CUST_CN)});
		}
		//合同协议号
		if (perssionData.dataMenu['DATA.FE.CONTRACT_NO'].isSee) {
			detailShowList.push({name: (showKeyDesc.CONTRACT_NO?showKeyDesc.CONTRACT_NO:i18n.t('message.businessSearch.contractNum')),value:(orderMsg?orderMsg.CONTRACT_NO:"")});
		}
		//承运人提单号/分单号
		if (perssionData.dataMenu['DATA.FE.MBL_NO'].isSee) {
			//分单号显示
			if (perssionData.dataMenu['DATA.FE.HBL_NO'].isSee) {
				detailShowList.push({name: (showKeyDesc.MBL_NO+(showKeyDesc.HBL_NO?('/'+showKeyDesc.HBL_NO):'')),value:(orderMsg.MBL_NO+(orderMsg.HBL_NO?('/'+orderMsg.HBL_NO):''))});
			}else{
				detailShowList.push({name: showKeyDesc.MBL_NO,value:(orderMsg?orderMsg.MBL_NO:"")});
			}
		}else{
			//分单号可见
			if (perssionData.dataMenu['DATA.FE.HBL_NO'].isSee) {
				detailShowList.push({name: showKeyDesc.HBL_NO,value:(orderMsg?orderMsg.HBL_NO:"")});
			}
		}
		//启运国/启运港
		if (perssionData.dataMenu['DATA.FE.POL_COUNTRY'].isSee) {
			//启运港可见
			if (perssionData.dataMenu['DATA.FE.POL_NAME'].isSee) {
				detailShowList.push({name: (showKeyDesc.POL_COUNTRY+(showKeyDesc.POL_NAME?('/'+showKeyDesc.POL_NAME):'')),value:(orderMsg.POL_COUNTRY+(orderMsg.POL_NAME?('/'+orderMsg.POL_NAME):''))});
			} else {
				detailShowList.push({name: showKeyDesc.POL_COUNTRY,value:(orderMsg?orderMsg.POL_COUNTRY:"")});
			}
		}else{
			//启运港可见
			if (perssionData.dataMenu['DATA.FE.POL_NAME'].isSee) {
				detailShowList.push({name: showKeyDesc.POL_NAME,value:(orderMsg?orderMsg.POL_NAME:"")});
			}
		}
		//抵运国/抵运港
		if (perssionData.dataMenu['DATA.FE.POD_COUNTRY'].isSee) {
			//抵运港可见
			if (perssionData.dataMenu['DATA.FE.POD_NAME'].isSee) {
				detailShowList.push({name: (showKeyDesc.POD_COUNTRY+(showKeyDesc.POD_NAME?('/'+showKeyDesc.POD_NAME):'')),value:(orderMsg.POD_COUNTRY+(orderMsg.POD_NAME?('/'+orderMsg.POD_NAME):''))});
			} else {
				detailShowList.push({name: showKeyDesc.POD_COUNTRY,value:(orderMsg?orderMsg.POD_COUNTRY:"")});
			}
		}else{
			//抵运港可见
			if (perssionData.dataMenu['DATA.FE.POD_NAME'].isSee) {
				detailShowList.push({name: showKeyDesc.POD_NAME,value:(orderMsg?orderMsg.POD_NAME:"")});
			}
		}

		//货物种类
		if (perssionData.dataMenu['DATA.FE.CARGO_TYPE_NAME'].isSee) {
			detailShowList.push({name: showKeyDesc.CARGO_TYPE_NAME,value:(orderMsg?orderMsg.CARGO_TYPE_NAME:"")});
		}
		//承运人
		if (perssionData.dataMenu['DATA.FE.CARRIER_NAME'].isSee) {
			detailShowList.push({name: showKeyDesc.CARRIER_NAME,value:(orderMsg?orderMsg.CARRIER_NAME:"")});
		}
		//运输方式
		if (perssionData.dataMenu['DATA.FE.TRADE_TOOL_TYPE_NAME'].isSee) {
			detailShowList.push({name: showKeyDesc.TRADE_TOOL_TYPE_NAME,value:(orderMsg?orderMsg.TRADE_TOOL_TYPE_NAME:"")});
		}

		//运输工具名称及航次号
		if (perssionData.dataMenu['DATA.FE.TRANS_TOOL'].isSee) {
			//航次号
			if (perssionData.dataMenu['DATA.FE.VOYAGE_NO'].isSee) {
				detailShowList.push({name: (showKeyDesc.TRANS_TOOL+(showKeyDesc.VOYAGE_NO?('/'+showKeyDesc.VOYAGE_NO):'')),value:(orderMsg.TRANS_TOOL+(orderMsg.VOYAGE_NO?('/'+orderMsg.VOYAGE_NO):''))});
			} else {
				detailShowList.push({name: showKeyDesc.TRANS_TOOL,value:(orderMsg?orderMsg.TRANS_TOOL:"")});
			}
		}else{
			//航次号
			if (perssionData.dataMenu['DATA.FE.VOYAGE_NO'].isSee) {
				detailShowList.push({name: showKeyDesc.VOYAGE_NO,value:(orderMsg?orderMsg.VOYAGE_NO:"")});
			}
		}
		//整拼类型
		if (perssionData.dataMenu['DATA.FE.TRADE_CONT_TYPE'].isSee) {
			detailShowList.push({name: showKeyDesc.TRADE_CONT_TYPE,value:(orderMsg?orderMsg.TRADE_CONT_TYPE:"")});
		}
		//境内发货人
		if (perssionData.dataMenu['DATA.FE.JYDW'].isSee) {
			detailShowList.push({name: showKeyDesc.JYDW,value:(orderMsg?orderMsg.JYDW:"")});
		}
		//生产销售单位
		if (perssionData.dataMenu['DATA.FE.PRD_NAME'].isSee) {
			detailShowList.push({name: showKeyDesc.PRD_NAME,value:(orderMsg?orderMsg.PRD_NAME:"")});
		}
		//贸易国
		if (perssionData.dataMenu['DATA.FE.TRADE_COUNTRY'].isSee) {
			detailShowList.push({name: showKeyDesc.TRADE_COUNTRY,value:(orderMsg?orderMsg.TRADE_COUNTRY:"")});
		}
		//成交方式
		if (perssionData.dataMenu['DATA.FE.TRANSACTION_MODE_NAME'].isSee) {
			detailShowList.push({name: showKeyDesc.TRANSACTION_MODE_NAME,value:(orderMsg?orderMsg.TRANSACTION_MODE_NAME:"")});
		}
		//出境关别
		if (perssionData.dataMenu['DATA.FE.JJKA'].isSee) {
			detailShowList.push({name: showKeyDesc.JJKA,value:(orderMsg?orderMsg.JJKA:"")});
		}
		//离境口岸
		if (perssionData.dataMenu['DATA.FE.PORT_NAME'].isSee) {
			detailShowList.push({name: showKeyDesc.PORT_NAME,value:(orderMsg?orderMsg.PORT_NAME:"")});
		}
		//监管方式
		if (perssionData.dataMenu['DATA.FE.BRF_NAME'].isSee) {
			detailShowList.push({name: showKeyDesc.BRF_NAME,value:(orderMsg?orderMsg.BRF_NAME:"")});
		}
		//件数
		if (perssionData.dataMenu['DATA.FE.CARGO_NUM'].isSee) {
			detailShowList.push({name: showKeyDesc.CARGO_NUM,value:(orderMsg?orderMsg.CARGO_NUM:"")});
		}
		//毛重
		if (perssionData.dataMenu['DATA.FE.GROSS_WEIGHT'].isSee) {
			detailShowList.push({name: showKeyDesc.GROSS_WEIGHT,value:(orderMsg?orderMsg.GROSS_WEIGHT:"")});
		}
		//体积
		if (perssionData.dataMenu['DATA.FE.GROSS_VOLUME'].isSee) {
			detailShowList.push({name: showKeyDesc.GROSS_VOLUME,value:(orderMsg?orderMsg.GROSS_VOLUME:"")});
		}

		//包装种类
		if (perssionData.dataMenu['DATA.FE.PACKAGE_NAME'].isSee) {
			detailShowList.push({name: showKeyDesc.PACKAGE_NAME,value:(orderMsg?orderMsg.PACKAGE_NAME:"")});
		}
		//FCL\箱量/箱型有值
		if (orderMsg.TRADE_CONT_TYPE == 'FCL' && !isNullData(orderMsg?orderMsg.CONT_INFO:"")) {
			//箱量/箱型
			if (perssionData.dataMenu['DATA.FE.CONT_INFO'].isSee) {
				detailShowList.push({name: showKeyDesc.CONT_INFO,value:(orderMsg?orderMsg.CONT_INFO:"")});
			}
		}
	}

	return detailShowList;
}

//获取报关单详情显示列表
export function getCustomDetailTopShowList(portType,perssionData,showKeyDesc,declaration){
	let isCn = localStorage.getItem("internationalization")=="zh-cn"?true:false;
	let detailShowList = [];

	if (portType != 'FE'){//订单进口类型
		//境内收货人
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.TRADE_NAME"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.TRADE_NAME'],value:(declaration?declaration.TRADE_NAME:"")});
		}
		//进境关别
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.IE_PORT_NAME"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.IE_PORT_NAME'],value:(declaration?declaration.IE_PORT_NAME:"")});
		}
		//进口日期
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.IE_DATE"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.IE_DATE'],value:(declaration?declaration.IE_DATE.substr(0,10):"")});
		}
		//申报日期
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.SBDATE"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.SBDATE'],value:(declaration?declaration.SBDATE.substr(0,10):"")});
		}
		//备案号
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.CASE_NO"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.CASE_NO'],value:(declaration?declaration.CASE_NO:"")});
		}

		//境外发货人
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.OVERSEAS_CONSIGNOR_NAME"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.OVERSEAS_CONSIGNOR_NAME'],value:(declaration?declaration.OVERSEAS_CONSIGNOR_NAME:"")});
		}
		//运输方式
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.TRAF_MODE_NAME"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.TRAF_MODE_NAME'],value:(declaration?declaration.TRAF_MODE_NAME:"")});
		}
		//运输工具名称及航次号
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.TRAF_NAME"].isSee) {
			//航次号
			if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.VOYAGE_NO"].isSee) {
				detailShowList.push({name: (showKeyDesc['DECLARATION_LIST.TRAF_NAME']+(showKeyDesc['DECLARATION_LIST.VOYAGE_NO']?('/'+showKeyDesc['DECLARATION_LIST.VOYAGE_NO']):'')),value:(declaration.TRAF_NAME+(declaration.VOYAGE_NO?('/'+declaration.VOYAGE_NO):''))});
			} else {
				detailShowList.push({name:showKeyDesc['DECLARATION_LIST.TRAF_NAME'],value:(declaration?declaration.TRAF_NAME:"")});
			}
		}else{
			//航次号
			if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.VOYAGE_NO"].isSee) {
				detailShowList.push({name:showKeyDesc['DECLARATION_LIST.VOYAGE_NO'],value:(declaration?declaration.VOYAGE_NO:"")});
			}
		}
		//承运人提单号
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.BILL_NO"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.BILL_NO'],value:(declaration?declaration.BILL_NO:"")});
		}
		//货物存放地
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.GOODS_PLACE"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.GOODS_PLACE'],value:(declaration?declaration.GOODS_PLACE:"")});
		}

		//消费使用单位
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.OWNER_NAME"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.OWNER_NAME'],value:(declaration?declaration.OWNER_NAME:"")});
		}
		//监管方式
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.TRADE_MODE_NAME"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.TRADE_MODE_NAME'],value:(declaration?declaration.TRADE_MODE_NAME:"")});
		}
		//征免性质
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.CUT_NAME"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.CUT_NAME'],value:(declaration?declaration.CUT_NAME:"")});
		}
		//许可证号
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.PASS_NO"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.PASS_NO'],value:(declaration?declaration.PASS_NO:"")});
		}
		//启运港
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.DESP_PORT_NAME"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.DESP_PORT_NAME'],value:(declaration?declaration.DESP_PORT_NAME:"")});
		}

		//合同协议号
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.CONTRACT_NO"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.CONTRACT_NO'],value:(declaration?declaration.CONTRACT_NO:"")});
		}
		//贸易国
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.TRADE_AREA_NAME"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.TRADE_AREA_NAME'],value:(declaration?declaration.TRADE_AREA_NAME:"")});
		}
		//启运国
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.TRADE_COUNTRY_NAME"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.TRADE_COUNTRY_NAME'],value:(declaration?declaration.TRADE_COUNTRY_NAME:"")});
		}
		//经停港
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.POL_NAME"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.POL_NAME'],value:(declaration?declaration.POL_NAME:"")});
		}
		//入境口岸
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.ENTY_PORT_NAME"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.ENTY_PORT_NAME'],value:(declaration?declaration.ENTY_PORT_NAME:"")});
		}

		//包装种类
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.CARGO_PACKAGE"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.CARGO_PACKAGE'],value:(declaration?declaration.CARGO_PACKAGE:"")});
		}
		//件数
		if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.CARGO_NUM'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.CARGO_NUM'],value:(declaration?declaration.CARGO_NUM:"")});
		}
		//毛重 
		if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.CARGO_GROSS_WEIGHT'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.CARGO_GROSS_WEIGHT'],value:(declaration?declaration.CARGO_GROSS_WEIGHT:"")});
		}
		//净重
		if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.CARGO_NET_WEIGHT'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.CARGO_NET_WEIGHT'],value:(declaration?declaration.CARGO_NET_WEIGHT:"")});
		}
		//成交方式
		if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.TRANS_MODE_NAME'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.TRANS_MODE_NAME'],value:(declaration?declaration.TRANS_MODE_NAME:"")});
		}

		//运费
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.FRT_FEE"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.FRT_FEE'],value:(declaration?declaration.FRT_FEE:"")});
		}
		//保费
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.INS_FEE"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.INS_FEE'],value:(declaration?declaration.INS_FEE:"")});
		}
		//杂费
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.OTHER_FEE"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.OTHER_FEE'],value:(declaration?declaration.OTHER_FEE:"")});
		}
		//随附单证
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.CERT_MARK"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.CERT_MARK'],value:(declaration?declaration.CERT_MARK:"")});
		}
		//标记唛码及备注
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.MARKS"].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.MARKS'],value:(declaration?declaration.MARKS:"")});
		}

		//特殊关系确认
		if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.SPECIAL_CONFIRM'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.SPECIAL_CONFIRM'],value:(!isNullData(declaration.SPECIAL_CONFIRM)?((declaration.SPECIAL_CONFIRM==1 || declaration.SPECIAL_CONFIRM=="1")?(isCn?"是":"YES"):(isCn?"否":"NO")):"")});
		}
		//价格影响确认
		if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.PRICE_CONFIRM'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.PRICE_CONFIRM'],value:(!isNullData(declaration.PRICE_CONFIRM)?((declaration.PRICE_CONFIRM==1 || declaration.PRICE_CONFIRM=="1")?(isCn?"是":"YES"):(isCn?"否":"NO")):"")});
		}
		//支付特许权使用费确认
		if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.PAYMENT_CONFIRM'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.PAYMENT_CONFIRM'],value:(!isNullData(declaration.PAYMENT_CONFIRM)?((declaration.PAYMENT_CONFIRM==1 || declaration.PAYMENT_CONFIRM=="1")?(isCn?"是":"YES"):(isCn?"否":"NO")):"")});
		}
		//自报自缴
		// if (perssionData.dataMenu.import_code_72_53.isSee) {
			detailShowList.push({name:i18n.t('message.businessDetail.selfReport'),value:("")});
		// }
		//报关人员
		if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.OP_NAME'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.OP_NAME'],value:(declaration?declaration.OP_NAME:"")});
		}
		//报关人员证号
		if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.IC_CODE'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.IC_CODE'],value:(declaration?declaration.IC_CODE:"")});
		}
		//电话
		if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.TEL'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.TEL'],value:(declaration?declaration.TEL:"")});
		}
		//申报单位
		if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.AGENT_NAME'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.AGENT_NAME'],value:(declaration?declaration.AGENT_NAME:"")});
		}
	} else { //订单出口类型

		//境内发货人
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.TRADE_NAME'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.TRADE_NAME'],value:(declaration?declaration.TRADE_NAME:"")});
		}
		//出境关别 
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.IE_PORT_NAME'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.IE_PORT_NAME'],value:(declaration?declaration.IE_PORT_NAME:"")});
		}
		//出口日期
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.IE_DATE'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.IE_DATE'],value:(declaration?declaration.IE_DATE.substr(0,10):"")});
		}
		//申报日期
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.SBDATE'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.SBDATE'],value:(declaration?declaration.SBDATE.substr(0,10):"")});
		}
		//备案号
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.CASE_NO'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.CASE_NO'],value:(declaration?declaration.CASE_NO:"")});
		}

		//境外收货人
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.OVERSEAS_CONSIGNOR_NAME'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.OVERSEAS_CONSIGNOR_NAME'],value:(declaration?declaration.OVERSEAS_CONSIGNOR_NAME:"")});
		}
		//运输方式
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.TRAF_MODE_NAME'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.TRAF_MODE_NAME'],value:(declaration?declaration.TRAF_MODE_NAME:"")});
		}
		//运输工具名称及航次号
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.TRAF_NAME'].isSee) {
			//航次号
			if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.VOYAGE_NO'].isSee) {
				detailShowList.push({name: (showKeyDesc['DECLARATION_LIST.TRAF_NAME']+(showKeyDesc['DECLARATION_LIST.VOYAGE_NO']?('/'+showKeyDesc['DECLARATION_LIST.VOYAGE_NO']):'')),value:(declaration.TRANS_TOOL+(declaration.VOYAGE_NO?('/'+declaration.VOYAGE_NO):''))});
			} else {
				detailShowList.push({name:showKeyDesc['DECLARATION_LIST.TRAF_NAME'],value:(declaration?declaration.TRAF_NAME:"")});
			}
		}else{
			//航次号
			if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.VOYAGE_NO'].isSee) {
				detailShowList.push({name:showKeyDesc['DECLARATION_LIST.VOYAGE_NO'],value:(declaration?declaration.VOYAGE_NO:"")});
			}
		}
		//承运人提单号
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.BILL_NO'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.BILL_NO'],value:(declaration?declaration.BILL_NO:"")});
		}
		//货物存放地
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.GOODS_PLACE'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.GOODS_PLACE'],value:(declaration?declaration.GOODS_PLACE:"")});
		}

		//生产销售单位
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.OWNER_NAME'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.OWNER_NAME'],value:(declaration?declaration.OWNER_NAME:"")});
		}
		//监管方式
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.TRADE_MODE_NAME'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.TRADE_MODE_NAME'],value:(declaration?declaration.TRADE_MODE_NAME:"")});
		}
		//征免性质
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.CUT_NAME'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.CUT_NAME'],value:(declaration?declaration.CUT_NAME:"")});
		}
		//许可证号
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.PASS_NO'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.PASS_NO'],value:(declaration?declaration.PASS_NO:"")});
		}

		//合同协议号
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.CONTRACT_NO'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.CONTRACT_NO'],value:(declaration?declaration.CONTRACT_NO:"")});
		}
		//贸易国
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.TRADE_AREA_NAME'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.TRADE_AREA_NAME'],value:(declaration?declaration.TRADE_AREA_NAME:"")});
		}
		//抵运国
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.TRADE_COUNTRY_NAME'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.TRADE_COUNTRY_NAME'],value:(declaration?declaration.TRADE_COUNTRY_NAME:"")});
		}
		//指运港
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.POL_NAME'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.POL_NAME'],value:(declaration?declaration.POL_NAME:"")});
		}
		//离境口岸
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.ENTY_PORT_NAME'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.ENTY_PORT_NAME'],value:(declaration?declaration.ENTY_PORT_NAME:"")});
		}

		//包装种类
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.CARGO_PACKAGE'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.CARGO_PACKAGE'],value:(declaration?declaration.CARGO_PACKAGE:"")});
		}
		//件数
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.CARGO_NUM'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.CARGO_NUM'],value:(declaration?declaration.CARGO_NUM:"")});
		}
		//毛重 
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.CARGO_GROSS_WEIGHT'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.CARGO_GROSS_WEIGHT'],value:(declaration?declaration.CARGO_GROSS_WEIGHT:"")});
		}
		//净重
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.CARGO_NET_WEIGHT'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.CARGO_NET_WEIGHT'],value:(declaration?declaration.CARGO_NET_WEIGHT:"")});
		}
		//成交方式
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.TRANS_MODE_NAME'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.TRANS_MODE_NAME'],value:(declaration?declaration.TRANS_MODE_NAME:"")});
		}

		//运费
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.FRT_FEE'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.FRT_FEE'],value:(declaration?declaration.FRT_FEE:"")});
		}
		//保费
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.INS_FEE'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.INS_FEE'],value:(declaration?declaration.INS_FEE:"")});
		}
		//杂费
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.OTHER_FEE'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.OTHER_FEE'],value:(declaration?declaration.OTHER_FEE:"")});
		}
		//随附单证
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.CERT_MARK'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.CERT_MARK'],value:(declaration?declaration.CERT_MARK:"")});
		}
		//标记唛码及备注
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.MARKS'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.MARKS'],value:(declaration?declaration.MARKS:"")});
		}

		//特殊关系确认
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.SPECIAL_CONFIRM'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.SPECIAL_CONFIRM'],value:(!isNullData(declaration.SPECIAL_CONFIRM)?((declaration.SPECIAL_CONFIRM==1 || declaration.SPECIAL_CONFIRM=="1")?(isCn?"是":"YES"):(isCn?"否":"NO")):"")});
		}
		//价格影响确认
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.PRICE_CONFIRM'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.PRICE_CONFIRM'],value:(!isNullData(declaration.PRICE_CONFIRM)?((declaration.PRICE_CONFIRM==1 || declaration.PRICE_CONFIRM=="1")?(isCn?"是":"YES"):(isCn?"否":"NO")):"")});
		}
		//支付特许权使用费确认
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.PAYMENT_CONFIRM'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.PAYMENT_CONFIRM'],value:(!isNullData(declaration.PAYMENT_CONFIRM)?((declaration.PAYMENT_CONFIRM==1 || declaration.PAYMENT_CONFIRM=="1")?(isCn?"是":"YES"):(isCn?"否":"NO")):"")});
		}
		//自报自缴
		// if (perssionData.dataMenu.export_code_69_48.isSee) {
			detailShowList.push({name:i18n.t('message.businessDetail.selfReport'),value:("")});
		// }
		//报关人员
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.OP_NAME'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.OP_NAME'],value:(declaration?declaration.OP_NAME:"")});
		}
		//报关人员证号
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.IC_CODE'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.IC_CODE'],value:(declaration?declaration.IC_CODE:"")});
		}
		//电话
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.TEL'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.TEL'],value:(declaration?declaration.TEL:"")});
		}
		//申报单位
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.AGENT_NAME'].isSee) {
			detailShowList.push({name:showKeyDesc['DECLARATION_LIST.AGENT_NAME'],value:(declaration?declaration.AGENT_NAME:"")});
		}
	}

	return detailShowList;
}

/***********************************************************复核纠错页面显示数据处理***********************************************************/
//获取退改单列表头部显示列表
export function getReturnNoHeadShowList(orderType,perssionData,businessDesc){
	console.log("orderType...", orderType);
	let problemHeader = [];

	if (orderType != 'FE'){//订单进口类型
		//虚拟报关单号
		if (perssionData.dataMenu['DATA.FI.ORDER_PROBLEM_REMARK.DCL_NO'].isSee) {
			problemHeader.push({enName: "DCL_NO",name:businessDesc["ORDER_PROBLEM_REMARK.DCL_NO"],width:"360"});
		}
		//备注时间
		if (perssionData.dataMenu['DATA.FI.ORDER_PROBLEM_REMARK.CREATE_DATE'].isSee) {
			problemHeader.push({enName: "CREATE_DATE",name:businessDesc["ORDER_PROBLEM_REMARK.CREATE_DATE"],width:"150"});
		}
		//备注类型
		if (perssionData.dataMenu['DATA.FI.ORDER_PROBLEM_REMARK.REMARK_TYPE'].isSee) {
			problemHeader.push({enName: "REMARK_TYPE",name:businessDesc["ORDER_PROBLEM_REMARK.REMARK_TYPE"],width:"80"});
		}
		//退单人
		if (perssionData.dataMenu['DATA.FI.ORDER_PROBLEM_REMARK.CREATE_BY'].isSee) {
			problemHeader.push({enName: "CREATE_BY",name:businessDesc["ORDER_PROBLEM_REMARK.CREATE_BY"],width:"80"});
		}
		//备注
		if (perssionData.dataMenu['DATA.FI.ORDER_PROBLEM_REMARK.REMARKS'].isSee) {
			problemHeader.push({enName: "REMARKS",name:businessDesc["ORDER_PROBLEM_REMARK.REMARKS"]});
		}
	} else {
		//虚拟报关单号
		if (perssionData.dataMenu['DATA.FE.ORDER_PROBLEM_REMARK.DCL_NO'].isSee) {
			problemHeader.push({enName: "DCL_NO",name:businessDesc["ORDER_PROBLEM_REMARK.DCL_NO"],width:"360"});
		}
		//备注时间
		if (perssionData.dataMenu['DATA.FE.ORDER_PROBLEM_REMARK.CREATE_DATE'].isSee) {
			problemHeader.push({enName: "CREATE_DATE",name:businessDesc["ORDER_PROBLEM_REMARK.CREATE_DATE"],width:"150"});
		}
		//备注类型
		if (perssionData.dataMenu['DATA.FE.ORDER_PROBLEM_REMARK.REMARK_TYPE'].isSee) {
			problemHeader.push({enName: "REMARK_TYPE",name:businessDesc["ORDER_PROBLEM_REMARK.REMARK_TYPE"],width:"80"});
		}
		//退单人
		if (perssionData.dataMenu['DATA.FE.ORDER_PROBLEM_REMARK.CREATE_BY'].isSee) {
			problemHeader.push({enName: "CREATE_BY",name:businessDesc["ORDER_PROBLEM_REMARK.CREATE_BY"],width:"80"});
		}
		//备注
		if (perssionData.dataMenu['DATA.FE.ORDER_PROBLEM_REMARK.REMARKS'].isSee) {
			problemHeader.push({enName: "REMARKS",name:businessDesc["ORDER_PROBLEM_REMARK.REMARKS"]});
		}
	}

	return problemHeader;
}

//获取被记录报列表头部显示列表
export function getRecordHeadShowList(orderType,perssionData,businessDesc){
	let errorHeader = [];

	if (orderType != 'FE'){//订单进口类型
		//虚拟报关单号
		if (perssionData.dataMenu['DATA.FI.ORDER_ERROR_LIST.DCL_NO'].isSee) {
			errorHeader.push({enName: "DCL_NO",name:businessDesc["ORDER_ERROR_LIST.DCL_NO"],width:"360"});
		}
		//正式报关单号
		if (perssionData.dataMenu['DATA.FI.ORDER_ERROR_LIST.CUS_NO'].isSee) {
			errorHeader.push({enName: "CUS_NO",name:businessDesc["ORDER_ERROR_LIST.CUS_NO"],width:"150"});
		}
		//被记录报备注
		if (perssionData.dataMenu['DATA.FI.ORDER_ERROR_LIST.ERROR_REMARKS'].isSee) {
			errorHeader.push({enName: "ERROR_REMARKS",name:businessDesc["ORDER_ERROR_LIST.ERROR_REMARKS"]});
		}
		//被记录报时间
		if (perssionData.dataMenu['DATA.FI.ORDER_ERROR_LIST.ERRORDATE'].isSee) {
			errorHeader.push({enName: "ERRORDATE",name:businessDesc["ORDER_ERROR_LIST.ERRORDATE"],width:"150"});
		}
	} else {
		//虚拟报关单号
		if (perssionData.dataMenu['DATA.FE.ORDER_ERROR_LIST.DCL_NO'].isSee) {
			errorHeader.push({enName: "DCL_NO",name:businessDesc["ORDER_ERROR_LIST.DCL_NO"],width:"360"});
		}
		//正式报关单号
		if (perssionData.dataMenu['DATA.FE.ORDER_ERROR_LIST.CUS_NO'].isSee) {
			errorHeader.push({enName: "CUS_NO",name:businessDesc["ORDER_ERROR_LIST.CUS_NO"],width:"150"});
		}
		//被记录报备注
		if (perssionData.dataMenu['DATA.FE.ORDER_ERROR_LIST.ERROR_REMARKS'].isSee) {
			errorHeader.push({enName: "ERROR_REMARKS",name:businessDesc["ORDER_ERROR_LIST.ERROR_REMARKS"]});
		}
		//被记录报时间
		if (perssionData.dataMenu['DATA.FE.ORDER_ERROR_LIST.ERRORDATE'].isSee) {
			errorHeader.push({enName: "ERRORDATE",name:businessDesc["ORDER_ERROR_LIST.ERRORDATE"],width:"150"});
		}
	}

	return errorHeader;
}

//获取复合纠错-审单过程右侧显示数据
export function getAuditRightNodeList(orderType,perssionData,businessDesc,orderMsg){
	let auditRightNodeList = [];
	if (orderMsg.ORDER_AUDIT_LIST) {
		//获取审单过程数组
		let nodeList = [];

		if (orderType == 'FI') {
			if (perssionData.dataMenu['DATA.FI.ORDER_AUDIT_LIST.BG_DATE3'].isSee==true) {
				//审单通过日期
				nodeList.push({
					dateDesc:businessDesc["ORDER_AUDIT_LIST.BG_DATE3"],
					date:orderMsg.ORDER_AUDIT_LIST.BG_DATE3,
					upTime:orderMsg.ORDER_AUDIT_LIST.BG_DATE3_CHAIN_TIME,
					timestamp:timeStrToTimestamp(orderMsg.ORDER_AUDIT_LIST.BG_DATE3_CHAIN_TIME),
					//审单完成人
					detailData:(perssionData.dataMenu['DATA.FI.ORDER_AUDIT_LIST.SD_OP_NAME'].isSee==true)?[{key:businessDesc["ORDER_AUDIT_LIST.SD_OP_NAME"], value:orderMsg.ORDER_AUDIT_LIST.SD_OP_NAME}]:[],
				});
			}
			if (perssionData.dataMenu['DATA.FI.ORDER_AUDIT_LIST.BG_DATE2'].isSee==true) {
				//审单受理日期
				nodeList.push({
					dateDesc:businessDesc["ORDER_AUDIT_LIST.BG_DATE2"],
					date:orderMsg.ORDER_AUDIT_LIST.BG_DATE2,
					upTime:orderMsg.ORDER_AUDIT_LIST.BG_DATE2_CHAIN_TIME,
					timestamp:timeStrToTimestamp(orderMsg.ORDER_AUDIT_LIST.BG_DATE2_CHAIN_TIME),
					//审单接单人
					detailData:(perssionData.dataMenu['DATA.FI.ORDER_AUDIT_LIST.JD_OP_NAME'].isSee==true)?[{key:businessDesc["ORDER_AUDIT_LIST.JD_OP_NAME"], value:orderMsg.ORDER_AUDIT_LIST.JD_OP_NAME}]:[],
				});
			}
			if (perssionData.dataMenu['DATA.FI.ORDER_AUDIT_LIST.BG_DATE1'].isSee==true) {
				//提交审单日期
				nodeList.push({
					dateDesc:businessDesc["ORDER_AUDIT_LIST.BG_DATE1"],
					date:orderMsg.ORDER_AUDIT_LIST.BG_DATE1,
					upTime:orderMsg.ORDER_AUDIT_LIST.BG_DATE1_CHAIN_TIME,
					timestamp:timeStrToTimestamp(orderMsg.ORDER_AUDIT_LIST.BG_DATE1_CHAIN_TIME),
					//提交审单人
					detailData:(perssionData.dataMenu['DATA.FI.ORDER_AUDIT_LIST.TJSD_OP_NAME'].isSee==true)?[{key:businessDesc["ORDER_AUDIT_LIST.TJSD_OP_NAME"], value:orderMsg.ORDER_AUDIT_LIST.TJSD_OP_NAME}]:[],
				});
			}
			if (perssionData.dataMenu['DATA.FI.ORDER_AUDIT_LIST.TGYS_DATE3'].isSee==true) {
				//预审通过日期
				nodeList.push({
					dateDesc:businessDesc["ORDER_AUDIT_LIST.TGYS_DATE3"],
					date:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE3,
					upTime:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE3_CHAIN_TIME,
					timestamp:timeStrToTimestamp(orderMsg.ORDER_AUDIT_LIST.TGYS_DATE3_CHAIN_TIME),
					//审单完成人
					detailData:(perssionData.dataMenu['DATA.FI.ORDER_AUDIT_LIST.SD_OP_NAME'].isSee==true)?[{key:businessDesc["ORDER_AUDIT_LIST.SD_OP_NAME"], value:orderMsg.ORDER_AUDIT_LIST.SD_OP_NAME}]:[],
				});
			}
			if (perssionData.dataMenu['DATA.FI.ORDER_AUDIT_LIST.TGYS_DATE2'].isSee==true) {
				//预审受理日期
				nodeList.push({
					dateDesc:businessDesc["ORDER_AUDIT_LIST.TGYS_DATE2"],
					date:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE2,
					upTime:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE2_CHAIN_TIME,
					timestamp:timeStrToTimestamp(orderMsg.ORDER_AUDIT_LIST.TGYS_DATE2_CHAIN_TIME),
					//审单接单人
					detailData:(perssionData.dataMenu['DATA.FI.ORDER_AUDIT_LIST.JD_OP_NAME'].isSee==true)?[{key:businessDesc["ORDER_AUDIT_LIST.JD_OP_NAME"], value:orderMsg.ORDER_AUDIT_LIST.JD_OP_NAME}]:[],
				});
			}
			if (perssionData.dataMenu['DATA.FI.ORDER_AUDIT_LIST.TGYS_DATE1'].isSee==true) {
				//提交预审日期
				nodeList.push({
					dateDesc:businessDesc["ORDER_AUDIT_LIST.TGYS_DATE1"],
					date:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE1,
					upTime:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE1_CHAIN_TIME,
					timestamp:timeStrToTimestamp(orderMsg.ORDER_AUDIT_LIST.TGYS_DATE1_CHAIN_TIME),
					//提交预审人
					detailData:(perssionData.dataMenu['DATA.FI.ORDER_AUDIT_LIST.TJYS_OP_NAME'].isSee==true)?[{key:businessDesc["ORDER_AUDIT_LIST.TJYS_OP_NAME"], value:orderMsg.ORDER_AUDIT_LIST.TJYS_OP_NAME}]:[],
				});
			}
		} else {
			if (perssionData.dataMenu['DATA.FE.ORDER_AUDIT_LIST.BG_DATE3'].isSee==true) {
				//审单通过日期
				nodeList.push({
					dateDesc:businessDesc["ORDER_AUDIT_LIST.BG_DATE3"],
					date:orderMsg.ORDER_AUDIT_LIST.BG_DATE3,
					upTime:orderMsg.ORDER_AUDIT_LIST.BG_DATE3_CHAIN_TIME,
					timestamp:timeStrToTimestamp(orderMsg.ORDER_AUDIT_LIST.BG_DATE3_CHAIN_TIME),
					//审单完成人
					detailData:(perssionData.dataMenu['DATA.FE.ORDER_AUDIT_LIST.SD_OP_NAME'].isSee==true)?[{key:businessDesc["ORDER_AUDIT_LIST.SD_OP_NAME"], value:orderMsg.ORDER_AUDIT_LIST.SD_OP_NAME}]:[],
				});
			}
			if (perssionData.dataMenu['DATA.FE.ORDER_AUDIT_LIST.BG_DATE2'].isSee==true) {
				//审单受理日期
				nodeList.push({
					dateDesc:businessDesc["ORDER_AUDIT_LIST.BG_DATE2"],
					date:orderMsg.ORDER_AUDIT_LIST.BG_DATE2,
					upTime:orderMsg.ORDER_AUDIT_LIST.BG_DATE2_CHAIN_TIME,
					timestamp:timeStrToTimestamp(orderMsg.ORDER_AUDIT_LIST.BG_DATE2_CHAIN_TIME),
					//审单接单人
					detailData:(perssionData.dataMenu['DATA.FE.ORDER_AUDIT_LIST.JD_OP_NAME'].isSee==true)?[{key:businessDesc["ORDER_AUDIT_LIST.JD_OP_NAME"], value:orderMsg.ORDER_AUDIT_LIST.JD_OP_NAME}]:[],
				});
			}
			if (perssionData.dataMenu['DATA.FE.ORDER_AUDIT_LIST.BG_DATE1'].isSee==true) {
				//提交审单日期
				nodeList.push({
					dateDesc:businessDesc["ORDER_AUDIT_LIST.BG_DATE1"],
					date:orderMsg.ORDER_AUDIT_LIST.BG_DATE1,
					upTime:orderMsg.ORDER_AUDIT_LIST.BG_DATE1_CHAIN_TIME,
					timestamp:timeStrToTimestamp(orderMsg.ORDER_AUDIT_LIST.BG_DATE1_CHAIN_TIME),
					//提交审单人
					detailData:(perssionData.dataMenu['DATA.FE.ORDER_AUDIT_LIST.TJSD_OP_NAME'].isSee==true)?[{key:businessDesc["ORDER_AUDIT_LIST.TJSD_OP_NAME"], value:orderMsg.ORDER_AUDIT_LIST.TJSD_OP_NAME}]:[],
				});
			}
			if (perssionData.dataMenu['DATA.FE.ORDER_AUDIT_LIST.TGYS_DATE3'].isSee==true) {
				//预审通过日期
				nodeList.push({
					dateDesc:businessDesc["ORDER_AUDIT_LIST.TGYS_DATE3"],
					date:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE3,
					upTime:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE3_CHAIN_TIME,
					timestamp:timeStrToTimestamp(orderMsg.ORDER_AUDIT_LIST.TGYS_DATE3_CHAIN_TIME),
					//审单完成人
					detailData:(perssionData.dataMenu['DATA.FE.ORDER_AUDIT_LIST.SD_OP_NAME'].isSee==true)?[{key:businessDesc["ORDER_AUDIT_LIST.SD_OP_NAME"], value:orderMsg.ORDER_AUDIT_LIST.SD_OP_NAME}]:[],
				});
			}
			if (perssionData.dataMenu['DATA.FE.ORDER_AUDIT_LIST.TGYS_DATE2'].isSee==true) {
				//预审受理日期
				nodeList.push({
					dateDesc:businessDesc["ORDER_AUDIT_LIST.TGYS_DATE2"],
					date:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE2,
					upTime:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE2_CHAIN_TIME,
					timestamp:timeStrToTimestamp(orderMsg.ORDER_AUDIT_LIST.TGYS_DATE2_CHAIN_TIME),
					//审单接单人
					detailData:(perssionData.dataMenu['DATA.FE.ORDER_AUDIT_LIST.JD_OP_NAME'].isSee==true)?[{key:businessDesc["ORDER_AUDIT_LIST.JD_OP_NAME"], value:orderMsg.ORDER_AUDIT_LIST.JD_OP_NAME}]:[],
				});
			}
			if (perssionData.dataMenu['DATA.FE.ORDER_AUDIT_LIST.TGYS_DATE1'].isSee==true) {
				//提交预审日期
				nodeList.push({
					dateDesc:businessDesc["ORDER_AUDIT_LIST.TGYS_DATE1"],
					date:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE1,
					upTime:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE1_CHAIN_TIME,
					timestamp:timeStrToTimestamp(orderMsg.ORDER_AUDIT_LIST.TGYS_DATE1_CHAIN_TIME),
					//提交预审人
					detailData:(perssionData.dataMenu['DATA.FE.ORDER_AUDIT_LIST.TJYS_OP_NAME'].isSee==true)?[{key:businessDesc["ORDER_AUDIT_LIST.TJYS_OP_NAME"], value:orderMsg.ORDER_AUDIT_LIST.TJYS_OP_NAME}]:[],
				});
			}
			console.log("nodeList......", nodeList);
		}
		auditRightNodeList.push(nodeList);	
	}

	console.log("auditRightNodeList......", auditRightNodeList);
	
	return auditRightNodeList;
}

/***********************************************************单证文件页面显示数据处理***********************************************************/
//获取文件列表头部显示列表
export function getFileListHeadList(orderType,perssionData) {
	let documentHeader = [];

	if (orderType != 'FE'){//订单进口类型
		//文件类型
		if (perssionData.dataMenu["DATA.FI.ORDER_DOC.DOC_TYPE"].isSee) {
			documentHeader.push({enName: "DOC_TYPE",name:i18n.t('message.businessDetail.fileType')});
		}
		//文件名称
		if (perssionData.dataMenu["DATA.FI.ORDER_DOC.DOC_NAME"].isSee) {
			documentHeader.push({enName: "DOC_NAME",name:i18n.t('message.businessDetail.fileName')});
		}
		//上传日期
		if (perssionData.dataMenu["DATA.FI.ORDER_DOC.DOC_DATE"].isSee) {
			documentHeader.push({enName: "DOC_DATE",name:i18n.t('message.businessDetail.uploadDate')});
		}
		//上传人
		if (perssionData.dataMenu["DATA.FI.ORDER_DOC.UPLOAD_BY"].isSee) {
			documentHeader.push({enName: "UPLOAD_BY",name:i18n.t('message.businessDetail.uploader')});
		}
	} else {
		//文件类型
		if (perssionData.dataMenu['DATA.FE.ORDER_DOC.DOC_TYPE'].isSee) {
			documentHeader.push({enName: "DOC_TYPE",name:i18n.t('message.businessDetail.fileType')});
		}
		//文件名称
		if (perssionData.dataMenu['DATA.FE.ORDER_DOC.DOC_NAME'].isSee) {
			documentHeader.push({enName: "DOC_NAME",name:i18n.t('message.businessDetail.fileName')});
		}
		//上传日期
		if (perssionData.dataMenu['DATA.FE.ORDER_DOC.DOC_DATE'].isSee) {
			documentHeader.push({enName: "DOC_DATE",name:i18n.t('message.businessDetail.uploadDate')});
		}
		//上传人
		if (perssionData.dataMenu['DATA.FE.ORDER_DOC.UPLOAD_BY'].isSee) {
			documentHeader.push({enName: "UPLOAD_BY",name:i18n.t('message.businessDetail.uploader')});
		}
	}

	return documentHeader;
}

/***********************************************************报关单详情页面显示数据处理***********************************************************/
//获取报关单列表是否显示
export function getCustomsListIsShow(orderType,perssionData) {
	let customsHeader = [];

	if (orderType != 'FE'){//订单进口类型
		//报关单号
		if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.CUS_NO"].isSee) {
			customsHeader.push({});
		}
		//品名个数
		if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST'].isSee) {
			customsHeader.push({});
		}
		//件数
		if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.CARGO_NUM'].isSee) {
			customsHeader.push({});
		}
		//数量
		if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.QUANTITY'].isSee) {
			customsHeader.push({});
		}
		//总价/币制
		if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isSee==true || perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isSee==true) {
			customsHeader.push({});
		}
	} else {
		//报关单号
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.CUS_NO'].isSee) {
			customsHeader.push({});
		}
		//品名个数
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST'].isSee) {
			customsHeader.push({});
		}
		//件数
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.CARGO_NUM'].isSee) {
			customsHeader.push({});
		}
		//数量
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.QUANTITY'].isSee) {
			customsHeader.push({});
		}
		//总价/币制
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isSee==true || perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isSee==true) {
			customsHeader.push({});
		}
	}

	if (customsHeader.length>0) {
		return true;
	}

	return false;
}

//获取报关单商品列表是否显示
export function getCustomsGoodListIsShow(orderType,perssionData) {
	let goodListIsShow = false;
	console.log("perssionData......", perssionData);
	if (orderType != 'FE'){//订单进口类型 import_code_72_67
		if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.SEQ_NO'].isSee ||
			perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.HS_CODE'].isSee ||
			perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.GOODS_NAME'].isSee ||
			perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.ELEMENT'].isSee ||
			perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.QUANTITY'].isSee ||
			perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.UNIT_NAME'].isSee ||
			perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.FIRST_QUANTITY'].isSee ||
			perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.FIRST_UM_NAME'].isSee ||
			perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.SECOND_QUANTITY'].isSee ||
			perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.SECOND_UM_NAME'].isSee ||
			perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_PRICE'].isSee ||
			perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isSee ||
			perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isSee ||
			perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.ORIGIN_COUNTRY_NAME'].isSee ||
			perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DEST_COUNTRY_NAME'].isSee ||
			perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DISTRICT_NAME'].isSee ||
			perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.TAX_OPTION_NAME'].isSee ||
			perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST'].isSee) {
			goodListIsShow = true;
		}
	} else {
		if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.SEQ_NO'].isSee ||
			perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.HS_CODE'].isSee ||
			perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.GOODS_NAME'].isSee ||
			perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.ELEMENT'].isSee ||
			perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.QUANTITY'].isSee ||
			perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.UNIT_NAME'].isSee ||
			perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.FIRST_QUANTITY'].isSee ||
			perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.FIRST_UM_NAME'].isSee ||
			perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.SECOND_QUANTITY'].isSee ||
			perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.SECOND_UM_NAME'].isSee ||
			perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_PRICE'].isSee ||
			perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isSee ||
			perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isSee ||
			perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.ORIGIN_COUNTRY_NAME'].isSee ||
			perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DEST_COUNTRY_NAME'].isSee ||
			perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DISTRICT_NAME'].isSee ||
			perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.TAX_OPTION_NAME'].isSee ||
			perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST'].isSee) {
			goodListIsShow = true;
		}
	}

	return goodListIsShow;
}

/***********************************************************完税详情页面显示数据处理***********************************************************/
//获取税款详情顶部显示元素
export function getPayDetailTopShowList(perssionData,taxDetailDialogOptions,taxData) {
	let detailShowList = [];

	//报关单号
	if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.CUS_NO"].isSee) {
		detailShowList.push({name:i18n.t('message.businessDetail.cus_no'),value:(taxDetailDialogOptions?taxDetailDialogOptions.CUS_NO:"")});
	}
	//税单序号
	if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY.DUTY_NO'].isSee) {
		detailShowList.push({name:i18n.t('message.businessDetail.seqOfTaxBill'),value:(taxData?taxData.DUTY_NO:"")});
	}
	//税种
	if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY.DUTY_TYPE'].isSee) {
		detailShowList.push({name:i18n.t('message.businessDetail.taxType'),value:(taxData?taxData.DUTY_TYPE:"")});
	}
	//税款金额
	if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY.DUTY_AMOUNT'].isSee) {
		detailShowList.push({name:i18n.t('message.businessDetail.taxAmount'),value:(taxData?taxData.DUTY_AMOUNT:"")});
	}
	//监管方式
	if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.TRADE_MODE_NAME"].isSee) {
		detailShowList.push({name:i18n.t('message.businessDetail.customsSupervisionMode'),value:(taxDetailDialogOptions?taxDetailDialogOptions.TRADE_MODE_NAME:"")});
	}
	//征免性质
	if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.CUT_NAME"].isSee) {
		detailShowList.push({name:i18n.t('message.businessDetail.dutyLevyExemption'),value:(taxDetailDialogOptions?taxDetailDialogOptions.CUT_NAME:"")});
	}
	//退补税标志
	if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY.B_DUTY_FLAG'].isSee) {
		detailShowList.push({name:i18n.t('message.businessDetail.indicatorOfRefundOverdue'),value:(taxData?taxData.B_DUTY_FLAG:"")});
	}
	//滞报滞纳标志
	if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY.Z_DUTY_FLAG'].isSee) {
		detailShowList.push({name:i18n.t('message.businessDetail.indicatorOfDeclLate'),value:(taxData?taxData.Z_DUTY_FLAG:"")});
	}
	//申报口岸
	if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.CUSTOMS_NAME'].isSee) {
		detailShowList.push({name:i18n.t('message.businessDetail.portOfDeclare'),value:(taxDetailDialogOptions?taxDetailDialogOptions.CUSTOMS_NAME:"")});
	}
	//进出口岸
	if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.ENTY_PORT_NAME"].isSee) {
		detailShowList.push({name:i18n.t('message.businessDetail.portOfIm_Export'),value:(taxDetailDialogOptions?taxDetailDialogOptions.ENTY_PORT_NAME:"")});
	}
	
	return detailShowList;
}

//获取货物信息列表头部显示标题列表
export function getCargoHeaderList(perssionData){
	let cargoHeader = [];

	//税号
	if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY.DECLARATION_DUTY_ITEM_LIST.HS_CODE'].isSee) {
		cargoHeader.push({enName: "HS_CODE",name:i18n.t('message.businessDetail.hsCode')});
	}
	//货名
	if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY.DECLARATION_DUTY_ITEM_LIST.CARGO_NAME'].isSee) {
		cargoHeader.push({enName: "CARGO_NAME",name:i18n.t('message.businessDetail.commodityDesc')});
	}
	//数量
	if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY.DECLARATION_DUTY_ITEM_LIST.QUANTITY'].isSee) {
		cargoHeader.push({enName: "QUANTITY",name:i18n.t('message.businessDetail.quantity')});
	}
	//单位
	if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY.DECLARATION_DUTY_ITEM_LIST.UNIT'].isSee) {
		cargoHeader.push({enName: "UNIT",name:i18n.t('message.businessDetail.unit')});
	}
	//币制
	if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY.DECLARATION_DUTY_ITEM_LIST.CURRENCY'].isSee) {
		cargoHeader.push({enName: "CURRENCY",name:i18n.t('message.businessDetail.currency')});
	}
	//外汇折算率
	if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY.DECLARATION_DUTY_ITEM_LIST.EX_RATE'].isSee) {
		cargoHeader.push({enName: "EX_RATE",name:i18n.t('message.businessDetail.exchangeRate')});
	}
	//完税价格
	if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY.DECLARATION_DUTY_ITEM_LIST.DUTIABLE_VALUE'].isSee) {
		cargoHeader.push({enName: "DUTIABLE_VALUE",name:i18n.t('message.businessDetail.dutiableValue')});
	}
	//从价税率
	if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY.DECLARATION_DUTY_ITEM_LIST.DUTY_RATE'].isSee ) {
		cargoHeader.push({enName: "DUTY_RATE",name:i18n.t('message.businessDetail.importDutyRate')});
	}
	//从量税率
	if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY.DECLARATION_DUTY_ITEM_LIST.VALUE_ADDED_TAX_RATE'].isSee) {
		cargoHeader.push({enName: "VALUE_ADDED_TAX_RATE",name:i18n.t('message.businessDetail.advaloremDutyRate')});
	}
	//税额
	if (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY.DECLARATION_DUTY_ITEM_LIST.VALUE_ADD_TAX'].isSee) {
		cargoHeader.push({enName: "VALUE_ADD_TAX",name:i18n.t('message.businessDetail.valueAddedTax')});
	}

	return cargoHeader;
}