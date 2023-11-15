import { Document } from 'mongoose'

enum EProductColor {
  BLACK = 'black',
  GREEN = 'green',
  BLUE = 'blue'
}

type TRating = { star: number; posterBy: string; comment: string }
interface IProduct extends Document {
  title: string
  slug: string
  description: string
  brand: string
  code: string
  price: number

  category: string
  quantity: number
  sold: number
  images: string
  color: EProductColor
  rating: TRating
  totalRatings: number

  release_date: Date
  specs: unknown[]
}

type TCreateProduct = Omit<IProduct, 'Document'>

export { IProduct, EProductColor, TCreateProduct }
