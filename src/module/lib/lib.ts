import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs';
import { ActorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import API from '../api.js';
import CONSTANTS from '../constants.js';
import { StatusEffectSightFlags, StatusSight } from '../sensewalls-models.js';
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
  return game.i18n.localize(key).trim();
};

export const i18nFormat = (key: string, data = {}): string => {
  return game.i18n.format(key, data).trim();
};

// export const setDebugLevel = (debugText: string): void => {
//   debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
//   // 0 = none, warnings = 1, debug = 2, all = 3
//   if (debugEnabled >= 3) CONFIG.debug.hooks = true;
// };

export function dialogWarning(message, icon = 'fas fa-exclamation-triangle') {
  return `<p class="${CONSTANTS.MODULE_NAME}-dialog">
        <i style="font-size:3rem;" class="${icon}"></i><br><br>
        <strong style="font-size:1.2rem;">Item Piles</strong>
        <br><br>${message}
    </p>`;
}

// =============================
// Module specific function
// =============================

// export function buildOption(optionName, optionValue, currentValue) {
//   return `<option value=${optionValue} ${currentValue === optionValue ? 'selected' : ''}>${optionName}</option>`;
// }

export function updateVisionLevel(token) {
  const actor = token.actor;
  if (!actor) {
    return;
  }

  /*
  let senses = actor.data.data.traits.senses;

  if (actor.type === 'npc') {
    //NPCs have one "sense" which is a free-text entry. Try to find the individual senses from there
    //by splitting on comma characters and removing whitespace and the dash in "low-light vision"
    senses = senses.value.split(',').map((s) => s.replace(/[\s-]+/g, '').toLowerCase());
  } else if (actor.type == 'character' || actor.type == 'familiar') {
    //Characters have an array of senses. Just put them to lower case to make matching easier
    senses = senses.map((sense) => sense.type.toLowerCase());
  } else {
    // Non-creature actors (vehicles, loot actors etc.) don't have senses, so treat them as normal vision
    return;
  }

  //If the token is blind, then we'll ignore any vision senses. Otherwise, find their highest
  //vision level and we'll use that to see if the wall should be ignored.
  return actor.getCondition(StatusEffectSightFlags.BLINDED)
    ? StatusEffectSightFlags.BLINDED
    : senses.includes(StatusEffectSightFlags.GREATER_DARKVISION)
    ? StatusEffectSightFlags.GREATER_DARKVISION
    : senses.includes(StatusEffectSightFlags.DARKVISION)
    ? StatusEffectSightFlags.DARKVISION
    : senses.includes(StatusEffectSightFlags.LOW_LIGHT_VISION)
    ? StatusEffectSightFlags.LOW_LIGHT_VISION
    : StatusEffectSightFlags.NORMAL;
  */
}

export function resetVisionLevel(): string {
  return StatusEffectSightFlags.NORMAL;
}

export function shouldIncludeWall(wall): boolean {
  // const tokenVisioneLevel = <number>currentToken.document.getFlag(CONSTANTS.MODULE_NAME, 'visionLevel');
  let currentToken = <Token>getFirstPlayerTokenSelected();
  if (!currentToken) {
    currentToken = <Token>getFirstPlayerToken();
  }
  if (!currentToken) {
    return true;
  }
  const tokenVisioneLevel = getVisionLevelToken(currentToken);
  const wallVisionLevel = wall.document.getFlag(CONSTANTS.MODULE_NAME, 'visionLevel');
  const indexValueWallVisionLevel = API.SENSES.find((a: StatusSight) => {
    return a.id == wallVisionLevel;
  });
  return (
    tokenVisioneLevel.min <= <number>indexValueWallVisionLevel?.visionLevelMin &&
    tokenVisioneLevel.max >= <number>indexValueWallVisionLevel?.visionLevelMax
  );
}

// ========================================================================================

