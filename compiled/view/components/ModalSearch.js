"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const react_native_search_list_1 = require("@unpourtous/react-native-search-list");
const grid_1 = require("../../utils/grid");
const colors_1 = require("../../utils/colors");
class ModalSearch extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { dataSource: [] };
    }
    componentDidMount() {
        const dataSource = this.props.exercises.map((m) => m.exercises.map((e) => {
            return {
                searchStr: `${e.name} (${e.equipment}) - ${m.muscle}`,
                exercise: e.name,
                muscle: m.muscle,
                equipment: e.equipment
            };
        }));
        this.setState({ dataSource: [].concat.apply([], dataSource) });
    }
    renderRow(item, rowID) {
        return (React.createElement(react_native_1.View, { key: rowID, style: styles.row },
            React.createElement(react_native_1.TouchableOpacity, { onPress: () => this.props.selectExercise(item.exercise, item.muscle, item.equipment) },
                React.createElement(react_native_1.Text, { style: styles.itemListText }, item.searchStr))));
    }
    renderSectionHeader(sectionData, sectionID) {
        if (!sectionID) {
            return (React.createElement(react_native_1.View, null));
        }
        else {
            return (React.createElement(react_native_1.View, { key: sectionData, style: styles.sectionHeader },
                React.createElement(react_native_1.Text, { style: styles.sectionTitle }, sectionID)));
        }
    }
    emptyContent(searchStr) {
        return (React.createElement(react_native_1.View, { style: styles.emptyContentView },
            React.createElement(react_native_1.Text, { style: styles.emptyContentText },
                " No result for ",
                React.createElement(react_native_1.Text, { style: styles.emptyContentTextBold }, searchStr)),
            React.createElement(react_native_1.Text, { style: styles.emptyContentSearchAgain }, "Please search again")));
    }
    render() {
        return (React.createElement(react_native_1.View, { style: styles.searchListView },
            React.createElement(react_native_1.StatusBar, { barStyle: "light-content" }),
            React.createElement(react_native_1.Modal, { onRequestClose: () => console.log('close'), visible: true, transparent: true, animationType: "slide" },
                React.createElement(react_native_search_list_1.default, { data: this.state.dataSource, renderRow: this.renderRow.bind(this), emptyContent: this.emptyContent.bind(this), renderSectionHeader: this.renderSectionHeader.bind(this), cellHeight: grid_1.grid.unit * 2.5, title: "Search List", searchPlaceHolder: "Search", customSearchBarStyle: { fontSize: grid_1.grid.body }, onClickBack: () => {
                        this.props.closeModal(true);
                    }, leftButtonStyle: { justifyContent: 'flex-start' }, backIconStyle: { width: 8.5, height: 17 }, activeSearchBarColor: colors_1.colors.white, showActiveSearchIcon: true, searchBarActiveColor: "#171A23" }))));
    }
}
const styles = react_native_1.StyleSheet.create({
    searchListView: {
        flex: 1,
        backgroundColor: colors_1.colors.lightAlternative,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    row: {
        flex: 1,
        marginLeft: grid_1.grid.unit * 2.5,
        height: grid_1.grid.unit * 2.5,
        justifyContent: 'center'
    },
    emptyContentView: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginTop: grid_1.grid.unit * 3
    },
    emptyContentText: {
        fontFamily: grid_1.grid.font,
        color: colors_1.colors.inactiveTintColorTabNav,
        fontSize: grid_1.grid.subHeader,
        paddingTop: grid_1.grid.unit * 1.25
    },
    emptyContentTextBold: {
        fontFamily: grid_1.grid.fontBold,
        color: colors_1.colors.base,
        fontSize: grid_1.grid.subHeader
    },
    emptyContentSearchAgain: {
        fontFamily: grid_1.grid.font,
        color: colors_1.colors.inactiveTintColorTabNav,
        fontSize: grid_1.grid.subHeader,
        alignItems: 'center',
        paddingTop: grid_1.grid.unit * 1.25
    },
    itemListText: {
        fontFamily: grid_1.grid.font,
        color: colors_1.colors.base
    },
    sectionHeader: {
        height: 18,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: grid_1.grid.unit * 1.5,
        backgroundColor: colors_1.colors.lightAlternative
    },
    sectionTitle: {
        color: colors_1.colors.inactiveTintColorTabNav,
        fontFamily: grid_1.grid.font,
        fontSize: grid_1.grid.body
    }
});
exports.default = ModalSearch;
//# sourceMappingURL=ModalSearch.js.map