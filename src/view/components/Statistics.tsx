import * as React from 'react'
import {View, StyleSheet} from 'react-native'
import {connect, Dispatch} from 'react-redux'
import {bindActionCreators} from 'redux'
import {compose, graphql} from 'react-apollo'
import {dataHistoryDateUser} from '../../utils/gaphqlData'
import {HISTORY_DATE_USER} from '../../utils/gqls'

type IProps = {
  data: dataHistoryDateUser
}

type IState = {
}

class Statistics extends React.PureComponent<IProps, IState> {

  render() {
    return (
      <View style={styles.container}></View>
    )
  }
}

const StatisticsGraphQl = compose(graphql(
  HISTORY_DATE_USER))(Statistics)

const mapStateToProps = (rootState: ReduxState.RootState) => {
  return {}
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(StatisticsGraphQl)

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
