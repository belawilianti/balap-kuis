const sheetURL =
"https://opensheet.elk.sh/1_DDOM1Fzrrs9Vu_c9mC-3hVq7ZY0o7V1PW-Hcq0Y60Q/Sheet1";

const FINISH = 820;
const STEP = 60;

let bankSoal = [];
let players = [];

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

async function init() {
  const res = await fetch(sheetURL);
  bankSoal = shuffle(await res.json());

  for (let i = 0; i < 4; i++) {
    players.push({
      pos: 0,
      soalIndex: i,
      robot: document.getElementById("r" + i),
      panel: document.getElementById("p" + i)
    });
    renderSoal(i);
  }
}

function renderSoal(i) {
  const p = players[i];
  const q = bankSoal[p.soalIndex];

  p.panel.innerHTML = `
    <h3>Player ${i + 1}</h3>
    <b>${q.soal}</b>
    <button class="option" onclick="jawab(${i}, 'A')">A. ${q.a}</button>
    <button class="option" onclick="jawab(${i}, 'B')">B. ${q.b}</button>
    <button class="option" onclick="jawab(${i}, 'C')">C. ${q.c}</button>
  `;
}

function jawab(i, pilih) {
  const p = players[i];
  const q = bankSoal[p.soalIndex];

  if (pilih === q.jawaban.toUpperCase()) {
    p.pos += STEP;
    p.robot.style.left = p.pos + "px";

    if (p.pos >= FINISH) {
      alert(`🏆 Player ${i + 1} MENANG!`);
      return;
    }
  }

  p.soalIndex += 4;
  if (p.soalIndex < bankSoal.length) {
    renderSoal(i);
  } else {
    p.panel.innerHTML += "<p>Soal habis</p>";
  }
}

init();

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
      countdown.offsetHeight; // reset animation
      countdown.style.animation = null;
    } else if (count === 0) {
      countdown.innerText = "GO!";
    } else {
      clearInterval(timer);
      opening.style.display = "none";
      startGame(); // ← INI PENTING (memulai game lama)
    }
  }, 1000);
};

