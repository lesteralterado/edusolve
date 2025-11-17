import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Eye, Clock, ChevronDown, ChevronUp, Search, Home, BarChart3 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TeacherSupportHub = () => {
  // const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    duration: '',
    category: '',
    subcategory: '',
    videoFile: null
  });


  // Fetch videos from API on mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/videos');
        setVideos(response.data);
      } catch (err) {
        console.error('Error fetching videos:', err);
      }
    };
    fetchVideos();
  }, []);

  const handleVideoClick = async (video) => {
    setSelectedVideo(video);
    try {
      await axios.put(`http://localhost:4000/api/videos/${video._id}/view`);
      // Update local state
      setVideos(videos.map(v => v._id === video._id ? { ...v, views: v.views + 1 } : v));
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  const toggleCategory = (category) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter(c => c !== category));
    } else {
      setExpandedCategories([...expandedCategories, category]);
    }
  };

  const filteredVideos = () => {
    if (!searchTerm) return null;

    return videos.filter(video =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getTotalViews = () => {
    return videos.reduce((sum, video) => sum + video.views, 0);
  };

  const getMostViewedVideos = () => {
    return [...videos]
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  };

  const getGroupedVideos = () => {
    const grouped = {};
    videos.forEach(video => {
      if (!grouped[video.category]) {
        grouped[video.category] = {
          icon: video.category === "Student's Diversity" ? "👥" :
                video.category === "Community Practices" ? "🏘️" : "📚",
          color: video.category === "Student's Diversity" ? "from-blue-500 to-blue-600" :
                 video.category === "Community Practices" ? "from-green-500 to-green-600" : "from-purple-500 to-purple-600",
          subcategories: {}
        };
      }
      if (!grouped[video.category].subcategories[video.subcategory]) {
        grouped[video.category].subcategories[video.subcategory] = [];
      }
      grouped[video.category].subcategories[video.subcategory].push(video);
    });
    return grouped;
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return; // Prevent multiple submissions

    setUploading(true);
    const formData = new FormData();
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);
    formData.append('duration', uploadForm.duration);
    formData.append('category', uploadForm.category);
    formData.append('subcategory', uploadForm.subcategory);
    formData.append('video', uploadForm.videoFile);

    try {
      const response = await axios.post('http://localhost:4000/api/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Add the new video to the state
      setVideos([...videos, response.data]);
      toast.success("Successfully uploaded!");
      // Reset form and close modal
      setUploadForm({
        title: '',
        description: '',
        duration: '',
        category: '',
        subcategory: '',
        videoFile: null
      });
      setShowUploadModal(false);
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (currentPage === 'analytics') {
    const mostViewed = getMostViewedVideos();
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <nav className="bg-black bg-opacity-50 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Teacher Support Hub</h1>
                <p className="text-xs text-purple-300">Analytics Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">Total Videos</p>
                  <p className="text-4xl font-bold text-white mt-2">
                    {videos.length}
                  </p>
                </div>
                <Play className="w-12 h-12 text-purple-400" />
              </div>
            </div>
            

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">Total Views</p>
                  <p className="text-4xl font-bold text-white mt-2">{getTotalViews()}</p>
                </div>
                <Eye className="w-12 h-12 text-purple-400" />
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">Categories</p>
                  <p className="text-4xl font-bold text-white mt-2">{[...new Set(videos.map(v => v.category))].length}</p>
                </div>
                <BarChart3 className="w-12 h-12 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Upload New Video</h2>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all shadow-lg"
              >
                <Play className="w-5 h-5" />
                <span>Upload Video</span>
              </button>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-white mb-6">Most Viewed Videos</h2>
            <div className="space-y-4">
              {mostViewed.map((video, index) => (
                <div key={video._id} className="flex items-center space-x-4 p-4 bg-black bg-opacity-30 rounded-lg hover:bg-opacity-40 transition-all">
                  <div className="text-3xl font-bold text-purple-400 w-12 text-center">
                    #{index + 1}
                  </div>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{video.title}</h3>
                    <p className="text-purple-300 text-sm">{video.category} → {video.subcategory}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-300">
                    <Eye className="w-5 h-5" />
                    <span className="text-2xl font-bold">{video.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedVideo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <nav className="bg-black bg-opacity-50 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Teacher Support Hub</h1>
            </div>
            <button
              onClick={() => setSelectedVideo(null)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              ← Back to Videos
            </button>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-black rounded-xl overflow-hidden aspect-video mb-6">
            <video
              controls
              className="w-full h-full"
              poster={selectedVideo.thumbnail}
            >
              <source src={selectedVideo.cloudinaryUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
            <h1 className="text-3xl font-bold text-white mb-4">{selectedVideo.title}</h1>
            <div className="flex items-center space-x-6 text-purple-300 mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{selectedVideo.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>{selectedVideo.views} views</span>
              </div>
            </div>
            <p className="text-purple-100 text-lg">{selectedVideo.description}</p>
          </div>
        </div>
      </div>
    );
  }

  const searchResults = filteredVideos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="bg-black bg-opacity-50 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <Play className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Teacher Support Hub</h1>
                <p className="text-sm text-purple-300">Solutions for Common School Concerns</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentPage('analytics')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all shadow-lg"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for videos or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-md"
            />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {searchResults && searchResults.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Search Results ({searchResults.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map(video => (
                <div
                  key={video._id}
                  onClick={() => handleVideoClick(video)}
                  className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-all duration-300 border border-purple-500/30 hover:border-purple-400 shadow-xl"
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-white text-xs flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{video.duration}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-purple-300 mb-2">
                      {video.category} → {video.subcategory}
                    </div>
                    <h3 className="text-white font-semibold mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-purple-200 text-sm line-clamp-2">{video.description}</p>
                    <div className="flex items-center space-x-2 mt-3 text-purple-300 text-sm">
                      <Eye className="w-4 h-4" />
                      <span>{video.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : searchTerm ? (
          <div className="text-center text-purple-300 py-12">
            <p className="text-xl">No videos found for "{searchTerm}"</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(getGroupedVideos()).map(([theme, themeData]) => (
              <div key={theme} className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl overflow-hidden border border-purple-500/30 shadow-xl">
                <button
                  onClick={() => toggleCategory(theme)}
                  className={`w-full p-6 flex items-center justify-between bg-gradient-to-r ${themeData.color} hover:opacity-90 transition-opacity`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">{themeData.icon}</span>
                    <div className="text-left">
                      <h2 className="text-2xl font-bold text-white">{theme}</h2>
                      <p className="text-purple-100 text-sm">
                        {Object.keys(themeData.subcategories).length} subcategories
                      </p>
                    </div>
                  </div>
                  {expandedCategories.includes(theme) ? (
                    <ChevronUp className="w-6 h-6 text-white" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-white" />
                  )}
                </button>

                {expandedCategories.includes(theme) && (
                  <div className="p-6 space-y-6">
                    {Object.entries(themeData.subcategories).map(([subcategory, videos]) => (
                      <div key={subcategory}>
                        <h3 className="text-xl font-semibold text-purple-200 mb-4 flex items-center">
                          <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                          {subcategory}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {videos.map(video => (
                            <div
                              key={video._id}
                              onClick={() => handleVideoClick(video)}
                              className="bg-black bg-opacity-30 rounded-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-all duration-300 hover:bg-opacity-40 border border-purple-500/20 hover:border-purple-400"
                            >
                              <div className="relative">
                                <img
                                  src={video.thumbnail}
                                  alt={video.title}
                                  className="w-full h-40 object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
                                  <Play className="w-12 h-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-white text-xs flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{video.duration}</span>
                                </div>
                              </div>
                              <div className="p-3">
                                <h4 className="text-white font-semibold mb-1 line-clamp-2 text-sm">
                                  {video.title}
                                </h4>
                                <p className="text-purple-300 text-xs line-clamp-2">{video.description}</p>
                                <div className="flex items-center space-x-2 mt-2 text-purple-300 text-xs">
                                  <Eye className="w-3 h-3" />
                                  <span>{video.views} views</span>
                                </div>

                            </div>

                          </div>

                        ))}

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </div>

    {/* Upload Modal */}
    {showUploadModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[1000]">
        <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4 border border-purple-500/30">
          <h3 className="text-xl font-bold text-white mb-4">Upload New Video</h3>
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div>
              <label className="block text-purple-300 text-sm mb-1">Title</label>
              <input
                type="text"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-purple-300 text-sm mb-1">Description</label>
              <textarea
                value={uploadForm.description}
                onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-20"
                required
              />
            </div>
            <div>
              <label className="block text-purple-300 text-sm mb-1">Duration (e.g., 5:30)</label>
              <input
                type="text"
                value={uploadForm.duration}
                onChange={(e) => setUploadForm({...uploadForm, duration: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-purple-300 text-sm mb-1">Category</label>
              <select
                value={uploadForm.category}
                onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select Category</option>
                <option value="Student's Diversity">Student's Diversity</option>
                <option value="Community Practices">Community Practices</option>
                <option value="Teaching Strategies">Teaching Strategies</option>
              </select>
            </div>
            <div>
              <label className="block text-purple-300 text-sm mb-1">Subcategory</label>
              <input
                type="text"
                value={uploadForm.subcategory}
                onChange={(e) => setUploadForm({...uploadForm, subcategory: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-purple-300 text-sm mb-1">Video File</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setUploadForm({...uploadForm, videoFile: e.target.files[0]})}
                className="w-full px-3 py-2 bg-slate-700 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                required
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    <ToastContainer position="top-center" />

  </div>

);

};

export default TeacherSupportHub;