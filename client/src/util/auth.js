/**
 * `fetch`, but it redirects to the login
 * page when 401 Unauthorized is returned.
 */
async function authFetch(url, options) {
  const res = await fetch(url, options);
  if (res.status === 401) {
    window.location.href = "/api/auth/caslogin"; //was /login for LoginModal back when Oauth was used
    return null;
  }
  return res;
}

export { authFetch };
