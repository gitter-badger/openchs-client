import General from "../utility/General";
import ResourceUtil from "../utility/ResourceUtil";
import Form from "./Form";
import BaseEntity from "../BaseEntity";
import FormElement from "./FormElement";
import _ from "lodash";

class FormElementGroup {
    static schema = {
        name: 'FormElementGroup',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            name: 'string',
            displayOrder: 'int',
            display: {type: 'string', optional: true},
            formElements: {type: 'list', objectType: 'FormElement'},
            form: 'Form'
        }
    };

    static fromResource(resource, entityService) {
        const formElementGroup = General.assignFields(resource, new FormElementGroup(), ["uuid", "name", "displayOrder", "display"]);
        formElementGroup.form = entityService.findByKey("uuid", ResourceUtil.getUUIDFor(resource, "formUUID"), Form.schema.name);
        return formElementGroup;
    }

    static merge = () => BaseEntity.mergeOn('formElements');

    static associateChild(child, childEntityClass, childResource, entityService) {
        var formElementGroup = entityService.findByKey("uuid", ResourceUtil.getUUIDFor(childResource, "formElementGroupUUID"), FormElementGroup.schema.name);
        formElementGroup = General.pick(formElementGroup, ["uuid"], ["formElements"]);

        if (childEntityClass === FormElement)
            BaseEntity.addNewChild(child, formElementGroup.formElements);
        else
            throw `${childEntityClass.name} not support by ${FormElementGroup.name}`;
        return formElementGroup;
    }

    addFormElement(formElement) {
        this.formElements.push(formElement);
    }

    next() {
        return this.form.formElementGroupAt(this.displayOrder + 1);
    }

    previous() {
        return this.form.formElementGroupAt(this.displayOrder - 1);
    }

    get isLast() {
        return this.form.formElementGroups.length === this.displayOrder;
    }

    get isFirst() {
        return this.displayOrder === 1;
    }

    validate(observationHolder, filteredFormElements) {
        const validationResults = [];
        filteredFormElements.forEach((formElement) => {
            const observation = observationHolder.findObservation(formElement.concept);
            const validationResult = formElement.validate(_.isNil(observation) ? null : observation.getValue());
            validationResults.push(validationResult);
        });
        return validationResults;
    }

    get formElementIds() {
        return this.formElements.map((formElement) => {
            return formElement.uuid
        });
    }

    getFormElements() {
        return FormElementGroup._sortedFormElements(this.formElements);
    }

    static _sortedFormElements(list) {
        return _.sortBy(list, (formElement) => formElement.displayOrder);
    }

    get translatedFieldValue() {
        return this.display;
    }

    removeFormElement(formElementName) {
        this.formElements = _.reject(this.formElements, (formElement) => formElement.matches(formElementName));
        return this;
    }

    filterElements(formElementStatuses) {
        let filtered = _.filter(this.formElements,
            (formElement) => _.some(formElementStatuses, (formElementStatus) =>
                formElementStatus.uuid === formElement.uuid
                && formElementStatus.visibility
                && (() => {
                    formElement.answersToSkip = formElementStatus.answersToSkip;
                    return true;
                })()));
        return FormElementGroup._sortedFormElements(filtered);
    }

    toJSON() {
        return {
            uuid: this.uuid,
            name: this.name,
            displayOrder: this.displayOrder,
            display: this.display,
            formElements: this.formElements,
            formUUID: this.form.uuid
        }
    }
}

export default FormElementGroup;