import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'fs.files',
    },
    imageUrl: {
      type: String,
    },
    stock: {
      type: Number,
      default: 100,
    },
    category: {
      type: String,
      default: 'Daily Essentials',
    },
  },
  { timestamps: true }
);

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        productName: String,
        price: Number,
        quantity: Number,
      },
    ],
    customer: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: String,
      pincode: String,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      default: 'cash_on_delivery',
    },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);
export const Order =
  mongoose.models.Order || mongoose.model('Order', orderSchema);
