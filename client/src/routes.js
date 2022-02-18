import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { TablePage } from './pages/UserPage';
import { AuthPage } from './pages/AuthPage';
import { RegisterPage } from './pages/RegisterPage';

export const useRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/users" exact>
                    <TablePage />
                </Route>
                <Redirect to="/users" />
            </Switch>
        );
    }
    return (
        <Switch>
            <Route path="/" exact>
                <AuthPage />
            </Route>
            <Route path="/register" exact>
                <RegisterPage />
            </Route>
        </Switch>
    );
};
