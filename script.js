const sheetURL =
"https://opensheet.elk.sh/1_DDOM1Fzrrs9Vu_c9mC-3hVq7ZY0o7V1PW-Hcq0Y60Q/Sheet1";

let data = [];
let index = 0;
let pos = 0;

const robot = document.getElementById("r1");
const questionBox = document.getElementById("question");

async function loadSoal() {
  const res = await fetch(sheetURL);
  data = await res.json();
}

function startGame() {
  document.getElementById("start").style.display = "none";
  showSoal();
}

function showSoal() {
  if (index >= data.length) {
    questionBox.innerHTML = "🏆 SELESAI!";
    return;
  }

  const q = data[index];
  questionBox.innerHTML = `
    <b>${q.soal}</b><br>
    A. ${q.a}<br>
    B. ${q.b}<br>
    C. ${q.c}
  `;
}

function answer(pilihan) {
  const benar = data[index].jawaban.toUpperCase();
  if (pilihan === benar) {
    pos += 60;
    robot.style.left = pos + "px";
  }
  index++;
  showSoal();
}

loadSoal();
