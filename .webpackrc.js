export default {
    "extraBabelPlugins": [
        ["import", {
            "libraryName": "antd",
            "libraryDirectory": "es",
            "style": true
        }]
    ],
    "env": {
        "development": {},
        "production": {
            "extraBabelPlugins": [
                ["transform-remove-console", {
                    "exclude": ["error"]
                }]
            ]
        }
    },
    "publicPath": "/",
    "hash": true,
    "ignoreMomentLocale": true,
    "disableDynamicImport": true,
    "define": {
        "process.env": {},
    }
}
