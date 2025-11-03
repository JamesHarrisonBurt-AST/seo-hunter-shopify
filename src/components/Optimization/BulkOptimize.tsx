import { useState } from 'react';
import { X, Sparkles, Check, Loader } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
}

interface BulkOptimizeProps {
  products: Product[];
  onClose: () => void;
  onComplete: () => void;
}

export function BulkOptimize({ products, onClose, onComplete }: BulkOptimizeProps) {
  const [processing, setProcessing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const startBulkOptimization = async () => {
    setProcessing(true);

    for (let i = 0; i < products.length; i++) {
      setCurrentIndex(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setCompleted(true);
    setProcessing(false);
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const progress = products.length > 0 ? Math.round(((currentIndex + 1) / products.length) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bulk Optimization</h2>
              <p className="text-sm text-gray-600">Optimize multiple products at once</p>
            </div>
          </div>
          {!processing && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6">
          {!processing && !completed ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl mb-4">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Ready to optimize {products.length} products?
              </h3>
              <p className="text-gray-600 mb-6">
                This will generate AI-optimized content for all selected products. You can review and approve each optimization afterwards.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-700">
                  <div className="font-medium mb-2">Selected Products:</div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {products.map((product) => (
                      <div key={product.id} className="text-xs py-1 flex items-center">
                        <Check className="w-3 h-3 text-blue-600 mr-2 flex-shrink-0" />
                        <span className="truncate">{product.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={startBulkOptimization}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition"
              >
                Start Optimization
              </button>
            </div>
          ) : completed ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Optimization Complete!
              </h3>
              <p className="text-gray-600 mb-6">
                Successfully optimized {products.length} products. Review and approve the optimizations in your product list.
              </p>
              <button
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="py-8">
              <div className="flex items-center justify-center mb-6">
                <Loader className="w-12 h-12 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Optimizing Products...
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Processing {currentIndex + 1} of {products.length}
              </p>

              <div className="space-y-3">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-center text-sm font-medium text-gray-700">
                  {progress}% Complete
                </div>
              </div>

              {currentIndex < products.length && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-1">Currently optimizing:</div>
                  <div className="text-sm text-gray-900">{products[currentIndex].title}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
