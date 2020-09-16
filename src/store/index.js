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
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    creatUserVisible: false, //creat account
    isLogin: 0,
    loading: false,
    menuShow:true,
    headTitleArray:[],
    orderSearchParams:{},
    headShowUrl:"",
    orderCurrentPage:1,//订单列表浏览页码
}
export default new Vuex.Store({
    state,
    getters: {
        not_show(state) {
            return !state.creatUserVisible
        }
    },
    mutations: {
        switch_creat_user_dialog(state) {
            state.creatUserVisible = !state.creatUserVisible
        },
        changeLogin(state, status) {
            state.isLogin = status
        },
        showLoading(state) {
            state.loading = true
        },
        hideLoading(state) {
            state.loading = false
        },
        setMenuShow(state) {
            state.menuShow = !state.menuShow
        },
        setTitleArray(state,titleArray){
            state.headTitleArray.length = 0;
            state.headTitleArray = titleArray;
        },
        setOrderSearchParams(state,searchParams){
            state.orderSearchParams = searchParams;
        },
        setHeadShowUrl(state,headShowUrl){
            state.headShowUrl = headShowUrl;
        },
        //保存订单列表当前浏览页码
        setOrderCurrentPage(state,orderCurrentPage){
            state.orderCurrentPage = orderCurrentPage;
        },
    },
    actions: {
        switch_creat_user_dialog(context) {
            context.commit('switch_creat_user_dialog')
        },
        loginAction({ commit }) {
            commit('changeLogin', 1)
        },
        //控制左侧菜单显示隐藏
        setMenuShow(context) {
            context.commit('setMenuShow')
        },
        //存储右侧顶部内容标题数据
        setTitleArray({commit},titleArray) {
            commit('setTitleArray',titleArray)
        },
        //存储口岸进出口查询参数
        setOrderSearchParams({commit},searchParams){
            commit('setOrderSearchParams',searchParams)
        },
        //保存头像地址
        setHeadShowUrl({commit},headShowUrl){
            commit('setHeadShowUrl',headShowUrl)
        },
        //保存订单列表当前浏览页码
        setOrderCurrentPage({commit},orderCurrentPage){
            commit('setOrderCurrentPage',orderCurrentPage)
        },
    }
})