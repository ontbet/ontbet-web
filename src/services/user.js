export default {
    /**
     * 获取用户信息
     */
    getUserInfo() {
        console.log('获取用户信息');
        return {
            name: '张三',
            address: '64f75b59554a2008bcc1a87a7ae09249abc74a91',
            scripthash: '95feeda3a7f41e43204353de64aa7b016e4ffaa3'
        }
    },

    /**
     * 获取钱包余额
     */
    getBalance() {
        console.log('获取钱包余额');
        return {
            'TONT': 2.00
        }
    }
}