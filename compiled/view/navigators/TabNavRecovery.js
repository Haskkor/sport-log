"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_navigation_1 = require("react-navigation");
const StopWatch_1 = require("../components/StopWatch");
const Timer_1 = require("../components/Timer");
const grid_1 = require("../../utils/grid");
const colors_1 = require("../../utils/colors");
const TabNavRecovery = react_navigation_1.TabNavigator({
    Stopwatch: {
        screen: StopWatch_1.default
    },
    Timer: {
        screen: Timer_1.default
    }
}, {
    tabBarPosition: 'bottom',
    tabBarOptions: {
        activeBackgroundColor: colors_1.colors.activeBackgroundTabNav,
        inactiveBackgroundColor: colors_1.colors.inactiveBackgroundTabNav,
        activeTintColor: colors_1.colors.white,
        inactiveTintColor: colors_1.colors.inactiveTintColorTabNav,
        style: {
            borderTopWidth: 0,
            height: grid_1.grid.unit * 2.5
        },
        labelStyle: {
            marginBottom: grid_1.grid.unit
        }
    }
});
exports.default = TabNavRecovery;
//# sourceMappingURL=TabNavRecovery.js.map