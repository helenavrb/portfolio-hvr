// efeito typewrite

const title = document.querySelector('#title h1');
const name = "HELENA VIDAL";

title.innerText = '';
let i = 0

function type() {
  if (i < name.length) {
    title.innerText += name.charAt(i);
    i++,
    setTimeout (type, 150);
  }
  else {
    setTimeout (() => {
      title.innerText = '';
      i = 0;
      type ();
    }, 2000);
  }
}

type();

// efeito parágrafo

const paragraphs = document.querySelectorAll('#title p');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 200);
        } else {
            entry.target.classList.remove('visible');
        }
    });
}, { threshold: 0.1 });

paragraphs.forEach(p => observer.observe(p));

// atividade git

const USERNAME = 'helenavrb';

fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`)
    .then(r => r.json())
    .then(data => {
        const contributions = data.contributions;
        const total = data.total.lastYear;

        const ghTotal = document.getElementById('gh-total');
        ghTotal.dataset.pt = `${total} CONTRIBUIÇÕES NO ÚLTIMO ANO`;
        ghTotal.dataset.en = `${total} CONTRIBUTIONS IN THE LAST YEAR`;
        ghTotal.textContent = ghTotal.dataset.pt;

        const graph = document.getElementById('gh-graph');
        graph.style.cssText = 'display:grid; grid-template-columns: repeat(53, 1fr); gap: 2px; margin-top: 6px;';

        contributions.forEach(day => {
            const cell = document.createElement('div');
            cell.style.cssText = `aspect-ratio:1; border-radius:2px; background:${getColor(day.level)};`;
            cell.title = `${day.date}: ${day.count} contribuições`;
            graph.appendChild(cell);
        });
    });

function getColor(level) {
    return ['#1a1a1a', '#0a3a5c', '#0a5a8c', '#0077cc', '#0099ff'][level];
}

// tradução

function applyLang(lang) {
    document.querySelectorAll('[data-pt]').forEach(el => {
        el.textContent = el.dataset[lang];
    });
    document.documentElement.lang = lang === 'pt' ? 'pt-br' : 'en';
}

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyLang(btn.dataset.lang);
    });
});

// arte generativa

const canvas = document.getElementById('bg-sphere');
const ctx = canvas.getContext('2d');
const SIZE = 900;
canvas.width = SIZE;
canvas.height = SIZE;

const RADIUS = 350;
const POINT_COUNT = 1500;
const points = [];

for (let i = 0; i < POINT_COUNT; i++) {
    const phi = Math.acos(-1 + (2 * i) / POINT_COUNT);
    const theta = Math.sqrt(POINT_COUNT * Math.PI) * phi;
    points.push({
        x: Math.cos(theta) * Math.sin(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(phi)
    });
}

let angleX = 0;
let angleY = 0;
let targetX = 0;
let targetY = 0;
let velX = 0.001;
let velY = 0.002;

window.addEventListener('mousemove', (e) => {
    targetX = (e.clientY / window.innerHeight - 0.5) * 0.3;
    targetY = (e.clientX / window.innerWidth  - 0.5) * 0.3;
});

window.addEventListener('scroll', () => {
    targetX = window.scrollY * 0.0008;
});

function draw() {
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = '#0099ff';

    angleX += (targetX - angleX) * 0.03 + velX;
    angleY += (targetY - angleY) * 0.03 + velY;

    const projected = points.map(p => {
        let x1 = p.x * Math.cos(angleY) - p.z * Math.sin(angleY);
        let z1 = p.x * Math.sin(angleY) + p.z * Math.cos(angleY);
        let y1 = p.y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = p.y * Math.sin(angleX) + z1 * Math.cos(angleX);

        const perspective = 1000 / (1000 + z2 * RADIUS);
        return {
            px: x1 * RADIUS * perspective + SIZE / 2,
            py: y1 * RADIUS * perspective + SIZE / 2,
            z2,
            perspective
        };
    });

    projected.sort((a, b) => a.z2 - b.z2);

    projected.forEach(({ px, py, z2, perspective }) => {
        const alpha = (z2 + 1) / 2;
        ctx.globalAlpha = alpha * 0.6;
        ctx.beginPath();
        ctx.arc(px, py, 1.5 * perspective, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(draw);
}

draw();