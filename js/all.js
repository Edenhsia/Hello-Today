import senData from './sentence.js';

//weather
window.addEventListener('load', () => {
  let long;
  let lat;

  //獲得所在地點經緯度
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);
      long = position.coords.longitude;
      lat = position.coords.latitude;

      // api from FreeCodeCamp
      const api = `https://fcc-weather-api.glitch.me/api/current?lat=${lat}&lon=${long}`;

      fetch(api)
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);
          //獲得當下時間，決定白天或晚上
          let day;
          const now = new Date();

          if (now.getHours() > 18 || now.getHours() < 6) {
            day = "night";
          } else {
            day = "day";
          }

          let iconName = data.weather[0].main;
          //用_替代空格，將字都變為小寫
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
          document.getElementById('des').textContent = data.weather[0].description.toUpperCase();

          //顯示溫度
          document.getElementById('temp').textContent = Math.floor(data.main.temp);
        });
    })
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
  const dayOpt = {
    weekday: 'short'
  }
  const day = new Intl.DateTimeFormat('en-US', dayOpt).format(today);

  document.getElementById('day').textContent = day.toUpperCase();

  const dateOpt = {
    month: 'short'
  };
  const mon = new Intl.DateTimeFormat('en-US', dateOpt).format(today);
  const date = today.getDate();
  const year = today.getFullYear();

  const todayDate = `${year}-${mon.toUpperCase()}-${date}`;
  document.getElementById('date').textContent = todayDate;
}

function showTime() {
  const today = new Date();
  const h = (today.getHours() < 10 ? '0' : '') + today.getHours();
  const m = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
  const s = (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();

  const time = `${h}:${m}:${s}`;
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
}, 15000);

//todo
let todos = JSON.parse(localStorage.getItem('todos')) || ['Click add button to add new to-do', 'Click text to complete it', 'Click ⛔ to delete it ->'];
let compToDos = JSON.parse(localStorage.getItem('compToDos')) || [];
const add = document.getElementById('add');

showToDos();
showCompToDos();

add.addEventListener('click', function (e) {
  e.preventDefault();
  const newToDo = document.querySelector('input').value;
  //排除使用者輸入為空白或為多格空格
  if (newToDo.replace(/(^\s*)/g, '').length !== 0) {
    todos.push(newToDo);
    addToList(newToDo);
    localStorage.setItem('todos', JSON.stringify(todos));
    document.querySelector('input').value = '';
  }
});

//刪除li或是complete
document.getElementById('list').addEventListener('click', (e) => {
  if (e.target.classList.contains('fa-minus-circle')) {
    deleteItem(e, todos);
    localStorage.setItem('todos', JSON.stringify(todos));
  } else if (e.target.localName === "li") {
    e.target.classList.toggle('completed');
    if (e.target.classList.contains('completed')) {
      const compItem = e.target.textContent;
      compToDos = compToDos.concat(todos.splice(todos.indexOf(compItem), 1));
      document.getElementById('comp-list').appendChild(e.target);
      localStorage.setItem('todos', JSON.stringify(todos));
      localStorage.setItem('compToDos', JSON.stringify(compToDos));
    }
  }
})

document.getElementById('comp-list').addEventListener('click', (e) => {
  if (e.target.classList.contains('fa-minus-circle')) {
    deleteItem(e, compToDos);
    localStorage.setItem('compToDos', JSON.stringify(compToDos));
  } else if (e.target.localName === "li") {
    console.log(e.target);
    e.target.classList.toggle('completed');
    if (!e.target.classList.contains('completed')) {
      const item = e.target.textContent;
      todos = todos.concat(compToDos.splice(compToDos.indexOf(item), 1));
      document.getElementById('list').appendChild(e.target);
      localStorage.setItem('todos', JSON.stringify(todos));
      localStorage.setItem('compToDos', JSON.stringify(compToDos));
    }
  }
})


//顯示ToDos
function showToDos() {
  todos.map((todo) => addToList(todo));
}

function showCompToDos() {
  compToDos.map((todo) => addToCompList(todo));
}

