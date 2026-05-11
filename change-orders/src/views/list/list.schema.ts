import type { JsonSchema } from '@procore/json-tabulator';

import dataSchema from '../../../blueprints/prototype-tool/data.schema.json';

/** Tabulator row schema from `blueprints/prototype-tool/data.schema.json`. */
export const listSchema: JsonSchema = dataSchema as JsonSchema;
