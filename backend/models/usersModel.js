import mongoose from "mongoose";
import bcrypt from "bcrypt";
// import { required } from "yargs";
// import { required } from "yargs";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin:{
        type:Boolean,
        required:true,
        default:false,
    },
  },
  { timestamps: true }
);
userSchema.pre('save',async function(next){
  if(!this.isModified('password'))//if password field wasn't changed, skip hashing becasue on evry time save() runs that doesn;t menas passsword is also changed may be name or email is only change so without checking this it are-hash the password which can mess the code
    return
  this.password=await bcrypt.hash(this.password,10)//10 is salt value
  next()
})
userSchema.methods.ispasswordcorrect=async function (password){
  return await bcrypt.compare(password,this.password)
}
const user=mongoose.model('users',userSchema)
export default user

/*

i don;t undertsand the use of this
if (!this.isModified('password')) 
    return; // if password field wasn't changed, skip hashing
ChatGPT said:

Great point! That line looks confusing at first, but it’s actually super important. Let’s walk through it with examples 👇

🔹 What this.isModified('password') means

this = the current user document (User instance).

.isModified('password') is a Mongoose method that checks:
👉 Has the password field been changed since the last save?

🔹 Why do we need this check?

Because the pre('save') hook runs every time you call .save() on a document — not just on registration.

Case 1: New User (Registration)

const user = new User({ name: "Alice", email: "a@test.com", password: "1234" });
await user.save();  


👉 Here password is newly set, so isModified('password') === true.
✅ The hook runs → password gets hashed.

Case 2: Update Profile Info (NOT password)

const user = await User.findOne({ email: "a@test.com" });
user.name = "Alice Wonderland";
await user.save();


👉 Here we only changed name.
👉 Without the check, the hook would re-hash the already hashed password again (double hashing).
❌ This would break login, because bcrypt can’t match it anymore.

That’s why we check:

if (!this.isModified('password')) return; 


➡️ Skip hashing if password didn’t change.

Case 3: User Updates Password

user.password = "newpass123";
await user.save();


👉 isModified('password') === true again.
✅ So the hook hashes the new password.

🔹 Without this check

Every save would hash the password again, even when you weren’t updating it.
That means:

Register → hashed once ✅

Edit profile → hashed again ❌ (double-hash)

Edit profile again → triple-hash ❌❌
Eventually, login would always fail.

✅ So in short:
That line prevents re-hashing an already hashed password when the user updates other fields.
*/