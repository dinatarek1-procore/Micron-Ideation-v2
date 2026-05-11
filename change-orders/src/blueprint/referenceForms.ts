import type { RJSFSchema, UiSchema } from '@rjsf/utils';

import formSchemaJson from '../../blueprints/reference-scaffold/form.schema.json';
import formUiSchemaJson from '../../blueprints/reference-scaffold/form.uiSchema.json';

/** Edit/create form root schema from blueprint. */
export const editFormSchema = formSchemaJson.edit as RJSFSchema;

/** Readonly detail form root schema from blueprint. */
export const detailFormSchema = formSchemaJson.detail as RJSFSchema;

export const editFormUiSchema = formUiSchemaJson.edit as UiSchema;

export const detailFormUiSchema = formUiSchemaJson.detail as UiSchema;
