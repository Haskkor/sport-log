import * as React from 'react'
import {StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Header from './Header'
import {colors} from '../../utils/colors'
import {grid} from '../../utils/grid'
import {HeaderStatus} from '../../core/enums/index'

type IProps = {
  navigation: any
}

type IState = {
  isRunning: boolean
  mainTimer: Date
}

class StopWatch extends React.PureComponent<IProps, IState> {
  interval: NodeJS.Timer
  startTimer: Date
  isReset: boolean

  constructor() {
    super()
    this.handleReset = this.handleReset.bind(this)
    this.handleStartStop = this.handleStartStop.bind(this)
    this.state = {
      isRunning: false,
      mainTimer: null
    }
  }

  componentDidMount() {
    this.isReset = true
  }

  handleStartStop = () => {
    const {isRunning} = this.state
    if (isRunning) {
      this.isReset = true
      clearInterval(this.interval)
      this.setState({isRunning: false})
    } else {
      this.isReset = false
      if (!this.startTimer) this.startTimer = new Date()
      this.setState({isRunning: true})
      this.interval = setInterval(() => {
        this.setState({
          mainTimer: new Date()
        })
      }, 50)
    }
  }

  handleReset = () => {
    this.isReset = false
    const {isRunning} = this.state
    if (!isRunning) {
      this.startTimer = null
      this.setState({mainTimer: null})
    }
  }

  formatTime = (mainTimer: Date): string => {
    if (mainTimer) {
      const diff = +mainTimer - +this.startTimer
      const milliseconds = Math.floor((diff % 1000) / 10)
      const seconds = Math.floor(diff / 1000) % 60
      const minutes = Math.floor((diff / 1000) / 60)
      if (minutes === 59 && seconds === 59 && milliseconds >= 99) {
        this.handleStartStop()
        return '59:59,99'
      }
      return `${minutes < 10 ? '0' : '0'}${minutes}:${seconds < 10 ? '0' : ''}${seconds},${milliseconds < 10 ? '0' : ''}${milliseconds}`
    }
    return '00:00,00'
  }

  render() {
    const {isRunning, mainTimer} = this.state
    const isResetDisabled = !this.isReset
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <Header
          navigation={this.props.navigation}
          colorBorder={colors.headerBorder}
          colorHeader={colors.header}
          textColor={colors.white}
          status={HeaderStatus.drawer}
          title="Recovery Stopwatch"/>
        <View style={styles.timer}>
          <View style={styles.timerWrapper}>
            <Text style={styles.mainTimer}>{this.formatTime(mainTimer)}</Text>
          </View>
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
              onPress={this.handleStartStop}
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
  }
})

export default StopWatch
