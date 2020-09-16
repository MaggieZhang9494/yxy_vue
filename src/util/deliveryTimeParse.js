import { isNullData, isJSONStr,isMobile,timeStrToTimestamp} from './util'
import {getTotalStepsTitle,getExportStepsTitle} from './orderDataParse'
/* 国际化 */
import i18n from '@/i18n/i18n'
import { data } from 'autoprefixer';

/**
 * 通过列表及列表中的时间字段来获取列表中最近对象信息
 * @param {*} fieldName 
 * @param {*} dataList 
 */
function getRecentlyDataFromList(fieldName, dataList) {
    // console.log("fieldName...", fieldName);
    // console.log("dataList...", dataList);
    if(!dataList || dataList.length == 0){
        return null;
    }
    let newList = dataList.sort((a,b) => {
        return a[fieldName] < b[fieldName] ? 1 : -1;
    })
    // console.log("newList...",newList);
    return newList[0];
}

/**
 * 通过列表及列表中的时间字段来获取列表中时间最早的对象信息
 * @param {*} fieldName 
 * @param {*} dataList 
 */
function getEarliestDataFromList(fieldName, dataList) {
    // console.log("fieldName...", fieldName);
    // console.log("dataList...", dataList);
    if(!dataList || dataList.length == 0){
        return null;
	}
	
	let newDataList = [];
	dataList.forEach(element => {
		if (!isNullData(element[fieldName])) {
			newDataList.push(element);
		}
	});

	if(newDataList.length == 0){
        return null;
	}

    let newList = newDataList.sort((a,b) => {
        return a[fieldName] > b[fieldName] ? 1 : -1;
    })
    // console.log("newList...",newList);
    return newList[0];
}

/**
 * 获取开始显示有效时间
 * @param {订单信息} orderMsg 
 * @param {业务字段名称} businessDesc 
 * @param {订单类型} orderType 
 */
function getValidStartTime(orderMsg,businessDesc,orderType){
    let validStartTime = isNullData(orderMsg.ACCEPT_DATE)?"":orderMsg.ACCEPT_DATE;
    if (!isNullData(orderMsg.ETD)) {
        if (timeStrToTimestamp(validStartTime) > timeStrToTimestamp(orderMsg.ETD)) {
            validStartTime = orderMsg.ETD;
        }
    }
    if (!isNullData(orderMsg.ATD)) {
        if (timeStrToTimestamp(validStartTime) > timeStrToTimestamp(orderMsg.ATD)) {
            validStartTime = orderMsg.ATD;
        }
    }
    if (!isNullData(orderMsg.ETA)) {
        if (timeStrToTimestamp(validStartTime) > timeStrToTimestamp(orderMsg.ETA)) {
            validStartTime = orderMsg.ETA;
        }
    }
    if (!isNullData(orderMsg.ATA)) {
        if (timeStrToTimestamp(validStartTime) > timeStrToTimestamp(orderMsg.ATA)) {
            validStartTime = orderMsg.ATA;
        }
    }
    return validStartTime;
}

/**
 * 获取结束显示有效时间
 * @param {订单信息} orderMsg 
 * @param {业务字段名称} businessDesc 
 * @param {订单类型} orderType 
 */
function getValidEndTime(orderMsg,businessDesc,orderType){
    let validEndTime = '';
    if (orderType != 'FE') { //进口订单
        //订单 客户委托日期  单证齐全日期
        if(!isNullData(orderMsg.ACCEPT_DATE) || !isNullData(orderMsg.DZQQ_DATE)){
            if (!isNullData(orderMsg.DZQQ_DATE)) {
                validEndTime = orderMsg.DZQQ_DATE;
            }
        }
        //换单 头程换单日期  换单日期
        if(!isNullData(orderMsg.FST_SWITCH_BILL_DATE) || !isNullData(orderMsg.FIN_SWITCH_BILL_DATE)){
            if (!isNullData(orderMsg.FIN_SWITCH_BILL_DATE)) {
                if (timeStrToTimestamp(validEndTime) <= timeStrToTimestamp(orderMsg.FIN_SWITCH_BILL_DATE)) {
                    validEndTime = orderMsg.FIN_SWITCH_BILL_DATE;
                }
            }else{
                if (timeStrToTimestamp(validEndTime) <= timeStrToTimestamp(orderMsg.FST_SWITCH_BILL_DATE)) {
                    validEndTime = orderMsg.FST_SWITCH_BILL_DATE;
                }
            }
        }
        //报关 申报日期 / 结关时间
        let isHaveSBDate = false;
        if(orderMsg.DECLARATION_LIST){
            //申报日期 通关货物放行日期 有值，取最大时间
            orderMsg.DECLARATION_LIST.forEach(element => {
                if(!isNullData(element.SBDATE) || !isNullData(element.FXDATE)){
                    if (!isNullData(element.FXDATE)) {
                        if (timeStrToTimestamp(validEndTime) <= timeStrToTimestamp(element.FXDATE)) {
                            validEndTime = element.FXDATE;
                        }
                    }else{
                        if (timeStrToTimestamp(validEndTime) <= timeStrToTimestamp(element.SBDATE)) {
                            validEndTime = element.SBDATE;
                        }
                    }
                }
            });
        }
        if(!isNullData(orderMsg.BG_DATE)){
            if (timeStrToTimestamp(validEndTime) <= timeStrToTimestamp(orderMsg.BG_DATE)) {
                validEndTime = orderMsg.BG_DATE;
            }
		}
		if(!isNullData(orderMsg.FX_DATE)){
            if (timeStrToTimestamp(validEndTime) <= timeStrToTimestamp(orderMsg.FX_DATE)) {
                validEndTime = orderMsg.FX_DATE;
            }
        }
        
        //运输 运输委托日期 / 运输完成时间
        if(orderMsg.ORDER_SERVE_TRANSPORT_LIST){
            //实际送达日期 运输委托日期 有值，取最大时间
            orderMsg.ORDER_SERVE_TRANSPORT_LIST.forEach(element => {
                if(!isNullData(element.TRANS_FIN_DATE) || !isNullData(element.TRANS_SUB_DATE)){
                    if (!isNullData(element.TRANS_FIN_DATE)) {
                        if (timeStrToTimestamp(validEndTime) <= timeStrToTimestamp(element.TRANS_FIN_DATE)) {
                            validEndTime = element.TRANS_FIN_DATE;
                        }
                    }else{
                        if (timeStrToTimestamp(validEndTime) <= timeStrToTimestamp(element.TRANS_SUB_DATE)) {
                            validEndTime = element.TRANS_SUB_DATE;
                        }
                    }
                }
            });
        }
        if(!isNullData(orderMsg.TRANS_DATE)){
            if (timeStrToTimestamp(validEndTime) < timeStrToTimestamp(orderMsg.TRANS_DATE)) {
                validEndTime = orderMsg.TRANS_DATE;
            }
        }
        
    }else{
        let stepsActive = 0;
        //订单节点 客户委托日期  单证齐全日期
        if(!isNullData(orderMsg.ACCEPT_DATE) || !isNullData(orderMsg.DZQQ_DATE)){
            if (!isNullData(orderMsg.DZQQ_DATE)) {
                validEndTime = orderMsg.DZQQ_DATE;
            }
        }
        //订舱节点 订舱日期  提单确认日期
        if(!isNullData(orderMsg.BOOKING_DATE) || !isNullData(orderMsg.BL_CONFIRM_DATE)){
            if (!isNullData(orderMsg.BL_CONFIRM_DATE)) {
                if (timeStrToTimestamp(validEndTime) <= timeStrToTimestamp(orderMsg.BL_CONFIRM_DATE)) {
                    validEndTime = orderMsg.BL_CONFIRM_DATE;
                }
            }else{
                if (timeStrToTimestamp(validEndTime) <= timeStrToTimestamp(orderMsg.BOOKING_DATE)) {
                    validEndTime = orderMsg.BOOKING_DATE;
                }
            }
        }
        //报关节点 申报日期 / 结关时间
        if(orderMsg.DECLARATION_LIST){
            //申报日期 通关货物放行日期 有值，取最大时间
            orderMsg.DECLARATION_LIST.forEach(element => {
                if(!isNullData(element.SBDATE) || !isNullData(element.FXDATE)){
                    if (!isNullData(element.FXDATE)) {
                        if (timeStrToTimestamp(validEndTime) <= timeStrToTimestamp(element.FXDATE)) {
                            validEndTime = element.FXDATE;
                        }
                    }else{
                        if (timeStrToTimestamp(validEndTime) <= timeStrToTimestamp(element.SBDATE)) {
                            validEndTime = element.SBDATE;
                        }
                    }
                }
            });
        }
        if(!isNullData(orderMsg.BG_DATE)){//报关完成时间
            if (timeStrToTimestamp(validEndTime) <= timeStrToTimestamp(orderMsg.BG_DATE)) {
                validEndTime = orderMsg.BG_DATE;
            }
        }
        
        //运输节点  运输委托日期 / 运输完成时间
        if(orderMsg.ORDER_SERVE_TRANSPORT_LIST){
            //实际送达日期 运输委托日期 有值，取最大时间
            orderMsg.ORDER_SERVE_TRANSPORT_LIST.forEach(element => {
                if(!isNullData(element.TRANS_FIN_DATE) || !isNullData(element.TRANS_SUB_DATE)){
                    if (!isNullData(element.TRANS_FIN_DATE)) {
                        if (timeStrToTimestamp(validEndTime) <= timeStrToTimestamp(element.TRANS_FIN_DATE)) {
                            validEndTime = element.TRANS_FIN_DATE;
                        }
                    }else{
                        if (timeStrToTimestamp(validEndTime) <= timeStrToTimestamp(element.TRANS_SUB_DATE)) {
                            validEndTime = element.TRANS_SUB_DATE;
                        }
                    }
                }
            });
        }
        if(!isNullData(orderMsg.TRANS_DATE)){
            if (timeStrToTimestamp(validEndTime) <= timeStrToTimestamp(orderMsg.TRANS_DATE)) {
                validEndTime = orderMsg.TRANS_DATE;
            }
        }
    }

    // if (!isNullData(orderMsg.ETD)) {
    //     if (timeStrToTimestamp(validEndTime) <= timeStrToTimestamp(orderMsg.ETD)) {
    //         validEndTime = orderMsg.ETD;
    //     }
    // }
    // if (!isNullData(orderMsg.ATD)) {
    //     if (timeStrToTimestamp(validEndTime) <= timeStrToTimestamp(orderMsg.ATD)) {
    //         validEndTime = orderMsg.ATD;
    //     }
    // }
    if (!isNullData(orderMsg.ETA)) {
        if (timeStrToTimestamp(validEndTime) <= timeStrToTimestamp(orderMsg.ETA)) {
            validEndTime = orderMsg.ETA;
        }
    }
    if (!isNullData(orderMsg.ATA)) {
        if (timeStrToTimestamp(validEndTime) <= timeStrToTimestamp(orderMsg.ATA)) {
            validEndTime = orderMsg.ATA;
        }
    }

    return validEndTime;
}

/**
 * 获取计算总的有效显示时长
 * @param {String} startTime 开始时间
 * @param {String} endTime 结束时间
 */
