let playerRightGif, playerLeftGif; 
let cashierleftgif;
let playerDirection = 'right'; 

let playerX = 300;
let playerY = 30;
let playerSpeed = 3;
let playerSize = 65;

let mapimg;
let startimg;
let sandwichimg, chipsimg, ramenimg, onigiriimg, coffeeimg, dangoimg;

let shopItems = [];
let barriers = [];
let initialShopItems = []; 

let cartCount = 0;

let retroFont;  

let gameState = 'start';

function preload() {
  retroFont = loadFont('retrofont.ttf');
  
  playerRightGif = loadImage('walkright.gif');
  playerLeftGif = loadImage('walkleft.gif');
  cashierleftgif = loadImage('cashierleft.gif')

  mapimg = loadImage('mapimg.png');
  startimg = loadImage('startbg.png')
  sandwichimg = loadImage('sandwichimg.png');
  chipsimg = loadImage('chipsimg.png');
  ramenimg = loadImage('ramenimg.png');
  onigiriimg = loadImage('onigiriimg.png');
  coffeeimg = loadImage('coffeeimg.png');
  dangoimg = loadImage('dangoimg.png')
}

function setup() {
  createCanvas(500, 500);
  
  textFont(retroFont); 

//adding items & their descriptions
 initialShopItems = [
    { x: 180, y: 150, img: sandwichimg, name: 'Sandwich', description: 'With fresh cream and strawberries.' },
    { x: 50, y: 400, img: ramenimg, name: 'Ramen', description: 'Delicious pork broth with noodles.' },
    { x: 100, y: 70, img: chipsimg, name: 'Chips', description: 'A crunchy bag of potato chips.' },
    { x: 280, y: 250, img: onigiriimg, name: 'Onigiri', description: 'A rice ball wrapped in seaweed.' },
    { x: 10, y: 220, img: coffeeimg, name: 'Coffee', description: 'An sweet iced mocha latte.' },
    { x: 100, y: 280, img: dangoimg, name: 'Dango', description: 'A chewy sweet treat made of rice flour.' }
  ];
  
  resetGame(); 

//rectangles for barriers
  barriers.push({x: 70, y: 100, w: 20, h: 270});
  barriers.push({x: 150, y: 100, w: 20, h: 270});
  barriers.push({x: 230, y: 100, w: 20, h: 270});
  barriers.push({x: 340, y: 100, w: 150, h: 370});
  barriers.push({x: 10, y: 2, w: 250, h: 60});
  barriers.push({x: 0, y: 2, w: 10, h: 500});
  barriers.push({x: 330, y: 2, w: 200, h: 60});
}
  
  function displayStartScreen() {
  image(startimg, 0, 0, 500, 500);

  fill(0); 
  textSize(20);
  textAlign(CENTER);
  text('A 7/11 Simulator', width / 2, height / 2 - 40);

  textSize(10);
  text('Use the arrow keys to move around', width / 2, height / 2);
  text('food items to learn more.', width / 2, height / 2 + 20);
  text('Remember to check out and enjoy the day!', width / 2, height / 2 + 40);

  //start button
  fill(255);
  rect(width / 2 - 50, height / 2 + 60, 100, 40, 10); 

  fill(0);
  textSize(15);
  text('START', width / 2, height / 2 + 88); 
}

function endScreen() {
  image(startimg, 0, 0, 500, 500)
  
  fill(0);
  textSize(15);
  textAlign(CENTER, CENTER);
  text('Thank you for shopping!', width / 2, height / 2 - 40);
  
  textSize(15);
  text('You bought ' + cartCount + ' items.', width / 2, height / 2);
  
  textSize(15);
  text('Press R to restart', width / 2, height / 2 + 40);
}


function draw() {
  textStyle(NORMAL); // Ensure text style resets to normal each frame
  
  if (gameState === 'start') {
    displayStartScreen();
  } else if (gameState === 'game') {
    playGame();
  } else if (gameState === 'end') {
    endScreen();
  }
}
  
  if (gameState === 'start') {
    displayStartScreen(); 
  } else if (gameState === 'game') {
    playGame(); // Play the game
  } else if (gameState === 'end') {
    endScreen(); // Show the end screen
}

