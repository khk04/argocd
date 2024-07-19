module.exports = {
    transpileDependencies: [
        'vuetify'
    ],

    devServer: {
        proxy: {
            '/backend/api/*': {
                target: 'http://localhost:4000' // 개발서버
            }
        }
    },

    //npm run build 하면 지정된 경로로 생성한다.
    outputDir: '/app/dist/',
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html'
        },
        PBSMonitoring: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'pbs-monitoring/index.html',
            chunks: ['chunk-vendors', 'chunk-common', 'PBSMonitoring']
        }
    },
    publicPath: '/',
}