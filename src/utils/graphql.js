import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { makeExecutableSchema } from 'graphql-tools';

// TYPES

const typeDefs = `
  type UserType {
    _id: String!
    email: String!
    password: String!
    jwt: String
    firstName: String
    lastName: String
    userName: String
    dob: String
    height: Int
    trainingYears: Int
  }
  type SetType {
    reps: Int
    weight: Int
  }
  type ExerciseMuscleType {
    name: String
    equipment: String
  }
  type ExerciseSetType {
    muscleGroup: String
    recoveryTime: String
    exercise: ExerciseMuscleType
    sets: [SetType]
  }
  type ExercisesDayType {
    day: String
    isDayOff: Boolean
		isCollapsed: Boolean
    exercises: [ExerciseSetType]
  }
  type ProgramType {
    _id: String!
    _userId: String!
    name: String!
    active: Boolean!
    days: [ExercisesDayType]!
  }
	type HistoryDateType {
		_id: String!
		_userId: String!
		timestamp: String!
		exercises: [ExerciseSetType]!
	}

	input UserLoginType {
    email: String!
    password: String!
  }
  input UserSignUpType {
    email: String!
  	password: String!
  }
  input UserUpdateType {
    email: String
    firstName: String
    lastName: String
    userName: String
    dob: String
    height: Int
    trainingYears: Int
  }
  input SetInputType {
    reps: Int!
    weight: Int!
  }
  input ExerciseMuscleInputType {
    name: String!
    equipment: String!
  }
  input ExercisesSetInputType {
    muscleGroup: String!
    recoveryTime: String!
    exercise: ExerciseMuscleInputType!
    sets: [SetInputType]!
  }
  input ExercisesDayInputType {
    day: String!
    isDayOff: Boolean!
		isCollapsed: Boolean
    exercises: [ExercisesSetInputType]!
  }
  input ProgramCreateType {
    name: String!
    active: Boolean!
    days: [ExercisesDayInputType]!
  }
	input ProgramUpdateType {
		_id: String!
    name: String!
    active: Boolean!
    days: [ExercisesDayInputType]!
  }
	input ProgramDeleteType {
		_id: String!
  }
	input HistoryDateCreateType {
		timestamp: String!
		exercises: [ExercisesSetInputType]!
  }
	input HistoryDateUpdateType {
		_id: String!
		timestamp: String!
		exercises: [ExercisesSetInputType]!
  }
	input HistoryDateDeleteType {
		_id: String!
  }

  type Query {
    currentUser: UserType
		programsUser: [ProgramType]
		historyDateUser: [HistoryDateType]
  }

  type Mutation {
    login (input: UserLoginType): UserType
		signup (input: UserSignUpType): UserType
		updateUser (input: UserUpdateType): UserType
		createProgram (input: ProgramCreateType): ProgramType
		updateProgram (input: ProgramUpdateType): ProgramType
		deleteProgram (input: ProgramDeleteType): Boolean
		createHistoryDate (input: HistoryDateCreateType): HistoryDateType
		updateHistoryDate (input: HistoryDateUpdateType): HistoryDateType
		deleteHistoryDate (input: HistoryDateDeleteType): Boolean
  }
`;

const convertTimestamp = (timestamp) => {
    const dateFromTimestamp = new Date(+timestamp);
    const modified = new Date(dateFromTimestamp.getFullYear(), dateFromTimestamp.getMonth(), dateFromTimestamp.getDate(), 0, 0, 0);
    return modified.getTime();
}

// RESOLVERS

const resolvers = {
    Query: {
        currentUser: (root, args, context) => context.user,
        programsUser: (root, args, context) => context.mongo.collection('programs').find( { _userId: ObjectId(context.user._id) }).toArray(),
        historyDateUser: (root, args, context) => context.mongo.collection('historyDate').find( { _userId: ObjectId(context.user._id) }).toArray()
    },
    Mutation: {
        login: async (root, { input }, { mongo }) => {
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
        },
        signup: async (root, {input}, { mongo }) => {
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
        },
        updateUser: async (root, {input}, context) => {
            console.log(context)
            const Users = context.mongo.collection('users');
            const user = context.user;
            if (!user) {
                throw new Error(`Couldn't find user`);
            }
            const newArgs = Object.keys(input).reduce((prevResult, current) => {
                if (input[current] == null) return prevResult;
                return Object.assign(prevResult, {[current]: input[current]})
            }, {})
            await Users.update({ _id: ObjectId(user._id) }, {$set: newArgs})
            const modifiedUser = await Users.findOne({ _id: ObjectId(user._id) });
            return modifiedUser;
        },
        createProgram: async (root, {input}, context) => {
            const program = input;
            const Programs = context.mongo.collection('programs');
            const currentUser = context.user;
            if (!currentUser) {
                throw new Error('No current user to assign the program');
            }
            program._userId = currentUser._id;
            const result = await Programs.insert(program);
            const _id = result.ops[0]._id;
            const programResult = await Programs.findOne(_id);
            return programResult;
        },
        updateProgram: async (root, {input}, context) => {
            const program = input;
            const Programs = context.mongo.collection('programs');
            const programId = program._id;
            delete program._id;
            await Programs.update({ _id: ObjectId(programId) }, {$set: program});
            const modifiedProgram = await Programs.findOne({ _id: ObjectId(programId) });
            return modifiedProgram;
        },
        deleteProgram: async (root, {input}, context) => {
            const programId = input._id;
            const Programs = context.mongo.collection('programs');
            await Programs.deleteOne( { _id : ObjectId(programId) } );
            return true;
        },
        createHistoryDate: async (root, {input}, context) => {
            const historyDate = input;
            const HistoryDate = context.mongo.collection('historyDate');
            const currentUser = context.user;
            if (!currentUser) {
                throw new Error('No current user to assign the history date');
            }
            historyDate.timestamp = convertTimestamp(historyDate.timestamp);
            historyDate._userId = currentUser._id;
            const alreadyOne = await HistoryDate.findOne({timestamp: historyDate.timestamp, _userId: historyDate._userId});
            let _id;
            if (alreadyOne) {
                let sets = alreadyOne.exercises.slice();
                historyDate.exercises.map((e) => sets.push(e));
                alreadyOne.exercises = sets
                const historyDateId = alreadyOne._id;
                delete alreadyOne._id;
                await HistoryDate.update({ _id: ObjectId(historyDateId) }, {$set: alreadyOne});
                _id = alreadyOne._id
            } else {
                const result = await HistoryDate.insert(historyDate);
                _id = result.ops[0]._id;
            }
            const historyDateResult = await HistoryDate.findOne(_id);
            return historyDateResult;
        },
        updateHistoryDate: async (root, {input}, context) => {
            const historyDate = input;
            const HistoryDate = context.mongo.collection('historyDate');
            const historyDateId = historyDate._id;
            delete historyDate._id;
            historyDate.timestamp = convertTimestamp(historyDate.timestamp);
            await HistoryDate.update({ _id: ObjectId(historyDateId) }, {$set: historyDate});
            const modifiedHistoryDate = await HistoryDate.findOne({ _id: ObjectId(historyDateId) });
            return modifiedHistoryDate;
        },
        deleteHistoryDate: async (root, {input}, context) => {
            const historyDateId = input._id;
            const HistoryDate = context.mongo.collection('historyDate');
            await HistoryDate.deleteOne( { _id : ObjectId(historyDateId) } );
            return true;
        }
    }
};

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

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
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
