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
import { ActiveEffectData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';

const API = {
  effectInterface: EffectInterface,

  /**
   * The attributes used to track dynamic attributes in this system
   *
   * @returns {array}
   */
  get SENSES(): SenseData[] {
    return <any[]>game.settings.get(CONSTANTS.MODULE_NAME, 'senses');
  },

  /**
   * Sets the attributes used to track dynamic attributes in this system
   *
   * @param {array} inAttributes
   * @returns {Promise}
   */
  async setSenses(inAttributes) {
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
  },

  // ======================
  // Effect Management
  // ======================

  async removeEffectArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectArr | inAttributes must be of type array');
    }
    const [params] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.removeEffect(params);
    return result;
  },

  async toggleEffectArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('toggleEffectArr | inAttributes must be of type array');
    }
    const [effectName, params] = inAttributes;
    const result = await this.effectInterface.toggleEffect(effectName, params);
    return result;
  },

  async addEffectArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectArr | inAttributes must be of type array');
    }
    const [params] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.addEffect(params);
    return result;
  },

  async hasEffectAppliedArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('hasEffectAppliedArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.hasEffectApplied(effectName, uuid);
    return result;
  },

  async addEffectOnActorArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectOnActorArr | inAttributes must be of type array');
    }
    const [effectName, uuid, origin, overlay, effect] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.addEffectOnActor(
      effectName,
      uuid,
      origin,
      overlay,
      effect,
    );
    return result;
  },

  async removeEffectOnActorArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectOnActorArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.removeEffectOnActor(effectName, uuid);
    return result;
  },

  async removeEffectFromIdOnActorArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectFromIdOnActor | inAttributes must be of type array');
    }
    const [effectId, uuid] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.removeEffectFromIdOnActor(
      effectId,
      uuid,
    );
    return result;
  },

  async toggleEffectFromIdOnActorArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectOnActorArr | inAttributes must be of type array');
    }
    const [effectId, uuid, alwaysDelete, forceEnabled, forceDisabled] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.toggleEffectFromIdOnActor(
      effectId,
      uuid,
      alwaysDelete,
      forceEnabled,
      forceDisabled,
    );
    return result;
  },

  async findEffectByNameOnActorArr(...inAttributes: any[]): Promise<ActiveEffect | null> {
    if (!Array.isArray(inAttributes)) {
      throw error('findEffectByNameOnActorArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.findEffectByNameOnActor(
      effectName,
      uuid,
    );
    return result;
  },

  async addEffectOnTokenArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectOnTokenArr | inAttributes must be of type array');
    }
    const [effectName, uuid, origin, overlay, effect] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.addEffectOnToken(
      effectName,
      uuid,
      origin,
      overlay,
      effect,
    );
    return result;
  },

  async removeEffectOnTokenArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectOnTokenArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.removeEffectOnToken(effectName, uuid);
    return result;
  },

  async removeEffectFromIdOnTokenArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectFromIdOnToken | inAttributes must be of type array');
    }
    const [effectId, uuid] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.removeEffectFromIdOnToken(
      effectId,
      uuid,
    );
    return result;
  },

  async toggleEffectFromIdOnTokenArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectOnTokenArr | inAttributes must be of type array');
    }
    const [effectId, uuid, alwaysDelete, forceEnabled, forceDisabled] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.toggleEffectFromIdOnToken(
      effectId,
      uuid,
      alwaysDelete,
      forceEnabled,
      forceDisabled,
    );
    return result;
  },

  async findEffectByNameOnTokenArr(...inAttributes: any[]): Promise<ActiveEffect | null> {
    if (!Array.isArray(inAttributes)) {
      throw error('findEffectByNameOnTokenArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.findEffectByNameOnToken(
      effectName,
      uuid,
    );
    return result;
  },

  async addActiveEffectOnTokenArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('addActiveEffectOnTokenArr | inAttributes must be of type array');
    }
    const [tokenId, activeEffectData] = inAttributes;
    const result = (<EffectInterface>this.effectInterface)._effectHandler.addActiveEffectOnToken(
      <string>tokenId,
      activeEffectData,
    );
    return result;
  },

  async updateEffectFromIdOnTokenArr(...inAttributes: any[]): Promise<boolean | undefined> {
    if (!Array.isArray(inAttributes)) {
      throw error('updateEffectFromIdOnTokenArr | inAttributes must be of type array');
    }
    const [effectId, uuid, origin, overlay, effectUpdated] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.updateEffectFromIdOnToken(
      effectId,
      uuid,
      origin,
      overlay,
      effectUpdated,
    );
    return result;
  },

  async updateEffectFromNameOnTokenArr(...inAttributes: any[]): Promise<boolean | undefined> {
    if (!Array.isArray(inAttributes)) {
      throw error('updateEffectFromNameOnTokenArr | inAttributes must be of type array');
    }
    const [effectName, uuid, origin, overlay, effectUpdated] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.updateEffectFromNameOnToken(
      effectName,
      uuid,
      origin,
      overlay,
      effectUpdated,
    );
    return result;
  },

  async updateActiveEffectFromIdOnTokenArr(...inAttributes: any[]): Promise<boolean | undefined> {
    if (!Array.isArray(inAttributes)) {
      throw error('updateActiveEffectFromIdOnTokenArr | inAttributes must be of type array');
    }
    const [effectId, uuid, origin, overlay, effectUpdated] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.updateActiveEffectFromIdOnToken(
      effectId,
      uuid,
      origin,
      overlay,
      effectUpdated,
    );
    return result;
  },

  async updateActiveEffectFromNameOnTokenArr(...inAttributes: any[]): Promise<boolean | undefined> {
    if (!Array.isArray(inAttributes)) {
      throw error('updateActiveEffectFromNameOnTokenArr | inAttributes must be of type array');
    }
    const [effectName, uuid, origin, overlay, effectUpdated] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.updateActiveEffectFromNameOnToken(
      effectName,
      uuid,
      origin,
      overlay,
      effectUpdated,
    );
    return result;
  },

  // ======================
  // Effect Actor Management
  // ======================
  /*
  async addEffectOnActor(actorId: string, effectName: string, effect: Effect) {
    const result = await this.effectInterface.addEffectOnActor(effectName, <string>actorId, effect);
    return result;
  },

  async findEffectByNameOnActor(actorId: string, effectName: string): Promise<ActiveEffect | null> {
    const result = await this.effectInterface.findEffectByNameOnActor(effectName, <string>actorId);
    return result;
  },

  async hasEffectAppliedOnActor(actorId: string, effectName: string, includeDisabled:boolean) {
    const result = await this.effectInterface.hasEffectAppliedOnActor(effectName, <string>actorId, includeDisabled);
    return result;
  },

  async hasEffectAppliedFromIdOnActor(actorId: string, effectId: string, includeDisabled:boolean) {
    const result = await this.effectInterface.hasEffectAppliedFromIdOnActor(effectId, <string>actorId, includeDisabled);
    return result;
  },

  async toggleEffectFromIdOnActor(
    actorId: string,
    effectId: string,
    alwaysDelete: boolean,
    forceEnabled?: boolean,
    forceDisabled?: boolean,
  ) {
    const result = await this.effectInterface.toggleEffectFromIdOnActor(
      effectId,
      <string>actorId,
      alwaysDelete,
      forceEnabled,
      forceDisabled,
    );
    return result;
  },

  async addActiveEffectOnActor(actorId: string, activeEffectData: ActiveEffectData) {
    const result = this.effectInterface.addActiveEffectOnActor(<string>actorId, activeEffectData);
    return result;
  },

  async removeEffectOnActor(actorId: string, effectName: string) {
    const result = await this.effectInterface.removeEffectOnActor(effectName, <string>actorId);
    return result;
  },

  async removeEffectFromIdOnActor(actorId: string, effectId: string) {
    const result = await this.effectInterface.removeEffectFromIdOnActor(effectId, <string>actorId);
    return result;
  },
  */
  // ======================
  // Effect Token Management
  // ======================

  async addEffectOnToken(tokenId: string, effectName: string, effect: Effect) {
    const result = await this.effectInterface.addEffectOnToken(effectName, <string>tokenId, effect);
    return result;
  },

  async findEffectByNameOnToken(tokenId: string, effectName: string): Promise<ActiveEffect | null> {
    const result = await this.effectInterface.findEffectByNameOnToken(effectName, <string>tokenId);
    return result;
  },

  async hasEffectAppliedOnToken(tokenId: string, effectName: string, includeDisabled: boolean) {
    const result = await this.effectInterface.hasEffectAppliedOnToken(effectName, <string>tokenId, includeDisabled);
    return result;
  },

  async hasEffectAppliedFromIdOnToken(tokenId: string, effectId: string, includeDisabled: boolean) {
    const result = await this.effectInterface.hasEffectAppliedFromIdOnToken(effectId, <string>tokenId, includeDisabled);
    return result;
  },

  async toggleEffectFromIdOnToken(
    tokenId: string,
    effectId: string,
    alwaysDelete: boolean,
    forceEnabled?: boolean,
    forceDisabled?: boolean,
  ) {
    const result = await this.effectInterface.toggleEffectFromIdOnToken(
      effectId,
      <string>tokenId,
      alwaysDelete,
      forceEnabled,
      forceDisabled,
    );
    return result;
  },

  async addActiveEffectOnToken(tokenId: string, activeEffectData: ActiveEffectData) {
    const result = await this.effectInterface.addActiveEffectOnToken(<string>tokenId, activeEffectData);
    return result;
  },

  async removeEffectOnToken(tokenId: string, effectName: string) {
    const result = await this.effectInterface.removeEffectOnToken(effectName, <string>tokenId);
    return result;
  },

  async removeEffectFromIdOnToken(tokenId: string, effectId: string) {
    const result = await this.effectInterface.removeEffectFromIdOnToken(effectId, <string>tokenId);
    return result;
  },

  async updateEffectFromIdOnToken(tokenId: string, effectId: string, origin, overlay, effectUpdated: Effect) {
    const result = await this.effectInterface.updateEffectFromIdOnToken(
      effectId,
      tokenId,
      origin,
      overlay,
      effectUpdated,
    );
    return result;
  },

  async updateEffectFromNameOnToken(tokenId: string, effectName: string, origin, overlay, effectUpdated: Effect) {
    const result = await this.effectInterface.updateEffectFromNameOnToken(
      effectName,
      tokenId,
      origin,
      overlay,
      effectUpdated,
    );
    return result;
  },

  async updateActiveEffectFromIdOnToken(
    tokenId: string,
    effectId: string,
    origin,
    overlay,
    effectUpdated: ActiveEffectData,
  ) {
    const result = await this.effectInterface.updateActiveEffectFromIdOnToken(
      effectId,
      tokenId,
      origin,
      overlay,
      effectUpdated,
    );
    return result;
  },

  async updateActiveEffectFromNameOnToken(
    tokenId: string,
    effectName: string,
    origin,
    overlay,
    effectUpdated: ActiveEffectData,
  ) {
    const result = await this.effectInterface.updateActiveEffectFromNameOnToken(
      effectName,
      tokenId,
      origin,
      overlay,
      effectUpdated,
    );
    return result;
  },

  // =======================================================================================
};

export default API;
