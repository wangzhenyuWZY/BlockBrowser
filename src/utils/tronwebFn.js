const initTronWeb = () => {//初始化tronweb
    return new Promise(function (resolve, reject) {
        let tries = 0;
        const loadFinish = function () {
            resolve(window.tronWeb);
        };
        let timer = setInterval(function () {
            if (window.tronWeb) {
                clearInterval(timer);
                if (!window.tronWeb.defaultAddress.base58) {
                    window.tronWeb.on('addressChanged', function () {
                        return loadFinish();
                    });
                } else {
                    return loadFinish();
                }
            }
            if (tries > 10) {
                clearInterval(timer);
                reject();
            }
        }, 100);
    });
}
const allowance = (coinAddress,contractAddress) => {//查询授权
    return new Promise(function (resolve, reject) {
        try {
            window.tronWeb.contract().at(coinAddress).then((Contract)=>{
                Contract["allowance"](window.tronWeb.defaultAddress.base58, contractAddress).call().then((res)=>{
                    resolve(res)
                })
            })
        } catch (error) {
            console.log(error);
            reject()
        }
    })
}
// const bPoolAllowance = (coinAddress,contractAddress) => {//BPool查询授权
//     return new Promise(function (resolve, reject) {
//         try {
//             var functionSelector = 'allowance(address,uint256)';
//             var parameter = [
//                 {type: 'address', value: coinAddress}
//             ]
//             window.tronWeb.transactionBuilder.triggerConstantContract(contractAddress,functionSelector,{}, parameter).then((transaction)=>{
//                 resolve(transaction)
//             })
//         } catch (error) {
//             console.log(error);
//             reject()
//         }
//     })
// }
const approved = (coinAddress,contractAddress) => {//授权
    return new Promise(function (resolve, reject) {
        try {
            window.tronWeb.contract().at(coinAddress).then((Contract)=>{
                Contract["approve"](contractAddress,'10000000000000000').send({shouldPollResponse:true}).then((res)=>{
                    if(res){
                        alert('授权成功')
                        resolve(1);
                    }
                })
            })
        } catch (error) {
            reject(0)
            console.log(error);
        }
    })
}
const decimals = (address) => {//查询精度
    return new Promise(function (resolve, reject) {
        try {
            window.tronWeb.contract().at(address).then((Contract)=>{
                Contract["decimals"]().call().then((res)=>{
                    if(res){
                        resolve(res);
                    }
                })
            })
        } catch (error) {
            console.log(error);
        }
    })
}
const getConfirmedTransaction = (id) => {//轮询获取交易信息
    return new Promise(function (resolve, reject) {
        try {
            var interval = window.setInterval(()=>{
                window.tronWeb.trx.getTransactionInfo(id).then((res)=>{
                    if(res.contractResult){
                        clearInterval(interval)
                        console.log(res)
                        resolve(res);
                    }
                })
            },2000)
        } catch (error) {
            console.log(error);
        }
    })
}

export {approved,decimals,getConfirmedTransaction,allowance}
export default initTronWeb;