import axios from "axios";
import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
    return <h1>Landing page</h1>
}

LandingPage.getInitialProps = async (context) => {
    const client = buildClient(context);
    const { data } = await client.get("/api/users/current-user")
    return data;
}

export default LandingPage;