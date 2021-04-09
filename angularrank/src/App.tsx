import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Api from "./api/api"
import { RootState } from "./reducers/index"
import { ReturningInterfaceFromAllRepos, ReturningInterfaceContributors, ReturningInterfaceFollowersAndRepos, ContributorData, ContributorDataWithReposInformation } from "./api/api"
import { useSelector, useDispatch } from 'react-redux'

export interface ContributorDataWithFollowersAndReposNumber extends ContributorData {
  numberOfRepositories: number,
  numberOfFollowers: number
}

export interface ContributorDataWithReposInformationArrayVersion extends ContributorData {
  repo: string[]
}

function App() {
  console.log("render")
  let allContributors: ContributorDataWithReposInformation[] = [] as ContributorDataWithReposInformation[]
  let toGo: number
  const dispatch = useDispatch()
  const selector = useSelector((state: RootState) => state)


  const handleOnePageOfReposInOrganization = (orgName: string, page: number): void => {
    Api.getAllReposOfOrganization(orgName, page)
      .then((data: ReturningInterfaceFromAllRepos) => {
        dispatch({ type: "addNewReposFromOrganization", data: data.listOfRepos })
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
        dispatch({ type: "addNewAdditionalContributorsData", data: value })
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
    handleOnePageOfReposInOrganization("angular", 1)
  }, [])


  return (
    <div className="main">
    </div>
  );
}

export default App;
