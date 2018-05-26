
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
- ~~Remove all the any types~~
    - ~~HeaderStackNavigator~~, ~~ProgramsStackNav~~, ~~ModalListLog~~, ~~Logout~~, ~~LoginRegister~~, ~~Home~~, 
    ~~Header~~, ~~Toaster~~, ~~Calendar~~, ~~Quicklog~~, ~~Programs~~, ~~ProgramNameDays~~, ~~ProgramExercises~~,
    ~~ModalSearch~~, ~~StopWatch~~, ~~Timer~~, ~~RowSortableList~~
- ~~Edit historyDate~~
- ~~Simplify/Clean action sheet all and action sheet one~~
- ~~Put graphql queries in a separate file~~
- ~~Add exercises to the day~~
- ~~Change the state before the return of the graphql call~~
- ~~Debounce/Throttle graphql methods~~ -> to check in the future
- ~~Reorganize exercise list in a day~~
    - ~~Add a modal with a sortable list view~~
    - ~~Open the modal with a button in the day action sheet~~
    - ~~Save the reorganized list~~
        - ~~If the history date already existed~~
        - ~~If it's a new history date~~
- BUG: Adding an exercise to a day with exercises not done remove the other exercises
    - Test with exercises already in the db
    - ~~On create save all the exercises not just the ones edited, done etc~~
    - Todo:
        - Test if the new set quicklog is working
        - Give all the exercises of the day to the quickLog page
        - Returns the list to the calendar that will save it
- BUG: Editing an exercise not done cause a 400 on updateHistoryDate
- BUG: the calendar is not always updating e.g when using the action sheet to add exercises
- ~~WARNING: Rework calendar file again to put all the creates and updates together~~

##Long term

- User details (add charts, drawer with weight etc)
- Healthcheck function for db and graphql
- Store exercises list in db
- When selecting an exercise use the last stored values for the sets and recovery instead of default ones
- Use the constructors in all the files

https://launchpad.graphql.com/r948m3339n

https://mlab.com/databases/sport-log-db#collections

http://expressjs.com/fr
https://wger.de/en/software/api
https://medium.com/handlebar-labs/how-to-add-a-splash-screen-to-a-react-native-app-ios-and-android-30a3cec835ae
https://www.youtube.com/watch?v=2fpKJ3dV8RE
https://medium.com/react-native-training/react-native-authentication-in-depth-8d8c2e4ad81b / https://www.react-reveal.com/ https://www.youtube.com/watch?v=ELXvcyiTTHM https://hackernoon.com/react-authentication-in-depth-4deebda9aa45 / https://medium.com/building-with-react-native/coding-with-facebook-login-in-react-native-like-a-pro-1x06-9064fc2f5bfc