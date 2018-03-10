"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const helper_1 = require("../../utils/helper");
const grid_1 = require("../../utils/grid");
const colors_1 = require("../../utils/colors");
class ModalRecovery extends React.PureComponent {
    constructor() {
        super();
        this.state = { currentRecovery: helper_1.buildRecoveryTimes()[0] };
    }
    render() {
        const { currentRecovery } = this.state;
        return (React.createElement(react_native_1.View, null,
            React.createElement(react_native_1.Modal, { onRequestClose: () => console.log('close'), visible: true, transparent: true, animationType: "slide" },
                React.createElement(react_native_1.View, { style: styles.container },
                    React.createElement(react_native_1.View, { style: styles.viewOpacity }),
                    React.createElement(react_native_1.View, { style: styles.viewModal },
                        React.createElement(react_native_1.View, { style: styles.viewButtons },
                            React.createElement(react_native_1.TouchableOpacity, { style: styles.buttonSave, onPress: () => {
                                    this.props.updateRecovery(currentRecovery);
                                } },
                                React.createElement(react_native_1.Text, { style: styles.textButton }, "Save"))),
                        React.createElement(react_native_1.View, { style: styles.viewPicker },
                            React.createElement(react_native_1.Picker, { style: styles.picker, itemStyle: styles.pickerItem, selectedValue: currentRecovery, onValueChange: (itemValue) => this.setState({ currentRecovery: itemValue }) }, helper_1.buildRecoveryTimes().map((value) => {
                                return React.createElement(react_native_1.Picker.Item, { key: value, label: value.toString(), value: value });
                            }))))))));
    }
}
const styles = react_native_1.StyleSheet.create({
    picker: {
        width: grid_1.grid.unit * 12.5,
        height: 'auto',
        marginBottom: grid_1.grid.unit * 5
    },
    container: {
        flex: 1
    },
    viewOpacity: {
        backgroundColor: colors_1.colors.base,
        opacity: grid_1.grid.lowOpacity,
        flex: 2
    },
    viewModal: {
        flex: 1,
        backgroundColor: colors_1.colors.lightAlternative
    },
    viewButtons: {
        flexDirection: 'row',
        backgroundColor: colors_1.colors.headerLight,
        height: grid_1.grid.unit * 2.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1
    },
    buttonSave: {
        position: 'absolute',
        right: grid_1.grid.unit * 1.25
    },
    pickerItem: {
        fontSize: grid_1.grid.subHeader,
        fontFamily: grid_1.grid.font,
        color: colors_1.colors.base
    },
    viewPicker: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    textButton: {
        fontFamily: grid_1.grid.font,
        color: colors_1.colors.base
    }
});
exports.default = ModalRecovery;
//# sourceMappingURL=ModalRecovery.js.map