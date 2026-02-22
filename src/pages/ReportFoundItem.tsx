import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItemsStore } from '../store/itemsStore';
import { MapPinIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ReportFoundItem() {
  const navigate = useNavigate();
  const { createFoundItem, fetchCategories, categories } = useItemsStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    lost_found_location: '',
    latitude: '',
    longitude: '',
    address: '',
    city: '',
    state: '',
    country: '',
    lost_found_date: new Date().toISOString().split('T')[0],
    reward_offered: '',
    tags: '',
    is_safe_keeping: true,
    verification_questions: [
      { question: '', answer: '' }
    ],
    is_priority: false,
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleVerificationChange = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData(prev => {
      const newQuestions = prev.verification_questions.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      );
      
      // If this is the last question and both fields have values, add a new empty question
      const isLastQuestion = index === newQuestions.length - 1;
      const currentQuestion = newQuestions[index];
      
      if (isLastQuestion && currentQuestion.question.trim() && currentQuestion.answer.trim()) {
        newQuestions.push({ question: '', answer: '' });
      }
      
      return {
        ...prev,
        verification_questions: newQuestions
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    
    const newImages = [...images, ...files];
    setImages(newImages);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode using OpenStreetMap Nominatim API
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            );
            const data = await response.json();
            
            setFormData(prev => ({
              ...prev,
              latitude: latitude.toString(),
              longitude: longitude.toString(),
              lost_found_location: data.display_name || '',
              city: data.address?.city || data.address?.town || data.address?.village || '',
              state: data.address?.state || '',
              country: data.address?.country || '',
            }));
          } catch (geocodeError) {
            console.error('Geocoding error:', geocodeError);
            // Still set coordinates even if reverse geocoding fails
            setFormData(prev => ({
              ...prev,
              latitude: latitude.toString(),
              longitude: longitude.toString(),
            }));
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Unable to retrieve your location. Please enter it manually.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } catch (err) {
      setError('Error accessing location services');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          if (key === 'category' && value) {
            formDataToSend.append('category_id', String(value));
          } else if (key === 'is_priority' || key === 'is_safe_keeping') {
            formDataToSend.append(key, typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value));
          } else if (key === 'verification_questions') {
            // Only include questions that have both question and answer
            const validQuestions = (value as any[]).filter(q => q.question.trim() && q.answer.trim());
            if (validQuestions.length > 0) {
              formDataToSend.append('verification_questions', JSON.stringify(validQuestions));
            }
          } else {
            formDataToSend.append(key, String(value));
          }
        }
      });

      images.forEach((image) => {
        formDataToSend.append('primary_image', image);
      });

      await createFoundItem(formDataToSend);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create found item report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Report Found Item</h1>
          <p className="text-gray-600 mt-2">Help reunite someone with their lost item by reporting what you found.</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6 text-left">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Item Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Black iPhone 13 Pro Max"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Describe the item you found..."
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., phone, black, case"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Location Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="lost_found_location" className="block text-sm font-medium text-gray-700 mb-1">
                  Where did you find it? <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lost_found_location"
                  name="lost_found_location"
                  required
                  value={formData.lost_found_location}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Central Park, Coffee Shop on Main St"
                />
              </div>

              <button
                type="button"
                onClick={getCurrentLocation}
                className="btn-secondary text-sm"
              >
                <MapPinIcon className="h-4 w-4 inline mr-2" />
                Use Current Location
              </button>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="lost_found_date" className="block text-sm font-medium text-gray-700 mb-1">
                  When did you find it? <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="lost_found_date"
                  name="lost_found_date"
                  required
                  value={formData.lost_found_date}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_safe_keeping"
                  name="is_safe_keeping"
                  checked={formData.is_safe_keeping}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="is_safe_keeping" className="ml-2 block text-sm text-gray-900">
                  Item is in safe keeping
                </label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Images</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                  <PhotoIcon className="h-8 w-8 text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <div className="flex-1 grid grid-cols-4 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500">Upload up to 5 images. First image will be used as the primary image.</p>
            </div>
          </div>

          {/* Verification Questions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Verification Questions</h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Add questions that only the true owner would know. New questions will appear as you fill them out.
            </p>
            <div className="space-y-6">
              {formData.verification_questions.map((item, index) => {
                // Only show questions that are either filled or are the current active one
                const isCurrentActive = index === 0 || 
                  formData.verification_questions.slice(0, index).every(q => q.question.trim() && q.answer.trim());
                
                if (!isCurrentActive) return null;
                
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700">Question {index + 1}</h4>
                      {index > 0 && !item.question.trim() && !item.answer.trim() && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              verification_questions: prev.verification_questions.filter((_, i) => i !== index)
                            }));
                          }}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`question_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Question
                        </label>
                        <input
                          type="text"
                          id={`question_${index}`}
                          value={item.question}
                          onChange={(e) => handleVerificationChange(index, 'question', e.target.value)}
                          className="input-field"
                          placeholder="e.g., What color is the case?"
                        />
                      </div>
                      <div>
                        <label htmlFor={`answer_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Answer
                        </label>
                        <input
                          type="text"
                          id={`answer_${index}`}
                          value={item.answer}
                          onChange={(e) => handleVerificationChange(index, 'answer', e.target.value)}
                          className="input-field"
                          placeholder="e.g., Blue"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              <p className="text-xs text-gray-500 text-center">
                💡 Fill out both question and answer to add another verification question. At least one is recommended.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Additional Options</h3>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_priority"
                  name="is_priority"
                  checked={formData.is_priority}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="is_priority" className="ml-2 block text-sm text-gray-900">
                  Priority Listing (requires subscription)
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

