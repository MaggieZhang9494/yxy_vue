import { isNullData, isJSONStr} from '../util'

/***********************************************************处理功能、数据权限列表数据***********************************************************/
//给节点列表nodeList添加parentCode、level字段
export function addParentCode(parentCode,nodeList,level){
	let newNodeList = [];
	newNodeList = nodeList.map((item,index)=>{
		item.parentCode = parentCode;
		item.level = level;
		if ((index+1) == nodeList.length) {
			item.isLastCell = true;
		}else{
			item.isLastCell = false;
		}
		if (item.children && item.children.length>0) {
			item.isOpen = true;
			item.children = addParentCode(item.code, item.children,level+1);
		}
		item.leftLineShowList = [];
		return item;
	})
	return newNodeList;
}

//给节点列表nodeList添加leftLineShowList字段
export function addLeftLineShowListToTableList(tableList,nodeList){
	let newNodeList = [];
	newNodeList = nodeList.map((item,index)=>{
		item.leftLineShowList = getParentIsLastCellList(tableList,item).reverse();;
		if (item.children && item.children.length>0) {
			item.children = addLeftLineShowListToTableList(tableList,item.children);
		}
		return item;
	})
	return newNodeList;
}

//获取该节点的所有父级节点是否是最后一个显示节点的状态列表
export function getParentIsLastCellList(nodeList,currentCode){
	let parentLastList = [];

	let parentNode = null;
	//获取子节点childNode的父节点parentNode信息
	for (let index = 0; index < nodeList.length; index++) {
		const node = nodeList[index];
		parentNode = getParentNode(node, currentCode);
		if (parentNode !== null) {
			break;
		}
	}
	if (parentNode != null) {
		parentLastList = parentLastList.concat([parentNode.isLastCell]);
		
		let newList = getParentIsLastCellList(nodeList,parentNode);
		if (newList.length==0) {
			return parentLastList;
		}
		return parentLastList.concat(newList);
	}else{
		return parentLastList;
	}
}

//更新列表某一节点node的数据
export function updateTableData(list, node){
	if (isNullData(node)) {
		return;
	}

	let newList = [];
	newList = list.map(item=>{
		if (item.code === node.code) {
			item = node;
		}else{
			if (item.children && item.children.length>0) {
				item.children = updateTableData(item.children, node);
			}
		}
		return item;
	})
	return newList;
}

//从某一节点nodeData中获取childNode的父节点，获取不到返回null
export function getParentNode(nodeData,childNode){
	if (isNullData(childNode)) {
		return null;
	}

	if (isNullData(nodeData) || !nodeData.children || nodeData.children.length<=0) {
		return null;
	}

	let allNodeList = nodeData.children.slice();
	let parentNode = null;
	for (let index = 0; index < allNodeList.length; index++) {
		const node = allNodeList[index];
		if (node.code === childNode.code) {
			parentNode = nodeData;
			break;
		}else{
			if (node.children && node.children.length>0) {
				parentNode = getParentNode(node,childNode);
				if (parentNode != null) {
					break;
				}
			}
		}
	}
	return parentNode;
}

/***********************************************************处理权限配置 功能列表可见状态数据***********************************************************/
//更新nodeList下，某一子节点的所有上层父节点可见状态,返回最上层节点信息
export function updateParentNodeSeeStatus(nodeList,childNode){
	let _this = this;
	if (isNullData(childNode)) {
		return {};
	}
	if (isNullData(nodeList)  || nodeList.length<=0) {
		return {};
	}

	let parentNode = null;
	//获取子节点childNode的父节点parentNode信息
	for (let index = 0; index < nodeList.length; index++) {
		const node = nodeList[index];
		parentNode = getParentNode(node, childNode);
		if (parentNode !== null) {
			break;
		}
	}
	if (parentNode != null) {
		//更新父节点parentNode中子节点childNode信息
		parentNode.children = updateTableData(parentNode.children, childNode);
		//根据parentNode中children的可见状态，来确定parentNode的可见状态
		let isParentSee = false;
		parentNode.children.forEach(element => {
			if (element.isSee) { //子节点中存在一个可见，则父节点就可见
				isParentSee = true;
			}
		});
		parentNode.isSee = isParentSee;
		//如果不存在父节点,返回该父节点
		if (parentNode.parentCode == null) {
			
			return parentNode;
		}else{
			//如果存在父节点,继续更新parentCode的父节点状态信息
			return updateParentNodeSeeStatus(nodeList,parentNode);
		}
	}else{
		return childNode;
	}
}
//处理所有子节点，可见状态和父节点同步
export function dealAllChildNodeSeeStatus(parentNode){
	if (isNullData(parentNode)) {
		return {};
	}
	let newChild = [];
	if (parentNode.children && parentNode.children.length>0) {
		newChild = parentNode.children.map(item=>{
			item.isSee = parentNode.isSee;
			if (item.children && item.children.length>0) {
				item = dealAllChildNodeSeeStatus(item);
			}
			return item;
		})
	}
	parentNode.children = newChild;
	return parentNode
}

