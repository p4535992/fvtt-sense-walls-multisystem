import { EffectDefinitions } from '../sensewalls-effect-definition';
import CONSTANTS from '../constants';
import { i18n } from '../lib/lib';
import { StatusEffectSightFlags, StatusSight } from '../sensewalls-models';

export default {
  HP_ATTRIBUTE: 'data.attributes.hp.value',
  // VISION_LEVEL: {
  //   BLINDED: 0,
  //   NORMAL: 1,
  //   LOW_LIGHT_VISION: 2,
  //   DARKVISION: 3,
  // },
  SENSES: <StatusSight[]>[
    {
      id: StatusEffectSightFlags.BLINDED,
      name: i18n(`${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.BLINDED}`),
      path: 'data.traits.senses.blinded',
      img: 'systems/dnd5e/icons/skills/affliction_24.jpg',
      effect: EffectDefinitions.blinded(0),
    },
    {
      id: StatusEffectSightFlags.LOW_LIGHT_VISION,
      name: i18n(`${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.LOW_LIGHT_VISION}`),
      path: 'data.traits.senses.lowlightvision',
      img: 'systems/dnd5e/icons/skills/violet_09.jpg',
      effect: EffectDefinitions.lowlightvision(0),
    },
    {
      id: StatusEffectSightFlags.DARKVISION,
      name: i18n(`${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.DARKVISION}`),
      path: 'data.traits.senses.darkvision',
      img: 'systems/dnd5e/icons/spells/evil-eye-red-1.jpg',
      effect: EffectDefinitions.darkvision(0),
    },
  ],
};
