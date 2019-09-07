import User from "../auth/User";
import Api from "./api";
import { AuthError, AppError } from "../errors";
const AuthService = {
  login: (identifier, password, deviceId): Promise<User> =>
    new Promise((resolve, reject) => {
      Api.post("/auth/login", { identifier, password, deviceId })
        .then(({ data: { user } }) => resolve(user))
        .catch(err => {
          if (err.status === 404) {
            return reject(new AuthError(AuthError.ACCOUNT_NOT_FOUND));
          }
          if (err.status === 403) {
            return reject(new AuthError(AuthError.WRONG_PASSWORD));
          } else if (err.status === 422) {
            return reject(new AppError(AppError.API_VALIDATION_ERROR))
          } else if (err.status === 500) {
            return reject(new AppError(AppError.APP_CRUSH_ERROR));
          }
          reject(err);
        });
    }),

  logout: () => {
    // to support logging out from all windows
    // _Storage.clearUser();
    // _Storage.clearToken();
  }
};
export default AuthService;
