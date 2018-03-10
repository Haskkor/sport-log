"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const MaterialIcons_1 = require("react-native-vector-icons/MaterialIcons");
const grid_1 = require("../../utils/grid");
const colors_1 = require("../../utils/colors");
const enums_1 = require("../../core/enums");
class Header extends React.PureComponent {
    render() {
        const { navigation, textColor, colorBorder, colorHeader, title, secondaryFunction, secondaryIcon, status, secondaryText, secondaryEnabled } = this.props;
        return (React.createElement(react_native_1.View, { style: [styles.header, { borderColor: colorBorder, backgroundColor: colorHeader }] },
            React.createElement(react_native_1.View, { style: [styles.viewSemiFlex, styles.primaryIconView] }, status === enums_1.HeaderStatus.drawer &&
                React.createElement(react_native_1.TouchableOpacity, { onPress: () => navigation.navigate('DrawerOpen') },
                    React.createElement(MaterialIcons_1.default, { name: "fitness-center", size: grid_1.grid.navIcon, color: textColor })) || status === enums_1.HeaderStatus.stack &&
                React.createElement(react_native_1.TouchableOpacity, { style: styles.containerButtonBack, onPress: () => navigation.goBack() },
                    React.createElement(MaterialIcons_1.default, { name: "arrow-back", size: grid_1.grid.navIcon, color: colors_1.colors.base, style: styles.icon }),
                    React.createElement(react_native_1.Text, { style: styles.text }, "Back"))),
            React.createElement(react_native_1.View, { style: styles.viewFlex },
                React.createElement(react_native_1.Text, { style: [styles.title, { color: textColor }] }, title)),
            React.createElement(react_native_1.View, { style: [styles.viewSemiFlex, styles.secondaryIconView, { opacity: !secondaryEnabled ? grid_1.grid.lowOpacity : 1 }] }, secondaryIcon &&
                React.createElement(react_native_1.TouchableOpacity, { onPress: () => secondaryFunction(), disabled: !secondaryEnabled, style: styles.containerButtonBack },
                    secondaryText && React.createElement(react_native_1.Text, { style: styles.text }, secondaryText),
                    React.createElement(MaterialIcons_1.default, { name: secondaryIcon, style: styles.iconRight, size: grid_1.grid.navIcon, color: textColor })))));
    }
}
exports.default = Header;
const styles = react_native_1.StyleSheet.create({
    header: {
        borderBottomWidth: grid_1.grid.smallBorder,
        paddingTop: grid_1.grid.unit * 2,
        paddingBottom: grid_1.grid.unit,
        flexDirection: 'row'
    },
    title: {
        color: colors_1.colors.base,
        alignSelf: 'center'
    },
    pickerItem: {
        fontSize: grid_1.grid.subHeader
    },
    viewFlex: {
        flex: 1
    },
    viewSemiFlex: {
        flex: 0.5
    },
    primaryIconView: {
        marginLeft: grid_1.grid.unit * 1.25,
        alignItems: 'flex-start'
    },
    secondaryIconView: {
        marginRight: grid_1.grid.unit * 1.25,
        alignItems: 'flex-end'
    },
    containerButtonBack: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerButtonRight: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        fontSize: grid_1.grid.caption,
        color: colors_1.colors.base
    },
    icon: {
        paddingRight: grid_1.grid.unit
    },
    iconRight: {
        paddingLeft: grid_1.grid.unit
    }
});
//# sourceMappingURL=Header.js.map