import { isNullData, isJSONStr,isMobile,timeStrToTimestamp} from './util'
/* 国际化 */
import i18n from '@/i18n/i18n'

/**
 * 获取口岸进口订单进度显示文本
 */
export function getStepsShow(nodeName){
    let showName = nodeName;
    switch (nodeName) {
        case "订单":{
            showName = i18n.t('message.businessSearch.order')
        }
            break;
        case "换单":{
            showName = i18n.t('message.businessSearch.changeOrder')
        }
            break;
        case "报关":{
            showName = i18n.t('message.businessSearch.customs')
        }
            break;
        case "辅检":{
            showName = i18n.t('message.businessSearch.auxiliaryInspection')
        }
            break;
        case "运输":{
            showName = i18n.t('message.businessSearch.trans')
        }
            break;
        case "主检":{
            showName = i18n.t('message.businessSearch.mianInspection')
        }
            break;
        default:
            break;
    }
    return showName;
}

/**
 * 获取口岸进口订单进度显示标题
 */
export function getTotalStepsTitle(orderRowData,isNeedNull){
    let titleArray = [];
    //订单 客户委托日期
    if(!isNullData(orderRowData.ACCEPT_DATE) || !isNullData(orderRowData.DZQQ_DATE)){
        titleArray.push(i18n.t('message.businessSearch.order'));
    }
    //换单 头程换单日期
    if(!isNullData(orderRowData.FST_SWITCH_BILL_DATE) || !isNullData(orderRowData.FIN_SWITCH_BILL_DATE)){
        titleArray.push(i18n.t('message.businessSearch.changeOrder'));
    }
    //报关 申报日期
    let isHaveSBDate = false;
    if(orderRowData.DECLARATION_LIST){
        orderRowData.DECLARATION_LIST.forEach(element => {
            if(!isNullData(element.SBDATE)){
                isHaveSBDate = true;
            }
        });
    }
    if(isHaveSBDate==true || !isNullData(orderRowData.BG_DATE) || !isNullData(orderRowData.FX_DATE)){
        titleArray.push(i18n.t('message.businessSearch.customs'));
    }
    
    //运输 运输委托日期
    let isHaveSubDate = false;
    if(orderRowData.ORDER_SERVE_TRANSPORT_LIST){
        //运输委托日期 有值，则认为存在运输业务，显示运输节点
        orderRowData.ORDER_SERVE_TRANSPORT_LIST.forEach(element => {
            if(!isNullData(element.TRANS_SUB_DATE)){
                isHaveSubDate = true;
            }
        });
    }
    if(isHaveSubDate==true || !isNullData(orderRowData.TRANS_DATE)){
        titleArray.push(i18n.t('message.businessSearch.trans'));
    }
    if(isNeedNull==true){
        if(titleArray.length < 4){
            let newArr = titleArray.slice();
            let length = 4-newArr.length;
            for(let i=0; i<length; i++){
                titleArray.push("");
            }
        }
    }

    return titleArray;
}

/**
 * 获取口岸进口订单进度总的显示条数
 */
export function getTotalStepsActive(orderRowData){
    let stepsActive = 0;
    //客户委托日期  单证齐全日期
    if(!isNullData(orderRowData.ACCEPT_DATE) || !isNullData(orderRowData.DZQQ_DATE)){
        stepsActive++;
    }
    //头程换单日期  换单日期
    if(!isNullData(orderRowData.FST_SWITCH_BILL_DATE) || !isNullData(orderRowData.FIN_SWITCH_BILL_DATE)){
        stepsActive++;
    }
    //申报日期 / 结关时间
    let isHaveSBDate = false;
    if(orderRowData.DECLARATION_LIST){
        //申报日期 有值，则认为存在报关，显示报关节点
        orderRowData.DECLARATION_LIST.forEach(element => {
            if(!isNullData(element.SBDATE)){
                isHaveSBDate = true;
            }
        });
    }
    if(isHaveSBDate==true || !isNullData(orderRowData.BG_DATE) || !isNullData(orderRowData.FX_DATE)){
        stepsActive++;
    }
    
    //运输委托日期 / 运输完成时间
    let isHaveSubDate = false;
    if(orderRowData.ORDER_SERVE_TRANSPORT_LIST){
        //运输委托日期 有值，则认为存在运输业务，显示运输节点
        orderRowData.ORDER_SERVE_TRANSPORT_LIST.forEach(element => {
            if(!isNullData(element.TRANS_SUB_DATE)){
                isHaveSubDate = true;
            }
        });
    }
    if(isHaveSubDate==true || !isNullData(orderRowData.TRANS_DATE)){
        stepsActive++;
    }
    // //主检放行日期
    // if(!isNullData(orderRowData.SJ_DATE2)){
    //     stepsActive = 6;
    // }
    return stepsActive;
}

/**
 * 获取口岸进口订单进度蓝色进度显示
 */
export function getStepsActive(orderRowData){
    let totalSteps = 0;
    let stepsActive = 0;
    let isHaveFront = false;
    //客户委托日期  单证齐全日期
    if(!isNullData(orderRowData.ACCEPT_DATE) || !isNullData(orderRowData.DZQQ_DATE)){
        isHaveFront = true;
        if(!isNullData(orderRowData.DZQQ_DATE)){
            stepsActive++;
        }
        totalSteps++;
    }
    //头程换单日期  换单日期
    if(!isNullData(orderRowData.FST_SWITCH_BILL_DATE) || !isNullData(orderRowData.FIN_SWITCH_BILL_DATE)){
        if(!isNullData(orderRowData.FIN_SWITCH_BILL_DATE)){
            stepsActive = totalSteps;
            stepsActive++;
        }
        isHaveFront = true;
        totalSteps++;
    }else{
        isHaveFront = false;
    }
    
    //申报日期 / 结关时间
    let isHaveSBDate = false;
    if(orderRowData.DECLARATION_LIST){
        //申报日期 有值，则认为存在报关，显示报关节点
        orderRowData.DECLARATION_LIST.forEach(element => {
            if(!isNullData(element.SBDATE)){
                isHaveSBDate = true;
            }
        });
    }
    if(isHaveSBDate==true || (!isNullData(orderRowData.BG_DATE) || !isNullData(orderRowData.FX_DATE))){
        if((!isNullData(orderRowData.BG_DATE) || !isNullData(orderRowData.FX_DATE))){
            stepsActive = totalSteps;
            stepsActive++;
        }
        isHaveFront = true;
        totalSteps++;
    }else{
        isHaveFront = false;
    }
    
    //运输委托日期 / 运输完成时间
    let isHaveSubDate = false;
    if(orderRowData.ORDER_SERVE_TRANSPORT_LIST){
        //运输委托日期 有值，则认为存在运输业务，显示运输节点
        orderRowData.ORDER_SERVE_TRANSPORT_LIST.forEach(element => {
            if(!isNullData(element.TRANS_SUB_DATE)){
                isHaveSubDate = true;
            }
        });
    }

    if(isHaveSubDate==true || !isNullData(orderRowData.TRANS_DATE)){
        if(!isNullData(orderRowData.TRANS_DATE)){
            stepsActive = totalSteps;
            stepsActive++;
        }
        isHaveFront = true;
        totalSteps++;
    }
    // //主检放行日期
    // if(!isNullData(orderRowData.SJ_DATE2)){
    //     stepsActive = 6;
    // }
    return stepsActive;
}

/**
 * 获取口岸出口订单进度显示文本
 */
export function getExportStepsShow(nodeName){
    let showName = nodeName;
    switch (nodeName) {
        case "订单":{
            showName = i18n.t('message.businessSearch.order')
        }
            break;
        case "订舱":{
            showName = i18n.t('message.businessSearch.booking')
        }
            break;
        case "报关":{
            showName = i18n.t('message.businessSearch.customs')
        }
            break;
            break;
        case "运输":{
            showName = i18n.t('message.businessSearch.trans')
        }
            break;
        default:
            break;
    }
    return showName;
}

/**
 * 获取口岸出口订单进度总的显示标题
 */
export function getExportStepsTitle(orderRowData,isNeedNull){
    let titleArray = [];
    //订单节点 客户委托日期  单证齐全日期
    if(!isNullData(orderRowData.ACCEPT_DATE) || !isNullData(orderRowData.DZQQ_DATE)){
        titleArray.push(i18n.t('message.businessSearch.order'));
    }
    //订舱节点 订舱日期  提单确认日期
    if(!isNullData(orderRowData.BOOKING_DATE) || !isNullData(orderRowData.BL_CONFIRM_DATE)){
        titleArray.push(i18n.t('message.businessSearch.booking'));
    }
    //报关节点 申报日期 / 结关时间
    let isHaveSBDate = false;
    if(orderRowData.DECLARATION_LIST){
        //申报日期 有值，则认为存在报关，显示报关节点
        orderRowData.DECLARATION_LIST.forEach(element => {
            if(!isNullData(element.SBDATE)){
                isHaveSBDate = true;
            }
        });
    }
    if(isHaveSBDate==true || !isNullData(orderRowData.BG_DATE) || !isNullData(orderRowData.FX_DATE)){
        titleArray.push(i18n.t('message.businessSearch.customs'));
    }
    
    //运输节点  运输委托日期 / 运输完成时间
    let isHaveSubDate = false;
    if(orderRowData.ORDER_SERVE_TRANSPORT_LIST){
        //运输委托日期 有值，则认为存在运输业务，显示运输节点
        orderRowData.ORDER_SERVE_TRANSPORT_LIST.forEach(element => {
            if(!isNullData(element.TRANS_SUB_DATE)){
                isHaveSubDate = true;
            }
        });
    }
    if(isHaveSubDate==true || !isNullData(orderRowData.TRANS_DATE)){
        titleArray.push(i18n.t('message.businessSearch.trans'));
    }

    if(isNeedNull==true){
        if(titleArray.length < 4){
            let newArr = titleArray.slice();
            let length = 4-newArr.length;
            for(let i=0; i<length; i++){
                titleArray.push("");
            }
        }
    }
    
    return titleArray;
}

/**
 * 获取口岸出口订单进度总的显示条数
 */
export function getExportTotalStepsActive(orderRowData){
    let stepsActive = 0;
    //订单节点 客户委托日期  单证齐全日期
    if(!isNullData(orderRowData.ACCEPT_DATE) || !isNullData(orderRowData.DZQQ_DATE)){
        stepsActive++;
    }
    //订舱节点 订舱日期  提单确认日期
    if(!isNullData(orderRowData.BOOKING_DATE) || !isNullData(orderRowData.BL_CONFIRM_DATE)){
        stepsActive++;
    }
    //报关节点 申报日期 / 结关时间
    let isHaveSBDate = false;
    if(orderRowData.DECLARATION_LIST){
        //申报日期 有值，则认为存在报关，显示报关节点
        orderRowData.DECLARATION_LIST.forEach(element => {
            if(!isNullData(element.SBDATE)){
                isHaveSBDate = true;
            }
        });
    }
    if(isHaveSBDate==true || !isNullData(orderRowData.BG_DATE) || !isNullData(orderRowData.FX_DATE)){
        stepsActive++;
    }
    
    //运输节点  运输委托日期 / 运输完成时间
    let isHaveSubDate = false;
    if(orderRowData.ORDER_SERVE_TRANSPORT_LIST){
        //运输委托日期 有值，则认为存在运输业务，显示运输节点
        orderRowData.ORDER_SERVE_TRANSPORT_LIST.forEach(element => {
            if(!isNullData(element.TRANS_SUB_DATE)){
                isHaveSubDate = true;
            }
        });
    }
    if(isHaveSubDate==true || !isNullData(orderRowData.TRANS_DATE)){
        stepsActive++;
    }
    return stepsActive;
}

