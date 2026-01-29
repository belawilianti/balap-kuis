const sheetURL = "https://opensheet.elk.sh/1_DDOM1Fzrrs9Vu_c9mC-3hVq7ZY0o7V1PW-Hcq0Y60Q/Sheet1";

let questions = [];
let current = 0;
let positions = [0, 0, 0, 0];
let activePlayer = 0;

const qText = document.getElementById("question");
const inputAns = document.getElementById("answer");
const submitBtn = document.getElementById("submit");
const startBtn = document.getElementById("start");

const tracks = [
  document.getElementById("p1"),
  document.getElementById("p2"),
  document.getElementById("p3"),
  document.getElementById("p4")
];

async function loadQuestions() {
  const res = await fetch(sheetURL);
  questions = await res.json();
  qText.innerText = "Soal siap. Klik Start!";
}

function nextQuestion() {
  if (current >= questions.length) {
    qText.innerText = "🏁 BALAP SELESAI!";
    return;
  }

  const q = questions[current];
  qText.innerHTML = `
    <b>${q.soal}</b><br>
    A. ${q.a}<br>
    B. ${q.b}<br>
    C. ${q.c}
  `;

  inputAns.value = "";
  inputAns.focus();
}

startBtn.onclick = () => {
  startBtn.style.display = "none";
  document.getElementById("question-box").style.display = "block";
  nextQuestion();
};

submitBtn.onclick = () => {
  const user = inputAns.value.trim().toUpperCase();
  const correct = questions[current].jawaban.toUpperCase();

  if (user === correct) {
    positions[activePlayer] += 40;
    tracks[activePlayer].style.transform =
      `translateX(${positions[activePlayer]}px)`;
  }

  activePlayer = (activePlayer + 1) % tracks.length;
  current++;
  nextQuestion();
};

loadQuestions();
