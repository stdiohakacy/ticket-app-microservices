import express from 'express';
const router = express.Router();

router.post('/api/users/sign-in', (req, res) => {
    return res.json({ message: "Sign in" })
});

export {router as signInRouter}