function getTotalDayTime(startTime,endTime){
    let startTimestamp = parseInt(timeStrToTimestamp(startTime));
    let endTimestamp = parseInt(timeStrToTimestamp(endTime));
    if(startTimestamp>endTimestamp){
        return 0;
    }
    let totalDay = Math.floor(Math.abs(endTimestamp - startTimestamp)/1000/60/60/24*10)/10;//把相差的毫秒数转换为天数
    return totalDay ;
}

/**
 * 获取进口订单每个阶段时间显示信息内容
 * @param {订单信息} orderMsg 
 * @param {业务字段名称} businessDesc 
 * @param {订单类型} orderType 
 */
function getImportShowTimeList(orderMsg,businessDesc,orderType,deliveryTimeMsg){

    let timeNodeList = [];

    //一、进货时间总览数据
    let importTimeObj = {};
    importTimeObj.nodeTitle = i18n.t('message.businessDetail.inboundLeadTime');
	importTimeObj.showMsgList = [];

	//优先获取进口日期
	let importTime = "";
	//进口日期，
	if(orderMsg.DECLARATION_LIST){
		//获取最早进口日期
		let earlyObj = getEarliestDataFromList('IE_DATE',orderMsg.DECLARATION_LIST);
		if (!isNullData(earlyObj)) {
			importTime = !isNullData(earlyObj.IE_DATE)?earlyObj.IE_DATE:"";
		}
	}
	
	//1) 航程时间节点数据
    let voyageObj = {};
    //节点显示颜色
    voyageObj.backgroundColor = "#555555";
	voyageObj.backgroundImage = "linear-gradient(to right, #9b86e7, #43d4ff)";
	
	//获取航程开始时间
	if (!isNullData(orderMsg.ATD)) {//实际离港日期有值
		//节点开始时间信息
        voyageObj.startTimeDesc = businessDesc.ATD; 
        voyageObj.startTime = orderMsg.ATD;
        voyageObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ATD);
	} else {
		if (!isNullData(orderMsg.ETD)) {//预计离港日期有值
			//节点开始时间信息
            voyageObj.startTimeDesc = businessDesc.ETD; 
            voyageObj.startTime = orderMsg.ETD;
            voyageObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ETD);
		}else{
			//节点开始时间信息
			voyageObj.startTimeDesc = businessDesc.ATD; 
			voyageObj.startTime = "";
			voyageObj.startDayTime = 0;
		}
	}

	//获取航程结束时间
	if (!isNullData(orderMsg.ATA)) {//实际到港日期有值
        voyageObj.endTimeDesc = businessDesc.ATA;
        voyageObj.endTime = orderMsg.ATA;
		voyageObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ATA);
	} else {
		if (!isNullData(importTime)) {//进口日期有值
            voyageObj.endTimeDesc = businessDesc["DECLARATION_LIST.IE_DATE"];
			voyageObj.endTime = importTime;
			voyageObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,importTime);
		}else{
			if (!isNullData(importTime)) {//预计到港日有值
				voyageObj.endTimeDesc = businessDesc.ETA;
				voyageObj.endTime = orderMsg.ETA;
				voyageObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ETA);
			}else{
				voyageObj.endTimeDesc = businessDesc.ATA;
                voyageObj.endTime = "";
                voyageObj.endDayTime = 0;
			}
		}
	}

	//开始时间、结束时间有无值判断
    if (!isNullData(voyageObj.startTime) && !isNullData(voyageObj.endTime)) {
		//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
		voyageObj.showStatus = 0; 
		//节点显示总时间及标题
        voyageObj.showTotalTime = Math.floor((voyageObj.endDayTime - voyageObj.startDayTime)*10)/10,
        voyageObj.showTitle = i18n.t('message.businessDetail.transit')+voyageObj.showTotalTime+"D";//节点上显示内容
	}else if (!isNullData(voyageObj.startTime) && isNullData(voyageObj.endTime)) {
		//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
		voyageObj.showStatus = 1; 
		//节点显示总时间及标题
		voyageObj.showTotalTime = 0,
		voyageObj.showTitle = i18n.t('message.businessDetail.transit');//节点上显示内容
	}else if (isNullData(voyageObj.startTime) && isNullData(voyageObj.endTime)) {
		//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
		voyageObj.showStatus = 2; 
		//节点显示总时间及标题
		voyageObj.showTotalTime = 0,
		voyageObj.showTitle = i18n.t('message.businessDetail.transit');//节点上显示内容
	}else {
		//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
		voyageObj.showStatus = 3; 
		//节点显示总时间及标题
		voyageObj.showTotalTime = 0,
		voyageObj.showTitle = i18n.t('message.businessDetail.transit');//节点上显示内容
	}
	importTimeObj.showMsgList.push(voyageObj);

    //2) 目的港操作时间节点数据
    let destPortObj = {};
    //节点显示颜色
    destPortObj.backgroundColor = "#555555";
	destPortObj.backgroundImage = "linear-gradient(to right, #82d5db, #ced37c)";
	
	//获取目的港开始时间
	if (!isNullData(orderMsg.ATA)) {//实际到港日期有值
		//节点开始时间信息
        destPortObj.startTimeDesc = businessDesc.ATA; 
        destPortObj.startTime = orderMsg.ATA;
        destPortObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ATA);
	} else {
		if (!isNullData(importTime)) {//进口日期有值
			//节点开始时间信息
            destPortObj.startTimeDesc = businessDesc["DECLARATION_LIST.IE_DATE"];
			destPortObj.startTime = importTime;
			destPortObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,importTime);
		}else{
			//节点开始时间信息
			destPortObj.startTimeDesc = businessDesc.ATA; 
			destPortObj.startTime = "";
			destPortObj.startDayTime = 0;
		}
	}

	//获取目的港结束时间
	if (!isNullData(orderMsg.TRANS_DATE)) {//运输完成日期有值
		//节点开始时间信息
        destPortObj.endTimeDesc = businessDesc.TRANS_DATE; 
        destPortObj.endTime = orderMsg.TRANS_DATE;
        destPortObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.TRANS_DATE);
	}else{
		destPortObj.endTimeDesc = businessDesc.TRANS_DATE;
		destPortObj.endTime = "";
		destPortObj.endDayTime = 0;
	}

	//开始时间、结束时间有无值判断
    if (!isNullData(destPortObj.startTime) && !isNullData(destPortObj.endTime)) {
		//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
		destPortObj.showStatus = 0; 
		//节点显示总时间及标题
        destPortObj.showTotalTime = Math.floor((destPortObj.endDayTime - destPortObj.startDayTime)*10)/10,
        destPortObj.showTitle = i18n.t('message.businessDetail.destinationOpsPad')+destPortObj.showTotalTime+"D";//节点上显示内容
	}else if (!isNullData(destPortObj.startTime) && isNullData(destPortObj.endTime)) {
		//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
		destPortObj.showStatus = 1; 
		//节点显示总时间及标题
		destPortObj.showTotalTime = 0,
		destPortObj.showTitle = i18n.t('message.businessDetail.destinationOpsPad');//节点上显示内容
	}else if (isNullData(destPortObj.startTime) && isNullData(destPortObj.endTime)) {
		//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
		destPortObj.showStatus = 2; 
		//节点显示总时间及标题
		destPortObj.showTotalTime = 0,
		destPortObj.showTitle = i18n.t('message.businessDetail.destinationOpsPad');//节点上显示内容
	}else {
		//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
		destPortObj.showStatus = 3; 
		//节点显示总时间及标题
		destPortObj.showTotalTime = 0,
		destPortObj.showTitle = i18n.t('message.businessDetail.destinationOpsPad');//节点上显示内容
	}
	importTimeObj.showMsgList.push(destPortObj);

    let nodeTips = [];
    nodeTips.push(i18n.t('message.businessDetail.transitTime')+"="+voyageObj.endTimeDesc+"-"+voyageObj.startTimeDesc);
    // if(destPortObj.showStatus != 2){
        let destPortTip = i18n.t('message.businessDetail.destinationOpsPadTime')+"="+destPortObj.endTimeDesc+"-"+destPortObj.startTimeDesc;
        nodeTips.push(destPortTip);
    // }
    importTimeObj.nodeTips = nodeTips;

    timeNodeList.push(importTimeObj);

    //1) 航程时间节点数据
    // let voyageObj = {};
    // //节点显示颜色
    // voyageObj.backgroundColor = "#555555";
    // voyageObj.backgroundImage = "linear-gradient(to right, #9b86e7, #43d4ff)";
    // //实际离港日期、实际到港日期都存在
    // if (!isNullData(orderMsg.ATD) && !isNullData(orderMsg.ATA)) {
    //     //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
    //     voyageObj.showStatus = 0; 
    //     //节点开始时间信息
    //     voyageObj.startTimeDesc = businessDesc.ATD; 
    //     voyageObj.startTime = orderMsg.ATD;
    //     voyageObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ATD);
    //     //节点结束时间信息
    //     voyageObj.endTimeDesc = businessDesc.ATA;
    //     voyageObj.endTime = orderMsg.ATA;
    //     voyageObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ATA);
    //     //节点显示总时间及标题
    //     voyageObj.showTotalTime = Math.floor((voyageObj.endDayTime - voyageObj.startDayTime)*10)/10,
    //     voyageObj.showTitle = i18n.t('message.businessDetail.transit')+voyageObj.showTotalTime+"D";//节点上显示内容
    //     importTimeObj.showMsgList.push(voyageObj);
    // }else{
    //     //预计离港日期、预计到港日期都存在
    //     if (!isNullData(orderMsg.ETD) && !isNullData(orderMsg.ETA)) {
    //         //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在 
    //         voyageObj.showStatus = 0; 
    //         //节点开始时间信息
    //         voyageObj.startTimeDesc = businessDesc.ETD; 
    //         voyageObj.startTime = orderMsg.ETD;
    //         voyageObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ETD);
    //         //节点结束时间信息
    //         voyageObj.endTimeDesc = businessDesc.ETA;
    //         voyageObj.endTime = orderMsg.ETA;
    //         voyageObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ETA);
    //         //节点显示总时间及标题
    //         voyageObj.showTotalTime = Math.floor((voyageObj.endDayTime - voyageObj.startDayTime)*10)/10,
    //         voyageObj.showTitle = i18n.t('message.businessDetail.transit')+voyageObj.showTotalTime+"D";//节点上显示内容
    //         importTimeObj.showMsgList.push(voyageObj);
    //     }else{
    //         if (!isNullData(orderMsg.ATD)) {
    //             //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
    //             voyageObj.showStatus = 1; 
    //             //节点开始时间信息
    //             voyageObj.startTimeDesc = businessDesc.ATD; 
    //             voyageObj.startTime = orderMsg.ATD;
    //             voyageObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ATD);
    //             //节点结束时间信息
    //             voyageObj.endTimeDesc = businessDesc.ATA;
    //             voyageObj.endTime = "";
    //             voyageObj.endDayTime = 0;
    //             //节点显示总时间及标题
    //             voyageObj.showTotalTime = 0,
    //             voyageObj.showTitle = i18n.t('message.businessDetail.transit');//节点上显示内容
    //             importTimeObj.showMsgList.push(voyageObj);
    //         }else{
    //             if (!isNullData(orderMsg.ETD)) {
    //                 //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
    //                 voyageObj.showStatus = 1; 
    //                 //节点开始时间信息
    //                 voyageObj.startTimeDesc = businessDesc.ETD; 
    //                 voyageObj.startTime = orderMsg.ETD;
    //                 voyageObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ETD);
    //                 //节点结束时间信息
    //                 voyageObj.endTimeDesc = businessDesc.ETA;
    //                 voyageObj.endTime = "";
    //                 voyageObj.endDayTime = 0;
    //                 //节点显示总时间及标题
    //                 voyageObj.showTotalTime = 0,
    //                 voyageObj.showTitle = i18n.t('message.businessDetail.transit');//节点上显示内容
    //                 importTimeObj.showMsgList.push(voyageObj);
    //             }else{
	// 				if (!isNullData(orderMsg.ATA)) {
	// 					//实际、预计离港到港日期都没有，暂不处理，显示为空
	// 					//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在 3:开始日期没有、结束日期存在
	// 					voyageObj.showStatus = 3; 
	// 					//节点开始时间信息
	// 					voyageObj.startTimeDesc = businessDesc.ATD; 
	// 					voyageObj.startTime = "";
	// 					voyageObj.startDayTime = 0;
	// 					//节点结束时间信息
	// 					voyageObj.endTimeDesc = businessDesc.ATA;
	// 					voyageObj.endTime = orderMsg.ATA;
	// 					voyageObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ATA);
	// 					//节点显示总时间及标题
	// 					voyageObj.showTotalTime = 0,
	// 					voyageObj.showTitle = i18n.t('message.businessDetail.transit');//节点上显示内容
	// 					importTimeObj.showMsgList.push(voyageObj);
	// 				}else{
	// 					//实际、预计离港到港日期都没有，暂不处理，显示为空
	// 					//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
	// 					voyageObj.showStatus = 2; 
	// 					//节点开始时间信息
	// 					voyageObj.startTimeDesc = businessDesc.ATD; 
	// 					voyageObj.startTime = "";
	// 					voyageObj.startDayTime = 0;
	// 					//节点结束时间信息
	// 					voyageObj.endTimeDesc = businessDesc.ATA;
	// 					voyageObj.endTime = "";
	// 					voyageObj.endDayTime = 0;
	// 					//节点显示总时间及标题
	// 					voyageObj.showTotalTime = 0,
	// 					voyageObj.showTitle = i18n.t('message.businessDetail.transit');//节点上显示内容
	// 					importTimeObj.showMsgList.push(voyageObj);
	// 				}
                    
    //             }
    //         }
    //     }
    // }

    // //2) 目的港操作时间节点数据
    // let destPortObj = {};
    // //节点显示颜色
    // destPortObj.backgroundColor = "#555555";
    // destPortObj.backgroundImage = "linear-gradient(to right, #82d5db, #ced37c)";
    // //运输完成日期、实际到港日期都存在
    // if (!isNullData(orderMsg.TRANS_DATE) && !isNullData(orderMsg.ATA)) {
    //     //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
    //     destPortObj.showStatus = 0; 
    //     //节点开始时间信息
    //     destPortObj.startTimeDesc = businessDesc.ATA; 
    //     destPortObj.startTime = orderMsg.ATA;
    //     destPortObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ATA);
    //     //节点结束时间信息
    //     destPortObj.endTimeDesc = businessDesc.TRANS_DATE;//businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_FIN_DATE"]
    //     destPortObj.endTime = orderMsg.TRANS_DATE;//deliveryTimeMsg.validEndTime;
    //     destPortObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.TRANS_DATE);
    //     //节点显示总时间及标题
    //     destPortObj.showTotalTime = Math.floor((destPortObj.endDayTime - destPortObj.startDayTime)*10)/10,
    //     destPortObj.showTitle = i18n.t('message.businessDetail.destinationOpsPad')+destPortObj.showTotalTime+"D";//节点上显示内容
    //     importTimeObj.showMsgList.push(destPortObj);
    // }else if (isNullData(orderMsg.TRANS_DATE) && !isNullData(orderMsg.ATA)){
    //     //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
    //     destPortObj.showStatus = 1; 
    //     //节点开始时间信息
    //     destPortObj.startTimeDesc = businessDesc.ATA; 
    //     destPortObj.startTime = orderMsg.ATA;
    //     destPortObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ATA);
    //     //节点结束时间信息
    //     destPortObj.endTimeDesc = businessDesc.TRANS_DATE;//businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_FIN_DATE"]
    //     destPortObj.endTime = "";
    //     destPortObj.endDayTime = 0;
    //     //节点显示总时间及标题
    //     destPortObj.showTotalTime = 0,
    //     destPortObj.showTitle = i18n.t('message.businessDetail.destinationOpsPad');
    //     importTimeObj.showMsgList.push(destPortObj);
    // }else{
	// 	if (!isNullData(orderMsg.TRANS_DATE) && isNullData(orderMsg.ATA)){
	// 		//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
	// 		destPortObj.showStatus = 3; 
	// 		//节点开始时间信息
	// 		destPortObj.startTimeDesc = businessDesc.ATA; 
	// 		destPortObj.startTime = "";
	// 		destPortObj.startDayTime = voyageObj.endDayTime;
	// 		//节点结束时间信息
	// 		destPortObj.endTimeDesc = businessDesc.TRANS_DATE;//businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_FIN_DATE"]
	// 		destPortObj.endTime = orderMsg.TRANS_DATE;//deliveryTimeMsg.validEndTime;
	// 		destPortObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.TRANS_DATE);
	// 		//节点显示总时间及标题
	// 		destPortObj.showTotalTime = 0,
	// 		destPortObj.showTitle = i18n.t('message.businessDetail.destinationOpsPad');
	// 		importTimeObj.showMsgList.push(destPortObj);
	// 	}else{
	// 		//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
	// 		destPortObj.showStatus = 2; 
	// 		//节点开始时间信息
	// 		destPortObj.startTimeDesc = isNullData(voyageObj.endTime)?businessDesc.ATA:voyageObj.endTimeDesc;
	// 		destPortObj.startTime = isNullData(voyageObj.endTime)?"":voyageObj.endTime;
	// 		destPortObj.startDayTime = isNullData(voyageObj.endTime)?0:voyageObj.endDayTime;
	// 		//节点结束时间信息
	// 		destPortObj.endTimeDesc = businessDesc.TRANS_DATE;//businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_FIN_DATE"]
	// 		destPortObj.endTime = "";
	// 		destPortObj.endDayTime = 0;
	// 		//节点显示总时间及标题
	// 		destPortObj.showTotalTime = 0,
	// 		destPortObj.showTitle = i18n.t('message.businessDetail.destinationOpsPad');
	// 		importTimeObj.showMsgList.push(destPortObj);
	// 	}
        
    // }
    // let nodeTips = [];
    // nodeTips.push(i18n.t('message.businessDetail.transitTime')+"="+voyageObj.endTimeDesc+"-"+voyageObj.startTimeDesc);
    // // if(destPortObj.showStatus != 2){
    //     let destPortTip = i18n.t('message.businessDetail.destinationOpsPadTime')+"="+destPortObj.endTimeDesc+"-"+destPortObj.startTimeDesc;
    //     nodeTips.push(destPortTip);
    // // }
    // importTimeObj.nodeTips = nodeTips;

    // timeNodeList.push(importTimeObj);

    //二、航程数据
    let voyageTimeObj = {};
    voyageTimeObj.nodeTitle = i18n.t('message.businessDetail.transit');
    voyageTimeObj.nodeTips = [i18n.t('message.businessDetail.transitTime')+" = "+ voyageObj.endTimeDesc+" - "+voyageObj.startTimeDesc];
    let voyageNewObj = JSON.parse(JSON.stringify(voyageObj));
    if (voyageObj.showTotalTime>0) {
        voyageNewObj.showTitle = voyageNewObj.showTotalTime+"D";
    }
    voyageTimeObj.showMsgList = [voyageNewObj];
    timeNodeList.push(voyageTimeObj);
    
    //三、订单、换单、通关、运输节点显示数据
    let stepTitles = getTotalStepsTitle(orderMsg,false);
    stepTitles.forEach(title => {
        switch (title) {
            case i18n.t('message.businessSearch.order'):{
                let orderTimeObj = {};
                orderTimeObj.nodeTitle = title;
                orderTimeObj.nodeTips = [i18n.t('message.businessDetail.orderProcessTime')+" = "+ businessDesc.DZQQ_DATE+" - "+businessDesc.ACCEPT_DATE];
				orderTimeObj.showMsgList = [];
				
                let orderObj = {};
                //节点显示颜色
                orderObj.backgroundColor = "#555555";
                orderObj.backgroundImage = "linear-gradient(to right, #f5ce55, #fda832)";
                //客户委托日期、单证齐全日期都存在
                if(!isNullData(orderMsg.ACCEPT_DATE) && !isNullData(orderMsg.DZQQ_DATE)){
                    //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                    orderObj.showStatus = 0; 
                    //节点开始时间信息
                    orderObj.startTimeDesc = businessDesc.ACCEPT_DATE; 
                    orderObj.startTime = orderMsg.ACCEPT_DATE;
                    orderObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ACCEPT_DATE);
                    //节点结束时间信息
                    orderObj.endTimeDesc = businessDesc.DZQQ_DATE
                    orderObj.endTime = orderMsg.DZQQ_DATE;
                    orderObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.DZQQ_DATE);
                    //节点显示总时间及标题
                    orderObj.showTotalTime = Math.floor((orderObj.endDayTime - orderObj.startDayTime)*10)/10,
                    orderObj.showTitle = orderObj.showTotalTime+"D";//节点上显示内容
                    orderTimeObj.showMsgList.push(orderObj);
                }else if(!isNullData(orderMsg.ACCEPT_DATE) && isNullData(orderMsg.DZQQ_DATE)){
                    //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                    orderObj.showStatus = 1; 
                    //节点开始时间信息
                    orderObj.startTimeDesc = businessDesc.ACCEPT_DATE; 
                    orderObj.startTime = orderMsg.ACCEPT_DATE;
                    orderObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ACCEPT_DATE);
                    //节点结束时间信息
                    orderObj.endTimeDesc = businessDesc.DZQQ_DATE;
                    orderObj.endTime = "";
                    orderObj.endDayTime = 0;
                    //节点显示总时间及标题
                    orderObj.showTotalTime = 0,
                    orderObj.showTitle = "";//节点上显示内容
                    orderTimeObj.showMsgList.push(orderObj);
                }else if(isNullData(orderMsg.ACCEPT_DATE) && !isNullData(orderMsg.DZQQ_DATE)){
                    //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                    orderObj.showStatus = 3; 
                    //节点开始时间信息
                    orderObj.startTimeDesc = businessDesc.ACCEPT_DATE; 
                    orderObj.startTime = "";
                    orderObj.startDayTime = 0;
                    //节点结束时间信息
                    orderObj.endTimeDesc = businessDesc.DZQQ_DATE
                    orderObj.endTime = orderMsg.DZQQ_DATE;
                    orderObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.DZQQ_DATE);
                    //节点显示总时间及标题
                    orderObj.showTotalTime = 0,
                    orderObj.showTitle = "";//节点上显示内容
                    orderTimeObj.showMsgList.push(orderObj);
                }else{
                    //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                    orderObj.showStatus = 2; 
                    //节点开始时间信息
                    orderObj.startTimeDesc = businessDesc.ACCEPT_DATE; 
                    orderObj.startTime = "";
                    orderObj.startDayTime = 0;
                    //节点结束时间信息
                    orderObj.endTimeDesc = businessDesc.DZQQ_DATE;
                    orderObj.endTime = "";
                    orderObj.endDayTime = 0;
                    //节点显示总时间及标题
                    orderObj.showTotalTime = 0,
                    orderObj.showTitle = "";//节点上显示内容
                    orderTimeObj.showMsgList.push(orderObj);
                }
                timeNodeList.push(orderTimeObj);
            }
                break;
            case i18n.t('message.businessSearch.changeOrder'):{
                let changeOrderTimeObj = {};
                changeOrderTimeObj.nodeTitle = title;
                changeOrderTimeObj.nodeTips = [i18n.t('message.businessDetail.timeofExchange')+" = "+ businessDesc.FIN_SWITCH_BILL_DATE+" - "+businessDesc.FST_SWITCH_BILL_DATE];
                changeOrderTimeObj.showMsgList = [];

                let changeOrderObj = {};
                //节点显示颜色
                changeOrderObj.backgroundColor = "#555555";
                changeOrderObj.backgroundImage = "linear-gradient(to right, #fcac36 , #fcb095)";
                //换单日期、头程换单日期都存在
                if(!isNullData(orderMsg.FST_SWITCH_BILL_DATE) && !isNullData(orderMsg.FIN_SWITCH_BILL_DATE)){
                    //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                    changeOrderObj.showStatus = 0; 
                    //节点开始时间信息
                    changeOrderObj.startTimeDesc = businessDesc.FST_SWITCH_BILL_DATE; 
                    changeOrderObj.startTime = orderMsg.FST_SWITCH_BILL_DATE;
                    changeOrderObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.FST_SWITCH_BILL_DATE);
                    //节点结束时间信息
                    changeOrderObj.endTimeDesc = businessDesc.FIN_SWITCH_BILL_DATE
                    changeOrderObj.endTime = orderMsg.FIN_SWITCH_BILL_DATE;
                    changeOrderObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.FIN_SWITCH_BILL_DATE);
                    //节点显示总时间及标题
                    changeOrderObj.showTotalTime = Math.floor((changeOrderObj.endDayTime - changeOrderObj.startDayTime)*10)/10,
                    changeOrderObj.showTitle = changeOrderObj.showTotalTime+"D";//节点上显示内容
                    changeOrderTimeObj.showMsgList.push(changeOrderObj);
                }else if(!isNullData(orderMsg.FST_SWITCH_BILL_DATE) && isNullData(orderMsg.FIN_SWITCH_BILL_DATE)){
                    //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                    changeOrderObj.showStatus = 1; 
                    //节点开始时间信息
                    changeOrderObj.startTimeDesc = businessDesc.FST_SWITCH_BILL_DATE; 
                    changeOrderObj.startTime = orderMsg.FST_SWITCH_BILL_DATE;
                    changeOrderObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.FST_SWITCH_BILL_DATE);
                    //节点结束时间信息
                    changeOrderObj.endTimeDesc = businessDesc.FIN_SWITCH_BILL_DATE;
                    changeOrderObj.endTime = "";
                    changeOrderObj.endDayTime = 0;
                    //节点显示总时间及标题
                    changeOrderObj.showTotalTime = 0,
                    changeOrderObj.showTitle = "";//节点上显示内容
                    changeOrderTimeObj.showMsgList.push(changeOrderObj);
                }else if(isNullData(orderMsg.FST_SWITCH_BILL_DATE) && !isNullData(orderMsg.FIN_SWITCH_BILL_DATE)){
                    //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                    changeOrderObj.showStatus = 3; 
                    //节点开始时间信息
                    changeOrderObj.startTimeDesc = businessDesc.FST_SWITCH_BILL_DATE; 
                    changeOrderObj.startTime = "";
                    changeOrderObj.startDayTime = 0;
                    //节点结束时间信息
                    changeOrderObj.endTimeDesc = businessDesc.FIN_SWITCH_BILL_DATE
                    changeOrderObj.endTime = orderMsg.FIN_SWITCH_BILL_DATE;
                    changeOrderObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.FIN_SWITCH_BILL_DATE);
                    //节点显示总时间及标题
                    changeOrderObj.showTotalTime = 0,
                    changeOrderObj.showTitle = "";//节点上显示内容
                    changeOrderTimeObj.showMsgList.push(changeOrderObj);
                }else{
                    //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                    changeOrderObj.showStatus = 2; 
                    //节点开始时间信息
                    changeOrderObj.startTimeDesc = businessDesc.FST_SWITCH_BILL_DATE; 
                    changeOrderObj.startTime = "";
                    changeOrderObj.startDayTime = 0;
                    //节点结束时间信息
                    changeOrderObj.endTimeDesc = businessDesc.FIN_SWITCH_BILL_DATE;
                    changeOrderObj.endTime = "";
                    changeOrderObj.endDayTime = 0;
                    //节点显示总时间及标题
                    changeOrderObj.showTotalTime = 0,
                    changeOrderObj.showTitle = "";//节点上显示内容
                    changeOrderTimeObj.showMsgList.push(changeOrderObj);
                }

                timeNodeList.push(changeOrderTimeObj);
            }
                break;
            case i18n.t('message.businessSearch.customs'):{

				//取最近通关货物放行日期
				let fx_date = orderMsg.FX_DATE; 
                //报关节点 最小申报日期获取
                if(isNullData(fx_date) && orderMsg.DECLARATION_LIST){
					//获取最晚通关货物放行日期
					let recObj = getRecentlyDataFromList('FXDATE',orderMsg.DECLARATION_LIST);
                    fx_date = !isNullData(recObj.FXDATE)?recObj.FXDATE:"";
				}
				
                let customsTimeObj = {};
                customsTimeObj.nodeTitle = title;
                customsTimeObj.showMsgList = [];

                let customsObj = {};
                //节点显示颜色
                customsObj.backgroundColor = "#555555";
                customsObj.backgroundImage = "linear-gradient(to right, #fec196, #f4688e)";
                if(!isNullData(orderMsg.DZQQ_DATE)){
                    if(!isNullData(orderMsg.BG_DATE)){
                        //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                        customsObj.showStatus = 0; 
                        //节点开始时间信息
                        customsObj.startTimeDesc = businessDesc.DZQQ_DATE; 
                        customsObj.startTime = orderMsg.DZQQ_DATE;
                        customsObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.DZQQ_DATE);
                        //节点结束时间信息
                        customsObj.endTimeDesc = businessDesc.BG_DATE
                        customsObj.endTime = orderMsg.BG_DATE;
                        customsObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.BG_DATE);
                        //节点显示总时间及标题
                        customsObj.showTotalTime = Math.floor((customsObj.endDayTime - customsObj.startDayTime)*10)/10,
                        customsObj.showTitle = customsObj.showTotalTime+"D";//节点上显示内容
						customsTimeObj.showMsgList.push(customsObj);
						customsTimeObj.nodeTips = [i18n.t('message.businessDetail.timeofCustomsClearance')+" = "+ businessDesc.BG_DATE+" - "+businessDesc.DZQQ_DATE];
                    }else{
						if (!isNullData(fx_date)) {
							//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
							customsObj.showStatus = 0; 
							//节点开始时间信息
							customsObj.startTimeDesc = businessDesc.DZQQ_DATE; 
							customsObj.startTime = orderMsg.DZQQ_DATE;
							customsObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.DZQQ_DATE);
							//节点结束时间信息
							customsObj.endTimeDesc = businessDesc["DECLARATION_LIST.FXDATE"]
							customsObj.endTime = fx_date;
							customsObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,fx_date);;
							//节点显示总时间及标题
							customsObj.showTotalTime = Math.floor((customsObj.endDayTime - customsObj.startDayTime)*10)/10,
							customsObj.showTitle = customsObj.showTotalTime+"D";//节点上显示内容
							customsTimeObj.showMsgList.push(customsObj);
							customsTimeObj.nodeTips = [i18n.t('message.businessDetail.timeofCustomsClearance')+" = "+ businessDesc["DECLARATION_LIST.FXDATE"]+" - "+businessDesc.DZQQ_DATE];
						} else {
							//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
							customsObj.showStatus = 1; 
							//节点开始时间信息
							customsObj.startTimeDesc = businessDesc.DZQQ_DATE; 
							customsObj.startTime = orderMsg.DZQQ_DATE;
							customsObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.DZQQ_DATE);
							//节点结束时间信息
							customsObj.endTimeDesc = businessDesc.BG_DATE
							customsObj.endTime = "";
							customsObj.endDayTime = 0;
							//节点显示总时间及标题
							customsObj.showTotalTime = 0,
							customsObj.showTitle = "";//节点上显示内容
							customsTimeObj.showMsgList.push(customsObj);
							customsTimeObj.nodeTips = [i18n.t('message.businessDetail.timeofCustomsClearance')+" = "+ businessDesc.BG_DATE+" - "+businessDesc.DZQQ_DATE];
						}
                    }
                }else{
                    let sb_date = '';
                    //报关节点 最小申报日期获取
                    if(orderMsg.DECLARATION_LIST){
                        //申报日期 通关货物放行日期 有值，取最小申报日期
                        orderMsg.DECLARATION_LIST.forEach(element => {
                            if(!isNullData(element.SBDATE)){
                                if(isNullData(sb_date)){
                                    sb_date = element.SBDATE;
                                }else{
                                    if (timeStrToTimestamp(sb_date) >= timeStrToTimestamp(element.SBDATE)) {
                                        sb_date = element.SBDATE;
                                    }
                                }
                            }
                        });
                    }
                    if(!isNullData(sb_date)){
                        if(!isNullData(orderMsg.BG_DATE)){
                            //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                            customsObj.showStatus = 0; 
                            //节点开始时间信息
                            customsObj.startTimeDesc = businessDesc["DECLARATION_LIST.SBDATE"]; 
                            customsObj.startTime = sb_date;
                            customsObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,sb_date);
                            //节点结束时间信息
                            customsObj.endTimeDesc = businessDesc.BG_DATE;
                            customsObj.endTime = orderMsg.BG_DATE;
                            customsObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.BG_DATE);
                            //节点显示总时间及标题
                            customsObj.showTotalTime = Math.floor((customsObj.endDayTime - customsObj.startDayTime)*10)/10,
                            customsObj.showTitle = customsObj.showTotalTime+"D";//节点上显示内容
							customsTimeObj.showMsgList.push(customsObj);
							customsTimeObj.nodeTips = [i18n.t('message.businessDetail.timeofCustomsClearance')+" = "+ businessDesc.BG_DATE+" - "+businessDesc["DECLARATION_LIST.SBDATE"]];
                        }else{
							if (!isNullData(fx_date)) {
								//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
								customsObj.showStatus = 0; 
								//节点开始时间信息
								customsObj.startTimeDesc = businessDesc["DECLARATION_LIST.SBDATE"]; 
								customsObj.startTime = sb_date;
								customsObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,sb_date);
								//节点结束时间信息
								customsObj.endTimeDesc = businessDesc["DECLARATION_LIST.FXDATE"]
								customsObj.endTime = fx_date;
								customsObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,fx_date);;
								//节点显示总时间及标题
								customsObj.showTotalTime = Math.floor((customsObj.endDayTime - customsObj.startDayTime)*10)/10,
								customsObj.showTitle = customsObj.showTotalTime+"D";//节点上显示内容
								customsTimeObj.showMsgList.push(customsObj);
								customsTimeObj.nodeTips = [i18n.t('message.businessDetail.timeofCustomsClearance')+" = "+ businessDesc["DECLARATION_LIST.FXDATE"]+" - "+businessDesc["DECLARATION_LIST.SBDATE"]];
							} else {
								//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
								customsObj.showStatus = 1; 
								//节点开始时间信息
								customsObj.startTimeDesc = businessDesc["DECLARATION_LIST.SBDATE"]; 
								customsObj.startTime = sb_date;
								customsObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,sb_date);
								//节点结束时间信息
								customsObj.endTimeDesc = businessDesc.BG_DATE;
								customsObj.endTime = "";
								customsObj.endDayTime = 0;
								//节点显示总时间及标题
								customsObj.showTotalTime = 0,
								customsObj.showTitle = "";//节点上显示内容
								customsTimeObj.showMsgList.push(customsObj);
								customsTimeObj.nodeTips = [i18n.t('message.businessDetail.timeofCustomsClearance')+" = "+ businessDesc.BG_DATE+" - "+businessDesc["DECLARATION_LIST.SBDATE"]];
							}
						}
                    }else{
						if(!isNullData(orderMsg.BG_DATE)){
                            //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                            customsObj.showStatus = 3; 
                            //节点开始时间信息
                            customsObj.startTimeDesc = businessDesc.DZQQ_DATE; 
                            customsObj.startTime = "";
							customsObj.startDayTime = 0;
                            //节点结束时间信息
                            customsObj.endTimeDesc = businessDesc.BG_DATE;
                            customsObj.endTime = orderMsg.BG_DATE;
                            customsObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.BG_DATE);
                            //节点显示总时间及标题
                            customsObj.showTotalTime = 0,
                            customsObj.showTitle = "";//节点上显示内容
							customsTimeObj.showMsgList.push(customsObj);
							customsTimeObj.nodeTips = [i18n.t('message.businessDetail.timeofCustomsClearance')+" = "+ businessDesc.BG_DATE+" - "+businessDesc.DZQQ_DATE];
                        }else{
							if (!isNullData(fx_date)) {
								//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
								customsObj.showStatus = 3; 
								//节点开始时间信息
								customsObj.startTimeDesc = businessDesc.DZQQ_DATE; 
								customsObj.startTime = "";
								customsObj.startDayTime = 0;
								//节点结束时间信息
								customsObj.endTimeDesc = businessDesc["DECLARATION_LIST.FXDATE"]
								customsObj.endTime = fx_date;
								customsObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,fx_date);;
								//节点显示总时间及标题
								customsObj.showTotalTime = 0,
                            	customsObj.showTitle = "";//节点上显示内容
								customsTimeObj.showMsgList.push(customsObj);
								customsTimeObj.nodeTips = [i18n.t('message.businessDetail.timeofCustomsClearance')+" = "+ businessDesc["DECLARATION_LIST.FXDATE"]+" - "+businessDesc.DZQQ_DATE];
							} else {
								//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
								customsObj.showStatus = 2; 
								//节点开始时间信息
								customsObj.startTimeDesc = businessDesc.DZQQ_DATE; 
								customsObj.startTime = "";
								customsObj.startDayTime = 0;
								//节点结束时间信息
								customsObj.endTimeDesc = businessDesc.BG_DATE;
								customsObj.endTime = "";
								customsObj.endDayTime = 0;
								//节点显示总时间及标题
								customsObj.showTotalTime = 0,
								customsObj.showTitle = "";//节点上显示内容
								customsTimeObj.showMsgList.push(customsObj);
								customsTimeObj.nodeTips = [i18n.t('message.businessDetail.timeofCustomsClearance')+" = "+ businessDesc.BG_DATE+" - "+businessDesc.DZQQ_DATE];
							}
                        }
                    }
                }
                timeNodeList.push(customsTimeObj);
            }
                break;
            case i18n.t('message.businessSearch.trans'):{
                let transTimeObj = {};
                transTimeObj.nodeTitle = title;
                transTimeObj.showMsgList = [];

                let transObj = {};
                //节点显示颜色
                transObj.backgroundColor = "#555555";
                transObj.backgroundImage = "linear-gradient(to right, #f56a8e, #c4a3f1)";
                //获取最小运输委托日期
                let transSubDate = '';
                if(orderMsg.ORDER_SERVE_TRANSPORT_LIST){
                    //运输委托日期 有值，则认为存在运输业务，显示运输节点
                    orderMsg.ORDER_SERVE_TRANSPORT_LIST.forEach(element => {
                        if(!isNullData(element.TRANS_SUB_DATE)){
                            if(isNullData(transSubDate)){
                                transSubDate = element.TRANS_SUB_DATE;
                            }else{
                                if (timeStrToTimestamp(transSubDate) >= timeStrToTimestamp(element.TRANS_SUB_DATE)) {
                                    transSubDate = element.TRANS_SUB_DATE;
                                }
                            }
                        }
                    });
                }
                if(!isNullData(transSubDate)){
                    if(!isNullData(orderMsg.TRANS_DATE)){
                        //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                        transObj.showStatus = 0; 
                        //节点开始时间信息
                        transObj.startTimeDesc = businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_SUB_DATE"]; 
                        transObj.startTime = transSubDate;
                        transObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,transSubDate);
                        //节点结束时间信息
                        transObj.endTimeDesc = businessDesc.TRANS_DATE;
                        transObj.endTime = orderMsg.TRANS_DATE;
                        transObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.TRANS_DATE);
                        //节点显示总时间及标题
                        transObj.showTotalTime = Math.floor((transObj.endDayTime - transObj.startDayTime)*10)/10,
                        transObj.showTitle = transObj.showTotalTime+"D";//节点上显示内容
                        transTimeObj.showMsgList.push(transObj);
                    }else{
                        //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                        transObj.showStatus = 1; 
                        //节点开始时间信息
                        transObj.startTimeDesc = businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_SUB_DATE"]; 
                        transObj.startTime = transSubDate;
                        transObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,transSubDate);
                        //节点结束时间信息
                        transObj.endTimeDesc = businessDesc.TRANS_DATE;
                        transObj.endTime = "";
                        transObj.endDayTime = 0;
                        //节点显示总时间及标题
                        transObj.showTotalTime = 0,
                        transObj.showTitle = "";//节点上显示内容
                        transTimeObj.showMsgList.push(transObj);
                    }
                    transTimeObj.nodeTips = [i18n.t('message.businessDetail.leadTimeofTransport')+" = "+ businessDesc.TRANS_DATE+" - "+businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_SUB_DATE"]];
                }else{
					if(!isNullData(orderMsg.TRANS_DATE)){
                        //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                        transObj.showStatus = 3; 
                        //节点开始时间信息
                        transObj.startTimeDesc = businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_SUB_DATE"]; 
                        transObj.startTime = "";
                        transObj.startDayTime = 0;
                        //节点结束时间信息
                        transObj.endTimeDesc = businessDesc.TRANS_DATE;
                        transObj.endTime = orderMsg.TRANS_DATE;
                        transObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.TRANS_DATE);
                        //节点显示总时间及标题
                        transObj.showTotalTime = 0,
                        transObj.showTitle = "";//节点上显示内容
                        transTimeObj.showMsgList.push(transObj);
                    }else{
						//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
						transObj.showStatus = 2; 
						//节点开始时间信息
						transObj.startTimeDesc = businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_SUB_DATE"]; 
						transObj.startTime = "";
						transObj.startDayTime = 0;
						//节点结束时间信息
						transObj.endTimeDesc = businessDesc.TRANS_DATE;
						transObj.endTime = "";
						transObj.endDayTime = 0;
						//节点显示总时间及标题
						transObj.showTotalTime = 0,
						transObj.showTitle = "";//节点上显示内容
						transTimeObj.showMsgList.push(transObj);
					}
                    
                    transTimeObj.nodeTips = [i18n.t('message.businessDetail.leadTimeofTransport')+" = "+ businessDesc.TRANS_DATE+" - "+businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_SUB_DATE"]];
                }
                timeNodeList.push(transTimeObj);
            }
                break;
        
            default:
                break;
        }
    });

    return timeNodeList;
}

