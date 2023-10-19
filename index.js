const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Create app
const app = express();

// Moddlware
app.use(cors());
app.use(express.json());

// #### MongoDB Code ####
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7o1h45b.mongodb.net/?retryWrites=true&w=majority`;

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
		// Create a collection
		const productCollection = client.db("shoperz").collection("product");
		const cartCollection = client.db("shoperz").collection("cart");

		/* ** PRoduct related API */

		// Get single Product API
		app.get("/products/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await productCollection.findOne(query);
			res.send(result);
		});

		// Get ALL product API
		app.get("/products", async (req, res) => {
			const result = await productCollection.find().toArray();
			res.send(result);
		});

		// POST product API
		app.post("/products", async (req, res) => {
			const newProducts = req.body;
			const result = await productCollection.insertOne(newProducts);
			res.send(result);
		});

		/* ### Cart related API ### */

		// Get all cart items
		app.get("/carts", async (req, res) => {
			const result = await cartCollection.find().toArray();
			res.send(result);
		});
		// POST add to cart item
		app.post("/carts", async (req, res) => {
			const cartItems = req.body;
			const result = await cartCollection.insertOne(cartItems);
			res.send(result);
		});

		// Delete cart item
		app.delete("/carts/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await cartCollection.deleteOne(query);
			res.send(result);
		});

		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();

		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

// * All okay
app.get("/", (req, res) => {
	res.send("Shopers server is running");
});

app.listen(port, () => {
	console.log(`Shoperz Server is running on port ${port}`);
});
