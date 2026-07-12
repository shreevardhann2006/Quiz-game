const questions = [
    { question: "What is an Instrumentation Amplifier?", choices: ["A precision differential amplifier used to amplify low-level signals while rejecting common-mode noise.", "A basic voltage buffer with unity gain.", "A high-power audio amplifier for loudspeakers.", "A digital-to-analog converter."], answer: 0 },
    { question: "In the standard Instrumentation Amplifier circuit shown below, the component highlighted in pink is used to control what?", image: "gain_resistor.png", choices: ["The Common Mode Rejection Ratio (CMRR)", "The overall differential gain of the amplifier", "The input bias current", "The output offset voltage"], answer: 1 },
    { question: "What is the main purpose of an Instrumentation Amplifier?", choices: ["To filter high-frequency noise from a power line.", "To amplify small differential signals with high accuracy.", "To convert AC signals to DC signals.", "To generate sine waves of varying frequencies."], answer: 1 },
    { question: "What is the input impedance of an Instrumentation Amplifier?", choices: ["Very low", "Zero", "50 ohms", "Very high"], answer: 3 },
    { question: "What is the output impedance of an Instrumentation Amplifier?", choices: ["Very high", "Infinite", "Very low", "1 megaohm"], answer: 2 },
    { question: "What does CMRR stand for?", choices: ["Current Mode Rectification Ratio", "Central Mode Response Rate", "Common Maximum Resistance Ratio", "Common Mode Rejection Ratio"], answer: 3 },
    { question: "Why is high CMRR important?", choices: ["It increases the bandwidth of the amplifier.", "It rejects unwanted common-mode noise.", "It decreases power consumption.", "It amplifies the signal voltage."], answer: 1 },
    { question: "As depicted below, instrumentation amplifiers clean up noisy biomedical signals. What specific characteristic allows them to remove common noise (like 50/60Hz mains interference)?", image: "noise_rejection.png", choices: ["Very low output impedance", "High Common Mode Rejection Ratio (CMRR)", "High slew rate", "Low supply voltage operation"], answer: 1 },
    { question: "What is the gain of an Instrumentation Amplifier controlled by?", choices: ["The input voltage level.", "An internal capacitor.", "The power supply voltage.", "A single external gain-setting resistor (Rg)."], answer: 3 },
    { question: "The internal block diagram shown below represents a classic 3-op-amp Instrumentation Amplifier. Which commonly used IC integrates this entire circuit into a single 8-pin package?", image: "internal_diagram.png", choices: ["NE555", "LM317", "AD620", "ATmega328"], answer: 2 },
    { question: "Which amplifier stage rejects common-mode signals?", choices: ["Input buffer stage", "Output power stage", "Differential amplifier stage", "Feedback stage"], answer: 2 },
    { question: "Why is an Instrumentation Amplifier suitable for sensor applications?", choices: ["Because it has high input impedance and high CMRR.", "Because it has low input impedance and low CMRR.", "Because it operates at very high RF frequencies.", "Because it has very low bandwidth."], answer: 0 },
    { question: "What is the ideal common-mode gain of an Instrumentation Amplifier?", choices: ["Infinite", "One", "Negative one", "Zero"], answer: 3 },
    { question: "What happens when the gain-setting resistor (Rg) decreases?", choices: ["The gain decreases.", "The gain increases.", "The gain remains constant.", "The bandwidth increases."], answer: 1 },
    { question: "The circuit below shows a Wheatstone bridge connected to an amplifier. Why is an Instrumentation Amplifier specifically required here instead of a standard operational amplifier?", image: "bridge_connection.png", choices: ["Because the bridge outputs a very high voltage signal.", "Because the bridge outputs a small differential signal riding on a large common-mode voltage.", "Because a standard op-amp cannot provide enough output current.", "Because the bridge requires an AC power supply."], answer: 1 },
    { question: "Rebus Puzzle: Eye + Sea. What does this represent in electronics?", image: "eye_sea_rebus.png", choices: ["Integrated Circuit (IC)", "Current (I) Source", "Isolated Capacitor", "Input Current"], answer: 0 },
    { question: "Rebus Puzzle: Amp + Fire. What does this mean?", image: "amp_fire_rebus.png", choices: ["Ambient Fire", "Amplifier", "Amperage Filter", "Active Feedback"], answer: 1 },
    { question: "Rebus Puzzle: Wheat + Stone + Bridge. What measuring circuit is this?", image: "wheat_stone_bridge.png", choices: ["Wheatstone Bridge", "Weight Scale", "White Noise Bridge", "Water Strainer"], answer: 0 },
    { question: "Rebus Puzzle: Instrument + Nation. What field of engineering focuses on measuring and controlling variables?", image: "instrument_nation.png", choices: ["International Relations", "Insulation", "Instrumentation", "Induction"], answer: 2 },
    { question: "Rebus Puzzle: Noise + Rejection. What key feature of an instrumentation amplifier does this represent?", image: "noise_reject_rebus.png", choices: ["Noise Generation", "Negative Resistance", "Normal Routing", "Noise Rejection (CMRR)"], answer: 3 }
];

