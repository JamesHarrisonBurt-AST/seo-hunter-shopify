import { TrendingUp, Clock, Award } from 'lucide-react';

interface ABTest {
  id: string;
  variant_a_views: number;
  variant_b_views: number;
  variant_a_clicks: number;
  variant_b_clicks: number;
  status: string;
  winner: string | null;
  started_at: string;
  product_title: string;
}

interface ABTestCardProps {
  test: ABTest;
  onEndTest: (testId: string, winner: string) => void;
}

export function ABTestCard({ test, onEndTest }: ABTestCardProps) {
  const ctrA = test.variant_a_views > 0
    ? ((test.variant_a_clicks / test.variant_a_views) * 100).toFixed(2)
    : '0.00';
  const ctrB = test.variant_b_views > 0
    ? ((test.variant_b_clicks / test.variant_b_views) * 100).toFixed(2)
    : '0.00';

  const winnerVariant = parseFloat(ctrB) > parseFloat(ctrA) ? 'B' : 'A';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {test.product_title}
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            Started {new Date(test.started_at).toLocaleDateString()}
          </div>
        </div>
        {test.status === 'completed' && test.winner && (
          <span className="flex items-center text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
            <Award className="w-3 h-3 mr-1" />
            Winner: {test.winner}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs font-medium text-gray-600 mb-2">Variant A (Original)</div>
          <div className="space-y-2">
            <div>
              <div className="text-xs text-gray-500">Views</div>
              <div className="text-lg font-bold text-gray-900">{test.variant_a_views}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Clicks</div>
              <div className="text-lg font-bold text-gray-900">{test.variant_a_clicks}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">CTR</div>
              <div className="text-lg font-bold text-blue-600">{ctrA}%</div>
            </div>
          </div>
        </div>

        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
          <div className="text-xs font-medium text-gray-600 mb-2">Variant B (Optimized)</div>
          <div className="space-y-2">
            <div>
              <div className="text-xs text-gray-500">Views</div>
              <div className="text-lg font-bold text-gray-900">{test.variant_b_views}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Clicks</div>
              <div className="text-lg font-bold text-gray-900">{test.variant_b_clicks}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">CTR</div>
              <div className="text-lg font-bold text-cyan-600">{ctrB}%</div>
            </div>
          </div>
        </div>
      </div>

      {test.status === 'active' && (
        <button
          onClick={() => onEndTest(test.id, winnerVariant)}
          className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition text-sm"
        >
          <TrendingUp className="w-4 h-4" />
          <span>End Test & Apply Winner</span>
        </button>
      )}
    </div>
  );
}
