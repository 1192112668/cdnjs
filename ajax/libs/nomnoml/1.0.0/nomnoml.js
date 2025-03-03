;(function (factoryFn) {
  if (typeof module === 'object' && module.exports)
  	module.exports = factoryFn(require('dagre'));
  else this.nomnoml = factoryFn(dagre);
})(function (dagre) {
  var nomnoml;
(function (nomnoml) {
    function buildStyle(conf) {
        return {
            bold: conf.bold || false,
            underline: conf.underline || false,
            italic: conf.italic || false,
            dashed: conf.dashed || false,
            empty: conf.empty || false,
            center: conf.center || false,
            fill: conf.fill || undefined,
            stroke: conf.stroke || undefined,
            visual: conf.visual || 'class',
            direction: conf.direction || undefined
        };
    }
    nomnoml.buildStyle = buildStyle;
    var Compartment = (function () {
        function Compartment(lines, nodes, relations) {
            this.lines = lines;
            this.nodes = nodes;
            this.relations = relations;
        }
        return Compartment;
    }());
    nomnoml.Compartment = Compartment;
    var Relation = (function () {
        function Relation() {
        }
        return Relation;
    }());
    nomnoml.Relation = Relation;
    var Classifier = (function () {
        function Classifier(type, name, compartments) {
            this.type = type;
            this.name = name;
            this.compartments = compartments;
            this.dividers = [];
        }
        return Classifier;
    }());
    nomnoml.Classifier = Classifier;
})(nomnoml || (nomnoml = {}));
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var nomnoml;
(function (nomnoml) {
    function layout(measurer, config, ast) {
        function measureLines(lines, fontWeight) {
            if (!lines.length)
                return { width: 0, height: config.padding };
            measurer.setFont(config, fontWeight, 'normal');
            return {
                width: Math.round(Math.max.apply(Math, lines.map(measurer.textWidth)) + 2 * config.padding),
                height: Math.round(measurer.textHeight() * lines.length + 2 * config.padding)
            };
        }
        function layoutCompartment(c, compartmentIndex, style) {
            var textSize = measureLines(c.lines, compartmentIndex ? 'normal' : 'bold');
            if (!c.nodes.length && !c.relations.length) {
                c.width = textSize.width;
                c.height = textSize.height;
                c.offset = { x: config.padding, y: config.padding };
                return;
            }
            c.nodes.forEach(layoutClassifier);
            var g = new dagre.graphlib.Graph();
            g.setGraph({
                rankdir: style.direction || config.direction,
                nodesep: config.spacing,
                edgesep: config.spacing,
                ranksep: config.spacing,
                acyclicer: config.acyclicer,
                ranker: config.ranker
            });
            for (var _i = 0, _a = c.nodes; _i < _a.length; _i++) {
                var e = _a[_i];
                g.setNode(e.name, { width: e.layoutWidth, height: e.layoutHeight });
            }
            for (var _b = 0, _c = c.relations; _b < _c.length; _b++) {
                var r = _c[_b];
                g.setEdge(r.start, r.end, { id: r.id });
            }
            dagre.layout(g);
            var rels = nomnoml.skanaar.indexBy(c.relations, 'id');
            var nodes = nomnoml.skanaar.indexBy(c.nodes, 'name');
            g.nodes().forEach(function (name) {
                var node = g.node(name);
                nodes[name].x = node.x;
                nodes[name].y = node.y;
            });
            var left = 0;
            var right = 0;
            var top = 0;
            var bottom = 0;
            g.edges().forEach(function (edgeObj) {
                var edge = g.edge(edgeObj);
                var start = nodes[edgeObj.v];
                var end = nodes[edgeObj.w];
                var rel = rels[edge.id];
                rel.path = nomnoml.skanaar.flatten([[start], edge.points, [end]]).map(toPoint);
                var startP = rel.path[1];
                var endP = rel.path[rel.path.length - 2];
                layoutLabel(rel.startLabel, startP, adjustQuadrant(quadrant(startP, start, 4), start, end));
                layoutLabel(rel.endLabel, endP, adjustQuadrant(quadrant(endP, end, 2), end, start));
                left = Math.min.apply(Math, __spreadArrays([left, rel.startLabel.x, rel.endLabel.x], edge.points.map(function (e) { return e.x; }), edge.points.map(function (e) { return e.x; })));
                right = Math.max.apply(Math, __spreadArrays([right, rel.startLabel.x + rel.startLabel.width, rel.endLabel.x + rel.endLabel.width], edge.points.map(function (e) { return e.x; })));
                top = Math.min.apply(Math, __spreadArrays([top, rel.startLabel.y, rel.endLabel.y], edge.points.map(function (e) { return e.y; })));
                bottom = Math.max.apply(Math, __spreadArrays([bottom, rel.startLabel.y + rel.startLabel.height, rel.endLabel.y + rel.endLabel.height], edge.points.map(function (e) { return e.y; })));
            });
            var graph = g.graph();
            var width = Math.max(graph.width, right - left);
            var height = Math.max(graph.height, bottom - top);
            var graphHeight = height ? height + 2 * config.gutter : 0;
            var graphWidth = width ? width + 2 * config.gutter : 0;
            c.width = Math.max(textSize.width, graphWidth) + 2 * config.padding;
            c.height = textSize.height + graphHeight + config.padding;
            c.offset = { x: config.padding - left, y: config.padding - top };
        }
        function toPoint(o) {
            return { x: o.x, y: o.y };
        }
        function layoutLabel(label, point, quadrant) {
            if (!label.text) {
                label.width = 0;
                label.height = 0;
                label.x = point.x;
                label.y = point.y;
            }
            else {
                var fontSize = config.fontSize;
                var lines = label.text.split('`');
                label.width = Math.max.apply(Math, lines.map(function (l) { return measurer.textWidth(l); })),
                    label.height = fontSize * lines.length;
                label.x = point.x + ((quadrant == 1 || quadrant == 4) ? config.padding : -label.width - config.padding),
                    label.y = point.y + ((quadrant == 3 || quadrant == 4) ? config.padding : -label.height - config.padding);
            }
        }
        function quadrant(point, node, fallback) {
            if (point.x < node.x && point.y < node.y)
                return 1;
            if (point.x > node.x && point.y < node.y)
                return 2;
            if (point.x > node.x && point.y > node.y)
                return 3;
            if (point.x < node.x && point.y > node.y)
                return 4;
            return fallback;
        }
        function adjustQuadrant(quadrant, point, opposite) {
            if ((opposite.x == point.x) || (opposite.y == point.y))
                return quadrant;
            var flipHorizontally = [4, 3, 2, 1];
            var flipVertically = [2, 1, 4, 3];
            var oppositeQuadrant = (opposite.y < point.y) ?
                ((opposite.x < point.x) ? 2 : 1) :
                ((opposite.x < point.x) ? 3 : 4);
            if (oppositeQuadrant === quadrant) {
                if (config.direction === 'LR')
                    return flipHorizontally[quadrant - 1];
                if (config.direction === 'TB')
                    return flipVertically[quadrant - 1];
            }
            return quadrant;
        }
        function layoutClassifier(clas) {
            var style = config.styles[clas.type] || nomnoml.styles.CLASS;
            clas.compartments.forEach(function (co, i) { layoutCompartment(co, i, style); });
            nomnoml.layouters[style.visual](config, clas);
            clas.layoutWidth = clas.width + 2 * config.edgeMargin;
            clas.layoutHeight = clas.height + 2 * config.edgeMargin;
        }
        layoutCompartment(ast, 0, nomnoml.styles.CLASS);
        return ast;
    }
    nomnoml.layout = layout;
})(nomnoml || (nomnoml = {}));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var nomnoml;
(function (nomnoml) {
    var ImportDepthError = (function (_super) {
        __extends(ImportDepthError, _super);
        function ImportDepthError() {
            return _super.call(this, 'max_import_depth exceeded') || this;
        }
        return ImportDepthError;
    }(Error));
    nomnoml.ImportDepthError = ImportDepthError;
    function compileFile(filepath, maxImportDepth, depth) {
        var fs = require('fs');
        var path = require('path');
        if (depth > maxImportDepth) {
            throw new ImportDepthError();
        }
        var source = fs.readFileSync(filepath, { encoding: 'utf8' });
        var directory = path.dirname(filepath);
        return source.replace(/#import: *(.*)/g, function (a, file) {
            return compileFile(path.join(directory, file), maxImportDepth, depth + 1);
        });
    }
    nomnoml.compileFile = compileFile;
})(nomnoml || (nomnoml = {}));
var nomnoml;
(function (nomnoml) {
    nomnoml.version = '1.0.0';
    function fitCanvasSize(canvas, rect, zoom) {
        canvas.width = rect.width * zoom;
        canvas.height = rect.height * zoom;
    }
    function Measurer(config, graphics) {
        return {
            setFont: function (conf, bold, ital) {
                graphics.setFont(conf.font, bold, ital, config.fontSize);
            },
            textWidth: function (s) { return graphics.measureText(s).width; },
            textHeight: function () { return config.leading * config.fontSize; }
        };
    }
    ;
    function parseAndRender(code, graphics, canvas, scale) {
        var parsedDiagram = nomnoml.parse(code);
        var config = parsedDiagram.config;
        var measurer = Measurer(config, graphics);
        var layout = nomnoml.layout(measurer, config, parsedDiagram.root);
        if (canvas) {
            fitCanvasSize(canvas, layout, config.zoom * scale);
        }
        config.zoom *= scale;
        nomnoml.render(graphics, config, layout, measurer.setFont);
        return { config: config, layout: layout };
    }
    function draw(canvas, code, scale) {
        return parseAndRender(code, nomnoml.skanaar.Canvas(canvas), canvas, scale || 1);
    }
    nomnoml.draw = draw;
    function renderSvg(code, document) {
        var skCanvas = nomnoml.skanaar.Svg('', document);
        var _a = parseAndRender(code, skCanvas, null, 1), config = _a.config, layout = _a.layout;
        return skCanvas.serialize({
            width: layout.width,
            height: layout.height
        }, code, config.title);
    }
    nomnoml.renderSvg = renderSvg;
})(nomnoml || (nomnoml = {}));
var nomnoml;
(function (nomnoml) {
    var Line = (function () {
        function Line() {
        }
        return Line;
    }());
    function parse(source) {
        function onlyCompilables(line) {
            var ok = line[0] !== '#' && line.trim().substring(0, 2) !== '//';
            return ok ? line.trim() : '';
        }
        function isDirective(line) { return line.text[0] === '#'; }
        var lines = source.split('\n').map(function (s, i) {
            return { text: s, index: i };
        });
        var pureDirectives = lines.filter(isDirective);
        var directives = {};
        pureDirectives.forEach(function (line) {
            try {
                var tokens = line.text.substring(1).split(':');
                directives[tokens[0].trim()] = tokens[1].trim();
            }
            catch (e) {
                throw new Error('line ' + (line.index + 1));
            }
        });
        var pureDiagramCode = lines.map(function (e) { return onlyCompilables(e.text); }).join('\n').trim();
        var parseTree = nomnoml.intermediateParse(pureDiagramCode);
        return {
            root: nomnoml.transformParseIntoSyntaxTree(parseTree),
            config: getConfig(directives)
        };
        function directionToDagre(word) {
            if (word == 'down')
                return 'TB';
            if (word == 'right')
                return 'LR';
            else
                return 'TB';
        }
        function parseRanker(word) {
            if (word == 'network-simplex' || word == 'tight-tree' || word == 'longest-path') {
                return word;
            }
            return 'network-simplex';
        }
        function parseCustomStyle(styleDef) {
            var contains = nomnoml.skanaar.hasSubstring;
            return {
                bold: contains(styleDef, 'bold'),
                underline: contains(styleDef, 'underline'),
                italic: contains(styleDef, 'italic'),
                dashed: contains(styleDef, 'dashed'),
                empty: contains(styleDef, 'empty'),
                center: nomnoml.skanaar.last(styleDef.match('align=([^ ]*)') || []) == 'left' ? false : true,
                fill: nomnoml.skanaar.last(styleDef.match('fill=([^ ]*)') || []),
                stroke: nomnoml.skanaar.last(styleDef.match('stroke=([^ ]*)') || []),
                visual: (nomnoml.skanaar.last(styleDef.match('visual=([^ ]*)') || []) || 'class'),
                direction: directionToDagre(nomnoml.skanaar.last(styleDef.match('direction=([^ ]*)') || []))
            };
        }
        function getConfig(d) {
            var userStyles = {};
            for (var key in d) {
                if (key[0] != '.')
                    continue;
                var styleDef = d[key];
                userStyles[key.substring(1).toUpperCase()] = parseCustomStyle(styleDef);
            }
            return {
                arrowSize: +d.arrowSize || 1,
                bendSize: +d.bendSize || 0.3,
                direction: directionToDagre(d.direction),
                gutter: +d.gutter || 5,
                edgeMargin: (+d.edgeMargin) || 0,
                edges: d.edges == 'hard' ? 'hard' : 'rounded',
                fill: (d.fill || '#eee8d5;#fdf6e3;#eee8d5;#fdf6e3').split(';'),
                background: d.background || 'transparent',
                fillArrows: d.fillArrows === 'true',
                font: d.font || 'Helvetica',
                fontSize: (+d.fontSize) || 12,
                leading: (+d.leading) || 1.25,
                lineWidth: (+d.lineWidth) || 3,
                padding: (+d.padding) || 8,
                spacing: (+d.spacing) || 40,
                stroke: d.stroke || '#33322E',
                title: d.title || 'nomnoml',
                zoom: +d.zoom || 1,
                acyclicer: d.acyclicer === 'greedy' ? 'greedy' : undefined,
                ranker: parseRanker(d.ranker),
                styles: nomnoml.skanaar.merged(nomnoml.styles, userStyles)
            };
        }
    }
    nomnoml.parse = parse;
    function intermediateParse(source) {
        return nomnomlCoreParser.parse(source);
    }
    nomnoml.intermediateParse = intermediateParse;
    function transformParseIntoSyntaxTree(entity) {
        function isAstClassifier(obj) {
            return obj.parts !== undefined;
        }
        function isAstRelation(obj) {
            return obj.assoc !== undefined;
        }
        function isAstCompartment(obj) {
            return Array.isArray(obj);
        }
        var relationId = 0;
        function transformCompartment(slots) {
            var lines = [];
            var rawClassifiers = [];
            var relations = [];
            slots.forEach(function (p) {
                if (typeof p === 'string')
                    lines.push(p);
                if (isAstRelation(p)) {
                    rawClassifiers.push(p.start);
                    rawClassifiers.push(p.end);
                    relations.push({
                        id: relationId++,
                        assoc: p.assoc,
                        start: p.start.parts[0][0],
                        end: p.end.parts[0][0],
                        startLabel: { text: p.startLabel },
                        endLabel: { text: p.endLabel }
                    });
                }
                if (isAstClassifier(p)) {
                    rawClassifiers.push(p);
                }
            });
            var allClassifiers = rawClassifiers
                .map(transformClassifier)
                .sort(function (a, b) {
                return b.compartments.length - a.compartments.length;
            });
            var uniqClassifiers = nomnoml.skanaar.uniqueBy(allClassifiers, 'name');
            var uniqRelations = relations.filter(function (a) {
                for (var _i = 0, relations_1 = relations; _i < relations_1.length; _i++) {
                    var b = relations_1[_i];
                    if (a === b)
                        return true;
                    if (b.start == a.start && b.end == a.end)
                        return false;
                }
                return true;
            });
            return new nomnoml.Compartment(lines, uniqClassifiers, uniqRelations);
        }
        function transformClassifier(entity) {
            var compartments = entity.parts.map(transformCompartment);
            return new nomnoml.Classifier(entity.type, entity.id, compartments);
        }
        return transformCompartment(entity);
    }
    nomnoml.transformParseIntoSyntaxTree = transformParseIntoSyntaxTree;
})(nomnoml || (nomnoml = {}));
var nomnoml;
(function (nomnoml) {
    function render(graphics, config, compartment, setFont) {
        var g = graphics;
        var vm = nomnoml.skanaar.vector;
        function renderCompartment(compartment, style, level) {
            g.save();
            g.translate(compartment.offset.x, compartment.offset.y);
            g.fillStyle(style.stroke || config.stroke);
            compartment.lines.forEach(function (text, i) {
                g.textAlign(style.center ? 'center' : 'left');
                var x = style.center ? compartment.width / 2 - config.padding : 0;
                var y = (0.5 + (i + 0.5) * config.leading) * config.fontSize;
                if (text) {
                    g.fillText(text, x, y);
                }
                if (style.underline) {
                    var w = g.measureText(text).width;
                    y += Math.round(config.fontSize * 0.2) + 0.5;
                    g.path([{ x: x - w / 2, y: y }, { x: x + w / 2, y: y }]).stroke();
                    g.lineWidth(config.lineWidth);
                }
            });
            g.translate(config.gutter, config.gutter);
            compartment.relations.forEach(function (r) { renderRelation(r); });
            compartment.nodes.forEach(function (n) { renderNode(n, level); });
            g.restore();
        }
        function renderNode(node, level) {
            var x = Math.round(node.x - node.width / 2);
            var y = Math.round(node.y - node.height / 2);
            var style = config.styles[node.type] || nomnoml.styles.CLASS;
            g.fillStyle(style.fill || config.fill[level] || nomnoml.skanaar.last(config.fill));
            g.strokeStyle(style.stroke || config.stroke);
            if (style.dashed) {
                var dash = Math.max(4, 2 * config.lineWidth);
                g.setLineDash([dash, dash]);
            }
            var drawNode = nomnoml.visualizers[style.visual] || nomnoml.visualizers["class"];
            drawNode(node, x, y, config, g);
            g.setLineDash([]);
            g.save();
            g.translate(x, y);
            node.compartments.forEach(function (part, i) {
                var s = i > 0 ? nomnoml.buildStyle({ stroke: style.stroke }) : style;
                if (s.empty)
                    return;
                g.save();
                g.translate(part.x, part.y);
                setFont(config, s.bold ? 'bold' : 'normal', s.italic ? 'italic' : undefined);
                renderCompartment(part, s, level + 1);
                g.restore();
            });
            for (var _i = 0, _a = node.dividers; _i < _a.length; _i++) {
                var divider = _a[_i];
                g.path(divider).stroke();
            }
            g.restore();
        }
        function strokePath(p) {
            if (config.edges === 'rounded') {
                var radius = config.spacing * config.bendSize;
                g.beginPath();
                g.moveTo(p[0].x, p[0].y);
                for (var i = 1; i < p.length - 1; i++) {
                    g.arcTo(p[i].x, p[i].y, p[i + 1].x, p[i + 1].y, radius);
                }
                g.lineTo(nomnoml.skanaar.last(p).x, nomnoml.skanaar.last(p).y);
                g.stroke();
            }
            else
                g.path(p).stroke();
        }
        var empty = false, filled = true, diamond = true;
        function renderLabel(label) {
            if (!label || !label.text)
                return;
            var fontSize = config.fontSize;
            var lines = label.text.split('`');
            lines.forEach(function (l, i) { return g.fillText(l, label.x, label.y + fontSize * (i + 1)); });
        }
        function renderRelation(r) {
            var start = r.path[1];
            var end = r.path[r.path.length - 2];
            var path = r.path.slice(1, -1);
            g.fillStyle(config.stroke);
            setFont(config, 'normal');
            renderLabel(r.startLabel);
            renderLabel(r.endLabel);
            if (r.assoc !== '-/-') {
                if (nomnoml.skanaar.hasSubstring(r.assoc, '--')) {
                    var dash = Math.max(4, 2 * config.lineWidth);
                    g.setLineDash([dash, dash]);
                    strokePath(path);
                    g.setLineDash([]);
                }
                else
                    strokePath(path);
            }
            function drawArrowEnd(id, path, end) {
                if (id === '>' || id === '<')
                    drawArrow(path, filled, end, false);
                else if (id === ':>' || id === '<:')
                    drawArrow(path, empty, end, false);
                else if (id === '+')
                    drawArrow(path, filled, end, diamond);
                else if (id === 'o')
                    drawArrow(path, empty, end, diamond);
            }
            var tokens = r.assoc.split('-');
            drawArrowEnd(nomnoml.skanaar.last(tokens), path, end);
            drawArrowEnd(tokens[0], path.reverse(), start);
        }
        function drawArrow(path, isOpen, arrowPoint, diamond) {
            var size = config.spacing * config.arrowSize / 30;
            var v = vm.diff(path[path.length - 2], nomnoml.skanaar.last(path));
            var nv = vm.normalize(v);
            function getArrowBase(s) { return vm.add(arrowPoint, vm.mult(nv, s * size)); }
            var arrowBase = getArrowBase(diamond ? 7 : 10);
            var t = vm.rot(nv);
            var arrowButt = (diamond) ? getArrowBase(14)
                : (isOpen && !config.fillArrows) ? getArrowBase(5) : arrowBase;
            var arrow = [
                vm.add(arrowBase, vm.mult(t, 4 * size)),
                arrowButt,
                vm.add(arrowBase, vm.mult(t, -4 * size)),
                arrowPoint
            ];
            g.fillStyle(isOpen ? config.stroke : config.fill[0]);
            g.circuit(arrow).fillAndStroke();
        }
        function snapToPixels() {
            if (config.lineWidth % 2 === 1)
                g.translate(0.5, 0.5);
        }
        function setBackground() {
            g.clear();
            g.save();
            g.strokeStyle('transparent');
            g.fillStyle(config.background);
            g.rect(0, 0, compartment.width, compartment.height).fill();
            g.restore;
        }
        g.save();
        g.scale(config.zoom, config.zoom);
        setBackground();
        setFont(config, 'bold');
        g.lineWidth(config.lineWidth);
        g.lineJoin('round');
        g.lineCap('round');
        g.strokeStyle(config.stroke);
        snapToPixels();
        renderCompartment(compartment, nomnoml.buildStyle({ stroke: undefined }), 0);
        g.restore();
    }
    nomnoml.render = render;
})(nomnoml || (nomnoml = {}));
var nomnoml;
(function (nomnoml) {
    var skanaar;
    (function (skanaar) {
        function Canvas(canvas, callbacks) {
            var ctx = canvas.getContext('2d');
            var mousePos = { x: 0, y: 0 };
            var twopi = 2 * 3.1416;
            function mouseEventToPos(event) {
                var e = canvas;
                return {
                    x: event.clientX - e.getBoundingClientRect().left - e.clientLeft + e.scrollLeft,
                    y: event.clientY - e.getBoundingClientRect().top - e.clientTop + e.scrollTop
                };
            }
            if (callbacks) {
                canvas.addEventListener('mousedown', function (event) {
                    if (callbacks.mousedown)
                        callbacks.mousedown(mouseEventToPos(event));
                });
                canvas.addEventListener('mouseup', function (event) {
                    if (callbacks.mouseup)
                        callbacks.mouseup(mouseEventToPos(event));
                });
                canvas.addEventListener('mousemove', function (event) {
                    mousePos = mouseEventToPos(event);
                    if (callbacks.mousemove)
                        callbacks.mousemove(mouseEventToPos(event));
                });
            }
            var chainable = {
                stroke: function () {
                    ctx.stroke();
                    return chainable;
                },
                fill: function () {
                    ctx.fill();
                    return chainable;
                },
                fillAndStroke: function () {
                    ctx.fill();
                    ctx.stroke();
                    return chainable;
                }
            };
            function tracePath(path, offset, s) {
                s = s === undefined ? 1 : s;
                offset = offset || { x: 0, y: 0 };
                ctx.beginPath();
                ctx.moveTo(offset.x + s * path[0].x, offset.y + s * path[0].y);
                for (var i = 1, len = path.length; i < len; i++)
                    ctx.lineTo(offset.x + s * path[i].x, offset.y + s * path[i].y);
                return chainable;
            }
            return {
                mousePos: function () { return mousePos; },
                width: function () { return canvas.width; },
                height: function () { return canvas.height; },
                clear: function () {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                },
                circle: function (p, r) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, r, 0, twopi);
                    return chainable;
                },
                ellipse: function (center, rx, ry, start, stop) {
                    if (start === undefined)
                        start = 0;
                    if (stop === undefined)
                        stop = twopi;
                    ctx.beginPath();
                    ctx.save();
                    ctx.translate(center.x, center.y);
                    ctx.scale(1, ry / rx);
                    ctx.arc(0, 0, rx / 2, start, stop);
                    ctx.restore();
                    return chainable;
                },
                arc: function (x, y, r, start, stop) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.arc(x, y, r, start, stop);
                    return chainable;
                },
                roundRect: function (x, y, w, h, r) {
                    ctx.beginPath();
                    ctx.moveTo(x + r, y);
                    ctx.arcTo(x + w, y, x + w, y + r, r);
                    ctx.lineTo(x + w, y + h - r);
                    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
                    ctx.lineTo(x + r, y + h);
                    ctx.arcTo(x, y + h, x, y + h - r, r);
                    ctx.lineTo(x, y + r);
                    ctx.arcTo(x, y, x + r, y, r);
                    ctx.closePath();
                    return chainable;
                },
                rect: function (x, y, w, h) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + w, y);
                    ctx.lineTo(x + w, y + h);
                    ctx.lineTo(x, y + h);
                    ctx.closePath();
                    return chainable;
                },
                path: tracePath,
                circuit: function (path, offset, s) {
                    tracePath(path, offset, s);
                    ctx.closePath();
                    return chainable;
                },
                setFont: function (font, bold, ital, fontSize) {
                    ctx.font = bold + " " + (ital || '') + " " + fontSize + "pt " + font + ", Helvetica, sans-serif";
                },
                fillStyle: function (s) { ctx.fillStyle = s; },
                strokeStyle: function (s) { ctx.strokeStyle = s; },
                textAlign: function (a) { ctx.textAlign = a; },
                lineCap: function (cap) { ctx.lineCap = cap; },
                lineJoin: function (join) { ctx.lineJoin = join; },
                lineWidth: function (w) { ctx.lineWidth = w; },
                arcTo: function () { return ctx.arcTo.apply(ctx, arguments); },
                beginPath: function () { return ctx.beginPath.apply(ctx, arguments); },
                fillText: function () { return ctx.fillText.apply(ctx, arguments); },
                lineTo: function () { return ctx.lineTo.apply(ctx, arguments); },
                measureText: function () { return ctx.measureText.apply(ctx, arguments); },
                moveTo: function () { return ctx.moveTo.apply(ctx, arguments); },
                restore: function () { return ctx.restore.apply(ctx, arguments); },
                save: function () { return ctx.save.apply(ctx, arguments); },
                scale: function () { return ctx.scale.apply(ctx, arguments); },
                setLineDash: function () { return ctx.setLineDash.apply(ctx, arguments); },
                stroke: function () { return ctx.stroke.apply(ctx, arguments); },
                translate: function () { return ctx.translate.apply(ctx, arguments); }
            };
        }
        skanaar.Canvas = Canvas;
    })(skanaar = nomnoml.skanaar || (nomnoml.skanaar = {}));
})(nomnoml || (nomnoml = {}));
var nomnoml;
(function (nomnoml) {
    var skanaar;
    (function (skanaar) {
        function xmlEncode(str) {
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');
        }
        skanaar.charWidths = { "0": 9, "1": 9, "2": 9, "3": 9, "4": 9, "5": 9, "6": 9, "7": 9, "8": 9, "9": 9, " ": 4, "!": 4, "\"": 6, "#": 9, "$": 9, "%": 14, "&": 11, "'": 3, "(": 5, ")": 5, "*": 6, "+": 9, ",": 4, "-": 5, ".": 4, "/": 4, ":": 4, ";": 4, "<": 9, "=": 9, ">": 9, "?": 9, "@": 16, "A": 11, "B": 11, "C": 12, "D": 12, "E": 11, "F": 10, "G": 12, "H": 12, "I": 4, "J": 8, "K": 11, "L": 9, "M": 13, "N": 12, "O": 12, "P": 11, "Q": 12, "R": 12, "S": 11, "T": 10, "U": 12, "V": 11, "W": 15, "X": 11, "Y": 11, "Z": 10, "[": 4, "\\": 4, "]": 4, "^": 8, "_": 9, "`": 5, "a": 9, "b": 9, "c": 8, "d": 9, "e": 9, "f": 4, "g": 9, "h": 9, "i": 4, "j": 4, "k": 8, "l": 4, "m": 13, "n": 9, "o": 9, "p": 9, "q": 9, "r": 5, "s": 8, "t": 4, "u": 9, "v": 8, "w": 12, "x": 8, "y": 8, "z": 8, "{": 5, "|": 4, "}": 5, "~": 9 };
        function Svg(globalStyle, document) {
            var initialState = {
                x: 0,
                y: 0,
                stroke: 'none',
                strokeWidth: 1,
                dashArray: 'none',
                fill: 'none',
                textAlign: 'left',
                font: 'Helvetica, Arial, sans-serif',
                fontSize: 12
            };
            var states = [initialState];
            var elements = [];
            var measurementCanvas = document ? document.createElement('canvas') : null;
            var ctx = measurementCanvas ? measurementCanvas.getContext('2d') : null;
            function Element(name, attr, content) {
                return {
                    name: name,
                    attr: attr,
                    content: content || undefined,
                    stroke: function () {
                        var base = this.attr.style || '';
                        this.attr.style = base +
                            'stroke:' + lastDefined('stroke') +
                            ';fill:none' +
                            ';stroke-dasharray:' + lastDefined('dashArray') +
                            ';stroke-width:' + lastDefined('strokeWidth') + ';';
                        return this;
                    },
                    fill: function () {
                        var base = this.attr.style || '';
                        this.attr.style = base + 'stroke:none; fill:' + lastDefined('fill') + ';';
                        return this;
                    },
                    fillAndStroke: function () {
                        var base = this.attr.style || '';
                        this.attr.style = base +
                            'stroke:' + lastDefined('stroke') +
                            ';fill:' + lastDefined('fill') +
                            ';stroke-dasharray:' + lastDefined('dashArray') +
                            ';stroke-width:' + lastDefined('strokeWidth') + ';';
                        return this;
                    }
                };
            }
            function State(dx, dy) {
                return { x: dx, y: dy, stroke: null, strokeWidth: null, fill: null, textAlign: null, dashArray: 'none', font: null, fontSize: null };
            }
            function trans(coord, axis) {
                states.forEach(function (t) { coord += t[axis]; });
                return coord;
            }
            function tX(coord) { return Math.round(10 * trans(coord, 'x')) / 10; }
            function tY(coord) { return Math.round(10 * trans(coord, 'y')) / 10; }
            function lastDefined(property) {
                for (var i = states.length - 1; i >= 0; i--)
                    if (states[i][property])
                        return states[i][property];
                return undefined;
            }
            function last(list) { return list[list.length - 1]; }
            function tracePath(path, offset, s) {
                s = s === undefined ? 1 : s;
                offset = offset || { x: 0, y: 0 };
                var d = path.map(function (e, i) {
                    return (i ? 'L' : 'M') + tX(offset.x + s * e.x) + ' ' + tY(offset.y + s * e.y);
                }).join(' ');
                return newElement('path', { d: d });
            }
            function newElement(type, attr, content) {
                var element = Element(type, attr, content);
                elements.push(element);
                return element;
            }
            return {
                width: function () { return 0; },
                height: function () { return 0; },
                clear: function () { },
                circle: function (p, r) {
                    var element = Element('circle', { r: r, cx: tX(p.x), cy: tY(p.y) });
                    elements.push(element);
                    return element;
                },
                ellipse: function (center, w, h, start, stop) {
                    if (stop) {
                        var y = tY(center.y);
                        return newElement('path', { d: 'M' + tX(center.x - w / 2) + ' ' + y +
                                'A' + w / 2 + ' ' + h / 2 + ' 0 1 0 ' + tX(center.x + w / 2) + ' ' + y
                        });
                    }
                    else {
                        return newElement('ellipse', { cx: tX(center.x), cy: tY(center.y), rx: w / 2, ry: h / 2 });
                    }
                },
                arc: function (x, y, r) {
                    return newElement('ellipse', { cx: tX(x), cy: tY(y), rx: r, ry: r });
                },
                roundRect: function (x, y, w, h, r) {
                    return newElement('rect', { x: tX(x), y: tY(y), rx: r, ry: r, height: h, width: w });
                },
                rect: function (x, y, w, h) {
                    return newElement('rect', { x: tX(x), y: tY(y), height: h, width: w });
                },
                path: tracePath,
                circuit: function (path, offset, s) {
                    var element = tracePath(path, offset, s);
                    element.attr.d += ' Z';
                    return element;
                },
                setFont: function (font, bold, ital, fontSize) {
                    var font = bold + " " + (ital || '') + " " + fontSize + "pt " + font + ", Helvetica, sans-serif";
                    last(states).font = font;
                    last(states).fontSize = fontSize;
                },
                strokeStyle: function (stroke) {
                    last(states).stroke = stroke;
                },
                fillStyle: function (fill) {
                    last(states).fill = fill;
                },
                arcTo: function (x1, y1, x2, y2) {
                    last(elements).attr.d += ('L' + tX(x1) + ' ' + tY(y1) + ' L' + tX(x2) + ' ' + tY(y2) + ' ');
                },
                beginPath: function () {
                    return newElement('path', { d: '' });
                },
                fillText: function (text, x, y) {
                    var attr = { x: tX(x), y: tY(y), style: 'fill: ' + last(states).fill + ';' };
                    var font = lastDefined('font');
                    if (font) {
                        attr.style += 'font:' + font + ';';
                    }
                    if (lastDefined('textAlign') === 'center') {
                        attr.style += 'text-anchor: middle;';
                    }
                    return newElement('text', attr, text);
                },
                lineCap: function (cap) { globalStyle += ';stroke-linecap:' + cap; },
                lineJoin: function (join) { globalStyle += ';stroke-linejoin:' + join; },
                lineTo: function (x, y) {
                    last(elements).attr.d += ('L' + tX(x) + ' ' + tY(y) + ' ');
                    return last(elements);
                },
                lineWidth: function (w) {
                    last(states).strokeWidth = w;
                },
                measureText: function (s) {
                    if (ctx) {
                        ctx.font = lastDefined('font') || 'normal 12pt Helvetica';
                        return ctx.measureText(s);
                    }
                    else {
                        return {
                            width: skanaar.sum(s, function (c) {
                                var scale = lastDefined('fontSize') / 12;
                                if (skanaar.charWidths[c]) {
                                    return skanaar.charWidths[c] * scale;
                                }
                                return 16 * scale;
                            })
                        };
                    }
                },
                moveTo: function (x, y) {
                    last(elements).attr.d += ('M' + tX(x) + ' ' + tY(y) + ' ');
                },
                restore: function () {
                    states.pop();
                },
                save: function () {
                    states.push(State(0, 0));
                },
                scale: function () { },
                setLineDash: function (d) {
                    last(states).dashArray = (d.length === 0) ? 'none' : d[0] + ' ' + d[1];
                },
                stroke: function () {
                    last(elements).stroke();
                },
                textAlign: function (a) {
                    last(states).textAlign = a;
                },
                translate: function (dx, dy) {
                    last(states).x += dx;
                    last(states).y += dy;
                },
                serialize: function (size, desc, title) {
                    function toAttr(obj) {
                        function toKeyValue(key) { return key + '="' + obj[key] + '"'; }
                        return Object.keys(obj).map(toKeyValue).join(' ');
                    }
                    function toHtml(e) {
                        return '<' + e.name + ' ' + toAttr(e.attr) + '>' + (e.content ? xmlEncode(e.content) : '') + '</' + e.name + '>';
                    }
                    var elementsToSerialize = elements;
                    if (desc) {
                        elementsToSerialize.unshift(Element('desc', {}, desc));
                    }
                    if (title) {
                        elementsToSerialize.unshift(Element('title', {}, title));
                    }
                    var innerSvg = elementsToSerialize.map(toHtml).join('\n  ');
                    var attrs = {
                        version: '1.1',
                        baseProfile: 'full',
                        width: size.width,
                        height: size.height,
                        viewbox: '0 0 ' + size.width + ' ' + size.height,
                        xmlns: 'http://www.w3.org/2000/svg',
                        'xmlns:xlink': 'http://www.w3.org/1999/xlink',
                        'xmlns:ev': 'http://www.w3.org/2001/xml-events',
                        style: 'font:' + lastDefined('font') + ';' + globalStyle
                    };
                    return '<svg ' + toAttr(attrs) + '>\n  ' + innerSvg + '\n</svg>';
                }
            };
        }
        skanaar.Svg = Svg;
    })(skanaar = nomnoml.skanaar || (nomnoml.skanaar = {}));
})(nomnoml || (nomnoml = {}));
var nomnoml;
(function (nomnoml) {
    var skanaar;
    (function (skanaar) {
        function plucker(pluckerDef) {
            switch (typeof pluckerDef) {
                case 'undefined': return function (e) { return e; };
                case 'string': return function (obj) { return obj[pluckerDef]; };
                case 'number': return function (obj) { return obj[pluckerDef]; };
                case 'function': return pluckerDef;
            }
        }
        skanaar.plucker = plucker;
        function sum(list, plucker) {
            var transform = skanaar.plucker(plucker);
            for (var i = 0, summation = 0, len = list.length; i < len; i++)
                summation += transform(list[i]);
            return summation;
        }
        skanaar.sum = sum;
        function flatten(lists) {
            var out = [];
            for (var i = 0; i < lists.length; i++)
                out = out.concat(lists[i]);
            return out;
        }
        skanaar.flatten = flatten;
        function find(list, predicate) {
            for (var i = 0; i < list.length; i++)
                if (predicate(list[i]))
                    return list[i];
            return undefined;
        }
        skanaar.find = find;
        function last(list) {
            return list[list.length - 1];
        }
        skanaar.last = last;
        function hasSubstring(haystack, needle) {
            if (needle === '')
                return true;
            if (!haystack)
                return false;
            return haystack.indexOf(needle) !== -1;
        }
        skanaar.hasSubstring = hasSubstring;
        function format(template) {
            var parts = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                parts[_i - 1] = arguments[_i];
            }
            var matrix = template.split('#');
            var output = [matrix[0]];
            for (var i = 0; i < matrix.length - 1; i++) {
                output.push(parts[i] || '');
                output.push(matrix[i + 1]);
            }
            return output.join('');
        }
        skanaar.format = format;
        function merged(a, b) {
            function assign(target, data) {
                for (var key in data)
                    target[key] = data[key];
            }
            var obj = {};
            assign(obj, a);
            assign(obj, b);
            return obj;
        }
        skanaar.merged = merged;
        function indexBy(list, key) {
            var obj = {};
            for (var i = 0; i < list.length; i++)
                obj[list[i][key]] = list[i];
            return obj;
        }
        skanaar.indexBy = indexBy;
        function uniqueBy(list, pluckerDef) {
            var seen = {};
            var getKey = skanaar.plucker(pluckerDef);
            var out = [];
            for (var i = 0; i < list.length; i++) {
                var key = getKey(list[i]);
                if (!seen[key]) {
                    seen[key] = true;
                    out.push(list[i]);
                }
            }
            return out;
        }
        skanaar.uniqueBy = uniqueBy;
    })(skanaar = nomnoml.skanaar || (nomnoml.skanaar = {}));
})(nomnoml || (nomnoml = {}));
var nomnoml;
(function (nomnoml) {
    var skanaar;
    (function (skanaar) {
        skanaar.vector = {
            dist: function (a, b) { return skanaar.vector.mag(skanaar.vector.diff(a, b)); },
            add: function (a, b) { return { x: a.x + b.x, y: a.y + b.y }; },
            diff: function (a, b) { return { x: a.x - b.x, y: a.y - b.y }; },
            mult: function (v, factor) { return { x: factor * v.x, y: factor * v.y }; },
            mag: function (v) { return Math.sqrt(v.x * v.x + v.y * v.y); },
            normalize: function (v) { return skanaar.vector.mult(v, 1 / skanaar.vector.mag(v)); },
            rot: function (a) { return { x: a.y, y: -a.x }; }
        };
    })(skanaar = nomnoml.skanaar || (nomnoml.skanaar = {}));
})(nomnoml || (nomnoml = {}));
var nomnoml;
(function (nomnoml) {
    nomnoml.styles = {
        ABSTRACT: nomnoml.buildStyle({ visual: 'class', center: true, italic: true }),
        ACTOR: nomnoml.buildStyle({ visual: 'actor', center: true }),
        CHOICE: nomnoml.buildStyle({ visual: 'rhomb', center: true }),
        CLASS: nomnoml.buildStyle({ visual: 'class', center: true, bold: true }),
        DATABASE: nomnoml.buildStyle({ visual: 'database', center: true, bold: true }),
        END: nomnoml.buildStyle({ visual: 'end', center: true, empty: true }),
        FRAME: nomnoml.buildStyle({ visual: 'frame' }),
        HIDDEN: nomnoml.buildStyle({ visual: 'hidden', center: true, empty: true }),
        INPUT: nomnoml.buildStyle({ visual: 'input', center: true }),
        INSTANCE: nomnoml.buildStyle({ visual: 'class', center: true, underline: true }),
        LABEL: nomnoml.buildStyle({ visual: 'none' }),
        NOTE: nomnoml.buildStyle({ visual: 'note' }),
        PACKAGE: nomnoml.buildStyle({ visual: 'package' }),
        RECEIVER: nomnoml.buildStyle({ visual: 'receiver' }),
        REFERENCE: nomnoml.buildStyle({ visual: 'class', center: true, dashed: true }),
        SENDER: nomnoml.buildStyle({ visual: 'sender' }),
        START: nomnoml.buildStyle({ visual: 'start', center: true, empty: true }),
        STATE: nomnoml.buildStyle({ visual: 'roundrect', center: true }),
        TABLE: nomnoml.buildStyle({ visual: 'table', center: true, bold: true }),
        TRANSCEIVER: nomnoml.buildStyle({ visual: 'transceiver' }),
        USECASE: nomnoml.buildStyle({ visual: 'ellipse', center: true })
    };
    function box(config, clas) {
        clas.width = Math.max.apply(Math, clas.compartments.map(function (e) { return e.width; }));
        clas.height = nomnoml.skanaar.sum(clas.compartments, 'height');
        clas.dividers = [];
        var y = 0;
        for (var _i = 0, _a = clas.compartments; _i < _a.length; _i++) {
            var comp = _a[_i];
            comp.x = 0;
            comp.y = y;
            comp.width = clas.width;
            y += comp.height;
            if (comp != nomnoml.skanaar.last(clas.compartments))
                clas.dividers.push([{ x: 0, y: y }, { x: clas.width, y: y }]);
        }
    }
    function icon(config, clas) {
        clas.dividers = [];
        clas.compartments = [];
        clas.width = config.fontSize * 2.5;
        clas.height = config.fontSize * 2.5;
    }
    nomnoml.layouters = {
        actor: function (config, clas) {
            clas.width = Math.max.apply(Math, __spreadArrays([config.padding * 2], clas.compartments.map(function (e) { return e.width; })));
            clas.height = config.padding * 3 + nomnoml.skanaar.sum(clas.compartments, 'height');
            clas.dividers = [];
            var y = config.padding * 3;
            for (var _i = 0, _a = clas.compartments; _i < _a.length; _i++) {
                var comp = _a[_i];
                comp.x = 0;
                comp.y = y;
                comp.width = clas.width;
                y += comp.height;
                if (comp != nomnoml.skanaar.last(clas.compartments))
                    clas.dividers.push([{ x: config.padding, y: y }, { x: clas.width - config.padding, y: y }]);
            }
        },
        "class": box,
        database: function (config, clas) {
            clas.width = Math.max.apply(Math, clas.compartments.map(function (e) { return e.width; }));
            clas.height = nomnoml.skanaar.sum(clas.compartments, 'height') + config.padding * 2;
            clas.dividers = [];
            var y = config.padding * 1.5;
            for (var _i = 0, _a = clas.compartments; _i < _a.length; _i++) {
                var comp = _a[_i];
                comp.x = 0;
                comp.y = y;
                comp.width = clas.width;
                y += comp.height;
                if (comp != nomnoml.skanaar.last(clas.compartments))
                    clas.dividers.push([{ x: 0, y: y }, { x: clas.width, y: y }]);
            }
        },
        ellipse: function (config, clas) {
            var width = Math.max.apply(Math, clas.compartments.map(function (e) { return e.width; }));
            var height = nomnoml.skanaar.sum(clas.compartments, 'height');
            clas.width = width * 1.25;
            clas.height = height * 1.25;
            clas.dividers = [];
            var y = height * 0.125;
            var sq = function (x) { return x * x; };
            var rimPos = function (y) { return Math.sqrt(sq(0.5) - sq(y / clas.height - 0.5)) * clas.width; };
            for (var _i = 0, _a = clas.compartments; _i < _a.length; _i++) {
                var comp = _a[_i];
                comp.x = width * 0.125;
                comp.y = y;
                comp.width = width;
                y += comp.height;
                if (comp != nomnoml.skanaar.last(clas.compartments))
                    clas.dividers.push([
                        { x: clas.width / 2 + rimPos(y) - 1, y: y },
                        { x: clas.width / 2 - rimPos(y) + 1, y: y }
                    ]);
            }
        },
        end: icon,
        frame: function (config, clas) {
            var w = clas.compartments[0].width;
            var h = clas.compartments[0].height;
            box(config, clas);
            if (clas.dividers.length)
                clas.dividers.shift();
            clas.dividers.unshift([
                { x: 0, y: h },
                { x: w - h / 4, y: h },
                { x: w + h / 4, y: h / 2 },
                { x: w + h / 4, y: 0 }
            ]);
        },
        hidden: function (config, clas) {
            clas.dividers = [];
            clas.compartments = [];
            clas.width = 0;
            clas.height = 0;
        },
        input: box,
        none: box,
        note: box,
        package: box,
        receiver: box,
        rhomb: function (config, clas) {
            var width = Math.max.apply(Math, clas.compartments.map(function (e) { return e.width; }));
            var height = nomnoml.skanaar.sum(clas.compartments, 'height');
            clas.width = width * 1.5;
            clas.height = height * 1.5;
            clas.dividers = [];
            var y = height * 0.25;
            for (var _i = 0, _a = clas.compartments; _i < _a.length; _i++) {
                var comp = _a[_i];
                comp.x = width * 0.25;
                comp.y = y;
                comp.width = width;
                y += comp.height;
                var slope = clas.width / clas.height;
                if (comp != nomnoml.skanaar.last(clas.compartments))
                    clas.dividers.push([
                        { x: clas.width / 2 + (y < clas.height / 2 ? y * slope : (clas.height - y) * slope), y: y },
                        { x: clas.width / 2 - (y < clas.height / 2 ? y * slope : (clas.height - y) * slope), y: y }
                    ]);
            }
        },
        roundrect: box,
        sender: box,
        start: icon,
        table: function (config, clas) {
            if (clas.compartments.length == 1) {
                box(config, clas);
                return;
            }
            var gridcells = clas.compartments.slice(1);
            var rows = [[]];
            function isRowBreak(e) {
                return !e.lines.length && !e.nodes.length && !e.relations.length;
            }
            function isRowFull(e) {
                var current = nomnoml.skanaar.last(rows);
                return rows[0] != current && rows[0].length == current.length;
            }
            function isEnd(e) {
                return comp == nomnoml.skanaar.last(gridcells);
            }
            for (var _i = 0, gridcells_1 = gridcells; _i < gridcells_1.length; _i++) {
                var comp = gridcells_1[_i];
                if (!isEnd(comp) && isRowBreak(comp) && nomnoml.skanaar.last(rows).length) {
                    rows.push([]);
                }
                else if (isRowFull(comp)) {
                    rows.push([comp]);
                }
                else {
                    nomnoml.skanaar.last(rows).push(comp);
                }
            }
            var header = clas.compartments[0];
            var cellW = Math.max.apply(Math, __spreadArrays([header.width / rows[0].length], gridcells.map(function (e) { return e.width; })));
            var cellH = Math.max.apply(Math, gridcells.map(function (e) { return e.height; }));
            clas.width = cellW * rows[0].length;
            clas.height = header.height + cellH * rows.length;
            var hh = header.height;
            clas.dividers = __spreadArrays([
                [{ x: 0, y: header.height }, { x: 0, y: header.height }]
            ], rows.map(function (e, i) { return [{ x: 0, y: hh + i * cellH }, { x: clas.width, y: hh + i * cellH }]; }), rows[0].map(function (e, i) { return [{ x: (i + 1) * cellW, y: hh }, { x: (i + 1) * cellW, y: clas.height }]; }));
            header.x = 0;
            header.y = 0;
            header.width = clas.width;
            for (var i = 0; i < rows.length; i++) {
                for (var j = 0; j < rows[i].length; j++) {
                    var cell = rows[i][j];
                    cell.x = j * cellW;
                    cell.y = hh + i * cellH;
                    cell.width = cellW;
                }
            }
        },
        transceiver: box
    };
    nomnoml.visualizers = {
        actor: function (node, x, y, config, g) {
            var a = config.padding / 2;
            var yp = y + a * 4;
            var faceCenter = { x: node.x, y: yp - a };
            g.circle(faceCenter, a).fillAndStroke();
            g.path([{ x: node.x, y: yp }, { x: node.x, y: yp + 2 * a }]).stroke();
            g.path([{ x: node.x - a, y: yp + a }, { x: node.x + a, y: yp + a }]).stroke();
            g.path([{ x: node.x - a, y: yp + a + config.padding },
                { x: node.x, y: yp + config.padding },
                { x: node.x + a, y: yp + a + config.padding }]).stroke();
        },
        "class": function (node, x, y, config, g) {
            g.rect(x, y, node.width, node.height).fillAndStroke();
        },
        database: function (node, x, y, config, g) {
            var pad = config.padding;
            var cy = y - pad / 2;
            var pi = 3.1416;
            g.rect(x, y + pad, node.width, node.height - pad * 1.5).fill();
            g.path([{ x: x, y: cy + pad * 1.5 }, { x: x, y: cy - pad * 0.5 + node.height }]).stroke();
            g.path([
                { x: x + node.width, y: cy + pad * 1.5 },
                { x: x + node.width, y: cy - pad * 0.5 + node.height }
            ]).stroke();
            g.ellipse({ x: node.x, y: cy + pad * 1.5 }, node.width, pad * 1.5).fillAndStroke();
            g.ellipse({ x: node.x, y: cy - pad * 0.5 + node.height }, node.width, pad * 1.5, 0, pi)
                .fillAndStroke();
        },
        ellipse: function (node, x, y, config, g) {
            g.ellipse({ x: node.x, y: node.y }, node.width, node.height).fillAndStroke();
        },
        end: function (node, x, y, config, g) {
            g.circle({ x: node.x, y: y + node.height / 2 }, node.height / 3).fillAndStroke();
            g.fillStyle(config.stroke);
            g.circle({ x: node.x, y: y + node.height / 2 }, node.height / 3 - config.padding / 2).fill();
        },
        frame: function (node, x, y, config, g) {
            g.rect(x, y, node.width, node.height).fillAndStroke();
        },
        hidden: function (node, x, y, config, g) {
        },
        input: function (node, x, y, config, g) {
            g.circuit([
                { x: x + config.padding, y: y },
                { x: x + node.width, y: y },
                { x: x + node.width - config.padding, y: y + node.height },
                { x: x, y: y + node.height }
            ]).fillAndStroke();
        },
        none: function (node, x, y, config, g) {
        },
        note: function (node, x, y, config, g) {
            g.circuit([
                { x: x, y: y },
                { x: x + node.width - config.padding, y: y },
                { x: x + node.width, y: y + config.padding },
                { x: x + node.width, y: y + node.height },
                { x: x, y: y + node.height },
                { x: x, y: y }
            ]).fillAndStroke();
            g.path([
                { x: x + node.width - config.padding, y: y },
                { x: x + node.width - config.padding, y: y + config.padding },
                { x: x + node.width, y: y + config.padding }
            ]).stroke();
        },
        package: function (node, x, y, config, g) {
            var headHeight = node.compartments[0].height;
            g.rect(x, y + headHeight, node.width, node.height - headHeight).fillAndStroke();
            var w = g.measureText(node.name).width + 2 * config.padding;
            g.circuit([
                { x: x, y: y + headHeight },
                { x: x, y: y },
                { x: x + w, y: y },
                { x: x + w, y: y + headHeight }
            ]).fillAndStroke();
        },
        receiver: function (node, x, y, config, g) {
            g.circuit([
                { x: x - config.padding, y: y },
                { x: x + node.width, y: y },
                { x: x + node.width, y: y + node.height },
                { x: x - config.padding, y: y + node.height },
                { x: x, y: y + node.height / 2 },
            ]).fillAndStroke();
        },
        rhomb: function (node, x, y, config, g) {
            g.circuit([
                { x: node.x, y: y },
                { x: x + node.width, y: node.y },
                { x: node.x, y: y + node.height },
                { x: x, y: node.y }
            ]).fillAndStroke();
        },
        roundrect: function (node, x, y, config, g) {
            var r = Math.min(config.padding * 2 * config.leading, node.height / 2);
            g.roundRect(x, y, node.width, node.height, r).fillAndStroke();
        },
        sender: function (node, x, y, config, g) {
            g.circuit([
                { x: x, y: y },
                { x: x + node.width - config.padding, y: y },
                { x: x + node.width, y: y + node.height / 2 },
                { x: x + node.width - config.padding, y: y + node.height },
                { x: x, y: y + node.height }
            ]).fillAndStroke();
        },
        start: function (node, x, y, config, g) {
            g.fillStyle(config.stroke);
            g.circle({ x: node.x, y: y + node.height / 2 }, node.height / 2.5).fill();
        },
        table: function (node, x, y, config, g) {
            g.rect(x, y, node.width, node.height).fillAndStroke();
        },
        transceiver: function (node, x, y, config, g) {
            g.circuit([
                { x: x - config.padding, y: y },
                { x: x + node.width, y: y },
                { x: x + node.width + config.padding, y: y + node.height / 2 },
                { x: x + node.width, y: y + node.height },
                { x: x - config.padding, y: y + node.height },
                { x: x, y: y + node.height / 2 }
            ]).fillAndStroke();
        }
    };
})(nomnoml || (nomnoml = {}));
;
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var nomnomlCoreParser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,4],$V1=[1,7],$V2=[1,9],$V3=[5,10,12,14],$V4=[12,14];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"root":3,"compartment":4,"EOF":5,"slot":6,"IDENT":7,"class":8,"association":9,"SEP":10,"parts":11,"|":12,"[":13,"]":14,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",7:"IDENT",10:"SEP",12:"|",13:"[",14:"]"},
productions_: [0,[3,2],[6,1],[6,1],[6,1],[4,1],[4,3],[11,1],[11,3],[11,2],[9,3],[8,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 return $$[$0-1] 
break;
case 2:
this.$ = $$[$0].trim().replace(/\\(\[|\]|\|)/g, '$'+'1');
break;
case 3: case 4:
this.$ = $$[$0];
break;
case 5: case 7:
this.$ = [$$[$0]];
break;
case 6:
this.$ = $$[$0-2].concat($$[$0]);
break;
case 8:
this.$ = $$[$0-2].concat([$$[$0]]);
break;
case 9:
this.$ = $$[$0-1].concat([[]]);
break;
case 10:

           var t = $$[$0-1].trim().replace(/\\(\[|\]|\|)/g, '$'+'1').match('^(.*?)([<:o+]*-/?-*[:o+>]*)(.*)$');
           this.$ = {assoc:t[2], start:$$[$0-2], end:$$[$0], startLabel:t[1].trim(), endLabel:t[3].trim()};
  
break;
case 11:

           var type = 'CLASS';
           var id = $$[$0-1][0][0];
           var typeMatch = $$[$0-1][0][0].match('<([a-z]*)>(.*)');
           if (typeMatch) {
               type = typeMatch[1].toUpperCase();
               id = typeMatch[2].trim();
           }
           $$[$0-1][0][0] = id;
           this.$ = {type:type, id:id, parts:$$[$0-1]};
  
break;
}
},
table: [{3:1,4:2,6:3,7:$V0,8:5,9:6,13:$V1},{1:[3]},{5:[1,8],10:$V2},o($V3,[2,5]),o($V3,[2,2]),o($V3,[2,3],{7:[1,10]}),o($V3,[2,4]),{4:12,6:3,7:$V0,8:5,9:6,11:11,13:$V1},{1:[2,1]},{6:13,7:$V0,8:5,9:6,13:$V1},{8:14,13:$V1},{12:[1,16],14:[1,15]},o($V4,[2,7],{10:$V2}),o($V3,[2,6]),o($V3,[2,10]),o([5,7,10,12,14],[2,11]),o($V4,[2,9],{6:3,8:5,9:6,4:17,7:$V0,13:$V1}),o($V4,[2,8],{10:$V2})],
defaultActions: {8:[2,1]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:return 12
break;
case 1:return 7
break;
case 2:return 13
break;
case 3:return 14
break;
case 4:return 10
break;
case 5:return 5
break;
case 6:return 'INVALID'
break;
}
},
rules: [/^(?:\s*\|\s*)/,/^(?:(\\(\[|\]|\|)|[^\]\[|;\n])+)/,/^(?:\[)/,/^(?:\s*\])/,/^(?:[ ]*(;|\n)+[ ]*)/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();;
  return nomnoml;
});