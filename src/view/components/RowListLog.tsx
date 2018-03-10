import * as React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {colors} from '../../utils/colors'
import {grid} from '../../utils/grid'

type IProps = {
  data: ServerEntity.ExerciseSet
}

type IState = {}

class RowListLog extends React.PureComponent<IProps, IState> {
  render() {
    const {exercise, muscleGroup, sets, recoveryTime} = this.props.data
    return (
      <View>
        <Text style={styles.setName}>{`${muscleGroup}, ${exercise.name}`}</Text>
        <Text style={styles.textMedium}>{`Recovery: ${recoveryTime}`}</Text>
        <Text numberOfLines={1} style={styles.textContainer}>
          <Text style={styles.textEquipment}>{`${exercise.equipment}   `}</Text>
          {sets.map((set: ServerEntity.Set, index: number) =>
            <Text key={set.toString() + index} style={styles.set}>{`${set.reps} x ${set.weight}kg   `}</Text>
          )}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  setName: {
    fontFamily: grid.fontBold,
    color: colors.base
  },
  set: {
    marginRight: grid.unit,
    color: colors.base
  },
  textContainer: {
    fontFamily: grid.font,
    marginRight: grid.unit * 2.5
  },
  textEquipment: {
    fontFamily: grid.font,
    color: colors.primary
  },
  textMedium: {
    fontFamily: grid.fontMedium,
    color: colors.base
  }
})

export default RowListLog
