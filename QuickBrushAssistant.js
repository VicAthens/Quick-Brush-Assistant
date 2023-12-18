// ==UserScript==
// @name         直播and屏幕共享 速刷助手
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  助力业务审核
// @author       熊喵呜哇
// @match        https://tonghang.woa.com/v2q/qq_channel_live/audit/100000
// @match        https://tonghang.woa.com/v2q/qq_channel_screen_share/audit/100000
// @icon         https://qq-web.cdn-go.cn//im.qq.com_new/7bce6d6d/asset/favicon.ico
// @license      GPL-3.0 License
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 创建浮动按钮
    const floatingButton = document.createElement('div');
    floatingButton.style.position = 'fixed';
    floatingButton.style.top = '50%';
    floatingButton.style.right = '20px';
    floatingButton.style.transform = 'translateY(-50%)';
    // 设置背景颜色和字体颜色为天蓝色
    floatingButton.style.backgroundColor = 'lightskyblue';
    floatingButton.style.color = 'white';
    // 设置按钮样式为圆角
    floatingButton.style.borderRadius = '10px';
    // 添加其他样式和属性，如 padding 和 cursor
    floatingButton.style.padding = '10px';
    floatingButton.style.cursor = 'pointer';
    floatingButton.textContent = '设置';
    document.body.appendChild(floatingButton);


    // 创建菜单
    const menu = document.createElement('div');
    menu.style.display = 'none';
    menu.style.position = 'fixed';
    menu.style.top = '50%';
    menu.style.left = '50%';
    menu.style.transform = 'translate(-50%, -50%)';
    menu.style.backgroundColor = 'white';
    menu.style.padding = '10px';
    menu.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.2)';
    menu.style.textAlign = 'center';
    menu.style.lineHeight = "2";

    // 创建标题
    const title = document.createElement('h2');
    title.textContent = '速刷助手';
    menu.appendChild(title);

    // 创建滑块标题
    const rangeTitle = document.createElement('h3');
    rangeTitle.textContent = '滑动调节刷新速度（调整后刷新生效）';
    menu.appendChild(rangeTitle);
    // 创建滑块和数值显示
    const rangeInput = document.createElement('input');
    rangeInput.type = 'range';
    rangeInput.min = '500';
    rangeInput.max = '5000';
    rangeInput.style.width = '200px';
    rangeInput.value = '500'; // 默认值为500
    const rangeValue = document.createElement('span');
    rangeValue.textContent = rangeInput.value + 'ms';
    rangeValue.style.marginLeft = '5px';
    menu.appendChild(rangeInput);
    menu.appendChild(rangeValue);
    // 更新滑块数值显示
    rangeInput.addEventListener('input', function () {
        rangeValue.textContent = rangeInput.value + 'ms';
    });
    menu.appendChild(document.createElement('br'));

    // 创建下拉菜单标题
    const selectTitle = document.createElement('h3');
    selectTitle.textContent = '调整免审时常';
    menu.appendChild(selectTitle);

    //  创建下拉菜单
    const selectInput = document.createElement('select');
    //  创建新的选项
    const option0 = document.createElement('option');
    option0.value = '0';
    option0.textContent = '10分钟';
    //  添加新的选项到下拉菜单
    selectInput.appendChild(option0);
    //  创建其他选项
    const option1 = document.createElement('option');
    option1.value = '1';
    option1.textContent = '20分钟';
    const option2 = document.createElement('option');
    option2.value = '2';
    option2.textContent = '30分钟';
    const option3 = document.createElement('option');
    option3.value = '3';
    option3.textContent = '40分钟';
    //  添加其他选项到下拉菜单
    selectInput.appendChild(option1);
    selectInput.appendChild(option2);
    selectInput.appendChild(option3);
    //  设置默认值为0
    selectInput.value = '0';
    menu.appendChild(selectInput);
    menu.appendChild(document.createElement('br'));

    // 创建保存按钮
    const saveButton = document.createElement('button');
    saveButton.textContent = '保存';
    menu.appendChild(saveButton);

    document.body.appendChild(menu);

    // Toggle菜单
    floatingButton.addEventListener('click', function () {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });

    // 保存数值
    saveButton.addEventListener('click', function () {
        const x = parseInt(rangeInput.value);
        const y = parseInt(selectInput.value);
        sessionStorage.setItem('x', x);
        sessionStorage.setItem('y', y);
        menu.style.display = 'none';
    });

    let f = false;
    let t = null;
    let startT = Date.now();
    let endT;

    const info = {
        timeGap: 5000, // 刷新超过多少秒就弹出通知
        refreshRate: sessionStorage.getItem('x') // 刷新频率，单位ms
    }

    function getDisTime(startT, endT, timeGap) {
        let disT = endT - startT;
        return disT >= timeGap;
    }

    // 刷新
    function refresh() {
        if (f) {
            return;
        }
        f = true;
        t = setInterval(() => {
            let len = document.getElementsByTagName('form').length;
            if (len) {
                //自动点击免审
                document.querySelector(".ant-select-selection__rendered").click()
                document.querySelectorAll(".ant-select-dropdown-menu-item")[sessionStorage.getItem('y')].click()//[1]是选项卡位置，从0开始
                //免审模块结束
                f = false;
                clearInterval(t);
                return;
            }
            document.querySelector('.ant-menu-item.ant-menu-item-selected').children[0].click()
        }, info.refreshRate)
    }

    // 提交当前case逻辑
    function submit(e) {
        if (e.button === 1) {
            const btn = document.querySelector('.ant-btn.antd-pro-pages-audit2-index2-submitButton.ant-btn-primary');
            if (btn) {
                btn.click();
            }
        }
    }

    // 代码入口
    function start(e) {
        if (e.button === 1) {
            e.preventDefault();
            submit(e);
            refresh();
        }
    }

    function enterClick(e) {
        if (e.keyCode === 13) {
            refresh();
        }
    }

    document.addEventListener('mousedown', start);
    document.addEventListener('keydown', enterClick);

    document.addEventListener("mousedown", function (e) {
        if (e.button === 2 || e.keyCode === 32) {
            clearInterval(t);
            f = false;

        }
    });

})();
