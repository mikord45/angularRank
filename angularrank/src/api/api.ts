import parse from "parse-link-header"

export interface returningInterfaceFromAllRepos {
    listOfRepos: allRepos[]
    last: boolean
}

export interface returningInterfaceContributors {
    listOfContributors: contributorData[],
    last: boolean
}

export interface contributorData {
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
    contributions: number
}

export interface allRepos {
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
    license: any
    merges_url: string
    milestones_url: string
    mirror_url: any
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
    constructor() { }


    static getAllReposOfOrganization(orgName: string, page: number): Promise<returningInterfaceFromAllRepos> {
        const promiseToReturn: Promise<returningInterfaceFromAllRepos> = new Promise((resolve, reject) => {
            fetch(`${Api.baseURL}/orgs/${orgName}/repos?per_page=100&page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
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
                    const obj: returningInterfaceFromAllRepos = {
                        listOfRepos: await response.json(),
                        last: last
                    }
                    return (obj)
                })
                .then((data: returningInterfaceFromAllRepos) => {
                    resolve(data)
                })
                .catch((error: any) => {
                    console.error('Error:', error);
                    reject(error)
                });
        })

        return (promiseToReturn)
    }

    static getAllContributorsFromParticularRepo(owner: string, repoName: string, page: number): Promise<returningInterfaceContributors> {
        // console.log(page)
        const promiseToReturn: Promise<returningInterfaceContributors> = new Promise((resolve, reject) => {
            fetch(`${Api.baseURL}/repos/${owner}/${repoName}/contributors?per_page=100&page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
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
                    let obj: returningInterfaceContributors
                    if (response.status == 200) {
                        obj = {
                            listOfContributors: await response.json(),
                            last: last
                        }
                    }
                    else {
                        obj = {
                            listOfContributors: [] as contributorData[],
                            last: true
                        }
                    }
                    // console.log(obj.listOfContributors.length, " ", repoName)
                    return (obj)
                })
                .then((data: returningInterfaceContributors) => {
                    resolve(data)
                })
                .catch((error: any) => {
                    console.error('Error:', error);
                    reject(error)
                });
        })
        return (promiseToReturn)
    }


    // static getNumberOfFollowersOfParticularUser(userName: string) {
    //     fetch(`${Api.baseURL}/users/${userName}/followers`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log('Success:', data);
    //         })
    //         .catch((error) => {
    //             console.error('Error:', error);
    //         });
    // }

    static getReposOfParticularUser(userName: string) {
        fetch(`${Api.baseURL}/users/${userName}/repos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    static getUserDetails(userName: string) {
        fetch(`${Api.baseURL}/users/${userName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}