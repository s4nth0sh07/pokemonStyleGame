//BattleBackground Sprite
const battelbackgroundImage = new Image();
battelbackgroundImage.src = "./images/battleBackground.png";

const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battelbackgroundImage,
});

let draggle;
let emby;
let renderedSprites;
let queue;
let battleAnimationId;

function initBattle() {
  document.querySelector("#userInterface").style.display = "block";
  document.querySelector(".dialoguebox").style.display = "none";
  document.querySelector("#enemyhealthbar").style.width = "100%";
  document.querySelector("#playerhealthbar").style.width = "100%";
  document.querySelector("#attackBox").replaceChildren();

  draggle = new Monster(monsters.Draggle);
  emby = new Monster(monsters.Emby);
  renderedSprites = [draggle, emby];
  queue = [];

  emby.attacks.forEach((atck) => {
    const button = document.createElement("button");
    button.innerHTML = atck.name;
    document.querySelector("#attackBox").append(button);
  });

  // Our Event Listeners for our buttons (attacks)
  document.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      emby.attack({
        attack: selectedAttack,
        recepient: draggle,
        renderedSprites,
      });

      if (draggle.health <= 0) {
        queue.push(() => {
          draggle.faint();
        });
        queue.push(() => {
          gsap.to("#overlappingDiv", {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId);
              animate();
              document.querySelector("#userInterface").style.display = "none";
              gsap.to("#overlappingDiv", {
                opacity: 0,
              });
              battle.intiated = false;
              audio.Map.play()
            },
          });
        });
      }
      const randomAttack =
        draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];
      queue.push(() => {
        draggle.attack({
          attack: randomAttack,
          recepient: emby,
          renderedSprites,
        });
        if (emby.health <= 0) {
          queue.push(() => {
            emby.faint();
          });
          queue.push(() => {
            gsap.to("#overlappingDiv", {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationId);
                animate();
                document.querySelector("#userInterface").style.display = "none";
                gsap.to("#overlappingDiv", {
                  opacity: 0,
                });
                battle.intiated = false;
                audio.Map.play()
              },
            });
          });
        }
      });
    });
    btn.addEventListener("mouseenter", (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      document.querySelector("#attacktype").innerHTML = selectedAttack.type;
      document.querySelector("#attacktype").style.color = selectedAttack.color;
    });
  });
}
function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();
  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}

animate()

document.querySelector(".dialoguebox").addEventListener("click", (e) => {
  console.log(queue.length)
  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  } else e.currentTarget.style.display = "none";
});
