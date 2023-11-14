import { engine } from "@dcl/sdk/ecs";

export const TeleportComponent = engine.defineComponent('portalFlag', {})

// Use this component to fetch the screen entity
export const ScreenComponent = engine.defineComponent('screen-component', {})
