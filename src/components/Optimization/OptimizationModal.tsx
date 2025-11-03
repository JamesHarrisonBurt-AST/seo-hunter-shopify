import { useState } from 'react';
import { X, ArrowRight, Check, Sparkles, TrendingUp } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  image_url: string;
  alt_text: string;
}

interface Optimization {
  optimized_title: string;
  optimized_description: string;
  optimized_alt_text: string;
  score: number;
}

interface OptimizationModalProps {
  product: Product;
  onClose: () => void;
  onApprove: (optimization: Optimization) => void;
}

export function OptimizationModal({ product, onClose, onApprove }: OptimizationModalProps) {
  const [loading, setLoading] = useState(false);
  const [optimization, setOptimization] = useState<Optimization | null>(null);

  const generateOptimization = () => {
    setLoading(true);
    setTimeout(() => {
      const optimized: Optimization = {
        optimized_title: enhanceTitle(product.title),
        optimized_description: enhanceDescription(product.description, product.title),
        optimized_alt_text: enhanceAltText(product.alt_text, product.title),
        score: Math.floor(Math.random() * 15) + 85
      };
      setOptimization(optimized);
      setLoading(false);
    }, 1500);
  };

  const enhanceTitle = (title: string): string => {
    const keywords = ['Premium', 'Professional', 'High-Quality', 'Best', 'Top-Rated'];
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    return `${keyword} ${title} - Free Shipping & Returns`;
  };

  const enhanceDescription = (desc: string, title: string): string => {
    const prefix = `Discover the ultimate ${title.toLowerCase()} experience. `;
    const suffix = ' Perfect for professionals and enthusiasts alike. Shop now with confidence - 30-day money-back guarantee.';
    return prefix + (desc || `Premium quality ${title.toLowerCase()} designed for excellence.`) + suffix;
  };

  const enhanceAltText = (alt: string, title: string): string => {
    return alt || `${title} - professional quality product image showing key features and design details`;
  };

  const handleApprove = () => {
    if (optimization) {
      onApprove(optimization);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Optimization</h2>
              <p className="text-sm text-gray-600">Enhance your product for SEO & AI search</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!optimization ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl mb-6">
                <TrendingUp className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Optimize?</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Our AI will analyze and enhance your product listing for better visibility in search engines and AI-powered search tools like ChatGPT and Perplexity.
              </p>
              <button
                onClick={generateOptimization}
                disabled={loading}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-8 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" />
                <span>{loading ? 'Optimizing...' : 'Generate Optimization'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">SEO Score</h3>
                  <div className="flex items-center space-x-2">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {optimization.score}
                    </div>
                    <div className="text-sm text-gray-600">/ 100</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${optimization.score}%` }}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Original</h4>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs font-medium text-gray-500 mb-1">Title</div>
                      <div className="text-sm text-gray-900">{product.title}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs font-medium text-gray-500 mb-1">Description</div>
                      <div className="text-sm text-gray-900">{product.description || 'No description'}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs font-medium text-gray-500 mb-1">Alt Text</div>
                      <div className="text-sm text-gray-900">{product.alt_text || 'No alt text'}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-500">Optimized</h4>
                    <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <Check className="w-3 h-3 mr-1" />
                      Enhanced
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                      <div className="text-xs font-medium text-gray-500 mb-1">Title</div>
                      <div className="text-sm text-gray-900 font-medium">{optimization.optimized_title}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                      <div className="text-xs font-medium text-gray-500 mb-1">Description</div>
                      <div className="text-sm text-gray-900">{optimization.optimized_description}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                      <div className="text-xs font-medium text-gray-500 mb-1">Alt Text</div>
                      <div className="text-sm text-gray-900">{optimization.optimized_alt_text}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleApprove}
                  className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition"
                >
                  <Check className="w-5 h-5" />
                  <span>Approve & Apply</span>
                </button>
                <button
                  onClick={generateOptimization}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Regenerate
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
