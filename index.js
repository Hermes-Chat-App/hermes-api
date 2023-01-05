import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

const app = express();
const apiSpec = fs.readFileSync('api.json', 'utf8');

app.use('/', swaggerUi.serve, swaggerUi.setup(JSON.parse(apiSpec)));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});
