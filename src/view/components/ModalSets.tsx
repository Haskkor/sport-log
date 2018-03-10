import * as React from 'react'
import {View, Modal, Picker, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {Grid, Row, Col} from 'react-native-easy-grid'
import * as _ from 'lodash'
import {grid} from '../../utils/grid'
import {colors} from '../../utils/colors'

type IProps = {
  updateDeleteSet: (reps?: number, weight?: number) => void
  deleteEnabled: boolean
  reps: number
  weight: number
  closeModal: () => void
}

type IState = {
  currentReps: number
  currentWeight: number
}


class ModalSets extends React.PureComponent<IProps, IState> {

  componentWillMount() {
    this.setState({currentReps: this.props.reps, currentWeight: this.props.weight})
  }

  render() {
    const {currentReps, currentWeight} = this.state
    const {deleteEnabled} = this.props
    return (
      <View>
        <Modal
          onRequestClose={() => console.log('close')}
          visible={true}
          transparent={true}
          animationType="slide">
          <View style={styles.container}>
            <View style={styles.viewOpacity}/>
            <View style={styles.viewPickers}>
              <View style={styles.viewButtons}>
                <TouchableOpacity
                  style={styles.buttonDelete}
                  disabled={!deleteEnabled}
                  onPress={() => {
                    this.props.updateDeleteSet()
                    this.props.closeModal()
                  }}>
                  <Text style={deleteEnabled ? styles.textDelete : styles.textDeleteDisabled}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonSave}
                  onPress={() => {
                    this.props.updateDeleteSet(currentReps, currentWeight)
                    this.props.closeModal()
                  }}>
                  <Text style={styles.textButton}>Save</Text>
                </TouchableOpacity>
              </View>
              <Grid style={styles.grid}>
                <Col style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Row size={10}>
                    <Text style={styles.textTitle}>Reps:</Text>
                  </Row>
                  <Row size={90}>
                    <Picker
                      style={styles.picker}
                      itemStyle={styles.pickerItem}
                      selectedValue={currentReps}
                      onValueChange={(itemValue) => this.setState({currentReps: itemValue})}>
                      {_.range(1, 30).map((value: number) => {
                        return <Picker.Item key={value} label={value.toString()} value={value}/>
                      })}
                    </Picker>
                  </Row>
                </Col>
                <Col style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Row size={10}>
                    <Text style={styles.textTitle}>Weight:</Text>
                  </Row>
                  <Row size={90}>
                    <Picker
                      style={styles.picker}
                      itemStyle={styles.pickerItem}
                      selectedValue={currentWeight}
                      onValueChange={(itemValue) => this.setState({currentWeight: itemValue})}>
                      {_.range(1, 500).map((value: number) => {
                        return <Picker.Item key={value} label={value.toString()} value={value}/>
                      })}
                    </Picker>
                  </Row>
                </Col>
              </Grid>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  picker: {
    width: grid.unit * 6,
    height: 'auto'
  },
  container: {
    flex: 1
  },
  viewOpacity: {
    backgroundColor: colors.black,
    opacity: grid.mediumOpacity,
    flex: 1
  },
  viewPickers: {
    flex: 1,
    backgroundColor: colors.lightAlternative
  },
  viewButtons: {
    flexDirection: 'row',
    backgroundColor: colors.headerLight,
    height: grid.unit * 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1
  },
  buttonDelete: {
    position: 'absolute',
    left: grid.unit * 1.25
  },
  buttonSave: {
    position: 'absolute',
    right: grid.unit * 1.25
  },
  grid: {
    padding: grid.unit * 1.25
  },
  textDelete: {
    fontFamily: grid.font,
    color: colors.alert
  },
  textDeleteDisabled: {
    fontFamily: grid.font,
    color: 'rgba(153, 0, 0, 0.5)'
  },
  pickerItem: {
    fontSize: grid.body,
    color: colors.base
  },
  textButton: {
    fontFamily: grid.font,
    color: colors.base
  },
  textTitle: {
    fontFamily: grid.font,
    color: colors.base
  }
})

export default ModalSets
