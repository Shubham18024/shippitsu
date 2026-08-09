import express from 'express';
import indexRouter from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/', indexRouter);

app.use((req, res) => {
    // status(404) means "Not Found" in HTTP status codes. The render('404') part tells Express to use the 404.ejs template to show a user-friendly error page.
    res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});