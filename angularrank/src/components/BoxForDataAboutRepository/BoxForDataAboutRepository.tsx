import React from 'react'
import "./BoxForDataAboutRepository.css"
import { AllRepos } from "../../api/api"

interface ProperPropsForBoxForDataAboutRepository {
    dataToShow: string[],
    dataAboutRepository: AllRepos,
    descriptions: string[]
}

export default function Boxfordataaboutrepository(props: ProperPropsForBoxForDataAboutRepository) {


    return (
        <React.Fragment>
            <div className="boxForData__part">
                {props.dataToShow.map((elem, i) => {
                    let textToDisplay: string = props.dataAboutRepository[elem] as string
                    if (textToDisplay === null || textToDisplay === "") {
                        textToDisplay = "No data available"
                    }
                    if (props.descriptions[i] !== "Go to github page") {
                        return (
                            <p className="boxForData__Info"><span>{props.descriptions[i]}: </span><br />{textToDisplay}</p>
                        )
                    }
                    else {
                        return (
                            <p className="boxForData__Info"><span>{props.descriptions[i]}: </span><br /><a href={textToDisplay}>Click!</a></p>
                        )
                    }

                })}
            </div>
        </React.Fragment>
    )
}
