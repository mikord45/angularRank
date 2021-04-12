import React from 'react'
import { useState, useEffect } from "react"
import { RootState } from "../../index"
import { useSelector } from "react-redux"
import { ReturningInterfaceFollowersAndRepos } from "../../api/api"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import "./AppContent.css"
import ButtonLoadMoreContributors from "../ButtonToLoadMoreContributors/ButtonToLoadMoreContributors"
import AppContentRowWithDataAboutContributor from "../AppContentRowWithDataAboutContributor/AppContentRowWithDataAboutContributor"

export default function Appcontent() {
    const allContributorsRedux = useSelector((state: RootState) => state.reduxAllContributorsWithAdditionalInfo)
    const [howManyContributorsListed, setHowManyContributorsListed] = useState<number>(10)
    const [howManyContributorsToAddWithButton, setHowManyContributorsToAddWithButton] = useState<number>(allContributorsRedux.all.length - howManyContributorsListed)
    const [contributorsToList, setContributorsToList] = useState<ReturningInterfaceFollowersAndRepos[]>([] as ReturningInterfaceFollowersAndRepos[])


    const loadMoreContributors = (howManyNew: number): void => {
        setHowManyContributorsListed(howManyContributorsListed + howManyNew)
    }

    useEffect(() => {
        setContributorsToList(allContributorsRedux.all.slice(0, howManyContributorsListed))
        const howManyContributorsLeft: number = allContributorsRedux.all.length - howManyContributorsListed
        if (howManyContributorsLeft > 10) {
            setHowManyContributorsToAddWithButton(10)
        }
        else {
            setHowManyContributorsToAddWithButton(howManyContributorsLeft)
        }
    }, [allContributorsRedux, howManyContributorsListed])

    return (
        <div className="content" >
            <TransitionGroup className="animateContributors">
                {contributorsToList.map((elem, i) => {
                    return (
                        <CSSTransition
                            key={i}
                            timeout={i}
                            className="itemToAnimateContributor">
                            <AppContentRowWithDataAboutContributor key={i} id={i + 1} userName={elem.userName} numberOfContributions={elem.numberOfContributions} numberOfRepositoriesAndGists={elem.numberOfRepositories} numberOfFollowers={elem.numberOfFollowers} />
                        </CSSTransition>
                    )
                })
                }
            </TransitionGroup>
            {howManyContributorsToAddWithButton > 0 && <ButtonLoadMoreContributors howManyNewToLoadAfterClick={howManyContributorsToAddWithButton} functionToModifyStateOfParentElement={loadMoreContributors} />}
            <div className="content__bottom" ></div>
        </div>
    )
}
