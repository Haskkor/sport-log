"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_navigation_1 = require("react-navigation");
const TabNavRecovery_1 = require("./TabNavRecovery");
const QuickLog_1 = require("../components/QuickLog");
const ProgramsStackNav_1 = require("./ProgramsStackNav");
const MainDrawerNav = react_navigation_1.DrawerNavigator({
    Home: {
        drawerLabel: 'Programs',
        screen: ProgramsStackNav_1.default
    },
    QuickLog: {
        drawerLabel: 'Quick log',
        screen: QuickLog_1.default
    },
    Programs: {
        drawerLabel: 'Programs',
        screen: ProgramsStackNav_1.default
    },
    Recovery: {
        drawerLabel: 'Recovery',
        screen: TabNavRecovery_1.default
    }
});
exports.default = MainDrawerNav;
//# sourceMappingURL=MainDrawerNav.js.map