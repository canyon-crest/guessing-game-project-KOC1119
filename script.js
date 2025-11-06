// time
date.textContent = time();

// global variables/constants
let score, answer, level;
const levelArr = document.getElementsByName("level")
const scoreArr = [];

//event listeners
playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);

function time(){
    let d = new Date();
    // concatenate the date and time
    d = d.getMonth()+1 + "/" + d.getDate() + "/" + d.getFullYear()
    //update here  
    return d;
}
function play(){
    playBtn.disabled = true;
    guessBtn.disabled = false;
    guess.disabled = false;
    for(let i = 0; i<levelArr.length; i++){
        levelArr[i].disabled = true;
        if(levelArr[i].checked){
            level = levelArr[i].value
        }
    }

    answer = Math.floor(Math.random()*level)+1
    msg.textContent = "Guess a number 1-" + level;
    guess.placeholder = answer
    score = 0;
 }


function makeGuess(){
    let userGuess = parseInt(guess.value);
    if(isNaN(userGuess)  || userGuess<1 || userGuess> level){
        msg.textContent = "INVALID, guess a number!";
        return;
    }
    score++;
    if(userGuess > answer){
        msg.textContent = "Too high!"
    }
    else if(userGuess < answer){
        msg.textContent  = "Too low!"
    }
    else{
        msg.textContent = "Correct! It took " + score + " tries"
        reset();
        updateScore();
    }
}
function reset(){
    guessBtn.disabled = true;
    guess.value = "";
    guess.palcehodler ="";
    guess.disabled = true;
    playBtn.disabled = false;
    for(let i=0; i< levelArr.length; i++){
        levelArr[i].disabled = false;
    }
}
function updateScore(){
    scoreArr.push(score); //adds current score to array of scores
    wins.textContent = "Total wins: " + scoreArr.length;
    let sum = 0;
    scoreArr.sort((a, b) => a - b); //sorts ascending
    //leaderboard?
    const lb = document.getElementsByName("leaderboard");
    for(let i=0; i<scoreArr.length; i++){
        sum+= scoreArr[i];
        if(i < lb.length){
            lb[i].textContent = scoreArr[i];
        }
    }
    let avg = sum/scoreArr.length;
    avgScore.textContent = "Average Score: " +avg.toFixed(2);
}


