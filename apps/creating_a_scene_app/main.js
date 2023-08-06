import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

/*
A three.js app needs three main components, namely, a `Scene`, a `Camera` and a `Renderer`, 'so that we can render the scene with camera.'"
We add 'objects' to the `Scene`.
*/

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
/*
three.js has various kinds of cameras. One amongh them is perspective camera.
Parameters for the camera:
    1. `FoV` (field of view) angle in degree
    2. `Aspect ratio`, it's almost always this: `window.innerWidth / window.innerHeight`
    3 & 4. `Near` and `Far` clipping plane. Objects nearer than near and furthur than Far won't be rendered.
*/

const renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight, true );
document.body.appendChild( renderer.domElement );

/*
`renderer.setSize`: dimension of the app (most likely the canvas size)
`renderer.domElement`: is the `canvas`. we append it to the document.body to 'draw' canvas.
*/


const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;


const geometry2 = new THREE.BoxGeometry( 1, 1, 1 );
const material2 = new THREE.MeshBasicMaterial( { color: 0x00ffaa } );
const cube2 = new THREE.Mesh( geometry2, material2 );
scene.add( cube2 );
cube2.position.x  = 1;
cube2.position.y = 1;

const geometry3 = new THREE.BoxGeometry( 1, 1, 1 ); // width, height and depth (!)
const material3 = new THREE.MeshBasicMaterial( { color: 0x00ffaa } );
const cube3 = new THREE.Mesh( geometry3, material3 );
scene.add( cube3 );
cube3.position.x  = -1;
cube3.position.y = -1;

/*
`BoxGeometry`: probably equivalent to model, collection of vertices (and 'fill (faces)'? what's that?)
`MeshBasicMaterial`: it probably defines the color and texture
`Mesh`: '... an object that takes a geometry, and applies a material to it'. We then insert this into our `scene`.

By default `scene.add` adds an object in the center (0, 0, 0) i.e. puts objects center in the coordinate system's center. 
So we position the camera at z=5 so that camera and the object does not get inside one another.
*/



function animate() {
	requestAnimationFrame( animate );
    
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
	
    renderer.render( scene, camera );
}

if (WebGL.isWebGLAvailable()){
    animate();        
}else{
    const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );
}


/*
This `requestAnimationFrame` probably runs the 'game loop'.
It takes a callback function, here, `animate` is the callback function.
Then we `render` the `scene` with the `camera` with `renderer.render`.

The lines in-between are updating the scene, here, by rotating the cube around x and y axes.

`function animate`:
it's calling the `requestAnimationFrame` with itself as the callback function.

"The `requestAnimationFrame` method tells the browser that you wish to perform an animation 
and requests that the browser calls a specified function to update an animation right before the next repaint. 
The method takes a callback as an argument to be invoked before the repaint." - MDN docs.
*/
