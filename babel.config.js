module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['module-resolver', {
      alias: {
        '@Config': './src/config',
        '@Controllers': './src/controllers',
        '@Entities': './src/entities',
        '@Builders': './src/builders',
        '@Errors': './src/errors',
        '@Repositories': './src/repositories',
        '@Services': './src/services',
        '@Types': './src/@types',
        '@Constants': './src/constants',
        '@Middlewares': './src/middlewares',
        '@Docs': './src/docs'
      }
    }]
  ],
  ignore: [
    '**/*.test.ts'
  ]
}
