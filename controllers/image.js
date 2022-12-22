const {ClarifaiStub, grpc} = require('clarifai-nodejs-grpc');

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 31f818604be64ef2b6f2c36ca6739248")

const handleApiCall = (req, res) => {
  stub.PostModelOutputs(
    {
      model_id: "a403429f2ddf4b49b307e318f00e528b",
      inputs: [{ data: { image: { url: req.body.input, allow_duplicate_url: true } } }]
    },
    metadata,
    (err, response) => {
        if (err) {
            throw new Error(err);
        }
        if (response.status.code !== 10000) {
            throw new Error("Post model outputs failed, status: " + response.status.description);
        }
        // Since we have one input, one output will exist here.
        const output = response.outputs[0];
        console.log("Predicted concepts:");
        for (const concept of output.data.concepts) {
            console.log(concept.name + " " + concept.value);
        }
        res.json(response)
    }
  );
}

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
  .where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0].entries);
  })
  .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleImage,
  handleApiCall
}