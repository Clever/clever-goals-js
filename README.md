# clever-goals.js

Javascript client library for the Clever Goals API.

## Usage

### Quickstart

1. Load the JS library in your HTML:

    ```html
    <script src="https://assets.clever.com/clever-goals.js" type="text/javascript"></script>
    ```

2. Initialize the client, passing in two parameters:
    - `clientId`: Your Clever app client id for identification (this can be
      found on the settings page of your Clever dashboard).
    - `studentCleverId`: The Clever ID of the student that is currently logged into your app.

    ```html
    <script type="text/javascript">
      var goals = new CleverGoals({
        clientId: "abcde12345",
        studentCleverId: "59555055924a7ea277db9dc7",
      });
      goals.startTrackingUsage();
    </script>
    ```

## Developing

We're always open to improvements/suggestions. Feel free to make a pull request with ideas!

### Installing dependencies

    npm install

### Testing

    make test

### Building for local use

This will compile `lib/` to javascript in the `dist/` folder and watch for changes:

    make dev-build
test
