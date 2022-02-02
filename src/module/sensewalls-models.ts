import Effect from './effects/effect';
import { error } from './lib/lib';

export interface StatusSight {
  id: string;
  name: string;
  path: string;
  img: string;
  // effect: Effect;
  visionLevelMin: number;
  visionLevelMax: number;
  checkElevation: boolean;
  pathOri?: string;
}

export enum StatusEffectSightFlags {
  // additional generic
  NONE = 'none',
  NORMAL = 'normal',
  // additional dnd5e and pf2e
  DARKVISION = 'darkvision',
  SEE_INVISIBLE = 'seeinvisible',
  BLIND_SIGHT = 'blindsight',
  TREMOR_SENSE = 'tremorsense',
  TRUE_SIGHT = 'truesight',
  DEVILS_SIGHT = 'devilssight',
  PASSIVE_STEALTH = '_ste',
  PASSIVE_PERCEPTION = '_prc',
  // additional PF2E
  GREATER_DARKVISION = 'greaterdarkvision',
  LOW_LIGHT_VISION = 'lowlightvision',
  BLINDED = 'blinded',
}

// export class VisionLevelPf2e {
//   static BLINDED = -1;
//   static NORMAL = 0;
//   static LOW_LIGHT_VISION = 1;
//   static DARKVISION = 2;
//   static GREATER_DARKVISION = 3;
//   static NONE = 4; // A special, unattainable vision level
// }
