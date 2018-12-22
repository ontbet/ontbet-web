import { client } from "ontology-dapi";
let Ont = require("ontology-ts-sdk");

export default {

    /**
     * 获取账户信息
     */
    async getAccount() {
        client.registerClient({});
        const account = await client.api.asset.getAccount();
        const address = new Ont.Crypto.Address(account);
        const scriptHash = address.serialize();
        return {
            account,
            address: address.value || '',
            scriptHash
        };
    },

    /**
     * 获取账户余额
     * @param {*} address 
     */
    async getBalance(address) {
        return await client.api.network.getBalance({
            address: address
        });
    },

    /**
     * 获取TONT余额
     * @param {*} chash 合约hash
     * @param {*} uhash 用户hash - scriptHash
     */
    async getTONT(chash, uhash) {
        const args = [{
            type: "ByteArray",
            value: uhash
        }];
        const result = await client.api.smartContract.invokeRead({
            scriptHash: chash,
            operation: 'banlanceTONT',
            args
        }); //得到banlanceTONT返回的调用结果，结果返回的是一个hexstring的int，需要转换一下。
        return result;
    },

     /**
     * 获取TNT余额
     * @param {*} chash 合约hash
     * @param {*} uhash 用户hash - scriptHash
     */
    async getTNT(chash, uhash) {
        const args = [{
            type: "ByteArray",
            value: uhash
        }];
        const result = await client.api.smartContract.invokeRead({
            scriptHash: chash,
            operation: 'balanceOf',
            args
        }); //得到banlanceTONT返回的调用结果，结果返回的是一个hexstring的int，需要转换一下。
        return result;
    }

}