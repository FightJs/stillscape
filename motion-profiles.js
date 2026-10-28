/** Per-artwork motion calibration. All rates use the engine's shared scaled clock. */
const profiles = {
  '00': {water:2.8,cloud:2.2,sprite:3.2,flow:1,particle:1},
  '01': {water:2.5,cloud:2.8,sprite:1,flow:1,particle:1},
  '02': {water:3.8,cloud:1.6,sprite:1,flow:3.5,particle:1},
  '03': {water:5.5,cloud:2.8,sprite:3.4,flow:1,particle:1},
  '04': {water:8,cloud:1,sprite:1,flow:1,particle:1.6},
  '05': {water:1,cloud:2.2,sprite:2.5,flow:1,particle:1},
  '06': {water:2.4,cloud:1.8,sprite:1,flow:1,particle:1.5},
  '07': {water:1,cloud:1,sprite:1,flow:1,particle:1},
  '08': {water:1,cloud:2.1,sprite:1,flow:4,particle:1},
  '09': {water:2.4,cloud:1.5,sprite:1,flow:1,particle:1},
  '10': {water:1,cloud:2.4,sprite:1,flow:1,particle:1.5},
  '11': {water:1.5,cloud:1,sprite:1,flow:1,particle:3.6},
  '12': {water:2.1,cloud:2.2,sprite:1,flow:1,particle:1},
  '13': {water:1,cloud:1,sprite:1,flow:1,particle:3.6},
  '14': {water:1,cloud:1,sprite:1,flow:1,particle:1},
  '15': {water:1,cloud:1,sprite:1,flow:1,particle:3.8},
};
export function motionProfile(scene){return {...{water:1,cloud:1,sprite:1,flow:1,particle:1},...profiles[String(scene.id).slice(0,2)],...scene.motionProfile};}
export default profiles;
