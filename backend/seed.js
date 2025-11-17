const mongoose = require('mongoose');
const Video = require('./models/Video');
require('dotenv').config();

const videoDatabase = {
  "Student's Diversity": {
    subcategories: {
      "Difficulty in Communication": [
        {
          title: "Breaking Language Barriers in the Classroom",
          duration: "12:45",
          description: "Practical strategies for communicating with students who speak different languages.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
          title: "Non-Verbal Communication Techniques",
          duration: "10:30",
          description: "Using body language and visual aids to enhance understanding.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
          title: "Technology Tools for Multilingual Classrooms",
          duration: "15:20",
          description: "Leveraging translation apps and digital tools for better communication.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        }
      ],
      "Attitudinal Concerns": [
        {
          title: "Understanding Student Behavior Patterns",
          duration: "14:15",
          description: "Identifying root causes of negative attitudes and behavioral issues.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
          title: "Building Positive Classroom Culture",
          duration: "11:50",
          description: "Creating an environment that fosters respect and engagement.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
          title: "Conflict Resolution in Diverse Settings",
          duration: "13:40",
          description: "Effective strategies for mediating student conflicts.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        }
      ],
      "Attention Difficulties": [
        {
          title: "Engaging Students with Short Attention Spans",
          duration: "16:25",
          description: "Interactive teaching methods to maintain student focus.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
          title: "Differentiated Instruction for ADHD Students",
          duration: "18:10",
          description: "Tailoring lessons for students with attention challenges.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        }
      ]
    }
  },
  "Community Practices": {
    subcategories: {
      "Lack of Support System": [
        {
          title: "Building Teacher Support Networks",
          duration: "14:30",
          description: "Creating collaborative relationships with colleagues for mutual support.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
          title: "Engaging Parents in Student Success",
          duration: "12:55",
          description: "Strategies for effective parent-teacher communication and partnerships.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
          title: "Finding Community Resources",
          duration: "10:45",
          description: "Connecting with local organizations for classroom support.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        }
      ],
      "Large Numbers of Class": [
        {
          title: "Classroom Management for Large Classes",
          duration: "17:20",
          description: "Effective techniques for managing 40+ students in one classroom.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
          title: "Efficient Grading Systems for High Volume",
          duration: "13:15",
          description: "Time-saving strategies for assessment with many students.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
          title: "Peer Learning in Overcrowded Classrooms",
          duration: "15:40",
          description: "Leveraging student collaboration to enhance learning.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        }
      ]
    }
  },
  "Inadequate Resources and Training": {
    subcategories: {
      "Limited Instructional Materials": [
        {
          title: "Creating Low-Cost Teaching Materials",
          duration: "11:30",
          description: "DIY resources that are effective and budget-friendly.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
          title: "Free Digital Resources for Teachers",
          duration: "14:50",
          description: "Discovering quality online tools and materials at no cost.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
          title: "Resourceful Teaching Without Technology",
          duration: "12:20",
          description: "Effective methods when tech resources are unavailable.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        }
      ],
      "Insufficient Teacher Training": [
        {
          title: "Self-Directed Professional Development",
          duration: "16:35",
          description: "Taking charge of your own teaching growth and learning.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
          title: "Online Teaching Courses and Certifications",
          duration: "13:45",
          description: "Accessible professional development opportunities online.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
          title: "Mentorship: Finding and Being a Mentor",
          duration: "15:10",
          description: "Building peer mentorship relationships for growth.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        }
      ],
      "Lack of Support Staff": [
        {
          title: "Managing Without Classroom Aides",
          duration: "14:25",
          description: "Strategies for independent classroom management.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
          title: "Student Leadership Roles in the Classroom",
          duration: "11:55",
          description: "Empowering students to take on helper responsibilities.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        }
      ]
    }
  }
};

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing videos
    await Video.deleteMany({});
    console.log('Cleared existing videos');

    const videos = [];

    Object.entries(videoDatabase).forEach(([category, categoryData]) => {
      Object.entries(categoryData.subcategories).forEach(([subcategory, videoList]) => {
        videoList.forEach((video, index) => {
          videos.push({
            title: video.title,
            description: video.description,
            duration: video.duration,
            cloudinaryUrl: `https://res.cloudinary.com/demo/video/upload/v1234567890/sample_${index}.mp4`, // Placeholder
            publicId: `sample_${index}`,
            thumbnail: `https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80`, // Using same as mock
            category,
            subcategory,
            views: Math.floor(Math.random() * 100) // Random views for demo
          });
        });
      });
    });

    await Video.insertMany(videos);
    console.log(`Seeded ${videos.length} videos`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();