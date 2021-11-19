export function HTMLActuator() {
  this.tileContainer = document.querySelector('.tile-container');
  this.scoreContainer = document.querySelector('.score-container');
  this.bestContainer = document.querySelector('.best-container');
  this.messageContainer = document.querySelector('.game-message');
  this.info = document.querySelector('.info');
  this.dogeSays = document.querySelector('.doge-says');

  this.score = 0;
}

const dogeSayings = [
  'such good',
  'so amaze',
  'many points',
  'very unstoppable',
  'great jorb',
  'such playing',
  'very good',
  'points',
  'very gaming',
  'such player',
  'concern',
  'bewildered',
  'many game',
  'so good',
  'very scores',
  'so scoring',
  'so hot right now',
  'such playing',
  'such matching',
  'so matched',
  'very matched',
  'very neat',
  'such natural',
];

HTMLActuator.prototype.actuate = function (grid, metadata) {
  const self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }
  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continue = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  const self = this;

  const wrapper = document.createElement('div');
  const inner = document.createElement('div');
  const position = tile.previousPosition || { x: tile.x, y: tile.y };
  const positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  const classes = ['tile', 'tile-' + tile.value, positionClass];

  if (tile.value > 2048) {
    classes.push('tile-super');
  }

  this.applyClasses(wrapper, classes);

  inner.classList.add('tile-inner');
  inner.textContent = tile.value;

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push('tile-merged');
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push('tile-new');
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute('class', classes.join(' '));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  const pos = this.normalizePosition(position);
  return 'tile-position-' + pos.x + '-' + pos.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);
  this.clearContainer(this.dogeSays);

  const difference = score - this.score;
  this.score = score;

  // Dispatch the event.
  document.dispatchEvent(
    new CustomEvent('score', {
      detail: { score },
    })
  );

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    const addition = document.createElement('div');
    addition.classList.add('score-addition');
    addition.textContent = '+' + difference;
    this.scoreContainer.appendChild(addition);

    const message = dogeSayings[Math.floor(Math.random() * dogeSayings.length)];
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    const left = 'left:' + Math.round(Math.random() * 80) + '%;';
    const top = 'top:' + Math.round(Math.random() * 80) + '%;';
    const color =
      'color: rgb(' +
      Math.round(Math.random() * 255) +
      ', ' +
      Math.round(Math.random() * 255) +
      ', ' +
      Math.round(Math.random() * 255) +
      ');';
    const styleString = left + top + color;
    messageElement.setAttribute('style', styleString);
    this.dogeSays.appendChild(messageElement);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  const type = won ? 'game-won' : 'game-over';
  const message = won ? 'You win!' : 'Game over!';

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName('p')[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove('game-won');
  this.messageContainer.classList.remove('game-over');
};

HTMLActuator.prototype.showInfo = function () {
  if (this.info.getAttribute('style') === 'display:block;') {
    this.info.setAttribute('style', 'display:none;');
    document.querySelector('.show-info').innerHTML = 'INFO';
  } else {
    this.info.setAttribute('style', 'display:block;');
    document.querySelector('.show-info').innerHTML = 'CLOSE';
  }
};

HTMLActuator.prototype.hideInfo = function () {
  this.info.setAttribute('style', 'display:none;');
};
