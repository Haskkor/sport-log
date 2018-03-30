import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList
} from 'graphql';

// TYPES

const UserType = new GraphQLObjectType({
  name: 'UserType',
  description: 'Application users',
  fields: {
    _id: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    jwt: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    userName: { type: GraphQLString },
    dob: { type: GraphQLString },
    height: { type: GraphQLInt },
    trainingYears: { type: GraphQLInt }
  }
});
const SetType = new GraphQLObjectType({
  name: 'SetType',
  description: 'Set definition',
  fields: {
    reps: { type: GraphQLInt },
    weight: { type: GraphQLInt }
  }
});
const ExerciseMuscleType = new GraphQLObjectType({
  name: 'ExerciseMuscleType',
  description: 'Exercise definition',
  fields: {
    name: { type: GraphQLString },
    equipment: { type: GraphQLString }
  }
});
const ExerciseSetType = new GraphQLObjectType({
  name: 'ExerciseSetType',
  description: 'Exercise details',
  fields: {
    muscleGroup: { type: GraphQLString },
    recoveryTime: { type: GraphQLString },
    exercise: { type: ExerciseMuscleType },
    sets: { type: GraphQLList(SetType)}
  }
});
const ExercisesDayType = new GraphQLObjectType({
  name: 'ExercisesDayType',
  description: 'Exercises by day',
  fields: {
    day: { type: GraphQLString },
    isDayOff: { type: GraphQLBoolean},
    exercises: { type: GraphQLList(ExerciseSetType)}
  }
});
const ProgramType = new GraphQLObjectType({
  name: 'ProgramType',
  description: 'Programs',
  fields: {
    _id: { type: GraphQLString },
    _userId: { type: GraphQLString },
    name: { type: GraphQLString },
    active: { type: GraphQLBoolean},
    days: { type: GraphQLList(ExercisesDayType)}
  }
});

// INPUT TYPES

const SetCreateType = new GraphQLInputObjectType({
  name: 'SetCreateType',
  type: SetType,
  fields: {
    reps: { type: new GraphQLNonNull(GraphQLInt) },
    weight: { type: new GraphQLNonNull(GraphQLInt) }
  }
});
const ExerciseMuscleCreateType = new GraphQLInputObjectType({
  name: 'ExerciseMuscleCreateType',
  type: ExerciseMuscleType,
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    equipment: { type: new GraphQLNonNull(GraphQLString) }
  }
});
const ExercisesSetCreateType = new GraphQLInputObjectType({
  name: 'ExercisesSetCreateType',
  type: ExerciseSetType,
  fields: {
    muscleGroup: { type: new GraphQLNonNull(GraphQLString) },
    recoveryTime: { type: new GraphQLNonNull(GraphQLString) },
    exercise: { type: new GraphQLNonNull(ExerciseMuscleCreateType) },
    sets: { type: new GraphQLNonNull(GraphQLList(SetCreateType))}
  }
});
const ExercisesDayCreateType = new GraphQLInputObjectType({
  name: 'ExercisesDayCreateType',
  type: ExercisesDayType,
  fields: {
    day: { type: new GraphQLNonNull(GraphQLString) },
    isDayOff: { type: new GraphQLNonNull(GraphQLBoolean) },
    exercises: { type: new GraphQLNonNull(GraphQLList(ExercisesSetCreateType))}
  }
});
const ProgramCreateType = new GraphQLInputObjectType({
  name: 'ProgramCreateType',
  type: ProgramType,
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    active: { type: new GraphQLNonNull(GraphQLBoolean) },
    days: { type: new GraphQLNonNull(GraphQLList(ExercisesDayCreateType))}
  }
});
const UserLoginType = new GraphQLInputObjectType({
  name: 'UserLoginType',
  type: UserType,
  fields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  }
});
const UserSignUpType = new GraphQLInputObjectType({
  name: 'UserSignUpType',
  type: UserType,
  fields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  }
});
const UserUpdateType = new GraphQLInputObjectType({
  name: 'UserUpdateType',
  type: UserType,
  fields: {
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    userName: { type: GraphQLString },
    dob: { type: GraphQLString },
    height: { type: GraphQLInt },
    trainingYears: { type: GraphQLInt }
  }
});

