import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from './category.model';

export interface ISubCategory extends Document {
  _id: string;
  name: string;
  image: string;
  description: string;
  category: ICategory['_id'];
  taxApplicability: boolean;
  tax?: number;
  taxType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const subCategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Subcategory name is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Subcategory image URL is required']
  },
  description: {
    type: String,
    required: [true, 'Subcategory description is required']
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  taxApplicability: {
    type: Boolean,
    required: true
  },
  tax: {
    type: Number,
    required: function(this: ISubCategory) {
      return this.taxApplicability === true;
    },
    min: 0,
    max: 100
  },
  taxType: {
    type: String,
    enum: ['PERCENTAGE', 'FIXED'],
    required: function(this: ISubCategory) {
      return this.taxApplicability === true;
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

subCategorySchema.virtual('items', {
  ref: 'Item',
  foreignField: 'subCategory',
  localField: '_id'
});

// Compound index for unique subcategory names within a category
subCategorySchema.index({ category: 1, name: 1 }, { unique: true });

export default mongoose.model<ISubCategory>('SubCategory', subCategorySchema);
