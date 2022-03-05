import { SenseWallsMultisystemEffectDefinitions } from '../sensewalls-effect-definition';
import CONSTANTS from '../constants';
import { i18n } from '../lib/lib';
import { AtswmEffectSenseFlags, SenseData } from '../sensewalls-models';

export default {
  HP_ATTRIBUTE: 'data.attributes.hp.value',
  // VISION_LEVEL: {
  //   BLINDED: 0,
  //   NORMAL: 1,
  //   LOW_LIGHT_VISION: 2,
  //   DARKVISION: 3,
  // },
  SENSES: <SenseData[]>[
    {
      id: AtswmEffectSenseFlags.NONE,
      name: `${CONSTANTS.MODULE_NAME}.${AtswmEffectSenseFlags.NONE}`,
      path: '',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/light_01.jpg`,
      //effect: undefined,
      visionLevelMinIndex: -2,
      visionLevelMaxIndex: -1,
      conditionElevation: false,
    },
    {
      id: AtswmEffectSenseFlags.NORMAL,
      name: `${CONSTANTS.MODULE_NAME}.${AtswmEffectSenseFlags.NORMAL}`,
      path: 'data.traits.senses.blinded',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/light_02.jpg`,
      //effect: EffectDefinitions.blinded(0),
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 1,
      conditionElevation: false,
    },
    {
      id: AtswmEffectSenseFlags.BLINDED,
      name: `${CONSTANTS.MODULE_NAME}.${AtswmEffectSenseFlags.BLINDED}`,
      path: 'data.traits.senses.blinded',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/affliction_24.jpg`,
      //effect: EffectDefinitions.blinded(0),
      visionLevelMinIndex: -1,
      visionLevelMaxIndex: 0,
      conditionElevation: false,
    },
    {
      id: AtswmEffectSenseFlags.LOW_LIGHT_VISION,
      name: `${CONSTANTS.MODULE_NAME}.${AtswmEffectSenseFlags.LOW_LIGHT_VISION}`,
      path: 'data.traits.senses.lowlightvision',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/violet_09.jpg`,
      //effect: EffectDefinitions.lowlightvision(0),
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 2,
      conditionElevation: false,
    },
    {
      id: AtswmEffectSenseFlags.DARKVISION,
      name: `${CONSTANTS.MODULE_NAME}.${AtswmEffectSenseFlags.DARKVISION}`,
      path: 'data.traits.senses.darkvision',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/evil-eye-red-1.jpg`,
      //effect: EffectDefinitions.darkvision(0),
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 3,
      conditionElevation: false,
    },
    {
      id: AtswmEffectSenseFlags.GREATER_DARKVISION,
      name: `${CONSTANTS.MODULE_NAME}.${AtswmEffectSenseFlags.GREATER_DARKVISION}`,
      path: 'data.traits.senses.greaterdarkvision',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/evil-eye-eerie-1.jpg`,
      //effect: EffectDefinitions.darkvision(distance),
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 4,
      conditionElevation: false,
    },
  ],
};
