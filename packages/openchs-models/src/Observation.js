import _ from "lodash";
import Concept from './Concept';
import SingleCodedValue from "./observation/SingleCodedValue";

class Observation {
    static schema = {
        name: 'Observation',
        properties: {
            concept: 'Concept',
            valueJSON: 'string'
        }
    };

    static create(concept, value, abnormal = false) {
        const observation = new Observation();
        observation.concept = concept;
        observation.valueJSON = value;
        observation.abnormal = abnormal;
        return observation;
    }

    toggleMultiSelectAnswer(answerUUID) {
        this.getValueWrapper().toggleAnswer(answerUUID);
    }

    toggleSingleSelectAnswer(answerUUID) {
        if (this.getValueWrapper().hasValue(answerUUID)) {
            this.valueJSON = {};
        } else {
            this.valueJSON = new SingleCodedValue(answerUUID);
        }
    }

    static valueAsString(observation, conceptService, i18n) {
        const valueWrapper = observation.getValueWrapper();

        if (observation.concept.datatype === Concept.dataType.Date) {
            return valueWrapper.asDisplayDate();
        } else if (valueWrapper.isSingleCoded) {
            return i18n.t(conceptService.getConceptByUUID(valueWrapper.getConceptUUID()).name);
        } else if (valueWrapper.isMultipleCoded) {
            return _.join(valueWrapper.getValue().map((value) => {
                return i18n.t(conceptService.getConceptByUUID(value).name);
            }), ', ');
        } else if (observation.concept.datatype === Concept.dataType.Boolean) {
            return i18n.t(_.toString(valueWrapper.getValue()));
        } else {
            return _.toString(valueWrapper.getValue());
        }
    }

    isAbnormal() {
        //This is to support the old version of app where observation are being set explicitly true.
        // Developer is just being lazy here.
        if (this.abnormal === true) {
            return true;
        }
        return this.concept.isAbnormal(this.getValue());
    }


    hasNoAnswer() {
        return _.isEmpty(this.getValueWrapper().answer);
    }

    cloneForEdit() {
        const observation = new Observation();
        observation.concept = this.concept.cloneForReference();
        observation.valueJSON = this.getValueWrapper().cloneForEdit();
        return observation;
    }

    getValueWrapper() {
        if (_.isString(this.valueJSON)) {
            let answer = JSON.parse(this.valueJSON).answer;
            return this.concept.getValueWrapperFor(answer);
        }
        else return this.valueJSON;
    }

    get toResource() {
        return {conceptUUID: this.concept.uuid, value: this.getValueWrapper().toResource};
    }

    getValue() {
        return this.getValueWrapper().getValue();
    }

    setValue(valueWrapper) {
        this.valueJSON = valueWrapper;
    }

    getReadableValue() {
        let value = this.getValue();
        if (this.concept.datatype === Concept.dataType.Coded) {
            return _.isNil(value) ? value : value.map((conceptAnswerUUID) => {
                let answer = _.find(this.concept.answers, (conceptAnswer) => conceptAnswer.concept.uuid === conceptAnswerUUID);
                return answer.name;
            });
        }
        return value;
    }
}

export default Observation;