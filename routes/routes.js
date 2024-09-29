const express = require('express');
const router = express.Router();
const { client } = require('../config')
const validator = require('../utils/validator');
const { JWTgenerator } = require('../utils/JWTgenerator');
const auth = require('../utils/auth');

let db = client.db("users")

router.post('/register', async (req, res) => {
  const {
    name,
    lastNameP,
    lastNameM,
    phoneNumber,
    email,
    username,
    password
  } = req.body;

  try {
    validator(req.body)
    const exist = await db.collection('users').findOne({ username });
    if (exist) {
      return res.status(400).json({ msg: 'User ya existe' });
    }

    const newUser = {
      name,
      lastNameP,
      lastNameM,
      phoneNumber,
      email,
      username,
      password,
      createdAt: new Date()
    };
    const result = await db.collection('users').insertOne(newUser);

    res.status(201).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});

router.post('/login', async (req, res) => {
  const {
    username,
    password
  } = req.body;
  try {
    const user = await db.collection('users').findOne({ username });
    if (!user) {
      return res.status(400).send('No existe');
    }

    if (!(user.password === password)) {
      return res.status(400).send('Contrasenia incorrecta');
    }

    const token = JWTgenerator({ user: { id: user._id } });
    await db.collection('jwt').insertOne({ jwt: token });

    res.cookie("token", token, {
      path: "/",
      expires: new Date(Date.now() + 86400000),
      secure: true,
      httpOnly: true,
      sameSite: "None",
    })
    res.status(201).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }

});

router.get('/', auth, async (req, res) => {
  try {
    const users = await db.collection('users').find().toArray();
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

router.get('/logout', auth, async (req, res) => {
  const authHeader = req.header('Authorization');
  const token = authHeader.split(' ')[1];

  try {
    const result = await db.collection('jwt').deleteOne({ jwt: token });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: 'jwt no existe' });
    }

    res.json({ msg: 'logout' });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});



module.exports = router;