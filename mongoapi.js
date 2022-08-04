//This project is utilizing ES6 import/export syntax

import { MongoClient } from "mongodb"; //import mongo client
import { uri } from "./dbsecrets.js"; //import dbsecrets/credentials
const client = new MongoClient(uri);

const db = client.db("sample_mflix");
const movieCollection = db.collection("movies");
import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(express.json()); //allow a POST with JSON
app.use(cors()); //allow anyone to hit api

// If you go to http://localhost:4000/
app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

// Return checkboxes each with entire object for each movie that is found in query (each matrix movie)
// app.get("/movies/:movietitle", (req, res) => {
//   const movietitle = req.params.movietitle;
//   console.log(`Looking for movie ${movietitle}`);
//   const query = { title: { $regex: movietitle, $options: "i" } };

//   movieCollection
//     .find(query)
//     .limit(10)
//     .toArray((err, matchingMovies) => {
//       console.log(matchingMovies);
//         // res.status(200).json(matchingMovies);
//       let movieArray = JSON.stringify(matchingMovies);
//       console.log(movieArray);
//       function loopThrough(movieArray) {
//         let output = "<html><body><ul>";
//         for (let i = 0; i < movieArray.length; i++) {
//           output =
//             output +
//             '<li><input type="checkbox">' +
//             movieArray +
//             "</li>";
//         }
//         output = output + "</ul></body></html>";
//         res.send(output);
//       }
//       loopThrough(movieArray)
//     });
//   })

app.get("/movies/:movietitle", (req, res) => {
  const movietitle = req.params.movietitle;
  console.log(`Looking for movie ${movietitle}`);
  const query = { title: { $regex: movietitle, $options: "i" } };

  movieCollection
    .find(query)
    .limit(10)
    .toArray((err, movieArray) => {
      console.log(movieArray);
      let output = "<html><body><ul>";
      for (let i = 0; i < movieArray.length; i++) {
        output =
          output +
          '<li><input type="checkbox">' +
          movieArray[i].title +
          "</li>";
      }
      output = output + "</ul></body></html>";
      res.send(output);
    });
});

//If you go to http://localhost:4000/movies
app.get("/movies", (req, res) => {
  const query = {}; //get everything with query
  console.log(movieCollection.countDocuments(query));
  // Check how many records getting back

  movieCollection
    .find(query)
    .limit(10)
    .toArray((err, movies) => {
      res.status(200).json(movies);
    });
  //need toArray() for mongo. turns to array. allows .find to take a callback
});

//insert new movie into mongodb movies collection
app.post("/movie", (req, res) => {
  const newMovie = req.body;

  movieCollection.insertOne(newMovie, (err, results) => {
    if (err) {
      res.status(500).json({ error: true });
    } else {
      res.status(201).json(results);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Ready on http://localhost: ${PORT}`);
});
