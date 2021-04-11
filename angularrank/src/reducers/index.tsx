import reduxAllReposFromOrganization from "./reduxAllReposFromOrganization"
import reduxAllContributorsWithAdditionalInfo from "./reduxAllContributorsWithAdditionalInfo"
import { combineReducers } from "redux"
// import { configureStore } from "@reduxjs/toolkit"

const rootReducer = combineReducers({
    reduxAllReposFromOrganization: reduxAllReposFromOrganization,
    reduxAllContributorsWithAdditionalInfo: reduxAllContributorsWithAdditionalInfo
})
export default rootReducer