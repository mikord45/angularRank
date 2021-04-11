import React from 'react'
import "./ButtonToLoadMoreContributors.css"

interface ProperPropsForButtonToLoadMoreContributors {
    howManyNewToLoadAfterClick: number
    functionToModifyStateOfParentElement: (howManyNew: number) => void
}

export default function Buttontoloadmorecontributors(props: ProperPropsForButtonToLoadMoreContributors) {

    const handleClick = () => {
        props.functionToModifyStateOfParentElement(props.howManyNewToLoadAfterClick)
    }

    return (
        <div className="content__buttonToLoadMore" onClick={handleClick}>
            <p>Load next {props.howManyNewToLoadAfterClick} contributors</p>
        </div>
    )
}
