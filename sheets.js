import express from 'express';
const app = express()

app.use(express.static('public'));
app.get('/', async (req, res) => {
  // appendToSheet();
  res.send('Hello World')}
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `Hello from Cloud Run! The container started successfully and is listening for HTTP requests on ${PORT}`
  );
});
