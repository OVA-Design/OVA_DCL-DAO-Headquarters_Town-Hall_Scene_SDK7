import {
  Entity,
  engine,
  Transform,
  MeshRenderer,
  MeshCollider,
  GltfContainer,
  TransformType,
  ColliderLayer,
  Material,
  VideoPlayer,
  pointerEventsSystem,
  InputAction
} from '@dcl/sdk/ecs'
import { Color3, Quaternion } from '@dcl/sdk/math'

// Cube factory
export function createGLTF(transform: Partial<TransformType>, src: string): Entity {
  const meshEntity = engine.addEntity()
  Transform.create(meshEntity, transform)

  // set gltf
  GltfContainer.create(meshEntity, { src })

  return meshEntity
}

///// Play videos
//#region playMedia

// Use this component to fetch the screen entity
export const ScreenComponent = engine.defineComponent('screen-component', {})

export function screen(transform: Partial<TransformType>) {
  const screenBody = createGLTF(transform, 'models/screen.glb')

  // Screen
  const screenDisplay = engine.addEntity()
  Transform.create(screenDisplay, {
    parent: screenBody,
    position: { x: 14, y: 10.5, z: 14 },
    scale: { x: 1, y: 0.5625, z: 1 }
  })

  const screen = engine.addEntity()
  MeshRenderer.setPlane(screen)
  MeshCollider.setPlane(screen, ColliderLayer.CL_POINTER | ColliderLayer.CL_PHYSICS)
  Transform.create(screen, {
    parent: screenDisplay,
    scale: { x: 10, y: 10, z: 10 },
    rotation: Quaternion.fromEulerDegrees(0, 45, 0)
  })

  VideoPlayer.create(screen, {
    src: 'textures/video.mp4',
    playing: false,
    loop: false,
    volume: 0.1
  })

  const videoTexture = Material.Texture.Video({ videoPlayerEntity: screen })

  Material.setPbrMaterial(screen, {
    texture: videoTexture,
    emissiveTexture: videoTexture,
    emissiveIntensity: 2,
    emissiveColor: Color3.White(),
    roughness: 1.0
  })

  pointerEventsSystem.onPointerDown(
    screen,
    () => {
      const videoPlayer = VideoPlayer.getMutable(screen)
      videoPlayer.playing = !videoPlayer.playing
    },
    { button: InputAction.IA_POINTER, hoverText: 'Play/pause' }
  )
}
//#endregion
