## Welcome to Manabie coding challenge

_Hello!_
_We're excited that you're interested in joining Manabie. Below are the requirements and explanations for the challenge._

### Notes:

- Our challenge codebase is bootstrapped by create-react-app with typescript.
- All provided codes are in this repository. Please **fork**, complete your challenge, and create a PR to this repository.
- We judge your codes by:
  - Easy to read and understand.
  - Well organized and consistent.
  - Test cases.
  - How do you approach new technologies?
- Don't worry if you can't complete the challenge in time. Just do your best in a mindful way.
- If you can't fully complete the challenge, please note the completed features.
- We'd like too see some descriptions about your PR.
- Typescript is a plus point. So we hope you can spend your time on this

### Requirements

#### Common (required for both positions)

- Our code base has some strange bugs and anti-patterns, please help us to find and fix these (please comments the reasons and your solutions).
- We, Manabian, believe that engineers themselves should take care of the quality of their products. Please somehow convince us that your changes are correct, we'd prefer to have a few tests for important changes that you had **ADDED** or **FIXED** (unit test or integration test)

#### Front-end engineer

- For front-end engineer, you can use localStorage instead of calling remote APIs.
- We provided a simple UI for todo app, please enhance it with your creative mind.
- Please help us to add some features to the application:
  - The persistent feature. After refreshing, our todos will be disappeared, that's annoying for our users, let's use localStorage (or API calls for fullstack engineer) to keep them.
  - The edit feature. Currently, users cannot edit the todos, please help them (user double-clicks the todo to edit, presses enter to apply the changes, or clicks outside to discard).
  - The active/complete todo feature. Allows users to click on checkbox items they have completed

#### Fullstack engineer

- You have to make sure your code satisfy the back-end requirements in https://github.com/manabie-com/togo.
- Keep the existing features in sync with backend. (create/toggle status/toggle all/delete).
- We do not require you to enhance the UI, but it is preferable (have some small changes but meaningful are great).
- Done the common requirements above.

### How to run this code

- Run `yarn` or `npm install` if this is the first time you clone this repo (`master` branch).
- Run `yarn start:fullstack` in case you are doing a fullstack test, else run `yarn start:frontend` to start this project in development mode.
- Sign in using username: `firstUser`, password: `example`

Last updated: 2022/01/13

## Changelog by Pham Hoang Long

### Requirement

- Save data to local storage: done (using `indexDB`)
- The persistent feature: done
- The edit feature: done
- The active/complete todo feature: done
- Unit test: 100% (ignore : `src/index.tsx`, `src/service/\*`)
- Typescript: 99%

### More feature

- Change layout to support mobile
- Add search box to filter keyword
- Show confirm dialog when remove item
- Change: delete all todo => delete completed todo
- Add send button when create new todo(support for mobile)
- Add loading UI when call api (add, update, remove) (but using local api so it's not easy to see it)
- Login page (incomplete)

### System

- Update lasted packages (if project not working, please remove `node_modules`, use node v14 and install again)
- Change store from reducer to sweet format `src/utils/Store` (inspired by `react-sweet-context`)
- Change code base structure from single page to multi pages `src/pages`
- fences structure

  - `components`: can not import: `models`, `pages`, `service`, `store`
  - `models`: can not import: `components`, `pages`, `service`, `store`
  - `pages`: can not import from another page the same level, (only accept `pages/path`: using switch to another pages)
  - `service`: can not import `components`, `pages`, `store`
  - `store`: can not import `components`, `pages`
  - `utils`: can not import from another folder the same level

- `PartialCheckbox` component: Show checkbox in partial
- `Loader` component: Manager multiple loading state by push promise
- `AsyncModal` component: Manage multiple modals by push and pop