(function(){
    
    function titleCaseName(name){
        return name.trim().split(/\s+/).map(w => w.toLowerCase()).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
    let playerName = '';
    while(!playerName){
        let p = prompt('Please enter your name (will be used in all messages):','');
        if(p === null) continue; 
        p = p.trim();
        if(p.length === 0) continue;
        playerName = titleCaseName(p);
    }

   
    function ordinal(n){
        const s = ["th","st","nd","rd"];
        const v = n % 100;
        return (s[(v-20)%10]||s[v]||s[0]);
    }

    
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    function formattedNow(){
        const d = new Date();
        const month = monthNames[d.getMonth()];
        const day = d.getDate();
        const year = d.getFullYear();
        const hh = String(d.getHours()).padStart(2,'0');
        const mm = String(d.getMinutes()).padStart(2,'0');
        const ss = String(d.getSeconds()).padStart(2,'0');
        return `${month} ${day}${ordinal(day)}, ${year} ${hh}:${mm}:${ss}`;
    }

    
    try{
        if(typeof date !== 'undefined' && date){
            date.textContent = formattedNow();
            setInterval(()=>{ date.textContent = formattedNow(); }, 1000);
        }
    }catch(e){ console.warn('date element not found for live clock'); }

    
    const stats = document.createElement('div');
    stats.id = 'extra-stats';
    stats.style.marginTop = '10px';
    stats.innerHTML = `
        <div id="player-greeting">Player: ${playerName}</div>
        <div id="round-timer">Round time: 00:00.000</div>
        <div id="fastest-time">Fastest: -</div>
        <div id="total-games-time">Total time: 00:00.000</div>
        <div id="avg-time">Avg time/game: -</div>
    `;
    
    try{
        if(typeof wins !== 'undefined' && wins && wins.parentNode){
            wins.parentNode.insertBefore(stats, wins.nextSibling);
        }else document.body.appendChild(stats);
    }catch(e){ document.body.appendChild(stats); }

    const roundTimerEl = document.getElementById('round-timer');
    const fastestEl = document.getElementById('fastest-time');
    const totalGamesTimeEl = document.getElementById('total-games-time');
    const avgTimeEl = document.getElementById('avg-time');

    // timer variables
    let roundStart = null;
    let roundTimerInterval = null;
    const gameTimes = []; // ms

    function formatMs(ms){
        if(ms == null) return '00:00.000';
        const totalSec = Math.floor(ms/1000);
        const minutes = String(Math.floor(totalSec/60)).padStart(2,'0');
        const seconds = String(totalSec%60).padStart(2,'0');
        const millis = String(ms%1000).padStart(3,'0');
        return `${minutes}:${seconds}.${millis}`;
    }

    function startRoundTimer(){
        roundStart = new Date().getTime();
        if(roundTimerInterval) clearInterval(roundTimerInterval);
        roundTimerInterval = setInterval(()=>{
            const now = new Date().getTime();
            roundTimerEl.textContent = 'Round time: ' + formatMs(now - roundStart);
        }, 100);
    }
    function stopRoundTimer(finalMsg){
        if(!roundStart) return null;
        const end = new Date().getTime();
        const elapsed = end - roundStart;
        if(roundTimerInterval) clearInterval(roundTimerInterval);
        roundTimerEl.textContent = 'Round time: ' + formatMs(elapsed);
        gameTimes.push(elapsed);
        // update fastest/total/avg
        const fastest = Math.min(...gameTimes);
        const total = gameTimes.reduce((a,b)=>a+b,0);
        fastestEl.textContent = 'Fastest: ' + formatMs(fastest);
        totalGamesTimeEl.textContent = 'Total time: ' + formatMs(total);
        avgTimeEl.textContent = 'Avg time/game: ' + formatMs(Math.round(total / gameTimes.length));
        roundStart = null;
        return elapsed;
    }

   
    try{
        if(typeof playBtn !== 'undefined' && playBtn){
            playBtn.addEventListener('click', ()=>{
                startRoundTimer();
            });
        }
    }catch(e){console.warn('playBtn not found');}

    // Add a 'Give Up' button dynamically
    try{
        const giveUpBtn = document.createElement('button');
        giveUpBtn.id = 'giveUpBtn';
        giveUpBtn.textContent = 'Give Up';
        giveUpBtn.style.marginLeft = '8px';
        if(typeof playBtn !== 'undefined' && playBtn && playBtn.parentNode){
            playBtn.parentNode.insertBefore(giveUpBtn, playBtn.nextSibling);
        } else document.body.appendChild(giveUpBtn);

        giveUpBtn.addEventListener('click', ()=>{
            if(typeof answer === 'undefined' || typeof level === 'undefined'){
                msg.textContent = 'No active game to give up on.';
                return;
            }
            // set score to the range (level)
            score = level;
            msg.textContent = `${playerName}, you gave up. The answer was ${answer}. Score set to ${score}`;
            // stop timer and record
            stopRoundTimer();
            // call existing end-of-round logic
            try{ reset(); updateScore(); }catch(e){/* ignore */}
        });
    }catch(e){ console.warn('Could not add Give Up button', e); }

    
    const msgEl = (typeof msg !== 'undefined') ? msg : null;
    if(msgEl){
        let ignoreNext = false;
        const mo = new MutationObserver((mutList)=>{
            if(ignoreNext) { ignoreNext = false; return; }
            mutList.forEach(m => {
                // read current message
                let text = msgEl.textContent || '';
                if(!text) return;
                // if message already starts with name, skip
                if(text.indexOf(playerName) !== 0){
                    text = `${playerName}, ${text}`;
                }

                
                try{
                    const g = parseInt(guess.value);
                    if(!isNaN(g) && typeof answer !== 'undefined'){
                        const diff = Math.abs(g - answer);

                        const scale = Math.max(1, Math.round(level/10));
                        let proximity = '';
                        if(diff === 0) proximity = '';
                        else if(diff <= Math.max(2, scale)) proximity = 'Hot';
                        else if(diff <= Math.max(5, scale*2)) proximity = 'Warm';
                        else if(diff <= Math.max(10, scale*4)) proximity = 'Cool';
                        else proximity = 'Cold';
                        if(proximity) text += ' — ' + proximity;
                    }
                }catch(e){}

                
                if(/Correct!/i.test(text) || /you gave up/i.test(text)){
                    const elapsed = stopRoundTimer();
                    if(elapsed != null){
                        const sec = (elapsed/1000).toFixed(2);
                        text += ` (Time: ${sec}s)`;
                        
                        try{
                            const lvl = (typeof level === 'number') ? level : parseInt(level) || 10;
                            const baseline = Math.max(1, Math.ceil(Math.log2(lvl)));
                            let quality = '';
                            if(score <= baseline) quality = 'Excellent';
                            else if(score <= baseline*2) quality = 'Good';
                            else if(score <= baseline*3) quality = 'Okay';
                            else quality = 'Poor';
                            text += ` — Score: ${score} (${quality})`;
                        }catch(e){}
                    }
                }

            
                ignoreNext = true;
                msgEl.textContent = text;
            });
        });
        mo.observe(msgEl, { characterData: true, childList: true, subtree: true });
        
        try{ const greet = document.getElementById('player-greeting'); if(greet) greet.textContent = 'Player: ' + playerName; }catch(e){}
    }

})();


// --- Bounce animation on guess (appended, non-invasive) ---
(function(){
    // create and inject CSS for a smooth bounce
    const css = `
    @keyframes cg-bounce {
        0% { transform: translateY(0); }
        20% { transform: translateY(-18px); }
        40% { transform: translateY(0); }
        60% { transform: translateY(-8px); }
        80% { transform: translateY(0); }
        100% { transform: translateY(0); }
    }
    .cg-bounce {
        display: inline-block;
        animation: cg-bounce 600ms cubic-bezier(.2,.8,.2,1);
        will-change: transform;
    }
    `;
    try{
        const style = document.createElement('style');
        style.setAttribute('type','text/css');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }catch(e){ console.warn('Could not inject bounce CSS', e); }

    // add bounce trigger to msg element when a guess is submitted
    function triggerBounce(el){
        if(!el) return;
        // remove class if present to allow replay
        el.classList.remove('cg-bounce');
        // force reflow
        void el.offsetWidth;
        el.classList.add('cg-bounce');
    }

    try{
        const targetMsg = (typeof msg !== 'undefined') ? msg : document.querySelector('#msg');
        const guessInput = (typeof guess !== 'undefined') ? guess : document.querySelector('input[name="guess"]');
        const guessButton = (typeof guessBtn !== 'undefined') ? guessBtn : document.querySelector('button#guess');

        // trigger when guess button is clicked
        if(guessButton){
            guessButton.addEventListener('click', ()=>{
                // small timeout to let the message update before animating
                setTimeout(()=>{ triggerBounce(targetMsg); }, 10);
            });
        }

        // also trigger when Enter is pressed in the guess input
        if(guessInput){
            guessInput.addEventListener('keydown', (ev)=>{
                if(ev.key === 'Enter'){
                    setTimeout(()=>{ triggerBounce(targetMsg); }, 10);
                }
            });
        }

        // when the MutationObserver updates msg, replay bounce for important messages too
        if(targetMsg){
            const mo = new MutationObserver((muts)=>{
                // if content changed, give a subtle bounce
                triggerBounce(targetMsg);
            });
            mo.observe(targetMsg, { childList: true, characterData: true, subtree: true });
        }
    }catch(e){ console.warn('Could not attach bounce listeners', e); }
})();


// --- Rainbow background animation (JS-only) + toggle ---
(function(){
    if(typeof document === 'undefined') return;

    // create controller object on window so toggle UI can control it
    window.__rainbowController = window.__rainbowController || {};

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // default enabled only if not reduced
    window.__rainbowController.enabled = !!window.__rainbowController.enabled || !prefersReduced;

    let hue = 0;
    let last = performance.now();
    const speedDegPerSec = 30;

    function updateBackground(h){
        const h1 = Math.round(h);
        const h2 = Math.round((h + 60) % 360);
        const h3 = Math.round((h + 120) % 360);
        const h4 = Math.round((h + 240) % 360);
        const grad = `linear-gradient(90deg, hsl(${h1} 95% 55%), hsl(${h2} 95% 55%), hsl(${h3} 95% 55%), hsl(${h4} 95% 55%))`;
        (document.body || document.documentElement).style.background = grad;
    }

    function tick(now){
        const dt = Math.max(0, (now - last) / 1000);
        last = now;
        if(window.__rainbowController.enabled){
            hue = (hue + speedDegPerSec * dt) % 360;
            updateBackground(hue);
        }
        requestAnimationFrame(tick);
    }

    // start loop
    requestAnimationFrame(tick);

    // create toggle button UI
    try{
        const btn = document.createElement('button');
        btn.id = 'rainbowToggle';
        btn.style.marginLeft = '8px';
        btn.style.padding = '6px 10px';
        btn.style.cursor = 'pointer';
        btn.style.borderRadius = '4px';
        btn.style.border = '1px solid rgba(0,0,0,0.2)';
        btn.style.background = 'rgba(255,255,255,0.8)';
        btn.style.backdropFilter = 'blur(4px)';

        function updateBtn(){
            if(prefersReduced){
                btn.textContent = 'Rainbow (reduced)';
                btn.disabled = true;
                return;
            }
            btn.textContent = window.__rainbowController.enabled ? 'Disable Rainbow' : 'Enable Rainbow';
        }

        btn.addEventListener('click', ()=>{
            window.__rainbowController.enabled = !window.__rainbowController.enabled;
            updateBtn();
            // if disabling, set a soft neutral background so the change is visible
            if(!window.__rainbowController.enabled){
                (document.body || document.documentElement).style.background = 'linear-gradient(90deg,#eeeeee,#f7f7f7)';
            }
        });

        updateBtn();

        // insert button near the stats area if available
        const ref = document.getElementById('extra-stats') || (typeof wins !== 'undefined' ? wins.parentNode : document.body);
        if(ref && ref.parentNode){
            // put inside a small container
            const wrap = document.createElement('div');
            wrap.style.marginTop = '8px';
            wrap.appendChild(btn);
            if(ref.nextSibling) ref.parentNode.insertBefore(wrap, ref.nextSibling);
            else ref.parentNode.appendChild(wrap);
        }else{
            document.body.appendChild(btn);
        }
    }catch(e){ console.warn('Could not create rainbow toggle UI', e); }
})();




