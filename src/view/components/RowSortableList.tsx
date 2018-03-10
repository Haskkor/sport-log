import * as React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {colors} from '../../utils/colors'
import {grid} from '../../utils/grid'

type IProps = {
  data: any
  sortHandlers?: any
  action: (data: any) => void
  component: JSX.Element
}

type IState = {}

class RowSortableList extends React.PureComponent<IProps, IState> {
  render() {
    return (
      <TouchableOpacity
        underlayColor={colors.light}
        style={styles.container}
        onPress={() => this.props.action(this.props.data)}
        {...this.props.sortHandlers}>
        <View style={styles.viewContent}>
          <View style={styles.viewIcon}>
            <Icon name="reorder" size={grid.navIcon} color="rgba(0, 0, 0, 0.5)"/>
          </View>
          {this.props.component}
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: grid.unit,
    backgroundColor: colors.lightAlternative,
    borderBottomWidth: grid.regularBorder,
    borderColor: colors.light
  },
  viewContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  viewIcon: {
    marginRight: grid.unit
  }
})

export default RowSortableList
