"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const react_native_easy_grid_1 = require("react-native-easy-grid");
const ModalListLog_1 = require("./ModalListLog");
const MaterialIcons_1 = require("react-native-vector-icons/MaterialIcons");
const loDash = require("lodash");
const ModalSets_1 = require("./ModalSets");
const exercises_1 = require("../../db/exercises");
const Header_1 = require("./Header");
const Toaster_1 = require("./Toaster");
const enums_1 = require("../../core/enums");
const ModalRecovery_1 = require("./ModalRecovery");
const helper_1 = require("../../utils/helper");
const ModalSearch_1 = require("./ModalSearch");
const grid_1 = require("../../utils/grid");
const colors_1 = require("../../utils/colors");
class QuickLog extends React.PureComponent {
    constructor() {
        super();
        this.addExerciseSet = () => {
            const newSet = this.buildNewSet();
            let dataLogCopy = this.state.dataLog.slice();
            dataLogCopy.push(newSet);
            this.backToOriginalState(dataLogCopy, false);
        };
        this.saveEditedExercise = () => {
            const newSet = this.buildNewSet();
            let dataLogCopy = this.state.dataLog.slice();
            dataLogCopy[this.editedExerciseIndex] = newSet;
            this.backToOriginalState(dataLogCopy, true);
        };
        this.updateRecovery = (recoveryTime) => {
            this.setState({ showModalRecovery: false, currentRecoveryTime: recoveryTime });
        };
        this.buildNewSet = () => {
            return {
                exercise: this.exercises.find((exercise) => {
                    return exercise.name === this.state.currentExercise;
                }),
                muscleGroup: this.state.currentMuscle,
                sets: this.state.sets,
                recoveryTime: this.state.currentRecoveryTime
            };
        };
        this.backToOriginalState = (dataLogCopy, wasEditing) => {
            this.order = Object.keys(dataLogCopy);
            this.exercises = loDash.sortBy(exercises_1.default.find((data) => data.muscle === this.muscles[0]).exercises, [(exercise) => {
                    return exercise.name;
                }]);
            this.setState({
                sets: [{ reps: 8, weight: 75 }, { reps: 8, weight: 80 }, { reps: 8, weight: 85 }],
                currentExercise: this.exercises[0].name,
                currentMuscle: this.muscles[0],
                dataLog: dataLogCopy,
                editing: false,
                showToasterInfo: !wasEditing,
                showToasterWarning: wasEditing
            });
        };
        this.editExercise = (index) => {
            const exerciseToEdit = this.state.dataLog[index];
            this.setState({ currentMuscle: exerciseToEdit.muscleGroup });
            this.exercises = loDash.sortBy(exercises_1.default.find((data) => data.muscle === exerciseToEdit.muscleGroup).exercises, [(exercise) => {
                    return exercise.name;
                }]);
            this.editedExerciseIndex = index;
            this.setState({
                showModal: false,
                sets: exerciseToEdit.sets,
                currentExercise: exerciseToEdit.exercise.name,
                editing: true
            });
        };
        this.deleteExercise = (newDataLog) => {
            this.setState({ dataLog: newDataLog });
        };
        this.stopToaster = (status) => {
            this.setState({
                showToasterInfo: status === enums_1.ToasterInfo.info ? false : this.state.showToasterInfo,
                showToasterWarning: status === enums_1.ToasterInfo.warning ? false : this.state.showToasterWarning
            });
        };
        this.selectExerciseModalSearch = (exercise, muscle) => {
            this.exercises = loDash.sortBy(exercises_1.default.find((data) => data.muscle === muscle).exercises, [(e) => {
                    return e.name;
                }]);
            this.setState({ currentMuscle: muscle, currentExercise: exercise, showModalSearch: false });
        };
        this.muscles = exercises_1.default.map((data) => data.muscle).sort();
        this.exercises = loDash.sortBy(exercises_1.default.find((data) => data.muscle === this.muscles[0]).exercises, [(exercise) => {
                return exercise.name;
            }]);
        this.state = {
            sets: [{ reps: 8, weight: 75 }, { reps: 8, weight: 80 }, { reps: 8, weight: 85 }],
            currentExercise: this.exercises[0].name,
            currentMuscle: this.muscles[0],
            currentRecoveryTime: helper_1.buildRecoveryTimes()[0],
            showModal: false,
            showModalSets: false,
            showModalRecovery: false,
            showToasterInfo: false,
            showToasterWarning: false,
            showModalSearch: false,
            dataLog: [],
            editing: false
        };
        this.closeModalListLog = this.closeModalListLog.bind(this);
        this.closeModalSets = this.closeModalSets.bind(this);
        this.handleModalSearch = this.handleModalSearch.bind(this);
        this.updateRecovery = this.updateRecovery.bind(this);
        this.addExerciseSet = this.addExerciseSet.bind(this);
        this.deleteExercise = this.deleteExercise.bind(this);
        this.editExercise = this.editExercise.bind(this);
        this.saveEditedExercise = this.saveEditedExercise.bind(this);
        this.stopToaster = this.stopToaster.bind(this);
        this.backToOriginalState = this.backToOriginalState.bind(this);
        this.selectExerciseModalSearch = this.selectExerciseModalSearch.bind(this);
    }
    componentWillMount() {
        const { params } = this.props.navigation.state;
        if (params) {
            this.setState({ currentMuscle: params.exercise.muscleGroup });
            this.exercises = loDash.sortBy(exercises_1.default.find((data) => data.muscle === params.exercise.muscleGroup).exercises, [(exercise) => {
                    return exercise.name;
                }]);
            this.setState({
                currentExercise: params.exercise.exercise.name,
                sets: params.exercise.sets,
                currentRecoveryTime: params.exercise.recoveryTime,
                editing: true
            });
        }
    }
    componentDidMount() {
        this.order = Object.keys(this.state.dataLog);
    }
    closeModalListLog() {
        this.setState({ showModal: false });
    }
    closeModalSets() {
        this.setState({ showModalSets: false });
    }
    handleModalSearch(close = false) {
        this.setState({ showModalSearch: !close });
    }
    scrollToEndHorizontally() {
        if (this.scrollViewWidth >= react_native_1.Dimensions.get('window').width - 140) {
            this.scrollViewRef.scrollTo({
                x: this.scrollViewWidth - react_native_1.Dimensions.get('window').width * 0.545,
                y: 0,
                animated: true
            });
        }
    }
    updateDeleteSet(reps, weight) {
        let repsWeightCopy = this.state.sets.slice();
        if (reps) {
            repsWeightCopy.splice(this.setToModify.indexSet, 1, { reps: reps, weight: weight });
        }
        else {
            repsWeightCopy.splice(this.setToModify.indexSet, 1);
        }
        this.setState({ sets: repsWeightCopy });
        this.setToModify = null;
    }
    render() {
        const { sets, editing, currentExercise, currentMuscle, showModal, showModalSets, dataLog, showToasterInfo, showToasterWarning, showModalRecovery, currentRecoveryTime, showModalSearch } = this.state;
        const navigationParams = this.props.navigation.state.params;
        return (React.createElement(react_native_1.View, { style: styles.container },
            React.createElement(react_native_1.StatusBar, { barStyle: "dark-content" }),
            React.createElement(Header_1.default, { status: navigationParams ? navigationParams.status : enums_1.HeaderStatus.drawer, navigation: this.props.navigation, colorBorder: colors_1.colors.headerBorderLight, colorHeader: colors_1.colors.headerLight, textColor: colors_1.colors.base, title: navigationParams ? navigationParams.title : 'Quick Log', secondaryIcon: "search", secondaryEnabled: true, secondaryFunction: this.handleModalSearch }),
            React.createElement(react_native_easy_grid_1.Grid, { style: styles.grid },
                React.createElement(react_native_easy_grid_1.Row, { size: 35, style: styles.rows },
                    React.createElement(react_native_easy_grid_1.Col, { size: 25, style: styles.textPickers },
                        React.createElement(react_native_1.Text, { style: styles.textTitle }, "Muscle:")),
                    React.createElement(react_native_easy_grid_1.Col, { size: 75, style: styles.columns },
                        React.createElement(react_native_1.Picker, { style: styles.picker, itemStyle: styles.pickerItem, selectedValue: currentMuscle, onValueChange: (itemValue) => {
                                this.exercises = loDash.sortBy(exercises_1.default.find((data) => data.muscle === itemValue).exercises, [(exercise) => {
                                        return exercise.name;
                                    }]);
                                this.setState({ currentMuscle: itemValue, currentExercise: this.exercises[0].name });
                            } }, this.muscles.map((muscle) => {
                            return React.createElement(react_native_1.Picker.Item, { key: muscle, label: muscle, value: muscle });
                        })))),
                React.createElement(react_native_easy_grid_1.Row, { size: 35, style: styles.rows },
                    React.createElement(react_native_easy_grid_1.Col, { size: 25, style: styles.textPickers },
                        React.createElement(react_native_1.Text, { style: styles.textTitle }, "Exercise:")),
                    React.createElement(react_native_easy_grid_1.Col, { size: 75, style: styles.columns },
                        React.createElement(react_native_1.Picker, { style: styles.picker, itemStyle: styles.pickerItem, selectedValue: currentExercise, onValueChange: (itemValue) => this.setState({ currentExercise: itemValue }) }, this.exercises.map((muscle) => {
                            return React.createElement(react_native_1.Picker.Item, { key: muscle.name, label: muscle.name, value: muscle.name });
                        })))),
                React.createElement(react_native_easy_grid_1.Row, { size: 20, style: styles.rows },
                    React.createElement(react_native_1.ScrollView, { horizontal: true, contentContainerStyle: styles.scroll, ref: ref => this.scrollViewRef = ref, onContentSizeChange: (width) => this.scrollViewWidth = width },
                        sets.map((item, index) => {
                            return (React.createElement(react_native_1.TouchableOpacity, { key: item.weight + index, style: [styles.elemHorizontalList, styles.shadow], onPress: () => {
                                    this.setToModify = { indexSet: index, reps: item.reps, weight: item.weight };
                                    this.setState({ showModalSets: true });
                                } },
                                React.createElement(react_native_1.Text, { style: styles.textSets },
                                    React.createElement(react_native_1.Text, null, item.reps),
                                    React.createElement(react_native_1.Text, null, " x")),
                                React.createElement(react_native_1.Text, { style: styles.textSets },
                                    React.createElement(react_native_1.Text, null, item.weight),
                                    React.createElement(react_native_1.Text, null, "kg"))));
                        }),
                        React.createElement(react_native_1.TouchableOpacity, { onPress: () => {
                                this.scrollToEndHorizontally();
                                this.setState({ sets: [...this.state.sets, loDash.last(sets)] });
                            } },
                            React.createElement(MaterialIcons_1.default, { name: "add-circle-outline", size: 30, color: "#445878" })))),
                React.createElement(react_native_easy_grid_1.Row, { size: 10, style: styles.rows },
                    React.createElement(react_native_easy_grid_1.Col, { style: styles.columnsButtons }, !editing &&
                        React.createElement(react_native_1.TouchableOpacity, { style: [styles.buttonCurrentLog, styles.buttonBottom, styles.shadow], onPress: () => this.setState({
                                showModal: true,
                                showToasterInfo: false,
                                showToasterWarning: false
                            }) },
                            React.createElement(react_native_1.Text, { style: styles.buttonsText }, "See log"))),
                    React.createElement(react_native_easy_grid_1.Col, { style: styles.columnsButtons },
                        React.createElement(react_native_easy_grid_1.Row, null,
                            React.createElement(react_native_1.Text, { style: styles.textRecovery }, currentRecoveryTime)),
                        React.createElement(react_native_easy_grid_1.Row, null,
                            React.createElement(react_native_1.TouchableOpacity, { style: [styles.buttonBottom, styles.shadow, { marginTop: -7 }], onPress: () => this.setState({
                                    showModalRecovery: true
                                }) },
                                React.createElement(react_native_1.Text, { style: styles.buttonsText }, "Rec. time")))),
                    React.createElement(react_native_easy_grid_1.Col, { style: styles.columnsButtons },
                        React.createElement(react_native_1.TouchableOpacity, { onPress: () => {
                                if (navigationParams) {
                                    navigationParams.saveEdit(this.buildNewSet());
                                    this.props.navigation.goBack();
                                }
                                else {
                                    (editing ? this.saveEditedExercise() : this.addExerciseSet());
                                }
                            }, style: [styles.buttonAdd, styles.buttonBottom, styles.shadow] },
                            React.createElement(react_native_1.Text, { style: styles.buttonsText }, editing ? 'Save' : 'Add'))))),
            showToasterInfo &&
                React.createElement(Toaster_1.default, { text: "Exercise logged", status: enums_1.ToasterInfo.info, stopToaster: this.stopToaster }),
            showToasterWarning &&
                React.createElement(Toaster_1.default, { text: "Changes saved", status: enums_1.ToasterInfo.warning, stopToaster: this.stopToaster }),
            showModalSets && React.createElement(ModalSets_1.default, { updateDeleteSet: (reps, weight) => this.updateDeleteSet(reps, weight), deleteEnabled: sets.length > 1, reps: this.setToModify.reps, weight: this.setToModify.weight, closeModal: this.closeModalSets }),
            showModal && React.createElement(ModalListLog_1.default, { dataLog: dataLog, deleteExercise: this.deleteExercise, editExercise: this.editExercise, order: this.order, closeModal: this.closeModalListLog }),
            showModalRecovery && React.createElement(ModalRecovery_1.default, { updateRecovery: this.updateRecovery }),
            showModalSearch && React.createElement(ModalSearch_1.default, { exercises: exercises_1.default, closeModal: this.handleModalSearch, selectExercise: this.selectExerciseModalSearch })));
    }
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors_1.colors.lightAlternative
    },
    logView: {
        flex: 2,
        backgroundColor: colors_1.colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    scrollView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors_1.colors.lightAlternative
    },
    grid: {
        flex: 1,
        backgroundColor: colors_1.colors.lightAlternative,
        marginRight: grid_1.grid.unit * 1.5,
        marginLeft: grid_1.grid.unit * 1.5
    },
    columns: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    columnsButtons: {
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    rows: {
        margin: grid_1.grid.unit * 0.75
    },
    picker: {
        width: 250,
        height: 'auto'
    },
    elemHorizontalList: {
        flexDirection: 'column',
        marginRight: 32,
        marginLeft: 2
    },
    textPickers: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        color: colors_1.colors.base,
        fontFamily: grid_1.grid.font
    },
    scroll: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonCurrentLog: {
        position: 'absolute',
        left: 0
    },
    buttonAdd: {
        position: 'absolute',
        right: 0
    },
    shadow: {
        backgroundColor: colors_1.colors.white,
        borderRadius: grid_1.grid.unit / 4,
        padding: grid_1.grid.unit / 2,
        borderWidth: grid_1.grid.regularBorder,
        borderColor: colors_1.colors.lightAlternative,
        borderBottomWidth: 0,
        shadowColor: colors_1.colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: grid_1.grid.highOpacity,
        shadowRadius: grid_1.grid.unit / 8,
        elevation: 1
    },
    pickerItem: {
        fontSize: grid_1.grid.subHeader,
        color: colors_1.colors.base
    },
    buttonBottom: {
        width: react_native_1.Dimensions.get('window').width / 4,
        justifyContent: 'center',
        alignItems: 'center',
        height: grid_1.grid.unit * 2
    },
    buttonsText: {
        fontFamily: grid_1.grid.font,
        color: colors_1.colors.base
    },
    textSets: {
        fontFamily: grid_1.grid.font,
        color: colors_1.colors.base
    },
    textTitle: {
        fontFamily: grid_1.grid.font,
        color: colors_1.colors.base
    },
    textRecovery: {
        fontFamily: grid_1.grid.fontLight,
        fontSize: grid_1.grid.caption,
        color: colors_1.colors.base
    }
});
exports.default = QuickLog;
//# sourceMappingURL=QuickLog.js.map