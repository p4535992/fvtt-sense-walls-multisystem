# Sense Walls (Multisystem)

![Latest Release Download Count](https://img.shields.io/github/downloads/p4535992/fvtt-sense-walls-multisystem/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge) 

[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fsense-walls-multisystem&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=sense-walls-multisystem) 

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffvtt-sense-walls-multisystem%2Fmaster%2Fsrc%2Fmodule.json&label=Foundry%20Version&query=$.compatibleCoreVersion&colorB=orange&style=for-the-badge)

![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffvtt-sense-walls-multisystem%2Fmaster%2Fsrc%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)

[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Fsense-walls-multisystem%2Fshield%2Fendorsements&style=for-the-badge)](https://www.foundryvtt-hub.com/package/sense-walls-multisystem/)

![GitHub all releases](https://img.shields.io/github/downloads/p4535992/fvtt-sense-walls-multisystem/total?style=for-the-badge)

A module for Foundry VTT that allows to add and remove walls based on the active effects applied on the token.

Just something i have done for understands how levels and other module work with WallLayer and Sightlayer.

This project is a staretd idea , maybe this can evolve i something more articulate.



## Installation

It's always easiest to install modules from the in game add-on browser.

To install this module manually:
1.  Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2.  Click "Install Module"
3.  In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/p4535992/fvtt-sense-walls-multisystem/master/src/module.json`
4.  Click 'Install' and wait for installation to complete
5.  Don't forget to enable the module in game using the "Manage Module" button

### libWrapper

This module uses the [libWrapper](https://github.com/ruipin/fvtt-lib-wrapper) library for wrapping core methods. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

### socketlib

This module uses the [socketlib](https://github.com/manuelVo/foundryvtt-socketlib) library for wrapping core methods. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

### perfect-vision (optional but suggested)

This module uses the [Perfect Vision](https://foundryvtt.com/packages/perfect-vision) library. It is a optional but suggested dependency and it is recommended for the best experience and compatibility with other modules.

## Supported Systems

- [Dnd5e](https://gitlab.com/foundrynet/dnd5e)
- [Pathfinder 2e](https://foundryvtt.com/packages/pf2e)

## Features

Walls can be configured to only show up to a certain level of vision. For example, if the "Piercing Vision Level" is set to "Darkvision" then a character with darkvision or greater darkvision can see and move through the wall (depend on the configuration of the wall), but one with only low-light vision cannot.

You can set the value on the wall config dialog from a dropdown.

You can use any active effect where the name is founded from the following code 

```
// regex expression to match all non-alphanumeric characters in string
const regex = /[^A-Za-z0-9]/g;
// use replace() method to match and remove all the non-alphanumeric characters
effectNameToCheckOnActor = effectNameToCheckOnActor.replace(regex, "");
effectNameToCheckOnActor.toLowerCase().startsWith(effectIdOfTheModule);
```

## Tables

These tables are essential because they help the communtity to decide how to calculate a hierachy between the Active Effect

The calculation is done with this formula: 

`Maximum vision wall level >= token vision level (Active Effects) >= Minimum vision level`

### System Dnd5e

| Image | Effect\Vision Level  | effectId used on the module | Minimum  | Maximum | Check Elevation |
|:------|:---------------------|:---------------------------:|:--------:|:-------:|:---------------:|
|<img src="https://raw.githubusercontent.com/p4535992/fvtt-sense-walls-multisystem/main/src/icons/ae/light_01.jpg" alt="" style="height: 50px; width:50px;"/> | **None** | none         | -2 | -1 | false |
|<img src="https://raw.githubusercontent.com/p4535992/fvtt-sense-walls-multisystem/main/src/icons/ae/light_02.jpg" alt="" style="height: 50px; width:50px;"/> | **Normal** | normal         | 0 | 1 | false |
|<img src="https://raw.githubusercontent.com/p4535992/fvtt-sense-walls-multisystem/main/src/icons/ae/affliction_24.jpg" alt="" style="height: 50px; width:50px;"/> | **Blinded** | blinded   | -1 | 0 | false |
|<img src="https://raw.githubusercontent.com/p4535992/fvtt-sense-walls-multisystem/main/src/icons/ae/evil-eye-red-1.jpg" alt="" style="height: 50px; width:50px;"/> | **Darkvision** | darkvision | 0 | 3 | false |
|<img src="https://raw.githubusercontent.com/p4535992/fvtt-sense-walls-multisystem/main/src/icons/ae/ice_15.jpg" alt="" style="height: 50px; width:50px;"/> | **Tremor Sense** | tremorsense      | 0 | 10 | true |
|<img src="https://raw.githubusercontent.com/p4535992/fvtt-sense-walls-multisystem/main/src/icons/ae/shadow_11.jpg" alt="" style="height: 50px; width:50px;"/> | **See invisible** | seeinvisible | 0 | 5 | false |
|<img src="https://raw.githubusercontent.com/p4535992/fvtt-sense-walls-multisystem/main/src/icons/ae/green_18.jpg" alt="" style="height: 50px; width:50px;"/> | **Blind Sight** | blindsight    | 0 | 6 | false |
|<img src="https://raw.githubusercontent.com/p4535992/fvtt-sense-walls-multisystem/main/src/icons/ae/emerald_11.jpg" alt="" style="height: 50px; width:50px;"/> | **True Sight** | truesight    | 0 | 7 | false |
|<img src="https://raw.githubusercontent.com/p4535992/fvtt-sense-walls-multisystem/main/src/icons/ae/blue_17.jpg" alt="" style="height: 50px; width:50px;"/> | **Devil's sight** | devilssight  | 0 | 8 | false |

### System Pf2e

| Image | Effect\Vision Level  | effectId used on the module | Minimum  | Maximum | Check Elevation |
|:------|:---------------------|:---------------------------:|:--------:|:-------:|:---------------:|
|<img src="https://raw.githubusercontent.com/p4535992/fvtt-sense-walls-multisystem/main/src/icons/ae/light_01.jpg" alt="" style="height: 50px; width:50px;"/> | **None** | none            | -2 | -1 | false |
|<img src="https://raw.githubusercontent.com/p4535992/fvtt-sense-walls-multisystem/main/src/icons/ae/light_02.jpg" alt="" style="height: 50px; width:50px;"/> | **Normal** | normal          | 0 | 1 | false |
|<img src="https://raw.githubusercontent.com/p4535992/fvtt-sense-walls-multisystem/main/src/icons/ae/affliction_24.jpg" alt="" style="height: 50px; width:50px;"/> | **Blinded** | blinded    | -1 | 0 | false |
|<img src="https://raw.githubusercontent.com/p4535992/fvtt-sense-walls-multisystem/main/src/icons/ae/violet_09.jpg" alt="" style="height: 50px; width:50px;"/> | **Low Light Vision** | lowlightvision | 0 | 2 | false |
|<img src="https://raw.githubusercontent.com/p4535992/fvtt-sense-walls-multisystem/main/src/icons/ae/evil-eye-red-1.jpg" alt="" style="height: 50px; width:50px;"/> | **Darkvision** | darkvision | 0 | 3 | false |
|<img src="https://raw.githubusercontent.com/p4535992/fvtt-sense-walls-multisystem/main/src/icons/ae/evil-eye-eerie-1.jpg" alt="" style="height: 50px; width:50px;"/> | **Greater Darkvision** | greaterdarkvision | 0 | 4 | false |

## API

This api is redundant it can be easily replace form other macro or module, is advisable to use other module like [CUB](https://github.com/death-save/combat-utility-belt) or [Dfred Conient Effects](https://github.com/DFreds/dfreds-convenient-effects/)

#### addEffect(actorNameOrId: string, effectId: string, distance: number) ⇒ <code>void</code>

Calculate the distance between the source token and the target placeable objet
**Returns**: <code>void</code> - 

| Param | Type | Description |
| --- | --- | --- |
| actorNameOrId | <code>string</code> | The name or the id of the actor, if applied on a token must be linked to a actor. |
| effectId | <code>string</code> | The effectId used from this module |
| distance | <code>number</code> | OPTIONAL: explicit distance in units not grid to add to the Active Effects |

**Example**:
`SenseWalls.API.addEffect('Zruggig Widebrain','darkvision',60)`
`game.sense-walls-multisystem.API.addEffect('Zruggig Widebrain','darkvision',60)`


## [Changelog](./CHANGELOG.md)

## Issues

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/p4535992/fvtt-sense-walls-multisystem/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).

## License

- [FVTT Sense Walls](https://github.com/JDCalvert/FVTT-Sense-Walls) with [???](https://github.com/JDCalvert/FVTT-Sense-Walls/blob/master/LICENSE)
- [Wonderwalls](https://github.com/kandashi/wonderwalls) with [MIT](https://github.com/kandashi/wonderwalls/blob/master/LICENSE)
- [Image dropdown](https://github.com/marghoobsuleman/ms-Dropdown) with [MIT](https://github.com/marghoobsuleman/ms-Dropdown/blob/master/MIT-LICENSE.txt)
- Some icons are retrieve from the [Dnd5e system](https://gitlab.com/foundrynet/dnd5e) with [MIT](https://gitlab.com/foundrynet/dnd5e/-/blob/master/LICENSE.txt)
- Some icons are retrieve from the [Pf2 system](https://gitlab.com/hooking/foundry-vtt---pathfinder-2e/) with [GPLv2](https://gitlab.com/hooking/foundry-vtt---pathfinder-2e/-/blob/master/LICENSE)

This package is under an [MIT license](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/).

## Credit

- Ty to [JDCalvert](https://github.com/JDCalvert) for the inspirational project [FVTT Sense Walls](https://github.com/JDCalvert/FVTT-Sense-Walls)
- Ty to [Kandashi](https://github.com/kandashi) for the module [Wonderwalls](https://github.com/kandashi/wonderwalls)
- The dropdown with image is build with [Image dropdown](https://github.com/marghoobsuleman/ms-Dropdown)

