const config = {
    degree: {
        TNT: 10000000000,
        ONG: 1000000000,
        TONT: 100000000
    },
    game: {
        successCode: '6775657373',
        errCode: '6572726f72',
        targetMin: 2,
        targetMax: 96
    },
    contract: {
        hash: '55c494d57ac7cbaad565b5e19ea757dcfe315e29',
        gasPrice: 500,
        gasLimit: 200000,
        operation: 'Guess'
    },
    currencys: {
        'TONT': {
            name: 'TONT',
            min: 1,
            max: 100,
            degree: 100000000,
            code: 4,
            enable: true,
            contractHash: '20990490514079dd5e99be3c9ac929a5413af0e6'
        },
        'ONG': {
            name: 'ONG',
            min: 1,
            max: 100,
            code: 1,
            enable: true,
            contractHash: ''
        },
        'TNT': {
            name: 'TNT',
            min: 10,
            max: 10000,
            code: 3,
            enable: true,
            contractHash: '49f0908f08b3ebce1e71dc5083cb9a8a54cc4a24'
        },
        'ONT': {
            name: 'ONT',
            min: 10,
            max: 10000,
            code: 2,
            enable: false,
            contractHash: ''
        }
    }
}
