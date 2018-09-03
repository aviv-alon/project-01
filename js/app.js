/* global Spaceship,Shot,Attacker,Asteroid,GameArea  */
const COLOR_WHITE = '#EDF2F4';
let spaceship,stats;
let ctx; //// TODO: delete this

const components = new Map();


document.addEventListener('DOMContentLoaded',() => {
  console.log('start game');
  startGame();
});


const startGame = () => {
  GameArea.start();
  creatSoundList();
  stats = new GameStats();
  spaceship = new Spaceship();
  createAsteroidBelt();

};
//////////////////////////////////////////
const updateGameArea = () => {
  GameArea.clear();


  // User Interaction
  (GameArea.keys && GameArea.keys[39]) ? spaceship.rotateRight():
    (GameArea.keys && GameArea.keys[37]) ? spaceship.rotateLeft() : spaceship.stopRotate();

  (GameArea.keys && GameArea.keys[38]) ? spaceship.thrust() : spaceship.stopThrust();
  (GameArea.keys && GameArea.keys[32]) ? spaceship.fire() : spaceship.allowFire();


  // Game Logic


  // Positional Logic
  spaceship.relocate();
  spaceship.newPos();
  components.forEach( (c) => {
    if (c instanceof Asteroid)
      c.relocate();
    if ((c instanceof Shot) && (c.isOutOfGameArea())) // Fix
      components.delete(c.id);
    c.newPos();

  });


  //Colision Detection
  components.forEach( (cAsteroid) => {
    if (cAsteroid instanceof Asteroid){
      // check if astroid hit by shot
      components.forEach( (cShoot) => {
        if (cShoot instanceof Shot && cShoot.isHit(cAsteroid.x, cAsteroid.y, cAsteroid.radius)){
          // destroy the asteroid and activate the laser explosion
          cAsteroid.brewingUp();
          cShoot.explode();
        }
      });

      // check if astroid hit the spaceship

    }
  });



  // Render
  spaceship.updateDisplay();
  stats.updateDisplay();
  components.forEach( (c) => c.updateDisplay() );

};

function createAsteroidBelt() {
  let x, y,r;
  for (let i = 0; i < 10; i++) {
    console.log('createAsteroidBelt');
    // random asteroid location (not touching spaceship)
    do {

      x = Math.floor(Math.random() * GameArea.canvas.width);
      y = Math.floor(Math.random() * GameArea.canvas.height);
      r = Math.ceil(ROID_SIZE / 2);//r = Math.ceil(ROID_SIZE / 2);
    } while (distBetweenPoints(spaceship.x, spaceship.y, x, y) < ROID_SIZE * 2 + spaceship.radius);
    const a = new Asteroid(x, y, r);
    components.set(a.id, a);
  }
}
