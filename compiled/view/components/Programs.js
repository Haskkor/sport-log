"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const Header_1 = require("./Header");
const SortableListView = require("react-native-sortable-listview");
const MaterialIcons_1 = require("react-native-vector-icons/MaterialIcons");
const LottieView = require("lottie-react-native");
const grid_1 = require("../../utils/grid");
const colors_1 = require("../../utils/colors");
const enums_1 = require("../../core/enums");
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const ProgramsActions = require("../../core/modules/entities/programs");
const RowSortableList_1 = require("./RowSortableList");
const RowProgramsList_1 = require("./RowProgramsList");
const loDash = require("lodash");
const Animate_1 = require("react-move/Animate");
const d3_ease_1 = require("d3-ease");
class Programs extends React.PureComponent {
    constructor() {
        super();
        this.showAlertNoActiveProgram = (props) => {
            const programActive = props.programs.map((pg) => pg.active)
                .some((act) => act);
            this.setState({ showNoActiveProgramAlert: !programActive });
        };
        this.saveProgram = (program, name) => {
            const newProgram = {
                days: program,
                active: false,
                name: name
            };
            this.props.setPrograms({ program: newProgram });
        };
        this.showActionSheet = (data) => {
            const { programs, editProgram, deleteProgram } = this.props;
            react_native_1.ActionSheetIOS.showActionSheetWithOptions({
                title: data.name,
                options: [data.active ? 'Set inactive' : 'Set active', 'Edit', 'Delete', 'Cancel'],
                destructiveButtonIndex: 2,
                cancelButtonIndex: 3
            }, (buttonIndex) => {
                const indexRow = loDash.findIndex(programs, (row) => {
                    return row === data;
                });
                if (buttonIndex === 0) {
                    const pgAct = programs.find((pg) => pg.active);
                    if (pgAct)
                        editProgram({ index: indexRow, program: { active: false, days: pgAct.days, name: pgAct.name } });
                    editProgram({ index: indexRow, program: { active: !data.active, days: data.days, name: data.name } });
                }
                else if (buttonIndex === 1) {
                    this.props.navigation.navigate('ProgramNameDays', {
                        saveProgram: editProgram,
                        editedProgram: data,
                        editedIndex: indexRow
                    });
                }
                else if (buttonIndex === 2) {
                    deleteProgram({ index: indexRow });
                }
            });
        };
        this.state = { progressAnimation: new react_native_1.Animated.Value(0), showNoActiveProgramAlert: false };
        this.saveProgram = this.saveProgram.bind(this);
        this.showActionSheet = this.showActionSheet.bind(this);
        this.showAlertNoActiveProgram = this.showAlertNoActiveProgram.bind(this);
    }
    componentDidMount() {
        this.order = Object.keys(this.props.programs);
        if (this.props.programs.length === 0)
            this.animation.play();
        this.showAlertNoActiveProgram(this.props);
    }
    componentDidUpdate() {
        this.order = Object.keys(this.props.programs);
        if (this.props.programs.length === 0)
            this.animation.play();
    }
    componentWillUpdate(nextProps) {
        this.showAlertNoActiveProgram(nextProps);
    }
    render() {
        const { progressAnimation, showNoActiveProgramAlert } = this.state;
        const { programs } = this.props;
        return (React.createElement(react_native_1.View, { style: styles.container },
            React.createElement(react_native_1.StatusBar, { barStyle: "dark-content" }),
            React.createElement(Header_1.default, { navigation: this.props.navigation, colorBorder: colors_1.colors.headerBorderLight, colorHeader: colors_1.colors.headerLight, textColor: colors_1.colors.base, status: enums_1.HeaderStatus.drawer, title: "Programs", secondaryIcon: "add", secondaryEnabled: true, secondaryFunction: () => this.props.navigation.navigate('ProgramNameDays', { saveProgram: this.saveProgram }) }),
            React.createElement(Animate_1.default, { show: showNoActiveProgramAlert && programs.length > 0, start: {
                    opacityView: 0,
                    height: 0
                }, enter: {
                    height: [30],
                    opacityView: [grid_1.grid.highOpacity],
                    timing: { duration: 400, ease: d3_ease_1.easeQuadOut }
                }, leave: {
                    height: [0],
                    opacityView: [0],
                    timing: { duration: 400, ease: d3_ease_1.easeQuadOut }
                } }, (state) => {
                return (React.createElement(react_native_1.View, { style: {
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors_1.colors.orange,
                        opacity: state.opacityView,
                        height: state.height,
                        overflow: 'hidden'
                    } },
                    React.createElement(MaterialIcons_1.default, { name: "warning", size: grid_1.grid.navIcon, color: colors_1.colors.white, style: { marginRight: grid_1.grid.unit / 2 } }),
                    React.createElement(react_native_1.Text, { style: { fontFamily: grid_1.grid.font, fontSize: 14, color: colors_1.colors.white } }, "Please select an active program")));
            }),
            programs.length > 0 &&
                React.createElement(SortableListView, { style: styles.sortableList, data: programs, order: this.order, onRowMoved: (e) => {
                        this.order.splice(e.to, 0, this.order.splice(e.from, 1)[0]);
                        this.forceUpdate();
                    }, renderRow: (row) => row &&
                        React.createElement(RowSortableList_1.default, { data: row, action: this.showActionSheet, component: React.createElement(RowProgramsList_1.default, { data: row }) }) ||
                        React.createElement(react_native_1.View, null) }) ||
                React.createElement(react_native_1.View, { style: styles.viewNoPrograms },
                    React.createElement(react_native_1.View, { style: styles.viewTextNoProgram },
                        React.createElement(MaterialIcons_1.default, { name: "error-outline", size: 26, color: colors_1.colors.base, style: styles.iconNoProgram }),
                        React.createElement(react_native_1.Text, { style: styles.textNoProgram }, "You have no programs created yet")),
                    React.createElement(react_native_1.View, { style: styles.viewAnimationNoProgram },
                        React.createElement(react_native_1.TouchableOpacity, { onPress: () => this.props.navigation.navigate('ProgramNameDays', { saveProgram: this.saveProgram }) },
                            React.createElement(LottieView, { ref: (ref) => this.animation = ref, loop: true, speed: 0.6, style: styles.animation, progress: progressAnimation, source: require('../../../assets/lottie/add_button.json') }))))));
    }
}
const mapStateToProps = (rootState) => {
    return {
        programs: rootState.entities.programs
    };
};
const mapDispatchToProps = (dispatch) => redux_1.bindActionCreators({
    setPrograms: ProgramsActions.setPrograms,
    editProgram: ProgramsActions.editProgram,
    deleteProgram: ProgramsActions.deleteProgram
}, dispatch);
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(Programs);
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1
    },
    sortableList: {
        flex: 1
    },
    viewNoPrograms: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    iconNoProgram: {
        marginRight: grid_1.grid.unit * 1.5
    },
    viewTextNoProgram: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textNoProgram: {
        color: colors_1.colors.base
    },
    viewAnimationNoProgram: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: grid_1.grid.unit * 2.5
    },
    rowList: {
        padding: grid_1.grid.unit,
        backgroundColor: colors_1.colors.lightAlternative,
        borderBottomWidth: grid_1.grid.regularBorder,
        borderColor: colors_1.colors.light
    },
    animation: {
        width: grid_1.grid.unit * 3,
        height: grid_1.grid.unit * 3
    }
});
//# sourceMappingURL=Programs.js.map