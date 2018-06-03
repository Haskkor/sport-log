import * as React from 'react'
import {StyleSheet, ScrollView, Text, View, StatusBar} from 'react-native'
import {connect, Dispatch} from 'react-redux'
import {bindActionCreators} from 'redux'
import {compose, graphql} from 'react-apollo'
import {dataHistoryDateUser, exerciseUserGql, historyDateUserGql} from '../../utils/gaphqlData'
import {HISTORY_DATE_USER} from '../../utils/gqls'
import {colors} from '../../utils/colors'
import Panel from './Panel'
import {NavigationAction, NavigationRoute, NavigationScreenProp} from 'react-navigation'
import LoadingScreen from './LoadingScreen'
import {HeaderStatus} from '../../core/enums'
import Header from './Header'

type IProps = {
  navigation: NavigationScreenProp<NavigationRoute<>, NavigationAction>
  data: dataHistoryDateUser
}

type IState = {
  showLoadingScreen: boolean
}

class Statistics extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      showLoadingScreen: true
    }
    this.refetchData = this.refetchData.bind(this)
    this.createStatistics = this.createStatistics.bind(this)
  }

  async componentWillMount() {
    this.refetchData()
  }

  refetchData = async () => {
    this.setState({showLoadingScreen: true})
    await this.props.data.refetch()
    await this.createStatistics()
    this.setState({showLoadingScreen: false})
  }

  createStatistics = () => {
    // data shape:
    // create a list of objects with:
    // name of the exercise and the muscle group
    // best weight and date
    // array containing date and best weight of the day
    // best set and date
    // array containing date and best set of the day
    // best WTV
    // array containing date and best WTV of the day
    // total weight
    const exercisesRaw = this.props.data.historyDateUser.map((h: historyDateUserGql) => {
      return h.exercises.map((e: exerciseUserGql) => {
        if (e.done) return e.exercise.name + ' - ' + e.muscleGroup
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content"/>
        <Header
          navigation={this.props.navigation}
          colorBorder={colors.headerBorderLight}
          colorHeader={colors.headerLight}
          textColor={colors.base}
          status={HeaderStatus.drawer}
          title="Calendar"
        />
        <ScrollView contentContainerStyle={styles.scroll}>
          <Panel title="Best weight">
            <Text></Text>
          </Panel>
          <Panel title="Best set">
            <Text></Text>
          </Panel>
          <Panel title="Best weights training volume">
            <Text></Text>
          </Panel>
          <Panel title="Total weight">
            <Text></Text>
          </Panel>
        </ScrollView>
        {this.state.showLoadingScreen &&
        <LoadingScreen/>}
      </View>
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
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.lightAlternative,
    paddingTop: 30
  }
})
