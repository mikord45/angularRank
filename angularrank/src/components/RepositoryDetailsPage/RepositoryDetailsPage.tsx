import React, { useEffect, useState } from 'react'
import "./RepositoryDetailsPage.css"
import { RouteComponentProps } from 'react-router'
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "../../index"
import { AllRepos } from "../../api/api"
import BoxForDataAboutRepository from "../BoxForDataAboutRepository/BoxForDataAboutRepository"

interface MatchParams {
    repositoryName: string;
}

interface ProperPropsForRepositoryDetailsPage extends RouteComponentProps<MatchParams> { }

export default function Repositorydetailspage(props: ProperPropsForRepositoryDetailsPage) {
    const history = useHistory()
    const allReposRedux = useSelector((state: RootState) => state.reduxAllReposFromOrganization)
    const allContributorsRedux = useSelector((state: RootState) => state.reduxAllContributorsWithAdditionalInfo)
    const [dataAboutRepository, setDataAboutRepository] = useState<AllRepos>({} as AllRepos)
    const [listOfAllContributors, setListOfAllContributors] = useState<string[]>([] as string[])

    const handleClickGoToUserPage = (userName: string) => {
        history.push(`/userDetails/${userName}`)
    }

    useEffect(() => {
        const dataAboutThisRepo = allReposRedux.all.filter((elem) => {
            if (elem.name === props.match.params.repositoryName) {
                return (elem)
            }
        })
        if (dataAboutThisRepo[0] !== undefined) {
            setDataAboutRepository(dataAboutThisRepo[0])
        }
        const allContributorsFromThisRepo = allContributorsRedux.all.filter((elem) => {
            if (elem.repos.indexOf(props.match.params.repositoryName) > -1) {
                return (elem)
            }
        })
        const allContributorsFromThisRepoUserNames: string[] = allContributorsFromThisRepo.map((elem) => {
            return (elem.userName)
        })
        setListOfAllContributors(allContributorsFromThisRepoUserNames)
    }, [allContributorsRedux, allReposRedux.all, props.match.params.repositoryName])

    return (
        <div className="repository" >
            <p className="repository__repositoryName">{props.match.params.repositoryName}</p>
            <div className="repository__boxForData">
                <BoxForDataAboutRepository dataToShow={["default_branch", "language"]} descriptions={["Default branch", "Main language"]} dataAboutRepository={dataAboutRepository} />
                <BoxForDataAboutRepository dataToShow={["watchers", "url"]} descriptions={["Watchers", "Go to github page"]} dataAboutRepository={dataAboutRepository} />
            </div>
            <div className="repository_listOfContributors">
                <p className="listOfContributors__title">List of contributors:</p>
                <div className="listOfContributors__rows">
                    {listOfAllContributors.map((elem) => {
                        return (
                            <div className="listOfContributors__row" onClick={() => { handleClickGoToUserPage(elem) }}>
                                <p>{elem}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>


    )
}
