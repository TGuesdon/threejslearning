import { OrbitControls, Stars } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Physics, useBox } from "@react-three/cannon"
import { useRef } from "react"
import { Mesh } from "three"

const Box: React.FC = () => {
    const [ref, api] = useBox(() => ({ mass: 1, position: [0, 2, 0] }), useRef<Mesh>(null))
    return (<mesh ref={ref}>
        <boxGeometry />
        <meshStandardMaterial color="pink"/>
    </mesh>)
}

const Ground: React.FC = () => {
    const [ref, api] = useBox(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0,0,0] }), useRef<Mesh>(null))
    return <mesh ref={ref}>
        <planeBufferGeometry args={[100,100]}></planeBufferGeometry>
        <meshStandardMaterial color="green"></meshStandardMaterial>
    </mesh>
}

export const ControlsScene: React.FC = () => {
    return (
        <Canvas camera={{position: [0, 1, -5]}}>
            <Stars></Stars>
            <OrbitControls></OrbitControls>
            <ambientLight color={"#f5be8c"} />
            <pointLight
                position={[10, 10, 10]}
                color={"#f52c9e"}
            />
            <Physics>
                <Ground></Ground>
                <Box></Box>
            </Physics>
        </Canvas>
    )
}