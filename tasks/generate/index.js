"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematic_runner_1 = require("./runners/schematic.runner");
new schematic_runner_1.SchematicRunner().run('@rxdi/schematics:controller --name=app/cats --no-dry-run --spec --language="ts" --sourceRoot="src"');
