import { useEffect, useState } from 'react';
import { useItemsStore } from '../store/itemsStore';
import { Link } from 'react-router-dom';
import Avatar from '../components/Avatar';
import ClaimStatusPill from '../components/Claims/ClaimStatusPill';
import ZoomableImage from '../components/Images/ZoomableImage';
import { imagePresets } from '../utils/cloudinary';
import {
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  DevicePhoneMobileIcon,
  XCircleIcon,
  EyeIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

type ClaimType = 'my-claims' | 'received-claims';

export default function Claims() {
  const { myClaims, ownerClaims, fetchMyClaims, fetchOwnerClaims, claimsLoading, respondToClaim } = useItemsStore();
  const [activeTab, setActiveTab] = useState<ClaimType>('my-claims');
  const [rejectModal, setRejectModal] = useState<{ claimId: number | null; reason: string }>({ claimId: null, reason: '' });
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (claimId: number, section: string) => {
    const key = `${claimId}-${section}`;
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    fetchMyClaims();
    fetchOwnerClaims();
  }, [fetchMyClaims, fetchOwnerClaims]);

  const handleAcceptClaim = async (claimId: number) => {
    try {
      await respondToClaim(claimId, 'accept');
      fetchOwnerClaims();
    } catch (error) {
      console.error('Failed to accept claim:', error);
    }
  };

  const handleRejectClaim = async () => {
    if (!rejectModal.claimId || !rejectModal.reason.trim()) return;
    try {
      await respondToClaim(rejectModal.claimId, 'reject', { rejection_reason: rejectModal.reason });
      setRejectModal({ claimId: null, reason: '' });
      fetchOwnerClaims();
    } catch (error) {
      console.error('Failed to reject claim:', error);
    }
  };

  const renderClaimCard = (claim: any, showItemInfo: boolean = true, isOwner: boolean = false) => {
    const item = claim.lost_item || claim.found_item;
    const itemType = claim.lost_item ? 'lost' : 'found';

    return (
      <div key={claim.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 p-6 md:p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <Avatar
                  src={isOwner ? claim.claimant?.profile_picture : claim.owner?.profile_picture}
                  name={(isOwner ? claim.claimant?.username : claim.owner?.username) || 'User'}
                  size="md"
                  className="ring-2 ring-slate-100"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {isOwner ? `Claim from ${claim.claimant?.username}` : `Claim sent to ${claim.owner?.username}`}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center mt-1">
                    <ClockIcon className="w-3.5 h-3.5 mr-1" />
                    {new Date(claim.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <ClaimStatusPill status={claim.status} size="md" />
            </div>

            {/* Message Bubble */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative mb-6">
              <div className="absolute top-0 left-8 -mt-2 w-4 h-4 bg-slate-50 border-t border-l border-slate-100 transform rotate-45"></div>
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center">
                <ChatBubbleLeftRightIcon className="w-3.5 h-3.5 mr-1.5" /> Message
              </h5>
              <p className="text-slate-700 leading-relaxed font-medium">{claim.message}</p>
            </div>

            {/* Expandable Sections Grid */}
            <div className="grid gap-3">
              {(claim.model_number || claim.serial_number || claim.imei) && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection(claim.id, 'device-info')}
                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center font-semibold text-slate-700 text-sm">
                      <DevicePhoneMobileIcon className="w-4 h-4 mr-2" /> Device Info
                    </div>
                    <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections[`${claim.id}-device-info`] ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSections[`${claim.id}-device-info`] && (
                    <div className="p-4 bg-slate-50 grid grid-cols-2 gap-4 text-sm border-t border-slate-100">
                      {claim.model_number && <div><span className="text-slate-400 text-xs uppercase">Model</span><p className="font-medium text-slate-800">{claim.model_number}</p></div>}
                      {claim.serial_number && <div><span className="text-slate-400 text-xs uppercase">Serial</span><p className="font-medium text-slate-800">{claim.serial_number}</p></div>}
                      {claim.imei && <div><span className="text-slate-400 text-xs uppercase">IMEI</span><p className="font-medium text-slate-800">{claim.imei}</p></div>}
                    </div>
                  )}
                </div>
              )}

              {claim.evidence_images && claim.evidence_images.length > 0 && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection(claim.id, 'evidence')}
                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center font-semibold text-slate-700 text-sm">
                      <PhotoIcon className="w-4 h-4 mr-2" /> Evidence Images ({claim.evidence_images.length})
                    </div>
                    <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections[`${claim.id}-evidence`] ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSections[`${claim.id}-evidence`] && (
                    <div className="p-4 bg-slate-50 grid grid-cols-3 gap-2 border-t border-slate-100">
                      {claim.evidence_images.map((img: string, i: number) => (
                        <ZoomableImage key={i} src={img} alt="Evidence" className="rounded-lg aspect-square object-cover border border-slate-200" transformations={imagePresets.evidence} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            {isOwner && (claim.status === 'requested' || claim.status === 'appealed') && (
              <div className="flex gap-3 mt-8">
                <button onClick={() => handleAcceptClaim(claim.id)} className="btn-primary py-2 text-sm flex-1 bg-green-600 hover:bg-green-700 from-green-600 to-green-500 shadow-green-200">
                  <CheckCircleIcon className="w-4 h-4 mr-2" /> Accept
                </button>
                <button onClick={() => setRejectModal({ claimId: claim.id, reason: '' })} className="btn-secondary py-2 text-sm flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                  <XCircleIcon className="w-4 h-4 mr-2" /> Reject
                </button>
              </div>
            )}

            {claim.rejection_reason && (
              <div className="mt-6 p-4 bg-red-50 to-pink-50 rounded-xl border border-red-100 text-sm text-red-800">
                <span className="font-bold flex items-center mb-1"><XCircleIcon className="w-4 h-4 mr-1" /> Rejected:</span>
                {claim.rejection_reason}
              </div>
            )}
          </div>

          {/* Item Sidebar */}
          <div className="w-full lg:w-72 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-100 p-6 flex flex-col">
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-white border border-slate-200">
              {item?.images && item.images.length > 0 ? (
                <img src={item.images[0].image} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-slate-300">
                  <PhotoIcon className="w-8 h-8" />
                </div>
              )}
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                {itemType}
              </div>
            </div>
            <h4 className="font-bold text-slate-900 mb-1">{item?.title}</h4>
            <div className="flex items-center text-xs text-slate-500 mb-4">
              <span className={`w-2 h-2 rounded-full mr-2 ${item?.status === 'active' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
              {item?.status}
            </div>

            <div className="mt-auto pt-4 border-t border-slate-200">
              <Link to={`/items/${itemType}/${item?.id}`} className="w-full btn-secondary py-2 text-xs justify-center">
                View Item Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 lg:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Claims</h1>
            <p className="text-slate-500 mt-1">Manage and track your item verifications</p>
          </div>
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
            <button
              onClick={() => setActiveTab('my-claims')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'my-claims' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
            >
              My Claims
            </button>
            <button
              onClick={() => setActiveTab('received-claims')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'received-claims' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Received
            </button>
          </div>
        </div>

        {claimsLoading ? (
          <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="h-64 bg-white rounded-2xl animate-pulse shadow-sm"></div>)}
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'my-claims' && myClaims.length === 0 && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChatBubbleLeftRightIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">No claims sent</h3>
                <p className="text-slate-500 text-sm">You haven't tried to claim any items yet.</p>
              </div>
            )}
            {activeTab === 'my-claims' && myClaims.map(c => renderClaimCard(c, true, false))}

            {activeTab === 'received-claims' && ownerClaims.length === 0 && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">All caught up</h3>
                <p className="text-slate-500 text-sm">No new claims to review.</p>
              </div>
            )}
            {activeTab === 'received-claims' && ownerClaims.map(c => renderClaimCard(c, true, true))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModal.claimId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold mb-4">Reject Claim</h3>
            <textarea
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              placeholder="Reason for rejection..."
              className="input-field min-h-[100px] mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={() => setRejectModal({ claimId: null, reason: '' })} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleRejectClaim} className="btn-primary flex-1 bg-red-600 hover:bg-red-700 border-none shadow-none">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}