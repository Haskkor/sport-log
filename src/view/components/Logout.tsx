import * as React from 'react'
import {View} from 'react-native'

type IProps = {
  screenProps: { changeLoginState: (state: boolean) => void }
}

type IState = {}

class Logout extends React.PureComponent<IProps, IState> {

  componentDidMount() {
    this.props.screenProps.changeLoginState(false)
  }

  render() {
    return (
      <View/>
    )
  }
}

export default Logout