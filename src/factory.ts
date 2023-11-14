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
import { ScreenComponent } from './components'

// import glft factory
export function createGLTF(transform: Partial<TransformType>, src: string): Entity {
  const meshEntity = engine.addEntity()
  Transform.create(meshEntity, transform)

  // set gltf
  GltfContainer.create(meshEntity, { src })

  return meshEntity
}


// Setup streaming screen
//#region

export function screen(transform: Partial<TransformType>) {
  const screenBody = createGLTF(transform, 'models/screen.glb')

  // Screen
  const screenDisplay = engine.addEntity()
  Transform.create(screenDisplay, {
    parent: screenBody,
    position: { x: 14, y: 10.5, z: 14 },
    scale: { x: 1, y: 0.5625, z: 1 }
  })

  // Screen video
  const screen = engine.addEntity()
  ScreenComponent.create(screen)
  MeshRenderer.setPlane(screen)
  MeshCollider.setPlane(screen, ColliderLayer.CL_POINTER | ColliderLayer.CL_PHYSICS)
  Transform.create(screen, {
    parent: screenDisplay,
    scale: { x: 10, y: 10, z: 10 },
    rotation: Quaternion.fromEulerDegrees(0, 45, 0)
  })

  //// Play videos Media
  // VideoPlayer.create(screen, {
  //   src: 'textures/video.mp4',
  //   playing: false,
  //   loop: false,
  //   volume: 0.1
  // })
  
  const videoTexture = Material.Texture.Video({ videoPlayerEntity: screen })

  Material.setPbrMaterial(screen, {
    texture: videoTexture,
    emissiveTexture: videoTexture,
    emissiveIntensity: 2,
    emissiveColor: Color3.Blue(),
    roughness: 1.0
  })

  // pointerEventsSystem.onPointerDown(
  //   screen,
  //   () => {
  //     const videoPlayer = VideoPlayer.getMutable(screen)
  //     videoPlayer.playing = !videoPlayer.playing
  //   },
  //   { button: InputAction.IA_POINTER, hoverText: 'Play/pause' }
  // )

  
}
//#endregion
