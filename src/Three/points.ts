import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import * as THREE from 'three';

const loader = new OBJLoader();


export const SamplePoints = (path: string, counts: number[], res: any[], index: number, options?: { scale: number, translation: number[] }) => {
  const scale = options?.scale || 1;
  const translation = options?.translation || [0, 0, 0];
  loader.load(
    path,
    (obj) => {
      //console.log(path + " : " + obj.children.length);
      const samples: number[][] = [];
      
      obj.children.forEach((child, i) => {
        //@ts-ignore
        const sampler = new MeshSurfaceSampler(child)
          .setWeightAttribute(null)
          .build();
        
        for (let j = 0; j < counts[i]; j++) {
          const position = new THREE.Vector3();
          sampler.sample(position);
          samples.push([
            position.x * scale + translation[0],
            position.y * scale + translation[1],
            position.z * scale + translation[2]
          ]);
        }
      });

      res[index] = samples;
    },
    () => {},
    (error) => {console.log(error);}
  );
}