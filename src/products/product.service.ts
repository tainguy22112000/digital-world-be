import { slugify } from '@/utils/helper'
import createHttpError from 'http-errors'
import { TCreateProduct } from './product.interface'
import ProductModel from './product.model'
import { errorMessage } from '@/constants'

const productService = {
  create: async (params: TCreateProduct) => {
    if (!Object.keys(params).length) throw createHttpError.NotFound()
    const slug = slugify(params.title)

    const newProduct = new ProductModel({ ...params, slug })

    if (!newProduct) throw createHttpError.BadRequest()

    return {
      code: 200,
      message: `${params.title} has been created`,
      product: (await newProduct.save()).toObject()
    }
  },
  getOne: async (id: string) => {
    const product = await ProductModel.findById(id)

    if (!product || !id.trim()) {
      return { code: 404, message: errorMessage.notFound('Product') }
    }
    return { code: 200, product }
  }
}

export default productService
