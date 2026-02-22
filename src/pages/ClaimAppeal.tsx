import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import ClaimStatusPill from '../components/Claims/ClaimStatusPill';
import { useItemsStore } from '../store/itemsStore';

export default function ClaimAppeal() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { appealClaim } = useItemsStore();
  const [claim, setClaim] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [appealMessage, setAppealMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchClaim = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/items/claims/${id}/`);
        setClaim(response.data);
      } finally {
        setLoading(false);
      }
    };
    fetchClaim();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    setFiles((prev) => [...prev, ...selectedFiles]);

    // Create preview URLs for images
    selectedFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitAppeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !appealMessage.trim()) return;

    const formData = new FormData();
    formData.append('appeal_message', appealMessage);
    
    // Append each file
    files.forEach((file) => {
      formData.append('appeal_files', file);
    });

    await appealClaim(parseInt(id, 10), formData as any);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Claim not found</h2>
          <Link to="/items" className="text-primary-600 hover:text-primary-700">
            Back to items
          </Link>
        </div>
      </div>
    );
  }

  // Check if claim can be appealed
  const canAppeal = claim.status === 'rejected' && (claim.appeal_count || 0) < 2;
  const appealCount = claim.appeal_count || 0;

  const item = claim.found_item || claim.lost_item;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold mb-4 group"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">
                Appeal Decision
              </h1>
              <p className="text-gray-600">Review the claim details and submit additional evidence to appeal this decision</p>
            </div>
            <ClaimStatusPill status={claim.status} />
          </div>
        </div>

        {/* Main Content Grid - 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left: Item Image and Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
                {item?.primary_image ? (
                  <img
                    src={item.primary_image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <span className="text-4xl">📦</span>
                    <p className="mt-2 text-sm">No image available</p>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-3 border-t border-gray-100">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">Item Type</h3>
                  <p className="text-xs text-gray-600">{item?.category?.name || 'Uncategorized'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">Location</h3>
                  <p className="text-xs text-gray-600">{item?.city || item?.lost_found_location || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">Report Date</h3>
                  <p className="text-xs text-gray-600">
                    {new Date(item?.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">Item Details</h3>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>Views: {item?.views_count || 0}</p>
                    <p>Likes: {item?.likes_count || 0}</p>
                    <p>Status: <span className="font-medium capitalize">{item?.status || 'Unknown'}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle & Right: Claim Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Title and Description */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{item?.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item?.description || 'No description provided'}
              </p>
            </div>

            {/* Rejection Reason */}
            <div className="bg-red-50 rounded-xl shadow-lg border border-red-200 p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2 flex items-center space-x-2">
                <span>❌</span>
                <span>Reason for Rejection</span>
              </h3>
              <p className="text-red-800 text-sm">
                {claim.rejection_reason || 'The owner has rejected this claim.'}
              </p>
            </div>

            {/* Your Original Claim */}
            <div className="bg-blue-50 rounded-xl shadow-lg border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                <span>📝</span>
                <span>Your Original Claim</span>
              </h3>
              <p className="text-blue-800 text-sm whitespace-pre-line max-h-40 overflow-y-auto">
                {claim.message}
              </p>
            </div>

            {/* Appeal Details - shown if there's already an appeal */}
            {claim.status === 'appealed' && claim.appeal_message && (
              <div className="bg-green-50 rounded-xl shadow-lg border border-green-200 p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2 flex items-center space-x-2">
                  <span>✅</span>
                  <span>Your Appeal Details</span>
                </h3>
                <p className="text-green-800 text-sm whitespace-pre-line max-h-40 overflow-y-auto">
                  {claim.appeal_message}
                </p>
                
                {/* Appeal Files */}
                {claim.appeal_files_list && claim.appeal_files_list.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <h4 className="text-sm font-semibold text-green-900 mb-3">📎 Attached Files</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {claim.appeal_files_list.map((fileObj: any, index: number) => (
                        <a
                          key={index}
                          href={fileObj.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative group"
                        >
                          {fileObj.file.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <img
                              src={fileObj.file}
                              alt={`Appeal file ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-green-300 hover:border-green-500 transition-colors"
                            />
                          ) : (
                            <div className="w-full h-24 bg-green-100 rounded-lg border border-green-300 hover:border-green-500 transition-colors flex items-center justify-center">
                              <span className="text-xs text-green-600 text-center truncate px-2">
                                {fileObj.file.split('/').pop()}
                              </span>
                            </div>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Appeal Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            📤 Submit Your Appeal
          </h2>
          
          {!canAppeal ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
              {claim.status !== 'rejected' ? (
                <>
                  <p className="text-amber-800 font-semibold text-lg mb-2">
                    ⚠️ This claim cannot be appealed
                  </p>
                  <p className="text-amber-700">
                    Only rejected claims can be appealed. Current status: {claim.status}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-amber-800 font-semibold text-lg mb-2">
                    📵 Appeal Limit Reached
                  </p>
                  <p className="text-amber-700">
                    You have used all {appealCount} of your allowed appeals for this claim.
                  </p>
                </>
              )}
            </div>
          ) : submitted ? (
            <div className="text-center py-12">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-4xl">✅</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Appeal Submitted!</h3>
              <p className="text-gray-600 text-sm mb-4">
                Our team will review your appeal and get back to you within 48 hours.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Appeals used: {appealCount + 1} / 2
              </p>
              <button
                onClick={() => navigate('/')}
                className="btn-primary"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <>
              {appealCount > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm font-medium">
                    ℹ️ This is appeal #{appealCount + 1} of 2. Please provide strong evidence.
                  </p>
                </div>
              )}
              <form onSubmit={handleSubmitAppeal} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Evidence & Details *
                  </label>
                  <textarea
                    value={appealMessage}
                    onChange={(e) => setAppealMessage(e.target.value)}
                    rows={5}
                    className="input-field focus:ring-2 focus:ring-primary-500"
                    placeholder="Provide detailed evidence such as:
• Unique identifying marks or scratches
• Receipt or proof of purchase
• Photos of matching features
• Serial numbers or model numbers
• Any other proof of ownership..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Supporting Files (Optional)
                  </label>
                  <div className="space-y-3">
                    <label className="border-2 border-dashed border-primary-300 rounded-xl py-8 px-6 text-center text-sm text-gray-600 cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all duration-200 block">
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <p className="font-semibold text-primary-600 text-base">📎 Click to upload files</p>
                      <p className="text-xs mt-1">Attach photos, receipts, warranty cards, or any additional proof</p>
                    </label>
                    
                    {/* File previews */}
                    {files.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Selected Files ({files.length})</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {files.map((file, index) => (
                            <div key={index} className="relative group">
                              {file.type.startsWith('image/') && previewUrls[index] ? (
                                <img
                                  src={previewUrls[index]}
                                  alt={file.name}
                                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                />
                              ) : (
                                <div className="w-full h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                  <span className="text-xs text-gray-500 truncate px-2">
                                    {file.name}
                                  </span>
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!appealMessage.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Appeal ({2 - appealCount} Remaining)
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


