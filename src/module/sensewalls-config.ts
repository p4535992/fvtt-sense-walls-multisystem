import API from './api';
import CONSTANTS from './constants';
import { i18n } from './lib/lib';
import { StatusEffectSightFlags, StatusSight } from './sensewalls-models';
import { canvas, game } from './settings';

export class SenseWallsPlaceableConfig {
  // Hooks
  static registerHooks() {
    Hooks.on('renderFormApplication', SenseWallsPlaceableConfig._handleRenderFormApplication);
    Hooks.on('preUpdateWall', SenseWallsPlaceableConfig._applyVisionLevel.bind(SenseWallsPlaceableConfig));
  }

  static configHandlers = [{ classType: WallConfig, method: '_handleGenericConfig' }];

  static _handleRenderFormApplication(app, html) {
    const found = SenseWallsPlaceableConfig.configHandlers.find((config) => app instanceof config.classType);
    if (!found) return;
    SenseWallsPlaceableConfig[found.method](app, html, true);
  }

  static _handleGenericConfig(app, html) {
    const elem = html.find(`button[name="submit"]`);
    SenseWallsPlaceableConfig._applyHtml(app, elem, true);
  }

  static _applyHtml(app, html, insertBefore = false) {
    if (!html) {
      return;
    }
    if (!game.user?.isGM) {
      return;
    }

    const requiredVisionLevel = app.object.getFlag(CONSTANTS.MODULE_NAME, 'visionLevel') || StatusEffectSightFlags.NONE;

    const sensesOrderByName = <StatusSight[]>API.SENSES.sort((a, b) => a.name.localeCompare(b.name));

    const options: string[] = [];
    options.push(`<option data-image="icons/svg/mystery-man.svg" value="">${i18n('None')}</option>`);
    sensesOrderByName.forEach((a: StatusSight) => {
      if (requiredVisionLevel == a.id) {
        options.push(`<option selected="selected" data-image="${a.img}" value="${a.id}">${i18n(a.name)}</option>`);
      } else {
        options.push(`<option data-image="${a.img}" value="${a.id}">${i18n(a.name)}</option>`);
      }
    });

    const newHtml = `
            <div class="form-group">
                <label>${i18n(`${CONSTANTS.MODULE_NAME}.visionLevel.name`)}</label>
                <select name="flags.${CONSTANTS.MODULE_NAME}.visionLevel" data-dtype="String" is="ms-dropdown">
                  ${options.join('')}
                </select>
                <p class="notes">${i18n(`${CONSTANTS.MODULE_NAME}.visionLevel.description`)}</p>
            </div>
        `;

    const underh = html.find('select[name="sight"]');
    const formGroup = underh.closest('.form-group');
    formGroup.append(newHtml);

    app.setPosition({ height: 'auto' });
    if (insertBefore) {
      $(newHtml).insertBefore(html);
    } else {
      html.append(newHtml);
    }
    app.setPosition({ height: 'auto' });
  }

  static _applyVisionLevel(document, updateData) {
    const properties: string[] = [];
    properties.push(`flags.${CONSTANTS.MODULE_NAME}.visionLevel`);
    for (const propertyName of properties) {
      let propertyNameOr = propertyName;
      if (document instanceof Actor) {
        propertyNameOr = 'token.' + propertyNameOr;
      }
      if (hasProperty(updateData, propertyNameOr)) {
        const eis = getProperty(updateData, propertyNameOr);
        if (eis != null && eis != undefined) {
          setProperty(updateData, propertyNameOr, eis);
        }
      }
    }
  }
}
