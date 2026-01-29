const sheetURL =
"https://opensheet.elk.sh/1_DDOM1Fzrrs9Vu_c9mC-3hVq7ZY0o7V1PW-Hcq0Y60Q/Sheet1";

let questions = [];
let index = 0;
let player = 0;

const step = 60;
const finishX = 700;
const positions = [0, 0, 0, 0];

const robots = [
  document.getElementById("r0"),
  document.getElementById("r1"),
  document.getElementById("r2"),
  document.getElementById("r3")
];

const qBox = document.getElementById("question");
const turn = document.getElementById("turn");

async function loadSoal() {
  const res = await fetch(sheetURL);
  questions = await res.json();
}

function startGame() {
  document.getElementById("start").style.display = "none";
  showSoal();
}

function showSoal() {
  if (index >= questions.length) {
    qBox.innerHTML = "Soal habis!";
    return;
  }

  const q = questions[index];
  turn.innerText = "Pemain " + (player + 1);
  qBox.innerHTML = `
    <b>${q.soal}</b><br>
    A. ${q.a}<br>
    B. ${q.b}<br>
    C. ${q.c}
  `;
}

function answer(choice) {
  const correct = questions[index].jawaban.toUpperCase();

  if (choice === correct) {
    positions[player] += step;
    robots[player].style.left = positions[player] + "px";

    if (positions[player] >= finishX) {
      qBox.innerHTML = `🏆 PEMAIN ${player + 1} MENANG!`;
      turn.innerText = "SELESAI";
      return;
    }
  }

  player = (player + 1) % 4;
  index++;
  showSoal();
}

loadSoal();
