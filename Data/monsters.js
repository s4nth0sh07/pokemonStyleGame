const embyImage = new Image();
embyImage.src = "./images/embySprite.png";
const draggleImage = new Image();
draggleImage.src = "./images/draggleSprite.png";

const monsters = {
  Emby:{
    position: {
      x: 280,
      y: 330,
    },
    image: {
        src: './images/embySprite.png'
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    name: "Emby",
    attacks: [attacks.Tackle, attacks.Fireball]
  },
  Draggle:{
    position: {
      x: 800,
      y: 100,
    },
    image: {
        src: "./images/draggleSprite.png"
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    isEnemy:true,
    name: 'Draggle',
    attacks: [attacks.Tackle, attacks.Fireball]
  }
};
