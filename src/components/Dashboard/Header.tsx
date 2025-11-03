import { LogOut, User, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  profile: {
    company_name: string;
    subscription_tier: string;
    products_optimized_this_month: number;
    max_products_per_month: number;
  } | null;
}

export function Header({ profile }: HeaderProps) {
  const { signOut, user } = useAuth();

  const getTierBadge = (tier: string) => {
    const badges = {
      free: { label: 'Free', color: 'bg-gray-100 text-gray-700' },
      starter: { label: 'Starter', color: 'bg-blue-100 text-blue-700' },
      pro: { label: 'Pro', color: 'bg-cyan-100 text-cyan-700' },
      enterprise: { label: 'Enterprise', color: 'bg-green-100 text-green-700' }
    };
    return badges[tier as keyof typeof badges] || badges.free;
  };

  const tierBadge = profile ? getTierBadge(profile.subscription_tier) : getTierBadge('free');

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                SEO Hunter
              </h1>
              <p className="text-xs text-gray-500">AI-Powered Optimization</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {profile && (
              <div className="hidden sm:flex items-center space-x-4 px-4 py-2 bg-gray-50 rounded-lg">
                <div className="text-right">
                  <div className="text-xs text-gray-500">Usage This Month</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {profile.products_optimized_this_month} / {profile.max_products_per_month}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${tierBadge.color}`}>
                  {tierBadge.label}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{profile?.company_name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
