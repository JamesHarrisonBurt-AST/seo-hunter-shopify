import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Header } from '../components/Dashboard/Header';
import { BarChart3, TrendingUp, Package, Zap, Crown } from 'lucide-react';

interface Profile {
  company_name: string;
  subscription_tier: string;
  products_optimized_this_month: number;
  max_products_per_month: number;
}

interface UsageLog {
  id: string;
  operation_type: string;
  products_count: number;
  created_at: string;
}

const TIERS = {
  free: {
    name: 'Free',
    price: 0,
    maxProducts: 10,
    features: ['10 products/month', 'Basic optimization', 'Email support']
  },
  starter: {
    name: 'Starter',
    price: 29,
    maxProducts: 100,
    features: ['100 products/month', 'Advanced optimization', 'A/B testing', 'Priority support']
  },
  pro: {
    name: 'Pro',
    price: 99,
    maxProducts: 500,
    features: ['500 products/month', 'Premium optimization', 'A/B testing', 'Snapshots', 'API access', '24/7 support']
  },
  enterprise: {
    name: 'Enterprise',
    price: 299,
    maxProducts: -1,
    features: ['Unlimited products', 'Custom optimization', 'All features', 'Dedicated support', 'Custom integrations']
  }
};

export function UsagePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadUsageLogs();
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

  const loadUsageLogs = async () => {
    const { data } = await supabase
      .from('usage_logs')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      setUsageLogs(data);
    }
    setLoading(false);
  };

  const handleUpgrade = (tier: string) => {
    alert(`Upgrade to ${tier} plan - Payment integration coming soon!`);
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

  const usagePercentage = profile
    ? Math.min((profile.products_optimized_this_month / profile.max_products_per_month) * 100, 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header profile={profile} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Usage & Billing</h2>
          </div>
          <p className="text-gray-600">Track your usage and manage your subscription</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {profile?.products_optimized_this_month || 0}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Products Optimized</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {profile?.max_products_per_month === -1
                ? 'Unlimited'
                : `${profile?.max_products_per_month || 0} monthly limit`}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-cyan-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {usageLogs.length}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Operations</h3>
            <p className="text-xs text-gray-500 mt-2">All-time optimization operations</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">
                {TIERS[profile?.subscription_tier as keyof typeof TIERS]?.name || 'Free'}
              </span>
            </div>
            <h3 className="text-sm font-medium mb-2">Current Plan</h3>
            <p className="text-xs opacity-90">
              {profile?.subscription_tier !== 'enterprise' ? 'Upgrade for more features' : 'You have full access'}
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Pricing Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(TIERS).map(([key, tier]) => (
              <div
                key={key}
                className={`border-2 rounded-xl p-6 ${
                  profile?.subscription_tier === key
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                } transition-colors`}
              >
                <div className="text-center mb-4">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{tier.name}</h4>
                  <div className="text-3xl font-bold text-gray-900">
                    ${tier.price}
                    <span className="text-sm font-normal text-gray-600">/mo</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {tier.maxProducts === -1 ? 'Unlimited' : tier.maxProducts} products
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <Zap className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {profile?.subscription_tier === key ? (
                  <button
                    disabled
                    className="w-full py-2 px-4 bg-gray-200 text-gray-500 rounded-lg font-medium cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(tier.name)}
                    className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition"
                  >
                    {key === 'free' ? 'Downgrade' : 'Upgrade'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Usage History</h3>
          {usageLogs.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No usage history yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Operation</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Products</th>
                  </tr>
                </thead>
                <tbody>
                  {usageLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 capitalize">
                        {log.operation_type}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{log.products_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
