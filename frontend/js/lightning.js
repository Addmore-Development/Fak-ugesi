// Lightning effect with 7 bolts and 7 rainbow colors
const colors = ['#ff0080', '#ff6600', '#C8FF00', '#00ffff', '#0099ff', '#9933ff', '#ff0080'];
const positions = [
    { left: '20%', top: '30%', rotate: '-15deg' },
    { left: '45%', top: '20%', rotate: '5deg' },
    { left: '70%', top: '40%', rotate: '25deg' },
    { left: '15%', top: '60%', rotate: '-25deg' },
    { left: '55%', top: '70%', rotate: '10deg' },
    { left: '85%', top: '55%', rotate: '-5deg' },
    { left: '35%', top: '45%', rotate: '15deg' }
];

function createLightningBolt(index) {
    const bolt = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    bolt.setAttribute('viewBox', '0 0 100 180');
    bolt.setAttribute('class', 'lightning-bolt');
    bolt.style.position = 'absolute';
    bolt.style.left = positions[index].left;
    bolt.style.top = positions[index].top;
    bolt.style.width = '80px';
    bolt.style.height = 'auto';
    bolt.style.transform = `translate(-50%, -50%) rotate(${positions[index].rotate})`;
    bolt.style.filter = `drop-shadow(0 0 8px ${colors[index]})`;
    bolt.style.opacity = '0';
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M60 5L10 90H50L40 175L90 80H55L60 5Z');
    path.setAttribute('fill', colors[index]);
    path.setAttribute('stroke', '#fff');
    path.setAttribute('stroke-width', '1.5');
    bolt.appendChild(path);
    
    return bolt;
}

function triggerLightning() {
    const container = document.getElementById('lightningContainer');
    const thunderFlash = document.getElementById('thunderFlash');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < 7; i++) {
        const bolt = createLightningBolt(i);
        container.appendChild(bolt);
        bolt.style.animation = `lightningStrike ${0.6 + i * 0.05}s ease-out forwards`;
        bolt.style.animationDelay = `${i * 0.08}s`;
    }
    
    if (thunderFlash) {
        thunderFlash.style.animation = 'thunderFlash 1.2s ease-out forwards';
    }
    
    const rainbowSpray = document.createElement('div');
    rainbowSpray.style.position = 'absolute';
    rainbowSpray.style.inset = '0';
    rainbowSpray.style.background = 'radial-gradient(circle at 50% 50%, #ff0080, #ff6600, #C8FF00, #00ffff, #0099ff, #9933ff)';
    rainbowSpray.style.mixBlendMode = 'screen';
    rainbowSpray.style.opacity = '0';
    rainbowSpray.style.pointerEvents = 'none';
    rainbowSpray.style.animation = 'thunderFlash 0.8s ease-out forwards';
    container.appendChild(rainbowSpray);
    
    setTimeout(() => {
        if (thunderFlash) thunderFlash.style.animation = '';
        if (rainbowSpray) rainbowSpray.remove();
    }, 1300);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes lightningStrike {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        10% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        30% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
        70% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
    }
    
    @keyframes thunderFlash {
        0% { opacity: 0; }
        5% { opacity: 0.95; }
        25% { opacity: 0.5; }
        60% { opacity: 0.2; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize lightning effect
setTimeout(triggerLightning, 300);
setInterval(triggerLightning, 12000);