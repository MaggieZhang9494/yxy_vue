
<template>
    <el-popover placement="bottom-start" width="250" @hide="popoverHide" trigger="click" v-model="isShowSelect">
        <el-tree
            style="height:300px;overflow-y: scroll;"
            v-if="isShowSelect"
            :data="treeData"
            :node-key="nodeKey"
            :default-expanded-keys="defaultExpandedKeys"
            :default-checked-keys="defaultCheckedKeys"
            :default-expand-all="defaultExpandAll"
            highlight-current
            @node-click="handleNodeClick"
            :props="defaultProps"
            :empty-text="$t('message.common.noData')"
        ></el-tree>
        <el-select slot="reference" ref="select" v-model="selectValue" size="mini" :clearable="true" :multiple="false" :placeholder="tipText" @click.native="clickSelect">
            <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.value"></el-option>
        </el-select>
    </el-popover>
</template>
<script>
import { isNullData } from '@/util/util'
/* 国际化 */
import i18n from '@/i18n/i18n'

export default {
    name: "selectTree",
    props: {
        treeData: { type: Array, required: true },
        defaultExpandAll: {
            type: Boolean,
            default: true
        },
        //是否允许选择父节点，默认不允许
        isAllowSelectParentNode:{
            type: Boolean,
            default: false
        },
        popoverHide: {
            type: Function,
            default: function () { }
        },
        returnMsg: [String, Array],
        nodeKey: { type: String, default: 'id', required: true },
        tipText: { type: String, default: i18n.t('message.common.choose') },
        defaultProps: {
            type:Object,
            default: function () {
                return {
                    children: 'children',
                    label: 'label'
                }
            },
            required: true,
        },
        //回显选中值
        showSelectValue:{
            type:String,
            default:""
        }
    },
    data () {
        return {
            // 是否显示树状选择器
            isShowSelect: false,
            options:[],
            selectValue:this.showSelectValue,
            showValueTmp: '',
            defaultExpandedKeys:[],
            defaultCheckedKeys:[],
        }
    },
    watch: {
        isShowSelect (val) {
            // 隐藏select自带的下拉框
            // this.$refs.select.blur()
            console.log("isShowSelect.....watch",val);
            // if (val) {
            //     console.log("key ,.....",this.keyArr);
            //     // 下拉面板展开-选中节点-展开节点
            //     this.setTreeCheckNode(this.keyArr)
            //     this.defaultCheckedKeys = this.keyArr
            //     this.defaultExpandedKeys = this.keyArr
            // }
        },
        selectValue (val) {
            this.$emit('update:selectValue', this.selectValue)
        },
        // showSelectValue(val){
        //     console.log("showSelectValue.....",val);
        //     // this.selectValue = val;
        //     this.$emit('update:selectValue', val)
        // }
    },
    mounted () {
        
    },
    methods: {
        clickSelect(){
            this.$refs.select.blur();
            // this.isShowSelect = !this.isShowSelect;
            console.log("clickSelect....", this.isShowSelect);
        },
        handleNodeClick (data) {
            console.log("data....", data);

            if(!this.isAllowSelectParentNode){
                //如果存在子节点，则不允许选择本节点
                if(!isNullData(data.children) && data.children.length>0){
                    return;
                } 
            }

            let tmpMap = {}
            tmpMap.value = data[this.nodeKey]
            tmpMap.label = data.label
            this.options = []
            this.options.push(tmpMap)
            console.log("this.options....", this.options);
            this.selectValue = data[this.nodeKey];
            this.isShowSelect = !this.isShowSelect
            
        },
        getKeys (data, checked) {
            let tmp = []
            checked.checkedNodes.forEach(node => {
                let tmpMap = {}
                tmpMap.value = node.id
                tmpMap.label = node.label
                tmp.push(tmpMap)
            })
            this.options = tmp
            this.keyArr = checked.checkedKeys
        },
        setTreeCheckNode (ids) {
            let tmp = []
            ids.forEach(id => {
                this.findTreeNode(this.treeData, id)
                tmp.push(this.showValueTmp)
            })
        },
        // 递归查询树形节点
        findTreeNode (tree, id) {
            if ((!isNullData(tree)) && (!isNullData(id))) {
                for (var i = 0; i < tree.length; i++) {
                    if (tree[i].id === id) {
                        this.showValueTmp = tree[i].label
                    } else if (tree[i].children != null && tree[i].children.length > 0) {
                        this.findTreeNode(tree[i].children, id)
                    }
                }
            }
        }
    }
}
</script>
<style scoped>
    .el-select{
        width: 280px;
    }
</style>
