import { useEffect, useState } from 'react';
import { useItemsStore } from '../store/itemsStore';
// import { useAuthStore } from '../store/authStore';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import ClaimStatusPill from '../components/Claims/ClaimStatusPill';
import { Link } from 'react-router-dom';

interface Claim {
  id: number;
  status: string;
  message: string;
  rejection_reason?: string;
  created_at: string;
  claimant: { id: number; username: string };
  lost_item?: { id: number; title: string };
  found_item?: { id: number; title: string };
}

export default function ReportedItems() {
  // const { user } = useAuthStore();
  const {
    lostItems,
    foundItems,
    fetchLostItems,
    fetchFoundItems,
    ownerClaims,
    fetchOwnerClaims,
    respondToClaim,
    // claimsLoading,
  } = useItemsStore();

  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    type: 'accept' | 'reject' | null;
    claim?: Claim;
  }>({ type: null });
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchLostItems({ mine: true });
    fetchFoundItems({ mine: true });
    fetchOwnerClaims();
  }, [fetchLostItems, fetchFoundItems, fetchOwnerClaims]);

  // const myItemIds = new Set([
  //   ...lostItems.map((i) => `lost-${i.id}`),
  //   ...foundItems.map((i) => `found-${i.id}`),
  // ]);

  const claimsByItem: Record<string, Claim[]> = {};
  ownerClaims.forEach((claim: Claim) => {
    const key = claim.lost_item ? `lost-${claim.lost_item.id}` : `found-${claim.found_item?.id}`;
    if (!claimsByItem[key]) claimsByItem[key] = [];
    claimsByItem[key].push(claim);
  });

  const handleAccept = async () => {
    if (!modal.claim) return;
    await respondToClaim(modal.claim.id, 'accept');
    setModal({ type: null });
    fetchOwnerClaims();
  };

  const handleReject = async () => {
    if (!modal.claim) return;
    if (!rejectReason.trim()) return;
    await respondToClaim(modal.claim.id, 'reject', { rejection_reason: rejectReason });
    setRejectReason('');
    setModal({ type: null });
    fetchOwnerClaims();
  };

  const renderItemRow = (item: any, type: 'lost' | 'found') => {
    const key = `${type}-${item.id}`;
    const claims = claimsByItem[key] || [];
    const isExpanded = expandedItemId === key;

    return (
      <div key={key} className="border border-gray-200 rounded-lg overflow-hidden mb-3 bg-white">
        <button
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50"
          onClick={() => setExpandedItemId(isExpanded ? null : key)}
        >
          <div className="flex flex-col text-left">
            <span className="font-semibold text-gray-900 text-sm">
              {item.title} reported on {new Date(item.lost_found_date).toLocaleDateString()}
            </span>
            <span className="text-xs text-gray-500">
              {claims.length} {claims.length === 1 ? 'claim' : 'claims'} • Status: {item.status}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            {claims.length > 0 && (
              <span className="text-xs text-gray-500 px-2 py-1 rounded-full bg-gray-100">
                {claims.filter((c) => c.status === 'requested' || c.status === 'appealed').length} pending
              </span>
            )}
            {isExpanded ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </button>

        {isExpanded && (
          <div className="border-t border-gray-200 px-4 py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-800 mb-1">Details</p>
                <p className="text-gray-600">
                  <span className="font-medium">Type:</span> {type === 'lost' ? 'Lost item' : 'Found item'}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(item.lost_found_date).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span> {item.lost_found_location}
                </p>
                <p className="text-gray-600 mt-2 line-clamp-3">{item.description}</p>
              </div>
              <div className="flex flex-col items-start md:items-end space-y-3">
                <Link
                  to={`/items/${type}/${item.id}`}
                  className="btn-secondary text-sm"
                >
                  View item page
                </Link>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="font-semibold text-gray-800 mb-3">Claims</p>
              {claims.length === 0 ? (
                <p className="text-sm text-gray-500">No claims submitted for this item yet.</p>
              ) : (
                <div className="space-y-3">
                  {claims.map((claim) => (
                    <div
                      key={claim.id}
                      className="rounded-lg border border-gray-200 p-3 flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0"
                    >
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">
                            {claim.claimant?.username || 'User'}
                          </span>
                          <ClaimStatusPill status={claim.status} />
                        </div>
                        <p className="text-gray-600 line-clamp-2">{claim.message}</p>
                        {claim.status === 'rejected' && claim.rejection_reason && (
                          <p className="text-xs text-red-600">
                            <span className="font-semibold">Rejection reason:</span>{' '}
                            {claim.rejection_reason}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          Submitted {new Date(claim.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {['requested', 'appealed'].includes(claim.status) && (
                          <>
                            <button
                              onClick={() => setModal({ type: 'accept', claim })}
                              className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-semibold"
                            >
                              Accept claim
                            </button>
                            <button
                              onClick={() => {
                                setRejectReason('');
                                setModal({ type: 'reject', claim });
                              }}
                              className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold"
                            >
                              Reject claim
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const myItems = [
    ...lostItems.map((i) => ({ ...i, _type: 'lost' as const })),
    ...foundItems.map((i) => ({ ...i, _type: 'found' as const })),
  ].sort((a, b) => new Date(b.lost_found_date).getTime() - new Date(a.lost_found_date).getTime());

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Reported Items</h1>
          <p className="text-gray-600 mt-2">
            Manage all items you&apos;ve reported and review incoming claims.
          </p>
        </div>

        {myItems.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">You haven&apos;t reported any items yet.</p>
            <div className="flex justify-center space-x-3">
              <Link to="/items/report/lost" className="btn-primary">
                Report Lost Item
              </Link>
              <Link to="/items/report/found" className="btn-secondary">
                Report Found Item
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {myItems.map((item: any) => renderItemRow(item, item._type))}
          </div>
        )}
      </div>

      {/* Accept / Reject Modals */}
      {modal.type && modal.claim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-8">
            {modal.type === 'accept' ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Accept claim</h2>
                <p className="text-gray-600 text-sm mb-6 text-center">
                  Are you sure you want to accept this claim? Accepting means the details submitted
                  fit the lost item and you are ready to coordinate a handover.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    className="btn-secondary"
                    onClick={() => setModal({ type: null })}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary"
                    onClick={handleAccept}
                  >
                    Accept claim
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Reject claim</h2>
                <p className="text-gray-600 text-sm mb-4 text-center">
                  Are you sure you want to reject this claim? Rejecting means the details submitted
                  do not fit the lost item. Please provide a short reason that will be shared with the
                  claimant.
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Why are you rejecting this claim?
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                  className="input-field mb-4"
                  placeholder="Add a brief explanation..."
                />
                <div className="flex justify-end space-x-3">
                  <button
                    className="btn-secondary"
                    onClick={() => setModal({ type: null })}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary"
                    onClick={handleReject}
                    disabled={!rejectReason.trim()}
                  >
                    Reject claim
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


