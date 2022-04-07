import axios from "axios";

const LandingPage = ({ currentUser }) => {
    return <h1>Landing page</h1>
}

LandingPage.getInitialProps = async ({ req }) => {
    let currentUser = null;
    if (typeof window === "undefined") {
        // we are on the server!
        // requests should be made to http://ingress-nginx.ingress-nginx...
        const { data } = await axios.get("http://ingress-nginx.ingress-nginx.svc.cluster.local/api/users/current-user", { 
            headers: req.headers
        });
        currentUser = data;
    } else {
        // we are on the browser
        // requests can be made with a base url of ''
        const { data } = await axios.get("/api/users/current-user");
        currentUser = data;
    }

    return currentUser;
}

export default LandingPage;