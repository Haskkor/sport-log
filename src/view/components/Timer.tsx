import * as React from 'react'
import {Picker, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import * as _ from 'lodash'
import Header from './Header'
import {colors} from '../../utils/colors'
import {grid} from '../../utils/grid'
import {HeaderStatus} from '../../core/enums/'

type IProps = {
  navigation: any
}

type IState = {
  isRunning: boolean
  selectedMinute: number
  selectedSecond: number
  totalTime: number
}

class Timer extends React.PureComponent<IProps, IState> {
  interval: NodeJS.Timer
  isReset: boolean

  constructor(props: IProps) {
    super(props)
    this.handleReset = this.handleReset.bind(this)
    this.handleStartStop = this.handleStartStop.bind(this)
    this.state = {
      isRunning: false,
      selectedMinute: 1,
      selectedSecond: 30,
      totalTime: null
    }
  }

  componentDidMount() {
    this.isReset = false
  }

  handleStartStop = (endTimer: boolean) => {
    const {isRunning, selectedSecond, selectedMinute} = this.state
    if (selectedMinute === 0 && selectedSecond === 0) return
    if (isRunning) {
      if (!endTimer) this.isReset = true
      clearInterval(this.interval)
      this.setState({isRunning: false})
    } else {
      this.isReset = false
      if (this.state.totalTime === null) this.setState({totalTime: selectedMinute * 60 + selectedSecond})
      this.setState({isRunning: true})
      this.interval = setInterval(() => {
        this.setState({totalTime: this.state.totalTime - 1})
      }, 1000)
    }
  }

  handleReset = () => {
    this.isReset = false
    const {isRunning} = this.state
    if (!isRunning) {
      this.setState({totalTime: null})
    }
  }

  formatTime = (totalTime: number): string => {
    if (totalTime > 0) {
      const seconds = totalTime % 60
      const minutes = Math.floor(totalTime / 60)
      if (minutes === 0 && seconds === 0) {
        this.handleStartStop(false)
        return '00:00'
      }
      return `${minutes < 10 ? '0' : '0'}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }
    this.handleStartStop(true)
    return '00:00'
  }

  render() {
    const {isRunning, selectedMinute, selectedSecond, totalTime} = this.state
    const isResetDisabled = !this.isReset
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <Header
          navigation={this.props.navigation}
          colorBorder={colors.headerBorder}
          colorHeader={colors.header}
          status={HeaderStatus.drawer}
          textColor={colors.white}
          title="Recovery Timer"/>
        <View style={styles.timer}>
          {(isRunning || this.state.totalTime > 0) &&
          <View style={styles.timerWrapper}>
            <Text style={styles.mainTimer}>{this.formatTime(totalTime)}</Text>
          </View> ||
          <View style={styles.pickerWrapper}>
            <View style={styles.pickerMinutes}>
              <Picker
                style={styles.picker}
                selectedValue={selectedMinute}
                onValueChange={(itemValue) => this.setState({selectedMinute: itemValue})}>
                {_.range(10).map((value) => {
                  return <Picker.Item color={colors.white} key={value} label={value.toString()} value={value}/>
                })}
              </Picker>
              <Text style={styles.resetButtonText}>minutes</Text>
            </View>
            <View style={styles.pickerSeconds}>
              <Picker
                style={styles.picker}
                selectedValue={selectedSecond}
                onValueChange={(itemValue) => this.setState({selectedSecond: itemValue})}>
                {_.range(0, 60, 5).map((value) => {
                  return <Picker.Item color={colors.white} key={value} label={value.toString()} value={value}/>
                })}
              </Picker>
              <Text style={styles.resetButtonText}>seconds</Text>
            </View>
          </View>}
        </View>
        <View style={styles.buttons}>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              disabled={isResetDisabled}
              onPress={this.handleReset}
              style={[styles.button, isResetDisabled ? styles.resetButtonDisabled : styles.resetButton]}>
              <Text style={isResetDisabled ? styles.resetButtonTextDisabled : styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.handleStartStop(false)}
              style={[styles.button, isRunning ? styles.stopButton : styles.startButton]}>
              <Text style={isRunning ? styles.stopButtonText : styles.startButtonText}>
                {isRunning ? 'Stop' : 'Start'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBackground
  },
  timerWrapper: {
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1
  },
  timer: {
    flex: 2
  },
  buttons: {
    flex: 1,
    justifyContent: 'center'
  },
  mainTimer: {
    fontSize: grid.timer,
    fontWeight: 'normal',
    alignSelf: 'flex-end',
    color: colors.white,
    fontFamily: grid.fontTimer
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: grid.unit,
    paddingBottom: grid.unit * 2
  },
  button: {
    height: grid.unit * 5,
    width: grid.unit * 5,
    borderRadius: grid.unit * 2.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  startButton: {
    backgroundColor: 'rgba(0, 112, 10, 0.5)'
  },
  startButtonText: {
    fontFamily: grid.font,
    color: colors.valid
  },
  stopButton: {
    backgroundColor: 'rgba(153, 0, 0, 0.5)'
  },
  stopButtonText: {
    fontFamily: grid.font,
    color: colors.alert
  },
  resetButton: {
    backgroundColor: 'rgba(179, 179, 179, 0.5)'
  },
  resetButtonText: {
    fontFamily: grid.font,
    color: colors.white
  },
  resetButtonDisabled: {
    backgroundColor: 'rgba(65, 65, 67, 0.5)'
  },
  resetButtonTextDisabled: {
    fontFamily: grid.font,
    color: colors.inactiveTintColorTabNav
  },
  pickerWrapper: {
    flex: 1,
    flexDirection: 'row'
  },
  pickerMinutes: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    alignSelf: 'center'
  },
  pickerSeconds: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    alignSelf: 'center'
  },
  picker: {
    width: grid.unit * 2.5
  }
})

export default Timer
