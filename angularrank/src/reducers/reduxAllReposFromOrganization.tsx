
import { AllRepos } from "../api/api"

export interface actionInterfaceReduxAllReposFromOrganization {
    type: string,
    data: AllRepos[]
}

const reduxAllReposFromOrganization = (state = { all: [] as AllRepos[] }, action: actionInterfaceReduxAllReposFromOrganization) => {
    switch (action.type) {
        case "setNewReposFromOrganization":
            return Object.assign({}, state, {
                all: action.data
            })
        case "addNewReposFromOrganization":
            const current = state.all.concat(action.data)
            Object.assign(state.all, current)
            return { ...state }
        default:
            return state
    }
}
export default reduxAllReposFromOrganization