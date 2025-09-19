// Archivo: javascript/juego.js (Versión Final y Definitiva con Imágenes Locales)
document.addEventListener('DOMContentLoaded', () => {
    // --- REFERENCIAS AL DOM ---
    const dom = {
        playerPoints: document.getElementById('player-points'), aiPoints: document.getElementById('ai-points'),
        playerSets: document.getElementById('player-sets'), aiSets: document.getElementById('ai-sets'),
        currentSet: document.getElementById('current-set'), messageLog: document.getElementById('message-log'),
        decisionPanel: document.getElementById('decision-panel'), consejoText: document.getElementById('consejo-text'),
        modal: document.getElementById('game-modal'), modalTitle: document.getElementById('modal-title'),
        modalText: document.getElementById('modal-text'), modalButton: document.getElementById('modal-button'),
        levelSelection: document.getElementById('level-selection'),
        courtImage: document.getElementById('court-image')
    };
    let gameState = {};

    // --- DICCIONARIO DE IMÁGENES (APUNTANDO A TUS ARCHIVOS LOCALES) ---
    const basePath = '../assets/game-images/';
    const gameImages = {
        NEUTRAL:         basePath + 'cancha_neutral.jpg', 
        RIVAL_RECIBIENDO:basePath + 'rival_recibiendo.png',
        SERVE_ACE:       basePath + 'saque_ace.png',
        SERVE_ERROR:     basePath + 'saque_error.png',
        ATTACK_BLOCKED:  basePath + 'ataque_bloqueado.png',
        DEFEND_SUCCESS:  basePath + 'bloque_exitoso.png',
        DEFEND_FAIL:     basePath + 'ataque_linea.png'
    };

    const consejos = { /* ... objeto de consejos sin cambios ... */ };

    // --- LÓGICA DE VISUALIZACIÓN ---
    function updateCourtImage(path) {
        dom.courtImage.style.opacity = '0';
        setTimeout(() => {
            dom.courtImage.src = path;
            dom.courtImage.style.opacity = '1';
        }, 300);
    }
    
    // --- FASES DEL JUEGO CON LÓGICA CORREGIDA ---
    function handlePlayerServe(decision) {
        clearButtons();
        // Muestra la imagen de la acción de saque que el jugador eligió
        let serveImagePath = '';
        if (decision === 'zone1') serveImagePath = basePath + 'saque_zona1.png';
        if (decision === 'zone5') serveImagePath = basePath + 'saque_zona5.png';
        if (decision === 'zone6') serveImagePath = basePath + 'saque_zona6.png';
        updateCourtImage(serveImagePath);
        
        setTimeout(() => {
            const successChance = { zone1: 0.6, zone5: 0.8, zone6: 0.95 };
            if (Math.random() < successChance[decision]) {
                logMessage('¡Gran saque!');
                updateCourtImage(gameImages.SERVE_ACE);
                setTimeout(playerDefensePhase, 1500);
            } else {
                logMessage('Saque fallado...');
                updateCourtImage(gameImages.SERVE_ERROR);
                pointFor('ai');
            }
        }, 1200); // Pausa para ver la acción
    }

    function handlePlayerAttack(decision) {
        clearButtons();
        const aiDefense = getAIChoice('defense');
        const outcomes = { line: { line: false, cross: true, read: true }, cross: { line: true, cross: false, read: true }, tip: { line: true, cross: true, read: false } };
        
        if (outcomes[decision][aiDefense]) {
            logMessage('¡PUNTO!');
            let pointImagePath = '';
            if (decision === 'line') pointImagePath = basePath + 'ataque_linea.png';
            if (decision === 'cross') pointImagePath = basePath + 'ataque_diagonal.png';
            if (decision === 'tip') pointImagePath = basePath + 'ataque_toque.png';
            updateCourtImage(pointImagePath);
            pointFor('player');
        } else {
            logMessage('¡DEFENDIDO!');
            updateCourtImage(gameImages.ATTACK_BLOCKED);
            pointFor('ai');
        }
    }

    function handlePlayerDefense(decision) {
        clearButtons();
        const aiAttack = getAIChoice('attack');
        const outcomes = { line: { line: true, cross: false, tip: false }, cross: { line: false, cross: true, tip: false }, read: { line: false, cross: false, tip: true } };
        
        if (outcomes[decision][aiAttack]) {
            logMessage('¡DEFENSA PERFECTA!');
            updateCourtImage(gameImages.DEFEND_SUCCESS);
            setTimeout(playerReceptionAndAttackPhase, 1500);
        } else {
            logMessage('Punto para el rival.');
            updateCourtImage(gameImages.DEFEND_FAIL);
            pointFor('ai');
        }
    }
    
    function playerServePhase() { updateCourtImage(gameImages.RIVAL_RECIBIENDO); logMessage('Tu turno de Saque. ¿A dónde apuntas?'); renderButtons([{ text: 'Saque a Zona 1 (Riesgo)', value: 'zone1' }, { text: 'Saque a Zona 5 (Táctico)', value: 'zone5' }, { text: 'Saque a Zona 6 (Seguro)', value: 'zone6' }], handlePlayerServe); }
    function aiServePhase() { updateCourtImage(gameImages.NEUTRAL); logMessage('El rival está sacando...'); setTimeout(() => { playerReceptionAndAttackPhase(); }, 1500); }
    function playerReceptionAndAttackPhase() { updateCourtImage(gameImages.NEUTRAL); logMessage('Buena recepción. ¡Prepara tu ataque!'); renderButtons([{ text: 'Remate a la Línea', value: 'line' }, { text: 'Remate a la Diagonal', value: 'cross' }, { text: 'Toque Corto', value: 'tip' }], handlePlayerAttack); }
    function playerDefensePhase() { updateCourtImage(gameImages.NEUTRAL); logMessage('El rival arma el ataque...'); renderButtons([{ text: 'Bloqueo a la Línea', value: 'line' }, { text: 'Bloqueo a la Diagonal', value: 'cross' }, { text: 'Defensa Abierta (Leer Toque)', value: 'read' }], handlePlayerDefense); }
    function getAIChoice(type) { const choices = type === 'attack' ? ['line', 'cross', 'tip'] : ['line', 'cross', 'read']; return choices[Math.floor(Math.random() * choices.length)]; }
    
    // --- LÓGICA DE PUNTUACIÓN Y ESTADO DE JUEGO (SIN CAMBIOS) ---
    function pointFor(winner) { if (winner === 'player') gameState.playerScore++; else gameState.aiScore++; gameState.serving = winner; updateScoreboard(); checkSetOver(); if (!gameState.gameOver) setTimeout(runPoint, 2000); }
    function checkSetOver() { const pointsToWin = gameState.currentSet < 3 ? 25 : 15; const pScore = gameState.playerScore; const aScore = gameState.aiScore; if ((pScore >= pointsToWin || aScore >= pointsToWin) && Math.abs(pScore - aScore) >= 2) { if (pScore > aScore) { gameState.playerSets++; logMessage(`¡GANASTE EL SET ${gameState.currentSet}!`); } else { gameState.aiSets++; logMessage(`Perdiste el Set ${gameState.currentSet}.`); } updateScoreboard(); checkGameOver(); if (!gameState.gameOver) { gameState.currentSet++; gameState.playerScore = 0; gameState.aiScore = 0; setTimeout(startGame, 2000); } } }
    function checkGameOver() { if (gameState.playerSets === 2 || gameState.aiSets === 2) { gameState.gameOver = true; showEndScreen(gameState.playerSets === 2 ? '¡GANASTE EL PARTIDO!' : '¡Perdiste el partido!'); } }
    function updateScoreboard() { dom.playerPoints.textContent = gameState.playerScore; dom.aiPoints.textContent = gameState.aiScore; dom.currentSet.textContent = gameState.currentSet; dom.playerSets.innerHTML = Array(gameState.playerSets).fill('<div class="set-icon won"></div>').join(''); dom.aiSets.innerHTML = Array(gameState.aiSets).fill('<div class="set-icon won"></div>').join(''); }
    function logMessage(msg) { dom.messageLog.textContent = msg; }
    function renderButtons(options, callback) { clearButtons(); options.forEach(opt => { const button = document.createElement('button'); button.textContent = opt.text; button.onclick = () => callback(opt.value); dom.decisionPanel.appendChild(button); }); }
    function clearButtons() { dom.decisionPanel.innerHTML = ''; }
    function showEndScreen(message) { dom.modal.style.display = 'flex'; dom.levelSelection.style.display = 'none'; dom.modalTitle.textContent = 'Fin del Partido'; dom.modalText.textContent = message; dom.modalButton.textContent = 'Jugar de Nuevo'; }
    function resetGame() { gameState = { playerScore: 0, aiScore: 0, playerSets: 0, aiSets: 0, currentSet: 1, serving: 'player', phase: 'start', gameOver: false, level: 1 }; dom.modal.style.display = 'flex'; dom.levelSelection.style.display = 'flex'; dom.modalTitle.textContent = 'Voleibol Táctico Rápido'; dom.modalText.textContent = 'Selecciona la dificultad del rival para empezar el partido.'; dom.modalButton.textContent = 'Empezar Partido'; document.querySelectorAll('.btn-level').forEach(btn => btn.classList.remove('selected')); updateScoreboard(); updateCourtImage(gameImages.NEUTRAL); }
    function startGame() { updateScoreboard(); logMessage(`Empieza el Set ${gameState.currentSet}. ¡Buena suerte!`); setTimeout(runPoint, 1500); }
    function runPoint() { if (gameState.gameOver) return; if (gameState.serving === 'player') playerServePhase(); else aiServePhase(); }
    
    // --- EVENT LISTENERS DEL MODAL ---
    dom.modalButton.addEventListener('click', () => { if (gameState.gameOver) { resetGame(); } else { const selectedLevel = document.querySelector('.btn-level.selected'); if (selectedLevel) { gameState.level = parseInt(selectedLevel.dataset.level); dom.modal.style.display = 'none'; startGame(); } else { alert("Por favor, selecciona un nivel de dificultad."); } } });
    dom.levelSelection.addEventListener('click', (e) => { if (e.target.classList.contains('btn-level')) { document.querySelectorAll('.btn-level').forEach(btn => btn.classList.remove('selected')); e.target.classList.add('selected'); } });
    
    resetGame();
});