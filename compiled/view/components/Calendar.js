"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const react_native_calendars_1 = require("react-native-calendars");
const colors_1 = require("../../utils/colors");
class Calendar extends React.PureComponent {
    constructor(props) {
        super(props);
        this.loadItems = (day) => {
            setTimeout(() => {
                for (let i = -15; i < 85; i++) {
                    const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                    const strTime = this.timeToString(time);
                    if (!this.state.items[strTime]) {
                        this.state.items[strTime] = [];
                        const numItems = Math.floor(Math.random() * 5);
                        for (let j = 0; j < numItems; j++) {
                            this.state.items[strTime].push({
                                name: 'Item for ' + strTime,
                                height: Math.max(50, Math.floor(Math.random() * 150))
                            });
                        }
                    }
                }
                //console.log(this.state.items);
                const newItems = {};
                Object.keys(this.state.items).forEach(key => {
                    newItems[key] = this.state.items[key];
                });
                this.setState({
                    items: newItems
                });
            }, 1000);
            // console.log(`Load Items for ${day.year}-${day.month}`);
        };
        this.renderItem = (item) => {
            return (React.createElement(react_native_1.View, { style: [styles.item, { height: item.height }] },
                React.createElement(react_native_1.Text, null, item.name)));
        };
        this.renderEmptyDate = () => {
            return (React.createElement(react_native_1.View, { style: styles.emptyDate },
                React.createElement(react_native_1.Text, null, "This is empty date!")));
        };
        this.rowHasChanged = (r1, r2) => {
            return r1.name !== r2.name;
        };
        this.timeToString = (time) => {
            const date = new Date(time);
            return date.toISOString().split('T')[0];
        };
        this.state = {
            items: {}
        };
    }
    render() {
        return (React.createElement(react_native_calendars_1.Agenda, { items: this.state.items, loadItemsForMonth: this.loadItems.bind(this), selected: '2017-05-16', renderItem: this.renderItem.bind(this), renderEmptyDate: this.renderEmptyDate.bind(this), rowHasChanged: this.rowHasChanged.bind(this), pastScrollRange: 10, futureScrollRange: 10, markingType: 'period', monthFormat: 'yyyy MM', theme: {
                calendarBackground: colors_1.colors.light,
                agendaKnobColor: colors_1.colors.orange,
                agendaDayTextColor: colors_1.colors.base,
                agendaDayNumColor: colors_1.colors.base
            }, renderDay: (day, item) => (React.createElement(react_native_1.Text, null, day ? day.day : 'item')) }));
    }
}
exports.default = Calendar;
const styles = react_native_1.StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    }
});
//# sourceMappingURL=Calendar.js.map