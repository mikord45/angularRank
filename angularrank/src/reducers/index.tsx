import reduxAllReposFromOrganization from "./reduxAllReposFromOrganization"
import reduxAllContributors from "./reduxAllContributors"
import reduxAllContributorsWithAdditionalInfo from "./reduxAllContributorsWithAdditionalInfo"
import { combineReducers } from "redux"

const rootReducer = combineReducers({
    reduxAllReposFromOrganization: reduxAllReposFromOrganization,
    reduxAllContributors: reduxAllContributors,
    reduxAllContributorsWithAdditionalInfo: reduxAllContributorsWithAdditionalInfo
})
export default rootReducer