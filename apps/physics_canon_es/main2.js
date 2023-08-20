import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';


import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { key_states, onKeyDownHandler, onKeyUpHandler } from './utils';

export { scene, camera, renderer };

// setting up scene & camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 5, 5, 5 );
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
const axesHelper = new THREE.AxesHelper( 200 ); // color: x = red, y = green, z = blue
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

groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // make it face up
world.addBody(groundBody); // add to the world

// groundBody.shapeOrientations[0].setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2); // make it face up


// adding light
// ambient light
const ambientLight = new THREE.AmbientLight( 0xffffff, 10 ); // soft white light
scene.add( ambientLight );



// adding a car body
const carBody = new CANNON.Body({
    mass: 2000, // kg
    shape: new CANNON.Box(new CANNON.Vec3(1, 0.5, 2.5)), // 1m x 0.5m x 2.5m
    material: new CANNON.Material(), // this is the default material
    // type: CANNON.Body.DYNAMIC, // can also be achieved by setting the mass to something other than 0
});

carBody.position.set(0, 5, 0); // x, y, z
// world.addBody(carBody); // add to the world


// adding 'vehicle' constraints
const vehicle = new CANNON.RigidVehicle({ chassisBody: carBody });


// vehicle.addToWorld(world);

// adding wheels

// wheel body
const wheel_body_specs = {
    mass: 15, // kg
    // shape: new CANNON.Cylinder(0.5, 0.5, 0.5, 20), // radiusTop, radiusBottom, height, numSegments
    shape: new CANNON.Sphere(0.5), // radius
    material: new CANNON.Material("wheel"), // this is the default material
};

const wheelBody1 = new CANNON.Body(wheel_body_specs);
wheelBody1.angularDamping = 0.4; // less 'slippery' wheels
wheelBody1.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI / 2); // make it face up

const wheelBody2 = new CANNON.Body(wheel_body_specs);
wheelBody2.angularDamping = 0.4; // less 'slippery' wheels
wheelBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI / 2);

const wheelBody3 = new CANNON.Body(wheel_body_specs);
wheelBody3.angularDamping = 0.4; // less 'slippery' wheels
wheelBody3.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI / 2);

const wheelBody4 = new CANNON.Body(wheel_body_specs);
wheelBody4.angularDamping = 0.4; // less 'slippery' wheels
wheelBody4.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI / 2);


const wheel_rot_axis1 = new CANNON.Vec3(1, 0, 0); // axis of rotation
// const wheel_rot_axis2 = new CANNON.Vec3(1, 0, 0); // axis of rotation
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
    axis: wheel_rot_axis1,
    direction: wheel_slide_dir,
});

vehicle.addWheel({
    body: wheelBody4,
    position: new CANNON.Vec3(1.3, -.25, -2.25),
    axis: wheel_rot_axis1,
    direction: wheel_slide_dir,
});


vehicle.addToWorld(world); // remember to add the vehicle to the world after adding wheels




// adding a car mesh
const carGeometry = new THREE.BoxGeometry(2, 1, 5);
const carMaterial = new THREE.MeshPhysicalMaterial({ color: 0x00ffff });
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.copy(carBody.position);
car.quaternion.copy(carBody.quaternion);
scene.add(car); // add to the scene

controls.target.copy(car.position); // set the controls target to the car position
controls.update(); // update the controls
controls.maxDistance = 10; // set the max distance of the controls
controls.minDistance = 5; // set the min distance of the controls


// adding a wheel mesh
// const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 20);
const wheelGeometry = new THREE.SphereGeometry(0.5, 20, 20);
const wheelMaterial1 = new THREE.MeshPhysicalMaterial({ color: 0xff5555 });
const wheelMaterial2 = new THREE.MeshPhysicalMaterial({ color: 0x55ff55 });
const wheelMaterial3 = new THREE.MeshPhysicalMaterial({ color: 0x5555ff });
const wheelMaterial4 = new THREE.MeshPhysicalMaterial({ color: 0x555555 });


const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial1);
wheel1.position.copy(wheelBody1.position);
wheel1.quaternion.copy(wheelBody1.quaternion);
scene.add(wheel1); // add to the scene

const wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial2);
wheel2.position.copy(wheelBody2.position);
wheel2.quaternion.copy(wheelBody2.quaternion);
scene.add(wheel2); // add to the scene

const wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial3);
wheel3.position.copy(wheelBody3.position);
wheel3.quaternion.copy(wheelBody3.quaternion);
scene.add(wheel3); // add to the scene

const wheel4 = new THREE.Mesh(wheelGeometry, wheelMaterial4);
wheel4.position.copy(wheelBody4.position);
wheel4.quaternion.copy(wheelBody4.quaternion);
scene.add(wheel4); // add to the scene



// 'activating' the debugger
const cannonDebugger = new CannonDebugger(scene, world, { color: 0x00ffff });


const maxSteerVal = 0.5;
const maxForce = 700;


function animate() {
    // update physics
    world.step(1 / 60); // 60 fps
    cannonDebugger.update(); // update the debugger
    renderer.render( scene, camera ); // render the scene

    controls.target.copy(car.position);
    controls.update(); // update the controls

    // update car position
    car.position.copy(carBody.position);
    car.quaternion.copy(carBody.quaternion);
    
    wheel1.position.copy(wheelBody1.position);
    wheel1.quaternion.copy(wheelBody1.quaternion);

    wheel2.position.copy(wheelBody2.position);
    wheel2.quaternion.copy(wheelBody2.quaternion);

    wheel3.position.copy(wheelBody3.position);
    wheel3.quaternion.copy(wheelBody3.quaternion);

    wheel4.position.copy(wheelBody4.position);
    wheel4.quaternion.copy(wheelBody4.quaternion);

    // update vehicle
    const speed = vehicle.getWheelSpeed(0)
    const threshold = 1;
    
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
            // vehicle.setMotorSpeed(0, 0);
            // vehicle.setMotorSpeed(0, 1);
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


