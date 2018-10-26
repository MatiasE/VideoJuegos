/*
Tierra en WebGL, tomado de: http://blog.thematicmapping.org/2013/09/creating-webgl-earth-with-threejs.html
*/
var ACELEROMETRO = false;
(function () 
{
	//http://stackoverflow.com/a/13819253
	//Para detectar si es un dispositivo móvill...
	var isMobile = {
				Android: function()
				{
					return navigator.userAgent.match(/Android/i);
				},
				BlackBerry: function()
				{
					return navigator.userAgent.match(/BlackBerry/i);
				},
				iOS: function() 
				{
					return navigator.userAgent.match(/iPhone|iPad|iPod/i);
				},
				Opera: function() 
				{
					return navigator.userAgent.match(/Opera Mini/i);
				},
				Windows: function()
				{
					return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
				},
				any: function()
				{
					return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
				}
		};
	//Número de cubos a recoger...	
	var numCubos = 0;
	var totalRecoge = 0;
	var mundoCarga = 1;
	//Los tipo de cubos que se manejarán en el escenario...
	var cubosImagenes = [
							{
								tipo		: 1,
								nombre 		: "Pesos", 
								imagen 		: "dos.jpg", 
								mueve 		: false, 
								valor 		: 10
							},
							{
								tipo		: 2,
								nombre 		: "Vida", 
								imagen 		: "tres.jpg", 
								mueve 		: false, 
								valor 		: 10
							}, 
							{
								tipo		: 3,
								nombre 		: "Atención", 
								imagen 		: "cuatro.jpg", 
								mueve 		: false, 
								valor 		: 5
							}, 
							{
								tipo		: 4,
								nombre 		: "Incognita", 
								imagen 		: "cinco.png", 
								mueve 		: false, 
								valor 		: 5
							}, 
							{
								tipo		: 5,
								nombre 		: "Quita Vida", 
								imagen 		: "seis.jpg", 
								mueve 		: true, 
								valor 		: -5, 
								velocidad 	: 1
							},
							{
								tipo		: 6,
								nombre 		: "Destruye", 
								imagen 		: "siete.png", 
								mueve 		: true, 
								valor 		: 0, 
								velocidad 	: 1.5
							}
						];	
	//Para los mundos que se mostrará en el ecesario, así como las propiedades de cada uno...
	var mundos = [
					{
						nombre 	: 	"Mercurio", 
						imagen	: 	"mercurio.jpg", 
						cubos	: 	5, 
						malos 	: 	1, 
						total 	: 	6
					}, 
					{
						nombre 	: 	"Venus", 
						imagen	: 	"venus.jpg", 
						cubos	: 	8, 
						malos 	: 	2, 
						total 	: 	10
					}, 
					{
						nombre 	: 	"La Madre Tierra :)", 
						imagen	: 	"tierra.jpg", 
						cubos	: 	13, 
						malos 	: 	2, 
						total 	: 	15
					}, 
					{
						nombre 	: 	"La luna", 
						imagen	: 	"luna.jpg", 
						cubos	: 	15, 
						malos 	: 	3, 
						total 	: 	18
					}, 
					{
						nombre 	: 	"Marte", 
						imagen	: 	"marte.jpg", 
						cubos	: 	17, 
						malos 	: 	3, 
						total 	: 	20
					}, 
					{
						nombre 	: 	"Júpiter", 
						imagen	: 	"jupiter.jpg", 
						cubos	: 	21, 
						malos 	: 	4, 
						total 	: 	25
					}, 
					{
						nombre 	: 	"Luna IO", 
						imagen	: 	"io.jpg", 
						cubos	: 	24, 
						malos 	: 	4, 
						total 	: 	28
					}, 
					{
						nombre 	: 	"Luna Europa", 
						imagen	: 	"europa.jpg", 
						cubos	: 	25, 
						malos 	: 	5, 
						total 	: 	30
					}, 
					{
						nombre 	: 	"Neptuno", 
						imagen	: 	"neptuno.jpg", 
						cubos	: 	30, 
						malos 	: 	5, 
						total 	: 	35
					}
				];
	
	//Para el manejo del aclerometro del ceuluar...
	//http://juur.link/2011/02/html-5-accelerometer/
	function handleEvent(event)
	{
    	var x = event.beta;
    	var y = event.gamma;
    	var xBase = 290 - (x * 2);
    	var ybase = 190 - (y * 2);
    	//Función global de movimiento de la librería 
    	_rotateEnd = GLOBAL(ybase, xBase);
	}

	if(isMobile.any() && !isMobile.iOS())
	{
		ACELEROMETRO = true;
		window.addEventListener("deviceorientation", handleEvent, true);
	}
  	//Para el sonido cuando se "atrapa" un cubo...
  	//http://www.createjs.com/soundjs
  	createjs.Sound.registerSound("sounds/collision8.mp3", "choque");
  	createjs.Sound.registerSound("sounds/explosion2.mp3", "explosion");
  	
  	//Ubicar un elemento en una esfera...
  	//http://stackoverflow.com/a/15048260
	function randomSpherePoint(x0,y0,z0,radius)
	{
		var u = Math.random();
		var v = Math.random();
		var theta = 2 * Math.PI * u;
		var phi = Math.acos(2 * v - 1);
		var x = x0 + (radius * Math.sin(phi) * Math.cos(theta));
		var y = y0 + (radius * Math.sin(phi) * Math.sin(theta));
		var z = z0 + (radius * Math.cos(phi));
		return [x,y,z];
	}
	
	var webglEl = document.getElementById('webgl');
	//detectar si el navegador soporta WebGL...
	if (!Detector.webgl)
	{
		Detector.addGetWebGLMessage(webglEl);
		return;
	}

	var width  = window.innerWidth,
		height = window.innerHeight;

	// Datos del planeta/luna
	var radius   = 0.5,
		segments = 32,
		rotation = 6;  

	//Creación de la escena...
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
	camera.position.z = 2.3;
	//Para crear la base donde se podrá los planetas/lunas...
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	scene.add(new THREE.AmbientLight("white"));
    sphere = createSphere(radius, segments);
	sphere.rotation.y = rotation;
	scene.add(sphere);

	//crear los cubos...
	var geometry = new THREE.CubeGeometry(0.08, 0.08, 0.08);
	misCubos = [];
	var cargarMundo = function cargarMundo(mundo)
	{
		totalRecoge = 0;
		//La textura del mundo...
		sphere.material.map = THREE.ImageUtils.loadTexture("img/planetas/" + mundos[mundo - 1].imagen);
		sphere.material.needsUpdate = true;
		//Cargar los cubos...
		misCubos = []; //Reciniciar los cubos...
		numCubos = mundos[mundo - 1].cubos; //La cantidad de cubos que tendrá el escenario...
		nom_div("puntua").innerHTML = "0 de " + numCubos;
		nom_div("nomMundo").innerHTML = mundos[mundo - 1].nombre;
		var materialCubos = posTmp = 0;
		var imgMaterial = "";
		var tipoCubo = 0;
		var aleatorioCubo = 0;
		for(var i = 1; i <= mundos[mundo - 1].total; i++)
		{
			//Primero hacer la cantidad de malos que se exije...
			if(i <= mundos[mundo-1].malos)
			{
				//Obtener aleatoriamente a los malos...
				aleatorioCubo = (Math.floor((Math.random() * 2) + 1) + 4) - 1;
			}
			else
			{
				aleatorioCubo = (Math.floor(Math.random() * 4) + 1) - 1;
			}
			imgMaterial = "img/cubos/" + cubosImagenes[aleatorioCubo].imagen;
			tipoCubo = cubosImagenes[aleatorioCubo].tipo;
			materialCubos = new THREE.MeshLambertMaterial({
				map: THREE.ImageUtils.loadTexture(imgMaterial)
      		});
      		posTmp = randomSpherePoint(0, 0, 0, 0.55);
      		misCubos.push(
      						{
      							elemento 	: new THREE.Mesh( geometry, materialCubos ), 
      							tipo 		: tipoCubo, 
      							name 		: "cube_" + i, 
      							angulo		: 0
      						}
      					);
			misCubos[i - 1].elemento.position.set(posTmp[0], posTmp[1], posTmp[2]);
			misCubos[i - 1].elemento.name = "cube_" + i;
			scene.add(misCubos[i - 1].elemento);
		}
		return cargarMundo;
	}(mundoCarga);

	//Para crear al "personaje"
	var materialPersonaje = new THREE.MeshLambertMaterial({
        	map: THREE.ImageUtils.loadTexture('img/personaje.png')
      	});
	var personaje = new THREE.Mesh( geometry, materialPersonaje);
	scene.add(personaje);

	//Creación de las estrellas...
	var stars = createStars(90, 64);
	scene.add(stars);

	//Los controles de movimiento...
	controls = new THREE.TrackballControls(camera);
	controls.noZoom = true;
	webglEl.appendChild(renderer.domElement);
	//Para actulizar la vista del escenario...
	render();
	function render()
	{		
		controls.update();		
		requestAnimationFrame(render);
		renderer.render(scene, camera);
		//Rotación del personaje...
		personaje.rotation.y += 0.05;
		//Personaje sigue la cámara...
		personaje.position.x = camera.position.x / 4;
		personaje.position.y = camera.position.y / 4;
		personaje.position.z = camera.position.z / 4;
		//Para las acciones del cubo...
		for(var i = 0; i < misCubos.length; i++)
		{
			misCubos[i].elemento.rotation.y += 0.05;
			misCubos[i].elemento.rotation.z += 0.05;
			misCubos[i].elemento.rotation.x += 0.05;
			//Para el movimiento de los elementos...
			if(cubosImagenes[misCubos[i].tipo - 1].mueve)
			{
				misCubos[i].angulo += cubosImagenes[misCubos[i].tipo - 1].velocidad;
				//http://stackoverflow.com/a/21223149
				var radians = misCubos[i].angulo * Math.PI / 180;
				misCubos[i].elemento.position.x = Math.cos(radians) * 0.55;
				misCubos[i].elemento.position.z = Math.sin(radians) * 0.55;
			}
		}
		detectCollision();
	}

	//view-source:https://stemkoski.github.io/Three.js/Collision-Detection.html
	function detectCollision()
	{
  		var originPoint = personaje.position.clone();
  		var cubosColisiona = [];
  		for(var i = 0; i < misCubos.length; i++)
  		{
  			cubosColisiona.push(misCubos[i].elemento);
  		}
  		for (var vertexIndex = 0; vertexIndex < personaje.geometry.vertices.length; vertexIndex++)
		{		
			var localVertex = personaje.geometry.vertices[vertexIndex].clone();
			var globalVertex = localVertex.applyMatrix4( personaje.matrix );
			var directionVector = globalVertex.sub( personaje.position );
			var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
			var collisionResults = ray.intersectObjects( cubosColisiona );
			if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
			{
				//Eliminar el elemento del escenario...
				var selectedObject = scene.getObjectByName(collisionResults[0].object.name);
    			scene.remove( selectedObject );
    			//Buscar el elemento en el array de cubos y eliminarlo...
    			for(var i = 0; i < misCubos.length; i++)
    			{
    				if(misCubos[i].elemento.name === collisionResults[0].object.name)
    				{
    					if(misCubos[i].tipo <= 4)
    					{
    						createjs.Sound.play("choque");
    						totalRecoge++;
    						nom_div("puntua").innerHTML = totalRecoge + " de " + numCubos;
    						if(totalRecoge === numCubos)
	    					{
	    						//Eliminar los elementos que no se hayan destruido cuando pasa al siguiente mundo/luna...
	    						for(var c = 0; c < misCubos.length; c++)
	    						{
	    							var selectedObject = scene.getObjectByName(misCubos[c].name);
	    							scene.remove( selectedObject );
	    						}
	    						mundoCarga++;
	    						if(mundoCarga <= mundos.length)
	    						{
		    						swal(
							    	{
							    		title: mundos[mundoCarga - 1].nombre,   
							    		text: "Muy bien continua al siguiente: " + mundos[mundoCarga - 1].nombre,
							    		showCancelButton: false,   
							    		confirmButtonColor: "#DD6B55",  
							    		confirmButtonText: "Aceptar", 
							    		closeOnConfirm: false, 
							    		type: "success", 
							    	},
							    	function()
							    	{
							    		swal({title: "Cargando",   text: "Se está cargando " + mundos[mundoCarga - 1].nombre,   timer: 100,   showConfirmButton: false });
							    		cargarMundo(mundoCarga);
							    	});
		    					}
		    					else
		    					{
		    						swal({title: "Muy bien!",   text: "Terminaste el recorrido", imageUrl: "img/thumbs-up.jpg" });
		    					}
	    					}
    					}
    					else
    					{
    						//Vibra cuando se ha tomado un cubo giratorio...
    						createjs.Sound.play("explosion");
    						navigator.vibrate(100);
    					}
    					misCubos.splice(i, 1);
    					break;
    				}
    			}
			}
		}
  	}

	function createSphere(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('img/planetas/mercurio.jpg')				
			})
		);
	}

	function createStars(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments), 
			new THREE.MeshBasicMaterial({
				map:  THREE.ImageUtils.loadTexture('img/galaxy_starfield.png'), 
				side: THREE.BackSide
			})
		);
	}

	//Para acceder a elementos de HTML
	function nom_div(div)
	{
		return document.getElementById(div);
	}
}());