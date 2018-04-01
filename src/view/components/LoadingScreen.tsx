import * as React from 'react'
import {Dimensions, Image, StyleSheet, View} from 'react-native'
import {colors} from '../../utils/colors'
import {grid} from '../../utils/grid'

type IProps = {}

type IState = {}

class LoadingScreen extends React.PureComponent<IProps, IState> {

  render() {
    return (
      <View style={styles.viewLoader}>
        <Image source={require('../../../assets/images/loader.gif')} style={styles.imageLoader}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  imageLoader: {
    width: 50,
    height: 50
  },
  viewLoader: {
    position: 'absolute',
    top: 70,
    left: 0,
    width: '100%',
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black,
    opacity: grid.highOpacity
  }
})

export default LoadingScreen
