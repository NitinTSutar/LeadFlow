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

const Brokerage = mongoose.model("Brokerage", brokerageSchema);

export default Brokerage;
