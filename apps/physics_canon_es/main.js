import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';


import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


export { scene, camera, renderer };

// setting up scene & camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( -5, 5, 0 );
camera.lookAt( 0, 0, 0 );


// setting up renderer
const renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight, true );
document.body.appendChild( renderer.domElement );

renderer.outputColorSpace = THREE.SRGBColorSpace;


// adding controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0, 0 );
controls.update();


// Adding an AxesHelper to the scene
const axesHelper = new THREE.AxesHelper( 200 );
scene.add( axesHelper );



// Adding physics

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // gravity acceleration in m/s² in negative y direction i.e. towards the 'ground' i.e. from top to bottom


// adding a ground body
const groundBody = new CANNON.Body({
    mass: 0, // mass == 0 makes the body static
    shape: new CANNON.Plane(), // this shape is infinite in size
    material: new CANNON.Material(), // this is the default material
    // type: CANNON.Body.STATIC, // can also be achieved by setting the mass to 0
});

groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2); // make it face up
world.addBody(groundBody); // add to the world

// groundBody.shapeOrientations[0].setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2); // make it face up


// adding light
// ambient light
const ambientLight = new THREE.AmbientLight( 0xffffff, 1 ); // soft white light
scene.add( ambientLight );


// grid
const gridHelper = new THREE.GridHelper( 100, 100 );
scene.add( gridHelper );




// adding a car body
const carBody = new CANNON.Body({
    mass: 1500, // kg
    shape: new CANNON.Box(new CANNON.Vec3(1, 0.5, 2.5)), // 1m x 0.5m x 2.5m
    material: new CANNON.Material(), // this is the default material
    // type: CANNON.Body.DYNAMIC, // can also be achieved by setting the mass to something other than 0
});

carBody.position.set(0, 5, 0); // x, y, z
// carBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2); // make it face up
world.addBody(carBody); // add to the world


// adding a car mesh
const carGeometry = new THREE.BoxGeometry(2, 1, 5);
const carMaterial = new THREE.MeshPhysicalMaterial({ color: 0x00ffff });
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.set(0, 5, 0); // x, y, z
// car.rotation.set(0, Math.PI / 2, 0); // x, y, z
scene.add(car); // add to the scene


// 'activating' the debugger
const cannonDebugger = new CannonDebugger(scene, world, { color: 0x00ffff });


function animate() {
    // update physics
    world.step(1 / 60); // 60 fps
    cannonDebugger.update(); // update the debugger
    renderer.render( scene, camera ); // render the scene

    controls.update(); // update the controls

    // update car position
    car.position.copy(carBody.position);
    car.quaternion.copy(carBody.quaternion);

    
	requestAnimationFrame( animate );
}

if (WebGL.isWebGLAvailable()){
    animate();        
}else{
    const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );
}

