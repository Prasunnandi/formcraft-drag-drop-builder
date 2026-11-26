/**
 * Dynamic Client-Side Form Conditional Logic Evaluator
 * Evaluates rules (e.g. IF country == 'US' THEN show state_dropdown)
 * controlling field visibility, required status, and interactivity.
 */

export const OPERATORS = {
  EQUALS: 'EQUALS',
  NOT_EQUALS: 'NOT_EQUALS',
  GREATER_THAN: 'GREATER_THAN',
  LESS_THAN: 'LESS_THAN',
  GREATER_OR_EQUAL: 'GREATER_OR_EQUAL',
  LESS_OR_EQUAL: 'LESS_OR_EQUAL',
  CONTAINS: 'CONTAINS',
  NOT_CONTAINS: 'NOT_CONTAINS',
  IS_EMPTY: 'IS_EMPTY',
  IS_NOT_EMPTY: 'IS_NOT_EMPTY',
  IN_LIST: 'IN_LIST'
};

export class ConditionalLogicEvaluator {
  /**
   * Evaluate a single atomic condition against current form state
   * @param {Object} condition
   * @param {string} condition.fieldId - Source field being checked
   * @param {string} condition.operator - Operator from OPERATORS
   * @param {any} [condition.value] - Comparison target value
   * @param {Object} formValues - Current key-value form values
   * @returns {boolean} True if condition passes
   */
  evaluateCondition(condition, formValues = {}) {
    const { fieldId, operator, value: targetVal } = condition;
    const actualVal = formValues[fieldId];

    switch (operator) {
      case OPERATORS.EQUALS:
        return String(actualVal ?? '').toLowerCase() === String(targetVal ?? '').toLowerCase();
      case OPERATORS.NOT_EQUALS:
        return String(actualVal ?? '').toLowerCase() !== String(targetVal ?? '').toLowerCase();
      case OPERATORS.GREATER_THAN:
        return Number(actualVal) > Number(targetVal);
      case OPERATORS.LESS_THAN:
        return Number(actualVal) < Number(targetVal);
      case OPERATORS.GREATER_OR_EQUAL:
        return Number(actualVal) >= Number(targetVal);
      case OPERATORS.LESS_OR_EQUAL:
        return Number(actualVal) <= Number(targetVal);
      case OPERATORS.CONTAINS:
        return String(actualVal || '').toLowerCase().includes(String(targetVal || '').toLowerCase());
      case OPERATORS.NOT_CONTAINS:
        return !String(actualVal || '').toLowerCase().includes(String(targetVal || '').toLowerCase());
      case OPERATORS.IS_EMPTY:
        return actualVal === undefined || actualVal === null || actualVal === '' || (Array.isArray(actualVal) && actualVal.length === 0);
      case OPERATORS.IS_NOT_EMPTY:
        return actualVal !== undefined && actualVal !== null && actualVal !== '' && (!Array.isArray(actualVal) || actualVal.length > 0);
      case OPERATORS.IN_LIST:
        return Array.isArray(targetVal) && targetVal.map(String).includes(String(actualVal));
      default:
        return false;
    }
  }

  /**
   * Evaluate dynamic field state for all form fields based on conditional rules
   * @param {Array<Object>} fieldDefinitions - List of form field schemas with rules
   * @param {Object} currentValues - Current form input values
   * @returns {Object} Map of fieldId -> { isVisible, isRequired, isEnabled }
   */
  evaluateFormState(fieldDefinitions, currentValues = {}) {
    const stateMap = {};

    for (const field of fieldDefinitions) {
      let isVisible = field.defaultVisibility !== undefined ? field.defaultVisibility : true;
      let isRequired = field.required !== undefined ? field.required : false;
      let isEnabled = true;

      if (Array.isArray(field.conditionalRules) && field.conditionalRules.length > 0) {
        for (const rule of field.conditionalRules) {
          const combinator = (rule.combinator || 'AND').toUpperCase();
          const conditions = rule.conditions || [];

          let ruleSatisfied = combinator === 'AND';

          for (const cond of conditions) {
            const condPassed = this.evaluateCondition(cond, currentValues);
            if (combinator === 'AND' && !condPassed) {
              ruleSatisfied = false;
              break;
            } else if (combinator === 'OR' && condPassed) {
              ruleSatisfied = true;
              break;
            }
          }

          // Apply action if rule is satisfied
          if (ruleSatisfied) {
            switch (rule.action) {
              case 'SHOW': isVisible = true; break;
              case 'HIDE': isVisible = false; break;
              case 'REQUIRE': isRequired = true; break;
              case 'OPTIONAL': isRequired = false; break;
              case 'ENABLE': isEnabled = true; break;
              case 'DISABLE': isEnabled = false; break;
            }
          }
        }
      }

      stateMap[field.id] = {
        fieldId: field.id,
        isVisible,
        isRequired,
        isEnabled
      };
    }

    return stateMap;
  }
}

export default ConditionalLogicEvaluator;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConditionalLogicEvaluator;
  module.exports.ConditionalLogicEvaluator = ConditionalLogicEvaluator;
  module.exports.OPERATORS = OPERATORS;
}
