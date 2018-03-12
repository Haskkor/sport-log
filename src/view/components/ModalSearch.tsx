import * as React from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Modal, StatusBar} from 'react-native'
import SearchList from '@unpourtous/react-native-search-list'
import {grid} from '../../utils/grid'
import {colors} from '../../utils/colors'

type IProps = {
  exercises: ServerEntity.MuscleGroups[]
  closeModal: (close: boolean) => void
  selectExercise: (exercise: string, muscle: string, equipment?: string) => void
}

type IState = {
  dataSource: ItemList[]
}

type ItemList = { searchStr: string, exercise: string, muscle: string, equipment: string }

class ModalSearch extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {dataSource: []}
  }

  componentDidMount() {
    const dataSource = this.props.exercises.map((m: ServerEntity.MuscleGroups) =>
      m.exercises.map((e: ServerEntity.ExerciseMuscle) => {
        return {
          searchStr: `${e.name} (${e.equipment}) - ${m.muscle}`,
          searchKey: m.exercises.length + m.muscle + e.equipment + e.name,
          exercise: e.name,
          muscle: m.muscle,
          equipment: e.equipment
        }
      })
    )
    this.setState({dataSource: [].concat.apply([], dataSource)})
  }

  renderRow(item: ItemList, rowID: string) {
    return (
      <View key={rowID + item} style={styles.row}>
        <TouchableOpacity onPress={() => this.props.selectExercise(item.exercise, item.muscle, item.equipment)}>
          <Text style={styles.itemListText}>{item.searchStr}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderSectionHeader(sectionData: any, sectionID: string) {
    if (!sectionID) {
      return (
        <View/>)
    } else {
      return (
        <View key={sectionData + sectionID} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{sectionID}</Text>
        </View>)
    }
  }

  emptyContent(searchStr: string) {
    return (
      <View style={styles.emptyContentView}>
        <Text style={styles.emptyContentText}> No result for <Text
          style={styles.emptyContentTextBold}>{searchStr}</Text></Text>
        <Text style={styles.emptyContentSearchAgain}>Please search again</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.searchListView}>
        <StatusBar barStyle="light-content"/>
        <Modal
          onRequestClose={() => console.log('close')}
          visible={true}
          transparent={true}
          animationType="slide">
          <SearchList
            data={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            emptyContent={this.emptyContent.bind(this)}
            renderSectionHeader={this.renderSectionHeader.bind(this)}
            cellHeight={grid.unit * 2.5}
            title="Search List"
            searchPlaceHolder="Search"
            customSearchBarStyle={{fontSize: grid.body}}
            onClickBack={() => {
              this.props.closeModal(true)
            }}
            leftButtonStyle={{justifyContent: 'flex-start'}}
            backIconStyle={{width: 8.5, height: 17}}
            activeSearchBarColor={colors.white}
            showActiveSearchIcon
            searchBarActiveColor="#171A23"
          />
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  searchListView: {
    flex: 1,
    backgroundColor: colors.lightAlternative,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  row: {
    flex: 1,
    marginLeft: grid.unit * 2.5,
    height: grid.unit * 2.5,
    justifyContent: 'center'
  },
  emptyContentView: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: grid.unit * 3
  },
  emptyContentText: {
    fontFamily: grid.font,
    color: colors.inactiveTintColorTabNav,
    fontSize: grid.subHeader,
    paddingTop: grid.unit * 1.25
  },
  emptyContentTextBold: {
    fontFamily: grid.fontBold,
    color: colors.base,
    fontSize: grid.subHeader
  },
  emptyContentSearchAgain: {
    fontFamily: grid.font,
    color: colors.inactiveTintColorTabNav,
    fontSize: grid.subHeader,
    alignItems: 'center',
    paddingTop: grid.unit * 1.25
  },
  itemListText: {
    fontFamily: grid.font,
    color: colors.base
  },
  sectionHeader: {
    height: 18,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: grid.unit * 1.5,
    backgroundColor: colors.lightAlternative
  },
  sectionTitle: {
    color: colors.inactiveTintColorTabNav,
    fontFamily: grid.font,
    fontSize: grid.body
  }
})

export default ModalSearch
