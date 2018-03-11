"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const react_navigation_1 = require("react-navigation");
const MaterialIcons_1 = require("react-native-vector-icons/MaterialIcons");
const react_native_collapsible_1 = require("react-native-collapsible");
const exercises_1 = require("../../db/exercises");
const ModalSearch_1 = require("./ModalSearch");
const _ = require("lodash");
const colors_1 = require("../../utils/colors");
const grid_1 = require("../../utils/grid");
const enums_1 = require("../../core/enums");
const Header_1 = require("./Header");
class ProgramExercises extends React.PureComponent {
    constructor(props) {
        super(props);
        this.editExerciseFinished = (exercise) => {
            const exercisesDayCopy = this.state.exercisesDay.slice();
            const exerciseSetCopy = exercisesDayCopy[this.editedDayIndex].exercises.slice();
            exerciseSetCopy[this.editedExerciseIndex] = exercise;
            exercisesDayCopy[this.editedDayIndex].exercises = exerciseSetCopy;
            this.setState({ exercisesDay: exercisesDayCopy });
        };
        this.handleSelectionExercise = (exercise, muscle, equipment) => {
            const newExerciseSet = {
                muscleGroup: muscle,
                exercise: { name: exercise, equipment: equipment },
                sets: [{ reps: 8, weight: 75 }, { reps: 8, weight: 75 }, { reps: 8, weight: 75 }],
                recoveryTime: '00:00'
            };
            let sortedExercises = this.daySelected.exercises.slice();
            sortedExercises.push(newExerciseSet);
            sortedExercises = _.sortBy(sortedExercises, (e) => e.exercise.name);
            const copyCurrentDay = {
                day: this.daySelected.day,
                isCollapsed: this.daySelected.isCollapsed,
                exercises: sortedExercises
            };
            const copyExercisesDay = this.state.exercisesDay.slice();
            copyExercisesDay[this.indexDaySelected] = copyCurrentDay;
            this.setState({ exercisesDay: copyExercisesDay, showModalSearch: false });
            this.daySelected = null;
            this.indexDaySelected = null;
        };
        this.renderHeaderSection = (day, index) => {
            return (React.createElement(react_native_1.View, { style: styles.containerHeaderSection },
                React.createElement(react_native_1.Text, { style: styles.textHeaderSection }, day.day),
                (!isNaN(this.props.navigation.state.params.days[0])) &&
                    React.createElement(react_native_1.TouchableOpacity, { onPress: () => {
                            console.log('test');
                        } },
                        React.createElement(MaterialIcons_1.default, { name: "airline-seat-individual-suite", size: 20, color: colors_1.colors.base, style: styles.iconHeaderSectionAdd })),
                React.createElement(react_native_1.TouchableOpacity, { onPress: () => {
                        this.daySelected = day;
                        this.indexDaySelected = index;
                        this.setState({ showModalSearch: true });
                    } },
                    React.createElement(MaterialIcons_1.default, { name: "add-circle-outline", size: 20, color: colors_1.colors.base, style: styles.iconHeaderSectionAdd })),
                React.createElement(react_native_1.TouchableOpacity, { onPress: () => {
                        const copyCurrentDay = {
                            day: day.day,
                            isCollapsed: !day.isCollapsed,
                            exercises: day.exercises.slice()
                        };
                        const copyExercisesDay = this.state.exercisesDay.slice();
                        copyExercisesDay[index] = copyCurrentDay;
                        this.setState({ exercisesDay: copyExercisesDay });
                    } },
                    React.createElement(MaterialIcons_1.default, { name: day.isCollapsed ? 'keyboard-arrow-down' : 'keyboard-arrow-up', size: 20, color: colors_1.colors.base, style: styles.iconHeaderSectionCollapsed }))));
        };
        this.renderExercisesSection = (day) => {
            return (React.createElement(react_native_collapsible_1.default, { collapsed: day.isCollapsed, duration: 500 }, day.exercises.length === 0 &&
                React.createElement(react_native_1.View, { style: { padding: 10 } },
                    React.createElement(react_native_1.Text, { style: styles.sectionNoContent }, "No exercises yet")) ||
                React.createElement(react_native_1.View, null, day.exercises.map((set, index) => {
                    return (React.createElement(react_native_1.TouchableOpacity, { key: set.exercise.name + index, onPress: () => this.showActionSheet(day, set), style: [styles.sectionElement, { borderBottomWidth: index + 1 !== day.exercises.length ? 1 : 0 }] },
                        React.createElement(react_native_1.View, { style: styles.sectionElementRow },
                            React.createElement(react_native_1.Text, { style: styles.textBoldSection }, set.muscleGroup),
                            React.createElement(react_native_1.Text, { style: styles.textMediumSection }, `${set.exercise.name} - ${set.exercise.equipment}`)),
                        React.createElement(react_native_1.View, { style: styles.sectionElementRow },
                            React.createElement(react_native_1.Text, { style: styles.textBoldSection }, set.recoveryTime),
                            set.sets.map((s) => {
                                return (React.createElement(react_native_1.Text, { style: styles.textMediumSection }, `${s.weight}x${s.reps}`));
                            }))));
                }))));
        };
        this.renderSectionDay = (day, index) => {
            return (React.createElement(react_native_1.View, { key: day.day },
                this.renderHeaderSection(day, index),
                this.renderExercisesSection(day),
                this.state.showModalSearch && React.createElement(ModalSearch_1.default, { exercises: exercises_1.default, closeModal: () => this.setState({ showModalSearch: false }), selectExercise: this.handleSelectionExercise })));
        };
        this.saveProgram = () => {
            const { params } = this.props.navigation.state;
            if (params.editedProgram) {
                params.saveProgram({
                    index: params.editedIndex,
                    program: {
                        name: params.name,
                        active: params.editedProgram.active,
                        days: this.state.exercisesDay
                    }
                });
            }
            else {
                params.saveProgram(this.state.exercisesDay, params.name);
            }
            this.props.navigation.dispatch(react_navigation_1.NavigationActions.reset({
                index: 0,
                actions: [react_navigation_1.NavigationActions.navigate({ routeName: 'Home' })]
            }));
        };
        this.state = {
            exercisesDay: [{ day: '', exercises: [], isCollapsed: false }],
            showModalSearch: false,
            saveEnabled: false
        };
        this.showActionSheet = this.showActionSheet.bind(this);
        this.editExerciseFinished = this.editExerciseFinished.bind(this);
        this.saveProgram = this.saveProgram.bind(this);
    }
    componentWillMount() {
        this.props.navigation.setParams({
            rightButtonFunction: this.saveProgram
        });
    }
    componentDidMount() {
        const { params } = this.props.navigation.state;
        const exercisesDayEmpty = params.days.map((day) => {
            return {
                day: day,
                exercises: [],
                isCollapsed: false
            };
        });
        this.setState({
            exercisesDay: (params.editedExercises && params.editedExercises.length) > 0 ?
                params.editedExercises : exercisesDayEmpty
        });
    }
    componentDidUpdate() {
        const buttonDisabled = this.state.exercisesDay.map((ed) => {
            return ed.exercises.length > 0;
        }).some((val) => val === false);
        this.setState({ saveEnabled: !buttonDisabled });
        if (this.props.navigation.state.params.rightButtonEnabled === buttonDisabled) {
            this.props.navigation.setParams({
                rightButtonEnabled: !buttonDisabled
            });
        }
    }
    showActionSheet(day, exercise) {
        const { exercisesDay } = this.state;
        react_native_1.ActionSheetIOS.showActionSheetWithOptions({
            title: exercise.exercise.name,
            message: exercise.exercise.equipment,
            options: ['Edit', 'Delete', 'Cancel'],
            destructiveButtonIndex: 1,
            cancelButtonIndex: 2
        }, (buttonIndex) => {
            const indexDay = _.findIndex(exercisesDay, (dayRow) => {
                return day === dayRow;
            });
            const indexExercise = _.findIndex(exercisesDay[indexDay].exercises, (exerciseRow) => {
                return exercise === exerciseRow;
            });
            if (buttonIndex === 0) {
                this.editedExerciseIndex = indexExercise;
                this.editedDayIndex = indexDay;
                this.props.navigation.navigate('ProgramEditExercise', {
                    exerciseToEdit: this.state.exercisesDay[indexDay].exercises[indexExercise],
                    status: enums_1.HeaderStatus.stack,
                    title: 'Edit exercise',
                    exercise: exercise,
                    saveEdit: this.editExerciseFinished
                });
            }
            else if (buttonIndex === 1) {
                const exercisesDayCopy = this.state.exercisesDay.slice();
                const exerciseSetCopy = exercisesDayCopy[indexDay].exercises.slice();
                exerciseSetCopy.splice(indexExercise, 1);
                exercisesDayCopy[indexDay].exercises = exerciseSetCopy;
                this.setState({ exercisesDay: exercisesDayCopy });
            }
        });
    }
    render() {
        return (React.createElement(react_native_1.ScrollView, { style: styles.container },
            React.createElement(react_native_1.StatusBar, { barStyle: "dark-content" }),
            React.createElement(Header_1.default, { navigation: this.props.navigation, colorBorder: colors_1.colors.headerBorderLight, colorHeader: colors_1.colors.headerLight, textColor: colors_1.colors.base, status: enums_1.HeaderStatus.stack, title: "Exercises", secondaryIcon: "save", secondaryText: "Save", secondaryEnabled: this.state.saveEnabled, secondaryFunction: () => this.saveProgram() }),
            this.state.exercisesDay.map((day, index) => {
                return this.renderSectionDay(day, index);
            }),
            React.createElement(react_native_1.View, { style: styles.viewButton },
                React.createElement(react_native_1.TouchableOpacity, { disabled: !this.state.saveEnabled, style: [styles.button, styles.shadow], onPress: () => this.saveProgram() },
                    React.createElement(react_native_1.Text, { style: [styles.text, !this.state.saveEnabled && styles.textDisabled] }, "Save")))));
    }
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1
    },
    viewButton: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerHeaderSection: {
        width: '100%',
        paddingTop: grid_1.grid.unit,
        paddingBottom: grid_1.grid.unit,
        paddingLeft: grid_1.grid.unit * 2,
        paddingRight: grid_1.grid.unit,
        backgroundColor: colors_1.colors.light,
        flexDirection: 'row'
    },
    textHeaderSection: {
        fontFamily: grid_1.grid.fontBold,
        fontSize: grid_1.grid.caption,
        color: colors_1.colors.base,
        flex: 3
    },
    iconHeaderSectionRest: {
        flex: 1,
        marginRight: grid_1.grid.unit / 2
    },
    iconHeaderSectionAdd: {
        flex: 1,
        marginRight: grid_1.grid.unit / 2,
        marginLeft: grid_1.grid.unit / 2
    },
    iconHeaderSectionCollapsed: {
        flex: 1,
        marginLeft: grid_1.grid.unit / 2
    },
    sectionNoContent: {
        fontFamily: grid_1.grid.font,
        fontSize: grid_1.grid.caption,
        color: colors_1.colors.base
    },
    sectionElement: {
        padding: grid_1.grid.unit,
        borderColor: colors_1.colors.light,
        flexDirection: 'column'
    },
    sectionElementRow: {
        flexDirection: 'row'
    },
    textBoldSection: {
        fontFamily: grid_1.grid.fontBold,
        fontSize: grid_1.grid.caption,
        color: colors_1.colors.base,
        marginRight: 5
    },
    textMediumSection: {
        fontFamily: grid_1.grid.fontMedium,
        fontSize: grid_1.grid.caption,
        color: colors_1.colors.base,
        marginRight: 5
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        height: grid_1.grid.unit * 2,
        marginTop: grid_1.grid.unit
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
    text: {
        fontFamily: 'Montserrat-Regular',
        fontSize: grid_1.grid.body,
        color: colors_1.colors.base
    },
    textDisabled: {
        color: colors_1.colors.textDisabled
    }
});
exports.default = ProgramExercises;
//# sourceMappingURL=ProgramExercises.js.map