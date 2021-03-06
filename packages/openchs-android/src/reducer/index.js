import IndividualRegisterActionMap, {IndividualRegisterActions} from "../action/individual/IndividualRegisterActions";
import Reducer from "./Reducer";
import IndividualProfileActionMap, {IndividualProfileActions} from "../action/individual/IndividualProfileActions";
import ProgramEnrolmentActionMap, {ProgramEnrolmentActions} from '../action/program/ProgramEnrolmentActions';
import IndividualGeneralHistoryActionsMap, {IndividualGeneralHistoryActions} from '../action/individual/IndividualGeneralHistoryActions';
import {
    EncounterActions,
    IndividualEncounterViewActionsMap
} from "../action/individual/EncounterActions";
import {
    ProgramEnrolmentsActions,
    ProgramEnrolmentsActionsMap
} from "../action/program/ProgramEnrolmentsActions";
import {
    ProgramEnrolmentDashboardActions,
    ProgramEnrolmentDashboardActionsMap
} from '../action/program/ProgramEnrolmentDashboardActions';
import {
    MyDashboardActions,
    MyDashboardActionsMap,
    MyDashboardPrefix
} from '../action/mydashboard/MyDashboardActions';
import {ProgramEncounterActions, ProgramEncounterActionsMap} from '../action/program/ProgramEncounterActions';
import {
    IndividualRegistrationDetailsActions,
    IndividualRegistrationDetailsActionsMap
} from '../action/individual/IndividualRegistrationDetailsActions';
import {IndividualSearchActions, IndividualSearchActionsMap} from '../action/individual/IndividualSearchActions';
import {AddressLevelActions} from '../action/AddressLevelActions';
import {ChecklistActions, ChecklistActionsMap} from '../action/program/ChecklistActions';
import _ from 'lodash';
import {SettingsActions, SettingsActionsMap} from "../action/SettingsActions";
import {StartProgramActions, StartProgramActionsMap} from "../action/program/StartProgramActions";
import {LoginActions, LoginActionsMap} from "../action/LoginActions";

export default class Reducers {
    static reducerKeys = {
        programEnrolment: "programEnrolment",
        individualGeneralHistory: "individualGeneralHistory",
        encounter: "encounter",
        individualRegister: "individualRegister",
        individualProfile: 'individualProfile',
        programEnrolments: 'programEnrolments',
        programEnrolmentDashboard: 'programEnrolmentDashboard',
        programEncounter: 'programEncounter',
        individualRegistrationDetails: 'individualRegistrationDetails',
        individualSearch: 'individualSearch',
        addressLevels: 'addressLevels',
        myDashboard: 'myDashboard',
        checklist: 'checklist',
        settings: 'settings',
        startProgramActions: "startProgramActions",
        loginActions: 'loginActions'
    };

    static createReducers(beanStore) {
        const reducerMap = {};
        reducerMap[Reducers.reducerKeys.checklist] = Reducers._add(ChecklistActionsMap, ChecklistActions, beanStore);
        reducerMap[Reducers.reducerKeys.individualSearch] = Reducers._add(IndividualSearchActionsMap, IndividualSearchActions, beanStore);
        reducerMap[Reducers.reducerKeys.addressLevels] = Reducers._add(new Map([]), AddressLevelActions, beanStore);
        reducerMap[Reducers.reducerKeys.individualRegister] = Reducers._add(IndividualRegisterActionMap, IndividualRegisterActions, beanStore);
        reducerMap[Reducers.reducerKeys.individualProfile] = Reducers._add(IndividualProfileActionMap, IndividualProfileActions, beanStore);
        reducerMap[Reducers.reducerKeys.programEnrolment] = Reducers._add(ProgramEnrolmentActionMap, ProgramEnrolmentActions, beanStore);
        reducerMap[Reducers.reducerKeys.individualGeneralHistory] = Reducers._add(IndividualGeneralHistoryActionsMap, IndividualGeneralHistoryActions, beanStore);
        reducerMap[Reducers.reducerKeys.encounter] = Reducers._add(IndividualEncounterViewActionsMap, EncounterActions, beanStore);
        reducerMap[Reducers.reducerKeys.programEnrolments] = Reducers._add(ProgramEnrolmentsActionsMap, ProgramEnrolmentsActions, beanStore);
        reducerMap[Reducers.reducerKeys.programEnrolmentDashboard] = Reducers._add(ProgramEnrolmentDashboardActionsMap, ProgramEnrolmentDashboardActions, beanStore, ProgramEnrolmentDashboardActions.ACTION_PREFIX);
        reducerMap[Reducers.reducerKeys.programEncounter] = Reducers._add(ProgramEncounterActionsMap, ProgramEncounterActions, beanStore);
        reducerMap[Reducers.reducerKeys.individualRegistrationDetails] = Reducers._add(IndividualRegistrationDetailsActionsMap, IndividualRegistrationDetailsActions, beanStore);
        reducerMap[Reducers.reducerKeys.settings] = Reducers._add(SettingsActionsMap, SettingsActions, beanStore);
        reducerMap[Reducers.reducerKeys.startProgramActions] = Reducers._add(StartProgramActionsMap, StartProgramActions, beanStore);
        reducerMap[Reducers.reducerKeys.loginActions] = Reducers._add(LoginActionsMap, LoginActions, beanStore);
        reducerMap[Reducers.reducerKeys.myDashboard] = Reducers._add(MyDashboardActionsMap, MyDashboardActions, beanStore, MyDashboardPrefix);

        return reducerMap;
    };

    static onPossibleExternalStateChange(state, action, context) {
        const newState = Object.assign({}, state);
        newState.possibleExternalStateChange = true;
        return newState;
    }

    static STATE_CHANGE_POSSIBLE_EXTERNALLY = 'STATE_CHANGE_POSSIBLE_EXTERNALLY';
    static ON_ERROR = 'ON_ERROR';

    static _add(actions, actionClass, beanStore, prefix) {
        if (!actions.has('RESET'))
            actions.set('RESET', () => actionClass.getInitialState(beanStore));
        if (!_.isNil(prefix)) {
            actions.set(`${prefix}.${Reducers.STATE_CHANGE_POSSIBLE_EXTERNALLY}`, Reducers.onPossibleExternalStateChange);
        }
        return Reducer.factory(actions, actionClass.getInitialState(beanStore), beanStore, prefix);
    };
}