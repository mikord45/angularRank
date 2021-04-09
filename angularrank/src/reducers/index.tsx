import reduxAllReposFromOrganization from "./reduxAllReposFromOrganization"
import reduxAllContributorsWithAdditionalInfo from "./reduxAllContributorsWithAdditionalInfo"
import { combineReducers } from "redux"

export type RootState = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    reduxAllReposFromOrganization: reduxAllReposFromOrganization,
    reduxAllContributorsWithAdditionalInfo: reduxAllContributorsWithAdditionalInfo
})
export default rootReducer