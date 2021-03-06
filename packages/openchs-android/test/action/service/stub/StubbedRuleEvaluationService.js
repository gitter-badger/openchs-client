import {FormElementStatus, ValidationResult} from "openchs-models";

class StubbedRuleEvaluationService {
    validateAgainstRule(entity) {
        return [ValidationResult.successful('whatever')];
    }

    getDecisions() {
        return [];
    }

    filterFormElements(entity, entityType, formElementGroup) {
        if (formElementGroup) return formElementGroup.formElements.map((formElement) => new FormElementStatus(formElement.uuid, true, undefined));
        return [];
    }
}

export default StubbedRuleEvaluationService;