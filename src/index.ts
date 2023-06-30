import {
  ColliderLayer,
  engine,
  Entity,
  MeshRenderer,
  MeshCollider,
  Transform,
  GltfContainer,
  PBMaterial,
  Material,
  InputAction,
  pointerEventsSystem,
  VideoPlayer
} from '@dcl/sdk/ecs'
import * as utils from '@dcl-sdk/utils'
import { Vector3, Quaternion, Color3 } from '@dcl/sdk/math'
import { createGLTF } from './factory'
import { movePlayerTo } from '~system/RestrictedActions'

// export all the functions required to make the scene work
// export * from '@dcl/sdk'

// export function main() {
  /// import glb models into scene

  /// landscape
  const landscapeEntity = engine.addEntity()
  GltfContainer.create(landscapeEntity, {
    src: 'models/Landscape.glb'
  })
  Transform.create(landscapeEntity, {
    position: { x: 24, y: 0, z: 24 }
  })

  /// building
  const buildingEntity = engine.addEntity()
  GltfContainer.create(buildingEntity, {
    src: 'models/Pyramid.glb'
  })
  Transform.create(buildingEntity, {
    position: { x: 24, y: 0, z: 24 }
  })

  /// moon
  const moonEntity = engine.addEntity()
  GltfContainer.create(moonEntity, {
    src: 'models/Moon.glb'
  })
  Transform.create(moonEntity, {
    position: { x: 24, y: 0, z: 24 }
  })

  ///eth
  const ethEntity = createGLTF({ position: { x: 24, y: 0, z: 24 } }, 'models/eth.glb')

  utils.perpetualMotions.startRotation(moonEntity, Quaternion.fromEulerDegrees(0, 5, 0))

  //// moving only horizontal
  // startPath(moonEntity, [Vector3.create(24, 0, 24), Vector3.create(24, 0, 32), Vector3.create(24, 0, 24)], 15, false, true)
  // function startPath(entity: Entity, path: Vector3[], duration: number, facePath?: boolean, loop?: boolean) {
  //   utils.paths.startStraightPath(entity, path, duration, false, function () {
  //     if (loop) startPath(entity, path, duration, facePath, loop)
  //   })
  // }

  // const worldPos = utils.getWorldPosition(moonEntity)
  // console.log(`${worldPos.x} ${worldPos.y}+50 ${worldPos.z}`)

  // const worldRot = Quaternion.toEulerAngles(
  //   utils.getWorldRotation(moonEntity)
  // )
  // console.log(`${worldRot.x} ${worldRot.y} ${worldRot.z}`)

  Quaternion.toEulerAngles(utils.getWorldRotation(moonEntity)).y

  // container to hold Teleport
  const Teleport = engine.defineComponent('teleport-id', {})

  // teleport box
  const transportBox = engine.addEntity()
  Teleport.create(transportBox)
  MeshRenderer.setSphere(transportBox)
  Transform.create(transportBox, { position: Vector3.create(17.4, 14.5, 17.4) })

  const isPlayerNearBox = (playerPos: Vector3, boxPos: Vector3, hitRange: number) => {
    // Calculate the difference between the player position and the box position
    const diff = {
      x: Math.abs(playerPos.x - boxPos.x),
      y: Math.abs(playerPos.y - boxPos.y),
      z: Math.abs(playerPos.z - boxPos.z)
    }

    // Check if the difference is less than or equal to the given number in all dimensions
    return diff.x <= hitRange && diff.y <= hitRange && diff.z <= hitRange
  }

  const transportSystem = () => {
    if (!Transform.get(engine.PlayerEntity)) return // prevents crash on first render

    const teleports = engine.getEntitiesWith(Teleport)
    for (const [entity] of teleports) {
      const boxPosition = Transform.get(entity).position
      const playerPosition = Transform.get(engine.PlayerEntity).position

      const canTeleport = isPlayerNearBox(playerPosition, boxPosition, 1)
      if (canTeleport) {
        const mutablePlayerEntity = Transform.getMutable(engine.PlayerEntity)
        // mutablePlayerEntity.position = worldRot //teleported position
        // mutablePlayerEntity.position = Vector3.create(32.5, 50, 18.5)
        // mutablePlayerEntity.position = Vector3.create(
        movePlayerTo({ newRelativePosition: Vector3.create(
          24 + 10 * Math.cos(Quaternion.toEulerAngles(utils.getWorldRotation(moonEntity)).y * (Math.PI / 180) * -1),
          50,
          24 + 10 * Math.sin(Quaternion.toEulerAngles(utils.getWorldRotation(moonEntity)).y * (Math.PI / 180) * -1)
        )
      })
      }
    }
  }

  engine.addSystem(transportSystem)

  ///Play videos
  // screen GLB
  const screenBody = createGLTF({ position: { x: 24, y: 0, z: 24 } }, 'models/screen.glb')
  // Screen
  const screenDisplay = engine.addEntity()
  Transform.create(screenDisplay, {
    parent: screenBody,
    position: { x: 15.45, y: 9, z: 15.45 },
    scale: { x: 0.75, y: 0.45, z: 0.75 }
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
    playing: true,
    loop: true,
    volume: 0.3
  })

  const videoTexture = Material.Texture.Video({ videoPlayerEntity: screen })

  Material.setPbrMaterial(screen, {
    texture: videoTexture,
    emissiveTexture: videoTexture,
    emissiveIntensity: 2,
    emissiveColor: Color3.White(),
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

  // // #1
  // const screen = engine.addEntity()
  // MeshRenderer.setPlane(screen)
  // Transform.create(screen, { position: { x: 24, y: 1, z: 24 } })
  // // #2
  // VideoPlayer.create(screen, {
  // src: "videos\cc_video.mp4",
  // playing: true
  // })
  // // #3
  // const videoTexture = Material.Texture.Video({ videoPlayerEntity: screen })
  // // #4
  // Material.setPbrMaterial(screen, {
  // texture: videoTexture,
  // roughness: 1.0,
  // specularIntensity: 0,
  // metallic: 0,
  // })
// }
