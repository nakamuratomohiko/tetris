module.exports = {
    entry: './client/core/app.ts',
    output: {
        filename: './client/dist/app.js'
    },
    resolve: {
        extensions: ['.ts','.js']
    },
    module: {
        loaders: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    }

};
//# sourceMappingURL=webpack.config.js.map