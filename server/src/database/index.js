import mongoose from 'mongoose';

// import databaseConfig from '../config/database';

// const models = [];

class Database {
  constructor() {
    this.mongo();
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb+srv://omnistack:omnistack@aircnc-mppwk.mongodb.net/semana09?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
