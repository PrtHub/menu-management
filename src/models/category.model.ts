import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  _id: string;
  name: string;
  image: string;
  description: string;
  taxApplicability: boolean;
  tax?: number;
  taxType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Category image URL is required']
  },
  description: {
    type: String,
    required: [true, 'Category description is required']
  },
  taxApplicability: {
    type: Boolean,
    required: true,
    default: false
  },
  tax: {
    type: Number,
    required: function(this: ICategory) {
      return this.taxApplicability === true;
    },
    min: 0,
    max: 100
  },
  taxType: {
    type: String,
    enum: ['PERCENTAGE', 'FIXED'],
    required: function(this: ICategory) {
      return this.taxApplicability === true;
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate subcategories
categorySchema.virtual("subcategories", {
  ref: "SubCategory",
  foreignField: "category",
  localField: "_id",
});

export default mongoose.model<ICategory>("Category", categorySchema);
