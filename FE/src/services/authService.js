import { USER_API } from "../configs/endpoints";

export const authenticateUser = async (username, password) => {
    return username === "admin" && password === "password";
};

export const loginUser = async (credentials) => {
    const response = await fetch(`${USER_API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    return response.json();
};
