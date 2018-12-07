import http from '@/utils/http'
import {
    USER_INFO
} from './constant'

export default {
    getUserInfo() {
        return http.post(userinfo);
    }
}