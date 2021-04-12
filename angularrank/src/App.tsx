import React, { Dispatch, useEffect } from 'react';
import './App.css';
import Api from "./api/api"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { ReturningInterfaceFromAllRepos, ReturningInterfaceContributors, ReturningInterfaceFollowersAndRepos, ContributorData, ContributorDataWithReposInformation } from "./api/api"
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from "./index"
import { actionInterfaceReduxAllContributorsWithAdditionalInfo } from "./reducers/reduxAllContributorsWithAdditionalInfo"
import { actionInterfaceReduxAllReposFromOrganization } from "./reducers/reduxAllReposFromOrganization"
import ContributorsRankingPage from "./components/ContributorsRankingPage/ContributorsRankingPage"
import UserDetailsPage from "./components/UserDetailsPage/UserDetailsPage"
import RepositoryDetailsPage from "./components/RepositoryDetailsPage/RepositoryDetailsPage"
export interface ContributorDataWithFollowersAndReposNumber extends ContributorDataWithReposInformationArrayVersion {
  numberOfRepositories: number,
  numberOfFollowers: number
}

export interface ContributorDataWithReposInformationArrayVersion extends ContributorData {
  repo: string[]
}

function App() {
  // console.log("render")
  let allContributors: ContributorDataWithReposInformation[] = [] as ContributorDataWithReposInformation[]
  let toGo: number
  const dispatchForReposData = useDispatch<Dispatch<actionInterfaceReduxAllReposFromOrganization>>()
  const dispatchForContributorsData = useDispatch<Dispatch<actionInterfaceReduxAllContributorsWithAdditionalInfo>>()
  const selector = useSelector((state: RootState) => state)


  const handleOnePageOfReposInOrganization = (orgName: string, page: number): void => {
    Api.getAllReposOfOrganization(orgName, page)
      .then((data: ReturningInterfaceFromAllRepos) => {
        dispatchForReposData({ type: "addNewReposFromOrganization", data: data.listOfRepos })
        if (data.last === false) {
          const currentPage: number = page + 1
          handleOnePageOfReposInOrganization(orgName, currentPage)
        }
        else {
          createListOfContributorsFromOrganization(orgName)
        }
      })
      .catch((error) => {
        console.log(`Error: ${error}`)
        //ustaw odpowiedni state aplikacji
      })
  }

  const createListOfContributorsFromOrganization = (orgName: string): void => {
    // const orgName: string = "angular"
    toGo = selector.reduxAllReposFromOrganization.all.length
    for (let i: number = 0; i < selector.reduxAllReposFromOrganization.all.length; i++) {
      createListOfContributorsFromOneRepo(orgName, selector.reduxAllReposFromOrganization.all[i].name, 1, [] as ContributorDataWithReposInformation[])
    }
  }

  const createListOfContributorsFromOneRepo = (owner: string, repoName: string, page: number, prev: ContributorDataWithReposInformation[]): void => {
    Api.getAllContributorsFromParticularRepo(owner, repoName, page)
      .then((data: ReturningInterfaceContributors) => {
        if (data.last === false) {
          data.listOfContributors.forEach((elem) => {
            elem.repo = repoName
          })
          const current = prev.concat(data.listOfContributors)
          const currentPage: number = page + 1
          createListOfContributorsFromOneRepo(owner, repoName, currentPage, current)
        }
        else {
          const current: ContributorDataWithReposInformation[] = prev.concat(data.listOfContributors)
          allContributors = allContributors.concat(current)
          toGo -= 1
          if (toGo === 0) {
            mergeContributors()
          }
        }
      })
      .catch((error) => {
        ////ustaw state
      })
  }

  const mergeContributors = () => {
    const allContributorsAfterMerge: ContributorDataWithReposInformationArrayVersion[] = [] as ContributorDataWithReposInformationArrayVersion[]
    let helper: { [key: string]: ContributorDataWithReposInformationArrayVersion } = {}
    allContributors.forEach((now: ContributorDataWithReposInformation) => {
      if (helper.hasOwnProperty(now.login)) {
        helper[now.login].contributions += now.contributions
        helper[now.login].repo.push(now.repo)
      }
      else {
        helper[now.login] = {
          ...now,
          repo: []
        }
        if (typeof (now.repo) == "string") {
          helper[now.login].repo = [now.repo]
        }
      }
    })
    for (const prop in helper) {
      allContributorsAfterMerge.push(helper[prop])
    }
    console.log(allContributorsAfterMerge)
    getDataAboutContributorsWithFollowersAndReposNumber(0, allContributorsAfterMerge)
  }

  const getDataAboutContributorsWithFollowersAndReposNumber = (startingNumber: number, listOfContributors: ContributorDataWithReposInformationArrayVersion[]): void => {
    const nowTab: Promise<ReturningInterfaceFollowersAndRepos>[] = []
    let endingNumber: number
    if (startingNumber + 100 < listOfContributors.length) {
      endingNumber = startingNumber + 100
    }
    else {
      endingNumber = listOfContributors.length
    }
    for (let i: number = startingNumber; i < endingNumber; i++) {
      nowTab.push(Api.getUserDetails(listOfContributors[i].login, listOfContributors[i].contributions, listOfContributors[i].repo as string[]))

    }
    Promise.all(nowTab)
      .then((value: ReturningInterfaceFollowersAndRepos[]) => {
        dispatchForContributorsData({ type: "addNewAdditionalContributorsData", data: value })
        if (endingNumber !== listOfContributors.length) {
          getDataAboutContributorsWithFollowersAndReposNumber(endingNumber, listOfContributors)
        }
        else {
          window.localStorage.setItem("repos", JSON.stringify(selector.reduxAllReposFromOrganization.all))
          window.localStorage.setItem("contributors", JSON.stringify(selector.reduxAllContributorsWithAdditionalInfo.all))
        }
      })
      .catch(() => {
        //ustaw odwiedni state
      })
  }

  useEffect((): void => {
    if (window.localStorage.repos === undefined || window.localStorage.contributors === undefined) {
      handleOnePageOfReposInOrganization("Angular", 1)
    }
    else {
      console.log(JSON.parse(window.localStorage.contributors))
      dispatchForReposData({ type: "setNewReposFromOrganization", data: JSON.parse(window.localStorage.repos) })
      dispatchForContributorsData({ type: "setNewAdditionalContributorsData", data: JSON.parse(window.localStorage.contributors) })
    }
  }, [])


  return (
    <div className="main">
      <Router>
        <Switch>
          <Route exact path="/" component={ContributorsRankingPage} />
          <Route path="/userDetails/:userName" component={UserDetailsPage} />
          <Route path="/repositoryDetails/:repositoryName" component={RepositoryDetailsPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
