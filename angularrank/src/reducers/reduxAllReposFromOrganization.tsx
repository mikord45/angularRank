
import { AllRepos } from "../api/api"

interface actionInterface {
    type: string,
    data: AllRepos[]
}

const reduxAllReposFromOrganization = (state = { all: [] as AllRepos[] }, action: actionInterface) => {
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