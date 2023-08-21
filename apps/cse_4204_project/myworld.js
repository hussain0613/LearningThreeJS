import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export { MyWorld };

class MyWorld extends CANNON.World{
    step(dt){
        const ret_val = super.step(dt);
        for (const body of this.bodies) {
            if(body.update !== undefined) body.update();
        }
        return ret_val;
    }
}
