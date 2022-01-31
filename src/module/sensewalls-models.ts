import Effect from './effects/effect';
import { error } from './lib/lib';

// export interface StatusEffect {
//   id: string;
//   visibilityId: string;
//   name: string;
//   img: string;
// }

export interface StatusSight {
  id: string;
  name: string;
  path: string;
  img: string;
  effect: Effect;
  pathOri?:string;
}

export enum StatusEffectSightFlags {
  DARKVISION = 'darkvision',
  SEE_INVISIBLE = 'seeinvisible',
  BLIND_SIGHT = 'blindsight',
  TREMOR_SENSE = 'tremorsense',
  TRUE_SIGHT = 'truesight',
  DEVILS_SIGHT = 'devilssight',
  PASSIVE_STEALTH = '_ste',
  PASSIVE_PERCEPTION = '_prc',
  // additional PF2E
  LOW_LIGHT_VISION = 'lowlightvision',
  BLINDED = 'blinded',
}

// class VisionLevel {
//   static BLIND = -1;
//   static NORMAL = 0;
//   static LOW_LIGHT_VISION = 1;
//   static DARKVISION = 2;
//   static GREATER_DARKVISION = 3;
//   static NONE = 4; // A special, unattainable vision level
// }
