import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Mesh, Vector2 } from "three";
const glsl = require("babel-plugin-glsl/macro");

const numberOfSeeds = 20;

const vertexShader = glsl`
    varying vec2 v_position;

    void main(){
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;

        v_position = uv;

        gl_Position = projectedPosition;   
    }
`;

const fragmentShader = glsl`
    uniform vec2 u_seeds[${numberOfSeeds}];

    varying vec2 v_position;


    void main(){
        float min_dist = 2.0;
        int nearest_seed_idx = 0;

        for(int i = 0; i < ${numberOfSeeds}; i++){
            float dist = sqrt(pow(u_seeds[i].x - v_position.x, 2.0) + pow(u_seeds[i].y - v_position.y, 2.0));
            if(dist < min_dist){
                min_dist = dist;
                nearest_seed_idx = i;
            }
        }

        float red = float(nearest_seed_idx) / 20.0;

        gl_FragColor = vec4(red,0.0,0.0,1.0);
    }
`;

const VoronoiPlane: React.FC<{ seeds: { x: number; y: number }[] }> = ({ seeds }) => {
    const ref = useRef<Mesh>(null);

    const uniforms = useMemo(
        () => ({
            u_seeds: {
                value: seeds.map((s) => new Vector2(s.x, s.y)),
            },
        }),
        [seeds]
    );

    return (
        <mesh ref={ref} rotation={[0, -Math.PI, 0]}>
            <planeGeometry args={[1, 1, 100, 100]}></planeGeometry>
            <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms}></shaderMaterial>
        </mesh>
    );
};

export const VoronoiScene: React.FC = () => {
    const seeds = useMemo(() => {
        let res = [];
        for (let i = 0; i < numberOfSeeds; i++) {
            res.push({ x: Math.random(), y: Math.random() });
        }

        return res;
    }, []);

    return (
        <Canvas camera={{ position: [0, 1, -10] }}>
            <OrbitControls></OrbitControls>

            <ambientLight color={"#f5be8c"} />
            <VoronoiPlane seeds={seeds}></VoronoiPlane>
        </Canvas>
    );
};
