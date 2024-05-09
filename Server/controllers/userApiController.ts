import express, { Request, Response } from 'express';
import cors from 'cors'; // Import the cors middleware
import { connection } from '../config/db';
import generateOTP from '../auth/otp';
require('dotenv').config;
import bcrypt from 'bcrypt';
const app = express();
const port = '4000';
import jwt from 'jsonwebtoken';

// Use the cors middleware
app.use(cors());

app.use(express.json());
let otpCache: string | undefined;
let email: string | undefined;

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

    const newUser = { name, email, phone, password };
    connection.query('INSERT INTO signup SET ?', newUser, (err,result) => {
        if (err) {
            console.error('Error inserting new user:', err);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
        console.log('results...,...............>',newUser)
        const email = newUser.email;
        console.log('userId...>',email)
        // Insert initial notes for the user
        const initialNotes = [
            { email: email, title: 'third Note', content: 'This is your third note.' },
           // { user_id: userId, title: 'fourth Note', content: 'This is your fourth note.' }
          ];
console.log("-----------------------------------------------")
        connection.query('INSERT INTO notes (email, title, content) VALUES ?', [initialNotes.map(note => [note.email, note.title, note.content])], (err) => {
            if (err) {
                console.error('Error inserting initial notes:', err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            console.log('Initial notes inserted.');
            res.status(201).json({ success: true, message: 'User signed up successfully!...Please Login' });
        });
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
  const secretKey = 'qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM.,1234567890!@#$%^&*()';
email = req.body.email;
console.log('email ----------?',email)
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

        const passwordMatch = await bcrypt.compare(password, user.password);

      console.log('user passwordMatch==>',await bcrypt.compare(password, user.password));  
      if (user.password !== password ) {
        
         console.log('login--Incorrect password.--->')
        return res.status(401).json({ success: false, error: 'Incorrect password.' });
      }

      console.log('Login In Succesfull....')
      const token = jwt.sign({ id: user.id, email: user.email }, secretKey);
console.log('TOKEN----->',token); 
     email
      res.json({ success: true,message: 'Login In Succesfull.', token,name: user.name, email: user.email,id:user.idsignup});
 
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/Notes', async (req: Request, res: Response) => {
  // const { email } = req.query;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required.' });
  }

  try {
    const userData = await new Promise((resolve, reject) => {
      connection.query('SELECT email FROM signup WHERE email = ?', [email], (error, results) => {
        if (error) {
          reject(error);    
        } else {
          resolve(results);
        }
      });
    });
    const userId = email;

    console.log("================================>userId",userId)
    // Fetch notes for the user based on their user ID
    const notesData = await new Promise((resolve, reject) => {
      connection.query('SELECT title, content FROM notes WHERE email = ?', [userId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    if (Array.isArray(notesData)) {
      const titles = notesData.map((note) => note.title);
      const contents = notesData.map((note) => note.content);
      
      console.log('Titles:', titles);
      console.log('Contents:', contents);
    
      res.json({ success: true, titles: titles, contents: contents });
    }
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/addNotes', async (req: Request, res: Response) => {
  const { title, note, email } = req.body;
  if (!title || !note || !email) {
    return res.status(400).json({ success: false, error: 'Title, content, and email are required.' });
  }

  try {
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Get current date and time in MySQL format

    // Insert the new note into the notes table
    const insertQuery = 'INSERT INTO notes (email, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)';
    connection.query(insertQuery, [email, title, note, currentDate, currentDate], (error, results) => {
      if (error) {
        console.error('Error inserting note:', error);
        res.status(500).json({ success: false, error: 'Error inserting note.' });
      } else {
        console.log('Note inserted successfully.');
        res.status(200).json({ success: true, message: 'Note inserted successfully.' });
      }
    });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});





app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
