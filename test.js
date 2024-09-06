// ==UserScript==
// @name         安全微伴刷课助手（2023年新界面）
// @version      0.8.3
// @description  通过在h5上模拟点击，调用结束课程请求等方法实现自动化刷课，具有一定隐蔽性，不会被发现（半失效，详见项目主页和脚本主页）
// @author       九尾妖渚 Modifyed By lony2003
// @match      *://weiban.mycourse.cn/*
// @match      https://mcwk.mycourse.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant 		 none
// @run-at       document-end
// @namespace https://greasyfork.org/users/822791
// @license GPL-v3
// @downloadURL https://update.greasyfork.org/scripts/469807/%E5%AE%89%E5%85%A8%E5%BE%AE%E4%BC%B4%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B%EF%BC%882023%E5%B9%B4%E6%96%B0%E7%95%8C%E9%9D%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/469807/%E5%AE%89%E5%85%A8%E5%BE%AE%E4%BC%B4%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B%EF%BC%882023%E5%B9%B4%E6%96%B0%E7%95%8C%E9%9D%A2%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const addHistoryEvent = function (type) {
        var originalMethod = history[type];
        return function () {
            var recallMethod = originalMethod.apply(this, arguments);
            var e = new Event(type);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return recallMethod;
        };
    };
    history.pushState = addHistoryEvent('pushState');
    history.replaceState = addHistoryEvent('replaceState');

    var getVal = function (fun1, fun2) {
        let id = setInterval(() => {
            var val = fun1();
            if (val.length) {
                console.log(fun1 + "成功");
                clearInterval(id);
                fun2(val);
            }
        }, 100)
    }
    var start = function (e) {
        $(function () {
            setTimeout(() => {
                // 第一阶段 在主页
                // if (window.location.hash === '#/') {
                //     getVal(()=>{return $("div.task-block")}, (res)=>{
                //         //console.log(res);
                //         setTimeout(()=>{
                //             res[0].click();
                //         }, 200);

                //     })
                // }
                // 第二阶段 在学习任务
                // var reg = /course.*projectType.*projectId.*/
                var reg = /course.*projectId.*projectType.*/
                let taskNumber = 0;
                if (window.location.hash.match(reg)) {
                    // 先检测出还需要完成的任务
                    console.log("匹配成功");
                    getVal(() => { return $("div.van-cell--clickable") }, (res) => {
                        res = res.filter(function (index) {

                            let text = res[index].querySelector("div.count").innerText;
                            console.log(text);
                            let part = text.split("/");
                            if (part[0] == part[1]) {
                                console.log("${part[0]}/${part[1]}");
                                return false;
                            }
                            return true;
                        })


                        taskNumber = parseInt(res[0].querySelector("div.count").innerText.split("/")[1]) - parseInt(res[0].querySelector("div.count").innerText.split("/")[0]);

                        console.log(taskNumber);

                        if (!res[0].classList.contains("van-collapse-item__title--expanded")) {
                            res[0].click();
                        }

                    })
                    //打开任务
                    setTimeout(() => {
                        getVal(() => { return $("li.img-texts-item") }, (res) => {
                            res = res.filter(function (index) {

                                //console.log(res[index].classList);

                                if (res[index].classList.contains("passed")) {
                                    return false;
                                }
                                return true;
                            })
                            //console.log(res);
                            getVal(() => { return res.find('.title') }, (res2) => {
                                if (res2.length / 2 == 0) {

                                    console.log("reloading");

                                    location.reload();
                                }
                                res2[0].click();
                            })
                        })
                    }, 5000);

                }
                else {
                    // console.log("未匹配");
                }
            }, 1000)

        });
    }
    window.addEventListener('pushState', start);
    window.addEventListener('popstate', () => { location.reload() });
    console.log("脚本执行");

    var comment_footer_button = document.querySelector(".comment-footer-button");

    if (comment_footer_button) {
        setTimeout(function () {
            comment_footer_button.click();
            console.log("点击返回列表");
        }, 2000); // 延迟1秒后点击播放按钮
    }



    // 第四阶段 此时在异域iframe中
    if (window.location.href.indexOf("mcwk.mycourse.cn/course/") != -1) {
        console.log(window.location.href);
        $(function () {
            setTimeout(() => {
                // 等待网页内容完全加载
                console.log("进入学习界面");
                $(document).ready(function () {

                    // 定义点击事件处理函数
                    function userInteraction() {
                        const playButton = document.querySelector(".vjs-big-play-button");
                        if (!playButton) {
                            console.error("播放按钮未找到");
                            return;
                        }

                        // 移除事件监听器，避免重复调用
                        playButton.removeEventListener('click', userInteraction);

                        // 获取视频播放器实例
                        let player = videojs('my-video');
                        if (!player) {
                            console.error("视频播放器实例未找到");
                            return;
                        }

                        // 设置静音
                        player.muted(true);

                        player.ready(function () {
                            console.log("视频播放器已准备好");

                            // 延迟播放以确保用户交互后触发
                            setTimeout(function () {
                                player.play().then(() => {
                                    console.log("视频开始播放");
                                }).catch((error) => {
                                    console.error("自动播放被阻止", error);
                                });
                            }, 1000); // 延迟1秒播放
                        })
                    };


                    // 添加事件监听器
                    const playButton = document.querySelector(".vjs-big-play-button");
                    if (playButton) {
                        playButton.addEventListener('click', userInteraction);

                        playButton.click();
                        console.log("点击播放");
                    } else {
                        console.error("播放按钮未找到");
                    }

                    // 找到播放按钮
                    // let playButton = document.querySelector(".vjs-big-play-button");

                    // 如果找到播放按钮，自动点击它
                    // if (playButton) {
                    //     setTimeout(function () {
                    //         playButton.click();
                    //         console.log("点击播放");
                    //     }, 3000); // 延迟1秒后点击播放按钮
                    // }

                    // 如果使用 video.js 播放器
                    //  let player = videojs('my-video');
                    //  player.ready(function () {
                    //      setTimeout(function () {
                    //          player.play().then(() => {
                    //              console.log("视频开始播放");
                    //          }).catch((error) => {
                    //              console.log("自动播放被阻止", error);
                    //          });
                    //      }, 5000); // 延迟5秒播放
                    //  });

                    // 获取所有 .btn-next 按钮
                    var next_buttons = document.querySelectorAll(".btn-next");
                    var start_buttons = document.querySelector(".btn-start");

                    if (start_buttons) {
                        setTimeout(() => {
                            start_buttons.click(); // 模拟点击事件
                            console.log(`start clicked`);
                        }, 1000); // 每个点击事件之间延迟 1 秒

                    }


                    // var index = 0;

                    // 定义一个函数来点击按钮
                    // function clickNextButton() {
                    //     if (index <= buttons.length) {
                    //         // 点击当前按钮
                    //         buttons.eq(index).click();
                    //         // 递增索引
                    //         console.log("当前是第：" + index + "页，点击成功");
                    //         index++;
                    //         // 延迟1秒后调用自己，点击下一个按钮
                    //         setTimeout(clickNextButton, 3000);
                    //     }
                    // 

                    // 开始点击第一个按钮
                    if (next_buttons) {
                        next_buttons.forEach((button, index) => {
                            // 为每个按钮添加一个延迟，使点击事件依次发生
                            setTimeout(() => {
                                button.click(); // 模拟点击事件
                                console.log(`Button ${index + 1} clicked`);
                            }, index * 4000); // 每个点击事件之间延迟 1 秒
                        });
                    }

                });
            }, 5000);

        })

    }
    else if (window.location.href.indexOf("weiban.mycourse.cn/") != -1) {
        //console.log(window.location.href);
        $(function () {
            start();
        })
    }

    // Your code here...
})();
