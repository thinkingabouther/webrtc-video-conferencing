import React from "react"
import useSWR from "swr"
const { Provider, Consumer } = React.createContext(false);

const AuthProvider = (props) => {

    const { data, error, mutate } = useSWR(`/api/auth/me`)

    const googleLogIn = async googleData => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
                token: googleData.tokenId
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        if(data.error) throw new Error(data.error)
        mutate()
    }

    const logOut = async () => {
        await fetch("/api/auth/logout", {
            method: "DELETE"
        })
        console.log("logout")
        window.location.reload(false);
        mutate()
    }

    return(
        <Provider value={{
            user: data,
            error: error,
            googleLogIn: googleLogIn,
            logOut: logOut
        }} {...props}/>
    )
}

export {AuthProvider, Consumer as AuthConsumer}