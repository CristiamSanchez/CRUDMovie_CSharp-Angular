// Configuration for the GitHub Pages build (`--configuration production-pages`).
//
// GitHub Pages can only host this static Angular frontend. No public ASP.NET Core
// backend is deployed yet, so `apiUrl` is intentionally empty: the deployed site
// never points to localhost and no backend URL is invented. The result is a
// UI/demo build that renders the full interface but shows the inline
// "Failed to load movies" error, because there is no API to talk to.
//
// To enable full CRUD online, host the API externally and set its public URL here,
// e.g. apiUrl: 'https://your-api.example.com/api'
export const environment = {
  production: true,
  apiUrl: ''
};
