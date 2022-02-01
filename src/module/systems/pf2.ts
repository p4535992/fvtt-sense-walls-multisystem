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
      id: StatusEffectSightFlags.NONE,
      name: i18n(`${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.NONE}`),
      path: '',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/light_01.jpg`,
      effect: undefined,
      visionLevelMin: -2,
      visionLevelMax: -1,
    },
    {
      id: StatusEffectSightFlags.BLINDED,
      name: i18n(`${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.BLINDED}`),
      path: 'data.traits.senses.blinded',
      // img: 'systems/dnd5e/icons/skills/affliction_24.jpg',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/affliction_24.jpg`,
      effect: EffectDefinitions.blinded(0),
      visionLevelMin: -1,
      visionLevelMax: 0,
    },
    {
      id: StatusEffectSightFlags.BLINDED,
      name: i18n(`${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.NORMAL}`),
      path: 'data.traits.senses.blinded',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/light_02.jpg`,
      effect: EffectDefinitions.blinded(0),
      visionLevelMin: 0,
      visionLevelMax: 1,
    },
    {
      id: StatusEffectSightFlags.LOW_LIGHT_VISION,
      name: i18n(`${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.LOW_LIGHT_VISION}`),
      path: 'data.traits.senses.lowlightvision',
      // img: 'systems/dnd5e/icons/skills/violet_09.jpg',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/violet_09.jpg`,
      effect: EffectDefinitions.lowlightvision(0),
      visionLevelMin: 1,
      visionLevelMax: 2
    },
    {
      id: StatusEffectSightFlags.DARKVISION,
      name: i18n(`${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.DARKVISION}`),
      path: 'data.traits.senses.darkvision',
      // img: 'systems/dnd5e/icons/spells/evil-eye-red-1.jpg',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/evil-eye-red-1.jpg`,
      effect: EffectDefinitions.darkvision(0),
      visionLevelMin: 2,
      visionLevelMax: 3
    },
    {
      id: StatusEffectSightFlags.GREATER_DARKVISION,
      name: i18n(`${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.GREATER_DARKVISION}`),
      path: 'data.traits.senses.greaterdarkvision',
      // img: 'systems/dnd5e/icons/spells/evil-eye-eerie-1.jpg',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/evil-eye-eerie-1.jpg`,
      effect: EffectDefinitions.darkvision(120),
      visionLevelMin: 3,
      visionLevelMax: 4
    },
  ],
};
