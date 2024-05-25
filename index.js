const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const offset = {
  x: -736,
  y: -640,
};

const collisionsmap = [];
for (let i = 0; i < collisions.length; i = i + 70) {
  collisionsmap.push(collisions.slice(i, i + 70));
}

const collBoundaries = [];
collisionsmap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol == 1025) {
      collBoundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

const battlezonemap = [];
for (let i = 0; i < battlezones.length; i = i + 70) {
  battlezonemap.push(battlezones.slice(i, i + 70));
}

const bzBoundaries = [];
battlezonemap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol == 1025) {
      bzBoundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});
console.log(bzBoundaries);

//Images
const image = new Image();
image.src = "./images/Pellet Town.png";

const foregroundImage = new Image();
foregroundImage.src = "./images/foregroundobj.png";

const playerImageDown = new Image();
playerImageDown.src = "./images/playerDown.png";
const playerImageUp = new Image();
playerImageUp.src = "./images/playerUp.png";
const playerImageLeft = new Image();
playerImageLeft.src = "./images/playerLeft.png";
const playerImageRight = new Image();
playerImageRight.src = "./images/playerRight.png";

//Player Sprite
const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 8,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerImageDown,
  frames: {
    max: 4,
    hold: 10,
  },
  sprites: {
    up: playerImageUp,
    left: playerImageLeft,
    right: playerImageRight,
    down: playerImageDown,
  },
});

//Background Sprite
const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

//Foreground Sprite
const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    presssed: false,
  },
  d: {
    pressed: false,
  },
};
const movables = [background, ...collBoundaries, foreground, ...bzBoundaries];
const rectangularCollision = ({ rectangle1, rectangle2 }) => {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
};

const battle = {
  intiated: false,
};

const animate = () => {
  const animationId = window.requestAnimationFrame(animate);
  background.draw();
  player.draw();
  foreground.draw();
  let moving = true;
  player.animate = false;
  if (battle.intiated) return;

  //Activate a Battle
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < bzBoundaries.length; i++) {
      const battlezone = bzBoundaries[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battlezone.position.x + battlezone.width
        ) -
          Math.max(player.position.x, battlezone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battlezone.position.y + battlezone.height
        ) -
          Math.max(player.position.y, battlezone.position.y));
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battlezone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.01
      ) {
        //deactivate current animation loop
        window.cancelAnimationFrame(animationId);
        audio.Map.stop()
        audio.InitBattle.play()
        audio.Battle.play()
        battle.intiated = true;
        gsap.to("#overlappingDiv", {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to("#overlappingDiv", {
              opacity: 1,
              duration: 0.4,
              onComplete() {
                initBattle()
                animateBattle();
                gsap.to("#overlappingDiv", {
                  opacity: 0,
                  duration: 0.4,
                });
              },
            });
          },
        });
        break;
      }
    }
  }
  if (keys.w.pressed && lastKey === "w") {
    player.animate = true;
    player.image = player.sprites.up;
    for (let i = 0; i < collBoundaries.length; i++) {
      const boundary = collBoundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving) {
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
    }
  } else if (keys.a.pressed && lastKey === "a") {
    player.animate = true;
    player.image = player.sprites.left;
    for (let i = 0; i < collBoundaries.length; i++) {
      const boundary = collBoundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
    }
  } else if (keys.s.pressed && lastKey === "s") {
    player.animate = true;
    player.image = player.sprites.down;
    for (let i = 0; i < collBoundaries.length; i++) {
      const boundary = collBoundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
    }
  } else if (keys.d.pressed && lastKey === "d") {
    player.animate = true;
    player.image = player.sprites.right;
    for (let i = 0; i < collBoundaries.length; i++) {
      const boundary = collBoundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
    }
  }
};
// animate();


let lastKey = "";
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
    case "a":
      keys.a.pressed = false;
    case "s":
      keys.s.pressed = false;
    case "d":
      keys.d.pressed = false;
  }
});

let clicked = false;
addEventListener('click', () => {
  if(!clicked){
    audio.Map.play()
    clicked=true;
  }
})