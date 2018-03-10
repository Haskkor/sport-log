import * as React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {ToasterInfo} from '../../core/enums'
import Animate from 'react-move/Animate'
import {easeQuadOut} from 'd3-ease'
import {grid} from '../../utils/grid'
import {colors} from '../../utils/colors'

type IProps = {
  text: string
  status: ToasterInfo
  stopToaster: (status: ToasterInfo) => void
}

type IState = {
  active: boolean
}

class Toaster extends React.PureComponent<IProps, IState> {
  timer: NodeJS.Timer

  constructor(props: IProps) {
    super(props)
    this.feedbackTimer = this.feedbackTimer.bind(this)
    this.setInactive = this.setInactive.bind(this)
    this.state = {active: true}
  }

  componentDidMount() {
    this.feedbackTimer()
  }

  feedbackTimer = () => {
    this.timer = setTimeout(() => {
      this.setInactive()
    }, 4000)
  }

  setInactive = () => {
    this.setState({active: false})
    setTimeout(() => {
      this.props.stopToaster(this.props.status)
      clearTimeout(this.timer)
    }, 400)
  }

  render() {
    const {text, status} = this.props
    return (
      <View style={styles.feedbackLogView}>
        <Animate
          show={this.state.active}
          start={{
            opacityView: 0,
            opacityText: 0,
            translate: grid.unit * 4
          }}
          enter={[{
            opacityView: [grid.highOpacity],
            opacityText: [1],
            translate: [0],
            timing: {duration: 400, ease: easeQuadOut}
          }]}
          leave={{
            opacityView: [0],
            opacityText: [0],
            translate: [grid.unit * 4],
            timing: {duration: 400, ease: easeQuadOut}
          }}
        >
          {(state: { opacityView: number, opacityText: number, translate: number }) => {
            return <View
              style={[styles.feedbackLog, status === ToasterInfo.info ? styles.feedbackInfo : styles.feedbackWarning,
                {opacity: state.opacityView, left: state.translate}]}>
              <TouchableOpacity
                style={styles.feedbackButton}
                onPress={() => {
                  this.setInactive()
                }}>
                <Icon name="close" size={grid.navIcon} color={colors.white} style={{opacity: state.opacityText}}/>
              </TouchableOpacity>
              <Text style={[styles.feedbackText, {opacity: state.opacityText}]}>{text}</Text>
            </View>
          }}
        </Animate>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  feedbackLogView: {
    position: 'absolute',
    top: grid.unit * 5,
    right: grid.unit
  },
  feedbackLog: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10
  },
  feedbackInfo: {
    backgroundColor: 'rgba(0, 183, 0, 0.5)'
  },
  feedbackWarning: {
    backgroundColor: 'rgba(255, 204, 0, 0.5)'
  },
  feedbackButton: {
    marginRight: grid.unit * 0.75
  },
  feedbackText: {
    fontFamily: grid.font,
    color: colors.white
  }
})

export default Toaster