/**
 * 获取出口订单每个阶段时间显示信息内容
 * @param {订单信息} orderMsg 
 * @param {业务字段名称} businessDesc 
 * @param {订单类型} orderType 
 */
function getExoprtShowTimeList(orderMsg,businessDesc,orderType,deliveryTimeMsg){
    let timeNodeList = [];

	//获取货物实际送达日期
	// let transObj = getRecentlyDataFromList('TRANS_FIN_DATE',orderMsg.ORDER_SERVE_TRANSPORT_LIST);

	// let transDate = null;
	// if(transObj !== null){
	// 	transDate
	// }
	// if(orderMsg.ORDER_SERVE_TRANSPORT_LIST){
	// 	//运输委托日期 有值，则认为存在运输业务，显示运输节点
	// 	orderMsg.ORDER_SERVE_TRANSPORT_LIST.forEach(element => {
	// 		if(!isNullData(element.TRANS_SUB_DATE)){
	// 			if(isNullData(transSubDate)){
	// 				transSubDate = element.TRANS_SUB_DATE;
	// 			}else{
	// 				if (timeStrToTimestamp(transSubDate) >= timeStrToTimestamp(element.TRANS_SUB_DATE)) {
	// 					transSubDate = element.TRANS_SUB_DATE;
	// 				}
	// 			}
	// 		}
	// 	});
	// }

    //一、出货时间总览数据
    let exportTimeObj = {};
    exportTimeObj.nodeTitle = i18n.t('message.businessDetail.outboundLeadTime');
    let nodeTips = [];
    exportTimeObj.showMsgList = [];
    //1) 启运港操作节点数据
    let shipPortObj = {};
    //节点显示颜色
    shipPortObj.backgroundColor = "#555555";
    shipPortObj.backgroundImage = "linear-gradient(to right, #94d7aa, #7fe9df)";
    //客户委托日期、货物实际送达启运港日期都存在 （货物实际送达启运港日期字段缺失）
    if (!isNullData(orderMsg.TRANS_DATE) && !isNullData(orderMsg.ACCEPT_DATE)) {
        //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
        shipPortObj.showStatus = 0; 
        //节点开始时间信息
        shipPortObj.startTimeDesc = businessDesc.ACCEPT_DATE; 
        shipPortObj.startTime = orderMsg.ACCEPT_DATE;
        shipPortObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ACCEPT_DATE);
        //节点结束时间信息
        shipPortObj.endTimeDesc =  businessDesc.TRANS_DATE;
        shipPortObj.endTime = orderMsg.TRANS_DATE;
        shipPortObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.TRANS_DATE);
        //节点显示总时间及标题
        shipPortObj.showTotalTime = Math.floor((shipPortObj.endDayTime - shipPortObj.startDayTime)*10)/10,
        shipPortObj.showTitle = i18n.t('message.businessDetail.originOpsPad')+shipPortObj.showTotalTime+"D";//节点上显示内容
        exportTimeObj.showMsgList.push(shipPortObj);
    }else if (isNullData(orderMsg.TRANS_DATE) && !isNullData(orderMsg.ACCEPT_DATE)){
        //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
        shipPortObj.showStatus = 1; 
        //节点开始时间信息
        shipPortObj.startTimeDesc = businessDesc.ACCEPT_DATE; 
        shipPortObj.startTime = orderMsg.ACCEPT_DATE;
        shipPortObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ACCEPT_DATE);
        //节点结束时间信息
        shipPortObj.endTimeDesc = businessDesc.TRANS_DATE;;//businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_FIN_DATE"]
        shipPortObj.endTime = "";
        shipPortObj.endDayTime = 0;
        //节点显示总时间及标题
        shipPortObj.showTotalTime = 0,
        shipPortObj.showTitle = i18n.t('message.businessDetail.originOpsPad');
        exportTimeObj.showMsgList.push(shipPortObj);
    }else{
        //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
        shipPortObj.showStatus = 2; 
        //节点开始时间信息
        shipPortObj.startTimeDesc = businessDesc.ACCEPT_DATE; 
        shipPortObj.startTime = "";
        shipPortObj.startDayTime = 0;
        //节点结束时间信息
        shipPortObj.endTimeDesc =businessDesc.TRANS_DATE;// businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_FIN_DATE"]
        shipPortObj.endTime = "";
        shipPortObj.endDayTime = 0;
        //节点显示总时间及标题
        shipPortObj.showTotalTime = 0,
        shipPortObj.showTitle = i18n.t('message.businessDetail.originOpsPad');
        exportTimeObj.showMsgList.push(shipPortObj);
    }
    nodeTips.push(i18n.t('message.businessDetail.originOpsPadTime')+"="+shipPortObj.endTimeDesc+"-"+shipPortObj.startTimeDesc);

    //2) 在港日时间节点数据
    let stayPortObj = {};
    //节点显示颜色
    stayPortObj.backgroundColor = "#555555";
    stayPortObj.backgroundImage = "linear-gradient(to right, #80d4de, #bfc787)";
    //如果启运港操作状态正常，则获取在港日开始时间，为启运港操作的截止日
    if(shipPortObj.showStatus==0){
        //节点开始时间信息
        stayPortObj.startTimeDesc = shipPortObj.endTimeDesc; 
        stayPortObj.startTime = shipPortObj.endTime;
        stayPortObj.startDayTime = shipPortObj.endDayTime;
        //获取航程时间节点开始时间,这个时间为在港日截至时间
        let voyageStartTime = "";
        //实际离港日期存在
        if (!isNullData(orderMsg.ATD)) {
            voyageStartTime = orderMsg.ATD;
            //节点结束时间信息
            stayPortObj.endTimeDesc = businessDesc.ATD;
            stayPortObj.endTime = orderMsg.ATD;
            stayPortObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ATD);
        }else{
            //预计离港日期存在
            if (!isNullData(orderMsg.ETD)) {
                voyageStartTime = orderMsg.ETD;
                //节点结束时间信息
                stayPortObj.endTimeDesc = businessDesc.ETD;
                stayPortObj.endTime = orderMsg.ETD;
                stayPortObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ETD);
            }
		}
		console.log("stayPortObj......",stayPortObj);
        if(!isNullData(stayPortObj.endTime)){
            //在港日时间，如果<=0,则不显示
            stayPortObj.showTotalTime = Math.floor((stayPortObj.endDayTime - stayPortObj.startDayTime)*10)/10;
            if(stayPortObj.showTotalTime>0){
                //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                stayPortObj.showStatus = 0; 
                //节点显示总时间及标题
                stayPortObj.showTitle = i18n.t('message.businessDetail.inPort')+stayPortObj.showTotalTime+"D";//节点上显示内容
                exportTimeObj.showMsgList.push(stayPortObj);
                nodeTips.push(i18n.t('message.businessDetail.inPortTime')+"="+stayPortObj.endTimeDesc+"-"+stayPortObj.startTimeDesc);
            }
        }
    }
    
    //3) 航程时间节点数据
    let voyageObj = {};
    //节点显示颜色
    voyageObj.backgroundColor = "#555555";
    voyageObj.backgroundImage = "linear-gradient(to right, #82d5db, #ced37c)";
    //实际离港日期、实际到港日期都存在
    if (!isNullData(orderMsg.ATD) && !isNullData(orderMsg.ATA)) {
        //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
        voyageObj.showStatus = 0; 
        //节点开始时间信息
        voyageObj.startTimeDesc = businessDesc.ATD; 
        voyageObj.startTime = orderMsg.ATD;
        voyageObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ATD);
        //节点结束时间信息
        voyageObj.endTimeDesc = businessDesc.ATA;
        voyageObj.endTime = orderMsg.ATA;
        voyageObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ATA);
        //节点显示总时间及标题
        voyageObj.showTotalTime = Math.floor((voyageObj.endDayTime - voyageObj.startDayTime)*10)/10,
        voyageObj.showTitle = i18n.t('message.businessDetail.transit')+voyageObj.showTotalTime+"D";//节点上显示内容
        exportTimeObj.showMsgList.push(voyageObj);
    }else{
        //预计离港日期、预计到港日期都存在
        if ( !isNullData(orderMsg.ETD) && !isNullData(orderMsg.ETA)) {
            //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
            voyageObj.showStatus = 0; 
            //节点开始时间信息
            voyageObj.startTimeDesc = businessDesc.ETD; 
            voyageObj.startTime = orderMsg.ETD;
            voyageObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ETD);
            //节点结束时间信息
            voyageObj.endTimeDesc = businessDesc.ETA;
            voyageObj.endTime = orderMsg.ETA;
            voyageObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ETA);
            //节点显示总时间及标题
            voyageObj.showTotalTime = Math.floor((voyageObj.endDayTime - voyageObj.startDayTime)*10)/10,
            voyageObj.showTitle = i18n.t('message.businessDetail.transit')+voyageObj.showTotalTime+"D";//节点上显示内容
            exportTimeObj.showMsgList.push(voyageObj);
        }else{
            if (!isNullData(orderMsg.ATD)) {
                //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                voyageObj.showStatus = 1; 
                //节点开始时间信息
                voyageObj.startTimeDesc = businessDesc.ATD; 
                voyageObj.startTime = orderMsg.ATD;
                voyageObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ATD);
                //节点结束时间信息
                voyageObj.endTimeDesc = businessDesc.ATA;
                voyageObj.endTime = "";
                voyageObj.endDayTime = 0;
                //节点显示总时间及标题
                voyageObj.showTotalTime = 0,
                voyageObj.showTitle = i18n.t('message.businessDetail.transit');//节点上显示内容
                exportTimeObj.showMsgList.push(voyageObj);
            }else{
                if (!isNullData(orderMsg.ETD)) {
                    //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                    voyageObj.showStatus = 1; 
                    //节点开始时间信息
                    voyageObj.startTimeDesc = businessDesc.ETD; 
                    voyageObj.startTime = orderMsg.ETD;
                    voyageObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ETD);
                    //节点结束时间信息
                    voyageObj.endTimeDesc = businessDesc.ETA;
                    voyageObj.endTime = "";
                    voyageObj.endDayTime = 0;
                    //节点显示总时间及标题
                    voyageObj.showTotalTime = 0,
                    voyageObj.showTitle = i18n.t('message.businessDetail.transit');//节点上显示内容
                    exportTimeObj.showMsgList.push(voyageObj);
                }else{
                    //实际、预计离港到港日期都没有，暂不处理，显示为空
                    //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                    voyageObj.showStatus = 2; 
                    //节点开始时间信息
                    voyageObj.startTimeDesc = businessDesc.ATD; 
                    voyageObj.startTime = "";
                    voyageObj.startDayTime = 0;
                    //节点结束时间信息
                    voyageObj.endTimeDesc = businessDesc.ATA;
                    voyageObj.endTime = "";
                    voyageObj.endDayTime = 0;
                    //节点显示总时间及标题
                    voyageObj.showTotalTime = 0,
                    voyageObj.showTitle = i18n.t('message.businessDetail.transit');//节点上显示内容
                    exportTimeObj.showMsgList.push(voyageObj);
                }
            }
        }
    }
    // if(voyageObj.showStatus != 2){
        nodeTips.push(i18n.t('message.businessDetail.transitTime')+"="+voyageObj.endTimeDesc+"-"+voyageObj.startTimeDesc);
    // }
    exportTimeObj.nodeTips = nodeTips;

    timeNodeList.push(exportTimeObj);

    //二、航程数据
    let voyageTimeObj = {};
    voyageTimeObj.nodeTitle = i18n.t('message.businessDetail.transit');
    voyageTimeObj.nodeTips = [i18n.t('message.businessDetail.transitTime')+" = "+ voyageObj.endTimeDesc+" - "+voyageObj.startTimeDesc];
    let voyageNewObj = JSON.parse(JSON.stringify(voyageObj));
    if (voyageObj.showTotalTime>0) {
        voyageNewObj.showTitle = voyageNewObj.showTotalTime+"D";
    }
    voyageTimeObj.showMsgList = [voyageNewObj];
    timeNodeList.push(voyageTimeObj);
    
    //三、订单、订舱、报关、运输节点显示数据
    let stepTitles = getExportStepsTitle(orderMsg,false);
    stepTitles.forEach(title => {
        switch (title) {
            case i18n.t('message.businessSearch.order'):{
                let orderTimeObj = {};
                orderTimeObj.nodeTitle = title;
                orderTimeObj.nodeTips = [i18n.t('message.businessDetail.orderProcessTime')+" = "+ businessDesc.DZQQ_DATE+" - "+businessDesc.ACCEPT_DATE];
                orderTimeObj.showMsgList = [];

                let orderObj = {};
                //节点显示颜色
                orderObj.backgroundColor = "#555555";
                orderObj.backgroundImage = "linear-gradient(to right, #f5ce55, #fda832)";
                //客户委托日期、单证齐全日期都存在
                if(!isNullData(orderMsg.ACCEPT_DATE) && !isNullData(orderMsg.DZQQ_DATE)){
                    //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                    orderObj.showStatus = 0; 
                    //节点开始时间信息
                    orderObj.startTimeDesc = businessDesc.ACCEPT_DATE; 
                    orderObj.startTime = orderMsg.ACCEPT_DATE;
                    orderObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ACCEPT_DATE);
                    //节点结束时间信息
                    orderObj.endTimeDesc = businessDesc.DZQQ_DATE
                    orderObj.endTime = orderMsg.DZQQ_DATE;
                    orderObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.DZQQ_DATE);
                    //节点显示总时间及标题
                    orderObj.showTotalTime = Math.floor((orderObj.endDayTime - orderObj.startDayTime)*10)/10,
                    orderObj.showTitle = orderObj.showTotalTime+"D";//节点上显示内容
                    orderTimeObj.showMsgList.push(orderObj);
                }else if(!isNullData(orderMsg.ACCEPT_DATE) && isNullData(orderMsg.DZQQ_DATE)){
                    //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                    orderObj.showStatus = 1; 
                    //节点开始时间信息
                    orderObj.startTimeDesc = businessDesc.ACCEPT_DATE; 
                    orderObj.startTime = orderMsg.ACCEPT_DATE;
                    orderObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.ACCEPT_DATE);
                    //节点结束时间信息
                    orderObj.endTimeDesc = businessDesc.DZQQ_DATE;
                    orderObj.endTime = "";
                    orderObj.endDayTime = 0;
                    //节点显示总时间及标题
                    orderObj.showTotalTime = 0,
                    orderObj.showTitle = "";//节点上显示内容
                    orderTimeObj.showMsgList.push(orderObj);
                }else if(isNullData(orderMsg.ACCEPT_DATE) && !isNullData(orderMsg.DZQQ_DATE)){
                    //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                    orderObj.showStatus = 3; 
                    //节点开始时间信息
                    orderObj.startTimeDesc = businessDesc.ACCEPT_DATE; 
                    orderObj.startTime = "";
                    orderObj.startDayTime = 0;
                    //节点结束时间信息
                    orderObj.endTimeDesc = businessDesc.DZQQ_DATE
                    orderObj.endTime = orderMsg.DZQQ_DATE;
                    orderObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.DZQQ_DATE);
                    //节点显示总时间及标题
                    orderObj.showTotalTime = 0,
                    orderObj.showTitle = "";//节点上显示内容
                    orderTimeObj.showMsgList.push(orderObj);
                }else{
                    //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                    orderObj.showStatus = 2; 
                    //节点开始时间信息
                    orderObj.startTimeDesc = businessDesc.ACCEPT_DATE; 
                    orderObj.startTime = "";
                    orderObj.startDayTime = 0;
                    //节点结束时间信息
                    orderObj.endTimeDesc = businessDesc.DZQQ_DATE;
                    orderObj.endTime = "";
                    orderObj.endDayTime = 0;
                    //节点显示总时间及标题
                    orderObj.showTotalTime = 0,
                    orderObj.showTitle = "";//节点上显示内容
                    orderTimeObj.showMsgList.push(orderObj);
                }
                timeNodeList.push(orderTimeObj);
            }
                break;
            case i18n.t('message.businessSearch.booking'):{
                let bookingTimeObj = {};
                bookingTimeObj.nodeTitle = title;
                bookingTimeObj.nodeTips = [i18n.t('message.businessDetail.bookingTime')+" = "+ businessDesc.BL_CONFIRM_DATE+" - "+businessDesc.BOOKING_DATE];
                bookingTimeObj.showMsgList = [];

                let bookingObj = {};
                //节点显示颜色
                bookingObj.backgroundColor = "#555555";
                bookingObj.backgroundImage = "linear-gradient(to right, #fcac36 , #fcb095)";
                //换单日期、头程换单日期都存在
                if(!isNullData(orderMsg.BOOKING_DATE) && !isNullData(orderMsg.BL_CONFIRM_DATE)){
                    //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                    bookingObj.showStatus = 0; 
                    //节点开始时间信息
                    bookingObj.startTimeDesc = businessDesc.BOOKING_DATE; 
                    bookingObj.startTime = orderMsg.BOOKING_DATE;
                    bookingObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.BOOKING_DATE);
                    //节点结束时间信息
                    bookingObj.endTimeDesc = businessDesc.BL_CONFIRM_DATE
                    bookingObj.endTime = orderMsg.BL_CONFIRM_DATE;
                    bookingObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.BL_CONFIRM_DATE);
                    //节点显示总时间及标题
                    bookingObj.showTotalTime = Math.floor((bookingObj.endDayTime - bookingObj.startDayTime)*10)/10,
                    bookingObj.showTitle = bookingObj.showTotalTime+"D";//节点上显示内容
                    bookingTimeObj.showMsgList.push(bookingObj);
                }else if(!isNullData(orderMsg.BOOKING_DATE) && isNullData(orderMsg.BL_CONFIRM_DATE)){
                    //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                    bookingObj.showStatus = 1; 
                    //节点开始时间信息
                    bookingObj.startTimeDesc = businessDesc.BOOKING_DATE; 
                    bookingObj.startTime = orderMsg.BOOKING_DATE;
                    bookingObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.BOOKING_DATE);
                    //节点结束时间信息
                    bookingObj.endTimeDesc = businessDesc.BL_CONFIRM_DATE;
                    bookingObj.endTime = "";
                    bookingObj.endDayTime = 0;
                    //节点显示总时间及标题
                    bookingObj.showTotalTime = 0,
                    bookingObj.showTitle = "";//节点上显示内容
                    bookingTimeObj.showMsgList.push(bookingObj);
                }else if(isNullData(orderMsg.BOOKING_DATE) && !isNullData(orderMsg.BL_CONFIRM_DATE)){
                    //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                    bookingObj.showStatus = 3; 
                    //节点开始时间信息
                    bookingObj.startTimeDesc = businessDesc.BOOKING_DATE; 
                    bookingObj.startTime = "";
                    bookingObj.startDayTime = 0;
                    //节点结束时间信息
                    bookingObj.endTimeDesc = businessDesc.BL_CONFIRM_DATE
                    bookingObj.endTime = orderMsg.BL_CONFIRM_DATE;
                    bookingObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.BL_CONFIRM_DATE);
                    //节点显示总时间及标题
                    bookingObj.showTotalTime = 0,
                    bookingObj.showTitle = "";//节点上显示内容
                    bookingTimeObj.showMsgList.push(bookingObj);
                }else{
                    //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                    bookingObj.showStatus = 2; 
                    //节点开始时间信息
                    bookingObj.startTimeDesc = businessDesc.BOOKING_DATE; 
                    bookingObj.startTime = "";
                    bookingObj.startDayTime = 0;
                    //节点结束时间信息
                    bookingObj.endTimeDesc = businessDesc.BL_CONFIRM_DATE;
                    bookingObj.endTime = "";
                    bookingObj.endDayTime = 0;
                    //节点显示总时间及标题
                    bookingObj.showTotalTime = 0,
                    bookingObj.showTitle = "";//节点上显示内容
                    bookingTimeObj.showMsgList.push(bookingObj);
                }

                timeNodeList.push(bookingTimeObj);
            }
                break;
            case i18n.t('message.businessSearch.customs'):{
				//取最近通关货物放行日期
				let fx_date = orderMsg.FX_DATE; 
                //报关节点 最小申报日期获取
                if(isNullData(fx_date) && orderMsg.DECLARATION_LIST){
					//获取最晚通关货物放行日期
					let recObj = getRecentlyDataFromList('FXDATE',orderMsg.DECLARATION_LIST);
                    fx_date = !isNullData(recObj.FXDATE)?recObj.FXDATE:"";
				}

                let customsTimeObj = {};
                customsTimeObj.nodeTitle = title;
                customsTimeObj.showMsgList = [];

                let customsObj = {};
                //节点显示颜色
                customsObj.backgroundColor = "#555555";
                customsObj.backgroundImage = "linear-gradient(to right, #fec196, #f4688e)";
                if(!isNullData(orderMsg.DZQQ_DATE)){
                    if(!isNullData(orderMsg.BG_DATE)){
                        //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                        customsObj.showStatus = 0; 
                        //节点开始时间信息
                        customsObj.startTimeDesc = businessDesc.DZQQ_DATE; 
                        customsObj.startTime = orderMsg.DZQQ_DATE;
                        customsObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.DZQQ_DATE);
                        //节点结束时间信息
                        customsObj.endTimeDesc = businessDesc.BG_DATE
                        customsObj.endTime = orderMsg.BG_DATE;
                        customsObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.BG_DATE);
                        //节点显示总时间及标题
                        customsObj.showTotalTime = Math.floor((customsObj.endDayTime - customsObj.startDayTime)*10)/10,
                        customsObj.showTitle = customsObj.showTotalTime+"D";//节点上显示内容
						customsTimeObj.showMsgList.push(customsObj);
						customsTimeObj.nodeTips = [i18n.t('message.businessDetail.timeofCustomsClearance')+" = "+ businessDesc.BG_DATE+" - "+businessDesc.DZQQ_DATE];
                    }else{
						if (!isNullData(fx_date)) {
							//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
							customsObj.showStatus = 0; 
							//节点开始时间信息
							customsObj.startTimeDesc = businessDesc.DZQQ_DATE; 
							customsObj.startTime = orderMsg.DZQQ_DATE;
							customsObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.DZQQ_DATE);
							//节点结束时间信息
							customsObj.endTimeDesc = businessDesc["DECLARATION_LIST.FXDATE"]
							customsObj.endTime = fx_date;
							customsObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,fx_date);;
							//节点显示总时间及标题
							customsObj.showTotalTime = Math.floor((customsObj.endDayTime - customsObj.startDayTime)*10)/10,
							customsObj.showTitle = customsObj.showTotalTime+"D";//节点上显示内容
							customsTimeObj.showMsgList.push(customsObj);
							customsTimeObj.nodeTips = [i18n.t('message.businessDetail.timeofCustomsClearance')+" = "+ businessDesc["DECLARATION_LIST.FXDATE"]+" - "+businessDesc.DZQQ_DATE];
						} else {
							//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
							customsObj.showStatus = 1; 
							//节点开始时间信息
							customsObj.startTimeDesc = businessDesc.DZQQ_DATE; 
							customsObj.startTime = orderMsg.DZQQ_DATE;
							customsObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.DZQQ_DATE);
							//节点结束时间信息
							customsObj.endTimeDesc = businessDesc.BG_DATE
							customsObj.endTime = "";
							customsObj.endDayTime = 0;
							//节点显示总时间及标题
							customsObj.showTotalTime = 0,
							customsObj.showTitle = "";//节点上显示内容
							customsTimeObj.showMsgList.push(customsObj);
							customsTimeObj.nodeTips = [i18n.t('message.businessDetail.timeofCustomsClearance')+" = "+ businessDesc.BG_DATE+" - "+businessDesc.DZQQ_DATE];
						}
                    }
                }else{
                    let sb_date = '';
                    //报关节点 最小申报日期获取
                    if(orderMsg.DECLARATION_LIST){
                        //申报日期 通关货物放行日期 有值，取最小申报日期
                        orderMsg.DECLARATION_LIST.forEach(element => {
                            if(!isNullData(element.SBDATE)){
                                if(isNullData(sb_date)){
                                    sb_date = element.SBDATE;
                                }else{
                                    if (timeStrToTimestamp(sb_date) >= timeStrToTimestamp(element.SBDATE)) {
                                        sb_date = element.SBDATE;
                                    }
                                }
                            }
                        });
                    }
                    if(!isNullData(sb_date)){
                        if(!isNullData(orderMsg.BG_DATE)){
                            //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                            customsObj.showStatus = 0; 
                            //节点开始时间信息
                            customsObj.startTimeDesc = businessDesc["DECLARATION_LIST.SBDATE"]; 
                            customsObj.startTime = sb_date;
                            customsObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,sb_date);
                            //节点结束时间信息
                            customsObj.endTimeDesc = businessDesc.BG_DATE;
                            customsObj.endTime = orderMsg.BG_DATE;
                            customsObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.BG_DATE);
                            //节点显示总时间及标题
                            customsObj.showTotalTime = Math.floor((customsObj.endDayTime - customsObj.startDayTime)*10)/10,
                            customsObj.showTitle = customsObj.showTotalTime+"D";//节点上显示内容
							customsTimeObj.showMsgList.push(customsObj);
							customsTimeObj.nodeTips = [i18n.t('message.businessDetail.timeofCustomsClearance')+" = "+ businessDesc.BG_DATE+" - "+businessDesc["DECLARATION_LIST.SBDATE"]];
                        }else{

							if (!isNullData(fx_date)) {
								//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
								customsObj.showStatus = 0; 
								//节点开始时间信息
								customsObj.startTimeDesc = businessDesc["DECLARATION_LIST.SBDATE"]; 
								customsObj.startTime = sb_date;
								customsObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,sb_date);
								//节点结束时间信息
								customsObj.endTimeDesc = businessDesc["DECLARATION_LIST.FXDATE"]
								customsObj.endTime = fx_date;
								customsObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,fx_date);;
								//节点显示总时间及标题
								customsObj.showTotalTime = Math.floor((customsObj.endDayTime - customsObj.startDayTime)*10)/10,
								customsObj.showTitle = customsObj.showTotalTime+"D";//节点上显示内容
								customsTimeObj.showMsgList.push(customsObj);
								customsTimeObj.nodeTips = [i18n.t('message.businessDetail.timeofCustomsClearance')+" = "+ businessDesc["DECLARATION_LIST.FXDATE"]+" - "+businessDesc["DECLARATION_LIST.SBDATE"]];
							} else {
								//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
								customsObj.showStatus = 1; 
								//节点开始时间信息
								customsObj.startTimeDesc = businessDesc["DECLARATION_LIST.SBDATE"]; 
								customsObj.startTime = sb_date;
								customsObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,sb_date);
								//节点结束时间信息
								customsObj.endTimeDesc = businessDesc.BG_DATE;
								customsObj.endTime = "";
								customsObj.endDayTime = 0;
								//节点显示总时间及标题
								customsObj.showTotalTime = 0,
								customsObj.showTitle = "";//节点上显示内容
								customsTimeObj.showMsgList.push(customsObj);
								customsTimeObj.nodeTips = [i18n.t('message.businessDetail.timeofCustomsClearance')+" = "+ businessDesc.BG_DATE+" - "+businessDesc["DECLARATION_LIST.SBDATE"]];
							}   
                        }
                    }else{
						if(!isNullData(orderMsg.BG_DATE)){
                            //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                            customsObj.showStatus = 3; 
                            //节点开始时间信息
                            customsObj.startTimeDesc = businessDesc.DZQQ_DATE; 
                            customsObj.startTime = "";
							customsObj.startDayTime = 0;
                            //节点结束时间信息
                            customsObj.endTimeDesc = businessDesc.BG_DATE;
                            customsObj.endTime = orderMsg.BG_DATE;
                            customsObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.BG_DATE);
                            //节点显示总时间及标题
                            customsObj.showTotalTime = 0,
                            customsObj.showTitle = "";//节点上显示内容
							customsTimeObj.showMsgList.push(customsObj);
							customsTimeObj.nodeTips = [i18n.t('message.businessDetail.timeofCustomsClearance')+" = "+ businessDesc.BG_DATE+" - "+businessDesc.DZQQ_DATE];
                        }else{
							if (!isNullData(fx_date)) {
								//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
								customsObj.showStatus = 3; 
								//节点开始时间信息
								customsObj.startTimeDesc = businessDesc.DZQQ_DATE; 
								customsObj.startTime = "";
								customsObj.startDayTime = 0;
								//节点结束时间信息
								customsObj.endTimeDesc = businessDesc["DECLARATION_LIST.FXDATE"]
								customsObj.endTime = fx_date;
								customsObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,fx_date);;
								//节点显示总时间及标题
								customsObj.showTotalTime = 0,
                            	customsObj.showTitle = "";//节点上显示内容
								customsTimeObj.showMsgList.push(customsObj);
								customsTimeObj.nodeTips = [i18n.t('message.businessDetail.timeofCustomsClearance')+" = "+ businessDesc["DECLARATION_LIST.FXDATE"]+" - "+businessDesc.DZQQ_DATE];
							} else {
								//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
								customsObj.showStatus = 2; 
								//节点开始时间信息
								customsObj.startTimeDesc = businessDesc.DZQQ_DATE; 
								customsObj.startTime = "";
								customsObj.startDayTime = 0;
								//节点结束时间信息
								customsObj.endTimeDesc = businessDesc.BG_DATE;
								customsObj.endTime = "";
								customsObj.endDayTime = 0;
								//节点显示总时间及标题
								customsObj.showTotalTime = 0,
								customsObj.showTitle = "";//节点上显示内容
								customsTimeObj.showMsgList.push(customsObj);
								customsTimeObj.nodeTips = [i18n.t('message.businessDetail.timeofCustomsClearance')+" = "+ businessDesc.BG_DATE+" - "+businessDesc.DZQQ_DATE];
							}
						}
                    }
                }
                
                timeNodeList.push(customsTimeObj);
            }
                break;
            case i18n.t('message.businessSearch.trans'):{
                let transTimeObj = {};
                transTimeObj.nodeTitle = title;
                transTimeObj.showMsgList = [];

                let transObj = {};
                //节点显示颜色
                transObj.backgroundColor = "#555555";
                transObj.backgroundImage = "linear-gradient(to right, #f56a8e, #c4a3f1)";
                //获取最小运输委托日期
                let transSubDate = '';
                if(orderMsg.ORDER_SERVE_TRANSPORT_LIST){
                    //运输委托日期 有值，则认为存在运输业务，显示运输节点
                    orderMsg.ORDER_SERVE_TRANSPORT_LIST.forEach(element => {
                        if(!isNullData(element.TRANS_SUB_DATE)){
                            if(isNullData(transSubDate)){
                                transSubDate = element.TRANS_SUB_DATE;
                            }else{
                                if (timeStrToTimestamp(transSubDate) >= timeStrToTimestamp(element.TRANS_SUB_DATE)) {
                                    transSubDate = element.TRANS_SUB_DATE;
                                }
                            }
                        }
                    });
                }
                if(!isNullData(transSubDate)){
                    if(!isNullData(orderMsg.TRANS_DATE)){
                        //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                        transObj.showStatus = 0; 
                        //节点开始时间信息
                        transObj.startTimeDesc = businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_SUB_DATE"]; 
                        transObj.startTime = transSubDate;
                        transObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,transSubDate);
                        //节点结束时间信息
                        transObj.endTimeDesc = businessDesc.TRANS_DATE;
                        transObj.endTime = orderMsg.TRANS_DATE;
                        transObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.TRANS_DATE);
                        //节点显示总时间及标题
                        transObj.showTotalTime = Math.floor((transObj.endDayTime - transObj.startDayTime)*10)/10,
                        transObj.showTitle = transObj.showTotalTime+"D";//节点上显示内容
                        transTimeObj.showMsgList.push(transObj);
                    }else{
                        //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                        transObj.showStatus = 1; 
                        //节点开始时间信息
                        transObj.startTimeDesc = businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_SUB_DATE"]; 
                        transObj.startTime = transSubDate;
                        transObj.startDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,transSubDate);
                        //节点结束时间信息
                        transObj.endTimeDesc = businessDesc.TRANS_DATE;
                        transObj.endTime = "";
                        transObj.endDayTime = 0;
                        //节点显示总时间及标题
                        transObj.showTotalTime = 0,
                        transObj.showTitle = "";//节点上显示内容
                        transTimeObj.showMsgList.push(transObj);
                    }
                    transTimeObj.nodeTips = [i18n.t('message.businessDetail.leadTimeofTransport')+" = "+ businessDesc.TRANS_DATE+" - "+businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_SUB_DATE"]];
                }else{
					if(!isNullData(orderMsg.TRANS_DATE)){
                        //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
                        transObj.showStatus = 3; 
                        //节点开始时间信息
                        transObj.startTimeDesc = businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_SUB_DATE"]; 
                        transObj.startTime = "";
                        transObj.startDayTime = 0;
                        //节点结束时间信息
                        transObj.endTimeDesc = businessDesc.TRANS_DATE;
                        transObj.endTime = orderMsg.TRANS_DATE;
                        transObj.endDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,orderMsg.TRANS_DATE);
                        //节点显示总时间及标题
                        transObj.showTotalTime = 0,
                        transObj.showTitle = "";//节点上显示内容
                        transTimeObj.showMsgList.push(transObj);
                    }else{
						//显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有 3:开始日期没有、结束日期存在
						transObj.showStatus = 2; 
						//节点开始时间信息
						transObj.startTimeDesc = businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_SUB_DATE"]; 
						transObj.startTime = "";
						transObj.startDayTime = 0;
						//节点结束时间信息
						transObj.endTimeDesc = businessDesc["DECLARATION_LIST.FXDATE"];
						transObj.endTime = "";
						transObj.endDayTime = 0;
						//节点显示总时间及标题
						transObj.showTotalTime = 0,
						transObj.showTitle = "";//节点上显示内容
						transTimeObj.showMsgList.push(transObj);
					}
                    
                    transTimeObj.nodeTips = [i18n.t('message.businessDetail.leadTimeofTransport')+" = "+ businessDesc["DECLARATION_LIST.FXDATE"]+" - "+businessDesc["ORDER_SERVE_TRANSPORT_LIST.TRANS_SUB_DATE"]];
                }
                timeNodeList.push(transTimeObj);
            }
                break;
        
            default:
                break;
        }
    });

    return timeNodeList;
}

