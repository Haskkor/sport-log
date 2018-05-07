import * as React from 'react'
import {ActionSheetIOS, Animated, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Header from './Header'
import * as SortableListView from 'react-native-sortable-listview'
import Icon from 'react-native-vector-icons/MaterialIcons'
import * as LottieView from 'lottie-react-native'
import {grid} from '../../utils/grid'
import {colors} from '../../utils/colors'
import {HeaderStatus} from '../../core/enums'
import {connect, Dispatch} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as ProgramsActions from '../../core/modules/entities/programs'
import RowSortableList from './RowSortableList'
import RowProgramsList from './RowProgramsList'
import * as _ from 'lodash'
import {ApolloQueryResult} from 'apollo-client'
import Animate from 'react-move/Animate'
import {easeQuadOut} from 'd3-ease'
import {compose, graphql} from 'react-apollo'
import LoadingScreen from './LoadingScreen'
import {createOmitTypenameLink} from '../../utils/graphQlHelper'
import {NavigationAction, NavigationRoute, NavigationScreenProp} from 'react-navigation'
import {dataCreateProgram, dataProgram} from '../../utils/gaphqlData'
import {CREATE_PROGRAM, DELETE_PROGRAM, UPDATE_PROGRAM} from '../../utils/gqls'

type IProps = {
  navigation: NavigationScreenProp<NavigationRoute<>, NavigationAction>
  programs: ServerEntity.Program[]
  setPrograms: typeof ProgramsActions.setPrograms
  editProgram: typeof ProgramsActions.editProgram
  deleteProgramRdx: typeof ProgramsActions.deleteProgram
  createProgram: (program: ServerEntity.Program) => Promise<ApolloQueryResult<{}>>
  deleteProgram: (_id: { _id: string }) => Promise<ApolloQueryResult<{}>>
  updateProgram: (program: ServerEntity.Program) => Promise<ApolloQueryResult<{}>>
}

type IState = {
  progressAnimation: Animated.Value
  showNoActiveProgramAlert: boolean
  showLoadingScreen: boolean
}

class Programs extends React.PureComponent<IProps, IState> {
  order: string[]
  animation: any

  constructor(props: IProps) {
    super(props)
    this.state = {
      progressAnimation: new Animated.Value(0),
      showNoActiveProgramAlert: false,
      showLoadingScreen: false
    }
    this.order = Object.keys(this.props.programs)
    this.saveProgram = this.saveProgram.bind(this)
    this.editProgram = this.editProgram.bind(this)
    this.showActionSheet = this.showActionSheet.bind(this)
    this.showAlertNoActiveProgram = this.showAlertNoActiveProgram.bind(this)
  }

  componentDidMount() {
    if (this.props.programs.length === 0) this.animation.play()
    this.showAlertNoActiveProgram(this.props)
  }

  componentDidUpdate() {
    if (this.props.programs.length === 0) this.animation.play()
  }

  componentWillUpdate(nextProps: IProps) {
    this.showAlertNoActiveProgram(nextProps)
  }

  showAlertNoActiveProgram = (props: IProps) => {
    const programActive = props.programs.map((pg: ServerEntity.Program) => pg.active)
      .some((act: boolean) => act)
    this.setState({showNoActiveProgramAlert: !programActive})
  }

  saveProgram = async (program: ServerEntity.ExercisesDay[], name: string) => {
    let newProgram: ServerEntity.Program = {
      days: program,
      active: false,
      name: name
    }
    this.setState({showLoadingScreen: true})
    await this.props.createProgram(newProgram).then((d: {data: dataCreateProgram}) => {
      newProgram._id = d.data.createProgram._id
    }).catch((e) => {
      console.log('Create program failed', e)
    })
    this.props.setPrograms({programs: [newProgram]})
    this.setState({showLoadingScreen: false})
  }

  editProgram = async (index: number, program: ServerEntity.Program) => {
    this.props.editProgram({index, program})
    const editedProgram: ServerEntity.Program = {
      days: createOmitTypenameLink(program.days),
      _id: program._id,
      active: program.active,
      name: program.name
    }
    this.props.updateProgram(editedProgram)
      .then(() => {
      }).catch((e) => {
      console.log('Update program failed', e)
    })
  }

  showActionSheet = (data: ServerEntity.Program) => {
    const {programs, editProgram, deleteProgramRdx, deleteProgram, updateProgram} = this.props
    ActionSheetIOS.showActionSheetWithOptions({
        title: data.name,
        options: [data.active ? 'Set inactive' : 'Set active', 'Edit', 'Delete', 'Cancel'],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 3
      },
      (buttonIndex) => {
        const indexRow = _.findIndex(programs, (row: ServerEntity.Program) => {
          return row === data
        })
        if (buttonIndex === 0) {
          const indexRowAct = _.findIndex(programs, (row: ServerEntity.Program) => {
            return row.active
          })
          const pgAct = programs.find((pg: ServerEntity.Program) => pg.active)
          if (pgAct) {
            editProgram({index: indexRowAct, program: {active: false, days: pgAct.days, name: pgAct.name, _id: pgAct._id}})
            updateProgram({active: false, days: createOmitTypenameLink(pgAct.days), name: pgAct.name, _id: pgAct._id})
              .then(() => {
              }).catch((e) => {
              console.log('Update program failed', e)
            })
          }
          editProgram({index: indexRow, program: {active: !data.active, days: data.days, name: data.name, _id: data._id}})
          updateProgram({active: !data.active, days: createOmitTypenameLink(data.days), name: data.name, _id: data._id})
            .then(() => {
            }).catch((e) => {
            console.log('Update program failed', e)
          })
        } else if (buttonIndex === 1) {
          this.props.navigation.navigate('ProgramNameDays', {
            saveProgram: this.editProgram,
            editedProgram: data,
            editedIndex: indexRow
          })
        } else if (buttonIndex === 2) {
          deleteProgram({_id: data._id}).then(() => {
          }).catch((e) => {
            console.log('Delete program failed', e)
          })
          deleteProgramRdx({index: indexRow})
        }
      })
  }

  render() {
    const {progressAnimation, showNoActiveProgramAlert} = this.state
    const {programs} = this.props
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content"/>
        <Header
          navigation={this.props.navigation}
          colorBorder={colors.headerBorderLight}
          colorHeader={colors.headerLight}
          textColor={colors.base}
          status={HeaderStatus.drawer}
          title="Programs"
          secondaryIcon="add"
          secondaryEnabled={true}
          secondaryFunction={() => this.props.navigation.navigate('ProgramNameDays', {saveProgram: this.saveProgram})}
        />
        <Animate
          show={showNoActiveProgramAlert && programs.length > 0}
          start={{
            opacityView: 0,
            height: 0
          }}
          enter={{
            height: [30],
            opacityView: [grid.highOpacity],
            timing: {duration: 400, ease: easeQuadOut}
          }}
          leave={{
            height: [0],
            opacityView: [0],
            timing: {duration: 400, ease: easeQuadOut}
          }}>
          {(state: {opacityView: number, height: number}) => {
            return (
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.orange,
                opacity: state.opacityView,
                height: state.height,
                overflow: 'hidden'
              }}>
                <Icon name="warning" size={grid.navIcon} color={colors.white} style={{marginRight: grid.unit / 2}}/>
                <Text style={{fontFamily: grid.font, fontSize: 14, color: colors.white}}>Please select an active
                  program</Text>
              </View>
            )
          }}
        </Animate>
        {programs.length > 0 &&
        <SortableListView
          style={styles.sortableList}
          data={programs}
          order={this.order}
          onRowMoved={(e: {from: number, to: number, row: {data: dataProgram, index: string, section: string}}) => {
            this.order.splice(e.to, 0, this.order.splice(e.from, 1)[0])
            this.forceUpdate()
          }}
          renderRow={(row: ServerEntity.Program) => row &&
              <RowSortableList data={row} action={this.showActionSheet} component={<RowProgramsList data={row}/>}/> ||
              <View/>}
        /> ||
        <View style={styles.viewNoPrograms}>
          <View style={styles.viewTextNoProgram}>
            <Icon name="error-outline" size={26} color={colors.base} style={styles.iconNoProgram}/>
            <Text style={styles.textNoProgram}>You have no programs created yet</Text>
          </View>
          <View style={styles.viewAnimationNoProgram}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('ProgramNameDays', {saveProgram: this.saveProgram})}>
              <LottieView
                ref={(ref: any) => this.animation = ref}
                loop={true}
                speed={0.6}
                style={styles.animation}
                progress={progressAnimation}
                source={require('../../../assets/lottie/add_button.json')}
              />
            </TouchableOpacity>
          </View>
        </View>}
        {this.state.showLoadingScreen &&
        <LoadingScreen/>}
      </View>
    )
  }
}

