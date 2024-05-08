import express, { Request, Response } from 'express';
import cors from 'cors'; // Import the cors middleware
import { connection } from '../config/db';
import generateOTP from '../auth/otp';
require('dotenv').config;
import bcrypt from 'bcrypt';
const app = express();
const port = '4000';

// Use the cors middleware
app.use(cors());

app.use(express.json());
let otpCache: string | undefined;

connection.query('SHOW TABLES', (error: any, results: any, fields: any) => {
  if (error) {
    console.error('Error querying tables: ', error);
    return;
  }
  console.log('Tables in the database:', results);
});




app.post('/Signup', async (req: Request, res: Response) => {
  const { name, email, phone, password, otp } = req.body;

  if (!name || !email || !phone || !password || !otp) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  connection.query('SELECT * FROM signup WHERE email = ?', email, async (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ success: false, error: 'Email already exists. Please login.' });
    }

    // Verify OTP
    if (!otpCache) {
      return res.status(400).json({ success: false, error: 'OTP cache is missing. Please try again.' });
    }

    const otpMatch = await bcrypt.compare(otp, otpCache); 
    if (!otpMatch) {
      return res.status(400).json({ success: false, error: 'Incorrect OTP. Please try again.' });
    }

    const hashedPassword = await bcrypt.hash(password, 7);
    
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    console.log("------------>----.>",passwordMatch)

    const newUser = { name, email, phone, password: hashedPassword };
    connection.query('INSERT INTO signup SET ?', newUser, (err) => {
      if (err) {
        console.error('Error inserting new user:', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
      console.log('new user inserted..')
      res.status(201).json({ success: true, message: 'User signed up successfully!...Please Login' });
    });
  });
});



app.post('/getOTP', (req: Request, res: Response) => {
  console.log("inside the otp...");
  const { email } = req.body;

  connection.query('SELECT * FROM signup WHERE email = ?', email, async (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    if (results.length > 0) {

      console.log('Email or Mobile Number Already Exists...');
      return res.status(400).json({ success: false, error: 'Email or Mobile Number Already Exists...' });
    }
    try {
      const { otp, hashedOTP } = await generateOTP(email);
      otpCache = hashedOTP;
      console.log("Generated OTP", otp);
      res.json({ message: 'OTP generated and sent to your email for verification.' });
    } catch (error) {
      console.error('Error during OTP generation and sending:', error);
     res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

app.post('/Login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
console.log('login--reb body--->',req.body)
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    connection.query('SELECT * FROM signup WHERE email = ?', email, async (err, results) => {
      if (err) {
        console.error('Error checking email:', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ success: false, error: 'User not found. Please sign up.' });
      }
      const user = results[0];
      console.log('user==>',user);
      console.log('password==>',password,user.password);   
      
    const hashedPassword = await bcrypt.hash(password,2);

    const passwordMatchcheck = await bcrypt.compare(password, hashedPassword);
console.log('passwordMatchcheck',passwordMatchcheck)

        const passwordMatch = await bcrypt.compare(hashedPassword, user.password);

      console.log('user passwordMatch==>',await bcrypt.compare(hashedPassword, user.password));  
      if (!passwordMatch) {
        
         console.log('login--Incorrect password.--->')
        return res.status(401).json({ success: false, error: 'Incorrect password.' });
      }
      console.log('Login In Succesfull....')
      res.json({ message: 'Login In Succesfull.' });
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
 



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
