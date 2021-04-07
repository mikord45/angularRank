
import { allRepos, contributorData } from "../api/api"

interface actionInterface {
    type: string,
    data: contributorData[]
}

const reduxAllContributors = (state = { all: [] as any[] }, action: actionInterface) => {
    switch (action.type) {
        case "setNewContributorsData":
            return Object.assign({}, state, {
                all: action.data
            })
        case "addNewContributorsData":
            const current = state.all.concat(action.data)
            Object.assign(state.all, current)
            return { ...state }
        default:
            return state
    }
}
export default reduxAllContributors