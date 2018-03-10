"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const colors_1 = require("../../utils/colors");
const grid_1 = require("../../utils/grid");
class RowListLog extends React.PureComponent {
    render() {
        const { exercise, muscleGroup, sets, recoveryTime } = this.props.data;
        return (React.createElement(react_native_1.View, null,
            React.createElement(react_native_1.Text, { style: styles.setName }, `${muscleGroup}, ${exercise.name}`),
            React.createElement(react_native_1.Text, { style: styles.textMedium }, `Recovery: ${recoveryTime}`),
            React.createElement(react_native_1.Text, { numberOfLines: 1, style: styles.textContainer },
                React.createElement(react_native_1.Text, { style: styles.textEquipment }, `${exercise.equipment}   `),
                sets.map((set, index) => React.createElement(react_native_1.Text, { key: set.toString() + index, style: styles.set }, `${set.reps} x ${set.weight}kg   `)))));
    }
}
const styles = react_native_1.StyleSheet.create({
    setName: {
        fontFamily: grid_1.grid.fontBold,
        color: colors_1.colors.base
    },
    set: {
        marginRight: grid_1.grid.unit,
        color: colors_1.colors.base
    },
    textContainer: {
        fontFamily: grid_1.grid.font,
        marginRight: grid_1.grid.unit * 2.5
    },
    textEquipment: {
        fontFamily: grid_1.grid.font,
        color: colors_1.colors.primary
    },
    textMedium: {
        fontFamily: grid_1.grid.fontMedium,
        color: colors_1.colors.base
    }
});
exports.default = RowListLog;
//# sourceMappingURL=RowListLog.js.map