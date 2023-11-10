import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());
async function queryText(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/google/flan-t5-large",
    {
      headers: {
        Authorization: "Bearer "+process.env.HF_TOKEN,
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

app.post("/get-prompt-result", async (req, res) => {
  await queryText({ inputs: req.body.prompt }).then((response) => {
    console.log(JSON.stringify(response));
    if(!response.error)
    return res.send(response[0].generated_text);
    else
    return res.send(response.error);
  });
});

app.listen(process.env.APP_PORT, () => {
  console.log("Server is running on port " + process.env.APP_PORT);
});
