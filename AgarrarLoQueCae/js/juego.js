var game = new Phaser.Game(600, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('fondo', 'assets/sky.png');
    game.load.image('plataforma', 'assets/platform.png');
    game.load.image('diamante', 'assets/diamond.png');
    game.load.spritesheet('personaje', 'assets/dude.png', 32, 48);
    game.load.audio('punto', 'assets/numkey.wav');
}

var plataforma;
var suelo;
var personaje;
var diamantes;
var bandeja;

var txtPuntaje;
var txtVidas;
var txtNivel;

var sndPunto;

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	game.add.sprite(0, 0, 'fondo');
	
	plataforma = game.add.sprite(0, 100, 'plataforma');
	plataforma.width = 800;
	game.physics.arcade.enable(plataforma);
	plataforma.body.immovable = true;
	
	suelo = game.add.sprite(0, game.world.height - 5, 'plataforma');
	suelo.width = 800;
	suelo.height = 5;
	game.physics.arcade.enable(suelo);
	
	bandeja = game.add.sprite(50, game.world.height - 100, 'plataforma');
	bandeja.width = 150;
	game.physics.arcade.enable(bandeja);
	
	personaje = game.add.sprite(32, 0, 'personaje');
	game.physics.arcade.enable(personaje);
	personaje.body.gravity.y = 300;
	personaje.body.velocity.x = 250;
	
	personaje.animations.add('left', [0, 1, 2, 3], 10, true);
    personaje.animations.add('right', [5, 6, 7, 8], 10, true);
    personaje.animations.play('right');

	diamantes = game.add.group();
	
	//Variables del juego
	game.giro = 250;
	game.velocidadDiamantes = 500;
	game.gravedadDiamantes = 150;
	game.vidas = 5;
	game.puntaje = 0;
	game.nivel = 1;
	
	//Loops y eventos
	game.subirNivel = game.time.events.loop(10000, subirNivel, this);
	
	//Indicadores de puntaje y vidas
	txtPuntaje = game.add.text(25, 16, 'Puntaje: 0', { font: '24px Arial', fill: '#000' });
	txtNivel = game.add.text(325, 16, 'Nivel: 1', {font: '24px Arial', fill: '#000'});
	txtVidas = game.add.text(625, 16, 'Vidas: 5', {font: '24px Arial', fill: '#000'});
	
	//Sonidos
	sndPunto = game.add.audio('punto');
	
}

function update() {
	game.physics.arcade.collide(personaje, plataforma);
	
	game.physics.arcade.overlap(diamantes, suelo, perderVida, null, this);
	game.physics.arcade.overlap(bandeja, diamantes, recogerDiamante, null, this); 
	
	if(personaje.body.velocity.x > 0 && personaje.x > game.giro){
		personaje.body.velocity.x *= -1;
		game.giro = game.rnd.integerInRange(100, personaje.x-1);
		personaje.animations.play('left');
		soltarDiamante();
	}
	
	if(personaje.body.velocity.x < 0 && personaje.x < game.giro){
		personaje.body.velocity.x *= -1;
		game.giro = game.rnd.integerInRange(personaje.x+1, 688);
		personaje.animations.play('right');
		soltarDiamante();
	}
	
	bandeja.body.x = game.input.mousePointer.x - bandeja.width / 2;
}

function soltarDiamante() {
    var diamante = diamantes.create(personaje.x, 100, 'diamante');
    game.physics.arcade.enable(diamante);
    diamante.body.gravity.y = game.gravedadDiamantes;
}

function subirNivel(){
	game.gravedadDiamantes *= 1.2;
	personaje.body.velocity.x *= 1.2;
	game.nivel += 1;
	txtNivel.setText('Nivel: '+game.nivel);
}

function recogerDiamante(bandeja, diamante){
	diamante.kill();
	game.puntaje += 5;
	txtPuntaje.setText('Puntaje: '+game.puntaje);
	sndPunto.play();
}

function perderVida(suelo, diamante){
	diamante.kill();
	game.vidas -= 1;
	txtVidas.setText('Vidas: '+game.vidas);
	
	if(game.vidas == 0){
		suelo.kill();
		bandeja.kill();
		game.add.text(200, 250, 'Perdiste', {font:'80px Arial', fill: '#000'});
		game.add.text(200, 350, 'Nivel: '+game.nivel, {font:'30px Arial', fill: '#000'});
		game.add.text(200, 400, 'Puntaje: '+game.puntaje, {font:'30px Arial', fill: '#000'});
	}
}
