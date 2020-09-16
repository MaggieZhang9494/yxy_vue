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
<template>
    <div class="document-wrapper">
		<div v-if="orderType=='FI' && perssionData.dataMenu['DATA.FI.ORDER_DOC'].isSee==true" class="document-table">
            <el-table 
				:row-style="{height:0+'px'}" 
				:data="documentList" tooltip-effect="light" v-loading="loading">
                <el-table-column
                    align="center"
                    fixed="left"
                    :label="$t('message.businessSearch.number')"
                    :width="numberWidth">
                    <template slot-scope="scope">
                        <span>{{scope.row['number']}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-for="head in documentHeader" :min-width="head.columnWidth" :label="head.name" :key="head.enName" align="left">
                    <template slot-scope="scope">
						<div v-if="head.enName === 'DOC_DATE'" style="margin:5px 0px;">
							<span style="color:#333">{{scope.row[head.enName]}}</span><br>
							<span v-if="perssionData.dataMenu['DATA.FI.ORDER_DOC.DOC_DATE'].isUse==true">{{$t('message.businessSearch.cochainTime')+": "+(scope.row.DOC_CHAIN_TIME?scope.row.DOC_CHAIN_TIME:"")}}</span>
						</div>
						<div v-else>
							<span v-if="head.enName === 'DOC_NAME'" style='color: #1585FF;cursor:pointer;'  @click="lookDocument(scope.row.DOC_PATH)">{{scope.row[head.enName]}}</span>
							<span v-else >{{scope.row[head.enName]}}</span>
						</div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <div v-if="orderType=='FE' && perssionData.dataMenu['DATA.FE.ORDER_DOC'].isSee==true" class="document-table">
            <el-table 
				:row-style="{height:0+'px'}" 
				:data="documentList" tooltip-effect="light" v-loading="loading">
                <el-table-column
                    align="center"
                    fixed="left"
                    :label="$t('message.businessSearch.number')"
                    :width="numberWidth">
                    <template slot-scope="scope">
                        <span>{{scope.row['number']}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-for="head in documentHeader" :min-width="head.columnWidth" :label="head.name" :key="head.enName" align="left">
                    <template slot-scope="scope">
						<div v-if="head.enName === 'DOC_DATE'" style="margin:5px 0px;">
							<span style="color:#333">{{scope.row[head.enName]}}</span><br>
							<span v-if="perssionData.dataMenu['DATA.FE.ORDER_DOC.DOC_DATE'].isUse==true">{{$t('message.businessSearch.cochainTime')+": "+(scope.row.DOC_CHAIN_TIME?scope.row.DOC_CHAIN_TIME:"")}}</span>
						</div>
						<div v-else>
							<span v-if="head.enName === 'DOC_NAME'" style='color: #1585FF;cursor:pointer;'  @click="lookDocument(scope.row.DOC_PATH)">{{scope.row[head.enName]}}</span>
							<span v-else >{{scope.row[head.enName]}}</span>
						</div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import { getDocumentsList } from "@/util/api";
import { IsExstsFile } from "@/util/util";
import Bus from "@/bus"
import { getFileListHeadList } from '@/util/role/menuDataShowDeal'

export default {
    name: "documents",
    components: {

	},
	props:{
        orderMsg:{
            type:Object,
            default:()=>{
                return {};
            }
		},
		orderType:{
			type:String
		},
        businessDesc:{
            type:Object,
            default:()=>{
                return {};
            }
        }
    },
    data() {
        return {
            loading: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            headSubTitle:"",

            documentHeader: [],
			//列表数组
			documentList:[],
            documentTotalList: [
			],

            //列表视图对应列的宽度
			numberWidth:50,//序号
			
			perssionData:{},
        };
    },
    created(){

		this.perssionData = JSON.parse(localStorage.getItem("MenuDataCode"))
		console.log("this.perssionData......", this.perssionData);
		this.documentHeader = getFileListHeadList(this.orderType, this.perssionData);
		console.log("this.documentHeader......", this.documentHeader);
    },
    mounted: function() {
        this.dealZH_EN();
		// this.dealColumWidth();
		
		//表头存在数据，则显示列表
		if (this.documentHeader.length>0) {
			if (this.orderMsg.ORDER_DOC) {
				this.documentTotalList = [];
				this.documentTotalList = this.orderMsg.ORDER_DOC.map((item,index)=>{
					item.number = (this.currentPage-1)*this.pageSize+index+1;
					item.cochainTime = "";
					return item;
				})
			}else{
				this.documentTotalList = this.documentTotalList.map((item,index)=>{
					item.number = (this.currentPage-1)*this.pageSize+index+1;
					return item;
				})
			}

			this.total = this.documentTotalList.length;

			this.getDocumentList();
		}
    },
    methods: {
        /**
         * 处理中英文数据
         */
        dealZH_EN(){
            if(localStorage.getItem("internationalization") == 'zh-cn'){ /* 中文版本 */
                this.numberWidth=50;
            }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
                this.numberWidth=50;
            }else{
                this.numberWidth=50;
            }
        },
        //处理每列显示宽度
        dealColumWidth(){
            let _this = this;
            _this.documentHeader.map(item=>{
                item.columnWidth = '100px';

                if(localStorage.getItem("internationalization") == 'zh-cn'){ /* 中文版本 */

                }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */

                }
            })
		},
		//获取数组中第几页数据
		getPageArray(pageSize, currentPage, arr) {
			var skipNum = (currentPage - 1) * pageSize;
			var newArr = (skipNum + pageSize >= arr.length) ? arr.slice(skipNum, arr.length) : arr.slice(skipNum, skipNum + pageSize);
			return newArr;
		},
        //获取单证文件列表
        getDocumentList() {
			this.documentList = this.getPageArray(this.pageSize, this.currentPage,this.documentTotalList);
			console.log("this.documentList...", this.documentList);
            // if (this.isNullData(localStorage.getItem("groupId"))) {
            //     return;
            // }
            // this.loading = true;
			// let reqQuery = {};
			// let param = {};
            // getDocumentsList(param, reqQuery).then(res => {
            //     this.loading = false;
            //     if (res.data.code === 0) {
            //         let listArr = res.data.data.data || [];
            //         this.accountList = listArr.map((item,index)=>{
            //             item.number = (this.currentPage-1)*this.pageSize+index+1;
            //             return item;
            //         })
            //         this.total = res.data.data.total;
            //     } else {
            //         let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
            //         this.$message({
            //             type: "error",
            //             message: message
            //         });
            //     }
            // })
            // .catch(err => {
            //     this.loading = false;
            //     let message = this.$i18n.t('message.common.systemError');
            //     if(err && err.data && err.data.code){
            //         message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
            //     }
            //     this.$message({
            //         type: "error",
            //         message: message
            //     });
            // });
        },
        handleSizeChange: function(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getDocumentList();
        },
        handleCurrentChange: function(val) {
            this.currentPage = val;
            this.getDocumentList();
        },
        lookDocument(val) {
			if (this.orderType != 'FE'){//订单进口类型
				if (this.perssionData.dataMenu["DATA.FI.ORDER_DOC.DOC_PATH"].isUse==false) {
					this.$message({
						type: "warning",
						message: this.$i18n.t('message.common.noPerssion')
					});
					return;
				}
			}else{
				if (this.perssionData.dataMenu['DATA.FE.ORDER_DOC.DOC_PATH'].isUse==false) {
					this.$message({
						type: "warning",
						message: this.$i18n.t('message.common.noPerssion')
					});
					return;
				}
			}
			
			console.log("文件路径。。。", val);
			var reUrl01 =  /(http|https):\/\/([\w.]+\/?)\S*/;// /^(https|http):\/\/([\w-]+(\.[\w-]+)*\/?)+(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?$/;
			if(reUrl01.test(val) && !this.isNullData(val)){//IsExstsFile(val) && 
				window.open(val, '_blank');
			}else{
				this.$message({
					type: "warning",
					message: this.$i18n.t('message.businessDetail.fileAlert')
				});
			}
        },
    }
};
</script>

<style scoped>
    .document-table{
        margin: 20px;
    }
    .document-table /deep/ .el-button--text {
        margin-left: 5px !important;
        margin-right: 5px !important;
    }
</style>
