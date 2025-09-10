
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DE NAVEGACIÓN POR PESTAÑAS ---
    window.openTab = function(evt, tabName) {
        let i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tab-content");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tab-link");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }
    // Abrir la primera pestaña por defecto
    document.querySelector('.tab-link').click();


    // --- LÓGICA PARA LA PESTAÑA DE SAQUE ---

    const serveTableBody = document.querySelector('#serve-table tbody');
    const addServeRowBtn = document.getElementById('add-serve-row');
    const clearServeDataBtn = document.getElementById('clear-serve-data');
    const exportServeCsvBtn = document.getElementById('export-serve-csv');

    let playerCharts = {}; // Objeto para mantener las instancias de los gráficos por jugador

    // Elementos del resumen
    const serveAcesEl = document.getElementById('serve-aces');
    const servePositivesEl = document.getElementById('serve-positives');
    const serveNeutralsEl = document.getElementById('serve-neutrals');
    const serveErrorsEl = document.getElementById('serve-errors');
    const serveTotalEl = document.getElementById('serve-total');
    const serveEfficiencyEl = document.getElementById('serve-efficiency');
    const chartsContainer = document.getElementById('serve-charts-container');

    const STORAGE_KEY_SERVE = 'flyHighServeData';

    // Función para crear una nueva fila de saque
    const createServeRow = (data = { player: '', rotation: '', type: 'F', zone: '', result: '/' }) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="number" class="serve-player" min="1" value="${data.player}"></td>
            <td><input type="number" class="serve-rotation" min="1" max="6" value="${data.rotation}"></td>
            <td>
                <select class="serve-type">
                    <option value="F" ${data.type === 'F' ? 'selected' : ''}>F</option>
                    <option value="S" ${data.type === 'S' ? 'selected' : ''}>S</option>
                </select>
            </td>
            <td><input type="number" class="serve-zone" min="1" max="6" value="${data.zone}"></td>
            <td>
                <select class="serve-result">
                    <option value="++" ${data.result === '++' ? 'selected' : ''}>++</option>
                    <option value="+" ${data.result === '+' ? 'selected' : ''}>+</option>
                    <option value="/" ${data.result === '/' ? 'selected' : ''}>/</option>
                    <option value="-" ${data.result === '-' ? 'selected' : ''}>-</option>
                </select>
            </td>
            <td><button class="delete-row-btn">🗑️</button></td>
        `;
        row.querySelector('.delete-row-btn').addEventListener('click', () => {
            row.remove();
            updateAllServeStats();
        });
        return row;
    };

    // Función para guardar los datos en localStorage
    const saveServeData = () => {
        const data = [];
        serveTableBody.querySelectorAll('tr').forEach(row => {
            data.push({
                player: row.querySelector('.serve-player').value,
                rotation: row.querySelector('.serve-rotation').value,
                type: row.querySelector('.serve-type').value,
                zone: row.querySelector('.serve-zone').value,
                result: row.querySelector('.serve-result').value
            });
        });
        localStorage.setItem(STORAGE_KEY_SERVE, JSON.stringify(data));
    };
    
    // Función para cargar los datos desde localStorage
    const loadServeData = () => {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY_SERVE));
        if (data && data.length > 0) {
            data.forEach(rowData => serveTableBody.appendChild(createServeRow(rowData)));
        } else {
            for (let i = 0; i < 8; i++) {
                serveTableBody.appendChild(createServeRow());
            }
        }
        updateAllServeStats();
    };

    // Función para calcular y actualizar los totales
    const updateServeCalculations = () => {
        let aces = 0, positives = 0, neutrals = 0, errors = 0, total = 0;
        serveTableBody.querySelectorAll('tr').forEach(row => {
            if (row.querySelector('.serve-player').value !== '') {
                total++;
                const result = row.querySelector('.serve-result').value;
                if (result === '++') aces++;
                if (result === '+') positives++;
                if (result === '/') neutrals++;
                if (result === '-') errors++;
            }
        });
        
        // CAMBIO 1: Calcular eficiencia y mostrar como porcentaje
        const efficiencyRaw = total > 0 ? ((aces + positives - errors) / total) : 0;
        const efficiencyPercent = (efficiencyRaw * 100).toFixed(1) + '%';

        serveAcesEl.textContent = aces;
        servePositivesEl.textContent = positives;
        serveNeutralsEl.textContent = neutrals;
        serveErrorsEl.textContent = errors;
        serveTotalEl.textContent = total;
        serveEfficiencyEl.textContent = efficiencyPercent;
    };

    // CAMBIO 2: Lógica para Gráficos de Torta por Jugador
    const updateServeCharts = () => {
        const playerData = {}; 
        chartsContainer.innerHTML = ''; // Limpiar contenedor de gráficos

        serveTableBody.querySelectorAll('tr').forEach(row => {
            const player = row.querySelector('.serve-player').value;
            if (!player) return;

            if (!playerData[player]) {
                playerData[player] = { '++': 0, '+': 0, '/': 0, '-': 0, total: 0 };
            }
            
            const result = row.querySelector('.serve-result').value;
            playerData[player][result]++;
            playerData[player].total++;
        });

        if (Object.keys(playerData).length === 0) {
             chartsContainer.innerHTML = '<p class="chart-placeholder">Introduce el número de un jugador en la tabla para ver su gráfico.</p>';
             return;
        }

        for (const player in playerData) {
            // Crear contenedor para el gráfico y el título
            const chartWrapper = document.createElement('div');
            chartWrapper.className = 'player-chart-container';
            
            const title = document.createElement('h4');
            title.textContent = `Jugador #${player}`;
            
            const canvas = document.createElement('canvas');
            chartWrapper.appendChild(title);
            chartWrapper.appendChild(canvas);
            chartsContainer.appendChild(chartWrapper);

            // Crear el gráfico de torta
            const ctx = canvas.getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Aces (++)', 'Positivos (+)', 'Neutrales (/)', 'Errores (-)'],
                    datasets: [{
                        label: 'Desglose de Saques',
                        data: [
                            playerData[player]['++'],
                            playerData[player]['+'],
                            playerData[player]['/'],
                            playerData[player]['-']
                        ],
                        backgroundColor: [
                            '#4CAF50', // Verde para Aces
                            '#8BC34A', // Verde claro para Positivos
                            '#FFEB3B', // Amarillo para Neutrales
                            '#F44336'  // Rojo para Errores
                        ],
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    }
                }
            });
        }
    };

    // Función para unificar actualizaciones y guardado
    const updateAllServeStats = () => {
        updateServeCalculations();
        updateServeCharts();
        saveServeData();
    };

    // --- Event Listeners ---
    addServeRowBtn.addEventListener('click', () => {
        serveTableBody.appendChild(createServeRow());
    });

    clearServeDataBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres borrar todos los datos de saque? Esta acción no se puede deshacer.')) {
            serveTableBody.innerHTML = '';
            localStorage.removeItem(STORAGE_KEY_SERVE);
            for (let i = 0; i < 8; i++) {
                serveTableBody.appendChild(createServeRow());
            }
            updateAllServeStats();
        }
    });

    exportServeCsvBtn.addEventListener('click', () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Jugador,Rotacion,Tipo,Zona,Resultado\n";

        const rows = serveTableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const playerData = [
                row.querySelector('.serve-player').value,
                row.querySelector('.serve-rotation').value,
                row.querySelector('.serve-type').value,
                row.querySelector('.serve-zone').value,
                row.querySelector('.serve-result').value.replace(',', ';') // Prevenir problemas con comas
            ];
            if(playerData[0] !== '') {
                csvContent += playerData.join(',') + "\n";
            }
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "estadisticas_saque_flyhigh.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    serveTableBody.addEventListener('input', updateAllServeStats);

    // Carga inicial de datos
    loadServeData();
});

