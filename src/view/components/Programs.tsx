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
import Animate from 'react-move/Animate'
import {easeQuadOut} from 'd3-ease'

type IProps = {
  navigation: any
  programs: ServerEntity.Program[]
  setPrograms: typeof ProgramsActions.setPrograms
  editProgram: typeof ProgramsActions.editProgram
  deleteProgram: typeof ProgramsActions.deleteProgram
}

type IState = {
  progressAnimation: Animated.Value
  showNoActiveProgramAlert: boolean
}

class Programs extends React.PureComponent<IProps, IState> {
  order: string[]
  animation: any

  constructor() {
    super()
    this.state = {progressAnimation: new Animated.Value(0), showNoActiveProgramAlert: false}
    this.saveProgram = this.saveProgram.bind(this)
    this.showActionSheet = this.showActionSheet.bind(this)
    this.showAlertNoActiveProgram = this.showAlertNoActiveProgram.bind(this)
  }

  componentDidMount() {
    this.order = Object.keys(this.props.programs)
    if (this.props.programs.length === 0) this.animation.play()
    this.showAlertNoActiveProgram(this.props)
  }

  componentDidUpdate() {
    this.order = Object.keys(this.props.programs)
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

  saveProgram = (program: ServerEntity.ExercisesDay[], name: string) => {
    const newProgram: ServerEntity.Program = {
      days: program,
      active: false,
      name: name
    }
    this.props.setPrograms({program: newProgram})
  }

  showActionSheet = (data: ServerEntity.Program) => {
    const {programs, editProgram, deleteProgram} = this.props
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
          const pgAct = programs.find((pg: ServerEntity.Program) => pg.active)
          if (pgAct) editProgram({index: indexRow, program: {active: false, days: pgAct.days, name: pgAct.name}})
          editProgram({index: indexRow, program: {active: !data.active, days: data.days, name: data.name}})
        } else if (buttonIndex === 1) {
          this.props.navigation.navigate('ProgramNameDays', {
            saveProgram: editProgram,
            editedProgram: data,
            editedIndex: indexRow
          })
        } else if (buttonIndex === 2) {
          deleteProgram({index: indexRow})
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
          {(state: { opacityView: number, height: number }) => {
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
          onRowMoved={(e: any) => {
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
      </View>
    )
  }
}

const mapStateToProps = (rootState: ReduxState.RootState) => {
  return {
    programs: rootState.entities.programs
  }
}

const mapDispatchToProps =
  (dispatch: Dispatch<any>) => bindActionCreators({
    setPrograms: ProgramsActions.setPrograms,
    editProgram: ProgramsActions.editProgram,
    deleteProgram: ProgramsActions.deleteProgram
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Programs)

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
