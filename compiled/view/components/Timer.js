"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const _ = require("lodash");
const Header_1 = require("./Header");
const colors_1 = require("../../utils/colors");
const grid_1 = require("../../utils/grid");
const _1 = require("../../core/enums/");
class Timer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleStartStop = (endTimer) => {
            const { isRunning, selectedSecond, selectedMinute } = this.state;
            if (selectedMinute === 0 && selectedSecond === 0)
                return;
            if (isRunning) {
                if (!endTimer)
                    this.isReset = true;
                clearInterval(this.interval);
                this.setState({ isRunning: false });
            }
            else {
                this.isReset = false;
                if (this.state.totalTime === null)
                    this.setState({ totalTime: selectedMinute * 60 + selectedSecond });
                this.setState({ isRunning: true });
                this.interval = setInterval(() => {
                    this.setState({ totalTime: this.state.totalTime - 1 });
                }, 1000);
            }
        };
        this.handleReset = () => {
            this.isReset = false;
            const { isRunning } = this.state;
            if (!isRunning) {
                this.setState({ totalTime: null });
            }
        };
        this.formatTime = (totalTime) => {
            if (totalTime > 0) {
                const seconds = totalTime % 60;
                const minutes = Math.floor(totalTime / 60);
                if (minutes === 0 && seconds === 0) {
                    this.handleStartStop(false);
                    return '00:00';
                }
                return `${minutes < 10 ? '0' : '0'}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }
            this.handleStartStop(true);
            return '00:00';
        };
        this.handleReset = this.handleReset.bind(this);
        this.handleStartStop = this.handleStartStop.bind(this);
        this.state = {
            isRunning: false,
            selectedMinute: 1,
            selectedSecond: 30,
            totalTime: null
        };
    }
    componentDidMount() {
        this.isReset = false;
    }
    render() {
        const { isRunning, selectedMinute, selectedSecond, totalTime } = this.state;
        const isResetDisabled = !this.isReset;
        return (React.createElement(react_native_1.View, { style: styles.container },
            React.createElement(react_native_1.StatusBar, { barStyle: "light-content" }),
            React.createElement(Header_1.default, { navigation: this.props.navigation, colorBorder: colors_1.colors.headerBorder, colorHeader: colors_1.colors.header, status: _1.HeaderStatus.drawer, textColor: colors_1.colors.white, title: "Recovery Timer" }),
            React.createElement(react_native_1.View, { style: styles.timer }, (isRunning || this.state.totalTime > 0) &&
                React.createElement(react_native_1.View, { style: styles.timerWrapper },
                    React.createElement(react_native_1.Text, { style: styles.mainTimer }, this.formatTime(totalTime))) ||
                React.createElement(react_native_1.View, { style: styles.pickerWrapper },
                    React.createElement(react_native_1.View, { style: styles.pickerMinutes },
                        React.createElement(react_native_1.Picker, { style: styles.picker, selectedValue: selectedMinute, onValueChange: (itemValue) => this.setState({ selectedMinute: itemValue }) }, _.range(10).map((value) => {
                            return React.createElement(react_native_1.Picker.Item, { color: colors_1.colors.white, key: value, label: value.toString(), value: value });
                        })),
                        React.createElement(react_native_1.Text, { style: styles.resetButtonText }, "minutes")),
                    React.createElement(react_native_1.View, { style: styles.pickerSeconds },
                        React.createElement(react_native_1.Picker, { style: styles.picker, selectedValue: selectedSecond, onValueChange: (itemValue) => this.setState({ selectedSecond: itemValue }) }, _.range(0, 60, 5).map((value) => {
                            return React.createElement(react_native_1.Picker.Item, { color: colors_1.colors.white, key: value, label: value.toString(), value: value });
                        })),
                        React.createElement(react_native_1.Text, { style: styles.resetButtonText }, "seconds")))),
            React.createElement(react_native_1.View, { style: styles.buttons },
                React.createElement(react_native_1.View, { style: styles.buttonWrapper },
                    React.createElement(react_native_1.TouchableOpacity, { disabled: isResetDisabled, onPress: this.handleReset, style: [styles.button, isResetDisabled ? styles.resetButtonDisabled : styles.resetButton] },
                        React.createElement(react_native_1.Text, { style: isResetDisabled ? styles.resetButtonTextDisabled : styles.resetButtonText }, "Reset")),
                    React.createElement(react_native_1.TouchableOpacity, { onPress: () => this.handleStartStop(false), style: [styles.button, isRunning ? styles.stopButton : styles.startButton] },
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
    },
    pickerWrapper: {
        flex: 1,
        flexDirection: 'row'
    },
    pickerMinutes: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        alignSelf: 'center'
    },
    pickerSeconds: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        alignSelf: 'center'
    },
    picker: {
        width: grid_1.grid.unit * 2.5
    }
});
exports.default = Timer;
//# sourceMappingURL=Timer.js.map