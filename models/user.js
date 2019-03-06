const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: String  
});

UserSchema.pre('save', async function(next){
  const user = this;

  try{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
    next();
  }
  catch(err){
    return next(err);
  }
  
});

UserSchema.methods.comparePassword = async function(candidatePassword, callback){
  try{
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    callback(null, isMatch);
  }
  catch(err){
    callback(err);
  }
}



const User = mongoose.model('user', UserSchema);

module.exports = User;