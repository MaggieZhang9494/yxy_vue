<template>
    <div>
        <v-content-head :headTitle="'message.menuName.cnsInquire'" :headTitlePath="{path:'/cnsManagement'}" @changGroup="changGroup" :headTooltip="$t('message.cnsInquire.tipSearch')"></v-content-head>
        <div class="module-wrapper" style="padding: 30px 29px 0 29px;">
            <!-- <span class="instructions bg-efefef"></span> -->
            <el-form :model="cnsForm" :rules="rules" ref="cnsForm" class="demo-ruleForm">
                <el-form-item :label="$t('message.contractIDE.contractName')" prop="contractName" class="item-form">
                    <el-input size="mini" v-model.trim="cnsForm.contractName" :placeholder="$t('message.common.input')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.cnsInquire.contractVersion')" prop="contractVersion" class="item-form">
                    <el-input size="mini" v-model.trim="cnsForm.contractVersion" :placeholder="$t('message.common.input')"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="searchCns('cnsForm')" class="modify-btn" :disabled="disabled" :loading="loading">{{$t('message.common.search')}}</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="cnsList" tooltip-effect="dark" v-loading="loading" class="search-table-content">
                <el-table-column v-for="head in cnsHead" :label="head.name" :key="head.enName" show-overflow-tooltip align="left" :width="head.width">
                    <template slot-scope="scope">
                        <span>{{scope.row[head.enName]}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import { queryCnsList } from "@/util/api";
import Bus from "@/bus"
export default {
    name: 'ConfigManagement',

    components: {
        "v-content-head": contentHead,
    },

    props: {
    },

    data() {
        return {
            disabled: false,
            loading: false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            cnsForm: {
                contractVersion: '',
                contractName: '',
            },
            cnsList: [],
            cnsHead: [
                {
                    enName: "name",
                    name: this.$i18n.t('message.contractIDE.contractName'),
                    width: '100'
                },
                {
                    enName: "version",
                    name: this.$i18n.t('message.cnsInquire.contractVersion'),
                    width: ''
                },
                {
                    enName: "address",
                    name: this.$i18n.t('message.contractIDE.contractAddress'),
                    width: ''
                },
                {
                    enName: "abi",
                    name: this.$i18n.t('message.contractList.contractAbi'),
                    width: ''
                },
            ],
            rules: {
                // contractVersion: [
                //     {
                //         required: true,
                //         message: "请输入合约版本号",
                //         trigger: "blur"
                //     }
                // ],
                contractName: [
                    {
                        required: true,
                        message: this.$i18n.t('message.cnsInquire.inputContractName'),
                        trigger: "blur"
                    }
                ]
            }
        }
    },

    computed: {
    },
    created(){
        this.dealZH_EN();
    },
    beforeDestroy: function () {
        Bus.$off("changeGroup")
    },
    mounted() {
        Bus.$on("changeGroup", data => {
            this.changGroup(data)
        })
        if (localStorage.getItem("root") === "admin") {
            this.disabled = false
        } else {
            this.disabled = true
        }
    },

    methods: {
        /**
         * 处理中英文数据
         */
        dealZH_EN(){
            if(localStorage.getItem("internationalization") == 'zh-cn'){ /* 中文版本 */
                this.cnsHead = this.cnsHead.map(item=>{
                    if(item.enName=='name'){//合约姓名
                        item.width = '100';
                    }else if(item.enName=='version'){//合约版本
                        item.width = '';
                    }else if(item.enName=='address'){//合约地址
                        item.width = '';
                    }else if(item.enName=='abi'){//合约abi
                        item.width = '';
                    }else{
                        item.width = '';
                    }
                    return item;
                })
            }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
                this.cnsHead = this.cnsHead.map(item=>{
                    if(item.enName=='name'){//合约姓名
                        item.width = '150';
                    }else if(item.enName=='version'){//合约版本
                        item.width = '';
                    }else if(item.enName=='address'){//合约地址
                        item.width = '';
                    }else if(item.enName=='abi'){//合约abi
                        item.width = '';
                    }else{
                        item.width = '';
                    }
                    return item;
                })
            }else{
                this.cnsHead = this.cnsHead.map(item=>{
                    if(item.enName=='name'){//合约姓名
                        item.width = '100';
                    }else if(item.enName=='version'){//合约版本
                        item.width = '';
                    }else if(item.enName=='address'){//合约地址
                        item.width = '';
                    }else if(item.enName=='abi'){//合约abi
                        item.width = '';
                    }else{
                        item.width = '';
                    }
                    return item;
                })
            }
        },
        changGroup() {
            this.getCnsList()
        },
        searchCns(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.getCnsList()
                } else {
                    return false;
                }
            });

        },
        getCnsList() {
            this.loading = true;
            let reqData = {
                groupId: localStorage.getItem("groupId"),
                pageNumber: this.currentPage,
                pageSize: this.pageSize,
            }
            if(this.cnsForm.contractVersion){
                reqData.contractNameAndVersion = `${this.cnsForm.contractName}:${this.cnsForm.contractVersion}`
            }else {
                reqData.contractNameAndVersion = `${this.cnsForm.contractName}`
            }
            queryCnsList(reqData)
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.cnsList = res.data.data;
                        this.total = res.data.totalCount
                        this.$message({
                            type: 'success',
                            message: this.$i18n.t('message.contractList.searchSuc')
                        })
                    } else {
                        this.$message({
                            type: "error",
                            message: this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en
                        });
                    }
                })
                .catch(err => {
                    this.loading = false;
                    let message = this.$i18n.t('message.common.systemError');
					if(err && err.data && err.data.code){
						message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
					}
					this.$message({
						type: "error",
						message: message
					});
                });
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getCnsList();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getCnsList();
        },
    }
}
</script>

<style scoped>
.demo-ruleForm {
    display: flex;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: -moz-flex;
}
.item-form {
    display: flex;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: -moz-flex;
    margin-left: 10px;
}
.item-form:first-child {
    margin-left: 0px;
}
.modify-btn {
    margin-left: 10px;
}
.instructions {
    margin-bottom: 16px;
    padding: 10px 10px;
    color: #2e384d;
    border-radius: 10px;
    display: inline-block;
}
.search-table-content {
    margin-top: 20px;
}
.search-table-content >>> th {
    background: #fafafa;
}

</style>
