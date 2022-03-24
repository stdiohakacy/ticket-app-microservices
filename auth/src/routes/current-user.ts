
import express from 'express';
const router = express.Router();

router.get('/api/users/current-user', (req, res) => {
    return res.json({ message: "current user" });
})

export { router as currentUserRouter };