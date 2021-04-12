import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom"
import "./ContributorsRankingPage.css"
import AppContent from "../AppContent/AppContent"
import AppHeader from "../AppHeader/AppHeader"

interface ProperPropsForContributorsRankingPage {
    updateAppFunction: () => void
}

export default function Contributorsrankingpage(props: ProperPropsForContributorsRankingPage) {
    const history = useHistory()

    useEffect(() => {
        if (window.localStorage.repos === undefined || window.localStorage.contributors === undefined) {
            history.push("/loadingPage")
        }
    })

    return (
        <React.Fragment>
            <div className="app_updateApp" onClick={props.updateAppFunction}>
                <p>Refresh App</p>
            </div>
            <AppHeader title="User Name" propertiesOfUser={["Number of contributors", "Number of repositories and gists", "Number of Followers"]} namesOfPropertiesToSortBy={["userName", "numberOfContributions", "numberOfRepositories", "numberOfFollowers"]} />
            <AppContent />
        </React.Fragment>
    )
}
