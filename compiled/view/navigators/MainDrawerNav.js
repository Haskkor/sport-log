"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_navigation_1 = require("react-navigation");
const TabNavRecovery_1 = require("./TabNavRecovery");
const QuickLog_1 = require("../components/QuickLog");
const ProgramsStackNav_1 = require("./ProgramsStackNav");
const Calendar_1 = require("../components/Calendar");
const MainDrawerNav = react_navigation_1.DrawerNavigator({
    Home: {
        screen: ProgramsStackNav_1.default
    },
    Calendar: {
        screen: Calendar_1.default
    },
    QuickLog: {
        screen: QuickLog_1.default
    },
    Programs: {
        screen: ProgramsStackNav_1.default
    },
    Recovery: {
        screen: TabNavRecovery_1.default
    }
});
exports.default = MainDrawerNav;
//# sourceMappingURL=MainDrawerNav.js.map