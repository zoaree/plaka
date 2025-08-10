// Utility helpers
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const rnd = (n) => Math.floor(Math.random() * n);
const shuffle = (arr) => arr.map(v => ({ v, r: Math.random() })).sort((a,b)=>a.r-b.r).map(o=>o.v);

// State
let state = {
  name: '',
  score: 0,
  timeLeft: 120,
  timer: null,
  paused: false,
  question: null,
  history: [],
  currentQuestionIndex: 0,
  allProvinces: shuffle(PROVINCES.slice()),
};

// DOM
const screenWelcome = $('#screen-welcome');
const screenGame = $('#screen-game');
const screenSummary = $('#screen-summary');

const playerNameEl = $('#playerName');
const btnStart = $('#btnStart');
const gameDurationEl = $('#gameDuration');
const btnPause = $('#btnPause');
const btnSkip = $('#btnSkip');

const hudName = $('#hudName');
const hudDiff = $('#hudDiff');
const hudScore = $('#hudScore');
const hudTime = $('#hudTime');
const timeBar = $('#timeBar');

const answersEl = $('#answers');
const questionText = $('#questionText');
const plateCode = $('#plateCode');
const plateName = $('#plateName');
const inputWrap = $('#inputWrap');
const answerInput = $('#answerInput');
const btnSubmit = $('#btnSubmit');
const provinceList = $('#provinceList');

const btnLeaderboard = $('#btnLeaderboard');
const leaderboard = $('#leaderboard');
const lbList = $('#lbList');
const lbClose = $('#lbClose');
const lbClear = $('#lbClear');

const btnTheme = $('#btnTheme');

const sumName = $('#sumName');
const sumScore = $('#sumScore');
const sumDetails = $('#sumDetails');
const btnPlayAgain = $('#btnPlayAgain');
const btnShowLeaderboard = $('#btnShowLeaderboard');

const confettiCanvas = $('#confetti');

// Initialize datalist for input mode
function initProvinceList(){
  provinceList.innerHTML = PROVINCES.map(p=>`<option value="${p.name}"></option>`).join('');
}

// Leaderboard persistence
function loadScores(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(e){
    return [];
  }
}
function saveScore(entry){
  const list = loadScores();
  list.push(entry);
  list.sort((a,b)=> b.score - a.score || a.time - b.time);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 100)));
}
function renderLeaderboard(){
  const list = loadScores();
  if(list.length===0){
    lbList.innerHTML = '<div class="leader-item"><span>Henüz kayıt yok</span></div>';
    return;
  }
  lbList.innerHTML = list.map((e,i)=>`
    <div class="leader-item">
      <div><strong>#${i+1}</strong> • ${e.name}</div>
      <div><strong>${e.score}</strong> puan • ${e.correct}/${e.total} doğru</div>
    </div>
  `).join('');
}

// Screens
function showScreen(id){
  $$('.screen').forEach(s=>s.classList.remove('active'));
  $(id).classList.add('active');
}

// Game mechanics
function startGame(){
  state.name = (playerNameEl.value || 'Misafir').trim().slice(0,20);
  state.score = 0; 
  state.timeLeft = 120; 
  state.paused = false; 
  state.history = [];
  state.currentQuestionIndex = 0;
  state.allProvinces = shuffle(PROVINCES.slice());
  
  hudName.textContent = state.name;
  hudDiff.textContent = 'Tüm İller';
  hudScore.textContent = '0';
  hudTime.textContent = state.timeLeft;
  timeBar.style.width = '100%';
  showScreen('#screen-game');
  nextQuestion();
  startTimer();
}

function startTimer(){
  if(state.timer) clearInterval(state.timer);
  const total = 120;
  state.timer = setInterval(()=>{
    if(state.paused) return;
    state.timeLeft -= 1;
    if(state.timeLeft < 0){ endGame(); return; }
    hudTime.textContent = state.timeLeft;
    timeBar.style.width = (state.timeLeft/total*100)+"%";
  }, 1000);
}

function endGame(){
  clearInterval(state.timer);
  showScreen('#screen-summary');
  sumName.textContent = state.name;
  sumScore.textContent = state.score;
  const correct = state.history.filter(h=>h.correct).length;
  const total = state.history.length;
  sumDetails.innerHTML = `Toplam ${total} soru, ${correct} doğru. Doğruluk: ${(total?Math.round(correct/total*100):0)}%`;
  saveScore({ name: state.name, score: state.score, correct, total, time: Date.now() });
  burstConfetti();
}

function pickQuestion(){
  if(state.currentQuestionIndex >= state.allProvinces.length) {
    // Tüm iller bitti, oyunu bitir
    endGame();
    return null;
  }
  const q = state.allProvinces[state.currentQuestionIndex];
  state.currentQuestionIndex++;
  return { ...q, type: 'plate2city' };
}

function makeOptions(correctItem, count){
  const others = shuffle(PROVINCES.filter(p=> p.code!==correctItem.code)).slice(0, count-1);
  const options = shuffle([correctItem, ...others]);
  return options.map(o=> o.name);
}

function nextQuestion(){
  const q = pickQuestion();
  if(!q) return; // Oyun bitti
  
  state.question = q;

  // Display plate and text - sadece plaka kodu göster
  plateCode.textContent = q.code;
  plateName.classList.add('hidden'); // İsmi gizle
  questionText.textContent = `${q.code} plaka kodu hangi şehre ait?`;

  // Her zaman çoktan seçmeli
  const opts = makeOptions(q, 4);
  answersEl.innerHTML = '';
  inputWrap.classList.add('hidden');
  answersEl.classList.remove('hidden');

  opts.forEach(opt=>{
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = opt;
    btn.addEventListener('click', ()=> submitAnswer(opt));
    answersEl.appendChild(btn);
  });
}