/**
 * 获取口岸出口订单进度蓝色显示条数
 */
export function getExportStepsActive(orderRowData){
    let totalSteps = 0;

    let stepsActive = 0;

    let isHaveFront = false;
    //订单节点 客户委托日期  单证齐全日期
    if(!isNullData(orderRowData.ACCEPT_DATE) || !isNullData(orderRowData.DZQQ_DATE)){
        isHaveFront = true;
        if(!isNullData(orderRowData.DZQQ_DATE)){
            stepsActive++;
            console.log("出口stepsActive1。。。。",stepsActive);
        }
        totalSteps++;
    }
    //订舱节点 订舱日期  提单确认日期
    if(!isNullData(orderRowData.BOOKING_DATE) || !isNullData(orderRowData.BL_CONFIRM_DATE)){
        
        if(!isNullData(orderRowData.BL_CONFIRM_DATE)){
            stepsActive = totalSteps;
            stepsActive++;
        }
        isHaveFront = true;
        totalSteps++;
        
    }else{
        isHaveFront = false;
    }
    //报关节点 申报日期 / 结关时间
    let isHaveSBDate = false;
    if(orderRowData.DECLARATION_LIST){
        //申报日期 有值，则认为存在报关，显示报关节点
        orderRowData.DECLARATION_LIST.forEach(element => {
            if(!isNullData(element.SBDATE)){
                isHaveSBDate = true;
            }
        });
    }
    if(isHaveSBDate==true || !isNullData(orderRowData.BG_DATE) || !isNullData(orderRowData.FX_DATE)){
        if(!isNullData(orderRowData.BG_DATE) || !isNullData(orderRowData.FX_DATE)){
            stepsActive = totalSteps;
            stepsActive++;
        }
        isHaveFront = true;
        totalSteps++;
    }else{
        isHaveFront = false;
    }
    
    //运输节点  运输委托日期 / 运输完成时间
    let isHaveSubDate = false;
    if(orderRowData.ORDER_SERVE_TRANSPORT_LIST){
        //运输委托日期 有值，则认为存在运输业务，显示运输节点
        orderRowData.ORDER_SERVE_TRANSPORT_LIST.forEach(element => {
            if(!isNullData(element.TRANS_SUB_DATE)){
                isHaveSubDate = true;
            }
        });
    }
    if(isHaveSubDate==true || !isNullData(orderRowData.TRANS_DATE)){
        if(!isNullData(orderRowData.TRANS_DATE)){
            stepsActive = totalSteps;
            stepsActive++;
        }
        totalSteps++;
    }
    console.log("出口stepsActive。。。。",stepsActive);
    return stepsActive;
}

/**
 * 通过列表及列表中的时间字段来获取列表中最近对象信息
 * @param {*} fieldName 
 * @param {*} dataList 
 */
export function getRecentlyDataFromList(fieldName, dataList) {
    // console.log("fieldName...", fieldName);
    // console.log("dataList...", dataList);
    if(!dataList || dataList.length == 0){
        return {};
	}
	let dataNewList = JSON.parse(JSON.stringify(dataList));
    let newList = dataNewList.sort((a,b) => {
        return a[fieldName] < b[fieldName] ? 1 : -1;
    })
    // console.log("newList...",newList);
    return newList[0];
}

/**
 * 获取运输列表中对应运输单号的数据
 * @param {*} transNo 运输单号
 * @param {*} orderMsg 订单信息
 */
export function getTransChildObj(transNo, orderMsg){
    if(orderMsg.ORDER_SERVE_TRANSPORT_LIST && !isNullData(transNo)){
        let transChildObj = {};
        orderMsg.ORDER_SERVE_TRANSPORT_LIST.forEach(element => {
            if(transNo === element.TRACKING_NO){
                transChildObj = JSON.parse(JSON.stringify(element));
            }
        })
        return transChildObj;
    }else{
        return null;
    }
    
}

/**
 * 获取集装箱节点显示数据
 * @param {*} businessDesc  业务字段信息
 * @param {*} contInfo 集装箱信息对象
 * @param {*} transChildObj 单个运输单信息对象
 * @param {*} isYuanChuAcc 是否是元初的客户
 * @param {*} isPickUpDate 是否是要求提货日期
 * @param {*} perssionData 权限数据
 * @param {*} orderType 订单类型
 */
