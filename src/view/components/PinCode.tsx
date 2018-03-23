import * as React from 'react'
import {StyleSheet, View} from 'react-native'
import PINCode from '@haskkor/react-native-pincode'

type IProps = {}

type IState = {}

class Programs extends React.PureComponent<IProps, IState> {

  render() {
    return (
      <View style={styles.container}>
        <PINCode status={"enter"} storedPin={"1111"} />
      </View>
    )
  }
}

export default Programs

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
