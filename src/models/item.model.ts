import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from './category.model';
import { ISubCategory } from './subcategory.model';

export interface IItem extends Document {
  _id: string;
  name: string;
  image: string;
  description: string;
  category: ICategory['_id'];
  subCategory?: ISubCategory['_id'];
  taxApplicability: boolean;
  tax?: number;
  baseAmount: number;
  discount: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Item image URL is required']
  },
  description: {
    type: String,
    required: [true, 'Item description is required']
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  subCategory: {
    type: Schema.Types.ObjectId,
    ref: 'SubCategory'
  },
  taxApplicability: {
    type: Boolean,
    required: true,
    default: false
  },
  tax: {
    type: Number,
    required: function(this: IItem) {
      return this.taxApplicability === true;
    },
    min: 0,
    max: 100
  },
  baseAmount: {
    type: Number,
    required: [true, 'Base amount is required'],
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware to calculate total amount before save
itemSchema.pre("save", function (next) {
  this.totalAmount = this.baseAmount - this.discount;
  next();
});

// Middleware to calculate total amount before update
itemSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
  const update = this.getUpdate() as any;
  if (update.baseAmount || update.discount) {
    const doc = await this.model.findOne(this.getQuery());
    update.totalAmount = (update.baseAmount || doc.baseAmount) - (update.discount || doc.discount);
  }
  next();
});

// Compound index for unique item names within a category/subcategory
itemSchema.index({ category: 1, subCategory: 1, name: 1 }, { unique: true });

// Text index for search functionality
itemSchema.index({ name: "text", description: "text" });

export default mongoose.model<IItem>("Item", itemSchema);
