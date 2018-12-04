import Vue from 'vue'
import VueI18n from 'vue-i18n'
import locale from 'element-ui/lib/locale';
import zh from '@/languages/zh'
import en from '@/languages/en'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import {
    getCookie
} from '@/utils/cookie'


Vue.use(VueI18n)

const messages = {
    en: Object.assign(en, enLocale),
    zh: Object.assign(zh, zhLocale)
}

const i18n = new VueI18n({
    locale: window.localStorage.getItem('locale') || getCookie('PLAY_LANG', 'zh'),
    messages
})


locale.i18n((key, value) => i18n.t(key, value)) //为了实现element插件的多语言切换

export default i18n