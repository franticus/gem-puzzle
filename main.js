"use strict";

// ---------------------------------------------------------------

const wrapper = document.body.appendChild(document.createElement("div"));
wrapper.className = "wrapper";

const h = wrapper.appendChild(document.createElement("h1"));
h.innerText = "Пятнашки";

const tablo = wrapper.appendChild(document.createElement("div"));
tablo.className = "tablo";

const time = tablo.appendChild(document.createElement("span"));
time.className = "time";
time.innerHTML = "Время: ";

const timeCount = tablo.appendChild(document.createElement("span"));
timeCount.innerHTML = "0";
timeCount.className = "timeCount";

const sec = tablo.appendChild(document.createElement("span"));
sec.className = "sec";
sec.innerHTML = "сек";

const step = tablo.appendChild(document.createElement("span"));
step.className = "step";
step.innerHTML = "Шаги: ";

const stepCount = tablo.appendChild(document.createElement("span"));
stepCount.className = "stepCount";
stepCount.innerHTML = "0";

const field = wrapper.appendChild(document.createElement("div"));
field.className = "box";

const complete = field.appendChild(document.createElement("div"));
complete.className = "complete";

const footer = wrapper.appendChild(document.createElement("div"));
footer.className = "footer";

const btn = footer.appendChild(document.createElement("button"));
btn.className = "newgame";
btn.innerText = "Новая игра";

const menuScreen = field.appendChild(document.createElement("div"));
menuScreen.className = "menu-screen";

const menuInfo = menuScreen.appendChild(document.createElement("div"));
menuInfo.className = "info";
menuInfo.classList.add("hideinfo");
menuInfo.innerHTML = `Добро пожаловать!</br></br>
Новая игра - перемешивает пятнашки и сбрасывает текущий результат.
Перемешивание всегда решаемо.</br></br>
Счётчик времени и шагов стартует с первого шага.</br></br>
Сброс - очистка хранилища и перезагрузка страницы.</br></br>
Топ - Топ 10 результатов.</br></br>
Ниже управление музыкой.</br></br>
Приятной игры)`;

const arrRes = JSON.parse(localStorage.getItem("arrRes")) || [];

const menuScore = menuScreen.appendChild(document.createElement("div"));
menuScore.className = "score";
menuScore.classList.add("hidescore");
menuScore.innerHTML = `<span>Топ 10 Результатов.</span>
</br>
<ol class="topScore"></ol>`;

const topScore = document.querySelector(".topScore");
const scoreList = [];
for (i = 0; i < 10; i++) {
  scoreList[i] = topScore.appendChild(document.createElement("li"));
}

const currentArrRes = JSON.parse(localStorage.getItem("arrRes")) || [];
for (let i = 0; i < currentArrRes.length; i++) {
  scoreList[
    i
  ].innerHTML = `  ${currentArrRes[i].time}сек. ${currentArrRes[i].steps}ш.`;
}

const info = footer.appendChild(document.createElement("button"));
info.className = "menu-btn";
info.innerText = "Инфо";

const score = footer.appendChild(document.createElement("button"));
score.className = "menu-btn";
score.innerText = "Топ";

const reload = footer.appendChild(document.createElement("button"));
reload.className = "menu-btn";
reload.classList.add("reload");
reload.innerText = "Сброс";

const mus = wrapper.appendChild(document.createElement("audio"));
mus.innerText = "Музычка";
mus.setAttribute("src", "/assets/amb.mp3");
mus.setAttribute("controls", "");
mus.setAttribute("loop", "");
mus.setAttribute("autoplay", "");

// ---------------------------------------------------------------

const sqSize = 80;
const empty = {
  value: 0,
  top: 0,
  left: 0,
};

// ---------------------------------------------------------------

reload.onclick = function () {
  localStorage.clear();
  location.reload();
};

// ---------------------------------------------------------------

function playSound(url) {
  let p = new Audio();
  p.src = url;
  p.play();
}

// playSound("/assets/amb.mp3");

const sqArr = [];
sqArr.push(empty);

// ---------------------------------------------------

