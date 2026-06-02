import express from 'express'
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../controllers/product.controller.js'
import protect from '../middleware/auth.middleware.js'
import adminOnly from '../middleware/adminOnly.middleware.js'
import productCreationLimiter from '../middleware/rateLimit.middleware.js'
const router = express.Router()


// public access
router.get('/', getAllProducts)
router.get('/:id', getProductById)

// Private access
router.post('/', protect, adminOnly, productCreationLimiter, createProduct)
router.put('/:id', protect, adminOnly, updateProduct)
router.delete('/:id', protect, adminOnly, deleteProduct)

export default router