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
import { createGLTF, screen } from './factory'
import { fetchStreamsSystem, transportSystem } from './systems'
import { createPortal } from './portals'
import { TeleportComponent } from './components'
import { setupUi } from './ui'
// export * from '@dcl/sdk'


export function main() {
  //// Import glb models into scene
  // landscape
  const landscapeEntity = engine.addEntity()
  GltfContainer.create(landscapeEntity, { src: 'models/Landscape.glb' })
  Transform.create(landscapeEntity, { position: { x: 24, y: 0, z: 24 } })

  // building
  const buildingEntity = engine.addEntity()
  GltfContainer.create(buildingEntity, { src: 'models/Pyramid.glb' })
  Transform.create(buildingEntity, { position: { x: 24, y: 0, z: 24 } })

  // eth beacon
  const ethEntity = createGLTF({ position: { x: 24, y: 0, z: 24 } }, 'models/eth.glb')

  // create teleport start portal
  createPortal()

  //// Streaming Setup
  // Screen
  screen({ position: { x: 24, y: 0, z: 24 } })

  setupUi()
  
}

// import moon glb model and export for system
export const moonEntity = engine.addEntity()
GltfContainer.create(moonEntity, { src: 'models/Moon.glb' })
Transform.create(moonEntity, { position: { x: 24, y: 0, z: 24 } })
utils.perpetualMotions.startRotation(moonEntity, Quaternion.fromEulerDegrees(0, 5, 0))

// add portal teleport transport system
engine.addSystem(transportSystem)

// add streaming system
engine.addSystem(fetchStreamsSystem)
