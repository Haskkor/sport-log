"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const colors_1 = require("../../utils/colors");
const grid_1 = require("../../utils/grid");
const MaterialIcons_1 = require("react-native-vector-icons/MaterialIcons");
class RowProgramsList extends React.PureComponent {
    render() {
        const { days, name, active } = this.props.data;
        const exercises = days.map((r) => r.exercises.length).reduce((acc, cur) => acc + cur);
        return (React.createElement(react_native_1.View, { style: styles.rowContainer },
            React.createElement(react_native_1.View, { style: styles.textContainer },
                React.createElement(react_native_1.View, { style: styles.rowContainer },
                    React.createElement(react_native_1.Text, { style: styles.programName }, name),
                    React.createElement(react_native_1.Text, { style: styles.textDays }, ` - ${days.length} day${days.length > 1 ? 's' : ''} program`)),
                React.createElement(react_native_1.Text, { style: styles.textExercises }, `${exercises} exercise${exercises > 1 ? 's' : ''}`)),
            React.createElement(react_native_1.View, { style: styles.iconContainer }, active && React.createElement(MaterialIcons_1.default, { name: "check-circle", size: 20, color: colors_1.colors.valid, style: styles.icon }) ||
                React.createElement(MaterialIcons_1.default, { name: "cancel", size: 20, color: colors_1.colors.base, style: styles.iconDisabled }))));
    }
}
const styles = react_native_1.StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    textContainer: {
        flexDirection: 'column',
        flex: 4
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    programName: {
        fontFamily: grid_1.grid.fontBold,
        color: colors_1.colors.base,
        fontSize: grid_1.grid.body
    },
    textDays: {
        fontFamily: grid_1.grid.font,
        color: colors_1.colors.primary,
        fontSize: grid_1.grid.caption
    },
    textExercises: {
        fontFamily: grid_1.grid.font,
        color: colors_1.colors.base,
        fontSize: grid_1.grid.caption
    },
    icon: {
        marginRight: grid_1.grid.unit / 2
    },
    iconDisabled: {
        marginRight: grid_1.grid.unit / 2,
        opacity: grid_1.grid.lowOpacity
    }
});
exports.default = RowProgramsList;
//# sourceMappingURL=RowProgramsList.js.map