const grid = document.getElementById('activity-grid');
for (let i = 0; i < 70; i++) {
  const cell = document.createElement('div');
  const intensity = Math.random();
  cell.className = 'activity-cell';
  cell.style.opacity = intensity < 0.4 ? '0.1' : intensity < 0.7 ? '0.4' : '1';
  grid.appendChild(cell);
}