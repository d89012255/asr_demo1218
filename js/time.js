function updateCurrentTime() {
    const currentTimeElement = document.getElementById("current-time");
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    currentTimeElement.textContent = timeString;
}

// 初始加载时间
updateCurrentTime();

// 每秒更新一次时间
setInterval(updateCurrentTime, 1000);