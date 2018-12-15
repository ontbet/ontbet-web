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
        const scripthash = address.serialize();
        return {
            account,
            address: address.value || '',
            scripthash
        };
    },

    /**
     * 获取账户余额
     * @param {*} address 
     */
    async getBalance(address) {
        return await client.api.provider.getProvider({
            address: address
        });
    },

    /**
     * 获取TONT余额
     * @param {*} chash 合约hash
     * @param {*} uhash 用户hash - scriptHash
     */
    async getTont(chash, uhash) {
        const args = [{
            type: "Bytearray",
            value: uhash
        }];
        const result = await client.api.smartContract.invokeRead({
            scriptHash: chash,
            operation: 'banlanceTONT',
            args
        }); //得到banlanceTONT返回的调用结果，结果返回的是一个hexstring的int，需要转换一下。
        return result;
    }

}