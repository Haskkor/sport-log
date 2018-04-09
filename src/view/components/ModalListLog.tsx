import * as React from 'react'
import {Text, TouchableOpacity, View, Modal, StyleSheet, ActionSheetIOS} from 'react-native'
import * as SortableListView from 'react-native-sortable-listview'
import RowListLog from './RowListLog'
import * as _ from 'lodash'
import {colors} from '../../utils/colors'
import {grid} from '../../utils/grid'
import RowSortableList from './RowSortableList'

type IProps = {
  dataLog: ServerEntity.ExerciseSet[]
  deleteExercise: (deleteIndex: number) => void
  editExercise: (index: number) => void
  order: string[]
  closeModal: () => void
  saveHistoryDate: (historyDate: ServerEntity.HistoryDate) => void
}

type IState = {}

class ModalListLog extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.showActionSheet = this.showActionSheet.bind(this)
  }

  showActionSheet(data: ServerEntity.ExerciseSet) {
    ActionSheetIOS.showActionSheetWithOptions({
        title: data.exercise.name,
        message: data.exercise.equipment,
        options: ['Edit', 'Delete', 'Cancel'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 2
      },
      (buttonIndex) => {
        const indexRow = _.findIndex(this.props.dataLog, (row: ServerEntity.ExerciseSet) => {
          return row === data
        })
        if (buttonIndex === 0) {
          this.props.editExercise(indexRow)
        } else if (buttonIndex === 1) {
          this.props.deleteExercise(indexRow)
        }
      }
    )
  }

  render() {
    const {order, closeModal, dataLog, saveHistoryDate} = this.props
    return (
      <View style={styles.container}>
        <Modal
          onRequestClose={() => console.log('close')}
          visible={true}
          animationType="slide">
          <View style={styles.viewButtons}>
            <TouchableOpacity
              disabled={dataLog.length < 1}
              style={styles.buttonSave}
              onPress={() => {
                const date = new Date()
                saveHistoryDate({exercises: dataLog, timestamp: Date.UTC(date.getFullYear(), date.getMonth(), date.getDay())})
              }}>
              <Text style={dataLog.length < 1 ? styles.textButtonDisabled : styles.textButton}>Save the training</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonDismiss}
              onPress={() => closeModal()}>
              <Text style={styles.textButton}>Dismiss</Text>
            </TouchableOpacity>
          </View>
          <SortableListView
            style={styles.sortableList}
            data={dataLog}
            order={order}
            onRowMoved={(e: any) => {
              order.splice(e.to, 0, order.splice(e.from, 1)[0])
              this.forceUpdate()
            }}
            renderRow={(row: ServerEntity.ExerciseSet) => row &&
                <RowSortableList data={row} action={this.showActionSheet} component={<RowListLog data={row}/>}/> ||
                <View/>}
          />
        </Modal>
      </View>
    )
  }
}

export default ModalListLog

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