// QUERY TYPES

const QueryType = new GraphQLObjectType({
  name: 'UserQueryType',
  description: 'User Query Schema',
  fields: {
    currentUser: {
      type: UserType,
      description: 'Get current user',
      resolve: (root, args, context) => {
        return context.user;
      },
    }
  }
});

// MUTATION TYPES

const MutationType = new GraphQLObjectType({
  name: 'UserMutationType',
  description: 'User Mutation Schema',
  fields: {
    login: {
      type: UserType,
      args: {
        input: { type: new GraphQLNonNull(UserLoginType) }
      },
      resolve: async (root, {input}, { mongo }) => {
        const email = input.email;
        const password = input.password;
        const Users = mongo.collection('users');
        const user = await Users.findOne({ email });
        if (!user) {
          throw new Error('Email not found');
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          throw new Error('Password is incorrect');
        }
        user.jwt = jwt.sign({ _id: user._id }, '3rEK7rDx9rMU!');
        return user;
      }
    },
    signup: {
      type: UserType,
      args: {
        input: { type: new GraphQLNonNull(UserSignUpType) }
      },
      resolve: async (root, { input }, { mongo }) => {
        const email = input.email;
        const Users = mongo.collection('users');
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
          throw new Error('Email already used');
        }
        const hash = await bcrypt.hash(input.password, 10);
        await Users.insert({
          email,
          password: hash,
        });
        const user = await Users.findOne({ email });
        user.jwt = jwt.sign({ _id: user._id }, '3rEK7rDx9rMU!');
        return user;
      }
    },
    updateUser: {
      type: UserType,
      args: {
        input: { type: new GraphQLNonNull(UserUpdateType) }
      },
      resolve: async (root, {input}, context) => {
        const Users = context.mongo.collection('users');
        const user = context.user;
        if (!user) {
          throw new Error(`Couldn't find user`);
        }
        const newArgs = Object.keys(input).reduce((prevResult, current) => {
          if (input[current] == null) return prevResult;
          return Object.assign(prevResult, {[current]: input[current]})
        }, {})
        await Users.update(
          { _id: ObjectId(user._id) },
          {
            $set: newArgs
          }
        )
        const modifiedUser = await Users.findOne({ _id: ObjectId(user._id) });
        return modifiedUser;
      }
    },
    createProgram: {
      type: ProgramType,
      args: {
        input: { type: new GraphQLNonNull(ProgramCreateType) }
      },
      resolve: async (root, {input}, context) => {
        const programs = input.programs;
        const Programs = mongo.collection('programs');
        const currentUser = context.user;
        if (!currentUser) {
          throw new Error('No current user to assign the program');
        }
	program._userId = currentUser._id;
        await Programs.insert(program);
	// get id of created program ?
        return user;
      }
    }
  }
});

const getUser = async (authorization, mongo) => {
  const bearerLength = "Bearer ".length;
  if (authorization && authorization.length > bearerLength) {
    const token = authorization.slice(bearerLength);
    const { ok, result } = await new Promise(resolve =>
      jwt.verify(token, '3rEK7rDx9rMU!', (err, result) => {
        if (err) {
          resolve({
            ok: false,
            result: err
          });
        } else {
          resolve({
            ok: true,
            result
          });
        }
      })
    );
    if (ok) {
      const user = await mongo.collection('users').findOne({ _id: ObjectId(result._id) });
      return user;
    } else {
      console.error(result);
      return null;
    }
  }
  return null;
};

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
});

let mongo;
let client;
export async function context(headers, secrets) {
  if (!mongo) {
    client = await MongoClient.connect('mongodb://Haskkor:3rEN7rDm9rMB!@ds249398.mlab.com:49398/sport-log-db');
    mongo = client.db('sport-log-db');
  }
  const user = await getUser(headers['authorization'], mongo);
  return {
    headers,
    secrets,
    mongo,
    user
  };
};
