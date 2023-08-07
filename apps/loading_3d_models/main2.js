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


// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);
/*
params: 
    1. light color
    2. light intensity (optional, but can't see the model if not given, but can see the cube without any problem) 
*/

// const directionalLight = new THREE.DirectionalLight(0xff00aa, 50);
const directionalLight = new THREE.DirectionalLight(0xffffff, 20);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

// // const pointLight = new THREE.PointLight(0xaa00ff, 5, 50); // parameters: color, intensity, distance
const pointLight = new THREE.PointLight(0xffffff, 5, 50);
pointLight.position.set(5, 5, 5); // Set the position of the light
scene.add(pointLight);


loader.load(
    'public/models_gltf/all_cars_pack/scene.gltf',
    function (gltf) {
        console.log(gltf);
        console.log(gltf.scene.children[0].children[0].children[0])
        var cars = gltf.scene.children[0].children[0].children[0].children;
        console.log(cars[0])
        // scene.add(gltf.scenes[0])
        scene.add(cars[0]);
        scene.add(cars[1])
    },
    function (xhr){
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) { // fn to be called if loading encounters some error
        console.error( error );
    } 
)


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
