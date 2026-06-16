import React, { useEffect } from 'react'

export const Profile = ({ user }) => {
    const { nama, umur, pekerjaan } = user

    useEffect(() => {
        console.log(user)
    }, [])

    return (
        <div>
            <p>{nama}</p>
            <p>{umur}</p>
            <p>{pekerjaan}</p>
        </div>
    )
}
