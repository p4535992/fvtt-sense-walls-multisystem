import { registerLibwrappers } from './libwrapper';
import { registerSocket, senseWallsSocket } from './socket';
import { checkSystem } from './settings';
import { canvas, game } from './settings';
import CONSTANTS from './constants';
import HOOKS from './hooks';
import { debug, shouldIncludeWall, wallNewDraw, wallNewRefresh, wallNewUpdate, wallNewUpdate2 } from './lib/lib';
import API from './api.js';
import EffectInterface from './effects/effect-interface';
import { registerHotkeys } from './hotkeys';
import { StatusEffectSightFlags, StatusSight } from './sensewalls-models';
import { SenseWallsPlaceableConfig } from './sensewalls-config';

export const initHooks = async (): Promise<void> => {
  // registerSettings();

  // ======================================
  // If levels module is active
  // ======================================

  if (game.modules.get('levels')?.active) {
    // //@ts-ignore
    // libWrapper.register(
    //   CONSTANTS.MODULE_NAME,
    //   'Levels.prototype.advancedLosTestInLos',
    //   function updateTokenVisionSourceLevels(wrapped, ...args) {
    //     updateVisionLevel(args[0]);
    //     const result = wrapped(...args);
    //     return result;
    //   },
    // );
    //@ts-ignore
    libWrapper.register(
      CONSTANTS.MODULE_NAME,
      'Levels.prototype.shouldIgnoreWall',
      function filterWallsLevels(wrapped, ...args) {
        if (args[1] === 0) {
          return wrapped(...args) || !shouldIncludeWall(args[0]);
        } else {
          return wrapped(...args);
        }
      },
      'WRAPPER',
    );
  }

  // This function detemines whether a wall should be included. Add a condition on the wall sense compared to the current token
  //@ts-ignore
  libWrapper.register(
    CONSTANTS.MODULE_NAME,
    'ClockwiseSweepPolygon.testWallInclusion',
    function filterWalls(wrapped, ...args) {
      return wrapped(...args) && shouldIncludeWall(args[0]);
    },
    'WRAPPER',
  );

  // // This function builds the ClockwiseSweepPolygon to determine the token's vision.
  // // Update the vision level just beforehand so we're using the correct token's vision level and height
  // //@ts-ignore
  // libWrapper.register(
  //   CONSTANTS.MODULE_NAME,
  //   'Token.prototype.updateVisionSource',
  //   function updateTokenVisionSource(wrapped, ...args) {
  //     updateVisionLevel(this);
  //     wrapped(...args);
  //   },
  //   'WRAPPER',
  // );

  // // This function builds the ClockwiseSweepPolygon to determine the token's light coverage.
  // // Update the vision level just beforehand so we're using the correct token's vision level and height
  // //@ts-ignore
  // libWrapper.register(
  //   CONSTANTS.MODULE_NAME,
  //   'Token.prototype.updateLightSource',
  //   function updateTokenLightSource(wrapped, ...args) {
  //     updateVisionLevel(this);
  //     wrapped(...args);
  //   },
  //   'WRAPPER',
  // );

  if (!game.settings.get(CONSTANTS.MODULE_NAME, 'disableOverrideWallDraw')) {
    //@ts-ignore
    libWrapper.register(CONSTANTS.MODULE_NAME, 'Wall.prototype.draw', wallNewDraw, 'OVERRIDE');
    //@ts-ignore
    // libWrapper.register(CONSTANTS.MODULE_NAME, 'Wall.prototype._onUpdate', wallNewUpdate, 'OVERRIDE');
    // libWrapper.register(CONSTANTS.MODULE_NAME, 'Wall.prototype._onUpdate', wallNewUpdate2, 'MIXED');
    //@ts-ignore
    libWrapper.register(CONSTANTS.MODULE_NAME, 'Wall.prototype.refresh', wallNewRefresh, 'OVERRIDE');
  }

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