// Shuffle questions array
for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
}

// Shuffle questions' choices
questions.forEach(q => {
    let choicesWithIndex = q.choices.map((choice, index) => ({ choice, originalIndex: index }));
    for (let i = choicesWithIndex.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choicesWithIndex[i], choicesWithIndex[j]] = [choicesWithIndex[j], choicesWithIndex[i]];
    }
    q.choices = choicesWithIndex.map(c => c.choice);
    q.answer = choicesWithIndex.findIndex(c => c.originalIndex === q.answer);
});

const QUESTION_TIME = 20;

// -- Sound Effects --
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    
    if (type === 'correct') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.5, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'wrong') {
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(250, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.5, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'pop') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(800, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    }
}

// -- DOM Utility --
function switchScreen(hideId, showId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden', 'slide-out'));
    const showEl = document.getElementById(showId);
    showEl.classList.remove('hidden', 'slide-out');
    showEl.classList.add('active', 'bounce-in');
}

// -- Global Variables --
// ====== SUPABASE CONFIGURATION ======
const SUPABASE_URL = 'https://abrbzjwqnpfjdxiczios.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFicmJ6andxbnBmamR4aWN6aW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NTkzMjgsImV4cCI6MjA5OTQzNTMyOH0.teHB69quVTgheyWbSdZtex0_k4R0_O59EtyTUbunBqM';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let gameChannel = null;
let isHost = false;

// Host State
let players = {}; // { senderId: { name, score, answered, lastPoints } }
let currentQuestion = -1;
let timerInterval = null;
let timeRemaining = 0;
let answerCount = 0;

// -- Role Selection --
document.getElementById('btn-host-role').onclick = initHost;
document.getElementById('btn-join-role').onclick = showJoinScreen;
document.getElementById('btn-home').onclick = () => location.reload();

function showJoinScreen() {
    switchScreen('role-screen', 'player-join-screen');
}

// ======================== HOST LOGIC ========================
function initHost() {
    isHost = true;
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    document.getElementById('host-pin').innerText = pin;
    
    gameChannel = supabaseClient.channel('game-' + pin);
    
    gameChannel.on('broadcast', { event: 'client-message' }, (payload) => {
        handleClientMessage(payload.payload.sender, payload.payload.data);
    });
    
    gameChannel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
            console.log('Host Channel Created:', pin);
            switchScreen('role-screen', 'host-lobby-screen');
        }
    });
}

function handleClientMessage(senderId, data) {
    if (data.type === 'join') {
        players[senderId] = { name: data.name, score: 0, answered: false, lastPoints: 0 };
        gameChannel.send({ type: 'broadcast', event: 'host-message', payload: { target: senderId, data: { type: 'join-success' } } });
        updateLobbyPlayers();
    } else if (data.type === 'submit-answer') {
        const p = players[senderId];
        if (p && !p.answered && currentQuestion >= 0) {
            p.answered = true;
            answerCount++;
            document.getElementById('host-answers-count').innerText = answerCount;
            
            const isCorrect = (data.answer === questions[currentQuestion].answer);
            let pts = 0;
            if (isCorrect) {
                pts = Math.floor(500 + (500 * (timeRemaining / QUESTION_TIME)));
                p.score += pts;
            } else {
                pts = -333;
                p.score += pts;
            }
            p.lastPoints = pts;
            p.lastCorrect = isCorrect;
            
            gameChannel.send({ type: 'broadcast', event: 'host-message', payload: { target: senderId, data: { type: 'answer-received' } } });
            
            if (answerCount >= Object.keys(players).length) {
                endQuestion();
            }
        }
    }
}

function updateLobbyPlayers() {
    const list = document.getElementById('players-list');
    list.innerHTML = '';
    const keys = Object.keys(players);
    keys.forEach(k => {
        const b = document.createElement('div');
        b.className = 'player-badge';
        b.innerText = players[k].name;
        list.appendChild(b);
    });
    const startBtn = document.getElementById('btn-start-game');
    startBtn.disabled = keys.length === 0;
}

document.getElementById('btn-start-game').onclick = () => {
    currentQuestion = -1;
    broadcast({ type: 'game-starting' });
    nextQuestion();
};

