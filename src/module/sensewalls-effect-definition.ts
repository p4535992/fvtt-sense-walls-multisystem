import API from './api';
import { AtswmEffectSenseFlags, SenseData } from './sensewalls-models';
import CONSTANTS from './constants';
import Effect, { Constants } from './effects/effect';
import { debug, i18n, i18nFormat, isStringEquals, warn } from './lib/lib';
import { canvas, game } from './settings';

/**
 * Defines all of the effect definitions
 */
export class SenseWallsMultisystemEffectDefinitions {
  constructor() {}

  /**
   * Get all effects
   *
   * @returns {Effect[]} all the effects
   */
  static all(distance = 0, visionLevel = 0): Effect[] {
    const effects: Effect[] = [];

    // EffectDefinitions.shadowEffect(distance),

    // SENSES
    const blinded = SenseWallsMultisystemEffectDefinitions.blinded(distance, visionLevel);
    if (blinded) {
      effects.push(blinded);
    }
    const blindsight = SenseWallsMultisystemEffectDefinitions.blindsight(distance, visionLevel);
    if (blindsight) {
      effects.push(blindsight);
    }
    const darkvision = SenseWallsMultisystemEffectDefinitions.darkvision(distance, visionLevel);
    if (darkvision) {
      effects.push(darkvision);
    }
    const devilssight = SenseWallsMultisystemEffectDefinitions.devilssight(distance, visionLevel);
    if (devilssight) {
      effects.push(devilssight);
    }
    const lowlightvision = SenseWallsMultisystemEffectDefinitions.lowlightvision(distance, visionLevel);
    if (lowlightvision) {
      effects.push(lowlightvision);
    }
    const seeinvisible = SenseWallsMultisystemEffectDefinitions.seeinvisible(distance, visionLevel);
    if (seeinvisible) {
      effects.push(seeinvisible);
    }
    const tremorsense = SenseWallsMultisystemEffectDefinitions.tremorsense(distance, visionLevel);
    if (tremorsense) {
      effects.push(tremorsense);
    }
    const truesight = SenseWallsMultisystemEffectDefinitions.truesight(distance, visionLevel);
    if (truesight) {
      effects.push(truesight);
    }

    return effects;
  }

  static async effect(nameOrCustomId: string, distance = 0, visionLevel = 0): Promise<Effect | undefined> {
    const effect = <Effect>SenseWallsMultisystemEffectDefinitions.all(distance, visionLevel).find((effect: Effect) => {
      return (
        effect.name.toLowerCase() === nameOrCustomId.toLowerCase() ||
        effect.customId.toLowerCase() === nameOrCustomId.toLowerCase()
      );
    });
    if (!effect) {
      warn(`Not founded effect with name ${nameOrCustomId}`, true);
      return undefined;
    }
    return effect;
    // const senses = await API.XXX();
    // let effectFounded: Effect | undefined = undefined;
    // for (const senseData of senses) {
    //   if (effect?.customId == senseData.id || i18n(effect.name) == i18n(senseData.name)) {
    //     effectFounded = effect;
    //     break;
    //   }
    // }
    // return effectFounded;
  }

  // ===========================================
  // The source effect
  // =============================================

  // static stealthpassive(number: number) {
  //   return new Effect({
  //     name: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.stealthpassive.name`, { number : number}),
  //     description: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.stealthpassive.description`, { number : number}),
  //     icon: '',
  //     // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
  //     transfer: true,
  //     changes: [
  //       {
  //         key: 'data.attributes.senses.stealthpassive',
  //         mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
  //         value: number && number > 0 ? `${number}` : `@data.skills.ste.passive`,
  //         priority: 5,
  //       },
  //     ],
  //   });
  // }

