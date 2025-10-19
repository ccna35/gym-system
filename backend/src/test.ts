import * as bcrypt from "bcryptjs";

bcrypt.hash("Admin@123", 12).then(console.log);
