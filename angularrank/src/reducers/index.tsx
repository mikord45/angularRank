import reduxAllReposFromOrganization from "./reduxAllReposFromOrganization"
import reduxAllContributors from "./reduxAllContributors"
import { combineReducers } from "redux"

const rootReducer = combineReducers({
    reduxAllReposFromOrganization: reduxAllReposFromOrganization,
    reduxAllContributors: reduxAllContributors
})
export default rootReducer