//=========================================================//
// --- LÓGICA PARA LA PESTAÑA DE RECEPCIÓN ---            //
//=========================================================//
document.addEventListener('DOMContentLoaded', () => {
    // Asegurarse de que el código solo se ejecute si estamos en la página de estadísticas
    if (!document.getElementById('reception-table')) return;

    const receptionTableBody = document.querySelector('#reception-table tbody');
    const addReceptionRowBtn = document.getElementById('add-reception-row');
    const clearReceptionDataBtn = document.getElementById('clear-reception-data');
    const exportReceptionCsvBtn = document.getElementById('export-reception-csv');

    // Elementos del resumen
    const receptionPerfectEl = document.getElementById('reception-perfect');
    const receptionGoodEl = document.getElementById('reception-good');
    const receptionBadEl = document.getElementById('reception-bad');
    const receptionErrorsEl = document.getElementById('reception-errors');
    const receptionTotalEl = document.getElementById('reception-total');
    const receptionEfficiencyEl = document.getElementById('reception-efficiency');
    const receptionChartsContainer = document.getElementById('reception-charts-container');

    const STORAGE_KEY_RECEPTION = 'flyHighReceptionData';

    // Función para crear una nueva fila de recepción
    const createReceptionRow = (data = { player: '', rotation: '', quality: '2' }) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="number" class="reception-player" min="1" value="${data.player}"></td>
            <td><input type="number" class="reception-rotation" min="1" max="6" value="${data.rotation}"></td>
            <td>
                <select class="reception-quality">
                    <option value="3" ${data.quality === '3' ? 'selected' : ''}>3 (Perfecta)</option>
                    <option value="2" ${data.quality === '2' ? 'selected' : ''}>2 (Buena)</option>
                    <option value="1" ${data.quality === '1' ? 'selected' : ''}>1 (Mala)</option>
                    <option value="0" ${data.quality === '0' ? 'selected' : ''}>0 (Error)</option>
                </select>
            </td>
            <td><button class="delete-row-btn">🗑️</button></td>
        `;
        row.querySelector('.delete-row-btn').addEventListener('click', () => {
            row.remove();
            updateAllReceptionStats();
        });
        return row;
    };

    // Función para guardar datos
    const saveReceptionData = () => {
        const data = [];
        receptionTableBody.querySelectorAll('tr').forEach(row => {
            data.push({
                player: row.querySelector('.reception-player').value,
                rotation: row.querySelector('.reception-rotation').value,
                quality: row.querySelector('.reception-quality').value
            });
        });
        localStorage.setItem(STORAGE_KEY_RECEPTION, JSON.stringify(data));
    };
    
    // Función para cargar datos
    const loadReceptionData = () => {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY_RECEPTION));
        if (data && data.length > 0) {
            data.forEach(rowData => receptionTableBody.appendChild(createReceptionRow(rowData)));
        } else {
            // Iniciar con 3 filas vacías
            for (let i = 0; i < 3; i++) {
                receptionTableBody.appendChild(createReceptionRow());
            }
        }
        updateAllReceptionStats();
    };

    // Función para calcular y actualizar los totales

    const updateReceptionCalculations = () => {
        let perfect = 0, good = 0, bad = 0, errors = 0, total = 0;
        receptionTableBody.querySelectorAll('tr').forEach(row => {
            if (row.querySelector('.reception-player').value !== '') {
                total++;
                const quality = row.querySelector('.reception-quality').value;
                if (quality === '3') perfect++;
                if (quality === '2') good++;
                if (quality === '1') bad++;
                if (quality === '0') errors++;
            }
        });
        
        // --- LÍNEA CORREGIDA ---
        const efficiencyRaw = total > 0 ? ((perfect - errors) / total) : 0;
        const efficiencyPercent = (efficiencyRaw * 100).toFixed(1) + '%';

        receptionPerfectEl.textContent = perfect;
        receptionGoodEl.textContent = good;
        receptionBadEl.textContent = bad;
        receptionErrorsEl.textContent = errors;
        receptionTotalEl.textContent = total;
        receptionEfficiencyEl.textContent = efficiencyPercent; // Usamos la nueva variable
    };

    // Función para actualizar los gráficos de torta
    const updateReceptionCharts = () => {
        const playerData = {}; 
        receptionChartsContainer.innerHTML = ''; // Limpiar contenedor

        receptionTableBody.querySelectorAll('tr').forEach(row => {
            const player = row.querySelector('.reception-player').value;
            if (!player) return;

            if (!playerData[player]) {
                playerData[player] = { '3': 0, '2': 0, '1': 0, '0': 0 };
            }
            
            const quality = row.querySelector('.reception-quality').value;
            playerData[player][quality]++;
        });

        if (Object.keys(playerData).length === 0) {
             receptionChartsContainer.innerHTML = '<p class="chart-placeholder">Introduce el número de un jugador en la tabla para ver su gráfico.</p>';
             return;
        }

        for (const player in playerData) {
            const chartWrapper = document.createElement('div');
            chartWrapper.className = 'player-chart-container';
            
            const title = document.createElement('h4');
            title.textContent = `Jugador #${player}`;
            
            const canvas = document.createElement('canvas');
            chartWrapper.appendChild(title);
            chartWrapper.appendChild(canvas);
            receptionChartsContainer.appendChild(chartWrapper);

            new Chart(canvas.getContext('2d'), {
                type: 'pie',
                data: {
                    labels: ['Perfectas (3)', 'Buenas (2)', 'Malas (1)', 'Errores (0)'],
                    datasets: [{
                        data: [
                            playerData[player]['3'],
                            playerData[player]['2'],
                            playerData[player]['1'],
                            playerData[player]['0']
                        ],
                        backgroundColor: ['#4CAF50', '#FFEB3B', '#FF9800', '#F44336'], // Verde, Amarillo, Naranja, Rojo
                        hoverOffset: 4
                    }]
                },
                options: { responsive: true, plugins: { legend: { position: 'top' } } }
            });
        }
    };

    // Función para unificar actualizaciones
    const updateAllReceptionStats = () => {
        updateReceptionCalculations();
        updateReceptionCharts();
        saveReceptionData();
    };

    // --- Event Listeners ---
    addReceptionRowBtn.addEventListener('click', () => {
        receptionTableBody.appendChild(createReceptionRow());
    });

    clearReceptionDataBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres borrar todos los datos de recepción?')) {
            receptionTableBody.innerHTML = '';
            localStorage.removeItem(STORAGE_KEY_RECEPTION);
            for (let i = 0; i < 3; i++) {
                receptionTableBody.appendChild(createReceptionRow());
            }
            updateAllReceptionStats();
        }
    });

    exportReceptionCsvBtn.addEventListener('click', () => {
        let csvContent = "data:text/csv;charset=utf-8,Jugador,Rotacion,Calidad\n";
        receptionTableBody.querySelectorAll('tr').forEach(row => {
            const playerData = [
                row.querySelector('.reception-player').value,
                row.querySelector('.reception-rotation').value,
                row.querySelector('.reception-quality').value
            ];
            if (playerData[0] !== '') {
                csvContent += playerData.join(',') + "\n";
            }
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "estadisticas_recepcion_flyhigh.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    receptionTableBody.addEventListener('input', updateAllReceptionStats);

    // Carga inicial
    loadReceptionData();
});

//=========================================================//
// --- LÓGICA PARA LA PESTAÑA DE ATAQUE ---                //
//=========================================================//
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('attack-table')) return;

    const attackTableBody = document.querySelector('#attack-table tbody');
    const addAttackRowBtn = document.getElementById('add-attack-row');
    const clearAttackDataBtn = document.getElementById('clear-attack-data');
    const exportAttackCsvBtn = document.getElementById('export-attack-csv');

    // Elementos del resumen
    const attackPointsEl = document.getElementById('attack-points');
    const attackErrorsEl = document.getElementById('attack-errors');
    const attackBlockedEl = document.getElementById('attack-blocked');
    const attackTotalEl = document.getElementById('attack-total');
    const attackEfficiencyEl = document.getElementById('attack-efficiency');
    const attackChartsContainer = document.getElementById('attack-charts-container');

    const STORAGE_KEY_ATTACK = 'flyHighAttackData';

    // Función para crear una nueva fila de ataque
    const createAttackRow = (data = { player: '', rotation: '', complex: 'K1', zone: '4', result: '/' }) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="number" class="attack-player" min="1" value="${data.player}"></td>
            <td><input type="number" class="attack-rotation" min="1" max="6" value="${data.rotation}"></td>
            <td>
                <select class="attack-complex">
                    <option value="K1" ${data.complex === 'K1' ? 'selected' : ''}>K1</option>
                    <option value="K2" ${data.complex === 'K2' ? 'selected' : ''}>K2</option>
                </select>
            </td>
            <td>
                <select class="attack-zone">
                    <option value="4" ${data.zone === '4' ? 'selected' : ''}>4</option>
                    <option value="3" ${data.zone === '3' ? 'selected' : ''}>3</option>
                    <option value="2" ${data.zone === '2' ? 'selected' : ''}>2</option>
                    <option value="Z" ${data.zone === 'Z' ? 'selected' : ''}>Z</option>
                </select>
            </td>
            <td>
                <select class="attack-result">
                    <option value="+" ${data.result === '+' ? 'selected' : ''}>+</option>
                    <option value="/" ${data.result === '/' ? 'selected' : ''}>/</option>
                    <option value="-" ${data.result === '-' ? 'selected' : ''}>-</option>
                    <option value="B" ${data.result === 'B' ? 'selected' : ''}>B</option>
                </select>
            </td>
            <td><button class="delete-row-btn">🗑️</button></td>
        `;
        row.querySelector('.delete-row-btn').addEventListener('click', () => {
            row.remove();
            updateAllAttackStats();
        });
        return row;
    };

    // Función para guardar datos
    const saveAttackData = () => {
        const data = [];
        attackTableBody.querySelectorAll('tr').forEach(row => {
            data.push({
                player: row.querySelector('.attack-player').value,
                rotation: row.querySelector('.attack-rotation').value,
                complex: row.querySelector('.attack-complex').value,
                zone: row.querySelector('.attack-zone').value,
                result: row.querySelector('.attack-result').value
            });
        });
        localStorage.setItem(STORAGE_KEY_ATTACK, JSON.stringify(data));
    };
    
    // Función para cargar datos
    const loadAttackData = () => {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY_ATTACK));
        if (data && data.length > 0) {
            data.forEach(rowData => attackTableBody.appendChild(createAttackRow(rowData)));
        } else {
            // Iniciar con 6 filas vacías
            for (let i = 0; i < 6; i++) {
                attackTableBody.appendChild(createAttackRow());
            }
        }
        updateAllAttackStats();
    };

    // Función para calcular y actualizar los totales
    const updateAttackCalculations = () => {
        let points = 0, errors = 0, blocked = 0, total = 0;
        attackTableBody.querySelectorAll('tr').forEach(row => {
            if (row.querySelector('.attack-player').value !== '') {
                total++;
                const result = row.querySelector('.attack-result').value;
                if (result === '+') points++;
                if (result === '-') errors++;
                if (result === 'B') blocked++;
            }
        });
        
        const efficiencyRaw = total > 0 ? ((points - errors - blocked) / total) : 0;
        const efficiencyPercent = (efficiencyRaw * 100).toFixed(1) + '%';

        attackPointsEl.textContent = points;
        attackErrorsEl.textContent = errors;
        attackBlockedEl.textContent = blocked;
        attackTotalEl.textContent = total;
        attackEfficiencyEl.textContent = efficiencyPercent;
    };

    // Función para actualizar los gráficos de torta
    const updateAttackCharts = () => {
        const playerData = {}; 
        attackChartsContainer.innerHTML = ''; // Limpiar contenedor

        attackTableBody.querySelectorAll('tr').forEach(row => {
            const player = row.querySelector('.attack-player').value;
            if (!player) return;

            if (!playerData[player]) {
                playerData[player] = { '+': 0, '/': 0, '-': 0, 'B': 0 };
            }
            
            const result = row.querySelector('.attack-result').value;
            playerData[player][result]++;
        });

        if (Object.keys(playerData).length === 0) {
             attackChartsContainer.innerHTML = '<p class="chart-placeholder">Introduce el número de un jugador en la tabla para ver su gráfico.</p>';
             return;
        }

        for (const player in playerData) {
            const chartWrapper = document.createElement('div');
            chartWrapper.className = 'player-chart-container';
            const title = document.createElement('h4');
            title.textContent = `Jugador #${player}`;
            const canvas = document.createElement('canvas');
            chartWrapper.appendChild(title);
            chartWrapper.appendChild(canvas);
            attackChartsContainer.appendChild(chartWrapper);

            new Chart(canvas.getContext('2d'), {
                type: 'pie',
                data: {
                    labels: ['Puntos (+)', 'Continuación (/)', 'Errores (-)', 'Bloqueados (B)'],
                    datasets: [{
                        data: [
                            playerData[player]['+'],
                            playerData[player]['/'],
                            playerData[player]['-'],
                            playerData[player]['B']
                        ],
                        backgroundColor: ['#4CAF50', '#FFEB3B', '#F44336', '#607D8B'], // Verde, Amarillo, Rojo, Gris
                        hoverOffset: 4
                    }]
                },
                options: { responsive: true, plugins: { legend: { position: 'top' } } }
            });
        }
    };

    // Función para unificar actualizaciones
    const updateAllAttackStats = () => {
        updateAttackCalculations();
        updateAttackCharts();
        saveAttackData();
    };

    // --- Event Listeners ---
    addAttackRowBtn.addEventListener('click', () => {
        attackTableBody.appendChild(createAttackRow());
    });

    clearAttackDataBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres borrar todos los datos de ataque?')) {
            attackTableBody.innerHTML = '';
            localStorage.removeItem(STORAGE_KEY_ATTACK);
            for (let i = 0; i < 6; i++) {
                attackTableBody.appendChild(createAttackRow());
            }
            updateAllAttackStats();
        }
    });

    exportAttackCsvBtn.addEventListener('click', () => {
        let csvContent = "data:text/csv;charset=utf-8,Jugador,Rotacion,Complejo,Zona,Resultado\n";
        attackTableBody.querySelectorAll('tr').forEach(row => {
            const playerData = [
                row.querySelector('.attack-player').value,
                row.querySelector('.attack-rotation').value,
                row.querySelector('.attack-complex').value,
                row.querySelector('.attack-zone').value,
                row.querySelector('.attack-result').value,
            ];
            if (playerData[0] !== '') {
                csvContent += playerData.join(',') + "\n";
            }
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "estadisticas_ataque_flyhigh.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    attackTableBody.addEventListener('input', updateAllAttackStats);

    // Carga inicial
    loadAttackData();
});