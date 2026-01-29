const sheetURL =
"https://opensheet.elk.sh/1_DDOM1Fzrrs9Vu_c9mC-3hVq7ZY0o7V1PW-Hcq0Y60Q/Sheet1";

const STEP = 40;

let bankSoal = [];
let players = [];
let totalPlayers = 2;

/* FULLSCREEN */
document.getElementById("fullscreenBtn").onclick = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

/* TAHUN OTOMATIS */
document.getElementById("year").innerText = new Date().getFullYear();

/* PILIH PLAYER */
document.querySelectorAll(".ps-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".ps-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    totalPlayers = parseInt(btn.dataset.player);
  };
});

/* START */
document.getElementById("startBtn").onclick = () => {
  document.querySelector(".opening-box").style.display = "none";
  const cd = document.getElementById("countdown");
  cd.classList.remove("hidden");

  let c = 3;
  cd.innerText = c;

  const t = setInterval(() => {
    c--;
    if (c > 0) cd.innerText = c;
    else if (c === 0) cd.innerText = "GO!";
    else {
      clearInterval(t);
      document.getElementById("opening").style.display = "none";
      startGame();
    }
  }, 1000);
};

/* UTIL */
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function randomOrder(n) {
  return shuffle([...Array(n).keys()]);
}

function shuffleOptions(q) {
  let opts = [
    {k:"A",t:q.a},
    {k:"B",t:q.b},
    {k:"C",t:q.c}
  ];
  const correctText = opts.find(o=>o.k===q.jawaban).t;
  opts = shuffle(opts);
  return { soal:q.soal, opts, correct:opts.find(o=>o.t===correctText).k };
}

/* GAME */
async function startGame() {
  const res = await fetch(sheetURL);
  bankSoal = await res.json();

  const track = document.getElementById("track");
  const panels = document.getElementById("players");
  track.innerHTML = "";
  panels.innerHTML = "";
  players = [];

  const cars = ["🚗","🚕","🏎️","🚙"];

  for (let i = 0; i < totalPlayers; i++) {
    track.innerHTML += `
      <div class="lane">
        <div class="car" id="c${i}">${cars[i]}</div>
      </div>
    `;
    panels.innerHTML += `<div class="player" id="p${i}"></div>`;

    players.push({
      pos:0,
      order: randomOrder(bankSoal.length),
      idx:0,
      car:null,
      panel:null,
      correct:null,
      finished:false
    });
  }

  players.forEach((p,i)=>{
    p.car = document.getElementById("c"+i);
    p.panel = document.getElementById("p"+i);
    renderSoal(i);
  });
}

function renderSoal(i) {
  const p = players[i];
  const q = shuffleOptions(bankSoal[p.order[p.idx]]);
  p.correct = q.correct;

  p.panel.innerHTML = `
    <h3>Player ${i+1}</h3>
    <b>${q.soal}</b>
    ${q.opts.map(o=>`
      <button class="option" onclick="jawab(${i},'${o.k}')">
        ${o.t}
      </button>
    `).join("")}
  `;
}

function jawab(i, pilih) {
  const p = players[i];
  if (pilih === p.correct) {
    p.pos += STEP;
    p.car.style.left = p.pos+"px";
  }

  p.idx++;
  if (p.idx < p.order.length) {
    renderSoal(i);
  } else {
    p.finished = true;
    p.panel.innerHTML += "<p><b>SELESAI</b></p>";
    if (players.every(pl=>pl.finished)) tentukanPemenang();
  }
}

function tentukanPemenang() {
  let max = Math.max(...players.map(p=>p.pos));
  let win = players.findIndex(p=>p.pos===max);
  document.getElementById("winnerText").innerText = "Player "+(win+1);
  document.getElementById("winner").classList.remove("hidden");
}
