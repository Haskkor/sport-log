"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const MaterialIcons_1 = require("react-native-vector-icons/MaterialIcons");
const colors_1 = require("../../utils/colors");
const grid_1 = require("../../utils/grid");
class RowSortableList extends React.PureComponent {
    render() {
        return (React.createElement(react_native_1.TouchableOpacity, Object.assign({ underlayColor: colors_1.colors.light, style: styles.container, onPress: () => this.props.action(this.props.data) }, this.props.sortHandlers),
            React.createElement(react_native_1.View, { style: styles.viewContent },
                React.createElement(react_native_1.View, { style: styles.viewIcon },
                    React.createElement(MaterialIcons_1.default, { name: "reorder", size: grid_1.grid.navIcon, color: "rgba(0, 0, 0, 0.5)" })),
                this.props.component)));
    }
}
const styles = react_native_1.StyleSheet.create({
    container: {
        padding: grid_1.grid.unit,
        backgroundColor: colors_1.colors.lightAlternative,
        borderBottomWidth: grid_1.grid.regularBorder,
        borderColor: colors_1.colors.light
    },
    viewContent: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    viewIcon: {
        marginRight: grid_1.grid.unit
    }
});
exports.default = RowSortableList;
//# sourceMappingURL=RowSortableList.js.map