import React from 'react'
import "./BoxForDataAboutUser.css"
import { ContributorData } from '../../api/api'


interface ProperPropsForBoxForDataAboutUser {
    dataToShow: string[],
    dataAboutUser: ContributorData,
    descriptions: string[]
}

export default function Boxfordataaboutuser(props: ProperPropsForBoxForDataAboutUser) {

    return (
        <React.Fragment>
            <div className="boxForData__part">
                {props.dataToShow.map((elem, i) => {
                    let textToDisplay: string = props.dataAboutUser[elem] as string
                    if (textToDisplay === null || textToDisplay === "") {
                        textToDisplay = "No data available"
                    }
                    if (props.descriptions[i] !== "Go to github profile") {
                        return (
                            <p key={i} className="boxForData__Info"><span>{props.descriptions[i]}: </span><br />{textToDisplay}</p>
                        )
                    }
                    else {
                        return (
                            <p key={i} className="boxForData__Info"><span>{props.descriptions[i]}: </span><br /><a href={textToDisplay}>Click!</a></p>
                        )
                    }

                })}
            </div>
        </React.Fragment>

    )
}
