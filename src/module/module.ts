import { registerLibwrappers } from './libwrapper';
import { registerSocket, senseWallsSocket } from './socket';
import { checkSystem } from './settings';
import { canvas, game } from './settings';
import CONSTANTS from './constants';
import HOOKS from './hooks';
import {
  debug,
  i18n,
  resetVisionLevel,
  shouldIncludeWall,
  updateVisionLevel,
  wallNewDraw,
  wallNewRefresh,
  wallNewUpdate,
} from './lib/lib';
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
    //@ts-ignore
    libWrapper.register(
      CONSTANTS.MODULE_NAME,
      'Levels.prototype.advancedLosTestInLos',
      function updateTokenVisionSourceLevels(wrapped, ...args) {
        updateVisionLevel(args[0]);
        const result = wrapped(...args);
        resetVisionLevel();
        return result;
      },
    );
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

  //@ts-ignore
  libWrapper.register(CONSTANTS.MODULE_NAME, 'Wall.prototype.draw', wallNewDraw, 'MIXED');
  //@ts-ignore
  libWrapper.register(CONSTANTS.MODULE_NAME, 'Wall.prototype._onUpdate', wallNewUpdate, 'MIXED');
  //@ts-ignore
  libWrapper.register(CONSTANTS.MODULE_NAME, 'Wall.prototype.refresh', wallNewRefresh, 'MIXED');

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
  window.SenseWalls.API.effectInterface = new EffectInterface(CONSTANTS.MODULE_NAME, senseWallsSocket);

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

  //   Hooks.on('renderWallConfig', (app, html, data) => {
  //     const requiredVisionLevel = app.object.getFlag(CONSTANTS.MODULE_NAME, 'visionLevel') || StatusEffectSightFlags.NONE;

  //     const sensesOrderByName = <StatusSight[]>API.SENSES.sort((a, b) => a.name.localeCompare(b.name));

  //     const options: string[] = [];
  //     options.push(`<option data-image="icons/svg/mystery-man.svg" value="">${i18n('None')}</option>`);
  //     sensesOrderByName.forEach((a: StatusSight) => {
  //       if (requiredVisionLevel == a.id) {
  //         options.push(`<option selected="selected" data-image="${a.img}" value="${a.id}">${i18n(a.name)}</option>`);
  //       } else {
  //         options.push(`<option data-image="${a.img}" value="${a.id}">${i18n(a.name)}</option>`);
  //       }
  //     });

  //     const newHtml = `
  //             <div class="form-group">
  //                 <label>${i18n(`${CONSTANTS.MODULE_NAME}.visionLevel.name`)}</label>
  //                 <select name="flags.${CONSTANTS.MODULE_NAME}.visionLevel" data-dtype="String" is="ms-dropdown">
  //                   ${options.join('')}
  //                 </select>
  //                 <p class="notes">${i18n(`${CONSTANTS.MODULE_NAME}.visionLevel.description`)}</p>
  //             </div>
  //         `;

  //     const underh = html.find('select[name="sight"]');
  //     const formGroup = underh.closest('.form-group');
  //     formGroup.append(newHtml);

  //     app.setPosition({ height: 'auto' });
  //   });
};
