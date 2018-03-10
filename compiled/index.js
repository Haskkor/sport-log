"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='./interfaces/index.d.ts'/>
require("regenerator-runtime/runtime");
const React = require("react");
const react_native_1 = require("react-native");
const create_1 = require("./core/create");
const react_redux_1 = require("react-redux");
const App_1 = require("./view/navigators/App");
exports.store = create_1.default();
console.disableYellowBox = true; // any is a hack
class OnBoardingApp extends React.Component {
    render() {
        return (React.createElement(react_redux_1.Provider, { store: exports.store, key: "provider" },
            React.createElement(App_1.default, null)));
    }
}
react_native_1.AppRegistry.registerComponent('OnBoardingApp', () => OnBoardingApp);
//# sourceMappingURL=index.js.map