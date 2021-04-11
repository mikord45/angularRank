import React from 'react'
import { useState, useEffect } from "react"
import { RootState } from "../../index"
import { useSelector } from "react-redux"
import { ReturningInterfaceFollowersAndRepos } from "../../api/api"
import "./AppContent.css"
import ButtonLoadMoreContributors from "../ButtonToLoadMoreContributors/ButtonToLoadMoreContributors"
import AppContentRowWithDataAboutContributor from "../AppContentRowWithDataAboutContributor/AppContentRowWithDataAboutContributor"

export default function Appcontent() {
    console.log("AppContentReRender")
    const allContributorsRedux = useSelector((state: RootState) => state.reduxAllContributorsWithAdditionalInfo)
    const [howManyContributorsListed, setHowManyContributorsListed] = useState<number>(30)
    const [howManyContributorsToAddWithButton, setHowManyContributorsToAddWithButton] = useState<number>(allContributorsRedux.all.length - howManyContributorsListed)
    const [contributorsToList, setContributorsToList] = useState<ReturningInterfaceFollowersAndRepos[]>([] as ReturningInterfaceFollowersAndRepos[])


    const loadMoreContributors = (howManyNew: number): void => {
        setHowManyContributorsListed(howManyContributorsListed + howManyNew)
    }

    useEffect(() => {
        setContributorsToList(allContributorsRedux.all.slice(0, howManyContributorsListed))
        const howManyContributorsLeft: number = allContributorsRedux.all.length - howManyContributorsListed
        if (howManyContributorsLeft > 30) {
            setHowManyContributorsToAddWithButton(30)
        }
        else {
            setHowManyContributorsToAddWithButton(howManyContributorsLeft)
        }

    }, [allContributorsRedux, howManyContributorsListed])

    return (
        <div className="content">
            {contributorsToList.map((elem, i) => {
                return (<AppContentRowWithDataAboutContributor key={i} id={i + 1} userName={elem.userName} numberOfContributions={elem.numberOfContributions} numberOfRepositoriesAndGists={elem.numberOfRepositories} numberOfFollowers={elem.numberOfFollowers} />)
            })
            }
            {howManyContributorsToAddWithButton > 0 && <ButtonLoadMoreContributors howManyNewToLoadAfterClick={howManyContributorsToAddWithButton} functionToModifyStateOfParentElement={loadMoreContributors} />}
        </div>
    )
}
