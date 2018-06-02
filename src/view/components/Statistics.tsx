import * as React from 'react'
import {StyleSheet, ScrollView, Text} from 'react-native'
import {connect, Dispatch} from 'react-redux'
import {bindActionCreators} from 'redux'
import {compose, graphql} from 'react-apollo'
import {dataHistoryDateUser} from '../../utils/gaphqlData'
import {HISTORY_DATE_USER} from '../../utils/gqls'
import {colors} from '../../utils/colors'
import Panel from './Panel'

type IProps = {
  data: dataHistoryDateUser
}

type IState = {
}

class Statistics extends React.PureComponent<IProps, IState> {

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Panel title="A Panel with short content text">
          <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
        </Panel>
        <Panel title="A Panel with long content text">
          <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In hendrerit bibendum enim ac vulputate. Donec condimentum, sapien in bibendum rutrum, risus sem cursus lacus, sit amet vulputate lectus lorem sit amet diam. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec a posuere odio. Aliquam tempor velit nec ligula rhoncus, nec placerat arcu aliquam. Nam volutpat finibus bibendum. Nullam ut massa aliquam, pharetra quam quis, porttitor neque. Morbi ut mollis nisi, ac dignissim nisl. Nunc egestas nulla vitae laoreet rutrum. Phasellus a neque sed turpis viverra feugiat. Aliquam gravida non metus eu pretium. Nunc pellentesque tellus et mauris vehicula aliquam. Donec eu ultrices odio.</Text>
        </Panel>
        <Panel title="Another Panel">
          <Text>Lorem ipsum dolor sit amet...</Text>
        </Panel>
      </ScrollView>
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
    flex            : 1,
    backgroundColor : colors.lightAlternative,
    paddingTop      : 30
  }
})
