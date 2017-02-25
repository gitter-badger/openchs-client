import _ from "lodash";

class MultipleCodedValues {
    constructor(answer) {
        this.answer = _.isNil(answer) ? [] : answer;
    }

    push(answerUUID) {
        this.answer.push({conceptUUID: answerUUID});
        return this;
    }

    static createWithSingleItem(answerUUID) {
        const multipleCodedValues = new MultipleCodedValues();
        multipleCodedValues.push(answerUUID);
        return multipleCodedValues;
    }

    isAnswerAlreadyPresent(answer) {
        return _.findIndex(this.answer, function (item) {
                return item.conceptUUID === answer;
            }) !== -1;
    }

    removeAnswer(answer) {
        _.remove(this.answer, function (item) {
            return item.conceptUUID === answer;
        });
    }

    toggleAnswer(answerUUID) {
        if (this.isAnswerAlreadyPresent(answerUUID)) {
            this.removeAnswer(answerUUID);
        } else {
            this.push(answerUUID);
        }
    }

    getValue() {
        return this.answer;
    }

    get toResource() {
        return this.getValue().map((answer) => {
            return answer.conceptUUID;
        });
    }

    cloneForNewEncounter() {
        const multipleCodedValues = new MultipleCodedValues();
        multipleCodedValues.answer = [];
        this.answer.forEach((obj) => {
            multipleCodedValues.push(obj.conceptUUID);
        });

        return multipleCodedValues;
    }
}

export default MultipleCodedValues;