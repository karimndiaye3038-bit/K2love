import api from "./api";


// ========================================
// INSCRIPTION
// ========================================

export const registerUser = async (userData) => {
  const response = await api.post(
    "/auth/register",
    userData
  );

  return response.data;
};


// ========================================
// CONNEXION
// ========================================

export const loginUser = async (userData) => {
  const response = await api.post(
    "/auth/login",
    userData
  );

  return response.data;
};