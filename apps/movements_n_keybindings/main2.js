import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { key_bindings, key_states, onKeyDownHandler, onKeyUpHandler } from './utils';

export { scene, camera, renderer, car };

// setting up scene & camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( -5, 5, 0 );
camera.lookAt( 0, 0, 0 );


const renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight, true );
document.body.appendChild( renderer.domElement );

renderer.outputColorSpace = THREE.SRGBColorSpace;


// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 20);
directionalLight.position.set(-5, 5, 0).normalize();
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 5, 50);
pointLight.position.set(-5, 5, 0);
scene.add(pointLight);


// add plane
const plane = new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), 0 );
const helper = new THREE.PlaneHelper( plane, 200, 0xaaaaaa );
scene.add( helper );


var grid = new THREE.GridHelper( 200, 20 );
// grid.setColors( 0xffffff, 0xffffff );
scene.add( grid );



// add car
const geometry = new THREE.BoxGeometry( 2.5, .5, 1.5 );
const material = new THREE.MeshPhysicalMaterial( { color: 0x1199ff })
const car = new THREE.Mesh( geometry, material );
car.position.set(0, .5, 0)
scene.add( car );


var car_speed = 0;
var car_acceleration = 0.001;
var break_acceleration = -0.01;

function animate() {
    renderer.render( scene, camera );

    if (key_states["up"]) {
        car_speed += car_acceleration;
        if(key_states["shift"])
            car_speed += car_acceleration;
    }
    if (key_states["down"]) {
        car_speed -= car_acceleration;
        if(key_states["shift"])
            car_speed -= car_acceleration;
    }

    if (key_states["space"]) {
        if (car_speed < break_acceleration)
            car_speed -= break_acceleration;
        else if (car_speed > -break_acceleration)
            car_speed += break_acceleration;
        else
            car_speed = 0;
    }

    // if (key_states["shift"]) {
    //     car_speed += 2*car_acceleration;
    // }

    if (car){
        if (key_states["left"]) {
            car.rotation.y += 0.01;
        }
        if (key_states["right"]) {
            car.rotation.y -= 0.01;
        }
    
        car.position.x += car_speed * Math.cos(car.rotation.y);
        car.position.z -= car_speed * Math.sin(car.rotation.y);

        camera.position.x += .75*car_speed * Math.cos(car.rotation.y); 
        camera.position.z -= .75*car_speed * Math.sin(car.rotation.y);

        camera.lookAt(car.position);
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
    // console.log(car.position);
    // console.log(car_speed);
    onKeyDownHandler(ev);
}, false);

window.addEventListener("keyup", ev => {
    console.log(car.position);
    onKeyUpHandler(ev);
}
, false);