export function getContInfoList(businessDesc, contInfo,transChildObj,isYuanChuAcc,isPickUpDate,perssionData,orderType){
	let contInfoList = [];
	if (orderType == 'FI') {
		if (perssionData.dataMenu["DATA.FI.CONT_INFO_LIST.CONT_NO"].isSee==true) {
			//集装箱号
			contInfoList.push({key:businessDesc["CONT_INFO_LIST.CONT_NO"], value:contInfo.CONT_NO});
		}
		if (perssionData.dataMenu["DATA.FI.CONT_INFO_LIST.CONT_TYPE"].isSee==true) {
			//箱型
			contInfoList.push({key:businessDesc["CONT_INFO_LIST.CONT_TYPE"], value:contInfo.CONT_TYPE});
		}
		if (perssionData.dataMenu["DATA.FI.CONT_INFO_LIST.SEAL_NO"].isSee==true) {
			//封志号
			contInfoList.push({key:businessDesc["CONT_INFO_LIST.SEAL_NO"], value:contInfo.SEAL_NO});
		}
	}else{
		if (perssionData.dataMenu['DATA.FE.CONT_INFO_LIST.CONT_NO'].isSee==true) {
			//集装箱号
			contInfoList.push({key:businessDesc["CONT_INFO_LIST.CONT_NO"], value:contInfo.CONT_NO});
		}
		if (perssionData.dataMenu['DATA.FE.CONT_INFO_LIST.CONT_TYPE'].isSee==true) {
			//箱型
			contInfoList.push({key:businessDesc["CONT_INFO_LIST.CONT_TYPE"], value:contInfo.CONT_TYPE});
		}
		if (perssionData.dataMenu['DATA.FE.CONT_INFO_LIST.SEAL_NO'].isSee==true) {
			//封志号
			contInfoList.push({key:businessDesc["CONT_INFO_LIST.SEAL_NO"], value:contInfo.SEAL_NO});
		}
	}
	

    //如果是要求提货日期
    if(isPickUpDate){
        if(isYuanChuAcc != '1'){
			if (orderType == "FE") { //出口订单
				if (perssionData.dataMenu['DATA.FE.ORDER_SERVE_TRANSPORT_LIST.PLATE_NO'].isSee==true) {
					//车牌号
					contInfoList.push({key:businessDesc["ORDER_SERVE_TRANSPORT_LIST.PLATE_NO"], value:transChildObj.PLATE_NO});
				}
				if (perssionData.dataMenu['DATA.FE.ORDER_SERVE_TRANSPORT_LIST.TRACKING_NO'].isSee==true) {
					//运输单号
					contInfoList.push({key:businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRACKING_NO"], value:transChildObj.TRACKING_NO});
				}
				if (perssionData.dataMenu['DATA.FE.ORDER_SERVE_TRANSPORT_LIST.CARRIER_TEL'].isSee==true) {
					//驾驶员手机号
					contInfoList.push({key:businessDesc["ORDER_SERVE_TRANSPORT_LIST.CARRIER_TEL"], value:transChildObj.CARRIER_TEL});
				}
				if (perssionData.dataMenu['DATA.FE.ORDER_SERVE_TRANSPORT_LIST.CARRIER_DRIVER'].isSee==true) {
					//驾驶员姓名
					contInfoList.push({key:businessDesc["ORDER_SERVE_TRANSPORT_LIST.CARRIER_DRIVER"], value:transChildObj.CARRIER_DRIVER});
				}
			} else { //进口订单
				if (perssionData.dataMenu["DATA.FI.ORDER_SERVE_TRANSPORT_LIST.PLATE_NO"].isSee==true) {
					//车牌号
					contInfoList.push({key:businessDesc["ORDER_SERVE_TRANSPORT_LIST.PLATE_NO"], value:transChildObj.PLATE_NO});
				}
				if (perssionData.dataMenu["DATA.FI.ORDER_SERVE_TRANSPORT_LIST.TRACKING_NO"].isSee==true) {
					//运输单号
					contInfoList.push({key:businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRACKING_NO"], value:transChildObj.TRACKING_NO});
				}
				if (perssionData.dataMenu["DATA.FI.ORDER_SERVE_TRANSPORT_LIST.CARRIER_TEL"].isSee==true) {
					//驾驶员手机号
					contInfoList.push({key:businessDesc["ORDER_SERVE_TRANSPORT_LIST.CARRIER_TEL"], value:transChildObj.CARRIER_TEL});
				}
				if (perssionData.dataMenu["DATA.FI.ORDER_SERVE_TRANSPORT_LIST.CARRIER_DRIVER"].isSee==true) {
					//驾驶员姓名
					contInfoList.push({key:businessDesc["ORDER_SERVE_TRANSPORT_LIST.CARRIER_DRIVER"], value:transChildObj.CARRIER_DRIVER});
				}
			}
        }
    }

    return contInfoList;
}

/**
 * 获取运输阶段节点显示数据
 * @param {*} businessDesc 业务字段
 * @param {*} orderMsg 订单信息
 * @param {*} isYuanChuAcc 是否是元初的客户
 * @param {*} orderType 口岸进出口订单类型 //"FI"进口:"FE"出口
 * @param {*} perssionData 权限数据
 */
export function getTransDataList(businessDesc, orderMsg,isYuanChuAcc,orderType,perssionData) {
    let nodeRightList = [];
    //整拼类型
    let tradeContType = orderMsg.TRADE_CONT_TYPE;
    console.log("tradeContType...",tradeContType);

    if(orderType == 'FE'){ //订单出口类型
        if(tradeContType == "FCL"){
            //FCL模式下，展示列表是以集装箱列表作为展示项
            if(orderMsg.CONT_INFO_LIST){
                orderMsg.CONT_INFO_LIST.forEach(element => {
                    let nodeList = [];
                    let transChildObj = getTransChildObj(element.TRACKING_NO, orderMsg);
                    console.log("transChildObj...",transChildObj);
                    if(transChildObj){
                        //入港日期
                        // nodeList.push({
                        //     dateDesc:"入港日期",
                        //     date:"",
                        //     upTime:"",
                        //     timestamp:"",
                        //     detailData:getContInfoList(businessDesc, element,transChildObj,isYuanChuAcc,false),
						// });
						if (perssionData.dataMenu['DATA.FE.ORDER_SERVE_TRANSPORT_LIST.DELIVERY_DATE'].isSee==true) {
							//要求送达日期
							nodeList.push({
								dateDesc:businessDesc["ORDER_SERVE_TRANSPORT_LIST.DELIVERY_DATE"],
								date:transChildObj.DELIVERY_DATE,
								upTime:transChildObj.DELIVERY_DATE_CHAIN_TIME,
								timestamp:timeStrToTimestamp(transChildObj.DELIVERY_DATE_CHAIN_TIME),
								detailData:getContInfoList(businessDesc, element,transChildObj,isYuanChuAcc,false,perssionData,orderType),
							});
						}
                        if (perssionData.dataMenu['DATA.FE.ORDER_SERVE_TRANSPORT_LIST.TRANS_FIN_DATE'].isSee==true) {
							//实际送达日期
							nodeList.push({
								dateDesc:businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_FIN_DATE"],
								date:transChildObj.TRANS_FIN_DATE,
								upTime:transChildObj.TRANS_FIN_DATE_CHAIN_TIME,
								timestamp:timeStrToTimestamp(transChildObj.TRANS_FIN_DATE_CHAIN_TIME),
								detailData:getContInfoList(businessDesc, element,transChildObj,isYuanChuAcc,false,perssionData,orderType),
							});
						}
                        if (perssionData.dataMenu['DATA.FE.CONT_INFO_LIST.TX_DATE'].isSee==true) {
							//提箱日期
							nodeList.push({
								dateDesc:businessDesc["CONT_INFO_LIST.TX_DATE"],
								date:element.TX_DATE,
								upTime:element.TX_DATE_CHAIN_TIME,
								timestamp:timeStrToTimestamp(element.TX_DATE_CHAIN_TIME),
								detailData:getContInfoList(businessDesc, element,transChildObj,isYuanChuAcc,false,perssionData,orderType),
							});
						}
                        if (perssionData.dataMenu['DATA.FE.ORDER_SERVE_TRANSPORT_LIST.PICK_UP_DATE'].isSee==true) {
							//要求提货日期
							nodeList.push({
								dateDesc:businessDesc["ORDER_SERVE_TRANSPORT_LIST.PICK_UP_DATE"],
								date:transChildObj.PICK_UP_DATE,
								upTime:transChildObj.PICK_UP_DATE_CHAIN_TIME,
								timestamp:timeStrToTimestamp(transChildObj.PICK_UP_DATE_CHAIN_TIME),
								detailData:getContInfoList(businessDesc, element,transChildObj,isYuanChuAcc,true,perssionData,orderType),
							});
						}
                        if (perssionData.dataMenu['DATA.FE.ORDER_SERVE_TRANSPORT_LIST.TRANS_START_DATE'].isSee==true) {
							//实际提货日期
							nodeList.push({
								dateDesc:businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_START_DATE"],
								date:transChildObj.TRANS_START_DATE,
								upTime:transChildObj.TRANS_START_DATE_CHAIN_TIME,
								timestamp:timeStrToTimestamp(transChildObj.TRANS_START_DATE_CHAIN_TIME),
								detailData:getContInfoList(businessDesc, element,transChildObj,isYuanChuAcc,false,perssionData,orderType),
							});
						}

                        nodeRightList.push(nodeList);
                    }
                    
                });
            }
        }else{ // if(tradeContType == "LCL")
            //LCL模式下，展示列表是以运输列表作为展示项
            if(orderMsg.ORDER_SERVE_TRANSPORT_LIST){
                orderMsg.ORDER_SERVE_TRANSPORT_LIST.forEach(element => {
                    let nodeList = [];
					if (perssionData.dataMenu['DATA.FE.ORDER_SERVE_TRANSPORT_LIST.DELIVERY_DATE'].isSee==true) {
						//要求送达日期
						nodeList.push({
							dateDesc:businessDesc["ORDER_SERVE_TRANSPORT_LIST.DELIVERY_DATE"],
							date:element.DELIVERY_DATE,
							upTime:element.DELIVERY_DATE_CHAIN_TIME,
							timestamp:timeStrToTimestamp(element.DELIVERY_DATE_CHAIN_TIME),
						});
					}
                    if (perssionData.dataMenu['DATA.FE.ORDER_SERVE_TRANSPORT_LIST.TRANS_FIN_DATE'].isSee==true) {
						//实际送达日期
						nodeList.push({
							dateDesc:businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_FIN_DATE"],
							date:element.TRANS_FIN_DATE,
							upTime:element.TRANS_FIN_DATE_CHAIN_TIME,
							timestamp:timeStrToTimestamp(element.TRANS_FIN_DATE_CHAIN_TIME),
						});
					}
                    
                    if(isYuanChuAcc == '1'){
						if (perssionData.dataMenu['DATA.FE.ORDER_SERVE_TRANSPORT_LIST.PICK_UP_DATE'].isSee==true) {
							//要求提货日期
							nodeList.push({
								dateDesc:businessDesc["ORDER_SERVE_TRANSPORT_LIST.PICK_UP_DATE"],
								date:element.PICK_UP_DATE,
								upTime:element.PICK_UP_DATE_CHAIN_TIME,
								timestamp:timeStrToTimestamp(element.PICK_UP_DATE_CHAIN_TIME),
							});
						}
                    }else{
						if (perssionData.dataMenu['DATA.FE.ORDER_SERVE_TRANSPORT_LIST.PICK_UP_DATE'].isSee==true) {
							let detail = [];
							if (perssionData.dataMenu['DATA.FE.ORDER_SERVE_TRANSPORT_LIST.TRACKING_NO'].isSee==true) {
								//运输单号
								detail.push({key:businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRACKING_NO"], value:element.TRACKING_NO});
							}
							if (perssionData.dataMenu['DATA.FE.ORDER_SERVE_TRANSPORT_LIST.PLATE_NO'].isSee==true) {
								//车牌号
								detail.push({key:businessDesc["ORDER_SERVE_TRANSPORT_LIST.PLATE_NO"], value:element.PLATE_NO});
							}
							if (perssionData.dataMenu['DATA.FE.ORDER_SERVE_TRANSPORT_LIST.CARRIER_TEL'].isSee==true) {
								//驾驶员手机号
								detail.push({key:businessDesc["ORDER_SERVE_TRANSPORT_LIST.CARRIER_TEL"], value:element.CARRIER_TEL});
							}
							if (perssionData.dataMenu['DATA.FE.ORDER_SERVE_TRANSPORT_LIST.CARRIER_DRIVER'].isSee==true) {
								//驾驶员姓名
								detail.push({key:businessDesc["ORDER_SERVE_TRANSPORT_LIST.CARRIER_DRIVER"], value:element.CARRIER_DRIVER});
							}
							//要求提货日期
							nodeList.push({
								dateDesc:businessDesc["ORDER_SERVE_TRANSPORT_LIST.PICK_UP_DATE"],
								date:element.PICK_UP_DATE,
								upTime:element.PICK_UP_DATE_CHAIN_TIME,
								timestamp:timeStrToTimestamp(element.PICK_UP_DATE_CHAIN_TIME),
								detailData:detail
							});
						}
                    }
                    if (perssionData.dataMenu['DATA.FE.ORDER_SERVE_TRANSPORT_LIST.TRANS_START_DATE'].isSee==true) {
						//实际提货日期
						nodeList.push({
							dateDesc:businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_START_DATE"],
							date:element.TRANS_START_DATE,
							upTime:element.TRANS_START_DATE_CHAIN_TIME,
							timestamp:timeStrToTimestamp(element.TRANS_START_DATE_CHAIN_TIME),
						});	
					}

                    nodeRightList.push(nodeList);
                });
            }
        }
        
        if(isYuanChuAcc != '1'){
            let nodeList = [];
            //获取最晚实际送达日期数据
			let transObj = getRecentlyDataFromList('TRANS_FIN_DATE',orderMsg.ORDER_SERVE_TRANSPORT_LIST);
			if (perssionData.dataMenu['DATA.FE.ORDER_SERVE_TRANSPORT_LIST.TRANS_SUB_DATE'].isSee==true) {
				let detail = [];
				if (perssionData.dataMenu['DATA.FE.ORDER_SERVE_TRANSPORT_LIST.CARRIER_CN'].isSee==true) {
					//运输公司
					detail.push({key:businessDesc["ORDER_SERVE_TRANSPORT_LIST.CARRIER_CN"], value:transObj.CARRIER_CN});
				}
				//运输委托日期
				nodeList.push({
					dateDesc:businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_SUB_DATE"],
					date:transObj.TRANS_SUB_DATE,
					upTime:transObj.TRANS_SUB_DATE_CHAIN_TIME,
					timestamp:timeStrToTimestamp(transObj.TRANS_SUB_DATE_CHAIN_TIME),
					detailData:detail
				});
				nodeRightList.push(nodeList);
			}
        }
    }else{
        if(tradeContType == "FCL"){
            //FCL模式下，展示列表是以集装箱列表作为展示项
            if(orderMsg.CONT_INFO_LIST){
                orderMsg.CONT_INFO_LIST.forEach(element => {
                    let nodeList = [];
                    let transChildObj = getTransChildObj(element.TRACKING_NO, orderMsg);
                    console.log("transChildObj...",transChildObj);
                    if(transChildObj){
						if (perssionData.dataMenu["DATA.FI.CONT_INFO_LIST.HX_DATE"].isSee==true) {
							//还箱日期
							nodeList.push({
								dateDesc:businessDesc["CONT_INFO_LIST.HX_DATE"],
								date:element.HX_DATE,
								upTime:element.HX_DATE_CHAIN_TIME,
								timestamp:timeStrToTimestamp(element.HX_DATE_CHAIN_TIME),
								detailData:getContInfoList(businessDesc, element,transChildObj,isYuanChuAcc,false,perssionData,orderType),
							});
						}
                        if (perssionData.dataMenu["DATA.FI.ORDER_SERVE_TRANSPORT_LIST.DELIVERY_DATE"].isSee==true) {
							//要求送达日期
							nodeList.push({
								dateDesc:businessDesc["ORDER_SERVE_TRANSPORT_LIST.DELIVERY_DATE"],
								date:transChildObj.DELIVERY_DATE,
								upTime:transChildObj.DELIVERY_DATE_CHAIN_TIME,
								timestamp:timeStrToTimestamp(transChildObj.DELIVERY_DATE_CHAIN_TIME),
								detailData:getContInfoList(businessDesc, element,transChildObj,isYuanChuAcc,false,perssionData,orderType),
							});
						}
                        if (perssionData.dataMenu["DATA.FI.ORDER_SERVE_TRANSPORT_LIST.TRANS_FIN_DATE"].isSee==true) {
							//实际送达日期
							nodeList.push({
								dateDesc:businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_FIN_DATE"],
								date:transChildObj.TRANS_FIN_DATE,
								upTime:transChildObj.TRANS_FIN_DATE_CHAIN_TIME,
								timestamp:timeStrToTimestamp(transChildObj.TRANS_FIN_DATE_CHAIN_TIME),
								detailData:getContInfoList(businessDesc, element,transChildObj,isYuanChuAcc,false,perssionData,orderType),
							});
						}
                        if (perssionData.dataMenu["DATA.FI.CONT_INFO_LIST.TX_DATE"].isSee==true) {
							//提箱日期
							nodeList.push({
								dateDesc:businessDesc["CONT_INFO_LIST.TX_DATE"],
								date:element.TX_DATE,
								upTime:element.TX_DATE_CHAIN_TIME,
								timestamp:timeStrToTimestamp(element.TX_DATE_CHAIN_TIME),
								detailData:getContInfoList(businessDesc, element,transChildObj,isYuanChuAcc,false,perssionData,orderType),
							});
						}
                        if (perssionData.dataMenu["DATA.FI.ORDER_SERVE_TRANSPORT_LIST.PICK_UP_DATE"].isSee==true) {
							//要求提货日期
							nodeList.push({
								dateDesc:businessDesc["ORDER_SERVE_TRANSPORT_LIST.PICK_UP_DATE"],
								date:transChildObj.PICK_UP_DATE,
								upTime:transChildObj.PICK_UP_DATE_CHAIN_TIME,
								timestamp:timeStrToTimestamp(transChildObj.PICK_UP_DATE_CHAIN_TIME),
								detailData:getContInfoList(businessDesc, element,transChildObj,isYuanChuAcc,true,perssionData,orderType),
							});
						}
                        if (perssionData.dataMenu["DATA.FI.ORDER_SERVE_TRANSPORT_LIST.TRANS_START_DATE"].isSee==true) {
							//实际提货日期
							nodeList.push({
								dateDesc:businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_START_DATE"],
								date:transChildObj.TRANS_START_DATE,
								upTime:transChildObj.TRANS_START_DATE_CHAIN_TIME,
								timestamp:timeStrToTimestamp(transChildObj.TRANS_START_DATE_CHAIN_TIME),
								detailData:getContInfoList(businessDesc, element,transChildObj,isYuanChuAcc,false,perssionData,orderType),
							});
						}
                        
                        nodeRightList.push(nodeList);
                    }
                });
            }
        }else{ // if(tradeContType == "LCL")
            //LCL模式下，展示列表是以运输列表作为展示项
            if(orderMsg.ORDER_SERVE_TRANSPORT_LIST){
                orderMsg.ORDER_SERVE_TRANSPORT_LIST.forEach(element => {
                    let nodeList = [];
					if (perssionData.dataMenu["DATA.FI.ORDER_SERVE_TRANSPORT_LIST.DELIVERY_DATE"].isSee==true) {
						//要求送达日期
						nodeList.push({
							dateDesc:businessDesc["ORDER_SERVE_TRANSPORT_LIST.DELIVERY_DATE"],
							date:element.DELIVERY_DATE,
							upTime:element.DELIVERY_DATE_CHAIN_TIME,
							timestamp:timeStrToTimestamp(element.DELIVERY_DATE_CHAIN_TIME),
						});
					}
                    if (perssionData.dataMenu["DATA.FI.ORDER_SERVE_TRANSPORT_LIST.TRANS_FIN_DATE"].isSee==true) {
						//实际送达日期
						nodeList.push({
							dateDesc:businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_FIN_DATE"],
							date:element.TRANS_FIN_DATE,
							upTime:element.TRANS_FIN_DATE_CHAIN_TIME,
							timestamp:timeStrToTimestamp(element.TRANS_FIN_DATE_CHAIN_TIME),
						});
					}
                    
                    if(isYuanChuAcc == '1'){
						if (perssionData.dataMenu["DATA.FI.ORDER_SERVE_TRANSPORT_LIST.PICK_UP_DATE"].isSee==true) {
							//要求提货日期
							nodeList.push({
								dateDesc:businessDesc["ORDER_SERVE_TRANSPORT_LIST.PICK_UP_DATE"],
								date:element.PICK_UP_DATE,
								upTime:element.PICK_UP_DATE_CHAIN_TIME,
								timestamp:timeStrToTimestamp(element.PICK_UP_DATE_CHAIN_TIME),
							});
						}
                    }else{
						if (perssionData.dataMenu["DATA.FI.ORDER_SERVE_TRANSPORT_LIST.PICK_UP_DATE"].isSee==true) {
							let detail = [];
							if (perssionData.dataMenu["DATA.FI.ORDER_SERVE_TRANSPORT_LIST.TRACKING_NO"].isSee==true) {
								//运输单号
								detail.push({key:businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRACKING_NO"], value:element.TRACKING_NO});
							}
							if (perssionData.dataMenu["DATA.FI.ORDER_SERVE_TRANSPORT_LIST.PLATE_NO"].isSee==true) {
								//车牌号
								detail.push({key:businessDesc["ORDER_SERVE_TRANSPORT_LIST.PLATE_NO"], value:element.PLATE_NO});
							}
							if (perssionData.dataMenu["DATA.FI.ORDER_SERVE_TRANSPORT_LIST.CARRIER_TEL"].isSee==true) {
								//驾驶员手机号
								detail.push({key:businessDesc["ORDER_SERVE_TRANSPORT_LIST.CARRIER_TEL"], value:element.CARRIER_TEL});
							}
							if (perssionData.dataMenu["DATA.FI.ORDER_SERVE_TRANSPORT_LIST.CARRIER_DRIVER"].isSee==true) {
								//驾驶员姓名
								detail.push({key:businessDesc["ORDER_SERVE_TRANSPORT_LIST.CARRIER_DRIVER"], value:element.CARRIER_DRIVER});
							}
							//要求提货日期
							nodeList.push({
								dateDesc:businessDesc["ORDER_SERVE_TRANSPORT_LIST.PICK_UP_DATE"],
								date:element.PICK_UP_DATE,
								upTime:element.PICK_UP_DATE_CHAIN_TIME,
								timestamp:timeStrToTimestamp(element.PICK_UP_DATE_CHAIN_TIME),
								detailData:detail
							});
						}
                    }
					if (perssionData.dataMenu["DATA.FI.ORDER_SERVE_TRANSPORT_LIST.TRANS_START_DATE"].isSee==true) {
						//实际提货日期
						nodeList.push({
							dateDesc:businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_START_DATE"],
							date:element.TRANS_START_DATE,
							upTime:element.TRANS_START_DATE_CHAIN_TIME,
							timestamp:timeStrToTimestamp(element.TRANS_START_DATE_CHAIN_TIME),
						});
					}
                    
                    nodeRightList.push(nodeList);
                });
            }
        }
        
        if(isYuanChuAcc != '1'){
            let nodeList = [];
            //获取最晚实际送达日期数据
			let transObj = getRecentlyDataFromList('TRANS_FIN_DATE',orderMsg.ORDER_SERVE_TRANSPORT_LIST);
			if (perssionData.dataMenu["DATA.FI.ORDER_SERVE_TRANSPORT_LIST.TRANS_SUB_DATE"].isSee==true) {
				let detail = [];
				if (perssionData.dataMenu["DATA.FI.ORDER_SERVE_TRANSPORT_LIST.CARRIER_CN"].isSee==true) {
					//运输公司
					detail.push({key:businessDesc["ORDER_SERVE_TRANSPORT_LIST.CARRIER_CN"], value:transObj.CARRIER_CN});
				}
				//运输委托日期
				nodeList.push({
					dateDesc:businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_SUB_DATE"],
					date:transObj.TRANS_SUB_DATE,
					upTime:transObj.TRANS_SUB_DATE_CHAIN_TIME,
					timestamp:timeStrToTimestamp(transObj.TRANS_SUB_DATE_CHAIN_TIME),
					detailData:detail
				});
				nodeRightList.push(nodeList);
			}
        }
	}
	
    return nodeRightList;
}

//获取固定节点：抵运国、抵运港，显示预计、实际到港日
export function getPodPortNode(orderType,orderNewMsg,businessDesc,perssionData){
	let diyunObj = {};
	diyunObj.isHideColon = true;

	let pod_country = orderNewMsg.POD_COUNTRY?orderNewMsg.POD_COUNTRY:businessDesc.POD_COUNTRY;
	let pod_name = orderNewMsg.POD_NAME?orderNewMsg.POD_NAME:businessDesc.POD_NAME;
	
	if (orderType == 'FI') { //进口
		//抵运国、抵运港显示处理
		if (perssionData.dataMenu["DATA.FI.POD_COUNTRY"].isSee==true && perssionData.dataMenu["DATA.FI.POD_NAME"].isSee==true) {
			diyunObj.nodeName = pod_country+"/"+pod_name;
		} else if(perssionData.dataMenu["DATA.FI.POD_COUNTRY"].isSee==true && perssionData.dataMenu["DATA.FI.POD_NAME"].isSee==false) {
			diyunObj.nodeName = pod_country;
		} else if(perssionData.dataMenu["DATA.FI.POD_COUNTRY"].isSee==false && perssionData.dataMenu["DATA.FI.POD_NAME"].isSee==true) {
			diyunObj.nodeName = pod_name;
		} else {
			diyunObj.nodeName = "";
		}
		if (perssionData.dataMenu["DATA.FI.ATA"].isSee==true) {
			diyunObj.nodeDetail = [{key:businessDesc.ATA, value:orderNewMsg.ATA}];
		}else{
			diyunObj.nodeDetail = [];
		}

		let list = [];
		if (perssionData.dataMenu["DATA.FI.ETA"].isSee==true) {
			list.push({
				dateDesc:businessDesc.ETA,
				date:orderNewMsg.ETA,
				upTime:orderNewMsg.ETA_CHAIN_TIME,
				timestamp:timeStrToTimestamp(orderNewMsg.ETA_CHAIN_TIME),
			});
		}
		if (perssionData.dataMenu["DATA.FI.ATA"].isSee==true) {
			list.push({
				dateDesc:businessDesc.ATA,
				date:orderNewMsg.ATA,
				upTime:orderNewMsg.ATA_CHAIN_TIME,
				timestamp:timeStrToTimestamp(orderNewMsg.ATA_CHAIN_TIME),
			});
		}
		diyunObj.nodeList = [list];
	} else {
		//抵运国、抵运港显示处理
		if (perssionData.dataMenu['DATA.FE.POD_COUNTRY'].isSee==true && perssionData.dataMenu['DATA.FE.POD_NAME'].isSee==true) {
			diyunObj.nodeName = pod_country+"/"+pod_name;
		} else if(perssionData.dataMenu['DATA.FE.POD_COUNTRY'].isSee==true && perssionData.dataMenu['DATA.FE.POD_NAME'].isSee==false) {
			diyunObj.nodeName = pod_country;
		} else if(perssionData.dataMenu['DATA.FE.POD_COUNTRY'].isSee==false && perssionData.dataMenu['DATA.FE.POD_NAME'].isSee==true) {
			diyunObj.nodeName = pod_name;
		} else {
			diyunObj.nodeName = "";
		}
		if (perssionData.dataMenu['DATA.FE.ATA'].isSee==true) {
			diyunObj.nodeDetail = [{key:businessDesc.ATA, value:orderNewMsg.ATA}];
		}else{
			diyunObj.nodeDetail = [];
		}

		let list = [];
		if (perssionData.dataMenu['DATA.FE.ETA'].isSee==true) {
			list.push({
				dateDesc:businessDesc.ETA,
				date:orderNewMsg.ETA,
				upTime:orderNewMsg.ETA_CHAIN_TIME,
				timestamp:timeStrToTimestamp(orderNewMsg.ETA_CHAIN_TIME),
			});
		}
		if (perssionData.dataMenu['DATA.FE.ATA'].isSee==true) {
			list.push({
				dateDesc:businessDesc.ATA,
				date:orderNewMsg.ATA,
				upTime:orderNewMsg.ATA_CHAIN_TIME,
				timestamp:timeStrToTimestamp(orderNewMsg.ATA_CHAIN_TIME),
			});
		}
		diyunObj.nodeList = [list];
	}
	if (diyunObj.nodeName=="") {// && diyunObj.nodeList[0].length==0
		return null;
	}
	return diyunObj;
}

//获取固定节点：启运国、启运港，显示预计、实际离港日
export function getPolPortNode(orderType,orderNewMsg,businessDesc,perssionData){
	let qiyunObj = {};

	qiyunObj.isHideColon = true;

	let pol_country = orderNewMsg.POL_COUNTRY?orderNewMsg.POL_COUNTRY:businessDesc.POL_COUNTRY;
	let pol_name = orderNewMsg.POL_NAME?orderNewMsg.POL_NAME:businessDesc.POL_NAME;
	
	if (orderType == 'FI') { //进口
		//抵运国、抵运港显示处理
		if (perssionData.dataMenu["DATA.FI.POL_COUNTRY"].isSee==true && perssionData.dataMenu["DATA.FI.POL_NAME"].isSee==true) {
			qiyunObj.nodeName = pol_country+"/"+pol_name;
		} else if(perssionData.dataMenu["DATA.FI.POL_COUNTRY"].isSee==true && perssionData.dataMenu["DATA.FI.POL_NAME"].isSee==false) {
			qiyunObj.nodeName = pol_country;
		} else if(perssionData.dataMenu["DATA.FI.POL_COUNTRY"].isSee==false && perssionData.dataMenu["DATA.FI.POL_NAME"].isSee==true) {
			qiyunObj.nodeName = pol_name;
		} else {
			qiyunObj.nodeName = "";
		}
		if (perssionData.dataMenu["DATA.FI.ATD"].isSee==true) {
			qiyunObj.nodeDetail = [{key:businessDesc.ATD, value:orderNewMsg.ATD}];
		}else{
			qiyunObj.nodeDetail = [];
		}

		let list = [];
		if (perssionData.dataMenu["DATA.FI.ETD"].isSee==true) {
			list.push({
				dateDesc:businessDesc.ETD,
				date:orderNewMsg.ETD,
				upTime:orderNewMsg.ETD_CHAIN_TIME,
				timestamp:timeStrToTimestamp(orderNewMsg.ETD_CHAIN_TIME),
			});
		}
		if (perssionData.dataMenu["DATA.FI.ATD"].isSee==true) {
			list.push({
				dateDesc:businessDesc.ATD,
				date:orderNewMsg.ATD,
				upTime:orderNewMsg.ATD_CHAIN_TIME,
				timestamp:timeStrToTimestamp(orderNewMsg.ATD_CHAIN_TIME),
			});
		}
		qiyunObj.nodeList = [list];
	} else {
		//抵运国、抵运港显示处理
		if (perssionData.dataMenu['DATA.FE.POL_COUNTRY'].isSee==true && perssionData.dataMenu['DATA.FE.POL_NAME'].isSee==true) {
			qiyunObj.nodeName = pol_country+"/"+pol_name;
		} else if(perssionData.dataMenu['DATA.FE.POL_COUNTRY'].isSee==true && perssionData.dataMenu['DATA.FE.POL_NAME'].isSee==false) {
			qiyunObj.nodeName = pol_country;
		} else if(perssionData.dataMenu['DATA.FE.POL_COUNTRY'].isSee==false && perssionData.dataMenu['DATA.FE.POL_NAME'].isSee==true) {
			qiyunObj.nodeName = pol_name;
		} else {
			qiyunObj.nodeName = "";
		}
		if (perssionData.dataMenu['DATA.FE.ATD'].isSee==true) {
			qiyunObj.nodeDetail = [{key:businessDesc.ATD, value:orderNewMsg.ATD}];
		}else{
			qiyunObj.nodeDetail = [];
		}

		let list = [];
		if (perssionData.dataMenu['DATA.FE.ETD'].isSee==true) {
			list.push({
				dateDesc:businessDesc.ETD,
				date:orderNewMsg.ETD,
				upTime:orderNewMsg.ETD_CHAIN_TIME,
				timestamp:timeStrToTimestamp(orderNewMsg.ETD_CHAIN_TIME),
			});
		}
		if (perssionData.dataMenu['DATA.FE.ATD'].isSee==true) {
			list.push({
				dateDesc:businessDesc.ATD,
				date:orderNewMsg.ATD,
				upTime:orderNewMsg.ATD_CHAIN_TIME,
				timestamp:timeStrToTimestamp(orderNewMsg.ATD_CHAIN_TIME),
			});
		}
		qiyunObj.nodeList = [list];
	}
	if (qiyunObj.nodeName=="") {// && qiyunObj.nodeList[0].length==0
		return null;
	}

	return qiyunObj;
}

/**
 * 获取所有事件节点数组
 * @param {*} businessDesc 业务字段
 * @param {*} orderMsg 订单信息
 * @param {*} isYuanChuAcc 是否是元初的客户
 * @param {*} orderType 口岸进出口订单类型 //"FI"进口:"FE"出口
 */
export function getAllEventList(businessDesc, orderMsg,isYuanChuAcc,orderType){
	let perssionData = JSON.parse(localStorage.getItem("MenuDataCode"));

    if(orderType != 'FE'){ //订单进口类型
        let stepsActive = getTotalStepsActive(orderMsg);
        // let allNodeList = [/*"主检",*/"运输",/*"辅检",*/"报关","换单","订单"];
        let allNodeList = getTotalStepsTitle(orderMsg,false);
        allNodeList.reverse();
        //根据进度数，得出显示流程进度节点名称数组
        let length = allNodeList.length;
        allNodeList.splice(0,length-stepsActive);

        let allEventList = [];
        //根据动态节点名称数组，插入对应节点数据
        for (let index = 0; index < allNodeList.length; index++) {
            let element = allNodeList[index];
            let nodeArr = getAllEventRightData(element,businessDesc,orderMsg,isYuanChuAcc,perssionData);
            allEventList.push(...nodeArr);
		}
		
		/***************************************************单证文件显示数据写入***************************************************/
		if (perssionData && perssionData.funcMenu["FUNC.FUNC.CODE_03.CODE_01.CODE_01.CODE_05"].isSee==true) {
			if(orderMsg.ORDER_DOC) {
				orderMsg.ORDER_DOC.forEach(element => {
					if (perssionData.dataMenu["DATA.FI.ORDER_DOC.DOC_DATE"].isSee==true) {
						let detail = [];
						if (perssionData.dataMenu["DATA.FI.ORDER_DOC.DOC_TYPE"].isSee==true) {
							detail.push({key:i18n.t('message.businessDetail.fileType'), value:element.DOC_TYPE});
						}
						if (perssionData.dataMenu["DATA.FI.ORDER_DOC.DOC_NAME"].isSee==true) {
							detail.push({key:i18n.t('message.businessDetail.fileName'), value:element.DOC_NAME});
						}
						//单证文件
						allEventList.push({
							dateDesc:i18n.t('message.businessDetail.documentFile'),
							date:element.DOC_DATE,
							upTime:element.DOC_CHAIN_TIME,
							timestamp:timeStrToTimestamp(element.DOC_CHAIN_TIME),
							detailData:detail,
						});
					}
				});
			}
		}
		
		/***************************************************复核纠错模块数据写入***************************************************/
		if (perssionData && perssionData.funcMenu["FUNC.FUNC.CODE_03.CODE_01.CODE_01.CODE_09"].isSee==true) {
			if(orderMsg.ORDER_ERROR_LIST) {
				orderMsg.ORDER_ERROR_LIST.forEach(element => {
					if (perssionData.dataMenu['DATA.FI.ORDER_ERROR_LIST.ERRORDATE'].isSee==true) {
						//被记录报
						allEventList.push({
							dateDesc:businessDesc["ORDER_ERROR_LIST.ERRORDATE"],
							date:element.ERRORDATE,
							upTime:element.ERRORDATE_CHAIN_TIME,
							timestamp:timeStrToTimestamp(element.ERRORDATE_CHAIN_TIME),
						});
					}
				});
			}
	
			if(orderMsg.ORDER_PROBLEM_REMARK) {
				orderMsg.ORDER_PROBLEM_REMARK.forEach(element => {
					if (perssionData.dataMenu['DATA.FI.ORDER_PROBLEM_REMARK.CREATE_DATE'].isSee==true) {
						//退改单记录
						allEventList.push({
							dateDesc:i18n.t('message.businessDetail.remarkTime'),
							date:element.CREATE_DATE,
							upTime:element.CREATE_DATE_CHAIN_TIME,
							timestamp:timeStrToTimestamp(element.CREATE_DATE_CHAIN_TIME),
						});
					}
				});
			}
	
			//审单过程
			if (orderMsg.ORDER_AUDIT_LIST) {
				if (perssionData.dataMenu['DATA.FI.ORDER_AUDIT_LIST.BG_DATE3'].isSee==true) {
					//审单通过日期
					allEventList.push({
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
					allEventList.push({
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
					allEventList.push({
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
					allEventList.push({
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
					allEventList.push({
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
					allEventList.push({
						dateDesc:businessDesc["ORDER_AUDIT_LIST.TGYS_DATE1"],
						date:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE1,
						upTime:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE1_CHAIN_TIME,
						timestamp:timeStrToTimestamp(orderMsg.ORDER_AUDIT_LIST.TGYS_DATE1_CHAIN_TIME),
						//提交预审人
						detailData:(perssionData.dataMenu['DATA.FI.ORDER_AUDIT_LIST.TJYS_OP_NAME'].isSee==true)?[{key:businessDesc["ORDER_AUDIT_LIST.TJYS_OP_NAME"], value:orderMsg.ORDER_AUDIT_LIST.TJYS_OP_NAME}]:[],
					});
				}
			}
		}
		
        /***************************************************其他没有字段的部分***************************************************/
        // //进口税单
        // allEventList.push({
        //     dateDesc:i18n.t('message.businessSearch.homeUseEntry'),//"进口税单",
        //     date:"",
        //     upTime:"",
        //     timestamp:"",
        // });
        // //原产地证书
        // allEventList.push({
        //     dateDesc:i18n.t('message.businessSearch.sourceCer'),//"原产地证书",
        //     date:"",
        //     upTime:"",
        //     timestamp:"",
        // });
        // //装箱单
        // allEventList.push({
        //     dateDesc:i18n.t('message.businessSearch.containerLoadPlan'),//"装箱单",
        //     date:"",
        //     upTime:"",
        //     timestamp:"",
        // });
        // //发票
        // allEventList.push({
        //     dateDesc:i18n.t('message.businessSearch.bill'),//"发票",
        //     date:"",
        //     upTime:"",
        //     timestamp:"",
        // });
        
        //按显示时间倒序排序
        let newList = allEventList.sort((a,b) => {
            let aDate = isNullData(a["date"])?"":a["date"];
            let bDate = isNullData(b["date"])?"":b["date"];
            return aDate < bDate ? 1 : -1;
        })

        console.log("newList...",newList);

        //获取每个月最后
        for (let index = 0; index < newList.length; index++) {
            //计算当前index的对象中显示时间月份
            const date = newList[index].date;
            if(isNullData(date)){
                continue;
            }
            var dateArr = date.split(/[- :]/);
            let indexMonth = dateArr[1];

            if(index == 0){
                newList[index].isShowMonth = true;
                if(!isNullData(newList[index].date)){
                    newList[index].showMonth = dateArr[0]+"."+(dateArr[1]);
                }
            }
            if(index < (newList.length-1)){
                //计算index的下一个对象中显示时间月份
                const nextDate = newList[index+1].date;
                var nextDateArr = nextDate.split(/[- :]/);
                let nextIndexMonth = nextDateArr[1];
                if(indexMonth != nextIndexMonth){
                    newList[index+1].isShowMonth = true;
                    if(!isNullData(newList[index+1].date)){
                        newList[index+1].showMonth = nextDateArr[0]+"."+(nextDateArr[1]);
                    }
                }
            }else{
                //计算index的下一个对象中显示时间月份
                const backDate = newList[index-1].date;
                var backDateArr = backDate.split(/[- :]/);
                let backIndexMonth = backDateArr[1];
                if(indexMonth != backIndexMonth){
                    newList[index].isShowMonth = true;
                    if(!isNullData(newList[index].date)){
                        newList[index].showMonth = dateArr[0]+"."+(dateArr[1]);
                    }
                }
            }
        }

        console.log("newList1...",newList);

        if(newList.length <=0){
            return [];
        }
        let array = [newList];
        return array;
    }else{
        let stepsActive = getExportTotalStepsActive(orderMsg);
        let allNodeList = getExportStepsTitle(orderMsg);
        allNodeList.reverse();
        //根据进度数，得出显示流程进度节点名称数组
        let length = allNodeList.length;
        allNodeList.splice(0,length-stepsActive);

        let allEventList = [];
        //根据动态节点名称数组，插入对应节点数据
        for (let index = 0; index < allNodeList.length; index++) {
            let element = allNodeList[index];
            let nodeArr = getAllEventExportRightData(element,businessDesc,orderMsg,isYuanChuAcc,perssionData);
            allEventList.push(...nodeArr);
		}
		
		/***************************************************单证文件显示数据写入***************************************************/
		if (perssionData && perssionData.funcMenu["FUNC.FUNC.CODE_03.CODE_01.CODE_02.CODE_05"].isSee==true) {
			if(orderMsg.ORDER_DOC) {
				orderMsg.ORDER_DOC.forEach(element => {
					if (perssionData.dataMenu['DATA.FE.ORDER_DOC.DOC_DATE'].isSee==true) {
						let detail = [];
						if (perssionData.dataMenu['DATA.FE.ORDER_DOC.DOC_TYPE'].isSee==true) {
							detail.push({key:i18n.t('message.businessDetail.fileType'), value:element.DOC_TYPE});
						}
						if (perssionData.dataMenu['DATA.FE.ORDER_DOC.DOC_NAME'].isSee==true) {
							detail.push({key:i18n.t('message.businessDetail.fileName'), value:element.DOC_NAME});
						}
						//单证文件
						allEventList.push({
							dateDesc:i18n.t('message.businessDetail.documentFile'),
							date:element.DOC_DATE,
							upTime:element.DOC_CHAIN_TIME,
							timestamp:timeStrToTimestamp(element.DOC_CHAIN_TIME),
							detailData:detail,
						});
					}
				});
			}
		}
		
		/***************************************************复核纠错模块数据写入***************************************************/
		if (perssionData && perssionData.funcMenu["FUNC.FUNC.CODE_03.CODE_01.CODE_02.CODE_08"].isSee==true) {
			if(orderMsg.ORDER_ERROR_LIST) {
				orderMsg.ORDER_ERROR_LIST.forEach(element => {
					if (perssionData.dataMenu['DATA.FE.ORDER_ERROR_LIST.ERRORDATE'].isSee==true) {
						//被记录报
						allEventList.push({
							dateDesc:businessDesc["ORDER_ERROR_LIST.ERRORDATE"],
							date:element.ERRORDATE,
							upTime:element.ERRORDATE_CHAIN_TIME,
							timestamp:timeStrToTimestamp(element.ERRORDATE_CHAIN_TIME),
						});
					}
				});
			}
	
			if(orderMsg.ORDER_PROBLEM_REMARK) {
				orderMsg.ORDER_PROBLEM_REMARK.forEach(element => {
					if (perssionData.dataMenu['DATA.FE.ORDER_PROBLEM_REMARK.CREATE_DATE'].isSee==true) {
						//退改单记录
						allEventList.push({
							dateDesc:i18n.t('message.businessDetail.remarkTime'),
							date:element.CREATE_DATE,
							upTime:element.CREATE_DATE_CHAIN_TIME,
							timestamp:timeStrToTimestamp(element.CREATE_DATE_CHAIN_TIME),
						});
					}
				});
			}
	
			//审单过程
			if (orderMsg.ORDER_AUDIT_LIST) {
				if (perssionData.dataMenu['DATA.FE.ORDER_AUDIT_LIST.BG_DATE3'].isSee==true) {
					//审单通过日期
					allEventList.push({
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
					allEventList.push({
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
					allEventList.push({
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
					allEventList.push({
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
					allEventList.push({
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
					allEventList.push({
						dateDesc:businessDesc["ORDER_AUDIT_LIST.TGYS_DATE1"],
						date:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE1,
						upTime:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE1_CHAIN_TIME,
						timestamp:timeStrToTimestamp(orderMsg.ORDER_AUDIT_LIST.TGYS_DATE1_CHAIN_TIME),
						//提交预审人
						detailData:(perssionData.dataMenu['DATA.FE.ORDER_AUDIT_LIST.TJYS_OP_NAME'].isSee==true)?[{key:businessDesc["ORDER_AUDIT_LIST.TJYS_OP_NAME"], value:orderMsg.ORDER_AUDIT_LIST.TJYS_OP_NAME}]:[],
					});
				}
			}
		}
		

		// /***************************************************复核纠错模块数据写入***************************************************/
		// if(orderMsg.ORDER_ERROR_LIST) {
		// 	orderMsg.ORDER_ERROR_LIST.forEach(element => {
		// 		//被记录报
		// 		allEventList.push({
		// 			dateDesc:businessDesc["ORDER_ERROR_LIST.ERRORDATE"],
		// 			date:element.ERRORDATE,
		// 			upTime:element.ERRORDATE_CHAIN_TIME,
		// 			timestamp:timeStrToTimestamp(element.ERRORDATE_CHAIN_TIME),
		// 			// detailData:[
		// 			// 	{key:i18n.t('message.businessDetail.fileType'), value:element.DOC_TYPE},
		// 			// 	{key:i18n.t('message.businessDetail.fileName'), value:element.DOC_NAME}
		// 			// ],
		// 		});
		// 	});
		// }

		// if(orderMsg.ORDER_PROBLEM_REMARK) {
		// 	orderMsg.ORDER_PROBLEM_REMARK.forEach(element => {
		// 		//退改单记录
		// 		allEventList.push({
		// 			dateDesc:i18n.t('message.businessDetail.remarkTime'),
		// 			date:element.CREATE_DATE,
		// 			upTime:element.CREATE_DATE_CHAIN_TIME,
		// 			timestamp:timeStrToTimestamp(element.CREATE_DATE_CHAIN_TIME),
		// 			// detailData:[
		// 			// 	{key:i18n.t('message.businessDetail.fileType'), value:element.DOC_TYPE},
		// 			// 	{key:i18n.t('message.businessDetail.fileName'), value:element.DOC_NAME}
		// 			// ],
		// 		});
		// 	});
		// }

		// //审单过程
		// if (orderMsg.ORDER_AUDIT_LIST) {
		// 	//审单通过日期
		// 	allEventList.push({
		// 		dateDesc:businessDesc["ORDER_AUDIT_LIST.BG_DATE3"],
		// 		date:orderMsg.ORDER_AUDIT_LIST.BG_DATE3,
		// 		upTime:orderMsg.ORDER_AUDIT_LIST.BG_DATE3_CHAIN_TIME,
		// 		timestamp:timeStrToTimestamp(orderMsg.ORDER_AUDIT_LIST.BG_DATE3_CHAIN_TIME),
		// 		//审单完成人
		// 		detailData:[{key:businessDesc["ORDER_AUDIT_LIST.SD_OP_NAME"], value:orderMsg.ORDER_AUDIT_LIST.SD_OP_NAME}],
		// 	});
		// 	//审单受理日期
		// 	allEventList.push({
		// 		dateDesc:businessDesc["ORDER_AUDIT_LIST.BG_DATE2"],
		// 		date:orderMsg.ORDER_AUDIT_LIST.BG_DATE2,
		// 		upTime:orderMsg.ORDER_AUDIT_LIST.BG_DATE2_CHAIN_TIME,
		// 		timestamp:timeStrToTimestamp(orderMsg.ORDER_AUDIT_LIST.BG_DATE2_CHAIN_TIME),
		// 		//审单接单人
		// 		detailData:[{key:businessDesc["ORDER_AUDIT_LIST.JD_OP_NAME"], value:orderMsg.ORDER_AUDIT_LIST.JD_OP_NAME}],
		// 	});
		// 	//提交审单日期
		// 	allEventList.push({
		// 		dateDesc:businessDesc["ORDER_AUDIT_LIST.BG_DATE1"],
		// 		date:orderMsg.ORDER_AUDIT_LIST.BG_DATE1,
		// 		upTime:orderMsg.ORDER_AUDIT_LIST.BG_DATE1_CHAIN_TIME,
		// 		timestamp:timeStrToTimestamp(orderMsg.ORDER_AUDIT_LIST.BG_DATE1_CHAIN_TIME),
		// 		//提交审单人
		// 		detailData:[{key:businessDesc["ORDER_AUDIT_LIST.TJSD_OP_NAME"], value:orderMsg.ORDER_AUDIT_LIST.TJSD_OP_NAME}],
		// 	});
		// 	//预审通过日期
		// 	allEventList.push({
		// 		dateDesc:businessDesc["ORDER_AUDIT_LIST.TGYS_DATE3"],
		// 		date:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE3,
		// 		upTime:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE3_CHAIN_TIME,
		// 		timestamp:timeStrToTimestamp(orderMsg.ORDER_AUDIT_LIST.TGYS_DATE3_CHAIN_TIME),
		// 		//审单完成人
		// 		detailData:[{key:businessDesc["ORDER_AUDIT_LIST.SD_OP_NAME"], value:orderMsg.ORDER_AUDIT_LIST.SD_OP_NAME}],
		// 	});
		// 	//预审受理日期
		// 	allEventList.push({
		// 		dateDesc:businessDesc["ORDER_AUDIT_LIST.TGYS_DATE2"],
		// 		date:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE2,
		// 		upTime:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE2_CHAIN_TIME,
		// 		timestamp:timeStrToTimestamp(orderMsg.ORDER_AUDIT_LIST.TGYS_DATE2_CHAIN_TIME),
		// 		//审单接单人
		// 		detailData:[{key:businessDesc["ORDER_AUDIT_LIST.JD_OP_NAME"], value:orderMsg.ORDER_AUDIT_LIST.JD_OP_NAME}],
		// 	});
		// 	//提交预审日期
		// 	allEventList.push({
		// 		dateDesc:businessDesc["ORDER_AUDIT_LIST.TGYS_DATE1"],
		// 		date:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE1,
		// 		upTime:orderMsg.ORDER_AUDIT_LIST.TGYS_DATE1_CHAIN_TIME,
		// 		timestamp:timeStrToTimestamp(orderMsg.ORDER_AUDIT_LIST.TGYS_DATE1_CHAIN_TIME),
		// 		//提交预审人
		// 		detailData:[{key:businessDesc["ORDER_AUDIT_LIST.TJYS_OP_NAME"], value:orderMsg.ORDER_AUDIT_LIST.TJYS_OP_NAME}],
		// 	});
		// }

        /***************************************************其他没有字段的部分***************************************************/
        // //原产地证书
        // allEventList.push({
        //     dateDesc:i18n.t('message.businessSearch.sourceCer'),//"原产地证书",
        //     date:"",
        //     upTime:"",
        //     timestamp:"",
        // });
        // //装箱单
        // allEventList.push({
        //     dateDesc:i18n.t('message.businessSearch.containerLoadPlan'),//"装箱单",
        //     date:"",
        //     upTime:"",
        //     timestamp:"",
        // });
        // //发票
        // allEventList.push({
        //     dateDesc:i18n.t('message.businessSearch.bill'),//"发票",
        //     date:"",
        //     upTime:"",
        //     timestamp:"",
        // });
        
        //按显示时间倒序排序
        let newList = allEventList.sort((a,b) => {
            let aDate = isNullData(a["date"])?"":a["date"];
            let bDate = isNullData(b["date"])?"":b["date"];
            return aDate < bDate ? 1 : -1;
        })

        console.log("newList...",newList);

        //获取每个月最后
        for (let index = 0; index < newList.length; index++) {
            //计算当前index的对象中显示时间月份
            const date = newList[index].date;
            if(isNullData(date)){
                continue;
            }
            var dateArr = date.split(/[- :]/);
            let indexMonth = dateArr[1];

            if(index == 0){
                newList[index].isShowMonth = true;
                if(!isNullData(newList[index].date)){
                    newList[index].showMonth = dateArr[0]+"."+(dateArr[1]);
                }
            }
            if(index < (newList.length-1)){
                //计算index的下一个对象中显示时间月份
                const nextDate = newList[index+1].date;
                var nextDateArr = nextDate.split(/[- :]/);
                let nextIndexMonth = nextDateArr[1];
                if(indexMonth != nextIndexMonth){
                    newList[index+1].isShowMonth = true;
                    if(!isNullData(newList[index+1].date)){
                        newList[index].showMonth = nextDateArr[0]+"."+(nextDateArr[1]);
                    }
                }
            }else{
                //计算index的下一个对象中显示时间月份
                const backDate = newList[index-1].date;
                var backDateArr = backDate.split(/[- :]/);
                let backIndexMonth = backDateArr[1];
                if(indexMonth != backIndexMonth){
                    newList[index].isShowMonth = true;
                    if(!isNullData(newList[index].date)){
                        newList[index].showMonth = dateArr[0]+"."+(dateArr[1]);
                    }
                }
            }
        }

        console.log("newList1...",newList);

        if(newList.length <=0){
            return [];
        }
        let array = [newList];
        return array;
    }
}

/**
 * 获取进口所有事件右侧显示数据
 */
export function getAllEventRightData(nodeName,businessDesc,orderMsg,isYuanChuAcc,perssionData){
    let allEventList = [];
    switch (nodeName) {
        case i18n.t('message.businessSearch.order'):{
			/***************************************************订单部分***************************************************/
			if (perssionData.dataMenu["DATA.FI.DZQQ_DATE"].isSee==true) {
				//单证齐全日期
				allEventList.push({
					dateDesc:businessDesc.DZQQ_DATE,
					date:orderMsg.DZQQ_DATE,
					upTime:orderMsg.DZQQ_DATE_CHAIN_TIME,
					timestamp:timeStrToTimestamp(orderMsg.DZQQ_DATE_CHAIN_TIME),
				});
			}
            if (perssionData.dataMenu["DATA.FI.RECE_DOC_DATE"].isSee==true) {
				//单证收到日期
				allEventList.push({
					dateDesc:businessDesc.RECE_DOC_DATE,
					date:orderMsg.RECE_DOC_DATE,
					upTime:orderMsg.RECE_DOC_DATE_CHAIN_TIME,
					timestamp:timeStrToTimestamp(orderMsg.RECE_DOC_DATE_CHAIN_TIME),
				});
			}
            
            if(isYuanChuAcc != '1'){
				if (perssionData.dataMenu["DATA.FI.MODIFY_TIME"].isSee==true) {
					//修改时间
					allEventList.push({
						dateDesc:businessDesc.MODIFY_TIME,
						date:orderMsg.MODIFY_TIME,
						upTime:orderMsg.MODIFY_TIME_CHAIN_TIME,
						timestamp:timeStrToTimestamp(orderMsg.MODIFY_TIME_CHAIN_TIME),
						detailData:[{key:businessDesc.MODIFY_BY, value:orderMsg.MODIFY_BY}]
					});
				}
                if (perssionData.dataMenu["DATA.FI.CREATE_TIME"].isSee==true) {
					//创建时间
					allEventList.push({
						dateDesc:businessDesc.CREATE_TIME,
						date:orderMsg.CREATE_TIME,
						upTime:orderMsg.CREATE_TIME_CHAIN_TIME,
						timestamp:timeStrToTimestamp(orderMsg.CREATE_TIME_CHAIN_TIME),
						detailData:[{key:businessDesc.CREATE_BY, value:orderMsg.CREATE_BY}]
					});
				}
                if (perssionData.dataMenu["DATA.FI.ACCEPT_DATE"].isSee==true) {
					//客户委托日期
					allEventList.push({
						dateDesc:businessDesc.ACCEPT_DATE,
						date:orderMsg.ACCEPT_DATE,
						upTime:orderMsg.ACCEPT_DATE_CHAIN_TIME,
						timestamp:timeStrToTimestamp(orderMsg.ACCEPT_DATE_CHAIN_TIME),
					});
				}
            }
        }
            break;
        case i18n.t('message.businessSearch.changeOrder'):{
			/***************************************************换单部分***************************************************/
			if (perssionData.dataMenu["DATA.FI.FIN_SWITCH_BILL_DATE"].isSee==true) {
				//换单日期
				allEventList.push({
					dateDesc:businessDesc.FIN_SWITCH_BILL_DATE,
					date:orderMsg.FIN_SWITCH_BILL_DATE,
					upTime:orderMsg.FIN_SWITCH_BILL_DATE_CHAIN_TIME,
					timestamp:timeStrToTimestamp(orderMsg.FIN_SWITCH_BILL_DATE_CHAIN_TIME),
					detailData:[{key:businessDesc.FIN_SWITCH_AGENCY_NAME, value:orderMsg.FIN_SWITCH_AGENCY_NAME}]
				});
			}
            if (perssionData.dataMenu["DATA.FI.FST_SWITCH_BILL_DATE"].isSee==true) {
				//头程换单日期
				allEventList.push({
					dateDesc:businessDesc.FST_SWITCH_BILL_DATE,
					date:orderMsg.FST_SWITCH_BILL_DATE,
					upTime:orderMsg.FST_SWITCH_BILL_DATE_CHAIN_TIME,
					timestamp:timeStrToTimestamp(orderMsg.FST_SWITCH_BILL_DATE_CHAIN_TIME),
					detailData:[{key:businessDesc.FST_SWITCH_AGENCY_NAME, value:orderMsg.FST_SWITCH_AGENCY_NAME}]
				});
			}
            if (perssionData.dataMenu["DATA.FI.SCD_SWITCH_BILL_DATE"].isSee==true) {
				//二程换单日期
				if(!isNullData(orderMsg.SCD_SWITCH_BILL_DATE)){
					allEventList.push({
						dateDesc:businessDesc.SCD_SWITCH_BILL_DATE,
						date:orderMsg.SCD_SWITCH_BILL_DATE,
						upTime:orderMsg.SCD_SWITCH_BILL_DATE_CHAIN_TIME,
						timestamp:timeStrToTimestamp(orderMsg.SCD_SWITCH_BILL_DATE_CHAIN_TIME),
						detailData:[{key:businessDesc.SCD_SWITCH_AGENCY_NAME, value:orderMsg.SCD_SWITCH_AGENCY_NAME}]
					});
				}
			}
            if (perssionData.dataMenu["DATA.FI.TRD_SWITCH_BILL_DATE"].isSee==true) {
				//三程换单日期
				if(!isNullData(orderMsg.TRD_SWITCH_BILL_DATE)){
					allEventList.push({
						dateDesc:businessDesc.TRD_SWITCH_BILL_DATE,
						date:orderMsg.TRD_SWITCH_BILL_DATE,
						upTime:orderMsg.TRD_SWITCH_BILL_DATE_CHAIN_TIME,
						timestamp:timeStrToTimestamp(orderMsg.TRD_SWITCH_BILL_DATE_CHAIN_TIME),
						detailData:[{key:businessDesc.TRD_SWITCH_AGENCY_NAME, value:orderMsg.TRD_SWITCH_AGENCY_NAME}]
					});
				}
			}
            
        }
            break;
        case i18n.t('message.businessSearch.customs'):{
            /***************************************************报关部分***************************************************/
            if(orderMsg.DECLARATION_LIST){
                orderMsg.DECLARATION_LIST.forEach(cusObj=>{
					if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.FXDATE"].isSee==true) {
						//通关货物放行日期
						allEventList.push({
							dateDesc:businessDesc["DECLARATION_LIST.FXDATE"],
							date:cusObj.FXDATE,
							upTime:cusObj.FXDATE_CHAIN_TIME,
							timestamp:timeStrToTimestamp(cusObj.FXDATE_CHAIN_TIME),
						});
					}
                    if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.KDATE"].isSee==true) {
						//担保放行日期
						if(!isNullData(cusObj.KDATE)){
							allEventList.push({
								dateDesc:businessDesc["DECLARATION_LIST.KDATE"],
								date:cusObj.KDATE,
								upTime:cusObj.KDATE_CHAIN_TIME,
								timestamp:timeStrToTimestamp(cusObj.KDATE_CHAIN_TIME),
							});
						}
					}
                    //当“报关单口岸查验”或者“报关单目的地查验”的栏位显示“有”时，才显示“计划查验日期”和“实际查验日期”
                    let isHGCY_STATUSHave = !isNullData(orderMsg.HGCY_STATUS);
                    let isSJSTATUSHave = !isNullData(orderMsg.SJSTATUS);
                    if(isHGCY_STATUSHave==true || isSJSTATUSHave==true){
						if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.INSPECTION_DATE"].isSee==true) {
							//实际查验日期
							allEventList.push({
								dateDesc:businessDesc["DECLARATION_LIST.INSPECTION_DATE"],
								date:cusObj.INSPECTION_DATE,
								upTime:cusObj.INSPECTION_DATE_CHAIN_TIME,
								timestamp:timeStrToTimestamp(cusObj.INSPECTION_DATE_CHAIN_TIME),
							});
						}
                        if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.SCHEDULE_DATE"].isSee==true) {
							//计划查验日期
							allEventList.push({
								dateDesc:businessDesc["DECLARATION_LIST.SCHEDULE_DATE"],
								date:cusObj.SCHEDULE_DATE,
								upTime:cusObj.SCHEDULE_DATE_CHAIN_TIME,
								timestamp:timeStrToTimestamp(cusObj.SCHEDULE_DATE_CHAIN_TIME),
							});
						}
                    }
					
					if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.BDATE"].isSee==true) {
						//海关查验通知日期
						if(!isNullData(cusObj.BDATE)){
							allEventList.push({
								dateDesc:businessDesc["DECLARATION_LIST.BDATE"],
								date:cusObj.BDATE,
								upTime:cusObj.BDATE_CHAIN_TIME,
								timestamp:timeStrToTimestamp(cusObj.BDATE_CHAIN_TIME),
							});
						}
					}
                    if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.TAXDATE"].isSee==true) {
						//付税放行日期
						allEventList.push({
							dateDesc:businessDesc["DECLARATION_LIST.TAXDATE"],
							date:cusObj.TAXDATE,
							upTime:cusObj.TAXDATE_CHAIN_TIME,
							timestamp:timeStrToTimestamp(cusObj.TAXDATE_CHAIN_TIME),
						});
					}
                    if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.JDATE"].isSee==true) {
						//大通关放行日期
						allEventList.push({
							dateDesc:businessDesc["DECLARATION_LIST.JDATE"],
							date:cusObj.JDATE,
							upTime:cusObj.JDATE_CHAIN_TIME,
							timestamp:timeStrToTimestamp(cusObj.JDATE_CHAIN_TIME),
						});
					}
                    if (perssionData.dataMenu["DATA.FI.DECLARATION_LIST.SBDATE"].isSee==true) {
						//申报日期
						allEventList.push({
							dateDesc:businessDesc["DECLARATION_LIST.SBDATE"],
							date:cusObj.SBDATE,
							upTime:cusObj.SBDATE_CHAIN_TIME,
							timestamp:timeStrToTimestamp(cusObj.SBDATE_CHAIN_TIME),
						});
					}
                    
                    // //和客户确认报关信息日期
                    // allEventList.push({
                    //     dateDesc:i18n.t('message.businessSearch.dateOfConfirmation'),//businessDesc["DECLARATION_LIST.KDATE"],
                    //     date:"",//cusObj.KDATE,
                    //     upTime:"",
                    //     timestamp:"",
                    // });
                })
            }
        }
            break;
        // case "辅检":{
        //     /***************************************************辅检部分***************************************************/
        //     //辅检放行日期
        //     allEventList.push({
        //         dateDesc:i18n.t('message.businessSearch.releaseDateOfCIQ'),//"辅检放行日期",
        //         date:"",//orderMsg.DZQQ_DATE,
        //         upTime:"",
        //         timestamp:"",
        //     });
        //     //检验检疫反馈日期
        //     let obj = getRecentlyDataFromList('SDATE',orderMsg.DECLARATION_LIST);
        //     allEventList.push({
        //         dateDesc:businessDesc["DECLARATION_LIST.SDATE"],
        //         date:obj.SDATE,
        //         upTime:obj.SDATE_CHAIN_TIME,
        //         timestamp:timeStrToTimestamp(obj.SDATE_CHAIN_TIME),
        //     });
        // }
        //     break;
        case i18n.t('message.businessSearch.trans'):{
            /***************************************************运输部分***************************************************/
            let transArr = getTransDataList(businessDesc, orderMsg,isYuanChuAcc,"FI",perssionData);
            transArr.forEach(element => {
                if(element.constructor === Array){
                    allEventList.push(...element);
                }else{
                    allEventList.push(element);
                }
            });
            
        }
            break;
        // case "主检":{
        //     /***************************************************主检部分***************************************************/
        //     //主检放行日期
        //     if(!isNullData(orderMsg.SJ_DATE2)){
        //         allEventList.push({
        //             dateDesc:businessDesc.SJ_DATE2,
        //             date:orderMsg.SJ_DATE2,
        //             upTime:orderMsg.SJ_DATE2_CHAIN_TIME,
        //             timestamp:timeStrToTimestamp(orderMsg.SJ_DATE2_CHAIN_TIME),
        //         });
        //     }
        // }
        //     break;
        default:
            break;
    }

    return allEventList;
}

/**
 * 获取出口所有事件右侧显示数据
 */
export function getAllEventExportRightData(nodeName,businessDesc,orderMsg,isYuanChuAcc,perssionData){
    let allEventList = [];
    switch (nodeName) {
        case i18n.t('message.businessSearch.order'):{
			/***************************************************订单部分***************************************************/
			if (perssionData.dataMenu['DATA.FE.DZQQ_DATE'].isSee==true) {
				//单证齐全日期
				allEventList.push({
					dateDesc:businessDesc.DZQQ_DATE,
					date:orderMsg.DZQQ_DATE,
					upTime:orderMsg.DZQQ_DATE_CHAIN_TIME,
					timestamp:timeStrToTimestamp(orderMsg.DZQQ_DATE_CHAIN_TIME),
				});
			}
            if (perssionData.dataMenu['DATA.FE.RECE_DOC_DATE'].isSee==true) {
				//单证收到日期
				allEventList.push({
					dateDesc:businessDesc.RECE_DOC_DATE,
					date:orderMsg.RECE_DOC_DATE,
					upTime:orderMsg.RECE_DOC_DATE_CHAIN_TIME,
					timestamp:timeStrToTimestamp(orderMsg.RECE_DOC_DATE_CHAIN_TIME),
				});
			}
            
            if(isYuanChuAcc != '1'){
				if (perssionData.dataMenu['DATA.FE.MODIFY_TIME'].isSee==true) {
					//修改时间
					allEventList.push({
						dateDesc:businessDesc.MODIFY_TIME,
						date:orderMsg.MODIFY_TIME,
						upTime:orderMsg.MODIFY_TIME_CHAIN_TIME,
						timestamp:timeStrToTimestamp(orderMsg.MODIFY_TIME_CHAIN_TIME),
						detailData:[{key:businessDesc.MODIFY_BY, value:orderMsg.MODIFY_BY}]
					});
				}
                if (perssionData.dataMenu['DATA.FE.CREATE_TIME'].isSee==true) {
					//创建时间
					allEventList.push({
						dateDesc:businessDesc.CREATE_TIME,
						date:orderMsg.CREATE_TIME,
						upTime:orderMsg.CREATE_TIME_CHAIN_TIME,
						timestamp:timeStrToTimestamp(orderMsg.CREATE_TIME_CHAIN_TIME),
						detailData:[{key:businessDesc.CREATE_BY, value:orderMsg.CREATE_BY}]
					});
				}
                if (perssionData.dataMenu['DATA.FE.ACCEPT_DATE'].isSee==true) {
					//客户委托日期
					allEventList.push({
						dateDesc:businessDesc.ACCEPT_DATE,
						date:orderMsg.ACCEPT_DATE,
						upTime:orderMsg.ACCEPT_DATE_CHAIN_TIME,
						timestamp:timeStrToTimestamp(orderMsg.ACCEPT_DATE_CHAIN_TIME),
					});
				}
            }
        }
            break;
        case i18n.t('message.businessSearch.booking'):{
			/***************************************************订舱部分***************************************************/
			if (perssionData.dataMenu['DATA.FE.BL_CONFIRM_DATE'].isSee==true) {
				//提单确认日期
				allEventList.push({
					dateDesc:businessDesc.BL_CONFIRM_DATE,
					date:orderMsg.BL_CONFIRM_DATE,
					upTime:orderMsg.BL_CONFIRM_DATE_CHAIN_TIME,
					timestamp:timeStrToTimestamp(orderMsg.BL_CONFIRM_DATE_CHAIN_TIME),
				});
			}
            if (perssionData.dataMenu['DATA.FE.BOOKING_DATE'].isSee==true) {
				//订舱日期
				allEventList.push({
					dateDesc:businessDesc.BOOKING_DATE,
					date:orderMsg.BOOKING_DATE,
					upTime:orderMsg.BOOKING_DATE_CHAIN_TIME,
					timestamp:timeStrToTimestamp(orderMsg.BOOKING_DATE_CHAIN_TIME),
					detailData:[{key:businessDesc.BOOKING_AGENCY_NAME, value:orderMsg.BOOKING_AGENCY_NAME}]
				});
			}
            
        }
            break;
        case i18n.t('message.businessSearch.customs'):{
            /***************************************************报关部分***************************************************/
            if(orderMsg.DECLARATION_LIST){
                orderMsg.DECLARATION_LIST.forEach(cusObj=>{
					if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.FXDATE'].isSee==true) {
						//通关货物放行日期
						allEventList.push({
							dateDesc:businessDesc["DECLARATION_LIST.FXDATE"],
							date:cusObj.FXDATE,
							upTime:cusObj.FXDATE_CHAIN_TIME,
							timestamp:timeStrToTimestamp(cusObj.FXDATE_CHAIN_TIME),
						});
					}
                    if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.BDATE'].isSee==true) {
						//海关查验通知日期
						if(!isNullData(cusObj.BDATE)){
							allEventList.push({
								dateDesc:businessDesc["DECLARATION_LIST.BDATE"],
								date:cusObj.BDATE,
								upTime:cusObj.BDATE_CHAIN_TIME,
								timestamp:timeStrToTimestamp(cusObj.BDATE_CHAIN_TIME),
							});
						}
					}
                    if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.JDATE'].isSee==true) {
						//大通关放行日期
						allEventList.push({
							dateDesc:businessDesc["DECLARATION_LIST.JDATE"],
							date:cusObj.JDATE,
							upTime:cusObj.JDATE_CHAIN_TIME,
							timestamp:timeStrToTimestamp(cusObj.JDATE_CHAIN_TIME),
						});
					}
                    if (perssionData.dataMenu['DATA.FE.DECLARATION_LIST.SBDATE'].isSee==true) {
						//申报日期
						allEventList.push({
							dateDesc:businessDesc["DECLARATION_LIST.SBDATE"],
							date:cusObj.SBDATE,
							upTime:cusObj.SBDATE_CHAIN_TIME,
							timestamp:timeStrToTimestamp(cusObj.SBDATE_CHAIN_TIME),
						});
					}
                    
                    // //和客户确认报关信息日期
                    // allEventList.push({
                    //     dateDesc:i18n.t('message.businessSearch.dateOfConfirmation'),//businessDesc["DECLARATION_LIST.KDATE"],
                    //     date:"",//cusObj.KDATE,
                    //     upTime:"",
                    //     timestamp:"",
                    // });
                })
            }
        }
            break;
        case i18n.t('message.businessSearch.trans'):{
            /***************************************************运输部分***************************************************/
            let transArr = getTransDataList(businessDesc, orderMsg,isYuanChuAcc, "FE",perssionData);
            transArr.forEach(element => {
                if(element.constructor === Array){
                    allEventList.push(...element);
                }else{
                    allEventList.push(element);
                }
            });
            
        }
            break;
        default:
            break;
    }
    

    return allEventList;
}