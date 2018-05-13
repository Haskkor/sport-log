import * as React from 'react'
import {Text, TouchableOpacity, View, Modal, StyleSheet} from 'react-native'
import * as SortableListView from 'react-native-sortable-listview'
import RowListLog from './RowListLog'
import {colors} from '../../utils/colors'
import {grid} from '../../utils/grid'
import RowSortableList from './RowSortableList'

type IProps = {}

type IState = {}

class ModalSortExercises extends React.PureComponent<IProps, IState> {

  render() {
    return (
      <View style={styles.container}>
        <Modal
          onRequestClose={() => console.log('close')}
          visible={true}
          animationType="slide">
          <View style={styles.viewButtons}>
            <TouchableOpacity
              style={styles.buttonSave}
              onPress={() => console.log('save')}>
              <Text style={styles.textButton}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonDismiss}
              onPress={() => console.log('dismiss')}>
              <Text style={styles.textButton}>Dismiss</Text>
            </TouchableOpacity>
          </View>
          <SortableListView
            style={styles.sortableList}
            data={dataLog}
            order={order}
            onRowMoved={(e: {from: number, to: number, row: {data: ServerEntity.ExerciseSet, index: string, section: string}}) => {
              order.splice(e.to, 0, order.splice(e.from, 1)[0])
              this.forceUpdate()
            }}
            renderRow={(row: any) => row && // fixme any
              <RowSortableList data={row} action={() => console.log('clicked')} component={<RowListLog data={row}/>}/> ||
              <View/>}
          />
        </Modal>
      </View>
    )
  }
}

export default ModalSortExercises

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightAlternative
  },
  viewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: grid.smallBorder,
    borderColor: colors.base,
    paddingTop: grid.unit * 2,
    paddingBottom: grid.unit * 1.25,
    backgroundColor: colors.headerLight
  },
  buttonSave: {
    alignSelf: 'flex-start',
    marginLeft: grid.unit * 1.25
  },
  buttonDismiss: {
    alignSelf: 'flex-end',
    marginRight: grid.unit * 1.25
  },
  textButton: {
    fontFamily: grid.fontBold,
    color: colors.base
  },
  sortableList: {
    flex: 1
  },
  textButtonDisabled: {
    fontFamily: grid.fontBold,
    color: colors.inactiveTintColorTabNav
  }
})
