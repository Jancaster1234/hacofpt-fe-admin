// src/utils/jwtHelper.ts

//Instead of checking for a 401 response, decode the JWT and refresh before it expires.
//Use a library like jwt-decode to extract the expiry time
// import jwtDecode from "jwt-decode";

// function isTokenExpired(token: string) {
//   const decoded: { exp: number } = jwtDecode(token);
//   return decoded.exp * 1000 < Date.now();
// }

// async function ensureValidToken() {
//   if (tokenService.getToken() && isTokenExpired(tokenService.getToken()!)) {
//     await tokenService.refreshToken();
//   }
// }
