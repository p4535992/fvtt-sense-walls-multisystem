import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs';
import { ActorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import API from '../api.js';
import CONSTANTS from '../constants.js';
import { AtswmEffectSenseFlags, SenseData } from '../sensewalls-models.js';
import { canvas, game } from '../settings';

// =============================
// Module Generic function
// =============================

export function isGMConnected(): boolean {
  return Array.from(<Users>game.users).find((user) => user.isGM && user.active) ? true : false;
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3

export function debug(msg, args = '') {
  if (game.settings.get(CONSTANTS.MODULE_NAME, 'debug')) {
    console.log(`DEBUG | ${CONSTANTS.MODULE_NAME} | ${msg}`, args);
  }
  return msg;
}

export function log(message) {
  message = `${CONSTANTS.MODULE_NAME} | ${message}`;
  console.log(message.replace('<br>', '\n'));
  return message;
}

export function notify(message) {
  message = `${CONSTANTS.MODULE_NAME} | ${message}`;
  ui.notifications?.notify(message);
  console.log(message.replace('<br>', '\n'));
  return message;
}

export function info(info, notify = false) {
  info = `${CONSTANTS.MODULE_NAME} | ${info}`;
  if (notify) ui.notifications?.info(info);
  console.log(info.replace('<br>', '\n'));
  return info;
}

export function warn(warning, notify = false) {
  warning = `${CONSTANTS.MODULE_NAME} | ${warning}`;
  if (notify) ui.notifications?.warn(warning);
  console.warn(warning.replace('<br>', '\n'));
  return warning;
}

export function error(error, notify = true) {
  error = `${CONSTANTS.MODULE_NAME} | ${error}`;
  if (notify) ui.notifications?.error(error);
  return new Error(error.replace('<br>', '\n'));
}

export function timelog(message): void {
  warn(Date.now(), message);
}

export const i18n = (key: string): string => {
  return game.i18n.localize(key)?.trim();
};

export const i18nFormat = (key: string, data = {}): string => {
  return game.i18n.format(key, data)?.trim();
};

// export const setDebugLevel = (debugText: string): void => {
//   debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
//   // 0 = none, warnings = 1, debug = 2, all = 3
//   if (debugEnabled >= 3) CONFIG.debug.hooks = true;
// };

export function dialogWarning(message, icon = 'fas fa-exclamation-triangle') {
  return `<p class="${CONSTANTS.MODULE_NAME}-dialog">
        <i style="font-size:3rem;" class="${icon}"></i><br><br>
        <strong style="font-size:1.2rem;">${CONSTANTS.MODULE_NAME}</strong>
        <br><br>${message}
    </p>`;
}

export function cleanUpString(stringToCleanUp: string) {
  // regex expression to match all non-alphanumeric characters in string
  const regex = /[^A-Za-z0-9]/g;
  if (stringToCleanUp) {
    return i18n(stringToCleanUp).replace(regex, '').toLowerCase();
  } else {
    return stringToCleanUp;
  }
}

export function isStringEquals(stringToCheck1: string, stringToCheck2: string, startsWith = true): boolean {
  if (stringToCheck1 && stringToCheck2) {
    if (startsWith) {
      return cleanUpString(stringToCheck1).startsWith(cleanUpString(stringToCheck2));
    } else {
      return cleanUpString(stringToCheck1) === cleanUpString(stringToCheck2);
    }
  } else {
    return stringToCheck1 === stringToCheck2;
  }
}

// =========================================================================================

// =============================
// Module specific function
// =============================

export function shouldIncludeWall(wall): boolean | null {
  // const tokenVisioneLevel = <number>currentToken.document.getFlag(CONSTANTS.MODULE_NAME, 'visionLevel');
  let currentToken = <Token>getFirstPlayerTokenSelected();
  if (!currentToken) {
    currentToken = <Token>getFirstPlayerToken();
  }
  if (!currentToken) {
    return true;
  }
  const tokenVisionLevel = getVisionLevelToken(currentToken);
  const wallVisionLevel = <string>wall.document.getFlag(CONSTANTS.MODULE_NAME, 'visionLevel');
  if (!wallVisionLevel) {
    return true;
  }
  const statusSight = <SenseData>API.SENSES.find((a: SenseData) => {
    return a.id == wallVisionLevel;
  });
  if (!statusSight) {
    return true;
  }
  if (statusSight.id == AtswmEffectSenseFlags.NORMAL || statusSight.id == AtswmEffectSenseFlags.NONE) {
    return true;
  }
  if (tokenVisionLevel?.checkElevation) {
    const tokenElevation = getElevationToken(currentToken);
    const wallElevation = getElevationWall(wall);
    if (tokenElevation < wallElevation) {
      return false;
    }
  }

  const result =
    tokenVisionLevel.min <= <number>statusSight?.visionLevelMinIndex &&
    tokenVisionLevel.max >= <number>statusSight?.visionLevelMaxIndex;
  if (result) {
    return false;
  } else {
    return true;
  }
}

// export function updateVisionLevel(currentToken) {
//   const tokenVisionLevel = getVisionLevelToken(currentToken);
//   const wallVisionLevel = <string>wall.document.getFlag(CONSTANTS.MODULE_NAME, 'visionLevel');
//   const statusSight = <StatusSight>API.SENSES.find((a: StatusSight) => {
//     return a.id == wallVisionLevel;
//   });
//   if(statusSight.id == StatusEffectSightFlags.NORMAL ||
//     statusSight.id == StatusEffectSightFlags.NONE){
//       return true;
//   }
//   if (tokenVisionLevel?.checkElevation) {
//     const tokenElevation = getElevationToken(currentToken);
//     const wallElevation = getElevationWall(wall);
//     if (tokenElevation < wallElevation) {
//       return null;
//     }
//   }

//   const result =
//     tokenVisionLevel.min <= <number>statusSight?.visionLevelMin &&
//     tokenVisionLevel.max >= <number>statusSight?.visionLevelMax;
//   if (result) {
//     return null;
//   } else {
//     return true;
//   }
// }

// ========================================================================================

// export async function wallNewDraw() {
//   this.clear();
//   this.line = this.addChild(new PIXI.Graphics());
//   this.endpoints = this.addChild(new PIXI.Graphics());
//   // Draw wall components
//   this.directionIcon = this.data.dir ? this.addChild(this._drawDirection()) : null;

//   // this.visibilityIcon = this.data.sight === 0 ? this.addChild(drawVisibility(this.direction)) : null;
//   // this.movementIcon = this.data.move === 0 ? this.addChild(drawMovement(this.direction)) : null;
//   const requiredVisionLevel: StatusEffectSightFlags = this.document.getFlag(CONSTANTS.MODULE_NAME, 'visionLevel');

//   const status = API.SENSES.find((a: StatusSight) => {
//     return a.id == requiredVisionLevel || a.name == requiredVisionLevel;
//   });

//   if (requiredVisionLevel && requiredVisionLevel != StatusEffectSightFlags.NONE && status) {
//     //this.visionLevelIcon = this.data.sight === 0 ? this.addChild(drawVisionLevel(this.direction, status)) : null;
//     this.visionLevelIcon1 = this.addChild(drawVisionLevel(this.direction, status));
//     this.visionLevelIcon2 = this.addChild(drawVisionLevel(this.direction, status));
//   } else {
//     this.visionLevelIcon1 = undefined;
//     this.visionLevelIcon2 = undefined;
//   }
//   // Draw a door control icon
//   if (this.isDoor) {
//     this.createDoorControl();
//   }
//   // Draw current wall
//   this.refresh();

//   // Enable interactivity, only if the Tile has a true ID
//   if (this.id) {
//     this.activateListeners();
//   }
//   return this;
// }

// export async function wallNewDraw2(wrapped, ...args) {
//   const requiredVisionLevel: StatusEffectSightFlags = this.document.getFlag(CONSTANTS.MODULE_NAME, 'visionLevel');

//   const status = API.SENSES.find((a: StatusSight) => {
//     return a.id == requiredVisionLevel || a.name == requiredVisionLevel;
//   });

//   if (requiredVisionLevel && requiredVisionLevel != StatusEffectSightFlags.NONE && status) {
//     //this.visionLevelIcon = this.data.sight === 0 ? this.addChild(drawVisionLevel(this.direction, status)) : null;
//     this.visionLevelIcon1 = this.addChild(drawVisionLevel(this.direction, status));
//     this.visionLevelIcon2 = this.addChild(drawVisionLevel(this.direction, status));
//   } else {
//     this.visionLevelIcon1 = undefined;
//     this.visionLevelIcon2 = undefined;
//   }
//   return wrapped(...args);
// }

// export function wallNewRefresh() {
//   const p = this.coords;
//   // x1 + x2, y1 + y2 => x/y
//   const mp = [(p[0] + p[2]) / 2, (p[1] + p[3]) / 2];
//   const mp1 = [(p[0] + mp[0]) / 2, (p[1] + mp[1]) / 2];
//   const mp2 = [(p[2] + mp[0]) / 2, (p[3] + mp[1]) / 2];

//   const wc = this._getWallColor();

//   // Determine circle radius and line width
//   let lw = 2;
//   if (<number>canvas.dimensions?.size > 150) {
//     lw = 4;
//   } else if (<number>canvas.dimensions?.size > 100) {
//     lw = 3;
//   }
//   const cr = this._hover ? lw * 3 : lw * 2;
//   const lw3 = lw * 3;

//   // Draw background
//   this.line.clear().lineStyle(lw3, 0x000000, 1.0).moveTo(p[0], p[1]).lineTo(p[2], p[3]);
//   this.endpoints
//     .clear()
//     .beginFill(0x000000, 1.0)
//     .drawCircle(p[0], p[1], cr + lw)
//     .drawCircle(p[2], p[3], cr + lw);

//   // Draw foreground
//   this.line.lineStyle(lw, wc, 1.0).lineTo(p[0], p[1]);
//   this.endpoints.beginFill(wc, 1.0).drawCircle(p[0], p[1], cr).drawCircle(p[2], p[3], cr);

//   // Tint direction icon
//   if (this.directionIcon && this.directionIcon.position) {
//     this.directionIcon.position.set(mp[0], mp[1]);
//     this.directionIcon.tint = wc;
//   }

//   if (this.visionLevelIcon1 && this.visionLevelIcon1.position) {
//     this.visionLevelIcon1.position.set(mp1[0], mp1[1]);
//     // this.visionLevelIcon1.tint = wc;
//   }

//   if (this.visionLevelIcon2 && this.visionLevelIcon2.position) {
//     this.visionLevelIcon2.position.set(mp2[0], mp2[1]);
//     // this.visionLevelIcon2.tint = wc;
//   }

//   // Re-position door control icon
//   if (this.isDoor) {
//     if (this.doorControl && this.doorControl != null && this.doorControl != undefined) {
//       this.doorControl.reposition();
//     }
//   }

//   // Update line hit area
//   this.line.hitArea = this._getWallHitPolygon(p, lw3);
//   // this.line.beginFill(0x00FF00, 1.0).drawShape(this.line.hitArea).endFill(); // Debug line hit area
//   return this;
// }

export function wallNewRefresh2(wrapped, ...args) {
  const p = this.coords;
  // x1 + x2, y1 + y2 => x/y
  const mp = [(p[0] + p[2]) / 2, (p[1] + p[3]) / 2];
  const mp1 = [(p[0] + mp[0]) / 2, (p[1] + mp[1]) / 2];
  const mp2 = [(p[2] + mp[0]) / 2, (p[3] + mp[1]) / 2];

  const wc = this._getWallColor();

  // Determine circle radius and line width
  let lw = 2;
  if (<number>canvas.dimensions?.size > 150) {
    lw = 4;
  } else if (<number>canvas.dimensions?.size > 100) {
    lw = 3;
  }
  const cr = this._hover ? lw * 3 : lw * 2;
  const lw3 = lw * 3;

  const requiredVisionLevel: AtswmEffectSenseFlags = this.document.getFlag(CONSTANTS.MODULE_NAME, 'visionLevel');

  const status = API.SENSES.find((a: SenseData) => {
    return a.id == requiredVisionLevel || a.name == requiredVisionLevel;
  });

  if (requiredVisionLevel && status && status.id != AtswmEffectSenseFlags.NONE) {
    if (!this.visionLevelIcon1) {
      this.visionLevelIcon1 = this.addChild(drawVisionLevel(this.direction, status));
    }
    if (!this.visionLevelIcon2) {
      this.visionLevelIcon2 = this.addChild(drawVisionLevel(this.direction, status));
    }

    if (this.visionLevelIcon1 && this.visionLevelIcon1.position) {
      this.visionLevelIcon1.position.set(mp1[0], mp1[1]);
      // this.visionLevelIcon1.tint = wc;
    }

    if (this.visionLevelIcon2 && this.visionLevelIcon2.position) {
      this.visionLevelIcon2.position.set(mp2[0], mp2[1]);
      // this.visionLevelIcon2.tint = wc;
    }
  }

  return wrapped(...args);
}

function drawVisionLevel(direction, statusSight: SenseData) {
  // Create the icon
  //const sightIcon = PIXI.Sprite.from(`modules/${CONSTANTS.MODULE_NAME}/icons/${sightAllowed}.png`);
  const sightIcon = PIXI.Sprite.from(statusSight.img);
  sightIcon.width = sightIcon.height = 32;

  // Rotate the icon
  const iconAngle = 0;
  const angle = direction;
  sightIcon.anchor.set(0.5, 0.5);
  sightIcon.rotation = iconAngle + angle;
  return sightIcon;
}

// export function wallNewUpdate(data: any, ...args) {
//   //@ts-ignore
//   PlaceableObject.prototype._onUpdate.apply(this, args);

//   // // Re-draw if the direction changed
//   // if (
//   //   Object.prototype.hasOwnProperty.call(data, 'dir') ||
//   //   Object.prototype.hasOwnProperty.call(data, 'sense') ||
//   //   Object.prototype.hasOwnProperty.call(data, 'move')
//   // ) {
//   //   this.draw();
//   // }

//   // If the wall is controlled, update the highlighted segments
//   if (this._controlled) {
//     canvas.addPendingOperation(
//       'WallsLayer.highlightControlledSegments',
//       this.layer.highlightControlledSegments,
//       this.layer,
//       [],
//     );
//   }

//   // Downstream layer operations
//   this.layer._cloneType = this.document.toJSON();

//   // If the type of door or door state has changed also modify the door icon
//   const rebuildEndpoints = ['move', 'sense', 'c'].some((k) => k in data);
//   const doorChange = this.data.door && ('door' in data || 'ds' in data);
//   if (rebuildEndpoints) {
//     this._onModifyWall(false);
//   } else if(doorChange){
//     if (data.door == 0 && this.doorControl) {
//       (<DoorControl>this.doorControl).destroy();
//     }else{
//       // this._onModifyWall(doorChange);
//     }
//   } else{
//     if (data.door == 0 && this.doorControl) {
//       (<DoorControl>this.doorControl).destroy();
//     }
//   }
//   this.draw();
// }

export function wallNewUpdate2(wrapped, ...args) {
  const p = this.coords;
  // x1 + x2, y1 + y2 => x/y
  const mp = [(p[0] + p[2]) / 2, (p[1] + p[3]) / 2];
  const mp1 = [(p[0] + mp[0]) / 2, (p[1] + mp[1]) / 2];
  const mp2 = [(p[2] + mp[0]) / 2, (p[3] + mp[1]) / 2];

  const wc = this._getWallColor();

  // Determine circle radius and line width
  let lw = 2;
  if (<number>canvas.dimensions?.size > 150) {
    lw = 4;
  } else if (<number>canvas.dimensions?.size > 100) {
    lw = 3;
  }
  const cr = this._hover ? lw * 3 : lw * 2;
  const lw3 = lw * 3;

  const requiredVisionLevel: AtswmEffectSenseFlags = this.document.getFlag(CONSTANTS.MODULE_NAME, 'visionLevel');

  const status = API.SENSES.find((a: SenseData) => {
    return a.id == requiredVisionLevel || a.name == requiredVisionLevel;
  });

  if (args[0]?.flags && args[0]?.flags['sense-walls-multisystem']) {
    if (this.visionLevelIcon1 != null && this.visionLevelIcon1 != undefined) {
      try {
        this.visionLevelIcon1.destroy();
      } catch (e) {
        //
      }
    }
    if (this.visionLevelIcon2 != null && this.visionLevelIcon2 != undefined) {
      try {
        this.visionLevelIcon2.destroy();
      } catch (e) {
        //
      }
    }
  }
  if (requiredVisionLevel && status && status.id != AtswmEffectSenseFlags.NONE) {
    if (!this.visionLevelIcon1 || (args[0]?.flags && args[0]?.flags['sense-walls-multisystem']?.visionLevel)) {
      this.visionLevelIcon1 = this.addChild(drawVisionLevel(this.direction, status));
    }
    if (!this.visionLevelIcon2 || (args[0]?.flags && args[0]?.flags['sense-walls-multisystem']?.visionLevel)) {
      this.visionLevelIcon2 = this.addChild(drawVisionLevel(this.direction, status));
    }

    if (this.visionLevelIcon1 && this.visionLevelIcon1?.position) {
      this.visionLevelIcon1.position.set(mp1[0], mp1[1]);
      // this.visionLevelIcon1.tint = wc;
    }

    if (this.visionLevelIcon2 && this.visionLevelIcon2?.position) {
      this.visionLevelIcon2.position.set(mp2[0], mp2[1]);
      // this.visionLevelIcon2.tint = wc;
    }
  }
  return wrapped(...args);
}

// ========================================================================================

/**
 * Returns the first selected token
 */
function getFirstPlayerTokenSelected(): Token | null {
  // Get first token ownted by the player
  const selectedTokens = <Token[]>canvas.tokens?.controlled;
  if (selectedTokens.length > 1) {
    //iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
    return null;
  }
  if (!selectedTokens || selectedTokens.length == 0) {
    //if(game.user.character.data.token){
    //  //@ts-ignore
    //  return game.user.character.data.token;
    //}else{
    return null;
    //}
  }
  return selectedTokens[0];
}

/**
 * Returns a list of selected (or owned, if no token is selected)
 * note: ex getSelectedOrOwnedToken
 */
function getFirstPlayerToken(): Token | null {
  // Get controlled token
  let token: Token;
  const controlled: Token[] = <Token[]>canvas.tokens?.controlled;
  // Do nothing if multiple tokens are selected
  if (controlled.length && controlled.length > 1) {
    //iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
    return null;
  }
  // If exactly one token is selected, take that
  token = controlled[0];
  if (!token) {
    if (!controlled.length || controlled.length == 0) {
      // If no token is selected use the token of the users character
      token = <Token>canvas.tokens?.placeables.find((token) => token.data._id === game.user?.character?.data?._id);
    }
    // If no token is selected use the first owned token of the users character you found
    if (!token) {
      token = <Token>canvas.tokens?.ownedTokens[0];
    }
  }
  return token;
}

export function getElevationToken(token: Token): number {
  const base = token.document.data;
  return getElevationPlaceableObject(base);
}

export function getElevationWall(wall: Wall): number {
  const base = wall.document.data;
  return getElevationPlaceableObject(base);
}

function getElevationPlaceableObject(placeableObject: any): number {
  let base = placeableObject;
  if (base.document) {
    base = base.document.data;
  }
  const base_elevation =
    //@ts-ignore
    typeof _levels !== 'undefined' &&
    //@ts-ignore
    _levels?.advancedLOS &&
    (placeableObject instanceof Token || placeableObject instanceof TokenDocument)
      ? //@ts-ignore
        _levels.getTokenLOSheight(placeableObject)
      : base.elevation ??
        base.flags['levels']?.elevation ??
        base.flags['levels']?.rangeBottom ??
        base.flags['wallHeight']?.wallHeightBottom ??
        0;
  return base_elevation;
}

function getVisionLevelToken(token: Token): { min: number; max: number; checkElevation: boolean } {
  const actor = <Actor>token.document.getActor();
  const actorEffects = <EmbeddedCollection<typeof ActiveEffect, ActorData>>actor?.data.effects;
  let min = 0;
  let max = 0;
  let hasOnlyEffectsWithCheckElevationTrue = true;

  // regex expression to match all non-alphanumeric characters in string
  const regex = /[^A-Za-z0-9]/g;

  for (const effectEntity of actorEffects) {
    const effectNameToSet = effectEntity.name ? effectEntity.name : effectEntity.data.label;
    if (!effectNameToSet) {
      continue;
    }
    // use replace() method to match and remove all the non-alphanumeric characters
    const effectNameToCheckOnActor = effectNameToSet.replace(regex, '');
    const effectSight = API.SENSES.find((a: SenseData) => {
      return effectNameToCheckOnActor.toLowerCase().startsWith(a.id.toLowerCase());
    });
    // if is a AE with the label of the module (no id sorry)
    if (effectSight) {
      if (min < <number>effectSight?.visionLevelMinIndex) {
        min = <number>effectSight?.visionLevelMinIndex;
      }
      if (max < <number>effectSight?.visionLevelMaxIndex) {
        max = <number>effectSight?.visionLevelMaxIndex;
      }
      // look up if you have not basic AE and if the check elevation is not enabled
      if (
        !effectSight.conditionElevation &&
        effectSight.id != AtswmEffectSenseFlags.NONE &&
        effectSight.id != AtswmEffectSenseFlags.NORMAL &&
        effectSight.id != AtswmEffectSenseFlags.BLINDED
      ) {
        hasOnlyEffectsWithCheckElevationTrue = false;
      }
    }
  }
  return { min: min, max: max, checkElevation: hasOnlyEffectsWithCheckElevationTrue };
}
