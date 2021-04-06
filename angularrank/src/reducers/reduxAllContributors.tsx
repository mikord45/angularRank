
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
            // console.log(action.data)
            let current = state.all.concat(action.data)

            return Object.assign({}, state, {
                all: current
            })
        default:
            return state
    }
}
export default reduxAllContributors