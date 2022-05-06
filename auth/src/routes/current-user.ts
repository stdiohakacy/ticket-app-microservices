import express from 'express';
import { currentUser } from '@ticketing-dev-org/common';
const router = express.Router();

router.get('/api/users/current-user', currentUser ,(req, res) => {
    console.log(req.currentUser);
    return res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
