import { useState } from 'react';
import toast from 'react-hot-toast';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ClaimFormData {
  message: string;
  evidence_images: File[];
  model_number: string;
  serial_number: string;
  imei: string;
  year_purchased: string;
  purchase_location: string;
  unique_features: string;
  verification_answers: { question: string; answer: string }[];
}

interface ClaimFormProps {
  onSubmit: (data: ClaimFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  verificationQuestions?: { question: string; answer: string }[];
}

export default function ClaimForm({ onSubmit, onCancel, isSubmitting, verificationQuestions = [] }: ClaimFormProps) {
  const [formData, setFormData] = useState<ClaimFormData>({
    message: '',
    evidence_images: [],
    model_number: '',
    serial_number: '',
    imei: '',
    year_purchased: '',
    purchase_location: '',
    unique_features: '',
    verification_answers: verificationQuestions.map(q => ({ question: q.question, answer: '' })),
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = [...formData.evidence_images, ...files].slice(0, 5); // Max 5 images
      setFormData({ ...formData, evidence_images: newFiles });
      
      // Create previews
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const newFiles = formData.evidence_images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, evidence_images: newFiles });
    setImagePreviews(newPreviews);
  };

  const handleVerificationAnswerChange = (index: number, answer: string) => {
    setFormData(prev => ({
      ...prev,
      verification_answers: prev.verification_answers.map((item, i) => 
        i === index ? { ...item, answer } : item
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      toast.error('Please provide a description explaining why this item is yours.');
      return;
    }
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Your Claim</h3>
        <p className="text-sm text-gray-600 mb-4">
          Provide evidence to prove ownership of this item. The more details you provide, the better your chances of recovery.
        </p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Describe why you believe this is your item. Include details about when and where you lost it, any unique features, etc."
          rows={4}
          className="input-field"
          required
        />
      </div>

      {/* Evidence Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Evidence Photos (Max 5)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Evidence ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
          {formData.evidence_images.length < 5 && (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors bg-primary-50">
              <PhotoIcon className="h-8 w-8 text-primary-500 mb-2" />
              <span className="text-sm text-primary-600 font-medium">Add Photo</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        <p className="text-xs text-gray-500">
          Upload photos of the item you have, receipts, or any other evidence proving ownership.
        </p>
      </div>

      {/* Device Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="model_number" className="block text-sm font-medium text-gray-700 mb-1">
            Model Number
          </label>
          <input
            type="text"
            id="model_number"
            value={formData.model_number}
            onChange={(e) => setFormData({ ...formData, model_number: e.target.value })}
            placeholder="e.g., iPhone 13 Pro Max"
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700 mb-1">
            Serial Number
          </label>
          <input
            type="text"
            id="serial_number"
            value={formData.serial_number}
            onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
            placeholder="Serial number if available"
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="imei" className="block text-sm font-medium text-gray-700 mb-1">
            IMEI (for phones/devices)
          </label>
          <input
            type="text"
            id="imei"
            value={formData.imei}
            onChange={(e) => setFormData({ ...formData, imei: e.target.value })}
            placeholder="IMEI number"
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="year_purchased" className="block text-sm font-medium text-gray-700 mb-1">
            Year Purchased
          </label>
          <input
            type="number"
            id="year_purchased"
            value={formData.year_purchased}
            onChange={(e) => setFormData({ ...formData, year_purchased: e.target.value })}
            placeholder="e.g., 2023"
            min="1900"
            max={new Date().getFullYear()}
            className="input-field"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="purchase_location" className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Location
          </label>
          <input
            type="text"
            id="purchase_location"
            value={formData.purchase_location}
            onChange={(e) => setFormData({ ...formData, purchase_location: e.target.value })}
            placeholder="Where did you buy this item?"
            className="input-field"
          />
        </div>
      </div>

      {/* Verification Questions */}
      {verificationQuestions.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">Verification Questions</h4>
          <p className="text-sm text-gray-600 mb-4">
            The finder has asked some questions to verify ownership. These are optional but may help prove the item is yours.
          </p>
          <div className="space-y-4">
            {formData.verification_answers.map((item, index) => (
              <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <label htmlFor={`verification_${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                  {item.question}
                </label>
                <input
                  type="text"
                  id={`verification_${index}`}
                  value={item.answer}
                  onChange={(e) => handleVerificationAnswerChange(index, e.target.value)}
                  placeholder="Your answer (optional)"
                  className="input-field"
                />
              </div>
            ))}
            <p className="text-xs text-gray-500">
              💡 Answering these questions correctly may help the finder identify you as the legitimate owner.
            </p>
          </div>
        </div>
      )}

      {/* Unique Features */}
      <div>
        <label htmlFor="unique_features" className="block text-sm font-medium text-gray-700 mb-1">
          Unique Features, Scratches, or Marks
        </label>
        <textarea
          id="unique_features"
          value={formData.unique_features}
          onChange={(e) => setFormData({ ...formData, unique_features: e.target.value })}
          placeholder="Describe any unique features, scratches, marks, stickers, or modifications that would help identify this item..."
          rows={3}
          className="input-field"
        />
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary flex-1"
          disabled={isSubmitting || !formData.message.trim()}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Claim'}
        </button>
      </div>
    </form>
  );
}


