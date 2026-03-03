import express from 'express';
import { visualSearch, getSimilarProducts } from '../controllers/searchController.js';

const router = express.Router();

// Visual search routes
router.post('/visual', visualSearch);
router.get('/similar/:productId', getSimilarProducts);

export default router;
