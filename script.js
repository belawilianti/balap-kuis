const sheetURL =
"https://opensheet.elk.sh/1_DDOM1Fzrrs9Vu_c9mC-3hVq7ZY0o7V1PW-Hcq0Y60Q/Sheet1";

const STEP = 40;
const JUMLAH_PER_KATEGORI = 5; // 🔧 atur jumlah soal tiap kategori untuk campuran

let bankSoal = [];
let players = [];
let totalPlayers = 2;
let selectedCategory = "bahasa_indonesia";

/* FULLSCREEN */
document.getElementById("fullscreenBtn").onclick = () => {
  document.fullscreenElement
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen();
};

/* YEAR */
document.getElementById("year").innerText = new Date().getFullYear();

/* PLAYER SELECT */
document.querySelectorAll(".ps-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".ps-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    totalPlayers = parseInt(btn.dataset.player);
  };
});

/* CATEGORY SELECT */
document.querySelectorAll(".cat-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedCategory = btn.dataset.category;
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
const shuffle = a => a.sort(() => Math.random() - 0.5);
const randomOrder = n => shuffle([...Array(n).keys()]);

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

function maxTrackX(car) {
  const lane = car.parentElement;
  return lane.offsetWidth - car.offsetWidth - 5;
}

/* GAME */
async function startGame() {
  const allSoal = await (await fetch(sheetURL)).json();

  if (selectedCategory === "campuran") {
    const kategoriList = [
      "matematika",
      "ipa",
      "ips",
      "bahasa_indonesia",
      "bahasa_inggris"
    ];

    bankSoal = [];

    kategoriList.forEach(kat => {
      const soalKategori = allSoal.filter(s => s.kategori === kat);
      const acak = shuffle([...soalKategori]);
      bankSoal.push(...acak.slice(0, JUMLAH_PER_KATEGORI));
    });

  } else {
    bankSoal = allSoal.filter(s => s.kategori === selectedCategory);
  }

  if (bankSoal.length === 0) {
    alert("Soal untuk kategori ini belum tersedia.");
    location.reload();
    return;
  }

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
      </div>`;
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
  if (p.finished) return;

  const q = shuffleOptions(bankSoal[p.order[p.idx]]);
  p.correct = q.correct;

  p.panel.innerHTML = `
    <h3>Player ${i+1}</h3>
    <b>${q.soal}</b>
    ${q.opts.map(o=>`
      <button class="option" onclick="jawab(${i},'${o.k}')">${o.t}</button>
    `).join("")}
  `;
}

function jawab(i, pilih) {
  const p = players[i];
  if (p.finished) return;

  if (pilih === p.correct) {
    p.pos = Math.min(p.pos + STEP, maxTrackX(p.car));
    p.car.style.left = p.pos + "px";
  }

  p.idx++;
  if (p.idx < p.order.length) {
    renderSoal(i);
  } else {
    p.finished = true;
    p.panel.innerHTML = `<h3>Player ${i+1}</h3><b>SELESAI</b>`;
    if (players.every(pl=>pl.finished)) tentukanPemenang();
  }
}

function tentukanPemenang() {
  const max = Math.max(...players.map(p=>p.pos));
  const win = players.findIndex(p=>p.pos===max);
  document.getElementById("winnerText").innerText = "Player " + (win+1);
  document.getElementById("winner").classList.remove("hidden");
}
