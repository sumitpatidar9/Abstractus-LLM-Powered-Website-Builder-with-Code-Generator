import { Router } from 'express';
import {
  postChat,
  createNewSession,
  getChatHistory,
  getAllSessions,
  getSingleSession,
  deleteSession,
  updateSessionName
} from '../Controller/Chat.js';
import { verifyUser } from '../Controller/authMiddleware.js';

const router = Router();

router.get('/chat', (req, res) => {
  res.status(200).json({ message: 'ok' });
});


router.post('/chat', verifyUser, postChat);
router.post('/chat-history', verifyUser, getChatHistory);
router.get('/sessions/:sessionId', verifyUser, getSingleSession);
router.get('/sessions', verifyUser, getAllSessions);
router.post('/session', verifyUser, createNewSession);
router.delete('/session/:id',verifyUser, deleteSession);
router.put('/session/:id', verifyUser, updateSessionName);


export { router };
