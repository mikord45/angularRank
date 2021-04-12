import React from 'react'
import "./ContributorsRankingPage.css"
import AppContent from "../AppContent/AppContent"
import AppHeader from "../AppHeader/AppHeader"

export default function Contributorsrankingpage() {


    return (
        <React.Fragment>
            <AppHeader title="User Name" propertiesOfUser={["Number of contributors", "Number of repositories and gists", "Number of Followers"]} namesOfPropertiesToSortBy={["userName", "numberOfContributions", "numberOfRepositories", "numberOfFollowers"]} />
            <AppContent />
        </React.Fragment>
    )
}
