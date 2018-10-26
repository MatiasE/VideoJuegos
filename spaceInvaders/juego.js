var bg;
var tubos;
var flappy;
var salto;

var Juego = {
  
    preload: function(){
        juego.load.image('bg', 'img/bg.jpeg');
        juego.load.spritesheet('pajaros', 'img/pajaro.png', 43, 30);
        juego.load.image('tubo', 'img/tubo.png');
        
        juego.forceSingleUpdate = true;
    },
    
    create: function(){
        bg = juego.add.tileSprite(0, 0, 370, 550, 'bg');
        juego.physics.startSystem(Phaser.Physics.ARCADE);
        tubos = juego.add.group();
        tubos.enableBody = true;
        tubos.createMultiple(20, 'tubo');
        
        flappy = juego.add.sprite(100, 245, 'pajaros');
        flappy.frame = 1;
        flappy.animations.add('vuelo', [0,1,2], 10, true);
        
        sa
    },
    
    update: function(){
        bg.tilePosition.x -= 1;
    }

};