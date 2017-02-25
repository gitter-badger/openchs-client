import {View, StyleSheet, DatePickerAndroid} from "react-native";
import React, {Component} from "react";
import {Text} from "native-base";
import DynamicGlobalStyles from "../primitives/DynamicGlobalStyles";
import _ from "lodash";
import General from "../../utility/General";
import AbstractFormElement from "./AbstractFormElement";

class DateFormElement extends AbstractFormElement {
    static propTypes = {
        element: React.PropTypes.object.isRequired,
        actionName: React.PropTypes.string.isRequired,
        dateValue : React.PropTypes.object
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <View>
                <View style={{backgroundColor: '#ffffff', marginTop: 10, marginBottom: 10}}>
                    <Text style={DynamicGlobalStyles.formElementLabel}>{this.label}</Text>
                </View>
                <View>
                    <Text onPress={this.showPicker.bind(this, 'simple', {date: new Date()})}
                          style={DynamicGlobalStyles.formElementLabel}>{this.dateDisplay(this.props.dateValue)}</Text>
                </View>
            </View>);
    }

    dateDisplay(date) {
        return _.isNil(date) ? this.I18n.t("chooseADate") : General.formatDate(date.answer);
    }

    async showPicker(stateKey, options) {
        const {action, year, month, day} = await DatePickerAndroid.open(options);
        if (action !== DatePickerAndroid.dismissedAction) {
            this.dispatchAction(this.props.actionName, {formElement: this.props.element, value: new Date(year, month, day)});
        }
    }
}

export default DateFormElement;