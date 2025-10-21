const { register } = require("../controllers/auth");  // Import your existing register function
const User = require("../models/User");  // Import the User model

async function createAdmin() {
  try {
    // Check if an admin already exists
    const admin = await User.findOne({ role: "admin" });
    
    if (admin) {
      console.log("Admin already exists. Skipping admin creation.");
      return;
    }

    // If no admin exists, create one using the register function
    const adminData = {
      email: "admin@example.com",
      password: "adminpassword",  // Use a strong password here, but we will hash it using argon2
      grade: "G6",  // Assign appropriate grade
      role: "admin",  // Set the role to admin
      xp: 1000,
      level: 5,
      badges: ["First Chapter"]  // Example of badges, you can adjust
    };

    // Call the register function with admin data
    const req = { body: adminData };  // Mimic the request object
    const res = { 
      json: (data) => console.log("Admin created:", data),
      status: (code) => {
        return {
          json: (data) => console.error(`Error ${code}:`, data)
        };
      },
      cookie: () => {}
    };

    await register(req, res);  // This will create the admin user
  } catch (error) {
    console.error("Error creating admin:", error);
  }
}

module.exports = { createAdmin };