function submitAnswer(val){
  const q = state.question; if(!q) return;
  const correctVal = q.name;
  const ok = normalize(val) === normalize(correctVal);

  if(ok){
    state.score += 10;
    hudScore.textContent = state.score;
    feedback(true);
  } else {
    feedback(false);
  }

  state.history.push({ q, answer: val, correct: ok });

  // bonus: time reward on correct
  if(ok){
    state.timeLeft = Math.min(state.timeLeft + 3, 120+20); // bonus
  }

  // Show fact occasionally
  if(ok){
    const f = FACTS.find(f => f.name === q.name);
    if(f){
      showToast(f.fact);
    }
  }

  // Next question with small delay
  setTimeout(()=>{
    nextQuestion();
  }, ok ? 500 : 800);
}

function normalize(input){
  return input.toString().trim().toLocaleLowerCase('tr-TR');
}

function feedback(correct){
  if($('#answers') && !$('#answers').classList.contains('hidden')){
    $$('#answers .answer-btn').forEach(btn=>{
      const isCorrect = normalize(btn.textContent) === normalize(state.question.name);
      btn.classList.toggle('correct', isCorrect);
      if(!isCorrect && !correct){
        btn.classList.add('wrong');
      }
    });
  }
  platePulse(correct);
}

function platePulse(correct){
  const el = $('#plate');
  el.style.transition = 'transform .15s';
  el.style.transform = correct ? 'scale(1.06)' : 'scale(0.96)';
  el.style.borderColor = correct ? '#22c55e' : '#ff6b6b';
  setTimeout(()=>{
    el.style.transform = 'scale(1)';
    el.style.borderColor = '';
  }, 180);
}

btnSubmit?.addEventListener('click', ()=>{
  const v = answerInput.value;
  if(!v) return;
  submitAnswer(v);
});
answerInput?.addEventListener('keydown', (e)=>{
  if(e.key==='Enter'){ btnSubmit.click(); }
});

btnStart.addEventListener('click', startGame);
btnSkip.addEventListener('click', ()=>{
  if(!state.question) return;
  state.history.push({ q: state.question, answer: null, correct: false, skipped: true});
  nextQuestion();
});
btnPause.addEventListener('click', ()=>{
  state.paused = !state.paused;
  btnPause.textContent = state.paused ? 'Devam ▶️' : 'Durdur ⏸️';
});

// Leaderboard modal
btnLeaderboard.addEventListener('click', ()=>{ leaderboard.classList.remove('hidden'); renderLeaderboard(); });
lbClose.addEventListener('click', ()=> leaderboard.classList.add('hidden'));
lbClear.addEventListener('click', ()=>{ localStorage.removeItem(STORAGE_KEY); renderLeaderboard(); });
btnShowLeaderboard.addEventListener('click', ()=>{ leaderboard.classList.remove('hidden'); renderLeaderboard(); });

btnPlayAgain.addEventListener('click', ()=>{
  leaderboard.classList.add('hidden');
  showScreen('#screen-welcome');
});

// Theme toggle (light/dark)
let dark = true;
btnTheme.addEventListener('click', ()=>{
  dark = !dark;
  document.documentElement.classList.toggle('light', !dark);
  btnTheme.textContent = dark ? '🌙' : '☀️';
});

// Toast system
let toastTimer;
function showToast(msg){
  let t = $('#toast');
  if(!t){
    t = document.createElement('div');
    t.id = 'toast';
    t.style.position='fixed'; t.style.bottom='24px'; t.style.left='50%'; t.style.transform='translateX(-50%)';
    t.style.background='rgba(0,0,0,.7)'; t.style.color='#fff'; t.style.padding='12px 14px'; t.style.borderRadius='12px'; t.style.zIndex='9999'; t.style.maxWidth='90%';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity='0'; t.style.transition='opacity .2s, transform .2s'; t.style.transform='translate(-50%, 8px)';
  clearTimeout(toastTimer);
  requestAnimationFrame(()=>{ t.style.opacity='1'; t.style.transform='translate(-50%, 0)'; });
  toastTimer = setTimeout(()=>{ t.style.opacity='0'; }, 2200);
}

// Confetti
const cx = confettiCanvas.getContext('2d');
let confettiPieces = [];
function burstConfetti(){
  const colors = ['#7c5cff','#5eead4','#22c55e','#ff6b6b','#facc15'];
  confettiPieces = Array.from({length: 120}, ()=>({
    x: Math.random()*window.innerWidth,
    y: -10,
    r: 4+Math.random()*6,
    c: colors[rnd(colors.length)],
    vx: -2+Math.random()*4,
    vy: 2+Math.random()*3,
    a: Math.random()*Math.PI
  }));
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  animateConfetti();
  setTimeout(()=> confettiPieces = [], 1600);
}
function animateConfetti(){
  cx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
  confettiPieces.forEach(p=>{
    p.x += p.vx; p.y += p.vy; p.a += .05;
    cx.save();
    cx.translate(p.x, p.y);
    cx.rotate(p.a);
    cx.fillStyle = p.c;
    cx.fillRect(-p.r/2, -p.r/2, p.r, p.r);
    cx.restore();
  });
  if(confettiPieces.length){
    requestAnimationFrame(animateConfetti);
  } else {
    cx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
  }
}

// Populate datalist and welcome plate
initProvinceList();
plateCode.textContent = '??';
plateName.textContent = 'Hangi Şehir?';

// Accessibility: allow 1-4 keys to choose answers on MC mode
window.addEventListener('keydown', (e)=>{
  const idx = parseInt(e.key,10);
  if(!isNaN(idx) && idx>=1){
    const btn = $(`#answers .answer-btn:nth-child(${idx})`);
    if(btn) btn.click();
  }
});