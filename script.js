const sheetURL =
"https://opensheet.elk.sh/1_DDOM1Fzrrs9Vu_c9mC-3hVq7ZY0o7V1PW-Hcq0Y60Q/Sheet1";

const STEP = 60;

let bankSoal = [];
let players = [];
let gameOver = true;
let gameStarted = false;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("winner").classList.add("hidden");
  document.getElementById("countdown").classList.add("hidden");
});

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

async function startGame() {
  gameOver = false;
  gameStarted = true;
  document.getElementById("winner").classList.add("hidden");

  const res = await fetch(sheetURL);
  bankSoal = shuffle(await res.json());
  players = [];

  for (let i = 0; i < 4; i++) {
    const car = document.getElementById("c" + i);
    car.style.left = "0px";

    players.push({
      pos: 0,
      soalIndex: i,
      car,
      panel: document.getElementById("p" + i),
      finished: false
    });

    renderSoal(i);
  }
}

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

function jawab(i, pilih) {
  if (gameOver || !gameStarted) return;

  const p = players[i];
  if (p.finished) return;

  const q = bankSoal[p.soalIndex];

  if (pilih === q.jawaban.toUpperCase()) {
    p.pos += STEP;
    p.car.style.left = p.pos + "px";
  }

  p.soalIndex += 4;

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

function tentukanPemenang() {
  let max = Math.max(...players.map(p => p.pos));
  let winners = players
    .map((p, i) => ({ p, i }))
    .filter(x => x.p.pos === max);

  showWinner(winners[0].i);
}

function showWinner(i) {
  document.getElementById("winnerText").innerText = `Player ${i + 1}`;
  document.getElementById("winner").classList.remove("hidden");
}

/* OPENING */
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
