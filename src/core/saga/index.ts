import axios, * as Axios from 'axios'
import { put, takeLatest } from 'redux-saga/effects'
import * as appDuck from '../modules/container/App'
import * as history from '../modules/entities/history'
import {Action} from 'redux-actions'
import config from '../../utils/config'
import * as constants from '../../utils/constants'

function* loadData (action: Action<appDuck.LoadDataStartPayload>) {
  try {
    const response: Axios.AxiosResponse = yield axios({
      method: 'get',
      url: `${config.serverApi}/form/${action.payload.id}`
    })
    yield put(appDuck.loadDataSuccess(response))
  } catch (err) {
    console.warn('loadDataFailed failed', err)
    yield put(appDuck.loadDataFail(err))
  }
}

function* loadHistory (action: Action<history.LoadHistoryStartPayload>) {
  try {

    // todo FINISH THIS

    console.log('saga')
    const data: ServerEntity.History = constants.fakeHistory

    console.log(data)
    console.log(action.payload.currentTimestamp)

    const result: ServerEntity.History = data.filter((d: ServerEntity.HistoryDate) => {
      return d.timestamp
    })


    yield put(history.loadHistorySuccess({data: result}))
  } catch (err) {
    console.warn('loadHistory failed', err)
    yield put(history.loadHistoryFail(err))
  }
}

function* root () {
  yield takeLatest(appDuck.LOAD_DATA_START, loadData)
  yield takeLatest(history.LOAD_HISTORY_START, loadHistory)
}

export default root
