export default {
    api: {
        API_BASE_URL:
            process.env.REACT_APP_BACKEND_URL || "http://localhost:8080/",
        ROUTER_BASE_NAME: null,
    },
    app: {
        ROUTER_BASE_NAME: null,
    }
};