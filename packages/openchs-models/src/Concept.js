import BaseEntity from './BaseEntity';
import ResourceUtil from "./utility/ResourceUtil";
import General from './utility/General';
import _ from 'lodash';
import MultipleCodedValues from "./observation/MultipleCodedValues";
import SingleCodedValue from "./observation/SingleCodedValue";
import PrimitiveValue from "./observation/PrimitiveValue";

export class ConceptAnswer {
    static schema = {
        name: 'ConceptAnswer',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            concept: 'Concept',
            answerOrder: 'int',
            abnormal: 'bool'
        }
    };

    get name() {
        return this.concept.name;
    }

    static fromResource(resource, entityService) {
        const conceptAnswer = new ConceptAnswer();
        conceptAnswer.concept = entityService.findByKey("uuid", ResourceUtil.getUUIDFor(resource, "conceptAnswerUUID"), Concept.schema.name);
        conceptAnswer.uuid = resource.uuid;
        conceptAnswer.answerOrder = resource.order;
        conceptAnswer.abnormal = resource.abnormal;
        return conceptAnswer;
    }
}

export default class Concept {
    static schema = {
        name: 'Concept',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            name: 'string',
            datatype: "string",
            answers: {"type": "list", "objectType": "ConceptAnswer"},
            lowAbsolute: {"type": 'int', optional: true},
            hiAbsolute: {"type": 'int', optional: true},
            lowNormal: {"type": 'int', optional: true},
            hiNormal: {"type": 'int', optional: true},
            unit: {"type": 'string', optional: true}
        }
    };

    static dataType = {
        Date: 'Date',
        Duration: 'Duration',
        Coded: 'Coded',
        Numeric: 'Numeric',
        Boolean: 'Boolean',
        Text: 'Text',
        NA: 'N/A'
    };

    // static primitiveDataTypes = [Concept.dataType.Boolean, Concept.dataType.Coded, Concept.dataType.Numeric, Concept.dataType.Date, Concept.dataType.Text];

    static fromResource(conceptResource) {
        const concept = new Concept();
        concept.name = conceptResource.name;
        concept.uuid = conceptResource.uuid;
        concept.datatype = conceptResource.dataType;
        concept.lowAbsolute = conceptResource.lowAbsolute;
        concept.hiAbsolute = conceptResource.highAbsolute;
        concept.lowNormal = conceptResource.lowNormal;
        concept.hiNormal = conceptResource.highNormal;
        concept.unit = conceptResource.unit;
        return concept;
    }

    static associateChild(child, childEntityClass, childResource, entityService) {
        var concept = entityService.findByKey("uuid", ResourceUtil.getUUIDFor(childResource, "conceptUUID"), Concept.schema.name);
        concept = General.pick(concept, ["uuid"], ["answers"]);

        if (childEntityClass === ConceptAnswer)
            BaseEntity.addNewChild(child, concept.answers);
        else
            throw `${childEntityClass.name} not support by ${Concept.name}`;
        return concept;
    }

    static merge = () => BaseEntity.mergeOn('answers');

    static create(name, dataType) {
        const concept = new Concept();
        concept.name = name;
        concept.datatype = dataType;
        return concept;
    }

    cloneForReference() {
        const concept = Concept.create(this.name, this.datatype);
        concept.uuid = this.uuid;
        concept.lowAbsolute = this.lowAbsolute;
        concept.lowNormal = this.lowNormal;
        concept.hiNormal = this.hiNormal;
        concept.hiAbsolute = this.hiAbsolute;
        concept.answers = this.getAnswers();
        return concept;
    }

    violatesRange(value) {
        if (_.isNil(value)) return false;
        if (isNaN(value)) return false;

        if (_.isNil(this.lowAbsolute) || _.isNil(this.lowAbsolute)) return false;

        return (value < this.lowAbsolute || value > this.hiAbsolute);
    }

    isAbnormal(value) {
        let valueWrapper = this.getValueWrapperFor(value);
        switch(this.datatype){
            case Concept.dataType.Numeric:
                return this.isBelowLowNormal(valueWrapper.answer) || this.isAboveHiNormal(valueWrapper.answer);
            case Concept.dataType.Coded:
                return valueWrapper.hasAnyAbnormalAnswer(this.abnormalAnswers());
            default:
                return false;
        }
    }

    abnormalAnswers() {
        let abnormalAnswers = _.filter(this.answers,
            (conceptAnswer) => conceptAnswer.abnormal).map((conceptAnswer) => {return conceptAnswer.concept.uuid})
        return abnormalAnswers;
    }

    isBelowLowNormal(value) {
        return this._areValidNumbers(value, this.lowNormal) && value < this.lowNormal;
    }

    isAboveHiNormal(value) {
        return this._areValidNumbers(value, this.hiNormal) && value > this.hiNormal;
    }

    addAnswer(concept) {
        const conceptAnswer = new ConceptAnswer();
        conceptAnswer.uuid = General.randomUUID();
        conceptAnswer.concept = concept;
        this.answers.push(conceptAnswer);
        return conceptAnswer;
    }

    getPossibleAnswerConcept(name) {
        return _.find(this.answers, (conceptAnswer) => conceptAnswer.concept.name === name);
    }

    getValueWrapperFor(value) {
        if (this.isCodedConcept()) {
            return _.isArray(value) ? new MultipleCodedValues(value) : new SingleCodedValue(value);
        } else {
            return new PrimitiveValue(value, this.datatype);
        }
    }

    isCodedConcept() {
        return this.datatype === Concept.dataType.Coded;
    }

    getAnswers() {
        return _.sortBy(this.answers, (answer) => answer.answerOrder);
    }

    get translatedFieldValue() {
        return this.name;
    }

    _areValidNumbers(...numbers) {
        return _.every(numbers, (value) => value !== null && _.isFinite(value));
    }

}