import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { key_bindings, key_states, onKeyDownHandler } from './utils';

export { scene, camera, renderer, loader, cars };

var cars = [];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 5, 5, 5 );
camera.lookAt( 0, 0, 0 );


const renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight, true );
document.body.appendChild( renderer.domElement );

renderer.outputColorSpace = THREE.SRGBColorSpace;

const loader = new GLTFLoader();


// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 20);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 5, 50);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);


loader.load(
    'public/models_gltf/all_cars_pack/scene.gltf',
    function (gltf) {
        console.log(gltf);
        console.log(gltf.scene.children[0].children[0].children[0])
        cars = gltf.scene.children[0].children[0].children[0].children;
        scene.add(cars[0]);
        console.log(cars);
    },
    function (xhr){
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) { // fn to be called if loading encounters some error
        console.error( error );
    } 
)


var car_speed = 0;
var car_acceleration = 0.1;

function animate() {
    renderer.render( scene, camera );

    if (key_states["up"]) {
        car_speed += car_acceleration;
    }
    if (key_states["down"]) {
        car_speed -= car_acceleration;
    }

    if (key_states["space"]) {
        car_speed = 0;
    }

    if (key_states["shift"]) {
        car_speed += 2*car_acceleration;
    }

    if (cars[0]){
        if (key_states["left"]) {
            cars[0].rotation.y += 0.01;
        }
        if (key_states["right"]) {
            cars[0].rotation.y -= 0.01;
        }
    
        cars[0].position.x += car_speed; //* Math.sin(cars[0].rotation.y);
        // console.log(cars[0].position);
    }
    else{
        console.log("no car");
    }
    

	requestAnimationFrame( animate );
}

if (WebGL.isWebGLAvailable()){
    animate();        
}else{
    const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );
}

window.addEventListener("keydown", ev => {
    // console.log(cars[0].position);
    // console.log(car_speed);
    onKeyDownHandler(ev);
}, false);

window.addEventListener("keyup", ev => {
    console.log(cars[0].position);
    key_states[key_bindings[ev.keyCode]] = false;
}
, false);
