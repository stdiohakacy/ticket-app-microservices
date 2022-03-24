import express from 'express';
const router = express.Router();

router.post('/api/users/sign-out', (req, res) => {
    return res.json({ message: "Sign out" })
});

export {router as signOutRouter}