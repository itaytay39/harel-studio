'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const VERTEX = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;

  attribute float aSize;
  attribute float aSpeed;
  attribute float aOffset;

  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Organic motion — unique sine path per particle
    pos.x += sin(uTime * aSpeed + aOffset) * 0.09;
    pos.y += cos(uTime * aSpeed * 0.7 + aOffset * 1.3) * 0.07;
    pos.z += sin(uTime * aSpeed * 0.5 + aOffset * 0.8) * 0.05;

    // Mouse attraction
    vec2 mouse = uMouse - vec2(0.5);
    pos.x += mouse.x * (1.0 - abs(pos.z) * 0.08) * 0.4;
    pos.y -= mouse.y * (1.0 - abs(pos.z) * 0.08) * 0.3;

    // Scroll — particles rush forward
    pos.z += uScroll * 3.0;
    if (pos.z > 3.5) pos.z -= 14.0;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    float dist = -mvPos.z;

    gl_PointSize = aSize * (280.0 / dist);
    gl_PointSize = clamp(gl_PointSize, 0.4, 4.5);

    vAlpha = smoothstep(9.0, 1.5, dist);
    gl_Position = projectionMatrix * mvPos;
  }
`

const FRAGMENT = `
  uniform float uTime;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;

    float strength = pow(1.0 - d * 2.0, 1.6);
    float pulse = sin(uTime * 0.6) * 0.08 + 0.92;

    vec3 colorFar  = vec3(0.10, 0.29, 0.54); // #1a4a8a
    vec3 colorNear = vec3(0.29, 0.62, 1.00); // #4a9eff

    vec3 color = mix(colorFar, colorNear, vAlpha);

    gl_FragColor = vec4(color, strength * vAlpha * pulse * 0.75);
  }
`

const COUNT = 8000

export interface ParticleFieldProps {
  mouseX: number
  mouseY: number
  scrollProgress: number
}

export const ParticleField = ({ mouseX, mouseY, scrollProgress }: ParticleFieldProps) => {
  const ref = useRef<THREE.Points>(null)

  const { positions, sizes, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const sizes     = new Float32Array(COUNT)
    const speeds    = new Float32Array(COUNT)
    const offsets   = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 16
      positions[i * 3 + 1] = (Math.random() - 0.5) * 11
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14
      sizes[i]   = Math.random() * 2.5 + 0.5
      speeds[i]  = Math.random() * 0.4 + 0.08
      offsets[i] = Math.random() * Math.PI * 2
    }

    return { positions, sizes, speeds, offsets }
  }, [])

  const uniforms = useMemo(() => ({
    uTime:   { value: 0 },
    uMouse:  { value: new THREE.Vector2(0.5, 0.5) },
    uScroll: { value: 0 },
  }), [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const m = ref.current.material as THREE.ShaderMaterial
    m.uniforms.uTime.value   = clock.elapsedTime
    m.uniforms.uMouse.value.set(mouseX, mouseY)
    m.uniforms.uScroll.value = scrollProgress
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          args={[speeds, 1]}
        />
        <bufferAttribute
          attach="attributes-aOffset"
          args={[offsets, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
