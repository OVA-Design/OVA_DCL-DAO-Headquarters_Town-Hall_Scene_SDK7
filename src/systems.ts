
import { getActiveVideoStreams } from '~system/CommsApi'
import { updateTracks } from './ui'
import { TeleportComponent } from "./components"
import { Transform, engine } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { movePlayerTo } from '~system/RestrictedActions'
import * as utils from '@dcl-sdk/utils'
import { moonEntity } from '.'


// Fetch the streams every 5 seconds
let refreshInterval = 0
export function fetchStreamsSystem(dt: number) {
  refreshInterval -= dt
  if (refreshInterval <= 0) {
    getActiveVideoStreams({}).then(({ streams }) => {
      updateTracks(streams)
    })
    refreshInterval = 5
  }
}


// Define the Teleport System
export function transportSystem() {

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

  if (!Transform.get(engine.PlayerEntity)) return // prevents crash on first render
  const activePortal = engine.getEntitiesWith(TeleportComponent)
  for (const [entity, portal] of activePortal) {
    const boxPosition = Transform.get(entity).position
    const playerPosition = Transform.get(engine.PlayerEntity).position
    const canTeleport = isPlayerNearBox(playerPosition, boxPosition, 1)
    if (canTeleport) {
      movePlayerTo({
        newRelativePosition: Vector3.create(
          24 + 10 * Math.cos(Quaternion.toEulerAngles(utils.getWorldRotation(moonEntity)).y * (Math.PI / 180) * -1),
          50,
          24 + 10 * Math.sin(Quaternion.toEulerAngles(utils.getWorldRotation(moonEntity)).y * (Math.PI / 180) * -1)
        )
      })
      console.log("teleported")
    }
  }
}
