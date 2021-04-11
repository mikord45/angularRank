import React from 'react'
import "./AppContentRowWithDataAboutContributor.css"

interface ProperPropsForAppContentRowWithDataAboutContributor {
    id: number
    userName: string
    numberOfContributions: number,
    numberOfRepositoriesAndGists: number,
    numberOfFollowers: number
}

export default function Appcontentrowwithdataaboutcontributor(props: ProperPropsForAppContentRowWithDataAboutContributor) {


    return (
        <div className="content__row">
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
    )
}
