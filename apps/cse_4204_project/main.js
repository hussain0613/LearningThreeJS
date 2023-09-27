import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';


import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { key_states, onKeyDownHandler, onKeyUpHandler } from './key_utils';

import { MeshBody } from './meshbody.js';

import { MyWorld } from './myworld.js';


export { scene, camera, renderer };

// setting up scene & camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 5, 5, -5 );
camera.lookAt( 0, 0, 0 );


// setting up renderer
const renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight, true );
document.body.appendChild( renderer.domElement );

renderer.outputColorSpace = THREE.SRGBColorSpace;


// adding light
// ambient light
const ambientLight = new THREE.AmbientLight( 0xffffff, .2 ); // soft white light
ambientLight.position.set( 0, .5, 0 );
scene.add( ambientLight );

// directional light
const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 ); // soft white light
directionalLight.position.set( 5, 1000, 5 );
scene.add( directionalLight );


// adding controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0, 0 );
controls.update();


// Adding an AxesHelper to the scene
// const axesHelper = new THREE.AxesHelper( 200 ); // color: x = red, y = green, z = blue
// scene.add( axesHelper );



// Adding physics

// const world = new CANNON.World();
const world = new MyWorld();
world.gravity.set(0, -9.82, 0); // gravity acceleration in m/s² in negative y direction i.e. towards the 'ground' i.e. from top to bottom


// adding a ground body
const groundBody = new MeshBody({
    mass: 0, // mass == 0 makes the body static
    shape: new CANNON.Plane(), // this shape is infinite in size
    material: new CANNON.Material(), // this is the default material
});


groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // make it face up
groundBody.createMesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa/*, wireframe: true*/ }), scene);
const ground_texture = new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/f/f2/Blender3DNoobToPro-Grass.jpg', function(texture){
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 100, 100 );
    groundBody.mesh.material.map = texture;
    groundBody.mesh.material.needsUpdate = true;
});
world.addBody(groundBody); // add to the world


function randinrnge(min, max){
    return Math.random() * (max - min) + min;
}

const max_obs_mass = 50000.0;
function create_obstacel(mass = undefined){
    if (mass === undefined){
        mass = randinrnge(0, max_obs_mass);
    }

    var w = randinrnge(.1, 5);
    var h = randinrnge(.1, 5);
    var d = randinrnge(.1, 5);

    var x = randinrnge(-500, 500);
    var y = 0; //randinrnge(0, 10);
    var z = randinrnge(-500, 500);


    const obst = new MeshBody({
        mass: mass, // kg
        shape: new CANNON.Box(new CANNON.Vec3(w, h, d)), // 2m x 1m x 5m
        material: new CANNON.Material(), // this is the default material
    });

    world.addBody(obst); // add to the world
    
    obst.position.set(x, y, z); // x, y, z
    var color_coeff = 1 - ((mass)/ max_obs_mass);
    var color =  new THREE.Color(0x00ffff);
    color.r *= color_coeff;
    color.g *= color_coeff;
    color.b *= color_coeff;
    obst.createMesh(new THREE.BoxGeometry(2*w, 2*h, 2*d), new THREE.MeshPhysicalMaterial({ color:  color}), scene);
}

var obstacles = [];
for (var i = 0; i < 20; i++){
    var obs = create_obstacel();
    obstacles.push(obs);

    var obs = create_obstacel(randinrnge(0, 500.0)); // a chance for a light obstacles
    obstacles.push(obs);
}


// adding a car body
const car = new MeshBody({
    mass: 2000, // kg
    shape: new CANNON.Box(new CANNON.Vec3(1, 0.5, 2.5)), // 2m x 1m x 5m
    material: new CANNON.Material(), // this is the default material
});

car.position.set(0, 5, 0); // x, y, z
car.createMesh(new THREE.BoxGeometry(2, 1, 5), new THREE.MeshPhysicalMaterial({ color: 0x00ffff }), scene);


// adding 'vehicle' constraints
const vehicle = new CANNON.RigidVehicle({ chassisBody: car });


// adding wheels
// wheel body
const wheel_body_specs = {
    mass: 15, // kg
    // shape: new CANNON.Cylinder(0.5, 0.5, 0.5, 20), // radiusTop, radiusBottom, height, numSegments
    shape: new CANNON.Sphere(0.5), // radius
    material: new CANNON.Material("wheel"), // this is the default material
};

const wheelBody1 = new MeshBody(wheel_body_specs);
wheelBody1.angularDamping = 0.4; // less 'slippery' wheels
// wheelBody1.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI / 2); // make it face up

const wheelBody2 = new MeshBody(wheel_body_specs);
wheelBody2.angularDamping = 0.4; // less 'slippery' wheels
// wheelBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI / 2);

const wheelBody3 = new MeshBody(wheel_body_specs);
wheelBody3.angularDamping = 0.4; // less 'slippery' wheels
// wheelBody3.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI / 2);

const wheelBody4 = new MeshBody(wheel_body_specs);
wheelBody4.angularDamping = 0.4; // less 'slippery' wheels
// wheelBody4.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI / 2);

