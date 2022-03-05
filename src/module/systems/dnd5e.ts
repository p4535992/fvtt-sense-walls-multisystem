import { SenseWallsMultisystemEffectDefinitions } from '../sensewalls-effect-definition';
import CONSTANTS from '../constants';
import { i18n } from '../lib/lib';
import { AtswmEffectSenseFlags, SenseData } from '../sensewalls-models';

export default {
  HP_ATTRIBUTE: 'data.attributes.hp.value',
  /** Equivalent to the VisionLevel enum in the Pathfinder 2e system */
  // VISION_LEVEL: [
  //   'BLINDED',
  //   'NORMAL',
  //   'DARKVISION',
  //   'SUNLIGHT_SENSITIVITY',
  //   'BLINDSIGHT',
  //   'TREMORSENSE',
  // ],
  /**
   * The set of possible sensory perception types which an Actor may have.
   * @enum {string}
   */
  SENSES: <SenseData[]>[
    // {
    //   id: 'stealthpassive',
    //   name: `${CONSTANTS.MODULE_NAME}.stealthpassive'),
    //   //path: 'data.skills.ste.passive',
    //   path: 'data.attributes.senses.stealthpassive',
    //   img: '',
    //   //effect: EffectDefinitions.stealthpassive(0),
    // },
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
      path: '',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/light_02.jpg`,
      //effect: undefined,
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
      id: AtswmEffectSenseFlags.DARKVISION,
      name: `${CONSTANTS.MODULE_NAME}.${AtswmEffectSenseFlags.DARKVISION}`,
      path: 'data.attributes.senses.darkvision',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/evil-eye-red-1.jpg`,
      //effect: EffectDefinitions.darkvision(0),
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 3,
      conditionElevation: false,
    },
    {
      id: AtswmEffectSenseFlags.TREMOR_SENSE,
      name: `${CONSTANTS.MODULE_NAME}.${AtswmEffectSenseFlags.TREMOR_SENSE}`,
      path: 'data.attributes.senses.tremorsense',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/ice_15.jpg`,
      //effect: EffectDefinitions.tremorsense(0),
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 10,
      conditionElevation: true,
    },
    {
      id: AtswmEffectSenseFlags.SEE_INVISIBLE,
      name: `${CONSTANTS.MODULE_NAME}.${AtswmEffectSenseFlags.SEE_INVISIBLE}`,
      path: 'data.attributes.senses.seeinvisible',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/shadow_11.jpg`,
      //effect: EffectDefinitions.seeinvisible(0),
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 5,
      conditionElevation: false,
    },
    {
      id: AtswmEffectSenseFlags.BLIND_SIGHT,
      name: `${CONSTANTS.MODULE_NAME}.${AtswmEffectSenseFlags.BLIND_SIGHT}`,
      path: 'data.attributes.senses.blindsight',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/green_18.jpg`,
      //effect: EffectDefinitions.blindsigth(0),
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 6,
      conditionElevation: false,
    },
    {
      id: AtswmEffectSenseFlags.TRUE_SIGHT,
      name: `${CONSTANTS.MODULE_NAME}.${AtswmEffectSenseFlags.TRUE_SIGHT}`,
      path: 'data.attributes.senses.truesight',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/emerald_11.jpg`,
      //effect: EffectDefinitions.truesight(0),
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 7,
      conditionElevation: false,
    },
    {
      id: AtswmEffectSenseFlags.DEVILS_SIGHT,
      name: `${CONSTANTS.MODULE_NAME}.${AtswmEffectSenseFlags.DEVILS_SIGHT}`,
      path: 'data.attributes.senses.devilssight',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/blue_17.jpg`,
      //effect: EffectDefinitions.devilssight(0),
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 8,
      conditionElevation: false,
    },
  ],
};
