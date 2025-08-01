


import axios from "axios";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const signUpUser = async (firstName, lastName, email, password) => {
    try {
        const response = await axios.post(
            `${backendUrl}/user/signup`,
            { firstName, lastName, email, password },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.log('Error signing up in API:', error.response?.data || error.message);
    }
};



const logInUser = async (email, password) => {
    try {
        const response = await axios.post(
            `${backendUrl}/user/login`,
            { email, password },
            { withCredentials: true }
        );
        return response.data;
    } 
    catch (error) {
        const status = error.response?.status;

        if (status === 401) {
            console.error("User is not registered. Please signup!");
        } else if (status === 403) {
            console.error("Password incorrect!");
        } else {
            console.log('Error logging in API:', error.message);
        }
    }
};



const checkAuthStatus = async () => {
    try {
        const response = await axios.get(`${backendUrl}/user/verify`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.log('Error checking auth status:', error.response?.data || error.message);
    }
};


const logoutUser = async () => {
    try {
        const response = await axios.get(`${backendUrl}/user/logout`, {
            withCredentials: true
        });        
        return response.data;
    } catch (error) {
        console.log('Error logging out:', error.response?.data || error.message);
    }
};



export { signUpUser, logInUser, checkAuthStatus, logoutUser };
