"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const MaterialIcons_1 = require("react-native-vector-icons/MaterialIcons");
const grid_1 = require("../../utils/grid");
const colors_1 = require("../../utils/colors");
class HeaderStackNavigator extends React.PureComponent {
}
HeaderStackNavigator.navigationOptions = ({ navigation }) => {
    return {
        title: navigation.state.params.title,
        headerLeft: React.createElement(react_native_1.TouchableOpacity, { style: styles.container, onPress: () => {
                navigation.goBack();
            } },
            React.createElement(MaterialIcons_1.default, { name: "arrow-back", size: grid_1.grid.navIcon, color: colors_1.colors.base, style: styles.icon }),
            React.createElement(react_native_1.Text, { style: styles.text }, "Back")),
        headerRight: navigation.state.params.rightButtonText &&
            React.createElement(react_native_1.TouchableHighlight, { disabled: !navigation.state.params.rightButtonEnabled, style: navigation.state.params.rightButtonEnabled ? styles.container : styles.containerDisabled, onPress: () => navigation.state.params.rightButtonFunction() },
                React.createElement(react_native_1.Text, { style: styles.text }, navigation.state.params.rightButtonText),
                React.createElement(MaterialIcons_1.default, { name: navigation.state.params.rightButtonIcon, size: grid_1.grid.navIcon, color: colors_1.colors.base, style: styles.iconRight })),
        headerStyle: {
            height: grid_1.grid.unit * 3.25,
            backgroundColor: colors_1.colors.light,
            paddingLeft: grid_1.grid.unit,
            paddingRight: grid_1.grid.unit,
            borderBottomColor: colors_1.colors.base,
            borderBottomWidth: grid_1.grid.smallBorder
        },
        headerTitleStyle: {
            fontFamily: grid_1.grid.fontBold,
            fontSize: grid_1.grid.body,
            color: colors_1.colors.base
        }
    };
};
exports.default = HeaderStackNavigator;
const styles = react_native_1.StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        opacity: 1
    },
    containerDisabled: {
        flexDirection: 'row',
        alignItems: 'center',
        opacity: grid_1.grid.lowOpacity
    },
    text: {
        fontSize: grid_1.grid.caption,
        fontFamily: grid_1.grid.fontBold,
        color: colors_1.colors.base
    },
    icon: {
        paddingRight: grid_1.grid.unit
    },
    iconRight: {
        paddingLeft: grid_1.grid.unit
    }
});
//# sourceMappingURL=HeaderStackNavigator.js.map