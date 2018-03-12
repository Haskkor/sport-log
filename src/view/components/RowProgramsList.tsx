import * as React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {colors} from '../../utils/colors'
import {grid} from '../../utils/grid'
import Icon from 'react-native-vector-icons/MaterialIcons'

type IProps = {
  data: ServerEntity.Program
}

type IState = {}

class RowProgramsList extends React.PureComponent<IProps, IState> {

  render() {
    const {days, name, active} = this.props.data
    const exercises = days.map((r: ServerEntity.ExercisesDay) => r.exercises.length).reduce((acc, cur) => acc + cur)
    const daysOff = days.map((r: ServerEntity.ExercisesDay) => r.isDayOff).filter((e: boolean) => e ).length
    console.warn(daysOff, days)
    return (
      <View style={styles.rowContainer}>
        <View style={styles.textContainer}>
          <View style={styles.rowContainer}>
            <Text style={styles.programName}>{name}</Text>
            <Text style={styles.textDays}>{` - ${days.length} day${days.length > 1 ? 's' : ''} program`}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.textExercises}>{`${exercises} exercise${exercises > 1 ? 's' : ''}`}</Text>
            {daysOff > 0 &&
            <Text style={styles.textExercises}>
              {` - ${daysOff} day${exercises > 1 ? 's' : ''} off`}
            </Text>}
          </View>
        </View>
        <View style={styles.iconContainer}>
          {active && <Icon name="check-circle" size={20} color={colors.valid} style={styles.icon}/> ||
          <Icon name="cancel" size={20} color={colors.base} style={styles.iconDisabled}/>}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  textContainer: {
    flexDirection: 'column',
    flex: 4
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  programName: {
    fontFamily: grid.fontBold,
    color: colors.base,
    fontSize: grid.body
  },
  textDays: {
    fontFamily: grid.font,
    color: colors.primary,
    fontSize: grid.caption
  },
  textExercises: {
    fontFamily: grid.font,
    color: colors.base,
    fontSize: grid.caption
  },
  icon: {
    marginRight: grid.unit / 2
  },
  iconDisabled: {
    marginRight: grid.unit / 2,
    opacity: grid.lowOpacity
  }
})

export default RowProgramsList
