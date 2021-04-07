import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Api from "./api/api"
import { allRepos } from "./api/api"
import { returningInterfaceFromAllRepos, returningInterfaceContributors, contributorData } from "./api/api"
import { useSelector, useDispatch } from 'react-redux'

interface ContributorDataWithFollowersAndReposNumber extends contributorData {
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
          const current = prev.concat(data.listOfContributors)
          const currentPage: number = page + 1
          createListOfContributorsFromOneRepo(owner, repoName, currentPage, current)
        }
        else {
          const current = prev.concat(data.listOfContributors)
          // console.log(current, " ", repoName)
          // console.log(current.length)
          // console.log("----------------")
          // dispatch({ type: "setNewContributorsData", data: current })
          allContributors = allContributors.concat(current)
          toGo -= 1
          if (toGo === 0) {
            console.log(allContributors)
            const allContributorsAfterMerge: contributorData[] = [] as contributorData[]
            let helper: any = {}
            allContributors.forEach((now: contributorData) => {
              if (helper.hasOwnProperty(now.login)) {
                helper[now.login].contributions += now.contributions
              }
              else {
                helper[now.login] = now
              }
            })
            for (const prop in helper) {
              allContributorsAfterMerge.push(helper[prop])
            }
            console.log(allContributorsAfterMerge)
          }
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
