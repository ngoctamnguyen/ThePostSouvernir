const express = require('express');
const cors = require('cors');
const reportRouter = require('./routers/reportRouter');
const suppliersRouter = require('./routers/suppliersRouter')
const userRouter = require('./routers/userRouter');
const authRouter = require('./routers/authRouter');
const itemsRouter = require('./routers/itemsRouter');
const tygiaRouter = require('./routers/tygiaRouter');
const billRouter = require('./routers/billRouter');
const saleRouter = require('./routers/saleRouter')
const { checkToken } = require('./middleware/checkToken');

const app = express();

//middleware
app.use(cors())
app.use(express.json())

//routes
app.use('/reports', reportRouter);
app.use('/suppliers', checkToken, suppliersRouter);
app.use('/users', userRouter);
app.use('/login', authRouter);
app.use('/items', checkToken, itemsRouter);
app.use('/tygia', checkToken, tygiaRouter);
app.use('/bills', checkToken, billRouter);
app.use('/sales', checkToken, saleRouter);

app.use(function (err, req, res, next) {
     res.status(500).json({ success: false, data: err.message })
})

app.listen(8080, () => console.log('Listening on 8080...'))