const ProgramsGraphQl = compose(graphql(
  CREATE_PROGRAM,
  {
    props: ({mutate}) => ({
      createProgram: (program: ServerEntity.Program) => mutate({
        variables: {program}
      })
    })}
), graphql(
  DELETE_PROGRAM,
  {
    props: ({mutate}) => ({
      deleteProgram: (_id: { _id: string }) => mutate({
        variables: {_id}
      })
    }),
  },
), graphql(
  UPDATE_PROGRAM,
  {
    props: ({mutate}) => ({
      updateProgram: (program: ServerEntity.Program) => mutate({
        variables: {program}
      })
    })
  }
))(Programs)

const mapStateToProps = (rootState: ReduxState.RootState) => {
  return {
    programs: rootState.entities.programs
  }
}

const mapDispatchToProps =
  (dispatch: Dispatch<any>) => bindActionCreators({
    setPrograms: ProgramsActions.setPrograms,
    editProgram: ProgramsActions.editProgram,
    deleteProgramRdx: ProgramsActions.deleteProgram
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ProgramsGraphQl)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sortableList: {
    flex: 1
  },
  viewNoPrograms: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  iconNoProgram: {
    marginRight: grid.unit * 1.5
  },
  viewTextNoProgram: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textNoProgram: {
    color: colors.base
  },
  viewAnimationNoProgram: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: grid.unit * 2.5
  },
  rowList: {
    padding: grid.unit,
    backgroundColor: colors.lightAlternative,
    borderBottomWidth: grid.regularBorder,
    borderColor: colors.light
  },
  animation: {
    width: grid.unit * 3,
    height: grid.unit * 3
  }
})
