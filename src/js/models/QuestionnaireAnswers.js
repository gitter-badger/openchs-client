import QuestionAnswer from "./QuestionAnswer";

class QuestionnaireAnswers {
    static schema = {
        name: "QuestionnaireAnswers",
        properties: {
            questionAnswers: {type: 'list', objectType: "QuestionAnswer"}
        }
    };

    constructor(questionnaireName) {
        this.questionnaireName = questionnaireName;
        this.questionAnswers = new Map();
    }

    set currentQuestion(value) {
        this.questionCursor = value;
    }

    set currentAnswer(value) {
        this.questionAnswers.set(this.questionCursor, value);
    }

    get currentAnswer() {
        return this.questionAnswers.get(this.questionCursor);
    }

    get value() {
        return this.questionAnswers;
    }

    toArray() {
        var questionAnswerPairs = [];
        this.questionAnswers.forEach((answer, question, questionAnswers) => questionAnswerPairs.push({
            question,
            answer
        }));
        return questionAnswerPairs;
    }

    toSchemaInstance() {
        var schemaInstance = {questionAnswers: []};
        this.questionAnswers.forEach((answer, question, questionAnswers) => schemaInstance.questionAnswers.push(new QuestionAnswer(question, answer)));
        return schemaInstance;
    }
}

export default QuestionnaireAnswers;