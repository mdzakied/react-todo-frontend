import axiosInstance from "../api/axiosInstance";

const AuthService = () => {
  const login = async (payload) => {
    const { data } = await axiosInstance.post("/login", payload);
    return data;
  };

  const register = async (payload) => {
    const { data } = await axiosInstance.post("/register", payload);
    return data;
  };

  return {
    login,
    register,
  };
};

export default AuthService;