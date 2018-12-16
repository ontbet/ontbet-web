import Vue from 'vue'
import VueI18n from 'vue-i18n'
import locale from 'element-ui/lib/locale';
import zh from '@/i18n/languages/zh'
import en from '@/i18n/languages/en'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(VueI18n)

const messages = {
    en: Object.assign(en, enLocale),
    zh: Object.assign(zh, zhLocale)
}

// 获取html的lang属性
function getLanguage () {
    let language = window.navigator.language || window.navigator.browserLanguage;
    return language ? language.split('-')[0] : '';
}

const i18n = new VueI18n({
    locale: window.localStorage.getItem('locale') || getLanguage() || 'en',
    messages
})


locale.i18n((key, value) => i18n.t(key, value)) //为了实现element插件的多语言切换

export default i18n