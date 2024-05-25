//Sprite Class
class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
  }) {
    this.position = position;
    this.image = new Image();
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.image.src=image.src
    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
    this.rotation = rotation;
  }
  draw() {
    context.save();
    context.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    context.rotate(this.rotation);
    context.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );
    context.globalAlpha = this.opacity;
    context.drawImage(
      this.image,
      this.frames.val * this.width, //cropping
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max, //actual
      this.image.height
    );
    context.restore();
    if (!this.animate) return;
    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }
    if (this.frames.elapsed % this.frames.hold == 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}

class Monster extends Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    isEnemy = false,
    name,
    attacks,
  }) {
    super({ position, image, frames, sprites, animate, rotation });
    this.isEnemy = isEnemy;
    this.name = name;
    this.health = 100;
    this.attacks = attacks;
  }
  faint() {
    document.querySelector(".dialoguebox").innerHTML = this.name + ' fainted!'
    gsap.to(this.position, {
      y: this.position.y+20,
    })
    gsap.to(this, {
      opacity:0
    })
    audio.Victory.play()
    audio.Battle.stop()
  }
  attack({ attack, recepient, renderedSprites }) {
    document.querySelector(".dialoguebox").style.display = "block";
    document.querySelector(".dialoguebox").innerHTML =
      this.name + " used " + attack.name;

    let healthBar = "#enemyhealthbar";
    if (this.isEnemy) healthBar = "#playerhealthbar";

    let rotation = 1;
    if (this.isEnemy) rotation = -2.2;

    recepient.health -= attack.damage;

    switch (attack.name) {
      case "Tackle":
        const tl = gsap.timeline();

        let movementDistance = 20;
        if (this.isEnemy) movementDistance = -20;

        tl.to(this.position, {
          x: this.position.x - movementDistance,
        })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,

            onComplete: () => {
              //make sure oncomplete is arrow fncn since this.health refers to oncomplete if not
              //Enemy Gets Hit
              audio.TackleHit.play()
              gsap.to(healthBar, {
                width: recepient.health + "%",
              }),
                gsap.to(recepient.position, {
                  x: recepient.position.x + 10,
                  yoyo: true,
                  repeat: 5,
                  duration: 0.08,
                  opacity: 0,
                });
              gsap.to(recepient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08,
              });
            },
          })
          .to(this.position, {
            x: this.position.x,
          });
        break;
      case "Fireball":
        audio.InitFireball.play()
        const fireballImage = new Image();
        fireballImage.src = "./images/fireball.png";
        const fireball = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          image: fireballImage,
          frames: {
            max: 4,
            hold: 10,
          },
          animate: true,
          rotation: rotation,
        });
        renderedSprites.splice(1, 0, fireball);
        gsap.to(fireball.position, {
          x: recepient.position.x,
          y: recepient.position.y,
          onComplete: () => {
            //Enemy Gets Hit
            audio.FireballHit.play()
            gsap.to(healthBar, {
              width: recepient.health + "%",
            }),
              gsap.to(recepient.position, {
                x: recepient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
                opacity: 0,
              });
            gsap.to(recepient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08,
            });
            renderedSprites.splice(1, 1);
          },
        });
        break;
    }
  }
}
//Boundary Class
class Boundary {
  static width = 48;
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }
  draw() {
    context.fillStyle = "red";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
