# A11Y Report Viewer

The CI tool allows you to run automated accessibility tests against a specified url. It will run silently until crawling is complete unless you specify it to do another function on top of the crawling, for example, you can ask the crawler to write the results to a file on completion

## Getting Started

### Prerequisites

Before getting started with setting the project up locally, I assume the following are already installed on your computer:

- [NodeJS + Node Package Manager (NPM)](https://nodejs.org/)
- [Git Source Control Manager](https://git-scm.com/)

### Installing

Begin by cloning the repository

```bash
git clone git@github.com:jamesrweb/a11y-ci.git
```

Move into the directory and install the dependencies

```bash
cd a11y-ci
npm install
```

## Running the application

To run the application, simply run

```bash
./index.js [options]
```

For a list of options, or further help you can use:

```bash
./index.js --help
```

## Built With

- [NodeJS](https://nodejs.org/)
- [Git SCM](https://git-scm.com/)
- [All other dependencies](./package.json)

## Contributing

Please read [Contribution guidelines](./contributing.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

For this project we use [Semantic Versioning](http://semver.org/). As the MVP is under construction, all commits pre-mvp will be understood as to be version 1.

<!-- For the versions currently available, see the [tags on this repository](https://github.com/jamesrweb/a11y-report-viewer/tags). -->

## Authors

- **James Robb** - _Dev work_ - [Website](https://jamesrobb.co.uk/)

## License

This project is licensed under the MIT License - see the [Licence file](./licence.md) for details.

## Acknowledgments

- [Fotis Papadogeorgopoulos](https://fotis.xyz/)
