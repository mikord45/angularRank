
import { ReturningInterfaceFollowersAndRepos } from "../api/api"
export interface actionInterfaceReduxAllContributorsWithAdditionalInfo {
    type: string,
    data: ReturningInterfaceFollowersAndRepos[]
}

const reduxAllContributorsWithAdditionalInfo = (state = { all: [] as ReturningInterfaceFollowersAndRepos[] }, action: actionInterfaceReduxAllContributorsWithAdditionalInfo) => {
    switch (action.type) {
        case "setNewAdditionalContributorsData":
            return Object.assign({}, state, {
                all: action.data
            })
        case "addNewAdditionalContributorsData":
            const current = state.all.concat(action.data)
            Object.assign(state.all, current)
            return { ...state }
        default:
            return state
    }
}
export default reduxAllContributorsWithAdditionalInfo