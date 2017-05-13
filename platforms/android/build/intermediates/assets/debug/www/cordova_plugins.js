cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-sms/www/SMS.js",
        "id": "cordova-plugin-sms.SMS",
        "clobbers": [
            "window.SMS"
        ]
    },
    {
        "file": "plugins/cordova-plugin-spinnerdialog/www/spinner.js",
        "id": "cordova-plugin-spinnerdialog.SpinnerDialog",
        "merges": [
            "window.plugins.spinnerDialog"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{}
// BOTTOM OF METADATA
});