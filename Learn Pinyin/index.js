// 定义一个音频文件的数组
let audio_play = ["a", "o", "e", "i", "u", "v"];

// 记录正确和错误次数
let correctCount = {};
let wrongCount = {};

// 初始化正确和错误次数
audio_play.forEach(value => {
    correctCount[value] = 0;
    wrongCount[value] = 0;
});

// 存储最近两轮的 main_ran 值
let last_two_main_ran = [];

// 创建一个用于存储随机值的数组
let ran_list = [];

// 随机获取四个不同的数组元素
function refreshButtons() {
    ran_list = [];
    while (ran_list.length < 4) {
        let randomIndex = Math.floor(Math.random() * audio_play.length);
        let randomValue = audio_play[randomIndex];

        // 检查该值是否已经存在于 ran_list 中，避免重复
        if (!ran_list.includes(randomValue)) {
            ran_list.push(randomValue);
        }
    }

    // 为按钮设置随机值
    document.getElementById("btn1").value = ran_list[0];
    document.getElementById("btn2").value = ran_list[1];
    document.getElementById("btn3").value = ran_list[2];
    document.getElementById("btn4").value = ran_list[3];

    // 随机选择一个新的 main_ran，确保不与最近两轮相同
    main_ran = getNewMainRan();
    playAudio(main_ran);

    // 更新最近两轮的 main_ran 值
    if (last_two_main_ran.length >= 2) {
        last_two_main_ran.shift(); // 移除最旧的一轮
    }
    last_two_main_ran.push(main_ran);

    // 更新统计信息显示
    updateStats();
}

// 创建一个函数，随机从 ran_list 中获取一个元素
function getRandomElementFromValues() {
    let randomIndex = Math.floor(Math.random() * ran_list.length);
    return ran_list[randomIndex];
}

// 获取一个新的 main_ran，确保不与最近两轮相同
function getNewMainRan() {
    let newMainRan;
    do {
        newMainRan = getRandomElementFromValues();
    } while (last_two_main_ran.includes(newMainRan));
    return newMainRan;
}

// 播放音频的函数
function playAudio(value) {
    let audioFile = "./Audio/" + value + ".m4a"; // 将按钮的 value 值作为音频文件名
    let audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.src = audioFile;
    audioPlayer.play();
}

// 检查点击的按钮是否与 main_ran 相同
function checkAndPlay(button) {
    let buttonValue = button.value;
    let buttons = document.querySelectorAll(".audio-btn");
    let isCorrect = buttonValue === main_ran;

    if (isCorrect) {
        correctCount[buttonValue]++;
        refreshButtons();
    } else {
        wrongCount[buttonValue]++;
        playAudio(main_ran);

        // 设置所有按钮颜色
        buttons.forEach(btn => {
            if (btn.value === main_ran) {
                btn.classList.add("correct");
            } else {
                btn.classList.add("incorrect");
            }
        });

        // 延迟 1 秒后重置按钮颜色并播放音频
        setTimeout(() => {
            buttons.forEach(btn => {
                btn.classList.remove("correct", "incorrect");
            });
            refreshButtons();
            playAudio(main_ran);
        }, 1000);
    }
}

// 更新统计信息显示
function updateStats() {
    let statsContent = document.getElementById("stats-content");
    statsContent.innerHTML = ''; // 清空现有的统计信息

    audio_play.forEach(value => {
        statsContent.innerHTML += `
            <p class="stats-item" data-value="${value}">
                ${value} - Correct: ${correctCount[value]}, Mistake: ${wrongCount[value]}
            </p>`;
    });

    // 添加点击事件监听器到每个统计信息项
    document.querySelectorAll(".stats-item").forEach(item => {
        item.addEventListener("click", function() {
            let value = this.getAttribute("data-value");
            playAudio(value);
        });
    });
}

// 触发用户点击事件以播放音频
function triggerAudioPlay() {
    let audioPlayer = document.getElementById("audioPlayer");
    let playPromise = audioPlayer.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            // 自动播放成功
        }).catch((error) => {
            // 自动播放失败，显示提示
            console.log("自动播放失败，用户需要点击按钮播放音频。");
        });
    }
}

// 初始化时，刷新按钮和 main_ran，并触发音频播放
window.onload = function() {
    refreshButtons();
    triggerAudioPlay();
}
