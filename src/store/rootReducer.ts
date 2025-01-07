import { combineReducers } from 'redux'
import globalReducer from '@store/modules/global/slice'

const rootReducer = combineReducers({
  global: globalReducer
})

export default rootReducer
