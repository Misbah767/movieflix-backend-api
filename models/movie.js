import mongoose from "mongoose";

/* ================= CONSTANTS ================= */
const GENRES = [
  "Action",
  "Drama",
  "Comedy",
  "Horror",
  "Thriller",
  "Fantasy",
  "Animation",
  "Documentary",
];

const LANGUAGES = ["English", "Hindi", "Urdu", "Korean", "Japanese"];

/* ================= SUB SCHEMAS ================= */
const mediaSchema = new mongoose.Schema(
  {
    poster: String,
    trailerUrl: String,
  },
  { _id: false }
);

const statsSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

/* ================= MAIN SCHEMA ================= */
const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    genre: {
      type: [String],
      enum: GENRES,
      required: true,
      index: true,
    },

    releaseYear: {
      type: Number,
      required: true,
      index: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    language: {
      type: String,
      enum: LANGUAGES,
      default: "English",
      index: true,
    },

    media: mediaSchema,
    stats: statsSchema,

    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
      versionKey: false, // removes __v
      transform(doc, ret) {
        ret.id = ret._id; // keep id
        delete ret._id; // remove _id
      },
    },

    toObject: {
      virtuals: true,
    },
  }
);

/* ================= INDEXES ================= */
movieSchema.index({
  title: "text",
  description: "text",
  genre: "text",
});

movieSchema.index({ releaseYear: -1, "stats.rating": -1 });

/* ================= VIRTUALS ================= */
movieSchema.virtual("durationInHours").get(function () {
  return (this.duration / 60).toFixed(1);
});

/* ================= MIDDLEWARE ================= */
movieSchema.pre("save", function (next) {
  if (!this.isModified("title")) return next();

  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  next();
});

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
