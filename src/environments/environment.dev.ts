/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// import env from './.env';

export const environment = {
    production: true,
    baseUrl: 'http://192.168.0.179:8000',
    env: 'dev',
    appPrefix: '/home',
    firebase: {
        apiKey: '',
        authDomain: '',
        databaseURL: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: ''
    },
    appName: 'demo.com',
    showLog: false // set ture if console log need to hide
};

/**
 * Declare API endpoints here and used on whenever user want
 */
export const apiInfo = {
    endpoint: '',
    version: 'v1/',
    info: {
        'login': '/login',
        'forgotPassword': '/password/reset',
        'resetPassword': '/password/set',
    },
    MODE_PULSE: 'pulse', // Registered  free user (LAPP Users/created from app)
    MODE_LTL: 'ltl' // Registered paid user (KAPP Users/created from admin)
};
