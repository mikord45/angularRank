import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom"
import "./LoadingPage.css"

export default function Loadingpage() {
    const history = useHistory()
    useEffect(() => {
        const interval = setInterval(() => {
            if (window.localStorage.repos !== undefined || window.localStorage.contributors !== undefined) {
                history.push("/")
            }
        }, 1000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <React.Fragment>
            <div className="loading">
                <div className="windows8">
                    <div className="wBall" id="wBall_1">
                        <div className="wInnerBall"></div>
                    </div>
                    <div className="wBall" id="wBall_2">
                        <div className="wInnerBall"></div>
                    </div>
                    <div className="wBall" id="wBall_3">
                        <div className="wInnerBall"></div>
                    </div>
                    <div className="wBall" id="wBall_4">
                        <div className="wInnerBall"></div>
                    </div>
                    <div className="wBall" id="wBall_5">
                        <div className="wInnerBall"></div>
                    </div>
                </div>
            </div>
            <div className="footer">
                <p>
                    Please, wait a moment until loading will be finished. It shouldn't take long :)
                </p>
            </div>
        </React.Fragment>

    )
}
