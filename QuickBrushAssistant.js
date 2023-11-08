
// ==UserScript==
// @name         直播and屏幕共享 速刷助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  助力业务审核
// @author       熊喵呜哇
// @match        https://tonghang.woa.com/v2q/qq_channel_live/audit/100000
// @match        https://tonghang.woa.com/v2q/qq_channel_screen_share/audit/100000
// @icon         https://qq-web.cdn-go.cn//im.qq.com_new/7bce6d6d/asset/favicon.ico
// @license      GPL-3.0 License
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 配置信息
    const info = {
        timeGap: 5000, // 刷新超过多少秒就弹出通知
        refreshRate: 500, // 刷新频率，单位ms
    };

    let timerId;
    let startTimestamp;

    // 提交当前case逻辑
    function submit(e) {
        const btn = document.querySelector('.ant-btn.antd-pro-pages-audit2-index2-submitButton.ant-btn-primary');
        if (btn) {
            btn.click();
        }
    }

    // 刷新
    function refresh() {
        clearTimeout(timerId);

        timerId = setTimeout(() => {
            const len = document.getElementsByTagName('form').length;
            if (len) {
                // notification()
                return;
            }
            document.querySelector('.ant-menu-item.ant-menu-item-selected').children[0].click();
            startTimestamp = Date.now();
        }, info.refreshRate);
    }

    // mousedown事件的处理函数，用于启动刷新和提交逻辑
    function start(e) {
        if (e.button == 1) {
            e.preventDefault();
            submit(e);
            refresh();
        }
    }

    // 键盘enter事件的处理函数，用于启动刷新逻辑
    function enterClick(e) {
        if (e.keyCode === 13) {
            refresh();
        }
    }

    // 右键菜单关闭刷新功能
    document.addEventListener('mousedown', (e) => {
        if (e.button === 2) {
            clearTimeout(timerId);
        }
    });

    // 空格键关闭刷新功能
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === 32) {
            clearTimeout(timerId);
        }
    });

    // 初始化脚本
    function init() {
        document.addEventListener('mousedown', start);
        document.addEventListener('keydown', enterClick);
    }

    init();
})();
