export const tokenList = [
    { 
        name:'WTRX',
        address:'TGky6zKfhrisXh92emTvPAbkenhXHTU8m6',
        img:'111',
        balance:0,
        decimals:6
    },
    { 
        name:'INVERST',
        address:'TNFjWx7h4X9LqGcfJumnTsKDdzN1ePvQ5C',
        img:'',
        balance:0,
        decimals:6
    },
    { 
        name:'DAI',
        address:'TRdyNcAxCFTDhrw1cWEKdWEX87hS6FFvGe',
        img:'',
        balance:0,
        decimals:18
    },
    { 
        name:'USDT',
        address:'TQKzfGM1F1bvjo2tnQ5Kirqdu2hR8mFWs2',
        img:'',
        balance:0,
        decimals:8
    },
    { 
        name:'FOX',
        address:'TE9oQF7Y8tbq5Lqdfr9S47QNXHt7GRcHh4',
        img:'',
        balance:0,
        decimals:12
    },
    { 
        name:'WETH',
        address:'TPkjDBVb3AyCqsnM5AfZ9NA8AtyTiP7sUZ',
        img:'',
        balance:0,
        decimals:18
    }
]
export const pairList = [
    {
        address:'TMMypXZP4z4dV9XuraDq3VdweY7PtsSUX8',
        token1:{ 
            name:'WTRX',
            address:'TGky6zKfhrisXh92emTvPAbkenhXHTU8m6',
            img:'111',
            balance:0,
            decimals:6
        },
        token2:{ 
            name:'USDT',
            address:'TQKzfGM1F1bvjo2tnQ5Kirqdu2hR8mFWs2',
            img:'',
            balance:0,
            decimals:8
        },
        pair:'WTRX/USDT',
        decimals:18
    }
]

const tokenData = {
    tokenList,
    pairList
}
export default tokenData


