const express = require('express');
const sequelize = require('./database');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Sync database and start server
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(3000, () => console.log('Server running at http://localhost:3000'));
});