document.getElementById('btn-next-question').onclick = nextQuestion;

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion >= questions.length) {
        showHostLeaderboard(true); // final
        return;
    }
    
    const q = questions[currentQuestion];
    answerCount = 0;
    Object.keys(players).forEach(k => { players[k].answered = false; });
    
    // Update Host UI
    document.getElementById('host-q-count').innerText = currentQuestion + 1;
    document.getElementById('host-question-text').innerText = q.question;
    const img = document.getElementById('host-question-image');
    if (q.image) {
        img.src = q.image; img.classList.remove('hidden-img');
    } else {
        img.src = ""; img.classList.add('hidden-img');
    }
    
    const choicesDiv = document.getElementById('host-choices');
    choicesDiv.innerHTML = '';
    const labels = ['A', 'B', 'C', 'D'];
    
    q.choices.forEach((choice, idx) => {
        const b = document.createElement('div');
        b.className = `choice-box candy-box-${idx}`;
        b.style.animation = `flyIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
        b.style.animationDelay = `${idx * 0.15}s`;
        b.style.opacity = '0';
        b.style.transform = 'translateX(-50px)';
        b.innerHTML = `<div class="candy-label">${labels[idx]}</div> <div style="flex:1; text-align:left;">${choice}</div>`;
        choicesDiv.appendChild(b);
    });
    
    document.getElementById('host-answers-count').innerText = '0';
    document.getElementById('host-total-players').innerText = Object.keys(players).length;
    
    switchScreen('host-leaderboard-screen', 'host-quiz-screen');
    switchScreen('host-lobby-screen', 'host-quiz-screen');
    
    timeRemaining = QUESTION_TIME;
    document.getElementById('host-timer').innerText = timeRemaining;
    
    broadcast({ type: 'new-question' });
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById('host-timer').innerText = timeRemaining;
        
        // Update timer bar width and color
        const barFill = document.getElementById('timer-bar-fill');
        barFill.style.width = (timeRemaining / QUESTION_TIME * 100) + '%';
        if(timeRemaining <= 5) barFill.style.background = 'var(--wrong-color)';
        else barFill.style.background = 'var(--secondary-color)';

        if (timeRemaining <= 0) {
            endQuestion();
        }
    }, 1000);
}

function endQuestion() {
    clearInterval(timerInterval);
    const q = questions[currentQuestion];
    
    // Highlight correct answer on host
    const choices = document.getElementById('host-choices').children;
    for(let i=0; i<choices.length; i++) {
        if(i === q.answer) choices[i].classList.add('correct-reveal');
        else choices[i].classList.add('wrong-reveal');
    }
    
    // Send results to players
    Object.keys(players).forEach(k => {
        const p = players[k];
        // If they didn't answer, they get 0
        if(!p.answered) { p.lastPoints = 0; p.lastCorrect = false; }
        gameChannel.send({ type: 'broadcast', event: 'host-message', payload: { target: k, data: { type: 'question-result', correct: p.lastCorrect, points: p.lastPoints, totalScore: p.score } } });
    });
    
    // Show Answer Reveal for 2 seconds, then show Leaderboard
    setTimeout(() => { 
        showHostLeaderboard(false); 
        
        // Show Leaderboard for 3 seconds, then auto-advance to next question
        setTimeout(() => {
            nextQuestion();
        }, 3000);
    }, 2000);
}

function showHostLeaderboard(isFinal) {
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '';
    
    const sorted = Object.values(players).sort((a,b) => b.score - a.score);
    sorted.forEach((p, i) => {
        const item = document.createElement('div');
        item.className = `leaderboard-item ${i < 3 ? 'rank-'+(i+1) : ''}`;
        item.innerHTML = `<span>#${i+1} ${p.name}</span> <span>${p.score}</span>`;
        list.appendChild(item);
    });
    
    if (isFinal) {
        document.getElementById('btn-next-question').style.display = 'none';
        const top3 = sorted.slice(0, 3).map(p => ({ name: p.name, score: p.score }));
        broadcast({ type: 'game-over', top3: top3 });
        
        let podiumHtml = '<div class="podium">';
        if (top3[1]) podiumHtml += `<div class="podium-place place-2"><h3>2nd</h3><p>${top3[1].name}</p><p>${top3[1].score}</p></div>`;
        if (top3[0]) podiumHtml += `<div class="podium-place place-1"><h3>1st 👑</h3><p>${top3[0].name}</p><p>${top3[0].score}</p></div>`;
        if (top3[2]) podiumHtml += `<div class="podium-place place-3"><h3>3rd</h3><p>${top3[2].name}</p><p>${top3[2].score}</p></div>`;
        podiumHtml += '</div>';

        document.getElementById('final-winner-display').innerHTML = podiumHtml;
        switchScreen('host-quiz-screen', 'result-screen');
        if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }});
    } else {
        switchScreen('host-quiz-screen', 'host-leaderboard-screen');
    }
}

function broadcast(data) {
    if (gameChannel) {
        gameChannel.send({ type: 'broadcast', event: 'host-message', payload: { data: data } });
    }
}


// ======================== PLAYER LOGIC ========================
let myPlayerId = Math.random().toString(36).substring(7);

