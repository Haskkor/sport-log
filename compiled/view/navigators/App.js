"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const MainDrawerNav_1 = require("./MainDrawerNav");
/// <reference path='../../interfaces/index.d.ts'/>
require("regenerator-runtime/runtime");
const expo_1 = require("expo");
const react_native_2 = require("react-native");
const create_1 = require("../../core/create");
const react_redux_1 = require("react-redux");
exports.store = create_1.default();
class App extends React.PureComponent {
    componentDidMount() {
        expo_1.Font.loadAsync({
            'Montserrat-Regular': require('../../../assets/fonts/Montserrat-Regular.ttf'),
            'Montserrat-Bold': require('../../../assets/fonts/Montserrat-Bold.ttf'),
            'Montserrat-Light': require('../../../assets/fonts/Montserrat-Light.ttf'),
            'Montserrat-Medium': require('../../../assets/fonts/Montserrat-Medium.ttf'),
            'courier': require('../../../assets/fonts/courier.ttf')
        });
    }
    render() {
        return (React.createElement(react_redux_1.Provider, { store: exports.store, key: "provider" },
            React.createElement(react_native_1.View, { style: styles.container },
                React.createElement(react_native_1.StatusBar, { barStyle: "light-content" }),
                React.createElement(MainDrawerNav_1.default, null))));
    }
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1
    }
});
exports.default = App;
react_native_2.AppRegistry.registerComponent('OnBoardingApp', () => App);
//# sourceMappingURL=App.js.map