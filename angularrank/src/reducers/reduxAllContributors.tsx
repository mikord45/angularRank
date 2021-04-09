
import { ContributorData } from "../api/api"

interface ActionInterface {
    type: string,
    data: ContributorData[]
}

const reduxAllContributors = (state = { all: [] as any[] }, action: ActionInterface) => {
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