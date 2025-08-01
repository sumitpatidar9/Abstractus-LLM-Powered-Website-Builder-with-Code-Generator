import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'ai'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  code: {
    type: new mongoose.Schema({
      jsxTsx: {
        type: String,
        default: '',
      },
      css: {
        type: String,
        default: '',
      },
    }, { _id: false }),
    required: function () {
      return this.role === 'ai';
    },
  },
  previewState: {
    type: mongoose.Schema.Types.Mixed,
    required: function () {
      return this.role === 'ai';
    },
  },
}, { timestamps: true });

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    default: 'Untitled',
  },
  chatHistory: {
    type: [chatMessageSchema],
    default: [],
  },
}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);
export { Session };
