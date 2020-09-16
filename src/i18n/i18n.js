import Vue from 'vue'
import locale from 'element-ui/lib/locale'
import I18n from 'vue-i18n'
// 引入各个语言配置文件
import messages from './langs'
Vue.use(I18n);
// 创建vue-i18n实例i18n
const i18n = new I18n({
    // 设置默认语言
    locale:window.localStorage.getItem('internationalization') || 'zh-cn',
    // 添加多语言（每一个语言标示对应一个语言文件）
    messages
});
locale.i18n((key, value)=>{i18n.t(key, value)})

export default i18n;