/***********************************************************处理权限配置 功能列表可用状态数据***********************************************************/
//更新nodeList下，某一子节点的所有上层父节点可用状态,返回最上层节点信息
export function updateParentNodeUseStatus(nodeList,childNode){
	if (isNullData(childNode)) {
		return {};
	}

	if (isNullData(nodeList) || nodeList.length<=0) {
		return {};
	}

	let parentNode = null;
	//获取子节点childNode的父节点parentNode信息
	for (let index = 0; index < nodeList.length; index++) {
		const node = nodeList[index];
		parentNode = getParentNode(node, childNode);
		if (parentNode !== null) {
			break;
		}
	}
	if (parentNode != null) {
		//更新父节点parentNode中子节点childNode信息
		parentNode.children = updateTableData(parentNode.children, childNode);
		//根据parentNode中children的可用状态，来确定parentNode的可用状态
		let isParentUse = false;
		parentNode.children.forEach(element => {
			if (element.isUse) { //子节点中存在一个可用，则父节点就可用
				isParentUse = true;
			}
		});
		parentNode.isUse = isParentUse;
		//如果不存在父节点,返回该父节点
		if (parentNode.parentCode == null) {
			return parentNode;
		}else{
			//如果存在父节点,继续更新parentCode的父节点状态信息
			return updateParentNodeUseStatus(nodeList,parentNode);
		}
	}else{
		return childNode;
	}
}

//处理所有子节点，可用状态和父节点同步
export function dealAllChildNodeUseStatus(parentNode){
	if (isNullData(parentNode)) {
		return {};
	}
	let newChild = [];
	if (parentNode.children && parentNode.children.length>0) {
		newChild = parentNode.children.map(item=>{
			item.isUse = parentNode.isUse;
			if (item.children && item.children.length>0) {
				item = dealAllChildNodeUseStatus(item);
			}
			return item;
		})
	}
	parentNode.children = newChild;
	return parentNode
}

/***********************************************************处理权限配置 数据列表域可见状态数据***********************************************************/
//更新nodeList下，某一子节点的所有上层父节点可见字段状态,返回最上层节点信息
export function updateParentNodeStatus(nodeList,childNode){
	let _this = this;
	if (isNullData(childNode)) {
		return {};
	}

	if (isNullData(nodeList)  || nodeList.length<=0) {
		return {};
	}

	let parentNode = null;
	//获取子节点childNode的父节点parentNode信息
	for (let index = 0; index < nodeList.length; index++) {
		const node = nodeList[index];
		parentNode = getParentNode(node, childNode);
		if (parentNode !== null) {
			break;
		}
	}

	if (parentNode != null) {
		//更新父节点parentNode中子节点childNode信息
		parentNode.children = updateTableData(parentNode.children, childNode);
		//根据parentNode中children的可见状态，来确定parentNode的可见字段状态
		let isParentSee = false;
		parentNode.children.forEach(element => {
			if (element.isSee) { //子节点中存在一个可见字段，则父节点就可见字段
				isParentSee = true;
			}
		});
		parentNode.isSee = isParentSee;
		//如果不存在父节点,返回该父节点
		if (parentNode.parentCode == null) {
			
			return parentNode;
		}else{
			//如果存在父节点,继续更新parentCode的父节点状态信息
			return updateParentNodeStatus(nodeList,parentNode);
		}
	}else{
		return childNode;
	}
}

//处理所有子节点，可见字段状态和父节点同步
export function dealAllChildNode(parentNode){
	if (isNullData(parentNode)) {
		return {};
	}
	let newChild = [];
	if (parentNode.children && parentNode.children.length>0) {
		newChild = parentNode.children.map(item=>{
			item.isSee = parentNode.isSee;
			if (item.children && item.children.length>0) {
				item = dealAllChildNode(item);
			}
			return item;
		})
	}
	parentNode.children = newChild;
	return parentNode
}

/***********************************************************处理权限配置 数据列表内容可见状态数据***********************************************************/
//更新nodeList下，某一子节点的所有上层父节点可见内容状态,返回最上层节点信息
export function updateParentNodeSeeContentStatus(nodeList,childNode){
	if (isNullData(childNode)) {
		return {};
	}

	if (isNullData(nodeList)  || nodeList.length<=0) {
		return {};
	}

	let parentNode = null;
	//获取子节点childNode的父节点parentNode信息
	for (let index = 0; index < nodeList.length; index++) {
		const node = nodeList[index];
		parentNode = getParentNode(node, childNode);
		if (parentNode !== null) {
			break;
		}
	}

	if (parentNode != null) {
		//更新父节点parentNode中子节点childNode信息
		parentNode.children = updateTableData(parentNode.children, childNode);
		//根据parentNode中children的可见状态，来确定parentNode的可见状态
		let isParentSee = false;
		parentNode.children.forEach(element => {
			if (element.isUse) { //子节点中存在一个可见，则父节点就可见
				isParentSee = true;
			}
		});
		parentNode.isUse = isParentSee;
		//如果不存在父节点,返回该父节点
		if (parentNode.parentCode == null) {
			return parentNode;
		}else{
			//如果存在父节点,继续更新parentCode的父节点状态信息
			return updateParentNodeSeeContentStatus(nodeList,parentNode);
		}
	}else{
		return childNode;
	}
}

//处理所有子节点，可见内容状态和父节点同步
export function dealAllChildNodeSeeContentStatus(parentNode){
	if (isNullData(parentNode)) {
		return {};
	}
	let newChild = [];
	if (parentNode.children && parentNode.children.length>0) {
		newChild = parentNode.children.map(item=>{
			item.isUse = parentNode.isUse;
			if (item.children && item.children.length>0) {
				item = dealAllChildNodeSeeContentStatus(item);
			}
			return item;
		})
	}
	parentNode.children = newChild;
	return parentNode
}