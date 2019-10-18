# Lorem Ipsum Task Board

![Screenshot](./task-board-screenshot.png)

## Available Scripts

In the project directory, you can run:

### `yarn start`

> Make sure you have set the environment variables `REACT_APP_TRELLO_API_KEY`, `REACT_APP_TRELLO_DEBUG_TOKEN`, `REACT_APP_TRELLO_SELECTED_BOARD_ID` before you run this script.
> 
> Find your Trello API Key `REACT_APP_TRELLO_API_KEY` at https://trello.com/app-key.
>
> Find your Token `REACT_APP_TRELLO_DEBUG_TOKEN` on the same page as the API Key by clicking on the hyperlinked "Token" under the API Key.   
> 
> Find your BoardID `REACT_APP_TRELLO_SELECTED_BOARD_ID` by querying the Trello API for the list of boards associated with your account: https://developers.trello.com/reference/#membersidboards.

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.