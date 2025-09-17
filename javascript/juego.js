// Archivo: javascript/juego.js (Versión Completa y Corregida)
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const playerPointsEl = document.getElementById('player-points');
    const aiPointsEl = document.getElementById('ai-points');
    const playerSetsEl = document.getElementById('player-sets');
    const aiSetsEl = document.getElementById('ai-sets');
    const currentSetEl = document.getElementById('current-set');
    const messageLogEl = document.getElementById('message-log');
    const decisionPanelEl = document.getElementById('decision-panel');
    const specialAbilitiesEl = document.getElementById('special-abilities');
    const consejoTextEl = document.getElementById('consejo-text');
    const modalEl = document.getElementById('game-modal');
    const modalTitleEl = document.getElementById('modal-title');
    const modalTextEl = document.getElementById('modal-text');
    const modalButtonEl = document.getElementById('modal-button');
    const levelSelectionEl = document.getElementById('level-selection');
    const ballEl = document.getElementById('ball');
    let gameState = {};

    const consejos = { /* ... Este objeto no necesita cambios ... */ };

    // --- LÓGICA DE ANIMACIÓN ---
    function animateAction(action) {
        const { type, side, target } = action;
        let startPlayerEl;
        
        ballEl.style.animation = 'none';
        ballEl.offsetHeight; // Forzar reinicio de animación

        switch (type) {
            case 'serve':
                startPlayerEl = document.getElementById(side === 'player' ? 'p-player-1' : 'p-rival-1');
                ballEl.style.left = `${startPlayerEl.offsetLeft + 7}px`;
                ballEl.style.top = `${startPlayerEl.offsetTop}px`;
                ballEl.style.animation = side === 'player' ? 'serve-ball-player 1s forwards' : 'serve-ball-ai 1s forwards';
                break;
            
            case 'attack':
                const attackerPos = '4'; // Atacante de punta
                startPlayerEl = document.getElementById(`p-${side}-${attackerPos}`);
                startPlayerEl.classList.add('is-jumping');

                ballEl.style.left = `${startPlayerEl.offsetLeft + 7}px`;
                ballEl.style.top = `${startPlayerEl.offsetTop}px`;

                let endX, endY;
                if (side === 'player') {
                    endY = 50;
                    if (target === 'line') endX = '15%'; else if (target === 'cross') endX = '85%'; else endX = '50%';
                } else {
                    endY = 350;
                    if (target === 'line') endX = '85%'; else if (target === 'cross') endX = '15%'; else endX = '50%';
                }
                
                ballEl.style.animation = 'attack-ball 0.7s forwards';
                
                setTimeout(() => {
                    ballEl.style.left = endX;
                    ballEl.style.top = `${endY}px`;
                    ballEl.style.animation = 'land-ball 0.5s forwards';
                }, 700);
                
                setTimeout(() => startPlayerEl.classList.remove('is-jumping'), 600);
                break;
        }
    }
    
    // --- MANEJO DE DECISIONES Y FASES ---
    function handlePlayerServe(decision) {
        clearButtons();
        animateAction({ type: 'serve', side: 'player' });
        setTimeout(() => {
            const successChance = { zone1: 0.6, zone6: 0.95, zone5: 0.8 };
            if (Math.random() < successChance[decision]) {
                logMessage(`¡Gran saque a ${decision.replace('zone', 'Zona ')}!`);
                setTimeout(playerDefensePhase, 1000);
            } else {
                logMessage('¡Saque fallado! Fuera...');
                showConsejo('saque', 'error');
                setTimeout(() => pointFor('ai'), 500);
            }
        }, 1000);
    }

    function handlePlayerAttack(decision) {
        clearButtons();
        const aiDefense = getAIChoice('defense');
        const outcomes = { line: { line: false, cross: true, read: true }, cross: { line: true, cross: false, read: true }, tip: { line: true, cross: true, read: false } };
        if (outcomes[decision][aiDefense]) {
            animateAction({ type: 'attack', side: 'player', target: decision });
            setTimeout(() => {
                logMessage(`¡PUNTO! Atacaste a la ${decision} y los engañaste.`);
                showConsejo('ataque', decision === 'tip' ? 'touch' : 'kill');
                pointFor('player');
            }, 1200);
        } else {
            logMessage(`¡DEFENDIDO! El rival leyó tu ataque.`);
            showConsejo('ataque', 'blocked');
            setTimeout(() => pointFor('ai'), 500);
        }
    }

    function handlePlayerDefense(decision) {
        clearButtons();
        const aiAttack = getAIChoice('attack');
        const outcomes = { line: { line: true, cross: false, read: false }, cross: { line: false, cross: true, read: false }, read: { line: false, cross: false, read: true } };
        if (outcomes[decision][aiAttack]) {
            logMessage(`¡DEFENSA PERFECTA! Bloqueaste la ${decision}.`);
            showConsejo('defensa', 'dig');
            setTimeout(playerReceptionAndAttackPhase, 1000);
        } else {
            animateAction({ type: 'attack', side: 'ai', target: aiAttack });
            setTimeout(() => {
                 logMessage(`Punto para el rival. Atacaron a la ${aiAttack}.`);
                 showConsejo('defensa', 'error');
                 pointFor('ai');
            }, 1200);
        }
    }

    function playerServePhase() { logMessage('Tu turno de Saque. ¿A dónde apuntas?'); renderButtons([{ text: 'Zona 1 (Difícil)', value: 'zone1' }, { text: 'Zona 6 (Seguro)', value: 'zone6' }, { text: 'Zona 5 (Táctico)', value: 'zone5' }], handlePlayerServe); }
    function aiServePhase() { logMessage('El rival está sacando...'); animateAction({ type: 'serve', side: 'ai' }); setTimeout(() => { logMessage('¡El saque viene hacia ti!'); playerReceptionAndAttackPhase(); }, 1500); }
    function playerReceptionAndAttackPhase() { logMessage('Buena recepción. ¡Prepara tu ataque!'); renderButtons([{ text: 'Remate a la Línea', value: 'line' }, { text: 'Remate a la Diagonal', value: 'cross' }, { text: 'Toque Corto (Dejada)', value: 'tip' }], handlePlayerAttack); }
    function playerDefensePhase() { logMessage(`El rival arma el ataque...`); renderButtons([{ text: 'Bloqueo a la Línea', value: 'line' }, { text: 'Bloqueo a la Diagonal', value: 'cross' }, { text: 'Defensa Abierta', value: 'read' }], handlePlayerDefense); }

    // --- LÓGICA DE IA ---
    function getAIChoice(type) {
        const choices = type === 'attack' ? ['line', 'cross', 'tip'] : ['line', 'cross', 'read'];
        return choices[Math.floor(Math.random() * choices.length)];
    }

    // --- PUNTUACIÓN Y ESTADO DEL JUEGO ---
    function pointFor(winner) {
        if (winner === 'player') gameState.playerScore++; else gameState.aiScore++;
        gameState.serving = winner;
        updateScoreboard();
        checkSetOver();
        if (!gameState.gameOver) setTimeout(runPoint, 2500);
    }

    function checkSetOver() {
        const pointsToWin = gameState.currentSet === 3 ? 15 : 25;
        const pScore = gameState.playerScore;
        const aScore = gameState.aiScore;
        if ((pScore >= pointsToWin || aScore >= pointsToWin) && Math.abs(pScore - aScore) >= 2) {
            if (pScore > aScore) { gameState.playerSets++; logMessage(`¡GANASTE EL SET ${gameState.currentSet}!`); } else { gameState.aiSets++; logMessage(`Perdiste el Set ${gameState.currentSet}.`); }
            updateScoreboard();
            checkGameOver();
            if (!gameState.gameOver) {
                gameState.currentSet++; gameState.playerScore = 0; gameState.aiScore = 0;
                setTimeout(startGame, 2000);
            }
        }
    }
    
    function checkGameOver() {
        if (gameState.playerSets === 2 || gameState.aiSets === 2) {
            gameState.gameOver = true;
            showEndScreen(gameState.playerSets === 2 ? '¡GANASTE EL PARTIDO!' : '¡Perdiste el partido!');
        }
    }

    // --- FUNCIONES DE UI ---
    function updateScoreboard() {
        playerPointsEl.textContent = gameState.playerScore;
        aiPointsEl.textContent = gameState.aiScore;
        currentSetEl.textContent = gameState.currentSet;
        playerSetsEl.innerHTML = Array(gameState.playerSets).fill('<div class="set-icon won"></div>').join('');
        aiSetsEl.innerHTML = Array(gameState.aiSets).fill('<div class="set-icon won"></div>').join('');
    }
    function logMessage(msg) { messageLogEl.textContent = msg; }
    function renderButtons(options, callback) { clearButtons(); options.forEach(opt => { const button = document.createElement('button'); button.textContent = opt.text; button.onclick = () => callback(opt.value); decisionPanelEl.appendChild(button); }); }
    function clearButtons() { decisionPanelEl.innerHTML = ''; specialAbilitiesEl.innerHTML = ''; }
    function showConsejo(category, type) { if (consejos[category] && consejos[category][type]) consejoTextEl.textContent = consejos[category][type]; }
    function showEndScreen(message) { modalEl.style.display = 'flex'; levelSelectionEl.style.display = 'none'; modalTitleEl.textContent = 'Fin del Partido'; modalTextEl.textContent = message; modalButtonEl.textContent = 'Jugar de Nuevo'; }
    
    function resetGame() {
        gameState = { playerScore: 0, aiScore: 0, playerSets: 0, aiSets: 0, currentSet: 1, serving: 'player', phase: 'start', gameOver: false, level: 1 };
        modalEl.style.display = 'flex';
        levelSelectionEl.style.display = 'flex';
        modalTitleEl.textContent = 'Voleibol Táctico Rápido';
        modalTextEl.textContent = 'Selecciona la dificultad del rival para empezar el partido.';
        modalButtonEl.textContent = 'Empezar Partido';
        document.querySelectorAll('.btn-level').forEach(btn => btn.classList.remove('selected'));
        updateScoreboard();
    }
    
    function startGame() { updateScoreboard(); logMessage(`Empieza el Set ${gameState.currentSet}. ¡Buena suerte!`); setTimeout(runPoint, 1500); }
    function runPoint() { if (gameState.gameOver) return; ballEl.style.opacity = '0'; if (gameState.serving === 'player') playerServePhase(); else aiServePhase(); }
    
    // --- EVENT LISTENERS DEL MODAL ---
    modalButtonEl.addEventListener('click', () => {
        if (gameState.gameOver) {
            resetGame();
        } else {
            const selectedLevel = document.querySelector('.btn-level.selected');
            if (selectedLevel) {
                gameState.level = parseInt(selectedLevel.dataset.level);
                modalEl.style.display = 'none';
                startGame();
            } else {
                alert("Por favor, selecciona un nivel de dificultad.");
            }
        }
    });

    levelSelectionEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-level')) {
            document.querySelectorAll('.btn-level').forEach(btn => btn.classList.remove('selected'));
            e.target.classList.add('selected');
        }
    });
    
    resetGame();
});