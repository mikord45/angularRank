import parse from "parse-link-header"


export interface ReturningInterfaceFollowersAndRepos {
    numberOfRepositories: number,
    numberOfFollowers: number,
    userName: string,
    numberOfContributions: number,
    repos: string[]
}


export interface ReturningInterfaceContributors {
    listOfContributors: ContributorDataWithReposInformation[],
    last: boolean,
}
export interface ReturningInterfaceFromAllRepos {
    listOfRepos: AllRepos[]
    last: boolean
}



export interface ContributorDataWithReposInformation extends ContributorData {
    repo: string
}


export interface ContributorData {
    [index: string]: string | number | boolean | string[]
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    site_admin: boolean,
    contributions: number,
}

export interface AllRepos {
    [index: string]: string | number | boolean | Object
    archive_url: string
    archived: boolean
    assignees_url: string
    blobs_url: string
    branches_url: string
    clone_url: string
    collaborators_url: string
    comments_url: string
    commits_url: string
    compare_url: string
    contents_url: string
    contributors_url: string
    created_at: string
    default_branch: string
    deployments_url: string
    description: string
    disabled: boolean
    downloads_url: string
    events_url: string
    fork: boolean
    forks: number
    forks_count: number
    forks_url: string
    full_name: string
    git_commits_url: string
    git_refs_url: string
    git_tags_url: string
    git_url: string
    has_downloads: boolean
    has_issues: boolean
    has_pages: boolean
    has_projects: boolean
    has_wiki: string
    homepage: string
    hooks_url: string
    html_url: string
    id: number
    issue_comment_url: string
    issue_events_url: string
    issues_url: string
    keys_url: string
    labels_url: string
    language: string
    languages_url: string
    license: Object
    merges_url: string
    milestones_url: string
    mirror_url: Object
    name: string
    node_id: string
    notifications_url: string
    open_issues: number
    open_issues_count: number
    owner: object
    permissions: object
    private: boolean
    pulls_url: string
    pushed_at: string
    releases_url: string
    size: number
    ssh_url: string
    stargazers_count: number
    stargazers_url: string
    statuses_url: string
    subscribers_url: string
    subscription_url: string
    svn_url: string
    tags_url: string
    teams_url: string
    trees_url: string
    updated_at: string
    url: string
    watchers: number
    watchers_count: number
}

export default class Api {
    static baseURL: string = "https://api.github.com"


    static getAllReposOfOrganization(orgName: string, page: number): Promise<ReturningInterfaceFromAllRepos> {
        const promiseToReturn: Promise<ReturningInterfaceFromAllRepos> = new Promise((resolve, reject) => {
            fetch(`${Api.baseURL}/orgs/${orgName}/repos?per_page=100&page=${page}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'token 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',
                },
            })
                .then(async (response) => {
                    const info: parse.Links | null = parse(response.headers.get("link") as string)
                    let last: boolean
                    if (info != null) {
                        if (info.next) {
                            last = false
                        }
                        else {
                            last = true
                        }
                    }
                    else {
                        last = true
                    }
                    const obj: ReturningInterfaceFromAllRepos = {
                        listOfRepos: await response.json(),
                        last: last
                    }
                    return (obj)
                })
                .then((data: ReturningInterfaceFromAllRepos) => {
                    resolve(data)
                })
                .catch((error) => {
                    console.error('Error:', error);
                    reject(error)
                });
        })

        return (promiseToReturn)
    }

    static getAllContributorsFromParticularRepo(owner: string, repoName: string, page: number): Promise<ReturningInterfaceContributors> {
        const promiseToReturn: Promise<ReturningInterfaceContributors> = new Promise((resolve, reject) => {
            fetch(`${Api.baseURL}/repos/${owner}/${repoName}/contributors?per_page=100&page=${page}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'token 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',
                },
            })
                .then(async (response) => {
                    const info: parse.Links | null = parse(response.headers.get("link") as string)
                    let last: boolean
                    if (info != null) {
                        if (info.next) {
                            last = false
                        }
                        else {
                            last = true
                        }
                    }
                    else {
                        last = true
                    }
                    let obj: ReturningInterfaceContributors
                    if (response.status === 200) {
                        const listOfContributorsHelper: Array<ContributorData> = await response.json()
                        const listOfContributorsHelper2: Array<ContributorDataWithReposInformation> = listOfContributorsHelper.map((elem) => {
                            const obj = {
                                ...elem,
                                repo: repoName
                            }
                            return (obj)
                        })
                        obj = {
                            listOfContributors: listOfContributorsHelper2,
                            last: last,
                        }
                    }
                    else {
                        obj = {
                            listOfContributors: [] as ContributorDataWithReposInformation[],
                            last: true,
                        }
                    }
                    return (obj)
                })
                .then((data: ReturningInterfaceContributors) => {
                    resolve(data)
                })
                .catch((error) => {
                    console.error('Error:', error);
                    reject(error)
                });
        })
        return (promiseToReturn)
    }

    static getUserDetailsSimple(userName: string): Promise<ContributorData> {
        const promiseToReturn: Promise<ContributorData> = new Promise((resolve, reject) => {
            fetch(`${Api.baseURL}/users/${userName}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'token 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',
                },
            })
                .then(response => response.json())
                .then(data => {
                    resolve(data)
                })
                .catch((error) => {
                    console.error('Error:', error);
                    reject(error)
                });
        })
        return (promiseToReturn)
    }

    static getUserDetails(userName: string, contributions: number, repos: string[]): Promise<ReturningInterfaceFollowersAndRepos> {
        const promiseToReturn: Promise<ReturningInterfaceFollowersAndRepos> = new Promise((resolve, reject) => {
            fetch(`${Api.baseURL}/users/${userName}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'token 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',
                },
            })
                .then(response => response.json())
                .then(data => {
                    const obj: ReturningInterfaceFollowersAndRepos = {
                        numberOfRepositories: data.public_repos + data.public_gists,
                        numberOfFollowers: data.followers,
                        userName: userName,
                        numberOfContributions: contributions,
                        repos: repos
                    }
                    resolve(obj)
                })
                .catch((error) => {
                    console.error('Error:', error);
                    const obj: ReturningInterfaceFollowersAndRepos = {
                        numberOfRepositories: 0,
                        numberOfFollowers: 0,
                        userName: userName,
                        numberOfContributions: contributions,
                        repos: repos
                    }
                    reject(obj)
                });
        })
        return (promiseToReturn)
    }
}