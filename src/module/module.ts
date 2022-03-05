import { registerLibwrappers } from './libwrapper';
import { registerSocket, senseWallsSocket } from './socket';
import { checkSystem } from './settings';
import { canvas, game } from './settings';
import CONSTANTS from './constants';
import HOOKS from './hooks';
import { debug, shouldIncludeWall, wallNewRefresh2, wallNewUpdate2 } from './lib/lib';
import API from './api.js';
import EffectInterface from './effects/effect-interface';
import { registerHotkeys } from './hotkeys';
import { AtswmEffectSenseFlags, SenseData } from './sensewalls-models';
import { SenseWallsPlaceableConfig } from './sensewalls-config';

export const initHooks = async (): Promise<void> => {
  // registerSettings();

  registerLibwrappers();

  Hooks.once('socketlib.ready', registerSocket);

  if (game.settings.get(CONSTANTS.MODULE_NAME, 'debugHooks')) {
    for (const hook of Object.values(HOOKS)) {
      if (typeof hook === 'string') {
        Hooks.on(hook, (...args) => debug(`Hook called: ${hook}`, ...args));
        debug(`Registered hook: ${hook}`);
      } else {
        for (const innerHook of Object.values(hook)) {
          Hooks.on(<string>innerHook, (...args) => debug(`Hook called: ${innerHook}`, ...args));
          debug(`Registered hook: ${innerHook}`);
        }
      }
    }
  }

  //@ts-ignore
  window.SenseWalls = {
    API,
  };
};

export const setupHooks = async (): Promise<void> => {
  // setup all the hooks

  //@ts-ignore
  window.SenseWalls.API.effectInterface = new EffectInterface(CONSTANTS.MODULE_NAME);
  //@ts-ignore
  window.SenseWalls.API.effectInterface.initialize();

  if (game[CONSTANTS.MODULE_NAME]) {
    game[CONSTANTS.MODULE_NAME] = {};
  }
  if (game[CONSTANTS.MODULE_NAME].API) {
    game[CONSTANTS.MODULE_NAME].API = {};
  }
  //@ts-ignore
  game[CONSTANTS.MODULE_NAME].API = window.SenseWalls.API;
};

export const readyHooks = async (): Promise<void> => {
  checkSystem();
  registerHotkeys();
  Hooks.callAll(HOOKS.READY);

  SenseWallsPlaceableConfig.registerHooks();

  // Add any additional hooks if necessary
};
