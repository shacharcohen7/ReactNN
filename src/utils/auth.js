
import {jwtDecode} from 'jwt-decode';

class TokenManager {
  static getToken() {
    return localStorage.getItem('access_token');
  }

  static setToken(token) {
    localStorage.setItem('access_token', token);
  }

  static getUserIdFromToken() {
    const token = TokenManager.getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);  // ✅ correct import now
        return decoded.sub;  // Assumes your backend sets user_id in `sub`
      } catch (error) {
        console.error("Invalid token:", error);
        return null;
      }
    }
    return null;
  }
}

export default TokenManager;

