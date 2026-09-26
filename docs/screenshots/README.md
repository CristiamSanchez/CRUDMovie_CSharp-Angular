# Screenshots

This folder contains project screenshots for the README.

## How to add the screenshot

1. Run the application:
   ```bash
   docker compose up -d
   cd src/Movies.Api && dotnet run
   cd src/Movies.Web && npx ng serve
   ```

2. Open http://localhost:4200 in your browser

3. Take a screenshot of the movie list view (or any view you prefer)

4. Save it as `movie-crud.png` in this folder:
   ```
   docs/screenshots/movie-crud.png
   ```

5. The README.md already references this path:
   ```markdown
   ![Movie CRUD Application](docs/screenshots/movie-crud.png)
   ```

## Recommended screenshot specs

- **Resolution**: 1920x1080 or similar
- **Format**: PNG (for crisp text)
- **Content**: Movie list with several movies visible, showing the card layout, genre badges, and action buttons
- **Theme**: Dark mode (default) or light mode

Once the screenshot is added, it will appear in the README on GitHub.