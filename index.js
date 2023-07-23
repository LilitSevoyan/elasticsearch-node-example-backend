const express = require("express")
const bodyParser = require("body-parser")
const elasticClient = require("./elastic-client")
const cors = require("cors")
require("express-async-errors")

const app = express()

app.use(bodyParser.json())
app.use(express.json())
app.use(cors())

app.get("/", (req,res) => {
    res.redirect("http://localhost:3000/")
})

app.post("/create-post", async (req, res) => {
    const result = await elasticClient.index({
        index: "posts",
        document: {
            title: req.body.title,
            author: req.body.author,
            content: req.body.content
        }
    })
    res.send(result)
})

app.delete("/remove-post", async (req, res) => {
    const result = await elasticClient.delete({
        index: "posts",
        id: req.query.id
    })
    res.json(result)
})

app.get("/search" , async (req, res) => {
    const result = await elasticClient.search({
        index: "posts",
        query: {fuzzy: {title: req.query.query}}
    })
    res.json(result)
})

app.get("/posts", async (req, res) => {
    const result = await elasticClient.search({
        index: "posts",
        query: {match_all: {}}
    })
    res.json(result)
})

app.listen(8080, () => console.log("port 8080"))