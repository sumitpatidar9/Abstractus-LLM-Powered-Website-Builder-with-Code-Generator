



// import { createContext, useContext, useEffect, useState } from "react";
// import { logInUser, signUpUser, checkAuthStatus, logoutUser } from "./HandleAPI";

// const AuthContext = createContext();


// const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [isLoggedIn, setIsLoggedIn] = useState(false);


//     useEffect(() => {
//         const checkStatus = async () => {
//             try {
//                 const data = await checkAuthStatus();

//                 if (data && data.user) {
//                     setUser({ email: data.user.email, name: data.user.name });
//                     setIsLoggedIn(true);
//                 } 
                
//                 else {
//                     setUser(null);
//                     setIsLoggedIn(false);
//                 }
//             } 
            
//             catch (error) {
//                 console.error("Error checking authentication status:", error);
//                 setUser(null);
//                 setIsLoggedIn(false);
//             }
//         };

//         checkStatus();
//     }, []);



//     const login = async (email, password) => {
//         try {
//             const data = await logInUser(email, password);
//             if (data) {
//                 setUser({ email: data.email, name: data.name });
//                 setIsLoggedIn(true);
//             }
//             return data;
//         } catch (error) {
//             console.error("Error logging in:", error);
//             return null;
//         }
//     };



//     const signup = async (email, password) => {
//         try {
//             const data = await signUpUser(email, password);
//             if (data) {
//                 setUser({ email: data.email, name: data.name });
//                 setIsLoggedIn(true);
//             }
//         } catch (error) {
//             console.error("Error signing up:", error);
//         }
//     };
    

//     const logout = async () => {
//         try {
//             await logoutUser();
//         } catch (error) {
//             console.error("Error logging out:", error);
//         } finally {
//             setIsLoggedIn(false);
//             setUser(null);
//             setTimeout(() => {
//                 window.location.reload();
//             }, 100);
//         }
//     };

//     const value = {
//         user,
//         isLoggedIn,
//         login,
//         signup,
//         logout,
//     };

//     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };


// const useAuth = () => useContext(AuthContext);
// export { AuthProvider, useAuth };











import { createContext, useContext, useEffect, useState } from "react";
import { logInUser, signUpUser, checkAuthStatus, logoutUser } from "./HandleAPI"; 

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
   
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authLoading, setAuthLoading] = useState(true); 

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const data = await checkAuthStatus(); 

                if (data && data.user) {
                    // Assuming data.user contains _id, firstName, lastName, email
                    setUser({
                        _id: data.user._id,
                        email: data.user.email,
                        firstName: data.user.firstName,
                        lastName: data.user.lastName
                    });
                    setIsLoggedIn(true);
                } else {
                    setUser(null);
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Error checking authentication status:", error);
                setUser(null);
                setIsLoggedIn(false);
            } finally {
                setAuthLoading(false); // Set loading to false after initial check
            }
        };

        checkStatus();
    }, []);





    const login = async (email, password) => {
        try {
            const data = await logInUser(email, password); // Assuming logInUser returns user data including _id
            if (data && data.user) { // Assuming logInUser also returns { user: {...} }
                setUser({
                    _id: data.user._id,
                    email: data.user.email,
                    firstName: data.user.firstName,
                    lastName: data.user.lastName
                });

                setIsLoggedIn(true);
            }
            return data; // Return full data for UI handling (e.g., error messages)
        } catch (error) {
            console.error("Error logging in:", error);
            // Re-throw or return null/error message for caller to handle
            throw error;
        }
    };



    const signup = async (firstName, lastName, email, password) => { // Added firstName, lastName for signup
        try {
            const data = await signUpUser(firstName, lastName, email, password); // Assuming signUpUser returns user data including _id
            if (data && data.user) { // Assuming signUpUser also returns { user: {...} }
                setUser({
                    _id: data.user._id,
                    email: data.user.email,
                    firstName: data.user.firstName,
                    lastName: data.user.lastName
                });
                setIsLoggedIn(true);
            }
            return data; // Return full data for UI handling
        } catch (error) {
            console.error("Error signing up:", error);
            throw error;
        }
    };




    const logout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Error logging out:", error);
        } finally {
            setIsLoggedIn(false);
            setUser(null);
            // Optionally, reload to clear all state and cookies
            // setTimeout(() => {
            //     window.location.reload();
            // }, 100);
        }
    };




    const value = {
        user,
        isLoggedIn,
        authLoading, // Provide authLoading state
        login,
        signup,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};




const useAuth = () => useContext(AuthContext);
export { AuthProvider, useAuth };







// import { createContext, useContext, useEffect, useState } from "react";
// import { logInUser, signUpUser, checkAuthStatus, logoutUser } from "./HandleAPI"; 

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAuthStatus = async () => {
//       try {
//         const res = await checkAuthStatus(); // calls /verify
//         setUser(res.user);
//         setIsLoggedIn(true);
//       } catch (err) {
//         setUser(null);
//         setIsLoggedIn(false);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAuthStatus();
//   }, []);

//   const login = async (email, password) => {
//     console.log('From auth context',  email, password);
//     const res = await logInUser(email, password); // calls /login
    
//     setUser(res.user);
//     setIsLoggedIn(true);
//   };

//   const signup = async (formData) => {
//     const res = await signUpUser(formData); // calls /signup
//     setUser(res.user);
//     setIsLoggedIn(true);
//   };

//   const logout = async () => {
//     try {
//       await logoutUser(); // calls /logout
//     } catch (err) {
//       console.error("Logout error:", err);
//     } finally {
//       setUser(null);
//       setIsLoggedIn(false);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, isLoggedIn, login, logout, signup, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