function move(index) {
  const sq = sqArr[index];

  const leftDiff = Math.abs(empty.left - sq.left);
  const topDiff = Math.abs(empty.top - sq.top);

  if (leftDiff + topDiff > 1) {
    return;
  }

  sq.element.style.left = `${empty.left * sqSize}px`;
  sq.element.style.top = `${empty.top * sqSize}px`;

  const emptyLeft = empty.left;
  const emptyTop = empty.top;

  empty.left = sq.left;
  empty.top = sq.top;

  sq.left = emptyLeft;
  sq.top = emptyTop;

  const isFinished = sqArr.every((sq) => {
    return sq.value === sq.top * 4 + sq.left;
  });

  if (isFinished) {
    playSound("/assets/win2.mp3");
    field.style.backgroundColor = `gold`;
    h.innerHTML = `Вы решили </br> головоломку!`;
    h.style.color = "gold";
    h.style.fontSize = "1.5rem";
    complete.style.display = "block";
    complete.style.opacity = "0.05";
    btn.style.opacity = "0.9";
    btn.style.animation = "glowing 2000ms infinite";
    btn.style.backgroundColor = "gold";
    reload.style.backgroundColor = "orange";
    reload.style.opacity = "0.8";
    tablo.style.color = "gold";

    function getUnique(arr, comp) {
      const unique = arr
        .map((e) => e[comp])
        .map((e, i, final) => final.indexOf(e) === i && i)
        .filter((e) => arr[e])
        .map((e) => arr[e]);
      return unique;
    }

    const arrRes = JSON.parse(localStorage.getItem("arrRes")) || [];
    arrRes.push({
      time: +timeCount.innerHTML,
      steps: +stepCount.innerHTML + 1,
    });
    arrRes.sort((a, b) => (a.time > b.time ? 1 : b.time > a.time ? -1 : 0));
    console.log({ arrResSort: arrRes });

    const newArrRes = getUnique(arrRes, "time");
    console.log({ arrResFilter: newArrRes });
    const newArrRes2 = newArrRes.length > 10 ? newArrRes.slice(0, 10) : newArrRes;
    localStorage["arrRes"] = JSON.stringify(newArrRes2);

    for (let i = 0; i < newArrRes2.length; i++) {
      scoreList[
        i
      ].innerHTML = `  ${newArrRes2[i].time}сек. ${newArrRes2[i].steps}ш.`;
    }
  }
}

const numArr = [...new Array(15).keys()];

// ---------------------------------------------------------------

for (let i = 1; i <= 15; i++) {
  const sq = document.createElement("div");
  const value = numArr[i - 1] + 1;

  sq.innerHTML = value;
  sq.className = `sq sq${sq.innerText}`;

  const left = i % 4;
  const top = (i - left) / 4;

  sqArr.push({
    value: value,
    left: left,
    top: top,
    element: sq,
  });

  sq.style.left = `${left * sqSize}px`;
  sq.style.top = `${top * sqSize}px`;

  field.append(sq);

  // ---------------------------------------------------------------

  sq.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 20px)").matches) {
      move(i);
    } else if (+timeCount.innerHTML >= 1) {
      playSound("/assets/ball.mp3");
      move(i);
    } else {
      move(i);
    }
  });

  // ---------------------------------------------------------------

  sq.onclick = function () {
    let count = Number(stepCount.innerHTML);
    stepCount.innerHTML = `${count + 1}`;
  };
}

// Put numbers to sq ---------------------------------------------------------------

let arrSq = [];
for (var i = 1; i <= 15; ++i) {
  arrSq[i] = document.querySelector(`.sq${i}`).innerHTML = `${Math.abs(
    i - 16
  )}`;
}

// ---------------------------------------------------------------

function eventFire(el, etype) {
  if (el.fireEvent) {
    el.fireEvent("on" + etype);
  } else {
    var evObj = document.createEvent("Events");
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

// ---------------------------------------------------------------

function selfRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ---------------------------------------------------------------

btn.onclick = function () {
  if (menuInfo.className === "info") {
    menuInfo.classList.toggle("hideinfo");
  }
  if (menuScore.className === "score") {
    menuScore.classList.toggle("hidescore");
  }
  stepCount.innerHTML = `0`;
  timeCount.innerHTML = `0`;

  const arrSqSort = [
    1,
    5,
    4,
    8,
    9,
    10,
    6,
    2,
    5,
    4,
    10,
    13,
    14,
    15,
    11,
    7,
    3,
    12,
  ];
  for (let i = 0; i <= selfRandom(1, 20); i++) {
    for (let j = 1; j <= 15; j++) {
      eventFire(document.querySelector(`.sq${arrSqSort[j - 1]}`), "click");
    }
  }
  stepCount.innerHTML = `0`;
  timeCount.innerHTML = `0`;

  field.style.backgroundColor = `rgba(163, 41, 41, 0)`;
  h.innerHTML = `Пятнашки`;
  h.style.color = "rgb(54, 11, 83)";
  h.style.fontSize = "3rem";
  complete.style.display = "none";
  btn.style.animation = "none";
  reload.style.backgroundColor = "orange";
  reload.style.opacity = "0.9";
  tablo.style.color = "rgb(54, 11, 83)";
};

function timeCounter() {
  if (+stepCount.innerHTML > 0) {
    if (h.innerText === "Пятнашки") {
      let count2 = Number(timeCount.innerHTML);
      timeCount.innerText = `${count2 + 1}`;
    } else {
      let res = timeCount.innerHTML;
      timeCount.innerHTML = `${res}`;
    }
  }
}
timeCounter();
setInterval(timeCounter, 1000);

// ---------------------------------------------------------------

info.onclick = function () {
  if (menuScore.className === "score") {
    menuScore.classList.toggle("hidescore");
  }
  menuInfo.classList.toggle("hideinfo");
};
score.onclick = function () {
  if (menuInfo.className === "info") {
    menuInfo.classList.toggle("hideinfo");
  }
  menuScore.classList.toggle("hidescore");
};
menuScore.onclick = function () {
  menuScore.classList.toggle("hidescore");
};
menuInfo.onclick = function () {
  menuInfo.classList.toggle("hideinfo");
};
