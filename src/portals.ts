import { engine, MeshRenderer, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { TeleportComponent } from './components'

export function createPortal() {
  // Teleport Portal
  const portal = engine.addEntity()
  Transform.create(portal, { position: Vector3.create(17.4, 14.5, 17.4) })
  MeshRenderer.setSphere(portal)
  TeleportComponent.create(portal)
  // console.log('portal created', portal)
}
