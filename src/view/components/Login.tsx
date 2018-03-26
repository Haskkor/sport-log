import * as React from 'react'
import {StyleSheet, StatusBar} from 'react-native'
import Header from './Header'
import {colors} from "../../utils/colors";
import {HeaderStatus} from "../../core/enums/index";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type IProps = {}

type IState = {}

class Login extends React.PureComponent<IProps, IState> {

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container} scrollEnabled={false} extraHeight={90}>
        <StatusBar barStyle="dark-content"/>
        <Header
          colorBorder={colors.headerBorderLight}
          colorHeader={colors.headerLight}
          textColor={colors.base}
          status={HeaderStatus.drawer}
          title="Sport-Log"
          primaryIconDisabled={true}
        />
      </KeyboardAwareScrollView>
    )
  }
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
