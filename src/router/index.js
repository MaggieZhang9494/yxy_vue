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
import Vue from 'vue'
/* 国际化 */
import i18n from '@/i18n/i18n'
import Router from 'vue-router'
import { isNullData, getCookie } from '@/util/util'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const main = resolve => require(['@/views/index/main'], resolve);
const home = resolve => require(['@/views/home/home'], resolve);
const blockInfo = resolve => require(['@/views/blockInfo/blockInfo'], resolve);
const transactionInfo = resolve => require(['@/views/transactionInfo/transactionInfo'], resolve);
const front = resolve => require(['@/views/front/front'], resolve);
const hostDetail = resolve => require(['@/views/front/components/hostDetail'], resolve);
const contract = resolve => require(['@/views/chaincode/contract'], resolve);
const oldContract = resolve => require(['@/views/chaincode/oldContract'], resolve)
const rivateKeyManagement = resolve => require(['@/views/rivateKeyManagement/rivateKeyManagement'], resolve);
const errorLogExport = resolve => require(['@/views/errorLogExport/errorLogExport'], resolve);
const hostMetric = resolve => require(['@/views/hostMetric'], resolve);
const nodesMetric = resolve => require(['@/views/nodesMetric'], resolve);
const accountInfo = resolve => require(['@/views/account/accountInfo'], resolve);
const transactionCharts = resolve => require(['@/views/transactionCharts/transactionCharts'], resolve);
const unusualUser = resolve => require(['@/views/unusualUser/unusualUser'], resolve);
const unusualContract = resolve => require(['@/views/unusualContract/unusualContract'], resolve);
// const authorManagement = resolve => require(['@/views/authorManagement'], resolve); 
const certificate = resolve => require(['@/views/certificate'], resolve); 
const permission = resolve => require(['@/views/permission'], resolve);
const configManagement = resolve => require(['@/views/configManagement'], resolve);
const cnsManagement = resolve => require(['@/views/cnsManagement'], resolve);
const CRUDServiceManagement = resolve => require(['@/views/CRUDServiceManagement'], resolve);
const mailboxAlarmManagement = resolve => require(['@/views/mailboxAlarmManagement'], resolve); 


//有信运相关新增功能
/* 业务管理 */
const businessManage = resolve => require(['@/views/businessManage/query/orderManage'], resolve);
const businessSearch = resolve => require(['@/views/businessManage/businessSearch'], resolve);
const businessList = resolve => require(['@/views/businessManage/query/businessList'], resolve);
const businessDetail = resolve => require(['@/views/businessManage/query/businessDetail'], resolve);
//统计首页
const statistics = resolve => require(['@/views/businessManage/statistics'], resolve);
//全部统计
const allStatistics = resolve => require(['@/views/businessManage/statistics/allStatistics'], resolve);
//每日订单状态
const dayOrderStatus = resolve => require(['@/views/businessManage/statistics/dayOrderStatus'], resolve);
//已完成订单统计
const closedOrder = resolve => require(['@/views/businessManage/statistics/closedOrder'], resolve);
//不同运输方式订单统计
const transOrder = resolve => require(['@/views/businessManage/statistics/transOrder'], resolve);
//根据提单号(工作号)来统计的报关量
const customsOrder = resolve => require(['@/views/businessManage/statistics/customsOrder'], resolve);
//不同进境关别的订单量
const importOrder = resolve => require(['@/views/businessManage/statistics/importOrder'], resolve);
//根据订单数量统计的前10位客户
const topNumAccOrder = resolve => require(['@/views/businessManage/statistics/topNumAccOrder'], resolve);
//订单的总体货量(航空运输)
const airOrderNum = resolve => require(['@/views/businessManage/statistics/airOrderNum'], resolve);
//订单的总体货量(水路运输)
const oceanOrderNum = resolve => require(['@/views/businessManage/statistics/oceanOrderNum'], resolve);
//根据运输量(航空运输)统计的前10位客户
const topAccAirOrder = resolve => require(['@/views/businessManage/statistics/topAccAirOrder'], resolve);
//根据运输量(水路运输)统计的前10位客户
const topAccOceanOrder = resolve => require(['@/views/businessManage/statistics/topAccOceanOrder'], resolve);
//根据报关单来统计的报关量
const customsVolume = resolve => require(['@/views/businessManage/statistics/customsVolume'], resolve);

//Top 10 进口货源地(以启运国为基础)
const topImportOrigin = resolve => require(['@/views/businessManage/statistics/topImportOrigin'], resolve);
//Top 10 海关编号
const topHSCode = resolve => require(['@/views/businessManage/statistics/topHSCode'], resolve);
//进口统计(货量/价格/税费)
const importStatisticsVVD = resolve => require(['@/views/businessManage/statistics/importStatisticsVVD'], resolve);
//进口税费(币制：人民币元)
const importStatisticsDuty = resolve => require(['@/views/businessManage/statistics/importStatisticsDuty'], resolve);


