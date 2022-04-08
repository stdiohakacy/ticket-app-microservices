import express from 'express';
import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '../middlewares/require-auth';
const router = express.Router();

router.get('/api/users/current-user', currentUser, (req, res) => {
    return res.send({ currentUser: req.currentUser || null })
});

export { router as currentUserRouter };
