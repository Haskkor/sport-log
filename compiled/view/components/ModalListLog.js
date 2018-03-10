"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const SortableListView = require("react-native-sortable-listview");
const RowListLog_1 = require("./RowListLog");
const loDash = require("lodash");
const colors_1 = require("../../utils/colors");
const grid_1 = require("../../utils/grid");
const RowSortableList_1 = require("./RowSortableList");
class ModalListLog extends React.PureComponent {
    constructor() {
        super();
        this.showActionSheet = this.showActionSheet.bind(this);
    }
    showActionSheet(data) {
        react_native_1.ActionSheetIOS.showActionSheetWithOptions({
            title: data.exercise.name,
            message: data.exercise.equipment,
            options: ['Edit', 'Delete', 'Cancel'],
            destructiveButtonIndex: 1,
            cancelButtonIndex: 2
        }, (buttonIndex) => {
            const indexRow = loDash.findIndex(this.props.dataLog, (row) => {
                return row === data;
            });
            if (buttonIndex === 0) {
                this.props.editExercise(indexRow);
            }
            else if (buttonIndex === 1) {
                let dataLogCopy = this.props.dataLog.slice();
                dataLogCopy.splice(indexRow, 1);
                this.props.deleteExercise(dataLogCopy);
            }
        });
    }
    render() {
        const { order, closeModal, dataLog } = this.props;
        return (React.createElement(react_native_1.View, { style: styles.container },
            React.createElement(react_native_1.Modal, { onRequestClose: () => console.log('close'), visible: true, animationType: "slide" },
                React.createElement(react_native_1.View, { style: styles.viewButtons },
                    React.createElement(react_native_1.TouchableOpacity, { style: styles.buttonDismiss, onPress: () => closeModal() },
                        React.createElement(react_native_1.Text, { style: styles.textButton }, "Dismiss"))),
                React.createElement(SortableListView, { style: styles.sortableList, data: dataLog, order: order, onRowMoved: (e) => {
                        order.splice(e.to, 0, order.splice(e.from, 1)[0]);
                        this.forceUpdate();
                    }, renderRow: (row) => row &&
                        React.createElement(RowSortableList_1.default, { data: row, action: this.showActionSheet, component: React.createElement(RowListLog_1.default, { data: row }) }) ||
                        React.createElement(react_native_1.View, null) }))));
    }
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors_1.colors.lightAlternative
    },
    viewButtons: {
        borderBottomWidth: grid_1.grid.smallBorder,
        borderColor: colors_1.colors.base,
        paddingTop: grid_1.grid.unit * 2,
        paddingBottom: grid_1.grid.unit * 1.25,
        backgroundColor: colors_1.colors.headerLight
    },
    buttonDismiss: {
        alignSelf: 'flex-end',
        marginRight: grid_1.grid.unit * 1.25
    },
    textButton: {
        fontFamily: grid_1.grid.fontBold,
        color: colors_1.colors.base
    },
    sortableList: {
        flex: 1
    }
});
exports.default = ModalListLog;
//# sourceMappingURL=ModalListLog.js.map