const analyze = resolve => require(['@/views/businessManage/analyze'], resolve);

/* 帐号管理 */
const accountList = resolve => require(['@/views/accountYouXin/accountList'], resolve);
const accountMsg = resolve => require(['@/views/accountYouXin/accountMsg'], resolve);
/* 角色管理 */
const roleList = resolve => require(['@/views/roleManagement/roleList'], resolve);
const authorManagement = resolve => require(['@/views/roleManagement/authorManagement'], resolve);
/* 模板管理 */
const templateList = resolve => require(['@/views/templateManagement/templateList'], resolve);
const templateUpload = resolve => require(['@/views/templateManagement/templateUpload'], resolve);
/* 账本管理 */
const accountbookManage = resolve => require(['@/views/accountbookManage/accountbookManage'], resolve);

/* 公共查询 */
const publicQuery = resolve => require(['@/views/publicQuery/publicQuery'], resolve);
/* 客户管理 */
const clientList = resolve => require(['@/views/clientManage/clientList'], resolve);

Vue.use(Router);

const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/login',
        name: 'login',
        component: resolve => require(['@/views/login/login'], resolve),
	},
	//公共查询
    {
        path: '/',
        name: i18n.t('message.menuName.publicQuery'),
        // redirect: '/home',
        leaf: true,
        menuShow: true,
        iconCls: 'iconfont wbs-kongzhimianban sidebar-icon',
        component: main,
        children: [
            {
                path: '/publicQuery', component: publicQuery, name: i18n.t('message.menuName.publicQuery'), menuShow: true, meta: { requireAuth: true }
            }
        ]
    },
	//业务仪表盘
    {
        path: '/',
        component: main,
        name: i18n.t('message.menuName.statistics')+" ",
        menuShow: true,
        leaf: true,
        iconCls: 'iconfont wbs-yibiaopan sidebar-icon',
        children: [
            { path: '/statistics', component: statistics, name: i18n.t('message.menuName.statistics'), menuShow: true, meta: { requireAuth: true } },
            // { path: '/analyze', component: analyze, name: i18n.t('message.menuName.analyze'), menuShow: true, meta: { requireAuth: true } },
            //全部统计 -- 统计
            { path: '/allStatistics', component: allStatistics, name:i18n.t('message.statistics.allStatistics'), menuShow: false, meta: { requireAuth: true } },
            //订单状态情况一览 -- 统计
            { path: '/dayOrderStatus', component: dayOrderStatus, name:'', menuShow: false, meta: { requireAuth: true } },
            //操作已完成的订单量 -- 统计
            { path: '/closedOrder', component: closedOrder, name:'', menuShow: false, meta: { requireAuth: true } },
            //不同运输方式的订单量 -- 统计
            { path: '/transOrder', component: transOrder, name:'', menuShow: false, meta: { requireAuth: true } },
            //不同进境关别的订单量
            { path: '/importOrder', component: importOrder, name:'', menuShow: false, meta: { requireAuth: true } },
            //根据订单数量统计的前10位客户
            { path: '/topNumAccOrder', component: topNumAccOrder, name:'', menuShow: false, meta: { requireAuth: true } },
            //订单的总体货量(航空运输)
            { path: '/airOrderNum', component: airOrderNum, name:'', menuShow: false, meta: { requireAuth: true } },
            //订单的总体货量(水路运输)
            { path: '/oceanOrderNum', component: oceanOrderNum, name:'', menuShow: false, meta: { requireAuth: true } },
            //根据提单号(工作号)来统计的报关量
            { path: '/customsOrder', component: customsOrder, name:'', menuShow: false, meta: { requireAuth: true } },
            //根据运输量(航空运输)统计的前10位客户
            { path: '/topAccAirOrder', component: topAccAirOrder, name:'', menuShow: false, meta: { requireAuth: true } },
            //根据运输量(水路运输)统计的前10位客户
            { path: '/topAccOceanOrder', component: topAccOceanOrder, name:'', menuShow: false, meta: { requireAuth: true } },
            //根据报关单来统计的报关量
			{ path: '/customsVolume', component: customsVolume, name:'', menuShow: false, meta: { requireAuth: true } },
			

			//Top 10 进口货源地(以启运国为基础)
			{ path: '/topImportOrigin', component: topImportOrigin, name:'', menuShow: false, meta: { requireAuth: true } },
			//Top 10 海关编号
			{ path: '/topHSCode', component: topHSCode, name:'', menuShow: false, meta: { requireAuth: true } },
			//进口统计(货量/价格/税费)
			{ path: '/importStatisticsVVD', component: importStatisticsVVD, name:'', menuShow: false, meta: { requireAuth: true } },
			//进口税费(币制：人民币元)
			{ path: '/importStatisticsDuty', component: importStatisticsDuty, name:'', menuShow: false, meta: { requireAuth: true } },
        ]
    },
    //帐号管理
    {
        path: '/',
        component: main,
        name: i18n.t('message.menuName.accountManagement'),
        leaf: false,
        menuShow: true,
        iconCls: 'iconfont wbs-zhanghaoguanli sidebar-icon',
        children: [
            //webase帐户列表
            // { path: '/accountInfo', component: accountInfo, name: i18n.t('message.menuName.accountManagement'), menuShow: true, meta: { requireAuth: true } },
            //有信运帐户列表
            { path: '/accountList', component: accountList, name: i18n.t('message.menuName.userManagement'), menuShow: true, meta: { requireAuth: true } },
            { path: '/accountMsg', component: accountMsg, name: i18n.t('message.menuName.accountMsg'), menuShow: false, meta: { requireAuth: true } },
			
			//有信运角色管理
            { path: '/roleList', component: roleList, name: i18n.t('message.menuName.roleManagement'), menuShow: true, meta: { requireAuth: true } },
            { path: '/authorManagement', component: authorManagement, name: i18n.t('message.roleManagement.authorConfig'), menuShow: false, meta: { requireAuth: true } },
			
			{ path: '/clientList', component: clientList, name: i18n.t('message.menuName.clientManagement'), menuShow: true, meta: { requireAuth: true } },
        ]
    },
    //业务管理
    {
        path: '/',
        component: main,
        name: i18n.t('message.menuName.businessManagement'),
        menuShow: true,
        leaf: false,
        iconCls: 'iconfont wbs-yewuguanli sidebar-icon',
        children: [
            { path: '/businessSearch', component: businessSearch, name: i18n.t('message.menuName.IEBusiness'), menuShow: true, meta: { requireAuth: true } },
            { path: '/businessList', component: businessList, name: '', menuShow: false, meta: { requireAuth: true } },
            { path: '/businessDetail', component: businessDetail, name: i18n.t('message.menuName.businessDetail'), menuShow: false, meta: { requireAuth: true } },
			// { path: '/analyze', component: analyze, name: i18n.t('message.menuName.analyze'), menuShow: true, meta: { requireAuth: true } },
		]
	},
	//数据统计、控制面板
    {
        path: '/main',
        name: 'main',
        // redirect: '/home',
        leaf: true,
        menuShow: true,
        iconCls: 'iconfont wbs-kongzhimianban sidebar-icon',
        component: main,
        children: [
            {
                path: '/home', component: home, name: i18n.t('message.menuName.controlPanel')+"  ", menuShow: true, meta: { requireAuth: true }
            }
        ]
    },
    //区块浏览
    {
        path: '/',
        component: main,
        name: i18n.t('message.menuName.blockBrowse'),
        menuShow: true,
        iconCls: 'iconfont wbs-qukuaiguanli sidebar-icon',
        children: [
            { path: '/blockInfo', component: blockInfo, name: i18n.t('message.menuName.blockInfo'), menuShow: true, meta: { requireAuth: true } },
            { path: '/transactionInfo', component: transactionInfo, name: i18n.t('message.menuName.transactionInfo'), menuShow: true, meta: { requireAuth: true } },
        ]
    },
    //节点管理
    {
        path: '/',
        component: main,
        name: i18n.t('message.menuName.nodeManagement')+" ",
        leaf: true,
        menuShow: true,
        iconCls: 'iconfont wbs-jiedianguanli sidebar-icon',
        children: [
            { path: '/front', component: front, name: i18n.t('message.menuName.nodeManagement'), menuShow: true, meta: { requireAuth: true } },
            { path: '/hostDetail', component: hostDetail, name: i18n.t('message.menuName.nodeDetail'), menuShow: false, meta: { requireAuth: true } }
        ]
    },
    //合约管理
    {
        path: '/',
        component: main,
        name: i18n.t('message.menuName.contractManagement'),
        // leaf: true,
        menuShow: true,
        iconCls: 'iconfont wbs-heyueguanli sidebar-icon',
        children: [
            { path: '/contract', component: contract, name: i18n.t('message.menuName.contractIDE'), menuShow: true, meta: { requireAuth: true } },
            { path: '/contractList', component: oldContract, name: i18n.t('message.menuName.contractList'), menuShow: true, meta: { requireAuth: true } },
            { path: '/cnsManagement', component: cnsManagement, name: i18n.t('message.menuName.cnsInquire'), menuShow: true, meta: { requireAuth: true } },
            { path: '/CRUDServiceManagement', component: CRUDServiceManagement, name: i18n.t('message.menuName.crud'), menuShow: true, meta: { requireAuth: true } }
        ]
    },
    //私钥管理
    {
        path: '/',
        component: main,
        name: i18n.t('message.menuName.privateKeyManagement'),
        leaf: true,
        menuShow: true,
        iconCls: 'iconfont wbs-siyueguanli sidebar-icon',
        children: [
            { path: '/privateKeyManagement', component: rivateKeyManagement, name: i18n.t('message.menuName.privateKeyManagement'), menuShow: true, meta: { requireAuth: true } }
        ]
    },
    //系统管理
    {
        path: '/',
        component: main,
        name: i18n.t('message.menuName.systemManagement'),
        menuShow: true,
        iconCls: 'iconfont wbs-xitongguanli sidebar-icon',
        children: [
            // { path: '/authorManagement', component: authorManagement, name: '权限管理', menuShow: true, meta: { requireAuth: true } },
            { path: '/permission', component: permission, name: i18n.t('message.menuName.permissionManagement'), menuShow: true, meta: { requireAuth: true } }, 
            { path: '/configManagement', component: configManagement, name: i18n.t('message.menuName.configManagement'), menuShow: true, meta: { requireAuth: true } },
            { path: '/certificate', component: certificate, name: i18n.t('message.menuName.certificateManagement'), menuShow: true, meta: { requireAuth: true } }
            
        ]
    },
    //系统监控
    {
        path: '/',
        component: main,
        name: i18n.t('message.menuName.systemMonitor'),
        menuShow: true,
        iconCls: 'iconfont wbs-xitongjiance sidebar-icon',
        children: [
            // { path: '/errorLogExport', component: errorLogExport, name: '错误日志', menuShow: true, meta: { requireAuth: true } },
            { path: '/nodesMetric', component: nodesMetric, name: i18n.t('message.menuName.nodeMonitor'), menuShow: true, meta: { requireAuth: false } },
            { path: '/hostMetric', component: hostMetric, name: i18n.t('message.menuName.hostMonitor'), menuShow: true, meta: { requireAuth: false } },
        ]
    },
    //交易审计
    {
        path: '/',
        component: main,
        name: i18n.t('message.menuName.transactionAudit'),
        menuShow: true,
        iconCls: 'iconfont wbs-jiaoyishenji sidebar-icon',
        children: [
            { path: '/transactionCharts', component: transactionCharts, name: i18n.t('message.menuName.userTransaction'), menuShow: true, meta: { requireAuth: true } },
            { path: '/unusualUser', component: unusualUser, name: i18n.t('message.menuName.unusualUser'), menuShow: true, meta: { requireAuth: true } },
            { path: '/unusualContract', component: unusualContract, name: i18n.t('message.menuName.unusualContract'), menuShow: true, meta: { requireAuth: true } }
        ]
    }, 
    // {
    //     path: '/',
    //     component: main,
    //     name: i18n.t('message.menuName.accountManagement'),
    //     leaf: true,
    //     menuShow: true,
    //     iconCls: 'wbs-icon-key sidebar-icon',
    //     children: [
    //         { path: '/accountInfo', component: accountInfo, name: i18n.t('message.menuName.accountManagement'), menuShow: true, meta: { requireAuth: true } }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: main,
    //     name: '告警配置',
    //     menuShow: true,
    //     iconCls: 'wbs-icon-monitor sidebar-icon',
    //     children: [
    //         { path: '/mailboxAlarmManagement', component: mailboxAlarmManagement, name: '邮件告警配置', menuShow: true, meta: { requireAuth: false } },
    //     ]
    // },
    //模板管理
    {
        path: '/',
        component: main,
        name: i18n.t('message.menuName.templateManagement'),
        leaf: false,
        menuShow: true,
        iconCls: 'iconfont wbs-mobanguanli sidebar-icon',
        children: [
            //有信运模板上传
            { path: '/templateUpload', component: templateUpload, name: i18n.t('message.menuName.templateUpload'), menuShow: true, meta: { requireAuth: true } },
            //有信运模板列表
            { path: '/templateList', component: templateList, name: i18n.t('message.menuName.templateList'), menuShow: true, meta: { requireAuth: true } },
        ]
    },
    //账本管理
    {
        path: '/',
        component: main,
        name: i18n.t('message.menuName.accountbookManage'),
        leaf: true,
        menuShow: true,
        iconCls: 'iconfont wbs-accountbook sidebar-icon',
        children: [
            //有信运模板上传
            { path: '/accountbookManage', component: accountbookManage, name: i18n.t('message.menuName.accountbookManage'), menuShow: true, meta: { requireAuth: true } },
        ]
    }
]

const router = new Router({
    routes
});
router.onError((error) => {
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    const targetPath = router.history.pending.fullPath;
    if (isChunkLoadFailed) {
        router.go(0);
        router.replace(targetPath);
    }
});

export default router
