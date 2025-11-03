import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Header } from '../components/Dashboard/Header';
import { ABTestCard } from '../components/Testing/ABTestCard';
import { FlaskConical, Plus, Archive } from 'lucide-react';

interface ABTest {
  id: string;
  product_id: string;
  optimization_id: string;
  variant_a_views: number;
  variant_b_views: number;
  variant_a_clicks: number;
  variant_b_clicks: number;
  status: string;
  winner: string | null;
  started_at: string;
  product_title: string;
}

interface Profile {
  company_name: string;
  subscription_tier: string;
  products_optimized_this_month: number;
  max_products_per_month: number;
}

export function ABTestingPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tests, setTests] = useState<ABTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadTests();
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

  const loadTests = async () => {
    const { data: testsData } = await supabase
      .from('ab_tests')
      .select(`
        *,
        products (
          title
        )
      `)
      .eq('user_id', user!.id)
      .order('started_at', { ascending: false });

    if (testsData) {
      const formattedTests = testsData.map(test => ({
        ...test,
        product_title: (test.products as any)?.title || 'Unknown Product'
      }));
      setTests(formattedTests);
    }
    setLoading(false);
  };

  const handleEndTest = async (testId: string, winner: string) => {
    const { error } = await supabase
      .from('ab_tests')
      .update({
        status: 'completed',
        winner: winner,
        ended_at: new Date().toISOString()
      })
      .eq('id', testId);

    if (!error) {
      loadTests();
    }
  };

  const activeTests = tests.filter(t => t.status === 'active');
  const completedTests = tests.filter(t => t.status === 'completed');

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
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">A/B Testing</h2>
          </div>
          <p className="text-gray-600">Compare original vs optimized content performance</p>
        </div>

        {activeTests.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Active Tests</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeTests.map((test) => (
                <ABTestCard key={test.id} test={test} onEndTest={handleEndTest} />
              ))}
            </div>
          </div>
        )}

        {completedTests.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Completed Tests</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedTests.map((test) => (
                <ABTestCard key={test.id} test={test} onEndTest={handleEndTest} />
              ))}
            </div>
          </div>
        )}

        {tests.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-4">
              <FlaskConical className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No A/B tests yet</h3>
            <p className="text-gray-600 mb-6">
              Start testing your optimized content to see what performs better
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