//新增li
function addToList(item) {
  const list = document.getElementById('list');
  const li = document.createElement('li');
  li.innerHTML = `${item}<i class="fa fa-minus-circle"></i>`;
  list.appendChild(li);
}

function addToCompList(item) {
  const list = document.getElementById('comp-list');
  const li = document.createElement('li');
  li.classList.add('completed');
  li.innerHTML = `${item}<i class="fa fa-minus-circle"></i>`;
  list.appendChild(li);
}

function deleteItem(e, arrs) {
  const deleteItem = e.target.parentElement.textContent;
  e.target.parentElement.remove();
  arrs.splice(arrs.indexOf(deleteItem), 1);
}

//Relaxer
const circle = document.getElementById('moving-circle');
const circleLength = circle.getTotalLength();
//circle的strokeDasharray ＝ 總圓周長
circle.style.strokeDasharray = circleLength;
//circle offset自身長度
circle.style.strokeDashoffset = circleLength;

let isClicked = false;
let counter = 0;
let timer = null;
// let repeatTimes = 5;
let repeatCounts = 5;
const cycleText = document.getElementById("cycle-left");
const textBtn = document.getElementById("text-btn");

//預設為Box breathing
let breathIn = 4;
let breathOut = 4;
let breathInHold = 4;
let breathOutHold = 4;
let total;

textBtn.addEventListener('click', function () {
  //點擊後，false變true，true變false
  isClicked = !isClicked;
  if (isClicked) {
    startTimer();
  } else {
    stopTimer();
  }
});

function startTimer() {
  cycleText.textContent = "5 Cycles Left";
  document.querySelector('.play-group span').style.display = "block";
  total = breathIn + breathOut + breathInHold + breathOutHold;
  counter++;
  textBtn.textContent = 'Breathe In';
  circle.style.strokeDashoffset = circleLength - (counter / breathIn) * circleLength;
  timer = setInterval((() => {
    counter++;
    if (counter <= breathIn) {
      //顯示剩下幾個Cycle
      cycleText.textContent = repeatCounts > 1 ? `${repeatCounts} Cycles Left` : `1 Cycle Left`;
      textBtn.textContent = 'Breathe In';
      circle.style.strokeDashoffset = circleLength - (counter / breathIn) * circleLength;
    } else if (counter <= breathIn + breathInHold) {
      textBtn.textContent = 'Hold';
    } else if (counter <= breathIn + breathInHold + breathOut) {
      circle.style.strokeDashoffset = (counter - breathIn - breathInHold) /
        breathOut * circleLength;
      textBtn.textContent = 'Breathe Out';
    } else if (counter < total) {
      textBtn.textContent = 'Hold';
    }
    if (counter === total) {
      counter = 0;
      repeatCounts--;
    }

    if (repeatCounts === 0) {
      setTimeout(stopTimer, 990);
    }

  }), 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
  counter = 0;
  repeatCounts = 5;
  circle.style.strokeDashoffset = circleLength;
  textBtn.textContent = 'Start';
  isClicked = false;
  document.querySelector('.play-group span').style.display = "none";
}

//下方按鈕選單
const btns = document.querySelectorAll('.btn');
const btnGroup = document.querySelector('.btn-group');

btnGroup.addEventListener('click', changeExercise);

function changeExercise(e) {
  stopTimer();
  if (e.target.localName === "button") {
    //清除active樣式
    btns.forEach((btn) => {
      btn.className = 'btn';
    });
    //被點擊的按鈕新增active樣式
    e.target.classList.add('active');
    setExercise(e);
  }
}

//設定每個 Exercise 所需時間
function setExercise(e) {
  switch (e.target.textContent) {
    case "Box":
      breathIn = 4;
      breathOut = 4;
      breathInHold = 4;
      breathOutHold = 4;
      break;

    case "Ujjayi":
      breathIn = 7;
      breathOut = 7;
      breathInHold = 0;
      breathOutHold = 0;
      break;

    case "4-7-8":
      breathIn = 4;
      breathOut = 8;
      breathInHold = 7;
      breathOutHold = 0;
      break;

    default:
      break;
  }

}