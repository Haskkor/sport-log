import * as React from 'react'
import {Modal, Picker, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {buildRecoveryTimes} from '../../utils/helper'
import {grid} from '../../utils/grid'
import {colors} from '../../utils/colors'

type IProps = {
  updateRecovery: (recoveryTime: string) => void
}

type IState = {
  currentRecovery: string
}

class ModalRecovery extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {currentRecovery: buildRecoveryTimes()[0]}
  }

  render() {
    const {currentRecovery} = this.state
    return (
      <View>
        <Modal
          onRequestClose={() => console.log('close')}
          visible={true}
          transparent={true}
          animationType="slide">
          <View style={styles.container}>
            <View style={styles.viewOpacity}/>
            <View style={styles.viewModal}>
              <View style={styles.viewButtons}>
                <TouchableOpacity
                  style={styles.buttonSave}
                  onPress={() => {
                    this.props.updateRecovery(currentRecovery)
                  }}>
                  <Text style={styles.textButton}>Save</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.viewPicker}>
                <Picker
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  selectedValue={currentRecovery}
                  onValueChange={(itemValue) => this.setState({currentRecovery: itemValue})}>
                  {buildRecoveryTimes().map((value: string) => {
                    return <Picker.Item key={value} label={value.toString()} value={value}/>
                  })}
                </Picker>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  picker: {
    width: grid.unit * 12.5,
    height: 'auto',
    marginBottom: grid.unit * 5
  },
  container: {
    flex: 1
  },
  viewOpacity: {
    backgroundColor: colors.base,
    opacity: grid.lowOpacity,
    flex: 2
  },
  viewModal: {
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
  buttonSave: {
    position: 'absolute',
    right: grid.unit * 1.25
  },
  pickerItem: {
    fontSize: grid.subHeader,
    fontFamily: grid.font,
    color: colors.base
  },
  viewPicker: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  textButton: {
    fontFamily: grid.font,
    color: colors.base
  }
})

export default ModalRecovery
