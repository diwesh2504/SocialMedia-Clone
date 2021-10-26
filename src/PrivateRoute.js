import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import {UseAuth} from '../src/AuthProvider'

function PrivateRoute({component:Component,...rest}) {
    const {currentUser}=UseAuth()
    return <Route {...rest} render={props=>currentUser?<Component {...props}/>:<Redirect to="/login"/>}></Route>

}
export default PrivateRoute
