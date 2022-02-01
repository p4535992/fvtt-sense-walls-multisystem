import { registerLibwrappers } from './libwrapper';
import { registerSocket, senseWallsSocket } from './socket';
import { checkSystem } from './settings';
import { canvas, game } from './settings';
import CONSTANTS from './constants';
import HOOKS from './hooks';
import { debug, i18n, resetVisionLevel, shouldIncludeWall, updateVisionLevel } from './lib/lib';
import API from './api.js';
import EffectInterface from './effects/effect-interface';
import { registerHotkeys } from './hotkeys';
import { StatusEffectSightFlags, StatusSight } from './sensewalls-models';

export const initHooks = async (): Promise<void> => {
  // registerSettings();

  // Just as we're about to recalculate vision for this token, keep track of its vision level
  //@ts-ignore
  libWrapper.register(
    CONSTANTS.MODULE_NAME,
    'Token.prototype.updateVisionSource',
    function updateTokenVisionSource(wrapped, ...args) {
      updateVisionLevel(this);
      wrapped(...args);
      resetVisionLevel();
    },
    'WRAPPER',
  );

  // Ignore the wall if the token's vision level is sufficient to pierce the wall, as per the wall configuration
  //@ts-ignore
  libWrapper.register(
    CONSTANTS.MODULE_NAME,
    'ClockwiseSweepPolygon.testWallInclusion',
    function filterWalls(wrapped, ...args) {
      if (args[2] === 'sight') {
        return wrapped(...args) && shouldIncludeWall(args[0]); // TODO to implemented
      } else {
        return wrapped(...args);
      }
    },
    'WRAPPER',
  );

  // ======================================
  // Se levels module is active
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
          return wrapped(...args) || !shouldIncludeWall(args[0]); // TODO to implemented
        } else {
          return wrapped(...args);
        }
      },
      'WRAPPER',
    );
  }

  //@ts-ignore
  libWrapper.register(CONSTANTS.MODULE_NAME, 'Wall.prototype.draw', wallNewDraw, 'OVERRIDE');
  //@ts-ignore
  libWrapper.register(CONSTANTS.MODULE_NAME, 'Wall.prototype._onUpdate', wallNewUpdate, 'OVERRIDE');
  //@ts-ignore
  libWrapper.register(CONSTANTS.MODULE_NAME, 'Wall.prototype.refresh', wallNewRefresh, 'OVERRIDE');

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

  // Add any additional hooks if necessary

  Hooks.on('renderWallConfig', (app, html, data) => {
    const requiredVisionLevel = app.object.getFlag(CONSTANTS.MODULE_NAME, 'visionLevel') || StatusEffectSightFlags.NONE;

    const sensesOrderByName = <StatusSight[]>API.SENSES.sort((a, b) => a.name.localeCompare(b.name));

    const options: string[] = [];
    options.push(`<option data-image="icons/svg/mystery-man.svg" value="">${i18n('None')}</option>`);
    sensesOrderByName.forEach((a: StatusSight) => {
      if (requiredVisionLevel == a.name) {
        options.push(`<option selected="selected" data-image="${a.img}" value="${a.id}">${a.name}</option>`);
      } else {
        options.push(`<option data-image="${a.img}" value="${a.id}">${a.name}</option>`);
      }
    });

    const newHtml = `
            <div class="form-group">
                <label>${game.i18n.localize('senseWalls.piercingVisionLevelPf2e.name')}</label>
                <select name="flags.${CONSTANTS.MODULE_NAME}.visionLevel" data-dtype="String" is="ms-dropdown">
                  ${options.join('')}
                </select>
                <p class="notes">${game.i18n.localize('senseWalls.piercingVisionLevelPf2e.description')}</p>
            </div>
        `;

    const underh = html.find('select[name="sight"]');
    const formGroup = underh.closest('.form-group');
    formGroup.after(newHtml);

    app.setPosition({ height: 'auto' });
  });
};
