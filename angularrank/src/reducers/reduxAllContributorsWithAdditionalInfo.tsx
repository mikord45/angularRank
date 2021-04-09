
import { ContributorDataWithFollowersAndReposNumber } from "../App"

interface actionInterface {
    type: string,
    data: ContributorDataWithFollowersAndReposNumber
}

const reduxAllContributorsWithAdditionalInfo = (state = { all: [] as ContributorDataWithFollowersAndReposNumber[] }, action: actionInterface) => {
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