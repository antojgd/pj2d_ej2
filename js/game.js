// SUPER MARIO BROSS STYLE GAME
var config = {
  type: Phaser.CANVAS,
  pixelart:true,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 500
      },
      debug: false
    }
  },
  scene: {
    key: 'main',
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

var map;
var player;
var cursors;
var groundLayer, coinLayer;
var text;
var score = 0;

function preload() {
  // map made with Tiled in JSON format
  //Adds a Tiled JSON Tilemap file, to the current load queue.
  this.load.tilemapTiledJSON('map','assets/map2.json');
  // tiles in spritesheet
  this.load.spritesheet('tiles', 'assets/tiles2.png', {
    frameWidth: 70,
    frameHeight: 70
  });
  // simple coin image
  this.load.image('coin', 'assets/coinGold.png');

  // simple danger image
  this.load.image('danger', 'assets/danger.png');

  // player animations
    this.load.spritesheet('player', 'assets/alien-48x64.png', { frameWidth: 48, frameHeight: 64 });

  //sounds
  this.load.audio("move", ["assets/sounds/move.ogg", "assets/sounds/move.mp3"]);
  this.load.audio("grow", ["assets/sounds/grow.ogg", "assets/sounds/grow.mp3"]);
  this.load.audio("danger", "assets/sounds/explosion.wav");
}

function create() {
  // load the map
  map = this.make.tilemap({
    key: 'map'
  });

  // tiles for the ground layer
  // he name of the tileset as specified in the map data.
  var groundTiles = map.addTilesetImage('tiles');
  // create the ground layer
  groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);
  // the player will collide with this layer
  groundLayer.setCollisionByExclusion([-1]);

  // create the ground layer
  //waterLayer = map.createDynamicLayer('agua', groundTiles, 0, 0);


  // coin image used as tileset
  var coinTiles = map.addTilesetImage('coin');
  // add coins as tiles
  coinLayer = map.createDynamicLayer('Coins', coinTiles, 0, 0);

  var dangerTiles = map.addTilesetImage('danger');
  dangerLayer = map.createDynamicLayer('Dangers', dangerTiles, 0, 0);


  // set the boundaries of our game world
  this.physics.world.bounds.width = groundLayer.width;
  this.physics.world.bounds.height = groundLayer.height;


  // create the player sprite
  player = this.physics.add.sprite(200, 200, 'player');
  player.setBounce(0.2); // our player will bounce from items
  player.setCollideWorldBounds(true); // don't go out of the map

  //Player collide with the groundLayer
  this.physics.add.collider(groundLayer, player);


  coinLayer.setTileIndexCallback(157, collectCoin, this); // the coin id is 17
  //when the player overlaps with a tile with index 17, collectCoin will be called
  this.physics.add.overlap(player, coinLayer);

  dangerLayer.setTileIndexCallback(158, hitDanger, this); // the coin id is 17
  //when the player overlaps with a tile with index 17, collectCoin will be called
  this.physics.add.overlap(player, dangerLayer);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idle',
        frames: [ { key: 'player', frame: 7 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

   //Prepare the cursos Keys
   cursors = this.input.keyboard.createCursorKeys();

   // set bounds so the camera won't go outside the game world
   this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
   // make the camera follow the player
   this.cameras.main.startFollow(player);

   // set background color, so the sky is not black
   this.cameras.main.setBackgroundColor('#ccccff');

   //Scores
   text = this.add.text(20, 570, '0', {
        fontSize: '20px',
        fill: '#ffffff'
    });
    text.setScrollFactor(0);

    //Sounds create
    this.moveSound = this.sound.add("move");
    this.growSound = this.sound.add("grow");
    this.dangerSound = this.sound.add("danger");

}

function update(time, delta) {
    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-200); // move left
        player.anims.play('left', true); // play walk animation
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(200); // move right
        player.anims.play('right', true); // play walk animatio
    } else {
        player.body.setVelocityX(0);
        player.anims.play('idle', true); //stop
    }

    if ((cursors.space.isDown || cursors.up.isDown) && player.body.onFloor())
    {
        player.body.setVelocityY(-500); // jump up
        this.moveSound.play();
    }
}



function collectCoin(sprite, tile) {
      coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
      score ++; // increment the score
      text.setText(score); // set the text to show the current score
      this.growSound.play();
      return false;
}


function hitDanger(sprite, tile) {
      this.cameras.main.shake(500);
      dangerLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
      score=score-5; // decrement the score
      console.log(score);
      text.setText(score); // set the text to show the current score
      this.dangerSound.play();
      return false;
}
