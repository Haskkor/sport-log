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
import * as _ from 'lodash'

type IProps = {
  navigation: NavigationScreenProp<NavigationRoute<>, NavigationAction>
  data: dataHistoryDateUser
}

type IState = {
  showLoadingScreen: boolean
  statsData: StatsData[]
}

type Stats = {
  date: string,
  value: number
}

type StatsData = {
  name: string
  bestWeight: {
    best: Stats,
    hist: Stats[]
  }
  bestSet: {
    best: Stats,
    hist: Stats[]
  }
  bestWtv: {
    best: Stats,
    hist: Stats[]
  }
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
          const index = exercisesRaw.findIndex((er) => er.name === `${e.exercise.name} - ${e.muscleGroup}`)
          if (index !== -1) {
            exercisesRaw[index].dateSets.push({sets: e.sets, date: h.timestamp})
          } else {
            exercisesRaw.push({
              name: `${e.exercise.name} - ${e.muscleGroup}`,
              dateSets: [{date: h.timestamp, sets: e.sets}]
            })
          }
        }
      })
    })
    const exercisesRawSortedReverseTimestamp = exercisesRaw.map((r: RawData) => {
      return {
        name: r.name,
        dateSets: r.dateSets.sort((a, b) => +b.date - +a.date)
      }
    })
    const statsData = exercisesRawSortedReverseTimestamp.map((i: RawData) => {
      const weight = i.dateSets.map((s: {date: string, sets: RawSet[]}) => {return {date: s.date, value: Math.max(...s.sets.map((rs: RawSet) => rs.weight))}})
      const set = i.dateSets.map((s: {date: string, sets: RawSet[]}) => {return {date: s.date, value: Math.max(...s.sets.map((rs: RawSet) => rs.weight * rs.reps))}})
      const wtv = i.dateSets.map((s: {date: string, sets: RawSet[]}) => {return {date: s.date, value: s.sets.map((rs: RawSet) => rs.weight * rs.reps).reduce((acc, curr) => acc + curr)}})
      return {
        name: i.name,
        bestWeight: {
          best: weight.reduce((prev, curr) => (prev.value > curr.value) ? prev : curr),
          hist: weight,
        },
        bestSet: {
          best: set.reduce((prev, curr) => (prev.value > curr.value) ? prev : curr),
          hist: set
        },
        bestWtv: {
          best: wtv.reduce((prev, curr) => (prev.value > curr.value) ? prev : curr),
          hist: wtv
        },
        totalWeight: _.flatten(i.dateSets.map((s: {date: string, sets: RawSet[]}) => s.sets.map((rs: RawSet) => rs.reps * rs.weight))).reduce((acc, curr) => acc + curr)
      }
    })
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
