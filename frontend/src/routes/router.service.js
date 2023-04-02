import {Route} from "react-router";

export const mapRoutes = routes => {
    return Object.keys(routes).map((key) => {
        return (
            <Route
                key={key}
                path={key}
                element={routes[key].element}
            />
        );
    })
}