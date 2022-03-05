import CONSTANTS from './constants';
import { senseWallsSocket, SOCKET_HANDLERS } from './socket';
import { canvas, game } from './settings';
import { dialogWarning, error, i18n, warn } from './lib/lib';
import EffectInterface from './effects/effect-interface';
import EffectHandler from './effects/effect-handler';
import Effect from './effects/effect';
import { SenseData } from './sensewalls-models';
import HOOKS from './hooks';
import { SenseWallsMultisystemEffectDefinitions } from './sensewalls-effect-definition';

export default class API {
  // static get effectInterface(): EffectInterface {
  //   return new EffectInterface(CONSTANTS.MODULE_NAME, senseWallsSocket);
  // }

  static effectInterface: EffectInterface;

  /**
   * The attributes used to track dynamic attributes in this system
   *
   * @returns {array}
   */
  static get SENSES(): SenseData[] {
    return <any[]>game.settings.get(CONSTANTS.MODULE_NAME, 'senses');
  }

  /**
   * Sets the attributes used to track dynamic attributes in this system
   *
   * @param {array} inAttributes
   * @returns {Promise}
   */
  static async setSenses(inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('setSenses | inAttributes must be of type array');
    }
    inAttributes.forEach((attribute) => {
      if (typeof attribute !== 'object') {
        throw error('setSenses | each entry in the inAttributes array must be of type object');
      }
      if (typeof attribute.name !== 'string') {
        throw error('setSenses | attribute.name must be of type string');
      }
      if (typeof attribute.attribute !== 'string') {
        throw error('setSenses | attribute.path must be of type string');
      }
      if (attribute.img && typeof attribute.img !== 'string') {
        throw error('setSenses | attribute.img must be of type string');
      }
    });
    return game.settings.set(CONSTANTS.MODULE_NAME, 'senses', inAttributes);
  }

  static addEffect(actorNameOrId: string, effectName: string, distance: number) {
    const actor = <Actor>game.actors?.get(actorNameOrId) || <Actor>game.actors?.getName(actorNameOrId);

    if (!actor) {
      warn(`No actor found with reference '${actorNameOrId}'`, true);
    }

    if (!distance) {
      distance = 0;
    }

    let effect: Effect | undefined = undefined;
    const sensesOrderByName = <SenseData[]>API.SENSES.sort((a, b) => a.name.localeCompare(b.name));
    sensesOrderByName.forEach((a: SenseData) => {
      if (a.id == effectName || i18n(a.name) == effectName) {
        effect = <Effect>SenseWallsMultisystemEffectDefinitions.all(distance).find((e: Effect) => {
          return e.customId == a.id;
        });
      }
    });

    if (!effect) {
      warn(`No effect found with reference '${effectName}'`, true);
    }

    if (actor && effect) {
      //@ts-ignore
      (<EffectInterface>SenseWalls.API.effectInterface).addEffectOnActor(effectName, <string>actor.id, effect);
    }
  }
}
