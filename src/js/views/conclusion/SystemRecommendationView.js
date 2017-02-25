import AbstractComponent from "../../framework/view/AbstractComponent";
import React, {Component} from "react";
import {View} from "react-native";
import Path from "../../framework/routing/Path";
import themes from "../primitives/themes";
import IndividualProfile from "../common/IndividualProfile";
import {Text, Content, Grid, Col, Row, Container} from "native-base";
import TypedTransition from "../../framework/routing/TypedTransition";
import ReducerKeys from "../../reducer";
import WizardButtons from "../common/WizardButtons";
import AppHeader from "../common/AppHeader";
import {Actions} from "../../action/individual/SystemRecommendationActions";

@Path('/SystemRecommendationView')
class SystemRecommendationView extends AbstractComponent {
    static propTypes = {
        params: React.PropTypes.object.isRequired
    };

    viewName() {
        return "SystemRecommendationView";
    }

    constructor(props, context) {
        super(props, context, ReducerKeys.systemRecommendation);
    }

    save() {
        this.dispatchAction(Actions.SAVE, {cb: () => {
            TypedTransition.from(this).toBeginning();
        }});
    }

    previous() {
        TypedTransition.from(this).goBack();
    }

    componentWillMount() {
        this.dispatchAction(Actions.ON_LOAD, {encounter: this.props.params.encounter, encounterDecisions: this.props.params.encounterDecisions, formElementGroup: this.props.params.previousFormElementGroup});
        return super.componentWillMount();
    }

    render() {
        console.log(`SystemRecommendationView.render`);
        var decisionNumber = 0;
        return (
            <Container theme={themes}>
                <Content>
                    <AppHeader title={this.state.encounter.individual.name}/>
                    <Grid>
                        <Row style={{backgroundColor: '#f7f7f7', paddingLeft: 24, paddingRight: 24, paddingTop: 12, paddingBottom: 12, height: 74}}>
                            <IndividualProfile landingView={false} individual={this.state.encounter.individual}/>
                        </Row>
                        <Row style={{paddingLeft: 24, paddingRight: 24, paddingTop: 12, paddingBottom: 12}}>
                            <Grid>
                                {
                                    _.values(this.state.encounterDecisions).map((encounterDecision) => {
                                        return <Row style={{backgroundColor: '#f7f7f7', paddingTop: 19, paddingBottom: 19, paddingLeft:10}} key={decisionNumber++}>
                                            <Col>
                                                <Text style={{fontSize: 14}}>{encounterDecision.value}</Text>
                                            </Col>
                                        </Row>
                                    })}
                            </Grid>
                        </Row>
                        <View style={{marginLeft:24, marginRight:24}}>
                            <WizardButtons previous={{func: () => this.previous(), visible: true}}
                                       next={{func: () => this.save(), visible: true, label: this.I18n.t('save')}} nextDisabled={false}/>
                        </View>
                    </Grid>
                </Content>
            </Container>
        );
    }
}

export default SystemRecommendationView;
