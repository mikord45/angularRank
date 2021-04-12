import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { RootState } from "../../index"
import "./UserDetailsPage.css"
import Api, { ContributorData } from "../../api/api"
import { RouteComponentProps } from 'react-router'
import { useHistory } from "react-router-dom"
import BoxForDataAboutUser from "../BoxForDataAboutUser/BoxForDataAboutUser"
import ReturnHomeButton from "../ReturnHomeButton/ReturnHomeButton"

interface MatchParams {
    userName: string;
}

interface ProperPropsForUserDetailsPage extends RouteComponentProps<MatchParams> { }

export default function Userdetailspage(props: ProperPropsForUserDetailsPage) {
    const history = useHistory()
    const allContributorsRedux = useSelector((state: RootState) => state.reduxAllContributorsWithAdditionalInfo)
    const [listOfReposOfThisUser, setListReposOfThisUser] = useState<string[]>([] as string[])
    const [dataAboutUser, setDataAboutUser] = useState<ContributorData>({
        login: "",
        id: 0,
        node_id: "",
        avatar_url: "",
        gravatar_id: "",
        url: "",
        html_url: "",
        followers_url: "",
        following_url: "",
        gists_url: "",
        starred_url: "",
        subscriptions_url: "",
        organizations_url: "",
        repos_url: "",
        events_url: "",
        received_events_url: "",
        type: "",
        site_admin: false,
        contributions: 0,
    })

    const handleClickGoToRepositoryPage = (repositoryName: string) => {
        history.push(`/repositoryDetails/${repositoryName}`)
    }

    useEffect(() => {
        Api.getUserDetailsSimple(props.match.params.userName)
            .then((data) => {
                setDataAboutUser(data)
            })
            .catch((error) => {
                console.log("Error during fetching data about user")
            })
        const dataAboutThisContributor = allContributorsRedux.all.filter((elem) => {
            if (elem.userName === props.match.params.userName) {
                return (elem)
            }
        })
        if (dataAboutThisContributor[0] !== undefined) {
            setListReposOfThisUser(dataAboutThisContributor[0].repos)
        }
    }, [allContributorsRedux.all, props.match.params.userName])


    return (
        <React.Fragment>
            <ReturnHomeButton />
            <div className="user">
                <p className="user__userName">{props.match.params.userName}</p>
                <img className="user__avatar" src={dataAboutUser?.avatar_url} alt="####"></img>
                <div className="user__boxForData">
                    <BoxForDataAboutUser dataToShow={["html_url", "name"]} descriptions={["Go to github profile", "Name"]} dataAboutUser={dataAboutUser} />
                    <BoxForDataAboutUser dataToShow={["company", "public_repos"]} descriptions={["Company name", "Number of public repos"]} dataAboutUser={dataAboutUser} />
                    <BoxForDataAboutUser dataToShow={["public_gists", "followers"]} descriptions={["Number of public gists", "Number of followers"]} dataAboutUser={dataAboutUser} />
                </div>
                <div className="user_listOfRepos">
                    <p className="listOfRepos__title">List of repos:</p>
                    <div className="listOfRepos__rows">
                        {listOfReposOfThisUser.map((elem, i) => {
                            return (
                                <div key={i} className="listOfRepos__row" onClick={() => { handleClickGoToRepositoryPage(elem) }}>
                                    <p>{elem}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </React.Fragment>

    )
}
