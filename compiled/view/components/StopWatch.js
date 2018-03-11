"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const Header_1 = require("./Header");
const colors_1 = require("../../utils/colors");
const grid_1 = require("../../utils/grid");
const index_1 = require("../../core/enums/index");
class StopWatch extends React.PureComponent {
    constructor(props) {
        super(props);
        this.oldDifference = 0;
        this.handleStartStop = () => __awaiter(this, void 0, void 0, function* () {
            const { isRunning } = this.state;
            if (isRunning) {
                this.isReset = true;
                clearInterval(this.interval);
                this.setState({ isRunning: false });
            }
            else {
                this.isReset = false;
                if (this.startTimer)
                    this.oldDifference = +this.state.mainTimer - +this.startTimer + this.oldDifference;
                this.startTimer = new Date();
                this.setState({ mainTimer: new Date(), isRunning: true });
                this.interval = setInterval(() => {
                    this.setState({
                        mainTimer: new Date()
                    });
                }, 50);
            }
        });
        this.handleReset = () => {
            this.isReset = false;
            const { isRunning } = this.state;
            if (!isRunning) {
                this.startTimer = null;
                this.oldDifference = 0;
                this.setState({ mainTimer: null });
            }
        };
        this.formatTime = (mainTimer) => {
            if (mainTimer) {
                const diff = +mainTimer - +this.startTimer + this.oldDifference;
                const milliseconds = Math.floor((diff % 1000) / 10);
                const seconds = Math.floor(diff / 1000) % 60;
                const minutes = Math.floor((diff / 1000) / 60);
                if (minutes === 59 && seconds === 59 && milliseconds >= 99) {
                    this.handleStartStop();
                    return '59:59,99';
                }
                return `${minutes < 10 ? '0' : '0'}${minutes}:${seconds < 10 ? '0' : ''}${seconds},${milliseconds < 10 ? '0' : ''}${milliseconds}`;
            }
            return '00:00,00';
        };
        this.handleReset = this.handleReset.bind(this);
        this.handleStartStop = this.handleStartStop.bind(this);
        this.state = {
            isRunning: false,
            mainTimer: null
        };
    }
    componentDidMount() {
        this.isReset = true;
    }
    render() {
        const { isRunning, mainTimer } = this.state;
        const isResetDisabled = !this.isReset;
        return (React.createElement(react_native_1.View, { style: styles.container },
            React.createElement(react_native_1.StatusBar, { barStyle: "light-content" }),
            React.createElement(Header_1.default, { navigation: this.props.navigation, colorBorder: colors_1.colors.headerBorder, colorHeader: colors_1.colors.header, textColor: colors_1.colors.white, status: index_1.HeaderStatus.drawer, title: "Recovery Stopwatch" }),
            React.createElement(react_native_1.View, { style: styles.timer },
                React.createElement(react_native_1.View, { style: styles.timerWrapper },
                    React.createElement(react_native_1.Text, { style: styles.mainTimer }, this.formatTime(mainTimer)))),
            React.createElement(react_native_1.View, { style: styles.buttons },
                React.createElement(react_native_1.View, { style: styles.buttonWrapper },
                    React.createElement(react_native_1.TouchableOpacity, { disabled: isResetDisabled, onPress: this.handleReset, style: [styles.button, isResetDisabled ? styles.resetButtonDisabled : styles.resetButton] },
                        React.createElement(react_native_1.Text, { style: isResetDisabled ? styles.resetButtonTextDisabled : styles.resetButtonText }, "Reset")),
                    React.createElement(react_native_1.TouchableOpacity, { onPress: this.handleStartStop, style: [styles.button, isRunning ? styles.stopButton : styles.startButton] },
                        React.createElement(react_native_1.Text, { style: isRunning ? styles.stopButtonText : styles.startButtonText }, isRunning ? 'Stop' : 'Start'))))));
    }
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors_1.colors.darkBackground
    },
    timerWrapper: {
        justifyContent: 'center',
        alignSelf: 'center',
        flex: 1
    },
    timer: {
        flex: 2
    },
    buttons: {
        flex: 1,
        justifyContent: 'center'
    },
    mainTimer: {
        fontSize: grid_1.grid.timer,
        fontWeight: 'normal',
        alignSelf: 'flex-end',
        color: colors_1.colors.white,
        fontFamily: grid_1.grid.fontTimer
    },
    buttonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: grid_1.grid.unit,
        paddingBottom: grid_1.grid.unit * 2
    },
    button: {
        height: grid_1.grid.unit * 5,
        width: grid_1.grid.unit * 5,
        borderRadius: grid_1.grid.unit * 2.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    startButton: {
        backgroundColor: 'rgba(0, 112, 10, 0.5)'
    },
    startButtonText: {
        fontFamily: grid_1.grid.font,
        color: colors_1.colors.valid
    },
    stopButton: {
        backgroundColor: 'rgba(153, 0, 0, 0.5)'
    },
    stopButtonText: {
        fontFamily: grid_1.grid.font,
        color: colors_1.colors.alert
    },
    resetButton: {
        backgroundColor: 'rgba(179, 179, 179, 0.5)'
    },
    resetButtonText: {
        fontFamily: grid_1.grid.font,
        color: colors_1.colors.white
    },
    resetButtonDisabled: {
        backgroundColor: 'rgba(65, 65, 67, 0.5)'
    },
    resetButtonTextDisabled: {
        fontFamily: grid_1.grid.font,
        color: colors_1.colors.inactiveTintColorTabNav
    }
});
exports.default = StopWatch;
//# sourceMappingURL=StopWatch.js.map