import CONSTANTS from '../constants.js';
import { StatusEffectSightFlags, VisionLevelPf2e } from '../sensewalls-models.js';
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

export function buildOption(optionName, optionValue, currentValue) {
  return `<option value=${optionValue} ${currentValue === optionValue ? 'selected' : ''}>${optionName}</option>`;
}

export function updateVisionLevel(token) {
  let actor = token.actor;
  if (!actor) {
    return;
  }

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
    ? VisionLevelPf2e.BLINDED
    : senses.includes(StatusEffectSightFlags.GREATER_DARKVISION)
    ? VisionLevelPf2e.GREATER_DARKVISION
    : senses.includes(StatusEffectSightFlags.DARKVISION)
    ? VisionLevelPf2e.DARKVISION
    : senses.includes(StatusEffectSightFlags.LOW_LIGHT_VISION)
    ? VisionLevelPf2e.LOW_LIGHT_VISION
    : VisionLevelPf2e.NORMAL;
}

export function resetVisionLevel(): number {
  return VisionLevelPf2e.NORMAL;
}

export function shouldIncludeWall(wall, currentTokenVisionLevel: number) {
  return (
    currentTokenVisionLevel < (wall.document.getFlag(CONSTANTS.MODULE_NAME, 'visionLevel') || VisionLevelPf2e.NONE)
  );
}
