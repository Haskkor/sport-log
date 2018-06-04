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
  statsData: StatsData[]
}

type StatsData = {
  name: string
  bestWeight: {date: string, value: number}[]
  bestSet: {date: string, value: number}[]
  bestWtv: {date: string, value: number}[]
  totalWeight: number
}

type RawData = {
  name: string,
  dateSets: {
    sets: RawSet[],
    date: string
  }[]
}

type RawSet = {
  __typename: string,
  reps: number,
  weight: number
}

class Statistics extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      showLoadingScreen: true,
      statsData: []
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
    const exercisesRaw: RawData[] = []
    this.props.data.historyDateUser.map((h: historyDateUserGql) => {
      return h.exercises.map((e: exerciseUserGql) => {
        if (e.done) {
          const index = exercisesRaw.findIndex((er) => er.name === `e.exercise.name + ' - ' + e.muscleGroup`)
          if (index !== -1) {
            exercisesRaw[index].dateSets.push({sets: e.sets, date: h.timestamp})
          } else {
            exercisesRaw.push({
              name: `e.exercise.name + ' - ' + e.muscleGroup`,
              dateSets: [{date: h.timestamp, sets: e.sets}]
            })
          }
        }
      })
    })

    console.log(exercisesRaw)

    const statsData = exercisesRaw.map((i: RawData) => {
      return {
        name: i.name,
        bestWeight: i.dateSets.map((s: {date: string, sets: RawSet[]}) => {return {date: s.date, value: Math.max(...s.sets.map((rs: RawSet) => rs.weight))}}),
        bestSet: i.dateSets.map((s: {date: string, sets: RawSet[]}) => {return {date: s.date, value: Math.max(...s.sets.map((rs: RawSet) => rs.weight * rs.reps))}}),
        bestWtv: i.dateSets.map((s: {date: string, sets: RawSet[]}) => {return {date: s.date, value: (s.sets.map((rs: RawSet) => rs.weight * rs.reps).reduce((acc, curr) => acc + curr), 0)}}),
        totalWeight: (i.dateSets.map((s: {date: string, sets: RawSet[]}) => s.sets.map((rs: RawSet) => rs.weight * rs.reps).reduce((acc, curr) => acc + curr), 0).reduce((acc, curr) => acc + curr), 0)
      }
    })

    console.log(statsData)

    this.setState({statsData: statsData})
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
