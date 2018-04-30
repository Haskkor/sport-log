
##Short term

- ~~BUG: Timestamp KO on QuickLog create (see 31 march)~~
- ~~BUG: Done not green on Calendar after creation with QuickLog (see 31 march)~~
- ~~BUG: Buttons bottom of QuickLog page messed up~~
- ~~WARNING: Color passed to view in QuickLog~~
- ~~Redo historyDate done/not done saving the all day at once~~
    - ~~Edit or Create based on presence of Id and not on done status~~
- ~~Find out what to call on each action~~
    - ~~ModalListLog: create~~
    - ~~Done/Not done: create or edit based on Id presence~~
    - ~~Edit: create or edit based on Id presence~~
    - ~~Delete: create, edit based on Id presence~~
- ~~Delete historyDate~~
- ~~Use the Item type on Calendar file~~
- ~~When QuickLog creates a item, refresh the calendar => see work on calendar edit~~
    - ~~Save new history date ID in redux~~
        - ~~Subscribe to it in calendar~~
        - ~~Componentwillreceiveprops, refetch data from GraphQL~~a
    - ~~OR Save all new history date in redux~~
        - ~~Subscribe in calendar~~
        - ~~Change internal state with new elem based on timestamp~~
- ~~Select all on a day to set done/not done or delete~~~
    - ~~Done~~
    - ~~Not done~~
    - ~~Delete~~  
- ~~BUG: QuickLog does not refresh calendar anymore. Ok but ResetQuickLog not working~~
- ~~BUG: Cached data in the calendar if problematic if you edit or remove something, change page and go back. (caused by toaster still being here when opening the modal)~~
- ~~WARNING: Toaster on QuickLog page~~
- Remove all the any types
    - ~~HeaderStackNavigator~~, ~~ProgramsStackNav~~, ~~ModalListLog~~, ~~Logout~~, ~~LoginRegister~~, ~~Home~~, ~~Header~~, ~~Toaster~~, ~~Calendar~~, Quicklog, Programs, ProgramNameDays, ProgramExercises, ModalSearch, StopWatch, Timer, RowSortableList
- Edit historyDate
- Simplify/Clean ~~action sheet all~~ and action sheet one
- Add exercises to the day
- Put a loader on item? Day?
- Debounce/Throttle graphql methods
- Reorganize exercise list in a day

##Long term

- User details (add charts, drawer with weight etc)
- Healthcheck function for db and graphql
- Store exercises list in db

https://launchpad.graphql.com/r948m3339n

https://mlab.com/databases/sport-log-db#collections

http://expressjs.com/fr
https://wger.de/en/software/api
https://medium.com/handlebar-labs/how-to-add-a-splash-screen-to-a-react-native-app-ios-and-android-30a3cec835ae
https://www.youtube.com/watch?v=2fpKJ3dV8RE
https://medium.com/react-native-training/react-native-authentication-in-depth-8d8c2e4ad81b / https://www.react-reveal.com/ https://www.youtube.com/watch?v=ELXvcyiTTHM https://hackernoon.com/react-authentication-in-depth-4deebda9aa45 / https://medium.com/building-with-react-native/coding-with-facebook-login-in-react-native-like-a-pro-1x06-9064fc2f5bfc