export async function wallNewDraw() {
  this.clear();
  this.line = this.addChild(new PIXI.Graphics());
  this.endpoints = this.addChild(new PIXI.Graphics());
  // Draw wall components
  this.directionIcon = this.data.dir ? this.addChild(this._drawDirection()) : null;

  // this.visibilityIcon = this.data.sight === 0 ? this.addChild(drawVisibility(this.direction)) : null;
  // this.movementIcon = this.data.move === 0 ? this.addChild(drawMovement(this.direction)) : null;
  const requiredVisionLevel: StatusEffectSightFlags =
    this.getFlag(CONSTANTS.MODULE_NAME, 'visionLevel') || StatusEffectSightFlags.NONE;
  this.visionLevelIcon =
    this.data.sight === 0 ? this.addChild(drawVisionLevel(this.direction, requiredVisionLevel)) : null;

  // Draw a door control icon
  if (this.isDoor) {
    this.createDoorControl();
  }
  // Draw current wall
  this.refresh();

  // Enable interactivity, only if the Tile has a true ID
  if (this.id) {
    this.activateListeners();
  }
  return this;
}
export function wallNewRefresh() {
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

  // Draw background
  this.line.clear().lineStyle(lw3, 0x000000, 1.0).moveTo(p[0], p[1]).lineTo(p[2], p[3]);
  this.endpoints
    .clear()
    .beginFill(0x000000, 1.0)
    .drawCircle(p[0], p[1], cr + lw)
    .drawCircle(p[2], p[3], cr + lw);

  // Draw foreground
  this.line.lineStyle(lw, wc, 1.0).lineTo(p[0], p[1]);
  this.endpoints.beginFill(wc, 1.0).drawCircle(p[0], p[1], cr).drawCircle(p[2], p[3], cr);

  // Tint direction icon
  if (this.directionIcon) {
    this.directionIcon.position.set(mp[0], mp[1]);
    this.directionIcon.tint = wc;
  }
  // if (this.visibilityIcon) {
  //   this.visibilityIcon.position.set(mp1[0], mp1[1]);
  //   this.visibilityIcon.tint = wc;
  // }
  // if (this.movementIcon) {
  //   this.movementIcon.position.set(mp2[0], mp2[1]);
  //   this.movementIcon.tint = wc;
  // }

  if (this.visionLevelIcon) {
    this.visionLevelIcon.position.set(mp1[0], mp1[1]);
    this.visionLevelIcon.tint = wc;
  }

  // Re-position door control icon
  if (this.doorControl) {
    this.doorControl.reposition();
  }
  // Update line hit area
  this.line.hitArea = this._getWallHitPolygon(p, lw3);
  // this.line.beginFill(0x00FF00, 1.0).drawShape(this.line.hitArea).endFill(); // Debug line hit area
  return this;
}

// function drawVisibility(direction) {
//   // Create the icon
//   const eye = PIXI.Sprite.from('modules/wonderwalls/icons/eye-solid.png');
//   eye.width = eye.height = 32;

//   // Rotate the icon
//   let iconAngle = 0;
//   let angle = direction;
//   eye.anchor.set(0.5, 0.5);
//   eye.rotation = iconAngle + angle;
//   return eye;
// }

// function drawMovement(direction) {
//   // Create the icon
//   const walk = PIXI.Sprite.from('modules/wonderwalls/icons/walking-solid.png');
//   walk.width = walk.height = 32;

//   // Rotate the icon
//   let iconAngle = 0;
//   let angle = direction;
//   walk.anchor.set(0.5, 0.5);
//   walk.rotation = iconAngle + angle;
//   return walk;
// }

function drawVisionLevel(direction, sightAllowed: StatusEffectSightFlags) {
  // Create the icon
  const sightIcon = PIXI.Sprite.from(`modules/${CONSTANTS.MODULE_NAME}/icons/${sightAllowed}.png`);
  sightIcon.width = sightIcon.height = 32;

  // Rotate the icon
  const iconAngle = 0;
  const angle = direction;
  sightIcon.anchor.set(0.5, 0.5);
  sightIcon.rotation = iconAngle + angle;
  return sightIcon;
}

export function wallNewUpdate(data: any, ...args) {
  //@ts-ignore
  PlaceableObject.prototype._onUpdate.apply(this, args);

  // Re-draw if the direction changed
  if (
    Object.prototype.hasOwnProperty.call(data, 'dir') ||
    Object.prototype.hasOwnProperty.call(data, 'sense') ||
    Object.prototype.hasOwnProperty.call(data, 'move')
  ) {
    this.draw();
  }

  // If the wall is controlled, update the highlighted segments
  if (this._controlled) {
    canvas.addPendingOperation(
      'WallsLayer.highlightControlledSegments',
      this.layer.highlightControlledSegments,
      this.layer,
      [],
    );
  }

  // Downstream layer operations
  this.layer._cloneType = this.document.toJSON();

  // If the type of door or door state has changed also modify the door icon
  const rebuildEndpoints = ['move', 'sense', 'c'].some((k) => k in data);
  const doorChange = this.data.door && ('door' in data || 'ds' in data);
  if (rebuildEndpoints || doorChange) {
    this._onModifyWall(doorChange);
  }
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
  const base = placeableObject;
  const base_elevation =
    base.elevation ??
    base.flags['levels']?.elevation ??
    base.flags['levels']?.rangeBottom ??
    base.flags['wallHeight']?.wallHeightBottom ??
    0;
  return base_elevation;
}

function getVisionLevelToken(token: Token): { min: number; max: number } {
  const actor = <Actor>token.document.getActor();
  const actorEffects = <EmbeddedCollection<typeof ActiveEffect, ActorData>>actor?.data.effects;
  let min = 0;
  let max = 0;
  for (const effectEntity of actorEffects) {
    const effectNameToSet = effectEntity.name ? effectEntity.name : effectEntity.data.label;
    if (!effectNameToSet) {
      continue;
    }
    const effectSight = API.SENSES.find((a: StatusSight) => {
      return effectNameToSet.toLowerCase().startsWith(a.id.toLowerCase());
    });
    if (effectSight) {
      if (min < <number>effectSight?.visionLevelMin) {
        min = <number>effectSight?.visionLevelMin;
      }
      if (max < <number>effectSight?.visionLevelMax) {
        max = <number>effectSight?.visionLevelMax;
      }
    }
  }
  return { min: min, max: max };
}
