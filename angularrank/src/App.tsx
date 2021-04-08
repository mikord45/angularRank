import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Api from "./api/api"
import { allRepos } from "./api/api"
import { returningInterfaceFromAllRepos, returningInterfaceContributors, ReturningInterfaceFollowersAndRepos, contributorData } from "./api/api"
import { useSelector, useDispatch } from 'react-redux'

export interface ContributorDataWithFollowersAndReposNumber extends contributorData {
  numberOfRepositories: number,
  numberOfFollowers: number

}

function App() {
  console.log("render")
  let allContributors: contributorData[] = [] as contributorData[]
  let toGo: number
  const dispatch = useDispatch()
  const selector = useSelector((state: any) => state)


  const handleOnePageOfReposInOrganization = (orgName: string, page: number): void => {
    Api.getAllReposOfOrganization(orgName, page)
      .then((data: returningInterfaceFromAllRepos) => {
        dispatch({ type: "addNewReposFromOrganization", data: data.listOfRepos })
        // console.log("raz")
        if (data.last === false) {
          const currentPage: number = page + 1
          handleOnePageOfReposInOrganization(orgName, currentPage)
          // console.log("dwa")
        }
        else {
          // console.log("trzy")
          createListOfContributorsFromOrganization()
        }
      })
      .catch((error: any) => {
        console.log(`Error: ${error}`)
      })
  }

  const createListOfContributorsFromOrganization = (): void => {
    const orgName: string = "angular"
    toGo = selector.reduxAllReposFromOrganization.all.length
    for (let i: number = 0; i < selector.reduxAllReposFromOrganization.all.length; i++) {
      // console.log(i)
      // console.log(selector.reduxAllReposFromOrganization.all[i].name)
      createListOfContributorsFromOneRepo(orgName, selector.reduxAllReposFromOrganization.all[i].name, 1, [] as contributorData[])
    }

  }

  const createListOfContributorsFromOneRepo = (owner: string, repoName: string, page: number, prev: contributorData[]): void => {
    Api.getAllContributorsFromParticularRepo("angular", repoName, page)
      .then((data: returningInterfaceContributors) => {
        if (data.last === false) {
          data.listOfContributors.forEach((elem) => {
            elem.repo = repoName
          })
          const current = prev.concat(data.listOfContributors)
          const currentPage: number = page + 1
          createListOfContributorsFromOneRepo(owner, repoName, currentPage, current)
        }
        else {
          const current = prev.concat(data.listOfContributors)
          // console.log(current)
          allContributors = allContributors.concat(current)
          console.log(allContributors)
          toGo -= 1
          if (toGo === 0) {
            console.log("raz wyzerowane")
            // console.log(allContributors)
            const allContributorsAfterMerge: contributorData[] = [] as contributorData[]
            let helper: any = {}
            allContributors.forEach((now: contributorData) => {
              // console.log(now.repo)
              if (helper.hasOwnProperty(now.login)) {
                helper[now.login].contributions += now.contributions
                helper[now.login].repo.push(now.repo)
              }
              else {
                helper[now.login] = now
                helper[now.login].repo = [now.repo]
              }
            })
            for (const prop in helper) {
              allContributorsAfterMerge.push(helper[prop])
            }
            console.log(allContributorsAfterMerge)
            // const getInfoAboutContributors: Promise<number>[] = [] as Promise<number>[]
            getDataAboutContributorsWithFollowersAndReposNumber(0, allContributorsAfterMerge)
          }
        }
      })
  }

  const getDataAboutContributorsWithFollowersAndReposNumber = (startingNumber: number, listOfContributors: contributorData[]): void => {
    const nowTab: Promise<ReturningInterfaceFollowersAndRepos>[] = []
    let endingNumber: number
    if (startingNumber + 100 < listOfContributors.length) {
      endingNumber = startingNumber + 100
    }
    else {
      endingNumber = listOfContributors.length
    }
    for (let i: number = startingNumber; i < endingNumber; i++) {
      nowTab.push(Api.getUserDetails(listOfContributors[i].login, listOfContributors[i].contributions, [] as string[]))

    }
    Promise.all(nowTab)
      .then((value: ReturningInterfaceFollowersAndRepos[]) => {
        // console.log("raz")
        // console.log(value)
        dispatch({ type: "addNewAdditionalContributorsData", data: value })
        if (endingNumber !== listOfContributors.length) {
          getDataAboutContributorsWithFollowersAndReposNumber(endingNumber, listOfContributors)
        }
        else {
          console.log("koniec")
        }
      })
  }

  useEffect((): void => {
    // const allReposToUseDispatch = [] as allRepos[]
    handleOnePageOfReposInOrganization("Angular", 1)
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
