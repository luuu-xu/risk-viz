Live: 

# Risk Visualizer
- This is a front-end data visualization project built on Next13.
- The dataset and problems outline are provided by [RiskThinking](https://github.com/RiskThinking/work-samples/blob/main/UI-UX-Developer.md).

## Getting Started
To get started with the website, follow these steps:

1. Clone the repository to your local machine.
2. Install the project dependencies.
    ```shell
    npm install
    ```
3. Rename .env.local.example file to .env.local and fill in the necessary environment variables.
4. Run npm run dev to start the development server.
5. Open **NEXT_PUBLIC_HOST** in your web browser to view the website.

## Features
The project includes the following features:

- Interactive Google Maps with color-coded Markers representing risk ratings.
- Marker Cluster ensures appropriate display of data points.
- Interactive data table with sorting, filtering, searching functions.
- Interactive mixed graph composed of floating bar graph and line graph showing risk rating trend prediction.
- All components are interconnected by state management within the index page.
- Users can use Map and Table to get a grasp of risk levels within certain areas for different category of businesses.

## Dependencies
The following dependencies are used in this project:

- next: Framework for server-rendered React applications, Next13 is used for this project.
- typescript: Typed superset of JavaScript that compiles to plain JavaScript.
- csv-parse: This package is a CSV parser for Node.js.
- @react-google-maps/api: Integrating Google Maps into React applications.
- @tanstack/react-table: Headless UI for building powerful tables & data grids.
- chart.js: Charting library that allows for the creation of various types of charts and graphs.
- react-chartjs-2: Wrapper for Chart.js that allows for the creation of Chart.js charts in React applications.
- bootstrap: CSS framework for building responsive and mobile-first websites.
- react-bootstrap: UI library for React that provides pre-built Bootstrap components.
- tailwindcss: Utility-first CSS framework that allows for rapid UI development.

## Pages
The website includes the following pages:

- /: The homepage, which displays UI.

## Screenshots
### IndexPage

## Contributing
Contributions are welcome! If you'd like to contribute to this project, please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Note
This README.md is generated by ChatGPT and modified manually.
