import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";

const GameComponent = () => {
  const gameContainer = useRef(null);
  const app = useRef(null);
  const player = useRef(null); // useRef for player
  const npc = useRef(null); // useRef for npc
  const npcSpeed = 1;
  let npcDirection = 1; // 1 for right, -1 for left
  let nextDirectionChange = 0; // Time until next direction change
  let nextNpcShootTime = 0; // Time until NPC shoots next
  const playerSpeed = 1.5;
  let left = false;
  let right = false;
  const gleeks = [];
  const playerHealth = useRef(100); // Initial health for the player
  const npcHealth = useRef(100); 
  const [isGameRunning, setIsGameRunning] = useState(false); // State to track if the game is running
  const jumpStrength = -15; // Negative value for upward movement
  const gravity = 0.5; // Gravity pulls the sprite down
  let playerVy = 0; // Vertical velocity for player
  let npcVy = 0; // Vertical velocity for NPC  
  const playerHealthBar = useRef(null);
  const npcHealthBar = useRef(null);
  const [level, setLevel] = useState(1);
  const baseNpcShootFrequency = 0; //increase num for slower shoot time
  const [jumpCount, setJumpCount] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const lastShotTimeRef = useRef(0);
  // const shootCooldown = 200; // Cooldown time in milliseconds
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [showStartButton, setShowStartButton] = useState(true);
  const [displayLevel, setDisplayLevel] = useState('');
  const [spacebarActive, setSpacebarActive] = useState(true);
  const MAX_LEVEL = 11;
  const maxHealthByLevel = {
    player: [100,100,100,100,100,100,100,100,100,100,100], // Example increments by level for player
    npc: [100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300] // Example increments by level for NPC
  };

  function getMaxHealth(type, level) {
    return maxHealthByLevel[type][level - 1]; // Adjust index for 0-based array
  }

  // Function to start the game
  const startGame = () => {
    setIsGameRunning(true);
    setLevel(1);
    setIsGameOver(false);
    setIsGameWon(false);
    setScore(0);
    setShowStartButton(false);
    setDisplayLevel(`Level: ${level}`);

    // Reset Player Position and Health
    if (player.current) {
      player.current.x = 100;
      player.current.y = app.current.screen.height - 60;
      playerHealth.current = 100;
    }

    // Reset NPC Position and Health
    if (npc.current) {
      npc.current.x = app.current.screen.width - 150;
      npc.current.y = app.current.screen.height - 60;
      npcHealth.current = 100;
    }

    // Clear gleeks
    gleeks.forEach(gleek => app.current.stage.removeChild(gleek));
    gleeks.splice(0, gleeks.length);

    // Update Health Display
    // updateHealthBars();
  };

  // Function to handle game finish logic
  const finishGame = () => {
    if (npcHealth.current <= 0) {
      nextLevel(); // Go to the next level if NPC is defeated
    } else {
      endGame(false);
    }
  };

  function nextLevel() {
    setLevel(prevLevel => {
      const newLevel = prevLevel === 11 ? prevLevel : prevLevel + 1;
      setDisplayLevel(`Level: ${newLevel}`);

      npcHealth.current = getMaxHealth('npc', newLevel);

      // Call updateHealthBars() after setting level and health
      updateHealthBars();

      if (prevLevel === 11) {
        endGame(true);
        return prevLevel;
      } else {
        return prevLevel + 1; 
      }
    });

    // Additional logic for level progression
    if (player.current && npc.current) {
      player.current.x = 100;
      player.current.y = app.current.screen.height - 60;
      playerHealth.current = 100;
  
      npc.current.x = app.current.screen.width - 150;
      npc.current.y = app.current.screen.height - 60;
    }
      // Clear gleeks
      gleeks.forEach(gleek => app.current.stage.removeChild(gleek));
      gleeks.splice(0, gleeks.length);

      // Update Health Display and possibly other level-specific setups
      updateHealthBars();
  }

  function endGame(playerWon) {
    npcHealth.current = 100;
    updateHealthBars();
    setIsGameRunning(false);
    setDisplayLevel('');
    setSpacebarActive(false);

    if (playerWon) {
      setIsGameWon(true);
    } else {
      setIsGameOver(true);
    }
    setShowStartButton(true);
    setLevel(1);
  }

  const InstructionsModal = () => {
    return (
      <div className={`instructions-modal ${showInstructions ? 'show' : ''}`}>
        <h2>HOW TO PLAY</h2>
        <p>MOVEMENT<br/>LEFT: A / ←<br/>RIGHT: D / →<br/>JUMP: W / SPACEBAR / ↑<br/>LEFT CLICK TO GLEEK 💦</p>
        <p>DROWN THE OPPONENT WITH YOUR GLEEK</p>
        <button onClick={() => setShowInstructions(false)}>Close</button>
      </div>
    );
  };  
  

  useEffect(() => {
    app.current = new PIXI.Application({
      width: 1200,
      height: 600,
      backgroundColor: 0x000f1a,
    });

    // Load the background image
    const background = new PIXI.Sprite(PIXI.Texture.from('./images/game/game_bg_dark.png'));
    background.width = app.current.screen.width;
    background.height = app.current.screen.height;
    app.current.stage.addChild(background);

    if (gameContainer.current && app.current) {
      gameContainer.current.appendChild(
        app.current.view
      );

      // Initialize and setup the player sprite
      player.current = new PIXI.Sprite(
        PIXI.Texture.from('./images/game/soyjak.png')
      );
      player.current.width = 150;
      player.current.height = 150;
      player.current.x = -10;
      player.current.y = app.current.screen.height - 130; // Ensure app.current is not undefined
      app.current.stage.addChild(player.current);

      // Initialize and setup the NPC sprite
      npc.current = new PIXI.Sprite(
        PIXI.Texture.from('./images/game/wif.png')
      );
      npc.current.width = 150;
      npc.current.height = 150;
      npc.current.x = app.current.screen.width - 180; // Ensure app.current is not undefined
      npc.current.y = app.current.screen.height - 130; // Ensure app.current is not undefined
      app.current.stage.addChild(npc.current);

      // Initialize Health Bars for Player/PC
      playerHealthBar.current = new PIXI.Graphics();
      npcHealthBar.current = new PIXI.Graphics();
      app.current.stage.addChild(playerHealthBar.current);
      app.current.stage.addChild(npcHealthBar.current);
      updateHealthBars();
    }


    // Keydown event
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const gameView = gameContainer.current;
    const onMouseDown = (e) => {
      // Ensure the game is running and the click is within the game area
      if (isGameRunning && e.button === 0) { // 0 is the button value for left click
        const currentTime = Date.now();
        const timeSinceLastShot = currentTime - lastShotTimeRef.current;
  
        // if (timeSinceLastShot >= shootCooldown) {
          shoot(player.current.x, player.current.y, 10, 0); // Player shooting velocity
          lastShotTimeRef.current = currentTime; // Update the last shot time
        // }
      }
    };

    if (gameView) {
      gameView.addEventListener('mousedown', onMouseDown);
    }

    // Game logic
    app.current.ticker.add((delta) => {
      if (isGameRunning) {

      // Player movement
      if (left) player.current.x -= playerSpeed;
      if (right) player.current.x += playerSpeed;

      // Keep player within bounds
      if (player.current.x < 0) {
        player.current.x = 0;
      } else if (player.current.x > app.current.screen.width - player.current.width) {
        player.current.x = app.current.screen.width - player.current.width;
      }

      // Update NPC position
      npc.current.x += npcSpeed * npcDirection;

      // Keep NPC within bounds
      if (npc.current.x > app.current.screen.width - npc.current.width || npc.current.x < 0) {
        npcDirection *= -1; // Change direction if at edge
      }

      // Randomize NPC movement
      nextDirectionChange -= delta;
      if (nextDirectionChange <= 0) {
        npcDirection *= -1; // Change direction randomly
        nextDirectionChange = Math.random() * 100 + 50; // Random time for next direction change
      }

      // Randomize NPC shooting
      nextNpcShootTime -= delta;
      if (nextNpcShootTime <= 0) {
        npcShoot(npc.current.x, npc.current.y, -8, 0); // NPC shoots leftward
        let frequencyReduction = 1000 * (level - 1); // Increase frequency each level
        nextNpcShootTime = Math.random() + Math.max(baseNpcShootFrequency - frequencyReduction, 50); // Ensure it doesn't go below a minimum threshold
      }
      
      // Update gleeks
      gleeks.forEach((gleek, i) => {
        gleek.x += gleek.vx;
        gleek.y += gleek.vy;

        // Check for collisions
        if (checkCollision(gleeks[i], npc.current)) {
          // NPC hit
          setScore(prevScore => prevScore + 10);
          npcHealth.current -= 10; // Decrease NPC health
          updateHealthBars(); // Update health display
          if (npcHealth.current <= 0) {
            finishGame();
          }
          app.current.stage.removeChild(gleek);
          gleeks.splice(i, 1);
        } else if (checkCollision(gleeks[i], player.current)) {
          // Decrease score by 10 when the player is hit
          setScore(prevScore => prevScore - 10); 
          // Player hit, Reduce player health and handle gleek
          playerHealth.current -= 10; // Decrease player health
          updateHealthBars(); // Update health display
          app.current.stage.removeChild(gleek);
          gleeks.splice(i, 1);
        }

        // Check for player losing game game over
        if (playerHealth.current <= 0) {
          finishGame();
        }

        // Remove gleeks if they go off-screen
        if (
          gleek.x > app.current.screen.width ||
          gleek.x < 0 ||
          gleek.y > app.current.screen.height ||
          gleek.y < 0
        ) {
          app.current.stage.removeChild(gleek);
          gleeks.splice(i, 1);
        }
      });

      // Apply gravity
      playerVy += gravity;
      npcVy += gravity;

      // Update player's vertical position
      player.current.y += playerVy;

      // Enforce maximum jump height for player
      const maxPlayerHeight = app.current.screen.height - 1100; // Adjust this value as needed
      if (player.current.y < maxPlayerHeight) {
        player.current.y = maxPlayerHeight;
        playerVy = 0; // Optionally reset vertical velocity if you don't want the player to 'stick' to the max height
      }
    
      // Update NPC's vertical position
      npc.current.y += npcVy;

      // Ground collision for player
      if (player.current.y > app.current.screen.height - 130) {
        player.current.y = app.current.screen.height - 130;
        if (playerVy > 0) {
          playerVy = 0;
        }
        setJumpCount(0);
      }

      // Ground collision for NPC
      if (npc.current.y > app.current.screen.height - 130) {
        npc.current.y = app.current.screen.height - 130;
        npcVy = 0;
      }
      
      // Random NPC jump
      if (Math.random() < (0.002 * level) && npc.current.y >= app.current.screen.height - 130) {
        npcVy = jumpStrength;
      }
    }
  });

  return () => {
    if (gameView) {
      gameView.removeEventListener('mousedown', onMouseDown);
    }
    if (app.current) {
      app.current.destroy(true, true);
    }
    window.removeEventListener("keydown",onKeyDown);
    window.removeEventListener("keyup",onKeyUp);
    };
  }, [isGameRunning, level]);

  //Updating npc data per level
  useEffect(() => {
    if (npc.current) {
      switch (level) {
        case 2:
          npc.current.texture = PIXI.Texture.from('./images/game/anita.png');
          npcHealth.current = getMaxHealth('npc', 2);
          break;
        case 3:
          npc.current.texture = PIXI.Texture.from('./images/game/honda.png');
          npcHealth.current = getMaxHealth('npc', 3);
          break;
        case 4:
          npc.current.texture = PIXI.Texture.from('./images/game/smolanoo.png');
          npcHealth.current = getMaxHealth('npc', 4);
          break;
        case 5:
          npc.current.texture = PIXI.Texture.from('./images/game/bonk.png');
          npcHealth.current = getMaxHealth('npc', 5);
          break;
        case 6:
          npc.current.texture = PIXI.Texture.from('./images/game/doge.png');
          npcHealth.current = getMaxHealth('npc', 6);
          break;
        case 7:
          npc.current.texture = PIXI.Texture.from('./images/game/harambe.png');
          npcHealth.current = getMaxHealth('npc', 7);
          break;
        case 8:
          npc.current.texture = PIXI.Texture.from('./images/game/pepe.png');
          npcHealth.current = getMaxHealth('npc', 8);
          break;
        case 9:
          npc.current.texture = PIXI.Texture.from('./images/game/r28.png');
          npcHealth.current = getMaxHealth('npc', 9);
          break;
        case 10:
          npc.current.texture = PIXI.Texture.from('./images/game/wab_gleek.png');
          npcHealth.current = getMaxHealth('npc', 10);
          break;
        case 11:
            npc.current.texture = PIXI.Texture.from('./images/game/ansem.png');
            npcHealth.current = getMaxHealth('npc', 11);
            break;       
        default:
          npc.current.texture = PIXI.Texture.from('./images/game/wif.png');
          npcHealth.current = getMaxHealth('npc', 1);
      }
    }
  }, [level]);

  useEffect(() => {
    const adjustInfoMessagePosition = () => {
      if (gameContainer.current) {
        const gameContainerHeight = gameContainer.current.offsetHeight;
        const infoMessage = document.querySelector('.info-message');
        if (infoMessage) {
          infoMessage.style.position = 'absolute';
          infoMessage.style.top = `${gameContainerHeight + 20}px`; // Adjust '20' to increase/decrease the gap
        }
      }
    };
        // Call the function initially and on window resize
        adjustInfoMessagePosition();
        window.addEventListener('resize', adjustInfoMessagePosition);
    
        // Cleanup function to remove the event listener
        return () => {
          window.removeEventListener('resize', adjustInfoMessagePosition);
        };
      }, []);
  
  //gleek gleek
  function shoot(x, y, vx, vy) {
    const texture = PIXI.Texture.from('./images/logos/gleek.png');
    const gleek = new PIXI.Sprite(texture);
    gleek.width = 40; // Set gleek size
    gleek.height = 40;
    gleek.position.set(x + player.current.width - 45,y + 65); // Position gleek at the edge of the player sprite
    gleek.vx = vx;
    gleek.vy = vy;
    gleek.justCreated = true;
    app.current.stage.addChild(gleek);
    gleeks.push(gleek);
    setTimeout(() => { gleek.justCreated = false; }, 150);
  }

  // NPC shooting function
  function npcShoot(x, y, vx, vy) {
    const texture = PIXI.Texture.from('./images/logos/gleek.png');
    const gleek = new PIXI.Sprite(texture);
    gleek.width = 40; // Set gleek size
    gleek.height = 40;
    gleek.position.set(x + 45, y + 65); // Position gleek at the NPC's location
    gleek.vx = vx;
    gleek.vy = vy;
    gleek.justCreated = true;
    app.current.stage.addChild(gleek);
    gleeks.push(gleek);
    setTimeout(() => { gleek.justCreated = false; }, 150);
  }

  // Collision Detection
  function checkCollision(spriteA, spriteB) {
    if (spriteA.justCreated) return false;
    const boundsA = spriteA.getBounds();
    const boundsB = spriteB.getBounds();
    return (
      boundsA.x < boundsB.x + boundsB.width &&
      boundsA.x + boundsA.width > boundsB.x &&
      boundsA.y < boundsB.y + boundsB.height &&
      boundsA.y + boundsA.height > boundsB.y
    );
  }

function updateHealthBars() {
  const playerMaxHealth = getMaxHealth('player', level);
  const npcMaxHealth = getMaxHealth('npc', level);

  const playerHealthWidth = (playerHealth.current / getMaxHealth('player', level)) * 100; // Adjust the full width accordingly
  const npcHealthWidth = (npcHealth.current / npcMaxHealth) * 100; // Adjust the full width accordingly

  playerHealthBar.current.clear();
  playerHealthBar.current.beginFill(0x2d9bbd);
  playerHealthBar.current.drawRect(10, 5, playerHealthWidth, 15); // Adjust positioning and size as needed
  playerHealthBar.current.endFill();

  npcHealthBar.current.clear();
  npcHealthBar.current.beginFill(0xac3838);
  npcHealthBar.current.drawRect(app.current.screen.width - npcHealthWidth - 10, 5, npcHealthWidth, 15); // Adjust positioning and size as needed
  npcHealthBar.current.endFill();
}
  

  // Keydown handler
  function onKeyDown(e) {
    if (e.key === "ArrowLeft" || e.key === "a") {
      e.preventDefault();
      left = true;
    } 
    if (e.key === "ArrowRight" || e.key === "d") {
      e.preventDefault();
      right = true;
    } 
    // if (e.key === " " && isGameRunning) {
    //   e.preventDefault();
    //   const currentTime = Date.now();
    //   const timeSinceLastShot = currentTime - lastShotTimeRef.current;
  
    //   if (timeSinceLastShot >= shootCooldown) {
    //     shoot(player.current.x, player.current.y, 6, 0); // Player shooting velocity
    //     lastShotTimeRef.current = currentTime; // Update the last shot time
    //   }
    // }
    if ((e.key === "w" || e.key === "ArrowUp" || e.key === " ") && isGameRunning) {
      e.preventDefault();
      if (jumpCount < 2) {
        if (jumpCount === 0 || player.current.y < app.current.screen.height - 130) {
          playerVy += jumpStrength; // Add to the current velocity for a boost
          setJumpCount(jumpCount + 1);
        }
      }
    }
    // Toggle instructions modal with a specific key, e.g., 'i'
    if (e.key === 'i') {
      setShowInstructions(prev => !prev);
      e.preventDefault();
    }
  }

  // Keyup handler
  function onKeyUp(e) {
    if (e.key === 'ArrowLeft') left = false;
    if (e.key === 'ArrowRight') right = false;
    if (e.key === 'a') left = false;
    if (e.key === 'd') right = false;
  }

  return (
    <div>
      <div className="game-wrapper">
      <p className="info-message">Press 'i' for game instructions</p>
      <div className="game-top-level">
        {isGameOver && 
          <div className="game-over-message">
            ANON, READ HOW TO GLEEK <br/>AND TRY AGAIN!
          </div>}
        {isGameWon && 
          <div className="game-over-message">
          GLEEK MASTER, NICE DUB!
          </div>}
          {showStartButton && <button className="start-game-button" onClick={startGame}>Start Game</button>}
        {displayLevel && <div className="level-display">{displayLevel}</div>}
        <div ref={gameContainer} className="game"></div>
        {showInstructions && <InstructionsModal />}
        <div className="score-display">Score: {score}</div>
      </div>
    </div>
    </div>
  );
};

export default GameComponent;
