import http from '@/utils/http'
import {
    USER_INFO
} from './constant'

export default {
    /**
     * 获取用户信息
     */
    getUserInfo() {
        return http.post(USER_INFO);
    }
}