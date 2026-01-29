const sheetURL =
"https://opensheet.elk.sh/1_DDOM1Fzrrs9Vu_c9mC-3hVq7ZY0o7V1PW-Hcq0Y60Q/Sheet1";

const STEP = 60;

let bankSoal = [];
let players = [];
let totalPlayers = 2;
let gameStarted = false;
let gameOver = true;

/* PILIH JUMLAH PLAYER */
document.querySelectorAll(".ps-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".ps-btn")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
    totalPlayers = parseInt(btn.dataset.player);
  });
});

/* START GAME */
document.getElementById("startBtn").onclick = () => {
  document.querySelector(".opening-box").style.display = "none";
  const countdown = document.getElementById("countdown");
  countdown.classList.remove("hidden");

  let c = 3;
  countdown.innerText = c;

  const timer = setInterval(() => {
    c--;
    if (c > 0) countdown.innerText = c;
    else if (c === 0) countdown.innerText = "GO!";
    else {
      clearInterval(timer);
      document.getElementById("opening").style.display = "none";
      startGame();
    }
  }, 1000);
};

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

async function startGame() {
  gameStarted = true;
  gameOver = false;

  const res = await fetch(sheetURL);
  bankSoal = shuffle(await res.json());

  const track = document.getElementById("track");
  const panels = document.getElementById("players");

  track.innerHTML = "";
  panels.innerHTML = "";
  players = [];

  const cars = ["🚗","🚕","🏎️","🚙"];
  const colors = ["blue","red","yellow","green"];

  for (let i = 0; i < totalPlayers; i++) {
    track.innerHTML += `
      <div class="lane">
        <div class="car" id="c${i}">${cars[i]}</div>
      </div>
    `;

    panels.innerHTML += `
      <div class="player" id="p${i}"></div>
    `;

    players.push({
      pos: 0,
      soalIndex: i,
      finished: false,
      car: null,
      panel: null
    });
  }

  players.forEach((p,i) => {
    p.car = document.getElementById("c"+i);
    p.panel = document.getElementById("p"+i);
    renderSoal(i);
  });
}

function renderSoal(i) {
  const p = players[i];
  const q = bankSoal[p.soalIndex];
  if (!q) return;

  p.panel.innerHTML = `
    <h3>Player ${i+1}</h3>
    <b>${q.soal}</b>
    <button class="option" onclick="jawab(${i},'A')">A. ${q.a}</button>
    <button class="option" onclick="jawab(${i},'B')">B. ${q.b}</button>
    <button class="option" onclick="jawab(${i},'C')">C. ${q.c}</button>
  `;
}

function jawab(i,pilih){
  const p = players[i];
  const q = bankSoal[p.soalIndex];

  if(pilih === q.jawaban.toUpperCase()){
    p.pos += STEP;
    p.car.style.left = p.pos+"px";
  }

  p.soalIndex += totalPlayers;

  if(p.soalIndex < bankSoal.length){
    renderSoal(i);
  }else{
    p.finished = true;
    p.panel.innerHTML += "<p><b>SELESAI</b></p>";

    if(players.every(pl=>pl.finished)){
      tentukanPemenang();
    }
  }
}

function tentukanPemenang(){
  let max = Math.max(...players.map(p=>p.pos));
  let win = players.findIndex(p=>p.pos===max);
  document.getElementById("winnerText").innerText = "Player "+(win+1);
  document.getElementById("winner").classList.remove("hidden");
}

document.getElementById("year").innerText = new Date().getFullYear();

