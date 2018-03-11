"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const MaterialIcons_1 = require("react-native-vector-icons/MaterialIcons");
const enums_1 = require("../../core/enums");
const Animate_1 = require("react-move/Animate");
const d3_ease_1 = require("d3-ease");
const grid_1 = require("../../utils/grid");
const colors_1 = require("../../utils/colors");
class Toaster extends React.PureComponent {
    constructor(props) {
        super(props);
        this.feedbackTimer = () => {
            this.timer = setTimeout(() => {
                this.setInactive();
            }, 4000);
        };
        this.setInactive = () => {
            this.setState({ active: false });
            setTimeout(() => {
                this.props.stopToaster(this.props.status);
                clearTimeout(this.timer);
            }, 400);
        };
        this.feedbackTimer = this.feedbackTimer.bind(this);
        this.setInactive = this.setInactive.bind(this);
        this.state = { active: true };
    }
    componentDidMount() {
        this.feedbackTimer();
    }
    render() {
        const { text, status } = this.props;
        return (React.createElement(react_native_1.View, { style: styles.feedbackLogView },
            React.createElement(Animate_1.default, { show: this.state.active, start: {
                    opacityView: 0,
                    opacityText: 0,
                    translate: grid_1.grid.unit * 4
                }, enter: [{
                        opacityView: [grid_1.grid.highOpacity],
                        opacityText: [1],
                        translate: [0],
                        timing: { duration: 400, ease: d3_ease_1.easeQuadOut }
                    }], leave: {
                    opacityView: [0],
                    opacityText: [0],
                    translate: [grid_1.grid.unit * 4],
                    timing: { duration: 400, ease: d3_ease_1.easeQuadOut }
                } }, (state) => {
                return React.createElement(react_native_1.View, { style: [styles.feedbackLog, status === enums_1.ToasterInfo.info ? styles.feedbackInfo : styles.feedbackWarning,
                        { opacity: state.opacityView, left: state.translate }] },
                    React.createElement(react_native_1.TouchableOpacity, { style: styles.feedbackButton, onPress: () => {
                            this.setInactive();
                        } },
                        React.createElement(MaterialIcons_1.default, { name: "close", size: grid_1.grid.navIcon, color: colors_1.colors.white, style: { opacity: state.opacityText } })),
                    React.createElement(react_native_1.Text, { style: [styles.feedbackText, { opacity: state.opacityText }] }, text));
            })));
    }
}
const styles = react_native_1.StyleSheet.create({
    feedbackLogView: {
        position: 'absolute',
        top: grid_1.grid.unit * 5,
        right: grid_1.grid.unit
    },
    feedbackLog: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 10
    },
    feedbackInfo: {
        backgroundColor: 'rgba(0, 183, 0, 0.5)'
    },
    feedbackWarning: {
        backgroundColor: 'rgba(255, 204, 0, 0.5)'
    },
    feedbackButton: {
        marginRight: grid_1.grid.unit * 0.75
    },
    feedbackText: {
        fontFamily: grid_1.grid.font,
        color: colors_1.colors.white
    }
});
exports.default = Toaster;
//# sourceMappingURL=Toaster.js.map