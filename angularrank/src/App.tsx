import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Api from "./api/api"
import { allRepos } from "./api/api"
import { returningInterfaceFromAllRepos, returningInterfaceContributors, contributorData } from "./api/api"
import { useSelector, useDispatch } from 'react-redux'

function App() {
  console.log("render")
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
    // console.log("cztery")
    // console.log(selector.reduxAllReposFromOrganization)
    setTimeout(() => {
      // console.log(sel)
    }, 5000)
    const orgName: string = "angular"
    for (let i: number = 0; i < selector.reduxAllReposFromOrganization.all.length; i++) {
      console.log(i)
      createListOfContributorsFromOneRepo(orgName, selector.reduxAllReposFromOrganization.all[i].name, 1, [] as contributorData[])
    }

  }

  const createListOfContributorsFromOneRepo = (owner: string, repoName: string, page: number, prev: contributorData[]): void => {
    console.log("raz")
    Api.getAllContributorsFromParticularRepo("angular", "angular-jquery-ui", 1)
      .then((data: returningInterfaceContributors) => {
        if (data.last === false) {
          const current = prev.concat(data.listOfContributors)
          const currentPage: number = page + 1
          createListOfContributorsFromOneRepo(owner, repoName, currentPage, current)
        }
        else {
          dispatch({ type: "setNewContributorsData", data: data.listOfContributors })
        }
      })
      .catch((error: any) => {
        console.log(`Error: ${error}`)
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
