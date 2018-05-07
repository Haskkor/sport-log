import gql from 'graphql-tag'

export const HISTORY_DATE_USER = gql`
    query HistoryDateUser {
      historyDateUser {
        _id
        _userId
        timestamp
        exercises {
          muscleGroup
          done
          recoveryTime
          exercise {
            name
            equipment
          }
          sets {
            reps
            weight
          }
        }
      }
    }
  `

export const CREATE_HISTORY_DATE = gql`
    mutation CreateHistoryDate($historyDate: HistoryDateCreateType) {
      createHistoryDate(input: $historyDate) {
        _id
        _userId
        timestamp
        exercises {
          muscleGroup
          recoveryTime
          exercise {
            name
            equipment
          }
          done
          sets {
            reps
            weight
          }
        }
      }
    }
  `

export const UPDATE_HISTORY_DATE = gql`
    mutation UpdateHistoryDate($historyDate: HistoryDateUpdateType) {
      updateHistoryDate(input: $historyDate) {
        _id
      }
    }
  `

export const PROGRAMS_USER = gql`
    query ProgramsUser {
      programsUser {
        name
        _id
        _userId
        active
        days {
          day
          isCollapsed
          isDayOff
          exercises {
            muscleGroup
      recoveryTime
      exercise {
        name
        equipment
      }
      sets {
        reps
        weight
      }
          }
        }
      }
    }
  `

export const CURRENT_USER = gql`
    query User {
      currentUser {
        email, firstName, lastName, userName, dob, height, trainingYears
      }
    }
  `

export const UPDATE_USER = gql`
    mutation UpdateUser($email: String, $firstName: String, $lastName: String, $userName: String, $dob: String, $height: Int, $trainingYears: Int) {
      updateUser(input: {email: $email, firstName: $firstName, lastName: $lastName, userName: $userName, dob: $dob, height: $height, trainingYears: $trainingYears}) {
        email
      }
    }
  `

export const SIGN_UP = gql`
    mutation SignUp($email: String!, $password: String!) {
      signup(input: {email: $email, password: $password}) {
        _id
        email
        jwt
      }
    }
  `

export const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
      login(input: {email: $email, password: $password}) {
        jwt
      }
    }
  `

export const CREATE_PROGRAM = gql`
    mutation CreateProgram($program: ProgramCreateType) {
      createProgram(input: $program) {
        _id
      }
    }
  `

export const DELETE_PROGRAM = gql`
    mutation DeleteProgram($_id: ProgramDeleteType) {
      deleteProgram(input: $_id)
    }
  `

export const UPDATE_PROGRAM = gql`
    mutation UpdateProgram($program: ProgramUpdateType) {
      updateProgram(input: $program) {
        _id
      }
    }
  `
