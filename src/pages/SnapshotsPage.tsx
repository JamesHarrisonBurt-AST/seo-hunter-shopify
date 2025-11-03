import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Header } from '../components/Dashboard/Header';
import { Archive, Plus, RotateCcw, Trash2, Clock, Package } from 'lucide-react';

interface Snapshot {
  id: string;
  name: string;
  description: string;
  product_count: number;
  snapshot_data: Record<string, unknown>;
  created_at: string;
}

interface Profile {
  company_name: string;
  subscription_tier: string;
  products_optimized_this_month: number;
  max_products_per_month: number;
}

export function SnapshotsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [snapshotName, setSnapshotName] = useState('');
  const [snapshotDescription, setSnapshotDescription] = useState('');

  useEffect(() => {
    if (user) {
      loadProfile();
      loadSnapshots();
    }
  }, [user]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
      .maybeSingle();

    if (data) {
      setProfile(data);
    }
  };

  const loadSnapshots = async () => {
    const { data } = await supabase
      .from('snapshots')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (data) {
      setSnapshots(data);
    }
    setLoading(false);
  };

  const handleCreateSnapshot = async () => {
    if (!snapshotName.trim()) {
      alert('Please enter a snapshot name');
      return;
    }

    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user!.id);

    const snapshotData = {
      products: products || [],
      timestamp: new Date().toISOString()
    };

    const { error } = await supabase.from('snapshots').insert({
      user_id: user!.id,
      name: snapshotName,
      description: snapshotDescription,
      product_count: products?.length || 0,
      snapshot_data: snapshotData
    });

    if (!error) {
      setSnapshotName('');
      setSnapshotDescription('');
      setShowCreateModal(false);
      loadSnapshots();
    }
  };

  const handleRestoreSnapshot = async (snapshot: Snapshot) => {
    if (!confirm(`Restore snapshot "${snapshot.name}"? This will replace all current products.`)) {
      return;
    }

    await supabase
      .from('products')
      .delete()
      .eq('user_id', user!.id);

    const products = (snapshot.snapshot_data.products as any[]) || [];

    if (products.length > 0) {
      const productsToRestore = products.map(p => ({
        user_id: user!.id,
        title: p.title,
        description: p.description,
        image_url: p.image_url,
        alt_text: p.alt_text,
        metafields: p.metafields,
        status: p.status
      }));

      await supabase.from('products').insert(productsToRestore);
    }

    alert('Snapshot restored successfully!');
  };

  const handleDeleteSnapshot = async (id: string) => {
    if (!confirm('Delete this snapshot? This action cannot be undone.')) {
      return;
    }

    await supabase.from('snapshots').delete().eq('id', id);
    loadSnapshots();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header profile={profile} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Archive className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Snapshots</h2>
            </div>
            <p className="text-gray-600">Save and restore your product catalog</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition"
          >
            <Plus className="w-5 h-5" />
            <span>Create Snapshot</span>
          </button>
        </div>

        {snapshots.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-4">
              <Archive className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No snapshots yet</h3>
            <p className="text-gray-600 mb-6">
              Create snapshots to save your product catalog and restore it anytime
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Snapshot</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snapshots.map((snapshot) => (
              <div key={snapshot.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {snapshot.name}
                    </h3>
                    {snapshot.description && (
                      <p className="text-sm text-gray-600 mb-3">{snapshot.description}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="w-4 h-4 mr-2" />
                    {snapshot.product_count} products
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {new Date(snapshot.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRestoreSnapshot(snapshot)}
                    className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition text-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Restore</span>
                  </button>
                  <button
                    onClick={() => handleDeleteSnapshot(snapshot.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-900">Create Snapshot</h2>
              <p className="text-sm text-gray-600 mt-1">Save your current product catalog</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Snapshot Name *
                </label>
                <input
                  type="text"
                  value={snapshotName}
                  onChange={(e) => setSnapshotName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Pre-optimization backup"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={snapshotDescription}
                  onChange={(e) => setSnapshotDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  placeholder="Describe this snapshot..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleCreateSnapshot}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition"
                >
                  Create Snapshot
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSnapshotName('');
                    setSnapshotDescription('');
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
