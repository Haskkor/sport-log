import * as React from 'react'
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {colors} from '../../utils/colors'
import {grid} from '../../utils/grid'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Animate from 'react-move/Animate'
import {easeLinear} from 'd3-ease'

type IProps = {
  title: string
}

type IState = {
  title: string
  expanded: boolean
  minHeight: number
  maxHeight: number
}

class Panel extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      title: this.props.title,
      expanded: false,
      minHeight: 0,
      maxHeight: 0
    }
  }

  render() {
    const {minHeight, maxHeight, expanded} = this.state
    return (
      <View style={styles.container}>
        <Animate
          show={true}
          start={{
            height: minHeight
          }}
          update={{
            height: expanded ? [maxHeight + minHeight] : [minHeight],
            timing: {duration: 300, ease: easeLinear}
          }}>
          {(state: any) => {
            return (
              <View style={{height: state.height}}>
                <View style={styles.titleContainer} onLayout={(e) => {if (e.nativeEvent.layout.height && e.nativeEvent.layout.height > minHeight) this.setState({minHeight: e.nativeEvent.layout.height})}}>
                  <Text style={styles.title}>{this.state.title}</Text>
                  <TouchableOpacity onPress={() => this.setState({expanded: !expanded})}>
                    <Icon name={expanded ? 'expand-less' : 'expand-more'} size={grid.subHeader} color={colors.base}/>
                  </TouchableOpacity>
                </View>
                <View style={styles.body} onLayout={(e) => {if (e.nativeEvent.layout.height && e.nativeEvent.layout.height > maxHeight) this.setState({maxHeight: e.nativeEvent.layout.height})}}>
                  {this.props.children}
                </View>
              </View>
            )
          }}
        </Animate>
      </View>
    )
  }
}

export default Panel

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 10,
    overflow: 'hidden'
  },
  titleContainer: {
    flexDirection: 'row',
    padding: grid.unit
  },
  title: {
    flex: 1,
    color: colors.base,
    fontFamily: grid.fontBold
  },
  body: {
    padding: 10,
    paddingTop: 0
  }
})
