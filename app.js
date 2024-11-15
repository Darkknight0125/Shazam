const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const mongoose=require("mongoose")

const app = express();
const port = 3000;

const mongoURI = "mongodb://localhost:27017"; // Your MongoDB connection string

app.use(session({
  secret: 'shazamString', // Change this to a random string
  resave: false,
  saveUninitialized: false
}));

// Connect to MongoDB
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db('Shazam'); 

    // Middleware to enable CORS
    app.use(cors());
    app.use(express.json()); // Middleware to parse JSON request bodies
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname)));

    // Define a route to search data in MongoDB
    app.get('/search', async (req, res) => {
      try {
        const query = req.query.query.trim();
        const collection = db.collection('Movies'); 
        const data = await collection.find({name: query}).toArray();
        res.json(data);
      } catch (error) {
        console.error('Error searching data:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    app.get('/search_2', async (req, res) => {
        try {
            const userName = req.query.userName.trim(); // Get the user name from the query parameter
            const movieName = req.query.movieName.trim(); // Get the movie name from the query parameter
    
            const collection = db.collection('Users');
            
            // Find the user by name
            const user = await collection.findOne({ name: userName });
    
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
    
            // Get the rating of the specific movie from the user document
            const movieRating = user.movies && user.movies[movieName]; // Check if the movie exists in the user's movies field
    
            if (!movieRating) {
                return res.status(404).json({ userName, movieName, rating: "None" });
            }
    
            res.json({ userName, movieName, rating: movieRating });
        } catch (error) {
            console.error('Error searching data:', error);
            res.status(500).send('Internal Server Error');
        }
    });
  
    app.get('/search_3', async (req, res) => {
      try {
          const userName = req.query.userName.trim(); // Get the user name from the query parameter
          const collection = db.collection('Users');
          
          // Find the user by name
          const user = await collection.findOne({ name: userName });
  
          if (!user) {
              return res.status(404).json({ error: "User not found" });
          }
  
          // Get the rating of the specific movie from the user document
          const movies = user.myList;
  
          /*if (!movies) {
              return res.status(404).json({ });
          }*/
  
          res.json({movies });
      } catch (error) {
          console.error('Error searching data:', error);
          res.status(500).send('Internal Server Error');
      }
  });

    // Define a route to add data to MongoDB
    /*app.post('/add', async (req, res) => {
      try {
        const data = {
          name: req.body.fullname,
          email:req.body.email,
          password: req.body.password
        }
        const collection = db.collection('Users'); 
        const result = await collection.insertMany([data]);
        res.redirect('/main_2.html'); // Redirect to main_2.html
      } catch (error) {
        console.error('Error adding data:', error);
        res.status(500).send('Internal Server Error');
      }
    });*/
    app.post('/add', async (req, res) => {
        const data = {
            name: req.body.movie,
            rating: req.body.rating,
            video: req.body.video,
            release: req.body.release,
            director: req.body.director,
            info: req.body.info,
        };
    
        const collection = db.collection('Movies');
    
        try {
                await collection.insertOne(data); 
                res.redirect("dataBaseEntry.html");
            }
        catch (error) {
            console.error('Error processing insert:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    app.post('/signup', async (req, res) => {
      const data = {
          name: req.body.fullname,
          email: req.body.email,
          password: req.body.password
      };
  
      const collection = db.collection('Users');
      const existingUser = await collection.findOne({ name: req.body.fullname });
  
      try {
          if (existingUser) {
                res.redirect("/main_3.html?loginFailed=e3");
          } else {
              await collection.insertOne(data);
    
              res.redirect('/main_2.html?username=' + encodeURIComponent(req.body.fullname));
          }
      } catch (error) {
          console.error('Error processing signup:', error);
          res.status(500).send('Internal Server Error');
      }
  });
  
  app.post('/login', async (req, res) => {

    try {
        const collection = db.collection('Users');
        const check = await collection.findOne({ name: req.body.username })
        if (check.password === req.body.password) {
         // localStorage.user = req.body.username;
         res.redirect('/main_2.html?username=' + encodeURIComponent(req.body.username));
            //res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` })
        }
        else {
            res.redirect("/main_3.html?loginFailed=e1");
        }
    }     
    catch (e) {
        res.redirect("/main_3.html?loginFailed=e2");     
    }
  })
    
  app.post('/submit', async (req, res) => {
      try {
          console.log(req.body);
          const { user_name, movie, rating } = req.body;
          const collection = db.collection('Users');
          
          // Find the existing user
          const existingUser = await collection.findOne({ name: user_name });

          if (existingUser) {
              // If the user exists, update the document to add the movie:rating pair
              const result = await collection.updateOne(
                  { _id: existingUser._id }, // Filter by the user's _id
                  { $set: { [`movies.${movie}`]: rating } } // Add the movie:rating pair
              );

              if (result.modifiedCount === 1) {
                  res.status(200).send('Movie rating added successfully.');
              } else {
                  res.status(500).send('Failed to add movie rating.');
              }
          } else {
              res.status(404).send('User not found.');
          }
      } catch (error) {
          console.error('Error:', error);
          res.status(500).send('Internal Server Error');
      }
  });

  app.post('/submit_2', async (req, res) => {
    try {
        console.log(req.body);
        const { user_name, movie, rating } = req.body;
        const collection = db.collection('Users');
        
        // Find the existing user
        const existingUser = await collection.findOne({ name: user_name });

        if (existingUser) {
            // If the user exists, update the document to add the movie:rating pair
            const result = await collection.updateOne(
                { _id: existingUser._id }, // Filter by the user's _id
                { $set: { [`myList.${movie}`]: rating } } // Add the movie:rating pair
            );

            if (result.modifiedCount === 1) {
                res.status(200).send('Movie added successfully.');
            } else {
                res.status(500).send('Failed to add movie .');
            }
        } else {
            res.status(404).send('User not found.');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
