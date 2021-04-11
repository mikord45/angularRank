import React, { Dispatch, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../../index"
import { actionInterfaceReduxAllContributorsWithAdditionalInfo } from "../../reducers/reduxAllContributorsWithAdditionalInfo"
import { ReturningInterfaceFollowersAndRepos } from "../../api/api"
import "./AppHeader.css"

interface ProperPropsForAppHeader {
    title: string,
    propertiesOfUser: string[]
    namesOfPropertiesToSortBy: string[]
}

export default function Appheader(props: ProperPropsForAppHeader) {
    const allContributorsRedux = useSelector((state: RootState) => state.reduxAllContributorsWithAdditionalInfo)
    const dispatchForContributorsData = useDispatch<Dispatch<actionInterfaceReduxAllContributorsWithAdditionalInfo>>()
    const [currentlySortedByProperty, setCurrentlySortedByProperty] = useState<string>("")
    const [currentlySortedByOrder, setCurrentlySortedByOrder] = useState<string>("")

    const sort = (num1: number, num2: number, sortBy: keyof ReturningInterfaceFollowersAndRepos) => {
        const helper: ReturningInterfaceFollowersAndRepos[] = allContributorsRedux.all
        helper.sort((a, b) => {
            if (a[sortBy] > b[sortBy]) {
                return (num1)
            }
            else {
                return (num2)
            }
        })
        dispatchForContributorsData({ type: "setNewAdditionalContributorsData", data: helper })
    }

    const handleSort = (sortBy: keyof ReturningInterfaceFollowersAndRepos) => {
        if (currentlySortedByProperty !== sortBy) {
            setCurrentlySortedByProperty(sortBy)
            setCurrentlySortedByOrder("descending")
            sort(-1, 1, sortBy)
        }
        else if (currentlySortedByOrder === "descending") {
            setCurrentlySortedByOrder("ascending")
            sort(1, -1, sortBy)
        }
        else {
            setCurrentlySortedByOrder("descending")
            sort(-1, 1, sortBy)
        }

    }

    return (
        <div className="header">
            <div className="header__id header__part">
                <p>#</p>
            </div>
            <div className="header__title header__part" onClick={() => { handleSort(props.namesOfPropertiesToSortBy[0] as keyof ReturningInterfaceFollowersAndRepos) }} >
                <p>{props.title}</p>
            </div>
            {props.propertiesOfUser.map((elem, i) => {
                return (
                    <div key={i} className="header__propertyOfUser header__part" onClick={() => { handleSort(props.namesOfPropertiesToSortBy[i + 1] as keyof ReturningInterfaceFollowersAndRepos) }}>
                        <p>{elem}</p>
                    </div>
                )
            })
            }
        </div>
    )
}
