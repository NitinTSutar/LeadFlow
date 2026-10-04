import mongoose from "mongoose";

const brokerageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brokerage name is required"],
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
  },
  { timestamps: true },
);

brokerageSchema.index({ name: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

const Brokerage = mongoose.model("Brokerage", brokerageSchema);

export default Brokerage;
