const senseWallsModuleName = "sense-walls";

class VisionLevel {
    static BLIND = -1;
    static NORMAL = 0;
    static LOW_LIGHT_VISION = 1;
    static DARKVISION = 2;
    static GREATER_DARKVISION = 3;
    static NONE = 4; // A special, unattainable vision level
}

function buildOption(optionName, optionValue, currentValue) {
    return `<option value=${optionValue} ${currentValue === optionValue ? "selected" : ""}>${optionName}</option>`;
}

Hooks.on(
    "renderWallConfig",
    (app, html, data) => {
        let requiredVisionLevel = app.object.getFlag(senseWallsModuleName, "visionLevel") || VisionLevel.NONE;
        let newHtml = `
            <div class="form-group">
                <label>${game.i18n.localize("senseWalls.piercingVisionLevel.name")}</label>
                <select type="range" name="flags.${senseWallsModuleName}.visionLevel" data-dtype="Number">
                    ${buildOption(game.i18n.localize("senseWalls.piercingVisionLevel.lowLightVision"), VisionLevel.LOW_LIGHT_VISION, requiredVisionLevel)}
                    ${buildOption(game.i18n.localize("senseWalls.piercingVisionLevel.darkvision"), VisionLevel.DARKVISION, requiredVisionLevel)}
                    ${buildOption(game.i18n.localize("senseWalls.piercingVisionLevel.greaterDarkvision"), VisionLevel.GREATER_DARKVISION, requiredVisionLevel)}
                    ${buildOption(game.i18n.localize("senseWalls.piercingVisionLevel.none"), VisionLevel.NONE, requiredVisionLevel)}
                </select>
                <p class="notes">${game.i18n.localize("senseWalls.piercingVisionLevel.description")}</p>
            </div>
        `;

        const underh = html.find('select[name="sight"]');
        const formGroup = underh.closest(".form-group");
        formGroup.after(newHtml);

        app.setPosition({ height: "auto" });
    }
);

game.currentTokenVisionLevel = null;

function updateVisionLevel(token) {
    let actor = token.actor;
    if (!actor) {
        return;
    }

    let senses = actor.data.data.traits.senses;

    if (actor.type === "npc") {
        //NPCs have one "sense" which is a free-text entry. Try to find the individual senses from there
        //by splitting on comma characters and removing whitespace and the dash in "low-light vision"
        senses = senses.value.split(",").map(s => s.replace(/[\s-]+/g, '').toLowerCase());
    } else if (actor.type == "character" || actor.type == "familiar") {
        //Characters have an array of senses. Just put them to lower case to make matching easier
        senses = senses.map(sense => sense.type.toLowerCase());
    } else {
        // Non-creature actors (vehicles, loot actors etc.) don't have senses, so treat them as normal vision
        return;
    }

    //If the token is blind, then we'll ignore any vision senses. Otherwise, find their highest
    //vision level and we'll use that to see if the wall should be ignored.
    game.currentTokenVisionLevel = actor.getCondition("blinded")
        ? VisionLevel.BLIND
        : senses.includes("greaterdarkvision")
            ? VisionLevel.GREATER_DARKVISION
            : senses.includes("darkvision")
                ? VisionLevel.DARKVISION
                : senses.includes("lowlightvision")
                    ? VisionLevel.LOW_LIGHT_VISION
                    : VisionLevel.NORMAL;
}

function resetVisionLevel() {
    game.currentTokenVisionLevel = VisionLevel.NORMAL;
}

function shouldIncludeWall(wall) {
    return game.currentTokenVisionLevel < (wall.document.getFlag(senseWallsModuleName, "visionLevel") || VisionLevel.NONE);
}

Hooks.on(
    "init",
    () => {
        // Just as we're about to recalculate vision for this token, keep track of its vision level
        libWrapper.register(
            senseWallsModuleName,
            "Token.prototype.updateVisionSource",
            function updateTokenVisionSource(wrapped, ...args) {
                updateVisionLevel(this);
                wrapped(...args);
                resetVisionLevel();
            },
            "WRAPPER"
        );

        // Ignore the wall if the token's vision level is sufficient to pierce the wall, as per the wall configuration
        libWrapper.register(
            senseWallsModuleName,
            "ClockwiseSweepPolygon.testWallInclusion",
            function filterWalls(wrapped, ...args) {
                if (args[2] === "sight") {
                    return wrapped(...args) && shouldIncludeWall(args[0]);
                } else {
                    return wrapped(...args);
                }
            },
            "WRAPPER"
        );

        if (game.modules.get("levels")?.active) {
            libWrapper.register(
                senseWallsModuleName,
                "Levels.prototype.advancedLosTestInLos",
                function updateTokenVisionSourceLevels(wrapped, ...args) {
                    updateVisionLevel(args[0]);
                    let result = wrapped(...args);
                    resetVisionLevel();
                    return result
                }
            );

            libWrapper.register(
                senseWallsModuleName,
                "Levels.prototype.shouldIgnoreWall",
                function filterWallsLevels(wrapped, ...args) {
                    if (args[1] === 0) {
                        return wrapped(...args) || !shouldIncludeWall(args[0]);
                    } else {
                        return wrapped(...args);
                    }
                },
                "WRAPPER"
            );
        }
    }
)
