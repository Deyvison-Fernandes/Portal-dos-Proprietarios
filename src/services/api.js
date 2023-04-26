import axios from "axios";

const api = axios.create({
  baseURL: "https://proprietario.costao.com.br:3510",
});

export { api };