// adding a wheel mesh
// const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 20);
const wheelGeometry = new THREE.SphereGeometry(0.5);
const wheelMaterial1 = new THREE.MeshPhysicalMaterial({metalness: .5}); // { color:  0xaaaaaa} 
const wheelMaterial2 = new THREE.MeshPhysicalMaterial({metalness: .5}); // { color:  0xaaaaaa} 
const wheelMaterial3 = new THREE.MeshPhysicalMaterial({metalness: 1.0}); // { color:  0x555555} 
const wheelMaterial4 = new THREE.MeshPhysicalMaterial({metalness: 1.0}); // { color:  0x555555}



wheelBody1.createMesh(wheelGeometry, wheelMaterial1, scene);
wheelBody2.createMesh(wheelGeometry, wheelMaterial2, scene);
wheelBody3.createMesh(wheelGeometry, wheelMaterial3, scene);
wheelBody4.createMesh(wheelGeometry, wheelMaterial4, scene);


const front_wheel_texture = new THREE.TextureLoader().load('OIG.jpeg', function(texture){
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 1, 1 );
    
    
    wheelBody1.mesh.material.map = texture;
    wheelBody1.mesh.material.needsUpdate = true;

    wheelBody2.mesh.material.map = texture;
    wheelBody2.mesh.material.needsUpdate = true;

    wheelBody3.mesh.material.map = texture;
    wheelBody3.mesh.material.needsUpdate = true;

    wheelBody4.mesh.material.map = texture;
    wheelBody4.mesh.material.needsUpdate = true;    

    console.log("wheel texture loaded");
});



const wheel_rot_axis1 = new CANNON.Vec3(1, 0, 0); // axis of rotation
const wheel_rot_axis2 = new CANNON.Vec3(1, 0, 0); // axis of rotation
const wheel_slide_dir = new CANNON.Vec3(1, 0, 0); // direction of slide

vehicle.addWheel({
    body: wheelBody1,
    position: new CANNON.Vec3(-1.3, -.25, 2.25),
    axis: wheel_rot_axis1,
    direction: wheel_slide_dir,
});

vehicle.addWheel({
    body: wheelBody2,
    position: new CANNON.Vec3(1.3, -.25, 2.25),
    axis: wheel_rot_axis1,
    direction: wheel_slide_dir,
});

vehicle.addWheel({
    body: wheelBody3,
    position: new CANNON.Vec3(-1.3, -.25, -2.25),
    axis: wheel_rot_axis2,
    direction: wheel_slide_dir,
});

vehicle.addWheel({
    body: wheelBody4,
    position: new CANNON.Vec3(1.3, -.25, -2.25),
    axis: wheel_rot_axis2,
    direction: wheel_slide_dir,
});


vehicle.addToWorld(world); // remember to add the vehicle to the world after adding wheels


// moving camera to car position
controls.target.copy(car.position); // set the controls target to the car position
controls.dampingFactor = 0.05; // set the damping factor of the controls
// controls.autoRotate = true; // set the autoRotate of the controls

controls.update(); // update the controls
controls.maxDistance = 10; // set the max distance of the controls
controls.minDistance = 5; // set the min distance of the controls


// 'activating' the debugger
// const cannonDebugger = new CannonDebugger(scene, world, { color: 0x00ffff });


const maxSteerVal = .5;
const maxForce = 700;


function animate() {
    // update physics
    // world.step(1 / 60); // 60 fps
    world.fixedStep();

    // cannonDebugger.update(); // update the debugger
    renderer.render( scene, camera ); // render the scene

    controls.target.copy(car.position);
    camera.position.y = 5; // set the camera position
    controls.update(); // update the controls

    
    // update vehicle
    const speed = vehicle.getWheelSpeed(0)
    const threshold = 100;
    
    
    if (key_states["up"]) {
        
        if (key_states["shift"]) {
            vehicle.applyWheelForce(1.5*maxForce, 0);
            vehicle.applyWheelForce(1.5*maxForce, 1);
        }
        else{
            vehicle.applyWheelForce(maxForce, 0);
            vehicle.applyWheelForce(maxForce, 1);
        }
    } else if (key_states["down"]) {
        vehicle.applyWheelForce(-maxForce, 0);
        vehicle.applyWheelForce(-maxForce, 1);
    } 
    else {
        vehicle.applyWheelForce(0, 0);
        vehicle.applyWheelForce(0, 1);
    }
    
    if (key_states["left"]) {
        vehicle.setSteeringValue(maxSteerVal, 0);
        vehicle.setSteeringValue(maxSteerVal, 1);
    } else if (key_states["right"]) {
        vehicle.setSteeringValue(-maxSteerVal, 0);
        vehicle.setSteeringValue(-maxSteerVal, 1);
    } else {
        vehicle.setSteeringValue(0, 0);
        vehicle.setSteeringValue(0, 1);
    }
    
    if (key_states["space"]) {
        if(Math.abs(speed) < threshold){
            vehicle.disableMotor(0);
            vehicle.disableMotor(1);
        }else if(speed > threshold){
            vehicle.applyWheelForce(-2*maxForce, 0);
            vehicle.applyWheelForce(-2*maxForce, 1);
        }else if(speed < -threshold){
            vehicle.applyWheelForce(2*maxForce, 0);
            vehicle.applyWheelForce(2*maxForce, 1);
        }
    }

    
	requestAnimationFrame( animate );
}

if (WebGL.isWebGLAvailable()){
    animate();        
}else{
    const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );
}


// adding event listeners
document.addEventListener('keydown', onKeyDownHandler, false);
document.addEventListener('keyup', onKeyUpHandler, false);


