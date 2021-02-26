import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/auth';

function PrivateRoute({ component: Component, ...rest }) {
    const isAuthenticated = useAuth();
    console.log(Component);
    console.log(rest);
    return (
        <Route{...rest}
            render={props => 
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                        <Redirect to="/" />
                    )
            }
        />
    );
    console.log(Component);
    console.log(rest);
}

export default PrivateRoute;