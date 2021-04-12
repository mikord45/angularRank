import React, { useState } from 'react'
import "./AppContentRowWithDataAboutContributor.css"
import { useHistory } from "react-router-dom"

interface ProperPropsForAppContentRowWithDataAboutContributor {
    id: number
    userName: string
    numberOfContributions: number,
    numberOfRepositoriesAndGists: number,
    numberOfFollowers: number
}

export default function Appcontentrowwithdataaboutcontributor(props: ProperPropsForAppContentRowWithDataAboutContributor) {
    const history = useHistory()
    const handleClickGoToUserPage = (userName: string) => {
        history.push(`/userDetails/${userName}`)
    }

    return (
        <React.Fragment>
            <div className="content__row" onClick={() => { handleClickGoToUserPage(props.userName) }}>
                <div className="row__part">
                    <p>
                        {props.id}
                    </p>
                </div>
                <div className="row__part">
                    <p>
                        {props.userName}
                    </p>
                </div>
                <div className="row__part">
                    <p>
                        {props.numberOfContributions}
                    </p>
                </div>
                <div className="row__part">
                    <p>
                        {props.numberOfRepositoriesAndGists}
                    </p>
                </div>
                <div className="row__part">
                    <p>
                        {props.numberOfFollowers}
                    </p>
                </div>

            </div>
        </React.Fragment>
    )
}
