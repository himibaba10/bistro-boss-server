const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bistro Boss server is up and running!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gadig.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const menuCollection = client
      .db("bistroBossDB")
      .collection("menuCollection");

    const reviewCollection = client
      .db("bistroBossDB")
      .collection("reviewCollection");

    // Get food items based on category
    app.get("/food", async (req, res) => {
      const category = req.query.category;

      let query = {};
      if (category) {
        query = { category };
      }

      const result = await menuCollection.find(query).toArray();
      res.send(result);
    });

    // Get all the reviews
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });
  } catch (err) {
    console.log("An error has happened", err);
  }
}
run();

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
