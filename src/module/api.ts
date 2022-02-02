import CONSTANTS from './constants';
import { senseWallsSocket, SOCKET_HANDLERS } from './socket';
import { canvas, game } from './settings';
import { error } from './lib/lib';
import EffectInterface from './effects/effect-interface';
import EffectHandler from './effects/effect-handler';
import Effect from './effects/effect';
import { StatusSight } from './sensewalls-models';
import HOOKS from './hooks';

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
  static get SENSES(): StatusSight[] {
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
}
