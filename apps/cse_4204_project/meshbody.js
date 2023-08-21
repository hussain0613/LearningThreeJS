import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export { MeshBody };

class MeshBody extends CANNON.Body{
    setMesh(mesh, scene=undefined){
        this.mesh = mesh;
        
        this.mesh.position.copy(this.position);
        this.mesh.quaternion.copy(this.quaternion);

        if(scene != undefined) scene.add(this.mesh);
    }
    createMesh(geometry, material, scene=undefined){
        this.setMesh(new THREE.Mesh(geometry, material), scene);
    }
    update(){
        if(this.mesh == undefined) {
            return;
        }
        this.mesh.position.copy(this.position);
        this.mesh.quaternion.copy(this.quaternion);
    }
}
