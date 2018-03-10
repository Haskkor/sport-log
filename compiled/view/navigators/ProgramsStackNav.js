"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_navigation_1 = require("react-navigation");
const Programs_1 = require("../components/Programs");
const ProgramNameDays_1 = require("../components/ProgramNameDays");
const ProgramExercises_1 = require("../components/ProgramExercises");
const colors_1 = require("../../utils/colors");
const QuickLog_1 = require("../components/QuickLog");
const ProgramsStackNav = react_navigation_1.StackNavigator({
    Home: {
        screen: Programs_1.default,
        navigationOptions: ({ navigation }) => ({ header: null })
    },
    ProgramNameDays: {
        screen: ProgramNameDays_1.default,
        navigationOptions: ({ navigation }) => ({ header: null })
    },
    ProgramExercises: {
        screen: ProgramExercises_1.default,
        navigationOptions: ({ navigation }) => ({ header: null })
    },
    ProgramEditExercise: {
        screen: QuickLog_1.default,
        navigationOptions: ({ navigation }) => ({ header: null })
    }
}, {
    cardStyle: {
        backgroundColor: colors_1.colors.white
    }
});
exports.default = ProgramsStackNav;
//# sourceMappingURL=ProgramsStackNav.js.map