/**
 * 根据orderMsg获取交付时间组件显示信息
 * @param {*} orderMsg 
 * @param {*} businessDesc 
 * @param {*} orderType 
 */
export function getDeliveryTimeMsg(orderMsg,businessDesc,orderType){
    let deliveryTimeMsg = {};
    deliveryTimeMsg.orderType = orderType;
    //获取初始显示有效时间
    deliveryTimeMsg.validStartTime = getValidStartTime(orderMsg,businessDesc,orderType);
    console.log("deliveryTimeMsg.validStartTime....",deliveryTimeMsg.validStartTime);
    //获取结束显示有效时间
    deliveryTimeMsg.validEndTime = getValidEndTime(orderMsg,businessDesc,orderType);
    console.log("deliveryTimeMsg.validEndTime....",deliveryTimeMsg.validEndTime);
    //获取计算总的有效显示时长
    deliveryTimeMsg.totalDayTime = getTotalDayTime(deliveryTimeMsg.validStartTime,deliveryTimeMsg.validEndTime);
    console.log("deliveryTimeMsg.totalDayTime....",deliveryTimeMsg.totalDayTime);
    //获取订单每个阶段时间显示信息内容
    if(orderType != 'FE'){ //口岸进口
        //进口订单每个阶段时间显示信息内容
        deliveryTimeMsg.timeNodeList = getImportShowTimeList(orderMsg,businessDesc,orderType,deliveryTimeMsg);
    }else{
        //出口订单每个阶段时间显示信息内容
        deliveryTimeMsg.timeNodeList = getExoprtShowTimeList(orderMsg,businessDesc,orderType,deliveryTimeMsg);
    }
    return deliveryTimeMsg;
}