function playGame() {
  background(220);

  //map background
  image(mapimg, 0, 0, 500, 500);
  
  image(cashierleftgif, 300, 110, 200, 180);

  //transparent barriers
  noFill();
  noStroke();
  for (let barrier of barriers) {
    rect(barrier.x, barrier.y, barrier.w, barrier.h);
  }

  //player based on their direction
  if (playerDirection === 'right') {
    image(playerRightGif, playerX - playerSize / 2, playerY - playerSize / 2, playerSize, playerSize);
  } else if (playerDirection === 'left') {
    image(playerLeftGif, playerX - playerSize / 2, playerY - playerSize / 2, playerSize, playerSize);
  }

  //shop items
  for (let item of shopItems) {
    image(item.img, item.x, item.y, 40, 40);
  }

  // player & collision detection
  movePlayer();

  // Check if player is close enough to buy an item
  checkForPurchases();
  
  checkForCheckout();
  
   //cart counter rectangle
  fill(225)
  stroke(0)
  rect(5, 10, 100, 32, 10)
  
  //cart counter 
  fill(0);
  textAlign(LEFT);
  textSize(10);
  text(`Cart: ${cartCount}`, 25, 30);
  
}

function movePlayer() {
  if (keyIsDown(LEFT_ARROW) && playerX - playerSpeed - playerSize / 2 > 0 && !collides(playerX - playerSpeed, playerY)) {
    playerX -= playerSpeed;
    playerDirection = 'left';  // Change direction to left
  }
  if (keyIsDown(RIGHT_ARROW) && playerX + playerSpeed + playerSize / 2 < width && !collides(playerX + playerSpeed, playerY)) {
    playerX += playerSpeed;
    playerDirection = 'right';  // Change direction to right
  }
  if (keyIsDown(UP_ARROW) && playerY - playerSpeed - playerSize / 2 > 0 && !collides(playerX, playerY - playerSpeed)) {
    playerY -= playerSpeed;
  }
  if (keyIsDown(DOWN_ARROW) && playerY + playerSpeed + playerSize / 2 < height && !collides(playerX, playerY + playerSpeed)) {
    playerY += playerSpeed;
  }
}

// Helper function to check if the player's next position collides with any barrier
function collides(nextX, nextY) {
  for (let barrier of barriers) {
    if (nextX - playerSize / 5 < barrier.x + barrier.w && 
        nextX + playerSize / 5 > barrier.x &&
        nextY - playerSize / 5 < barrier.y + barrier.h &&
        nextY + playerSize / 5 > barrier.y) {
      return true; // Collision detected
    }
  }
  return false; // No collision
}

function checkForPurchases() {
  for (let item of shopItems) {
    let d = dist(playerX, playerY, item.x, item.y);
    
    if (d < playerSize / 2 + 20) {
      fill(255);
      stroke(0);
      strokeWeight(2);
      rect(50, 400, 400, 70, 10);
      
      textAlign(LEFT);

      // Display item name, description, and options
      fill(0);
      noStroke();
      textSize(10);
      text(`${item.name}: ${item.description}`, 60, 430);
      text('Add to Cart? 1 for Yes', 60, 450);

      // Handle input for adding to cart
      if (keyIsDown(49)) {  // 49 is keycode for '1'
        console.log(`Added ${item.name} to the cart`);
        cartCount++;  // Increase cart count
        shopItems.splice(shopItems.indexOf(item), 1); // Remove item from shop after purchase
      }
      if (keyIsDown(50)) {  // 50 is keycode for '2'
        console.log('Chose not to buy');
      }
    }
  }
}

function checkForCheckout() {
  let cashierX = 320;
  let cashierY = 160;
  
  let d = dist(playerX, playerY, cashierX, cashierY);
  if (d < 18) {
    
    fill(255);
    stroke(0);
    strokeWeight(2);
    rect(50, 400, 400, 70, 10);

    textAlign(LEFT);
    fill(0);
    noStroke();
    textSize(10);
    text('Would you like to checkout? 1 for Yes', 70, 430);

    // Handle input for checking out
    if (keyIsDown(49)) {  // 49 is keycode for '1'
      gameState = 'end';  // Change game state to end
    }
  }
}
      
function mousePressed() {
  if (gameState === 'start') {
    let buttonX = width / 2 - 50;
    let buttonY = height / 2 + 60;
    let buttonWidth = 100;
    let buttonHeight = 40;

    if (mouseX > buttonX && mouseX < buttonX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight) {
      gameState = 'game';
      }
    }
  }

function keyPressed() {
  if (gameState === 'end' && key === 'r') {
    gameState = 'start';
    cartCount = 0;
    playerX = 300;
    playerY = 30;
    playerDirection = 'right';
    resetGame();}
}
    
function resetGame() {
  shopItems = initialShopItems.map(item => ({ ...item })); 
  playerX = 300;
  playerY = 30;
  playerDirection = 'right';
  cartCount = 0;
}