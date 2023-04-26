import axios from "axios";

const apiWp = axios.create({
    baseURL: "https://acontecenocostao.costao.com.br/wp-json/wp/v2",
});

export { apiWp };
