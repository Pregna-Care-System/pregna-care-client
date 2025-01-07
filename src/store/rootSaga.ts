import { all } from 'redux-saga/effects'
import { watchEditorGlobalSaga } from './modules/global/saga'

export default function* rootSaga() {
  yield all([watchEditorGlobalSaga()])
}
