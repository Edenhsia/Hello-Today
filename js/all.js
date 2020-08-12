import senData from './sentence.js';

window.addEventListener('load', () => {
  let long;
  let lat;

  //獲得所在地點經緯度
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);
      long = position.coords.longitude;
      lat = position.coords.latitude;

      const api = `https://fcc-weather-api.glitch.me/api/current?lat=${lat}&lon=${long}`;
      console.log(api);

      fetch(api)
        .then(response => {
          return response.json();
        })
        .then(data => {
          //獲得當下時間，決定白天或晚上
          let day;
          const now = new Date();

          if (now.getHours() > 18) {
            day = "night";
          } else {
            day = "day";
          }

          let iconName = data.weather[0].main;
          iconName = iconName.replace(/\s/g, '_').toLowerCase();
          //整理一些特殊情況的圖示 smoke, haze, dust, sand, ash
          const weatherSpecial = ["smoke", "haze", "dust", "sand", "ash"];
          if (weatherSpecial.indexOf(iconName) != -1) {
            iconName = "fog";
          }
          iconName = `${day}_${iconName}`;

          //改變icon圖示
          document.getElementById('icon-src').src = `icons/${iconName}.png`;

          //顯示天氣資訊
          document.getElementById('des').textContent = data.weather[0].description;

          //顯示溫度
          document.getElementById('temp').textContent = Math.floor(data.main.temp);
        })

    })
  } else {
    console.log("It's not working")
  }
})
//banner 顯示時間
function showDate() {
  const today = new Date();
  // const options = {
  //   weekday: 'short',
  //   year: 'numeric',
  //   month: 'short',
  //   day: '2-digit'
  // }
  const dayopt = {
    weekday: 'short'
  }
  const day = new Intl.DateTimeFormat('en-US', dayopt).format(today);

  document.getElementById('day').textContent = day;

  const dateopt = {
    month: 'short'
  };
  const mon = new Intl.DateTimeFormat('en-US', dateopt).format(today);
  const date = today.getDate();
  const year = today.getFullYear();

  const todayDate = `${year}-${mon}-${date}`;
  document.getElementById('date').textContent = todayDate;

}

function showTime() {
  const today = new Date();
  const h = today.getHours();
  const m = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
  const s = (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();

  const time = `${h} : ${m} : ${s}`;
  document.getElementById('time').textContent = time;
}

function randomSen() {
  const num = Math.floor(Math.random() * senData.length);
  const sentence = senData[num].content;
  document.querySelector('p').textContent = sentence;
  document.querySelector('p').classList.add('appear');
}

showDate();
showTime();
randomSen();
setInterval(showTime, 1000);
//banner 隨機挑一句話
setInterval(function () {
  document.querySelector('p').classList.remove('appear');
  setTimeout(randomSen, 1000);
}, 10000);

//weather
//todo