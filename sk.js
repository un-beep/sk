// ==UserScript==
// @name         yuketang
// @namespace    http://tampermonkey.net/
// @version      2024-09-05
// @description  try to take over the world!
// @author       You
// @match        https://cqjtuyjs.yuketang.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuketang.cn
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 使用 MutationObserver 来检测视频元素的加载
    const observer = new MutationObserver(() => {
        const videos = document.querySelectorAll('video');
        if (videos.length > 0) {
            videos.forEach(video => {
                // 防止视频暂停
                video.pause = function () { 
                    console.log("视频暂停");
                }; // 重写 pause 函数
            });
            console.log("视频元素已找到并处理");
            observer.disconnect(); // 找到后停止观察
        }
    });

    // 监听整个文档的变化
    observer.observe(document.body, { childList: true, subtree: true });


    document.addEventListener('DOMContentLoaded', function () {
        let videoElement = document.querySelector('video');
        if (videoElement) {
            videoElement.addEventListener('play', () => {
                console.log("视频正在播放");
            });
    
            videoElement.addEventListener('pause', () => {
                console.log("视频已暂停");
            });
        } else {
            console.error("未找到视频元素");
        }
    });
    

    
    // // 定义自动点击播放按钮函数
    // function userInteraction() {
    //     const playButton = document.querySelector(".xt_video_bit_play_btn");
    //     if (!playButton) {
    //         console.error("播放按钮未找到");
    //         return;
    //     }

    //     // 获取 Video.js 播放器实例
    //     // const player = videojs('my-video');
    //     // if (!player) {
    //     //     console.error("视频播放器实例未找到");
    //     //     return;
    //     // }

    //     // // 设置静音
    //     // player.muted(true);

    //     // // 视频播放器准备好后开始播放
    //     // player.ready(function () {
    //     //     console.log("视频播放器已准备好");
    //     //     setTimeout(() => {
    //     //         player.play().then(() => {
    //     //             console.log("视频开始播放");
    //     //         }).catch((error) => {
    //     //             console.error("自动播放被阻止", error);
    //     //         });
    //     //     }, 1000); // 延迟 1 秒播放
    //     // });
    // }

    // 使用 MutationObserver 监听播放按钮的加载
    const buttonObserver = new MutationObserver(() => {
        const playButton = document.querySelector(".play-btn-tip");
        if (playButton) {
            // playButton.addEventListener('click', userInteraction);
            document.querySelector('video').play(); // 自动点击播放按钮
            console.log("播放视频");
            buttonObserver.disconnect(); // 找到按钮后停止观察
        }
    });

    // 监听整个文档的变化以检测播放按钮
    buttonObserver.observe(document.body, { childList: true, subtree: true });

})();
