"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repulser = void 0;
const Enums_1 = require("../../../../Enums");
const Utils_1 = require("../../../../Utils");
class Repulser {
    constructor(container) {
        this.container = container;
    }
    isEnabled() {
        const container = this.container;
        const options = container.options;
        const mouse = container.interactivity.mouse;
        const events = options.interactivity.events;
        const divs = events.onDiv;
        const divBubble = divs instanceof Array
            ? divs.filter((t) => t.enable && Utils_1.Utils.isInArray(Enums_1.DivMode.repulse, t.mode)).length > 0
            : Utils_1.Utils.isInArray(Enums_1.DivMode.bubble, divs.mode);
        if (!(divBubble || (events.onHover.enable && mouse.position) || (events.onClick.enable && mouse.clickPosition))) {
            return false;
        }
        const hoverMode = events.onHover.mode;
        const clickMode = events.onClick.mode;
        return (Utils_1.Utils.isInArray(Enums_1.HoverMode.repulse, hoverMode) || Utils_1.Utils.isInArray(Enums_1.ClickMode.repulse, clickMode) || divBubble);
    }
    reset() {
    }
    interact() {
        const container = this.container;
        const options = container.options;
        const mouseMoveStatus = container.interactivity.status === Utils_1.Constants.mouseMoveEvent;
        const events = options.interactivity.events;
        const hoverEnabled = events.onHover.enable;
        const hoverMode = events.onHover.mode;
        const clickEnabled = events.onClick.enable;
        const clickMode = events.onClick.mode;
        const divs = events.onDiv;
        if (mouseMoveStatus && hoverEnabled && Utils_1.Utils.isInArray(Enums_1.HoverMode.repulse, hoverMode)) {
            this.hoverRepulse();
        }
        else if (clickEnabled && Utils_1.Utils.isInArray(Enums_1.ClickMode.repulse, clickMode)) {
            this.clickRepulse();
        }
        else {
            if (divs instanceof Array) {
                for (const div of divs) {
                    const divMode = div.mode;
                    const divEnabled = div.enable;
                    if (divEnabled && Utils_1.Utils.isInArray(Enums_1.DivMode.repulse, divMode)) {
                        this.divRepulse(div);
                    }
                }
            }
            else {
                const divMode = divs.mode;
                const divEnabled = divs.enable;
                if (divEnabled && Utils_1.Utils.isInArray(Enums_1.DivMode.repulse, divMode)) {
                    this.divRepulse(divs);
                }
            }
        }
    }
    divRepulse(div) {
        const ids = div.ids;
        if (ids instanceof Array) {
            for (const id of ids) {
                this.singleDivRepulse(id, div);
            }
        }
        else {
            this.singleDivRepulse(ids, div);
        }
    }
    singleDivRepulse(id, div) {
        const container = this.container;
        const elem = document.getElementById(id);
        if (!elem) {
            return;
        }
        const pxRatio = container.retina.pixelRatio;
        const pos = {
            x: (elem.offsetLeft + elem.offsetWidth / 2) * pxRatio,
            y: (elem.offsetTop + elem.offsetHeight / 2) * pxRatio,
        };
        const repulseRadius = (elem.offsetWidth / 2) * pxRatio;
        const area = div.type === Enums_1.DivType.circle
            ? new Utils_1.Circle(pos.x, pos.y, repulseRadius)
            : new Utils_1.Rectangle(elem.offsetLeft * pxRatio, elem.offsetTop * pxRatio, elem.offsetWidth * pxRatio, elem.offsetHeight * pxRatio);
        this.processRepulse(pos, repulseRadius, area, this.divRepulseMode(id));
    }
    hoverRepulse() {
        const container = this.container;
        const mousePos = container.interactivity.mouse.position;
        if (!mousePos) {
            return;
        }
        const repulseRadius = container.retina.repulseModeDistance;
        this.processRepulse(mousePos, repulseRadius, new Utils_1.Circle(mousePos.x, mousePos.y, repulseRadius));
    }
    processRepulse(position, repulseRadius, area, divRepulse) {
        var _a;
        const container = this.container;
        const query = container.particles.quadTree.query(area);
        for (const particle of query) {
            const { dx, dy, distance } = Utils_1.Utils.getDistances(particle.position, position);
            const normVec = {
                x: dx / distance,
                y: dy / distance,
            };
            const velocity = ((_a = divRepulse === null || divRepulse === void 0 ? void 0 : divRepulse.speed) !== null && _a !== void 0 ? _a : container.options.interactivity.modes.repulse.speed) * 100;
            const repulseFactor = Utils_1.Utils.clamp((1 - Math.pow(distance / repulseRadius, 2)) * velocity, 0, 50);
            const outMode = particle.particlesOptions.move.outMode;
            const sizeValue = particle.size.value;
            const pos = {
                x: particle.position.x + normVec.x * repulseFactor,
                y: particle.position.y + normVec.y * repulseFactor,
            };
            if (outMode === Enums_1.OutMode.bounce ||
                outMode === Enums_1.OutMode.bounceVertical ||
                outMode === Enums_1.OutMode.bounceHorizontal) {
                const isInside = {
                    horizontal: pos.x - sizeValue > 0 && pos.x + sizeValue < container.canvas.size.width,
                    vertical: pos.y - sizeValue > 0 && pos.y + sizeValue < container.canvas.size.height,
                };
                if (outMode === Enums_1.OutMode.bounceVertical || isInside.horizontal) {
                    particle.position.x = pos.x;
                }
                if (outMode === Enums_1.OutMode.bounceHorizontal || isInside.vertical) {
                    particle.position.y = pos.y;
                }
            }
            else {
                particle.position.x = pos.x;
                particle.position.y = pos.y;
            }
        }
    }
    clickRepulse() {
        const container = this.container;
        if (!container.repulse.finish) {
            if (!container.repulse.count) {
                container.repulse.count = 0;
            }
            container.repulse.count++;
            if (container.repulse.count === container.particles.count) {
                container.repulse.finish = true;
            }
        }
        if (container.repulse.clicking) {
            const repulseDistance = container.retina.repulseModeDistance;
            const repulseRadius = Math.pow(repulseDistance / 6, 3);
            const mouseClickPos = container.interactivity.mouse.clickPosition;
            if (mouseClickPos === undefined) {
                return;
            }
            const range = new Utils_1.Circle(mouseClickPos.x, mouseClickPos.y, repulseRadius);
            const query = container.particles.quadTree.query(range);
            for (const particle of query) {
                const { dx, dy, distance } = Utils_1.Utils.getDistances(mouseClickPos, particle.position);
                const d = distance * distance;
                const velocity = container.options.interactivity.modes.repulse.speed;
                const force = (-repulseRadius * velocity) / d;
                if (d <= repulseRadius) {
                    container.repulse.particles.push(particle);
                    this.processClickRepulse(particle, dx, dy, force);
                }
            }
        }
        else if (container.repulse.clicking === false) {
            for (const particle of container.repulse.particles) {
                particle.velocity.horizontal = particle.initialVelocity.horizontal;
                particle.velocity.vertical = particle.initialVelocity.vertical;
            }
            container.repulse.particles = [];
        }
    }
    processClickRepulse(particle, dx, dy, force) {
        const container = this.container;
        const options = container.options;
        const f = Math.atan2(dy, dx);
        particle.velocity.horizontal = force * Math.cos(f);
        particle.velocity.vertical = force * Math.sin(f);
        const outMode = options.particles.move.outMode;
        if (outMode === Enums_1.OutMode.bounce || outMode === Enums_1.OutMode.bounceHorizontal || outMode === Enums_1.OutMode.bounceVertical) {
            const pos = {
                x: particle.position.x + particle.velocity.horizontal,
                y: particle.position.y + particle.velocity.vertical,
            };
            if (outMode !== Enums_1.OutMode.bounceVertical) {
                if (pos.x + particle.size.value > container.canvas.size.width || pos.x - particle.size.value < 0) {
                    particle.velocity.horizontal *= -1;
                }
            }
            if (outMode !== Enums_1.OutMode.bounceHorizontal) {
                if (pos.y + particle.size.value > container.canvas.size.height || pos.y - particle.size.value < 0) {
                    particle.velocity.vertical *= -1;
                }
            }
        }
    }
    divRepulseMode(divId) {
        if (!divId) {
            return;
        }
        const repulseDiv = this.container.options.interactivity.modes.repulse.divs;
        if (!repulseDiv) {
            return;
        }
        if (repulseDiv instanceof Array) {
            return repulseDiv.find((d) => d.ids.includes(divId));
        }
        else if (repulseDiv.ids.includes(divId)) {
            return repulseDiv;
        }
    }
}
exports.Repulser = Repulser;
