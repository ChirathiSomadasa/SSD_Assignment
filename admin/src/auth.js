// admin/src/auth.js
import { useCookies } from "react-cookie";

// Get JWT Token (stored in cookies)
function useAdminToken() {
  const [cookies] = useCookies(["admin_token"]);
  return cookies.admin_token || null;
}

// Decode JWT to check if user is admin
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1])); // decode payload
  } catch (e) {
    return null;
  }
}

// Check if admin is authenticated
function useIsAdmin() {
  const token = useAdminToken();
  if (!token) return false;

  const decoded = parseJwt(token);
  return decoded?.userType === "admin"; // only admins allowed
}

export { useAdminToken, useIsAdmin };
