import React from 'react'
import { useHistory } from "react-router-dom"
import "./ReturnHomeButton.css"

export default function Returnhomebutton() {
    const history = useHistory()

    const handleClickGoToHome = () => {
        history.push("/")
    }

    return (
        <div className="app_returnHome" onClick={handleClickGoToHome}>
            <p>Return Home Page</p>
        </div>
    )
}
