import React, { Dispatch, useEffect } from 'react';
import './App.css';
import Api from "./api/api"
import { ReturningInterfaceFromAllRepos, ReturningInterfaceContributors, ReturningInterfaceFollowersAndRepos, ContributorData, ContributorDataWithReposInformation } from "./api/api"
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from "./index"
import { actionInterfaceReduxAllContributorsWithAdditionalInfo } from "./reducers/reduxAllContributorsWithAdditionalInfo"
import { actionInterfaceReduxAllReposFromOrganization } from "./reducers/reduxAllReposFromOrganization"
import AppContent from "./components/AppContent/AppContent"
import AppHeader from "./components/AppHeader/AppHeader"

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
          console.log("koniec")
        }
      })
      .catch(() => {
        //ustaw odwiedni state
      })
  }

  useEffect((): void => {
    handleOnePageOfReposInOrganization("Angular", 1)
  }, [])


  return (
    <div className="main">
      <AppHeader title="User Name" propertiesOfUser={["Number of contributors", "Number of repositories and gists", "Number of Followers"]} namesOfPropertiesToSortBy={["userName", "numberOfContributions", "numberOfRepositories", "numberOfFollowers"]} />
      <AppContent />
      {/* {selector.reduxAllContributorsWithAdditionalInfo.all.map((elem) => {
        return (<p>{elem.userName}</p>)
      })} */}
    </div>
  );
}

export default App;
