const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    language: { 
        type: String, 
        required: true,
        uppercase: true 
    },
    type: { 
        type: String, 
        enum: ['CODE', 'FILE'], 
        required: true 
    },
    content: { 
        type: String, 
        required: true // Jika CODE berisi syntax, jika FILE berisi URL file
    },
    notes: { 
        type: String, 
        default: "" 
    },
    previewUrl: { 
        type: String, 
        default: "" // URL Gambar preview
    },
    likes: { 
        type: Number, 
        default: 0 
    },
    downloads: { 
        type: Number, 
        default: 0 
    },
    authorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Admin',
        required: true 
    }
}, { timestamps: true });

// Indexing untuk fitur search real-time agar cepat
ProjectSchema.index({ name: 'text', language: 'text' });

module.exports = mongoose.model('Project', ProjectSchema);
