"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const react_native_keyboard_aware_scroll_view_1 = require("react-native-keyboard-aware-scroll-view");
const _ = require("lodash");
const grid_1 = require("../../utils/grid");
const colors_1 = require("../../utils/colors");
const enums_1 = require("../../core/enums");
const Header_1 = require("./Header");
class ProgramNameDays extends React.PureComponent {
    constructor() {
        super();
        this.buttonNextEnabled = () => {
            const { name, numberOfDays, weekdays } = this.state;
            return name !== '' && (numberOfDays !== '' || weekdays.some((elem) => {
                return elem.training;
            }));
        };
        this.modifyEditedProgram = (currentIsDays) => {
            const editedProgram = this.props.navigation.state.params.editedProgram ?
                Object.assign(this.props.navigation.state.params.editedProgram) : null;
            let exercisesDay = [];
            if (editedProgram) {
                if (isNaN(+editedProgram.days[0].day)) {
                    // If the edited program contained day names
                    if (currentIsDays) {
                        // If days were added push empty days, if days were removed destroy the difference
                        this.state.weekdays.map((d) => {
                            if (d.training) {
                                const existingDay = editedProgram.days.find((ed) => ed.day === d.name);
                                if (existingDay) {
                                    exercisesDay.push(existingDay);
                                }
                                else {
                                    exercisesDay.push({
                                        day: d.name,
                                        exercises: [],
                                        isCollapsed: false
                                    });
                                }
                            }
                        });
                    }
                }
                else {
                    // If the edited program contained numbers as days
                    if (currentIsDays) {
                        // If the current state is day names remove all
                        editedProgram.days.length = 0;
                    }
                    else {
                        // If days were added push empty days, if days were removed destroy the difference
                        if (+this.state.numberOfDays > editedProgram.days.length) {
                            _.range(+this.state.numberOfDays - editedProgram.days.length).map((i) => {
                                exercisesDay.push({
                                    day: i.toString(),
                                    exercises: [],
                                    isCollapsed: false
                                });
                            });
                        }
                        else {
                            exercisesDay = editedProgram.days.slice();
                            exercisesDay.length = +this.state.numberOfDays;
                        }
                    }
                }
                return exercisesDay;
            }
            else {
                return null;
            }
        };
        this.navigateToProgramExercises = () => {
            const { params } = this.props.navigation.state;
            this.props.navigation.navigate('ProgramExercises', {
                name: this.state.name,
                days: this.state.numberOfDays === '' ? this.state.weekdays.filter((day) => {
                    if (day.training)
                        return day.name;
                }).map((day) => day.name) :
                    _.range(+this.state.numberOfDays).map((value) => (value + 1).toString()),
                saveProgram: params.saveProgram,
                editedExercises: params.editedProgram ? (this.state.numberOfDays === '' ? this.modifyEditedProgram(true) :
                    this.modifyEditedProgram(false)) : null,
                editedProgram: params.editedProgram ? params.editedProgram : null,
                editedIndex: params.editedIndex
            });
        };
        this.state = {
            name: '',
            numberOfDays: '',
            weekdays: [
                { name: 'Monday', training: false },
                { name: 'Tuesday', training: false },
                { name: 'Wednesday', training: false },
                { name: 'Thursday', training: false },
                { name: 'Friday', training: false },
                { name: 'Saturday', training: false },
                { name: 'Sunday', training: false }
            ]
        };
        this.buttonNextEnabled = this.buttonNextEnabled.bind(this);
        this.navigateToProgramExercises = this.navigateToProgramExercises.bind(this);
        this.modifyEditedProgram = this.modifyEditedProgram.bind(this);
    }
    componentDidMount() {
        const { params } = this.props.navigation.state;
        if (params.editedProgram) {
            this.setState({ name: params.editedProgram.name });
            if (isNaN(+params.editedProgram.days[0].day)) {
                const activeDays = params.editedProgram.days.map((day) => day.day);
                let weekdaysCopy = this.state.weekdays.slice();
                activeDays.map((ad) => {
                    const index = _.findIndex(weekdaysCopy, (wd) => wd.name === ad);
                    weekdaysCopy[index] = { name: ad, training: true };
                });
                this.setState({ weekdays: weekdaysCopy });
            }
            else {
                this.setState({ numberOfDays: params.editedProgram.days.length.toString() });
            }
        }
    }
    showActionSheet() {
        const { params } = this.props.navigation.state;
        react_native_1.ActionSheetIOS.showActionSheetWithOptions({
            title: 'Conflict: please select a value',
            options: ['Selected days', 'Number of days', 'Cancel'],
            cancelButtonIndex: 2
        }, (buttonIndex) => {
            if (buttonIndex === 0) {
                this.props.navigation.navigate('ProgramExercises', {
                    name: this.state.name,
                    days: this.state.weekdays.filter((day) => {
                        if (day.training)
                            return day.name;
                    }).map((day) => day.name),
                    saveProgram: params.saveProgram,
                    editedExercises: params.editedProgram ? this.modifyEditedProgram(true) : null,
                    editedProgram: params.editedProgram ? params.editedProgram : null,
                    editedIndex: params.editedIndex ? params.editedIndex : null
                });
            }
            else if (buttonIndex === 1) {
                this.props.navigation.navigate('ProgramExercises', {
                    name: this.state.name,
                    days: _.range(+this.state.numberOfDays).map((value) => value.toString()),
                    saveProgram: params.saveProgram,
                    editedExercises: params.editedProgram ? this.modifyEditedProgram(false) : null,
                    editedProgram: params.editedProgram ? params.editedProgram : null,
                    editedIndex: params.editedIndex ? params.editedIndex : null
                });
            }
        });
    }
    render() {
        const { name, numberOfDays, weekdays } = this.state;
        return (React.createElement(react_native_keyboard_aware_scroll_view_1.KeyboardAwareScrollView, { contentContainerStyle: styles.container, scrollEnabled: false, extraHeight: 90 },
            React.createElement(react_native_1.StatusBar, { barStyle: "dark-content" }),
            React.createElement(Header_1.default, { navigation: this.props.navigation, colorBorder: colors_1.colors.headerBorderLight, colorHeader: colors_1.colors.headerLight, textColor: colors_1.colors.base, status: enums_1.HeaderStatus.stack, title: "Name and Days", secondaryIcon: "arrow-forward", secondaryText: "Next", secondaryEnabled: this.buttonNextEnabled(), secondaryFunction: () => this.navigateToProgramExercises() }),
            React.createElement(react_native_1.View, { style: styles.containerForm },
                React.createElement(react_native_1.Text, { style: [styles.text, styles.elementsSeparator] }, "Enter a name for the program:"),
                React.createElement(react_native_1.TextInput, { style: [styles.textInput, styles.sectionSeparator, { width: grid_1.grid.unit * 12.5 }], onChangeText: (text) => this.setState({ name: text }), placeholder: 'Type here', value: name }),
                React.createElement(react_native_1.Text, { style: [styles.text, styles.elementsSeparator] }, "Select training days:"),
                React.createElement(react_native_1.View, { style: styles.wrapperDay }, weekdays.map((day, index) => {
                    return (React.createElement(react_native_1.TouchableOpacity, { key: day.name, style: [styles.box, day.training ? styles.dayTrained : styles.dayOff,
                            index === weekdays.length - 1 && styles.sectionSeparator], onPress: () => {
                            let weekdaysCopy = weekdays.slice();
                            weekdaysCopy[index] = { name: day.name, training: !day.training };
                            this.setState({ weekdays: weekdaysCopy });
                        } },
                        React.createElement(react_native_1.Text, { style: styles.text }, day.name)));
                })),
                React.createElement(react_native_1.Text, { style: [styles.text, styles.elementsSeparator] }, "Or enter a number of days trained:"),
                React.createElement(react_native_1.TextInput, { style: [styles.textInput, styles.sectionSeparator, { width: 100 }], onChangeText: (text) => this.setState({ numberOfDays: text }), placeholder: 'Type here', value: numberOfDays, keyboardType: 'numeric' }),
                React.createElement(react_native_1.TouchableOpacity, { style: [styles.buttons, styles.shadow], disabled: !this.buttonNextEnabled(), onPress: () => {
                        if ((numberOfDays !== '' && weekdays.some((elem) => {
                            return elem.training;
                        }))) {
                            this.showActionSheet();
                        }
                        else {
                            this.navigateToProgramExercises();
                        }
                    } },
                    React.createElement(react_native_1.Text, { style: [styles.text, !this.buttonNextEnabled() && styles.textDisabled] }, "Next")))));
    }
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1
    },
    containerForm: {
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontFamily: 'Montserrat-Regular',
        fontSize: grid_1.grid.body,
        color: colors_1.colors.base
    },
    textDisabled: {
        color: colors_1.colors.textDisabled
    },
    textInput: {
        fontSize: grid_1.grid.body,
        padding: grid_1.grid.unit * 0.75,
        fontFamily: grid_1.grid.font,
        color: colors_1.colors.base,
        borderColor: colors_1.colors.base,
        borderWidth: grid_1.grid.heavyBorder,
        borderRadius: grid_1.grid.radiusTextInput
    },
    buttons: {
        justifyContent: 'center',
        alignItems: 'center',
        height: grid_1.grid.unit * 2
    },
    box: {
        backgroundColor: colors_1.colors.white,
        margin: 2,
        borderWidth: grid_1.grid.heavyBorder,
        borderRadius: grid_1.grid.radiusBox,
        overflow: 'hidden',
        alignItems: 'center',
        width: react_native_1.Dimensions.get('window').width / 2.7,
        height: 'auto',
        minHeight: grid_1.grid.unit * 2.5,
        justifyContent: 'center',
        padding: grid_1.grid.unit / 4
    },
    wrapperDay: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    dayTrained: {
        borderColor: colors_1.colors.orange
    },
    dayOff: {
        borderColor: colors_1.colors.base
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
    elementsSeparator: {
        marginBottom: grid_1.grid.unit * 1.25
    },
    sectionSeparator: {
        marginBottom: grid_1.grid.unit * 2.5
    }
});
exports.default = ProgramNameDays;
//# sourceMappingURL=ProgramNameDays.js.map