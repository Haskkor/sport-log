"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const react_native_easy_grid_1 = require("react-native-easy-grid");
const _ = require("lodash");
const grid_1 = require("../../utils/grid");
const colors_1 = require("../../utils/colors");
class ModalSets extends React.PureComponent {
    componentWillMount() {
        this.setState({ currentReps: this.props.reps, currentWeight: this.props.weight });
    }
    render() {
        const { currentReps, currentWeight } = this.state;
        const { deleteEnabled } = this.props;
        return (React.createElement(react_native_1.View, null,
            React.createElement(react_native_1.Modal, { onRequestClose: () => console.log('close'), visible: true, transparent: true, animationType: "slide" },
                React.createElement(react_native_1.View, { style: styles.container },
                    React.createElement(react_native_1.View, { style: styles.viewOpacity }),
                    React.createElement(react_native_1.View, { style: styles.viewPickers },
                        React.createElement(react_native_1.View, { style: styles.viewButtons },
                            React.createElement(react_native_1.TouchableOpacity, { style: styles.buttonDelete, disabled: !deleteEnabled, onPress: () => {
                                    this.props.updateDeleteSet();
                                    this.props.closeModal();
                                } },
                                React.createElement(react_native_1.Text, { style: deleteEnabled ? styles.textDelete : styles.textDeleteDisabled }, "Delete")),
                            React.createElement(react_native_1.TouchableOpacity, { style: styles.buttonSave, onPress: () => {
                                    this.props.updateDeleteSet(currentReps, currentWeight);
                                    this.props.closeModal();
                                } },
                                React.createElement(react_native_1.Text, { style: styles.textButton }, "Save"))),
                        React.createElement(react_native_easy_grid_1.Grid, { style: styles.grid },
                            React.createElement(react_native_easy_grid_1.Col, { style: { justifyContent: 'center', alignItems: 'center' } },
                                React.createElement(react_native_easy_grid_1.Row, { size: 10 },
                                    React.createElement(react_native_1.Text, { style: styles.textTitle }, "Reps:")),
                                React.createElement(react_native_easy_grid_1.Row, { size: 90 },
                                    React.createElement(react_native_1.Picker, { style: styles.picker, itemStyle: styles.pickerItem, selectedValue: currentReps, onValueChange: (itemValue) => this.setState({ currentReps: itemValue }) }, _.range(1, 30).map((value) => {
                                        return React.createElement(react_native_1.Picker.Item, { key: value, label: value.toString(), value: value });
                                    })))),
                            React.createElement(react_native_easy_grid_1.Col, { style: { justifyContent: 'center', alignItems: 'center' } },
                                React.createElement(react_native_easy_grid_1.Row, { size: 10 },
                                    React.createElement(react_native_1.Text, { style: styles.textTitle }, "Weight:")),
                                React.createElement(react_native_easy_grid_1.Row, { size: 90 },
                                    React.createElement(react_native_1.Picker, { style: styles.picker, itemStyle: styles.pickerItem, selectedValue: currentWeight, onValueChange: (itemValue) => this.setState({ currentWeight: itemValue }) }, _.range(1, 500).map((value) => {
                                        return React.createElement(react_native_1.Picker.Item, { key: value, label: value.toString(), value: value });
                                    }))))))))));
    }
}
const styles = react_native_1.StyleSheet.create({
    picker: {
        width: grid_1.grid.unit * 6,
        height: 'auto'
    },
    container: {
        flex: 1
    },
    viewOpacity: {
        backgroundColor: colors_1.colors.black,
        opacity: grid_1.grid.mediumOpacity,
        flex: 1
    },
    viewPickers: {
        flex: 1,
        backgroundColor: colors_1.colors.lightAlternative
    },
    viewButtons: {
        flexDirection: 'row',
        backgroundColor: colors_1.colors.headerLight,
        height: grid_1.grid.unit * 2.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1
    },
    buttonDelete: {
        position: 'absolute',
        left: grid_1.grid.unit * 1.25
    },
    buttonSave: {
        position: 'absolute',
        right: grid_1.grid.unit * 1.25
    },
    grid: {
        padding: grid_1.grid.unit * 1.25
    },
    textDelete: {
        fontFamily: grid_1.grid.font,
        color: colors_1.colors.alert
    },
    textDeleteDisabled: {
        fontFamily: grid_1.grid.font,
        color: 'rgba(153, 0, 0, 0.5)'
    },
    pickerItem: {
        fontSize: grid_1.grid.body,
        color: colors_1.colors.base
    },
    textButton: {
        fontFamily: grid_1.grid.font,
        color: colors_1.colors.base
    },
    textTitle: {
        fontFamily: grid_1.grid.font,
        color: colors_1.colors.base
    }
});
exports.default = ModalSets;
//# sourceMappingURL=ModalSets.js.map