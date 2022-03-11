import CONSTANTS from './constants';
import API from './api';
import { debug } from './lib/lib';

export const SOCKET_HANDLERS = {
  /**
   * Generic sockets
   */
  CALL_HOOK: 'callHook',

  /**
   * Sense Walls sockets
   */

  /**
   * UI sockets
   */

  /**
   * Item & attribute sockets
   */
};

export let senseWallsSocket;

export function registerSocket() {
  debug('Registered senseWallsSocket');
  if (senseWallsSocket) {
    return senseWallsSocket;
  }
  //@ts-ignore
  senseWallsSocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);

  /**
   * Generic socket
   */
  senseWallsSocket.register(SOCKET_HANDLERS.CALL_HOOK, (hook, ...args) => callHook(hook, ...args));

  /**
   * Sense walls sockets
   */

  /**
   * UI sockets
   */

  /**
   * Item & attribute sockets
   */

  /**
   * Effects
   */
  // senseWallsSocket.register('addActorDataChanges', (...args) => API._actorUpdater.addActorDataChanges(...args));
  // senseWallsSocket.register('removeActorDataChanges', (...args) => API._actorUpdater.removeActorDataChanges(...args));
  senseWallsSocket.register('toggleEffect', (...args) => API.toggleEffectArr(...args));
  senseWallsSocket.register('addEffect', (...args) => API.addEffectArr(...args));
  senseWallsSocket.register('removeEffect', (...args) => API.removeEffectArr(...args));

  senseWallsSocket.register('addEffectOnActor', (...args) => API.addEffectOnActorArr(...args));
  senseWallsSocket.register('removeEffectOnActor', (...args) => API.removeEffectOnActorArr(...args));
  senseWallsSocket.register('removeEffectFromIdOnActor', (...args) => API.removeEffectFromIdOnActorArr(...args));
  senseWallsSocket.register('toggleEffectFromIdOnActor', (...args) => API.toggleEffectFromIdOnActorArr(...args));
  senseWallsSocket.register('findEffectByNameOnActor', (...args) => API.findEffectByNameOnActorArr(...args));

  senseWallsSocket.register('addEffectOnToken', (...args) => API.addEffectOnTokenArr(...args));
  senseWallsSocket.register('removeEffectOnToken', (...args) => API.removeEffectOnTokenArr(...args));
  senseWallsSocket.register('removeEffectFromIdOnToken', (...args) => API.removeEffectFromIdOnTokenArr(...args));
  senseWallsSocket.register('toggleEffectFromIdOnToken', (...args) => API.toggleEffectFromIdOnTokenArr(...args));
  senseWallsSocket.register('findEffectByNameOnToken', (...args) => API.findEffectByNameOnTokenArr(...args));
  senseWallsSocket.register('updateEffectFromIdOnToken', (...args) => API.updateEffectFromIdOnTokenArr(...args));
  senseWallsSocket.register('updateEffectFromNameOnToken', (...args) => API.updateEffectFromNameOnTokenArr(...args));
  senseWallsSocket.register('updateActiveEffectFromIdOnToken', (...args) =>
    API.updateActiveEffectFromIdOnTokenArr(...args),
  );
  senseWallsSocket.register('updateActiveEffectFromNameOnToken', (...args) =>
    API.updateActiveEffectFromNameOnTokenArr(...args),
  );

  senseWallsSocket.register('addActiveEffectOnToken', (...args) => API.addActiveEffectOnTokenArr(...args));

  return senseWallsSocket;
}

async function callHook(inHookName, ...args) {
  const newArgs: any[] = [];
  for (let arg of args) {
    if (typeof arg === 'string') {
      const testArg = await fromUuid(arg);
      if (testArg) {
        arg = testArg;
      }
    }
    newArgs.push(arg);
  }
  return Hooks.callAll(inHookName, ...newArgs);
}
