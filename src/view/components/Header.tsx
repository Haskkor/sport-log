import * as React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {grid} from '../../utils/grid'
import {colors} from '../../utils/colors'
import {HeaderStatus} from '../../core/enums'
import {NavigationAction, NavigationRoute, NavigationScreenProp} from 'react-navigation'

type IProps = {
  primaryIconDisabled?: boolean
  navigation?: NavigationScreenProp<NavigationRoute<>, NavigationAction>
  textColor: string
  colorHeader: string
  colorBorder: string
  title: string
  secondaryIcon?: string
  secondaryText?: string
  secondaryEnabled?: boolean
  secondaryFunction?: () => void
  status: HeaderStatus
}

type IState = {}

class Header extends React.PureComponent<IProps, IState> {
  render() {
    const {navigation, textColor, colorBorder, colorHeader, title, secondaryFunction, secondaryIcon, status,
      secondaryText, secondaryEnabled, primaryIconDisabled} = this.props
    return (
      <View style={[styles.header, {borderColor: colorBorder, backgroundColor: colorHeader}]}>
        <View style={[styles.viewSemiFlex, styles.primaryIconView, {opacity: primaryIconDisabled ? 0.5 : 1}]}>
          {status === HeaderStatus.drawer &&
          <TouchableOpacity disabled={primaryIconDisabled} onPress={() => navigation.navigate('DrawerOpen')}>
            <Icon name="fitness-center" size={grid.navIcon} color={textColor}/>
          </TouchableOpacity> || status === HeaderStatus.stack &&
          <TouchableOpacity disabled={primaryIconDisabled} style={styles.containerButtonBack} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={grid.navIcon} color={colors.base} style={styles.icon}/>
            <Text style={styles.text}>Back</Text></TouchableOpacity>}
        </View>
        <View style={styles.viewFlex}>
          <Text style={[styles.title, {color: textColor}]}>{title}</Text>
        </View>
        <View style={[styles.viewSemiFlex, styles.secondaryIconView, {opacity: !secondaryEnabled ? grid.lowOpacity : 1}]}>
          {secondaryIcon &&
          <TouchableOpacity
            onPress={() => secondaryFunction()}
            disabled={!secondaryEnabled}
            style={styles.containerButtonBack}>
            {secondaryText && <Text style={styles.text}>{secondaryText}</Text>}
            <Icon name={secondaryIcon} style={styles.iconRight} size={grid.navIcon} color={textColor}/>
          </TouchableOpacity>}
        </View>
      </View>
    )
  }
}

export default Header

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: grid.smallBorder,
    paddingTop: grid.unit * 2,
    paddingBottom: grid.unit,
    flexDirection: 'row'
  },
  title: {
    color: colors.base,
    alignSelf: 'center'
  },
  pickerItem: {
    fontSize: grid.subHeader
  },
  viewFlex: {
    flex: 1
  },
  viewSemiFlex: {
    flex: 0.5
  },
  primaryIconView: {
    marginLeft: grid.unit * 1.25,
    alignItems: 'flex-start'
  },
  secondaryIconView: {
    marginRight: grid.unit * 1.25,
    alignItems: 'flex-end'
  },
  containerButtonBack: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  containerButtonRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontSize: grid.caption,
    color: colors.base
  },
  icon: {
    paddingRight: grid.unit
  },
  iconRight: {
    paddingLeft: grid.unit
  }
})
