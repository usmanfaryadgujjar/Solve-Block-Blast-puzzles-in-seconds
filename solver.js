const gridSize = 10;
let gridData = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
const blocks = [];

// Build Main Grid
const grid = document.getElementById('grid');
for (let r = 0; r < gridSize; r++) {
  for (let c = 0; c < gridSize; c++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.row = r;
    cell.dataset.col = c;
    cell.onclick = () => toggleCell(r, c, cell);
    grid.appendChild(cell);
  }
}

function toggleCell(r, c, cell) {
  gridData[r][c] ^= 1;
  cell.classList.toggle('filled');
}

// Add a visual block
function addBlock() {
  const container = document.getElementById('blocks-container');
  const blockIndex = blocks.length;
  const blockGrid = Array.from({ length: 5 }, () => Array(5).fill(0));

  const miniGrid = document.createElement('div');
  miniGrid.className = 'mini-grid';

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const miniCell = document.createElement('div');
      miniCell.className = 'mini-cell';
      miniCell.dataset.row = r;
      miniCell.dataset.col = c;
      miniCell.onclick = () => {
        blockGrid[r][c] ^= 1;
        miniCell.classList.toggle('filled');
      };
      miniGrid.appendChild(miniCell);
    }
  }

  blocks.push(blockGrid);
  container.appendChild(miniGrid);
}

// Trim the block (remove empty rows/cols)
function trimBlock(block) {
  let top = 5, bottom = 0, left = 5, right = 0;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (block[r][c] === 1) {
        top = Math.min(top, r);
        bottom = Math.max(bottom, r);
        left = Math.min(left, c);
        right = Math.max(right, c);
      }
    }
  }
  const trimmed = [];
  for (let r = top; r <= bottom; r++) {
    trimmed.push(block[r].slice(left, right + 1));
  }
  return trimmed;
}

// Can block fit in position
function canPlaceBlock(grid, block, r, c) {
  for (let i = 0; i < block.length; i++) {
    for (let j = 0; j < block[0].length; j++) {
      if (block[i][j] === 1 && grid[r + i][c + j] !== 0) return false;
    }
  }
  return true;
}

// Place block in grid (copy)
function placeBlock(grid, block, r, c) {
  const newGrid = grid.map(row => [...row]);
  for (let i = 0; i < block.length; i++) {
    for (let j = 0; j < block[0].length; j++) {
      if (block[i][j] === 1) newGrid[r + i][c + j] = 1;
    }
  }
  return newGrid;
}

// Apply solving logic
function solve() {
  const trimmedBlocks = blocks.map(trimBlock);
  let result = "";

  trimmedBlocks.forEach((block, idx) => {
    let placed = false;
    for (let i = 0; i <= gridSize - block.length && !placed; i++) {
      for (let j = 0; j <= gridSize - block[0].length; j++) {
        if (canPlaceBlock(gridData, block, i, j)) {
          gridData = placeBlock(gridData, block, i, j);
          result += `✅ Block ${idx + 1} placed at (${i}, ${j})\n`;
          placed = true;
          break;
        }
      }
    }
    if (!placed) result += `❌ Block ${idx + 1} could NOT be placed\n`;
  });

  updateGridUI();
  document.getElementById('output').innerText = result;
}

// Update grid UI
function updateGridUI() {
  document.querySelectorAll('.cell').forEach(cell => {
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    cell.classList.toggle('filled', gridData[r][c] === 1);
  });
}

// Clear all
function clearAll() {
  gridData = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  updateGridUI();

  blocks.length = 0;
  document.getElementById('blocks-container').innerHTML = "";
  document.getElementById('output').innerText = "";
}
