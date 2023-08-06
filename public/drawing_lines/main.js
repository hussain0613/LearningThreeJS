import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 ); // Rotate the object to face the given point (in world space), in case of camera, it literelly looks at the point.

const scene = new THREE.Scene();

/*
Two types of line materials
*/

//create a blue LineBasicMaterial
const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

const points = [];
points.push( new THREE.Vector3( - 10, 0, 0 ) );
points.push( new THREE.Vector3( 0, 10, 0 ) );
points.push( new THREE.Vector3( 10, 0, 0 ) );

const geometry = new THREE.BufferGeometry().setFromPoints( points );

const line = new THREE.Line( geometry, material ); // creates line from each pair of consecutive points

scene.add( line );

//create a red LineDashedMaterial
const material2 = new THREE.LineDashedMaterial( { color: 0xff0000 } );

const points2 = [];
points2.push( new THREE.Vector3( - 8, 0, 0 ) );
points2.push( new THREE.Vector3( 0, 8, 0 ) );
points2.push( new THREE.Vector3( 8, 0, 0 ) );

const geometry2 = new THREE.BufferGeometry().setFromPoints( points2 );

const line2 = new THREE.Line( geometry2, material2 );

scene.add( line2 );

if (WebGL.isWebGLAvailable()){
    renderer.render( scene, camera );
}else{
    const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );
}
