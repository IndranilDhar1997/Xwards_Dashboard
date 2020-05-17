const Config = {
    env: 'dev',
    local: {
        url: 'http://localhost:3000',
        RESTURL: 'http://0985caaa.ngrok.io',
        MAINSITE: 'http://localhost:8000'
    },
    dev: {
        url: 'https://dev.dashboard.xwards.com',
        RESTURL: 'https://dev.api.xwards.com',
        MAINSITE: 'https://dev.xwards.com'
    },
    test: {
        url: 'https://test.dashboard.xwards.com',
        RESTURL: 'https://test.api.xwards.com',
        MAINSITE: 'https://test.xwards.com'
    },
    prod: {
        url: 'https://dashboard.xwards.com',
        RESTURL: 'https://api.xwards.com',
        MAINSITE: 'https://developer.xwards.com'
    }
}

export default Config;