  static darkvision(number: number, visionLevel) {
    const effectSight = API.SENSES.find((a: SenseData) => {
      return isStringEquals(a.id, AtswmEffectSenseFlags.DARKVISION);
    });
    if (!effectSight) {
      debug(
        `Cannot find for system '${game.system.id}' the active effect with id '${AtswmEffectSenseFlags.DARKVISION}'`,
      );
      return;
    }
    return new Effect({
      customId: AtswmEffectSenseFlags.DARKVISION,
      name:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.darkvision.name2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.darkvision.name`),
      description:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.darkvision.description2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.darkvision.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/evil-eye-red-1.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: effectSight.path,
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `${effectSight.path}`,
          priority: 5,
        },
      ],
      atlChanges: [
        {
          key: SenseWallsMultisystemEffectDefinitions._createAtlEffectKey('ATL.light.dim'),
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: `${number}`,
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + AtswmEffectSenseFlags.DARKVISION,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
      isTemporary: false,
    });
  }

  static blindsight(number: number, visionLevel) {
    const effectSight = API.SENSES.find((a: SenseData) => {
      return isStringEquals(a.id, AtswmEffectSenseFlags.BLIND_SIGHT);
    });
    if (!effectSight) {
      debug(
        `Cannot find for system '${game.system.id}' the active effect with id '${AtswmEffectSenseFlags.BLIND_SIGHT}'`,
      );
      return;
    }
    return new Effect({
      customId: AtswmEffectSenseFlags.BLIND_SIGHT,
      name:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.blindsight.name2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.blindsight.name`),
      description:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.blindsight.description2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.blindsight.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/green_18.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: effectSight.path,
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `${effectSight.path}`,
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + AtswmEffectSenseFlags.BLIND_SIGHT,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
      isTemporary: false,
    });
  }

  static tremorsense(number: number, visionLevel) {
    const effectSight = API.SENSES.find((a: SenseData) => {
      return isStringEquals(a.id, AtswmEffectSenseFlags.TREMOR_SENSE);
    });
    if (!effectSight) {
      debug(
        `Cannot find for system '${game.system.id}' the active effect with id '${AtswmEffectSenseFlags.TREMOR_SENSE}'`,
      );
      return;
    }
    return new Effect({
      customId: AtswmEffectSenseFlags.TREMOR_SENSE,
      name:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.tremorsense.name2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.tremorsense.name`),
      description:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.tremorsense.description2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.tremorsense.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/ice_15.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: effectSight.path,
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `${effectSight.path}`,
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + AtswmEffectSenseFlags.TREMOR_SENSE,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
      isTemporary: false,
    });
  }

  static truesight(number, visionLevel) {
    const effectSight = API.SENSES.find((a: SenseData) => {
      return isStringEquals(a.id, AtswmEffectSenseFlags.TRUE_SIGHT);
    });
    if (!effectSight) {
      debug(
        `Cannot find for system '${game.system.id}' the active effect with id '${AtswmEffectSenseFlags.TRUE_SIGHT}'`,
      );
      return;
    }
    return new Effect({
      customId: AtswmEffectSenseFlags.TRUE_SIGHT,
      name:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.truesight.name2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.truesight.name`),
      description:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.truesight.description2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.truesight.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/emerald_11.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: effectSight.path,
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `${effectSight.path}`,
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + AtswmEffectSenseFlags.TRUE_SIGHT,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
      isTemporary: false,
    });
  }

  static seeinvisible(number, visionLevel) {
    const effectSight = API.SENSES.find((a: SenseData) => {
      return isStringEquals(a.id, AtswmEffectSenseFlags.SEE_INVISIBLE);
    });
    if (!effectSight) {
      debug(
        `Cannot find for system '${game.system.id}' the active effect with id '${AtswmEffectSenseFlags.SEE_INVISIBLE}'`,
      );
      return;
    }
    return new Effect({
      customId: AtswmEffectSenseFlags.SEE_INVISIBLE,
      name:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.seeinvisible.name2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.seeinvisible.name`),
      description:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.seeinvisible.description2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.seeinvisible.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/shadow_11.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: effectSight.path,
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `${effectSight.path}`,
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + AtswmEffectSenseFlags.SEE_INVISIBLE,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
      isTemporary: false,
    });
  }

  static devilssight(number, visionLevel) {
    const effectSight = API.SENSES.find((a: SenseData) => {
      return isStringEquals(a.id, AtswmEffectSenseFlags.DEVILS_SIGHT);
    });
    if (!effectSight) {
      debug(
        `Cannot find for system '${game.system.id}' the active effect with id '${AtswmEffectSenseFlags.DEVILS_SIGHT}'`,
      );
      return;
    }
    return new Effect({
      customId: AtswmEffectSenseFlags.DEVILS_SIGHT,
      name:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.devilssight.name2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.devilssight.name`),
      description:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.devilssight.description2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.devilssight.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/blue_17.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: effectSight.path,
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `${effectSight.path}`,
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + AtswmEffectSenseFlags.DEVILS_SIGHT,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
      isTemporary: false,
    });
  }

  static lowlightvision(number, visionLevel) {
    const effectSight = API.SENSES.find((a: SenseData) => {
      return isStringEquals(a.id, AtswmEffectSenseFlags.LOW_LIGHT_VISION);
    });
    if (!effectSight) {
      debug(
        `Cannot find for system '${game.system.id}' the active effect with id '${AtswmEffectSenseFlags.LOW_LIGHT_VISION}'`,
      );
      return;
    }
    return new Effect({
      customId: AtswmEffectSenseFlags.LOW_LIGHT_VISION,
      name:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.lowlightvision.name2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.lowlightvision.name`),
      description:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.lowlightvision.description2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.lowlightvision.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/violet_09.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: effectSight.path,
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `${effectSight.path}`,
          priority: 5,
        },
      ],
      atlChanges: [
        // {
        //   key: EffectDefinitions._createAtlEffectKey('ATL.light.dim'),
        //   mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
        //   value: `data.token.dimSight`,
        //   priority: 5,
        // },
        {
          key: SenseWallsMultisystemEffectDefinitions._createAtlEffectKey('ATL.light.bright'),
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: `data.token.dimSight`,
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + AtswmEffectSenseFlags.LOW_LIGHT_VISION,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
      isTemporary: false,
    });
  }

  static blinded(number, visionLevel) {
    const effectSight = API.SENSES.find((a: SenseData) => {
      return isStringEquals(a.id, AtswmEffectSenseFlags.BLINDED);
    });
    if (!effectSight) {
      debug(`Cannot find for system '${game.system.id}' the active effect with id '${AtswmEffectSenseFlags.BLINDED}'`);
      return;
    }
    return new Effect({
      customId: AtswmEffectSenseFlags.BLINDED,
      name:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.blinded.name2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.blinded.name`),
      description:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.blinded.description2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.blinded.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/affliction_24.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [],
      atlChanges: [
        {
          key: SenseWallsMultisystemEffectDefinitions._createAtlEffectKey('ATL.light.dim'),
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: `0`,
          priority: 5,
        },
        {
          key: SenseWallsMultisystemEffectDefinitions._createAtlEffectKey('ATL.light.bright'),
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: `0`,
          priority: 5,
        },
        {
          key: SenseWallsMultisystemEffectDefinitions._createAtlEffectKey('ATL.light.animation'),
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '{ "type":"none"}',
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + AtswmEffectSenseFlags.BLINDED,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
      isTemporary: false,
    });
  }

  // ===========================================
  // The target effect
  // =============================================

  static _createAtlEffectKey(key) {
    let result = key;
    //@ts-ignore
    const version = (game.version ?? game.data.version).charAt(0);

    if (version == '9') {
      switch (key) {
        case 'ATL.preset':
          break;
        case 'ATL.brightSight':
          break;
        case 'ATL.light.dim':
          break;
        case 'ATL.height':
          break;
        case 'ATl.img':
          break;
        case 'ATL.mirrorX':
          break;
        case 'ATL.mirrorY':
          break;
        case 'ATL.rotation':
          break;
        case 'ATL.scale':
          break;
        case 'ATL.width':
          break;
        case 'ATL.dimLight':
          result = 'ATL.light.dim';
          break;
        case 'ATL.brightLight':
          result = 'ATL.light.bright';
          break;
        case 'ATL.lightAnimation':
          result = 'ATL.light.animation';
          break;
        case 'ATL.lightColor':
          result = 'ATL.light.color';
          break;
        case 'ATL.lightAlpha':
          result = 'ATL.light.alpha';
          break;
        case 'ATL.lightAngle':
          result = 'ATL.light.angle';
          break;
      }
    }
    return result;
  }

  // /**
  //  * This also includes automatic shadow creation for token elevation.
  //  * This section requires Token Magic Fx to function.
  //  * Changing the elevation of a token over 5ft will automatically set a shadow effect "below" the token,
  //  * this is change in distance based on the elevation value.
  //  * @param tokenInstance
  //  * @param elevation
  //  */
  // static async shadowEffect(tokenInstance: Token) {
  //   //const elevation: number = getProperty(tokenInstance.data, 'elevation');
  //   const elevation: number = getElevationToken(tokenInstance);
  //   //const tokenInstance = canvas.tokens?.get(tokenID);
  //   const tokenMagicEffectId = CONSTANTS.MODULE_NAME + '-Shadows';
  //   const twist = {
  //     filterType: 'transform',
  //     filterId: tokenMagicEffectId,
  //     twRadiusPercent: 100,
  //     padding: 10,
  //     animated: {
  //       twRotation: {
  //         animType: 'sinOscillation',
  //         val1: -(elevation / 10),
  //         val2: +(elevation / 10),
  //         loopDuration: 5000,
  //       },
  //     },
  //   };
  //   const shadow = {
  //     filterType: 'shadow',
  //     filterId: tokenMagicEffectId,
  //     rotation: 35,
  //     blur: 2,
  //     quality: 5,
  //     distance: elevation * 1.5,
  //     alpha: Math.min(1 / ((elevation - 10) / 10), 0.7),
  //     padding: 10,
  //     shadowOnly: false,
  //     color: 0x000000,
  //     zOrder: 6000,
  //     animated: {
  //       blur: {
  //         active: true,
  //         loopDuration: 5000,
  //         animType: 'syncCosOscillation',
  //         val1: 2,
  //         val2: 2.5,
  //       },
  //       rotation: {
  //         active: true,
  //         loopDuration: 5000,
  //         animType: 'syncSinOscillation',
  //         val1: 33,
  //         val2: 33 + elevation * 0.8,
  //       },
  //     },
  //   };
  //   //const shadowSetting = game.settings.get('condition-automation', 'shadows');
  //   // let params = [shadow];
  //   //if (shadowSetting === 'bulge'){
  //   // params = [shadow, twist];
  //   //}
  //   const params = [shadow, twist];
  //   const filter = elevation > 5 ? true : false;
  //   //@ts-ignore
  //   await tokenInstance.TMFXdeleteFilters(tokenMagicEffectId);
  //   if (filter) {
  //     //@ts-ignore
  //     await TokenMagic.addUpdateFilters(tokenInstance, params);
  //   }
  // }
}
