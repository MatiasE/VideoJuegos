# Juego Recorre mundos / Recoge Objetos

Juego realizado con fines educativos, que busca enseñar el manejo de [WebGL], en este caso a través de la librería [Three.js].

Se tomó como inspiración el minijuego denominado Moon Launcher del juego [Despicable Me: Minion Rush]

### Demo.

Es posible acceder al juego a través de la dirección: http://jorger.github.io/juego_recorre_mundos/

Vídeo que muestra el funcionamiento del juego: https://youtu.be/_se6ORNfRxI

Para dispositivos móviles es posible escanear el siguiente código QR.

![QR Juego](https://dl.dropboxusercontent.com/u/181689/imgGame/qrJuego.png)

### Objetivo

El objetivo del juego es recoger una serie de elementos a través de diferentes planetas/lunas, algunos de los cuales giran alrededor del planeta, estos objetos son los enemigos al atraparlos (colisión) se produce un sonido diferente, sí el juego se está ejecutando en un dispositivo móvil además vibrará.

![Escritorio](https://dl.dropboxusercontent.com/u/181689/imgGame/screen01.png)

Una vez se va recogiendo la cantidad de cubos solicitados se va pasando de un mundo a otro, en el momento cuando se colisiona con un enemigo no se resta puntuación o vida al personaje.

### Fuentes

Como se ha mencionado la actividad se ha inspirado en un minijuego del juego anteriomente citado, además se ha hecho uso de [Three.js], así como el ejemplo de creación de la tierra en WebGL creado por [Bjørn Sandvik] publicado en el blog denominado [Creating a WebGL Earth with three.js]

Se ha encontrado funciones que han ayudado a la creación de la actividad, como por ejemplo la función que permite la [ubicación de forma aleatoria los elementos en un esfera]

```javascript
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
```

Otro de los ejemplos encontrados y que ayudó en gran medida fue el relacionado al manejo de colisiones, en este caso del personaje con los cubos, la función que realiza este proceso fue obtenida de la página [Three.js Examples] ejemplo [Collision Detection]

Otra de las opciones con la que cuenta el juego es la capacidad de controlarlo a través del acelerómetro ```(Android)``` para tal fin se hizo uso de la función encontrada en el artículo títulado [HTML 5 Accelerometer]

### Plataformas.

El juego es funcional tanto en navegadores de escritorio y móviles que [soporten WebGL], en el caso de dispositivos Android, el movimiento del personaje se realiza  a través del acelerómetro y además el dispositivo vibra, en este caso haciendo uso de la [API correspondiente para tal fin]

![Recorre Mundos](https://dl.dropboxusercontent.com/u/181689/imgGame/screen02.png)

Para que el juego funcione como una "aplicación nativa" (webApp) es necesario "instalarla" en este caso a través de la opción "Add Home Screen" que ofrece el navegador (Chrome), además para controlar la orientación del dispositivo y otras opciones una vez "instalado" se hace uso del archivo [manifest.json]

```json
{
  "short_name": "Recorre Mundos",
  "name": "Jorge Rubiano",  
  "icons": [{
              "src": "img/personaje.png",
              "sizes": "96x96",
              "type": "image/png"
            }],
  "start_url": "index.html",
  "display": "fullscreen",
  "orientation": "portrait"
}
```

### Futuras mejoras.

Como se ha específicado la actividad nació con un elemento pedagógico, que busca poner en práctica los conceptos relacionos al manejo de WebGL.

En próximas versiones se busca dar mayor jugabilidad a la actividad, establecer vida al personaje así como adicionar animaciones a acciones como colisionar con objetos válidos y explosiones con elementos inválidos.

### Autor
Jorge Rubaino

[@ostjh]
License
----
MIT

[Despicable Me: Minion Rush]:http://www.dmthegame.com/?section=home
[Bjørn Sandvik]:https://github.com/turban
[Creating a WebGL Earth with three.js]:http://blog.thematicmapping.org/2013/09/creating-webgl-earth-with-threejs.html
[Three.js]:http://threejs.org/
[WebGL]:https://www.khronos.org/webgl/wiki/Main_Page
[Three.js Examples]:https://stemkoski.github.io/Three.js/index.html
[Collision Detection]:https://stemkoski.github.io/Three.js/index.html#collision-detection
[HTML 5 Accelerometer]:http://juur.link/2011/02/html-5-accelerometer/
[soporten WebGL]:http://caniuse.com/#feat=webgl
[API correspondiente para tal fin]:http://davidwalsh.name/demo/vibrate.php
[manifest.json]:https://developers.google.com/web/updates/2014/11/Support-for-installable-web-apps-with-webapp-manifest-in-chrome-38-for-Android
[ubicación de forma aleatoria los elementos en un esfera]:http://stackoverflow.com/a/15048260
[@ostjh]:https://twitter.com/ostjh
