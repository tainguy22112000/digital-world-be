import { errorMessage } from '@/constants'
import { slugify } from '@/utils/helper'
import createHttpError from 'http-errors'
import {
  IProduct,
  IProductPagination,
  TCreateProduct,
  TRatingProduct,
  TUpdateProduct
} from './product.interface'
import ProductModel from './product.model'
import { randomInt } from 'crypto'

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
  },
  getAll: async ({
    limit = 20,
    page = 1,
    order = 1,
    sortBy = 'title',
    keyword = '',
    minPrice = 0,
    maxPrice = 2000000
  }: IProductPagination<IProduct>) => {
    const query = ProductModel.find({
      title: { $regex: keyword, $options: 'i' },
      price: { $gte: minPrice, $lte: maxPrice }
    })
    const x = query.clone()

    const products = await query
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ [sortBy]: order })

    const count = await x.countDocuments()

    return {
      products,
      code: 200,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page)
    }
  },
  update: async (params: TUpdateProduct) => {
    const { id, ...otherParams } = params
    const user = await ProductModel.findById(id)
    const newSlug = slugify(params.title)

    if (!user || !id) {
      throw createHttpError.NotFound('Products not found')
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      { ...otherParams, slug: newSlug },
      { returnOriginal: false, new: true }
    )

    return {
      code: 200,
      message: 'Product has been updated',
      data: updatedProduct
    }
  },
  ratings: async ({ star, comment, uid, pid }: TRatingProduct) => {
    if (!pid || !uid) {
      throw createHttpError.NotFound()
    }

    const ratingProduct = await ProductModel.findById(pid).lean()

    if (!ratingProduct) {
      throw createHttpError.NotFound()
    }
    const isExisted = ratingProduct.ratings.find(
      el => el.postedBy.toString() === uid
    )

    console.log({ isExisted, uid })
    console.log(ratingProduct.ratings)

    if (isExisted) {
      await ProductModel.updateOne(
        {
          ratings: { $elemMatch: isExisted }
        },
        {
          $set: { 'ratings.$.star': star, 'ratings.$.comment': comment }
        }
      )
    } else {
      const response = await ProductModel.findByIdAndUpdate(
        pid,
        {
          $push: { ratings: { star, comment, postedBy: uid } }
        },
        { new: true }
      )
      return {
        code: 200,
        message: 'Thanks for your feedback',
        data: response
      }
    }
    return {
      code: 200,
      message: 'Thanks for your feedback'
    }
  }
}

export default productService
