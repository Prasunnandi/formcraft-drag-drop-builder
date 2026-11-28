/**
 * Bidirectional JSON Schema Form Compiler & Validator
 * Converts FormCraft visual drag-and-drop form definitions to standard JSON Schema (Draft-07),
 * and decompiles JSON Schema schemas back into visual field layout definitions.
 */

export const FIELD_TYPE_MAPPING = {
  text: { type: 'string' },
  textarea: { type: 'string' },
  email: { type: 'string', format: 'email' },
  url: { type: 'string', format: 'uri' },
  phone: { type: 'string', pattern: '^\\+?[1-9]\\d{1,14}$' },
  number: { type: 'number' },
  currency: { type: 'number', minimum: 0 },
  boolean: { type: 'boolean' },
  toggle: { type: 'boolean' },
  select: { type: 'string' },
  radio: { type: 'string' },
  multiselect: { type: 'array', items: { type: 'string' } },
  checkbox_group: { type: 'array', items: { type: 'string' } },
  date: { type: 'string', format: 'date' },
  datetime: { type: 'string', format: 'date-time' },
  file: { type: 'string', contentMediaType: 'application/octet-stream' }
};

export class FormSchemaCompiler {
  /**
   * Compiles visual form definition into standard JSON Schema (Draft-07)
   * @param {Object} formDefinition - { id, title, description, fields: [...] }
   * @returns {Object} Standard JSON Schema object
   */
  formToJSONSchema(formDefinition = {}) {
    const fields = formDefinition.fields || [];
    const properties = {};
    const required = [];

    fields.forEach(field => {
      const fieldKey = field.key || field.id || `field_${field.name}`;
      const baseMapping = FIELD_TYPE_MAPPING[field.type] || { type: 'string' };

      const propSchema = {
        title: field.label || fieldKey,
        description: field.placeholder || field.description || '',
        ...baseMapping
      };

      // Handle options / enums
      if (field.options && Array.isArray(field.options)) {
        const enumValues = field.options.map(opt => (typeof opt === 'object' ? opt.value : opt));
        if (field.type === 'multiselect' || field.type === 'checkbox_group') {
          propSchema.items = { type: 'string', enum: enumValues };
        } else {
          propSchema.enum = enumValues;
        }
      }

      // Constraints
      if (field.minLength !== undefined) propSchema.minLength = field.minLength;
      if (field.maxLength !== undefined) propSchema.maxLength = field.maxLength;
      if (field.minimum !== undefined) propSchema.minimum = field.minimum;
      if (field.maximum !== undefined) propSchema.maximum = field.maximum;
      if (field.pattern) propSchema.pattern = field.pattern;
      if (field.defaultValue !== undefined) propSchema.default = field.defaultValue;

      properties[fieldKey] = propSchema;

      if (field.required) {
        required.push(fieldKey);
      }
    });

    return {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $id: `https://formcraft.io/schemas/${formDefinition.id || 'form-untitled'}.json`,
      title: formDefinition.title || 'FormCraft Dynamic Form',
      description: formDefinition.description || 'Auto-generated JSON Schema from FormCraft Form Builder',
      type: 'object',
      properties,
      required: required.length > 0 ? required : undefined,
      additionalProperties: false
    };
  }

  /**
   * Decompiles standard JSON Schema into visual form definition
   * @param {Object} jsonSchema - Standard JSON Schema object
   * @returns {Object} FormCraft visual form definition
   */
  jsonSchemaToForm(jsonSchema = {}) {
    const properties = jsonSchema.properties || {};
    const requiredSet = new Set(jsonSchema.required || []);
    const fields = [];

    for (const [key, prop] of Object.entries(properties)) {
      let fieldType = 'text';

      if (prop.type === 'number' || prop.type === 'integer') {
        fieldType = 'number';
      } else if (prop.type === 'boolean') {
        fieldType = 'toggle';
      } else if (prop.type === 'string' && prop.format === 'email') {
        fieldType = 'email';
      } else if (prop.type === 'string' && prop.format === 'date') {
        fieldType = 'date';
      } else if (prop.type === 'string' && prop.enum) {
        fieldType = 'select';
      } else if (prop.type === 'array' && prop.items?.enum) {
        fieldType = 'checkbox_group';
      }

      const field = {
        id: `f_${key}`,
        key,
        label: prop.title || key,
        placeholder: prop.description || '',
        type: fieldType,
        required: requiredSet.has(key),
        defaultValue: prop.default !== undefined ? prop.default : null
      };

      if (prop.enum) {
        field.options = prop.enum.map(e => ({ label: String(e), value: e }));
      } else if (prop.items?.enum) {
        field.options = prop.items.enum.map(e => ({ label: String(e), value: e }));
      }

      if (prop.minimum !== undefined) field.minimum = prop.minimum;
      if (prop.maximum !== undefined) field.maximum = prop.maximum;
      if (prop.minLength !== undefined) field.minLength = prop.minLength;
      if (prop.maxLength !== undefined) field.maxLength = prop.maxLength;

      fields.push(field);
    }

    return {
      id: jsonSchema.$id ? jsonSchema.$id.split('/').pop().replace('.json', '') : 'form-compiled',
      title: jsonSchema.title || 'FormCraft Form',
      description: jsonSchema.description || '',
      fields
    };
  }

  /**
   * Validates form submission payload against form definition rules
   * @param {Object} formDefinition - Visual form definition
   * @param {Object} submission - Submitted form values
   * @returns {Object} { isValid, errors: [] }
   */
  validateSubmission(formDefinition, submission = {}) {
    const schema = this.formToJSONSchema(formDefinition);
    const errors = [];

    // Check required fields
    if (schema.required) {
      schema.required.forEach(reqKey => {
        const val = submission[reqKey];
        if (val === undefined || val === null || val === '') {
          errors.push({ field: reqKey, message: `Field "${schema.properties[reqKey]?.title || reqKey}" is required.` });
        }
      });
    }

    // Check individual property types and constraints
    for (const [key, prop] of Object.entries(schema.properties)) {
      const val = submission[key];
      if (val === undefined || val === null || val === '') continue;

      if (prop.type === 'number') {
        if (typeof val !== 'number' || isNaN(val)) {
          errors.push({ field: key, message: `Field "${prop.title}" must be a number.` });
        } else {
          if (prop.minimum !== undefined && val < prop.minimum) {
            errors.push({ field: key, message: `Field "${prop.title}" must be at least ${prop.minimum}.` });
          }
          if (prop.maximum !== undefined && val > prop.maximum) {
            errors.push({ field: key, message: `Field "${prop.title}" must be at most ${prop.maximum}.` });
          }
        }
      }

      if (prop.type === 'string') {
        if (typeof val !== 'string') {
          errors.push({ field: key, message: `Field "${prop.title}" must be a string.` });
        } else {
          if (prop.format === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            errors.push({ field: key, message: `Field "${prop.title}" must be a valid email address.` });
          }
          if (prop.enum && !prop.enum.includes(val)) {
            errors.push({ field: key, message: `Field "${prop.title}" must be one of [${prop.enum.join(', ')}].` });
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errorsCount: errors.length,
      errors
    };
  }
}

// Dual ESM & CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FIELD_TYPE_MAPPING,
    FormSchemaCompiler
  };
}

export default FormSchemaCompiler;
