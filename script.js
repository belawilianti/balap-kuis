/* ===============================
   KONFIGURASI
================================ */
const sheetURL =
"https://opensheet.elk.sh/1_DDOM1Fzrrs9Vu_c9mC-3hVq7ZY0o7V1PW-Hcq0Y60Q/Sheet1";

const FINISH = 820;
const STEP = 60;

/* ===============================
   STATE GAME
================================ */
let bankSoal = [];
let players = [];
let gameOver = true;   // ⛔ game belum boleh jalan
let gameStarted = false;

/* ===============================
   DOM READY – PAKSA STATE AWAL
================================ */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("winner").classList.add("hidden");
  document.getElementById("countdown").classList.add("hidden");
});

/* ===============================
   UTIL
================================ */
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

/* ===============================
   START GAME (SETELAH COUNTDOWN)
================================ */
async function startGame() {
  gameOver = false;
  gameStarted = true;

  // pastikan overlay winner hilang
  winnerOverlay.classList.add("hidden");

  const res = await fetch(sheetURL);
  bankSoal = shuffle(await res.json());

  players = [];

  for (let i = 0; i < 4; i++) {
    const robot = document.getElementById("r" + i);
    robot.style.left = "0px";

    players.push({
      pos: 0,
      soalIndex: i,
      robot,
      panel: document.getElementById("p" + i)
    });

    renderSoal(i);
  }
}

/* ===============================
   RENDER SOAL PER PLAYER
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
   JAWAB SOAL
================================ */
function jawab(i, pilih) {
  if (gameOver || !gameStarted) return;

  const p = players[i];
  const q = bankSoal[p.soalIndex];

  if (pilih === q.jawaban.toUpperCase()) {
    p.pos += STEP;
    p.robot.style.left = p.pos + "px";

    if (p.pos >= FINISH) {
      gameOver = true;
      showWinner(i);
      return;
    }
  }

  p.soalIndex += 4;
  if (p.soalIndex < bankSoal.length) {
    renderSoal(i);
  } else {
    p.panel.innerHTML += "<p><i>Soal habis</i></p>";
  }
}

/* ===============================
   WINNER ANIMATION
================================ */
const winnerOverlay = document.getElementById("winner");
const winnerText = document.getElementById("winnerText");

function showWinner(i) {
  winnerText.innerText = `Player ${i + 1}`;
  winnerOverlay.classList.remove("hidden");
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

    if (count > 0) {
      countdown.innerText = count;
      countdown.style.animation = "none";
      countdown.offsetHeight;
      countdown.style.animation = null;
    }
    else if (count === 0) {
      countdown.innerText = "GO!";
    }
    else {
      clearInterval(timer);
      opening.style.display = "none";
      startGame(); // ✅ AMAN
    }
  }, 1000);
};
