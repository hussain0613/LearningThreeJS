import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 5, 5, 5 );
camera.lookAt( 0, 0, 0 ); // Rotate the object to face the given point (in world space), in case of camera, it literelly looks at the point.


const renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight, true );
document.body.appendChild( renderer.domElement );

renderer.outputColorSpace = THREE.SRGBColorSpace;
// renderer.outputEncoding = THREE.sRGBEncoding;

const loader = new GLTFLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
loader.setDRACOLoader( dracoLoader );

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 100);
scene.add(ambientLight);
/*
params: 
    1. light color
    2. light intensity (optional, but can't see the model if not given, but can see the cube without any problem) 
*/

const directionalLight = new THREE.DirectionalLight(0xff00aa, 50);
directionalLight.position.set(10, 10, 20).normalize();
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xaa00ff, 5, 50); // parameters: color, intensity, distance
pointLight.position.set(10, 10, 20); // Set the position of the light
scene.add(pointLight);


loader.load( 
    'public/free_1975_porsche_911_930_turbo/scene.gltf', // file path
    function ( gltf ) { // fn to be called once loaded
	    console.log("Loading done!")
        scene.add( gltf.scene );
        console.log("GLTF model added to scene!")
        // gltf.scene.scale.set(2, 2, 2); // scales the model
        
        // gltf.animations; // Array<THREE.AnimationClip>
		// gltf.scene; // THREE.Group
		// gltf.scenes; // Array<THREE.Group>
		// gltf.cameras; // Array<THREE.Camera>
		// gltf.asset; // Object
    },
    function ( xhr ) { // fn to be called while loading is in progress
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	}, 
    function ( error ) { // fn to be called if loading encounters some error
	    console.error( error );
    } 
);


const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00aaff } );
const cube = new THREE.Mesh( geometry, material );
cube.position.set(1, 1, -3)
scene.add( cube );


function animate() {
    renderer.render( scene, camera );
	requestAnimationFrame( animate );
}

if (WebGL.isWebGLAvailable()){
    animate();        
}else{
    const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );
}
