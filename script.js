let nivelCaos = 0;
let synthAudio = null;

const labelsBotao = [
    "[ INICIAR_ ]",
    "[ REESCREVER_SISTEMA ]",
    "[ CRASH_PROXIMO ]",
    "[ ATENÇÃO: OVERLOAD ]",
    "[ EXECUTAR_CORE.EXE ]"
];

const mensagensErro = [
    "ERROR: STACK OVERFLOW",
    "OVERHEAT DETECTED",
    "SYS_REBOOT: FALHOU",
    "KERNEL_PANIC: IMPOSSÍVEL COMPILAR",
    "MEMÓRIA CORROMPIDA",
    "VAGAS_TDS_VULNERÁVEIS"
];

function iniciarSons() {
    if (!synthAudio) synthAudio = new (window.AudioContext || window.webkitAudioContext)();
}

// Bips estridentes aleatórios
function somHacker(freq, tipo, tempo) {
    iniciarSons();
    if (synthAudio.state === 'suspended') synthAudio.resume();
    const osc = synthAudio.createOscillator();
    const gain = synthAudio.createGain();
    osc.type = tipo;
    osc.frequency.setValueAtTime(freq, synthAudio.currentTime);
    osc.connect(gain);
    gain.connect(synthAudio.destination);
    gain.gain.setValueAtTime(0.2, synthAudio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, synthAudio.currentTime + tempo);
    osc.start();
    osc.stop(synthAudio.currentTime + tempo);
}

function spawnFakePopup() {
    const arena = document.getElementById('desktop-arena');
    const popup = document.createElement('div');
    popup.className = 'fake-popup';
    
    // Posições randômicas na tela
    const x = Math.random() * (window.innerWidth - 300);
    const y = Math.random() * (window.innerHeight - 150);
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    const txt = mensagensErro[Math.floor(Math.random() * mensagensErro.length)];
    popup.innerHTML = `
        <div class="popup-title">⚠️ SYSTEM_CRASH_WARN</div>
        <div class="popup-body">${txt}</div>
    `;
    
    arena.appendChild(popup);
    somHacker(Math.random() * 800 + 200, 'sawtooth', 0.15);
}

function injectChaos() {
    nivelCaos++;
    iniciarSons();
    
    const body = document.body;
    const btn = document.getElementById('chaos-trigger');
    const noise = document.getElementById('noise');
    const shatterZone = document.getElementById('shatter-zone');

    if (nivelCaos < labelsBotao.length) {
        btn.innerText = labelsBotao[nivelCaos];
    }

    // GATILHOS DE CAOS CRESCENTES
    if (nivelCaos === 1) {
        // Gera os 3 primeiros pop-ups invasivos
        for(let i=0; i<3; i++) setTimeout(spawnFakePopup, i * 100);
        noise.style.opacity = "0.2";
    } 
    else if (nivelCaos === 2) {
        // Tela pisca e surgem mais popups por todos os lados
        body.classList.add('flashing-bg');
        for(let i=0; i<6; i++) setTimeout(spawnFakePopup, i * 80);
        somHacker(150, 'square', 0.4);
    } 
    else if (nivelCaos === 3) {
        // Treme tudo pesadamente e faz surgir a imagem no centro
        body.classList.add('glitch-heavy');
        shatterZone.classList.remove('hidden');
        for(let i=0; i<10; i++) setTimeout(spawnFakePopup, i * 50);
        somHacker(90, 'sawtooth', 0.6);
    } 
    else if (nivelCaos === 4) {
        // EXPLOSÃO TOTAL E TRANSIÇÃO IMEDIATA
        destruirTudoERevelarVitoria();
    }
}

function destruirTudoERevelarVitoria() {
    const arena = document.getElementById('desktop-arena');
    const zone = document.getElementById('shatter-zone');
    const btn = document.getElementById('chaos-trigger');
    
    // Remove botão e os popups gerados do HTML
    btn.style.display = 'none';
    document.querySelectorAll('.fake-popup').forEach(el => el.remove());
    
    // Desliga efeitos de loop incômodos do fundo
    document.body.className = '';
    document.getElementById('target-img').style.display = 'none';

    // Som de explosão sintetizado pesado
    somHacker(60, 'sawtooth', 1.8);
    somHacker(100, 'square', 1.2);

    // Fatiamento Dinâmico em 64 estilhaços com gravidade queda livre
    const colunas = 8; const linhas = 8;
    const pLargura = 380 / colunas; const pAltura = 380 / linhas;

    for (let r = 0; r < linhas; r++) {
        for (let c = 0; c < colunas; c++) {
            const piece = document.createElement('div');
            piece.className = 'shatter-piece';
            piece.style.width = `${pLargura}px`;
            piece.style.height = `${pAltura}px`;
            
            // Posicionamento grid original
            const deLongeLeft = c * pLargura;
            const deLongeTop = r * pAltura;
            piece.style.left = `${deLongeLeft}px`;
            piece.style.top = `${deLongeTop}px`;
            piece.style.backgroundPosition = `-${deLongeLeft}px -${deLongeTop}px`;

            zone.appendChild(piece);

            // Animação de derretimento físico/queda
            setTimeout(() => {
                const fatiarX = (Math.random() - 0.5) * 400;
                const fatiarY = Math.random() * 500 + 300; // Força para despencar
                const rotacionar = (Math.random() - 0.5) * 540;

                piece.style.transform = `translate3d(${fatiarX}px, ${fatiarY}px, 200px) rotate(${rotacionar}deg)`;
                piece.style.opacity = '0';
            }, 30);
        }
    }

    // Exibe a tela de vitória limpa com neon no centro após a poeira baixar
    setTimeout(() => {
        zone.style.display = 'none';
        document.getElementById('victory-screen').classList.remove('hidden');
    }, 900);
}
