import React, {Component, View, Text, StyleSheet, ListView} from 'react-native';
import Path from '../../routing/Path';
import AppState from '../../hack/AppState'
import * as ConclusionFunctions from '../../../config/conclusions'
import AppHeader from '../primitives/AppHeader';
import * as CHSStyles from "../primitives/GlobalStyles"
import WizardButtons from '../primitives/WizardButtons'
import ConfirmationView from "./ConfirmationView";

@Path('/DecisionView')
class DecisionView extends Component {
    static propTypes = {
        params: React.PropTypes.object.isRequired
    };

    static contextTypes = {
        navigator: React.PropTypes.func.isRequired,
        getService: React.PropTypes.func.isRequired
    };

    static styles = StyleSheet.create({
        summary: {
            fontSize: 24,
            color: '#0C59CF'
        },
        decision: {
            fontSize: 20,
            color: '#0C59CF'
        }
    });

    constructor(props, context) {
        super(props, context);
    }
    
    render() {
        var conclusionFunctionName = AppState.questionnaireAnswers.questionnaireName.replace(/\s/g, "_") + "_conclusion";
        console.log("Function name for deriving conclusion: " + conclusionFunctionName);
        var parameter = AppState.questionnaireAnswers;
        this.decisions = eval(`ConclusionFunctions.${conclusionFunctionName}(parameter)`);


        return (
            <View>
                <AppHeader title={AppState.questionnaireAnswers.questionnaireName}
                           onTitlePressed={this.onQuestionnaireNamePress}
                           parent={this}
                />
                <View style={CHSStyles.Global.mainSection}>
                    <Text style={DecisionView.styles.summary}>{this.decisions[0].name}</Text>
                    <Text style={DecisionView.styles.decision}>{this.decisions[0].value}</Text>

                    <WizardButtons hasQuestionBefore={true} nextParams={{decisions: this.decisions}} parent={this} nextView={ConfirmationView}/>
                </View>
            </View>
        );
    }
}

export default DecisionView;