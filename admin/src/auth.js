// admin/src/auth.js
import { useCookies } from "react-cookie";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

function useIsAdmin() {
  const token = localStorage.getItem("token");
  if (!token) return false;
  const decoded = parseJwt(token);
  return decoded?.userType === "admin";
}

export { useIsAdmin };