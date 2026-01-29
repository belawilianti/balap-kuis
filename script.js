const sheetURL =
"https://opensheet.elk.sh/1_DDOM1Fzrrs9Vu_c9mC-3hVq7ZY0o7V1PW-Hcq0Y60Q/Sheet1";

const STEP = 60;

let bankSoal = [];
let players = [];
let totalPlayers = 2; // default
let gameOver = true;
let gameStarted = false;

/* ===============================
   DOM READY
================================ */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("winner").classList.add("hidden");
  document.getElementById("countdown").classList.add("hidden");

  document.querySelectorAll(".ps-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".ps-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      totalPlayers = parseInt(btn.dataset.player);
    };
  });
});

/* ===============================
   UTIL
================================ */
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

/* ===============================
   START GAME
================================ */
async function startGame() {
  gameOver = false;
  gameStarted = true;
  document.getElementById("winner").classList.add("hidden");

  const res = await fetch(sheetURL);
  bankSoal = shuffle(await res.json());

  const track = document.getElementById("track");
  const panels = document.getElementById("players");

  track.innerHTML = "";
  panels.innerHTML = "";
  players = [];

  const cars = ["🚗", "🚕", "🏎️", "🚙"];
  const colors = ["blue", "red", "yellow", "green"];

  for (let i = 0; i < totalPlayers; i++) {
    track.innerHTML += `
      <div class="lane">
        <div class="car ${colors[i]}" id="c${i}">${cars[i]}</div>
      </div>
    `;

    panels.innerHTML += `
      <div class="player ${colors[i]}" id="p${i}"></div>
    `;

    players.push({
      pos: 0,
      soalIndex: i,
      car: null,
      panel: null,
      finished: false
    });
  }

  players.forEach((p, i) => {
    p.car = document.getElementById("c" + i);
    p.panel = document.getElementById("p" + i);
    p.car.style.left = "0px";
    renderSoal(i);
  });
}

/* ===============================
   RENDER SOAL
================================ */
function renderSoal(i) {
  if (!gameStarted) return;

  const p = players[i];
  const q = bankSoal[p.soalIndex];
  if (!q) return;

  p.panel.innerHTML = `
    <h3>Player ${i + 1}</h3>
    <b>${q.soal}</b>
    <button class="option" onclick="jawab(${i}, 'A')">A. ${q.a}</button>
    <button class="option" onclick="jawab(${i}, 'B')">B. ${q.b}</button>
    <button class="option" onclick="jawab(${i}, 'C')">C. ${q.c}</button>
  `;
}

/* ===============================
   JAWAB
================================ */
function jawab(i, pilih) {
  if (gameOver || !gameStarted) return;

  const p = players[i];
  if (p.finished) return;

  const q = bankSoal[p.soalIndex];

  if (pilih === q.jawaban.toUpperCase()) {
    p.pos += STEP;
    p.car.style.left = p.pos + "px";
  }

  p.soalIndex += totalPlayers;

  if (p.soalIndex < bankSoal.length) {
    renderSoal(i);
  } else {
    p.finished = true;
    p.panel.innerHTML += "<p><b>SELESAI</b></p>";

    if (players.every(pl => pl.finished)) {
      gameOver = true;
      tentukanPemenang();
    }
  }
}

/* ===============================
   HITUNG PEMENANG
================================ */
function tentukanPemenang() {
  let max = Math.max(...players.map(p => p.pos));
  let winner = players.findIndex(p => p.pos === max);
  showWinner(winner);
}

/* ===============================
   SHOW WINNER
================================ */
function showWinner(i) {
  document.getElementById("winnerText").innerText = `Player ${i + 1}`;
  document.getElementById("winner").classList.remove("hidden");
}

/* ===============================
   OPENING + COUNTDOWN
================================ */
const opening = document.getElementById("opening");
const startBtn = document.getElementById("startBtn");
const countdown = document.getElementById("countdown");

startBtn.onclick = () => {
  document.querySelector(".opening-box").style.display = "none";
  countdown.classList.remove("hidden");

  let count = 3;
  countdown.innerText = count;

  const timer = setInterval(() => {
    count--;
    if (count > 0) countdown.innerText = count;
    else if (count === 0) countdown.innerText = "GO!";
    else {
      clearInterval(timer);
      opening.style.display = "none";
      startGame();
    }
  }, 1000);
};
