import express from 'express'
import { productController } from './product.controller'

const router = express.Router()

router.post(
  '/products/create',
  //   verifyAccessToken,
  productController.createProduct
)

router.get(
  '/products/:id',
  //   verifyAccessToken,
  productController.getProductDetails
)

export = router
