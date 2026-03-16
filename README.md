# LibraryTest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.19.

## Dashboard

The dashboard view contains 4 charts that display the following information:

- Bar chart with books by year of publication
- Pie chart with books by status (published/unpublished)
- Pie chart with books by author genre
- Line chart with a simulation of books registers that updates every 5 seconds and only takes the last two hours of registers.

## Books

The books view contains a table with a list of books and the following features:

- Search by title
- Edit book
- Delete book
- Add book using a modal

## Authors

The authors view contains a table with a list of authors and the following features:

- Search by name
- Edit author
- Delete author
- Add author using a modal

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

In case you dont have Version 11 of Angular CLI installed, you can run the project using nvm:

```bash
nvm install 12.22.12
nvm use 12.22.12
npm start
```

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