document.getElementById('btn-join-game').onclick = () => {
    const pin = document.getElementById('input-pin').value.trim();
    const name = document.getElementById('input-name').value.trim();
    const errorText = document.getElementById('join-error');
    errorText.innerText = "Connecting to game...";
    
    if (!pin || !name) { errorText.innerText = "Please enter PIN and Name!"; return; }
    
    playSound('pop');
    
    try {
        gameChannel = supabaseClient.channel('game-' + pin);
        
        gameChannel.on('broadcast', { event: 'host-message' }, (payload) => {
            if (payload.payload.target && payload.payload.target !== myPlayerId) return; // ignore messages for other players
            handleHostMessage(payload.payload.data);
        });
        
        gameChannel.subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                errorText.innerText = "Joined! Waiting for host...";
                gameChannel.send({ type: 'broadcast', event: 'client-message', payload: { sender: myPlayerId, data: { type: 'join', name: name } } });
            } else if (status === 'CHANNEL_ERROR') {
                errorText.innerText = "Failed to connect to game server.";
            }
        });
    } catch(e) {
        errorText.innerText = "Crash: " + e.message;
    }
};

function handleHostMessage(data) {
    if (data.type === 'join-success') {
        switchScreen('player-join-screen', 'player-waiting-screen');
    } 
    else if (data.type === 'game-starting') {
        document.getElementById('player-waiting-text').innerText = "Get Ready!";
    }
    else if (data.type === 'new-question') {
        // Reset buttons
        document.querySelectorAll('.player-btn').forEach(b => { b.disabled = false; b.style.opacity = '1'; });
        switchScreen('player-waiting-screen', 'player-answer-screen');
        switchScreen('player-feedback-screen', 'player-answer-screen');
    }
    else if (data.type === 'answer-received') {
        document.querySelectorAll('.player-btn').forEach(b => { b.style.opacity = '0.5'; });
    }
    else if (data.type === 'question-result') {
        const scoreSpan = document.getElementById('player-score');
        const oldScore = parseInt(scoreSpan.innerText) || 0;
        const newScore = data.totalScore;
        
        // Count up animation
        const duration = 1500;
        const steps = 30;
        const stepTime = duration / steps;
        const increment = (newScore - oldScore) / steps;
        
        let current = oldScore;
        let count = 0;
        const counter = setInterval(() => {
            current += increment;
            count++;
            scoreSpan.innerText = Math.round(current);
            if(count >= steps) {
                clearInterval(counter);
                scoreSpan.innerText = newScore;
            }
        }, stepTime);
        
        const fbImg = document.getElementById('player-feedback-image');
        const txt = document.getElementById('player-feedback-text');
        
        fbImg.className = 'feedback-anim'; void fbImg.offsetWidth; // reset
        
        document.getElementById('player-points').innerText = data.points > 0 ? '+' + data.points : data.points;
        document.getElementById('player-score-total').innerText = data.totalScore;
        
        if (data.correct) {
            playSound('correct');
            img.src = 'cartoon_correct.png';
            img.classList.add('feedback-anim-correct');
            txt.innerText = "CORRECT!"; txt.className = 'correct-text';
            if (typeof confetti === 'function') confetti({ particleCount: 50, spread: 60 });
        } else {
            playSound('wrong');
            img.src = 'cartoon_wrong.png';
            img.classList.add('feedback-anim-wrong');
            txt.innerText = "WRONG!"; txt.className = 'wrong-text';
        }
        switchScreen('player-answer-screen', 'player-feedback-screen');
    }
    else if (data.type === 'game-over') {
        let podiumHtml = '<div class="podium">';
        if (data.top3[1]) podiumHtml += `<div class="podium-place place-2"><h3>2nd</h3><p>${data.top3[1].name}</p><p>${data.top3[1].score}</p></div>`;
        if (data.top3[0]) podiumHtml += `<div class="podium-place place-1"><h3>1st 👑</h3><p>${data.top3[0].name}</p><p>${data.top3[0].score}</p></div>`;
        if (data.top3[2]) podiumHtml += `<div class="podium-place place-3"><h3>3rd</h3><p>${data.top3[2].name}</p><p>${data.top3[2].score}</p></div>`;
        podiumHtml += '</div>';

        document.getElementById('final-winner-display').innerHTML = podiumHtml;
        switchScreen('player-feedback-screen', 'result-screen');
    }
}

document.querySelectorAll('.player-btn').forEach(btn => {
    btn.onclick = () => {
        if (!gameChannel) return;
        playSound('pop');
        const idx = parseInt(btn.getAttribute('data-idx'));
        gameChannel.send({ type: 'broadcast', event: 'client-message', payload: { sender: myPlayerId, data: { type: 'submit-answer', answer: idx } } });
        document.querySelectorAll('.player-btn').forEach(b => b.disabled = true);
    };
});
