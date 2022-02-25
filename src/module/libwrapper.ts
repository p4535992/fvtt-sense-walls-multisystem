import API from './api';
import CONSTANTS from './constants';
import { shouldIncludeWall, wallNewRefresh2, wallNewUpdate2 } from './lib/lib';
import { canvas, game } from './settings';

export function registerLibwrappers() {
  // TODO ADD HERE ALL THE LIBWRAPPER HOOK

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
      if (args[2] === 'sight') {
        return wrapped(...args) && shouldIncludeWall(args[0]);
      } else {
        return wrapped(...args);
      }
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

  // This function builds the ClockwiseSweepPolygon to determine the token's light coverage.
  // Update the vision level just beforehand so we're using the correct token's vision level and height
  //@ts-ignore
  // libWrapper.register(
  //   CONSTANTS.MODULE_NAME,
  //   'Token.prototype.updateLightSource',
  //   function updateTokenLightSource(wrapped, ...args) {
  //     shouldIncludeWall(args[0]);
  //     wrapped(...args);
  //   },
  //   'WRAPPER',
  // );

  if (!game.settings.get(CONSTANTS.MODULE_NAME, 'disableOverrideWallDraw')) {
    //@ts-ignore
    // libWrapper.register(CONSTANTS.MODULE_NAME, 'Wall.prototype.draw', wallNewDraw, 'OVERRIDE');
    //@ts-ignore
    // libWrapper.register(CONSTANTS.MODULE_NAME, 'Wall.prototype.draw', wallNewDraw2, 'WRAPPER');
    //@ts-ignore
    // libWrapper.register(CONSTANTS.MODULE_NAME, 'Wall.prototype._onUpdate', wallNewUpdate, 'OVERRIDE');
    libWrapper.register(CONSTANTS.MODULE_NAME, 'Wall.prototype._onUpdate', wallNewUpdate2, 'MIXED');
    //@ts-ignore
    // libWrapper.register(CONSTANTS.MODULE_NAME, 'Wall.prototype.refresh', wallNewRefresh, 'OVERRIDE');
    //@ts-ignore
    libWrapper.register(CONSTANTS.MODULE_NAME, 'Wall.prototype.refresh', wallNewRefresh2, 'MIXED');
  }
}
