import { Edit2, Trash2, TrendingUp, CheckCircle, Clock } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  image_url: string;
  status: string;
  created_at: string;
}

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onOptimize: (product: Product) => void;
  hasOptimization?: boolean;
}

export function ProductCard({ product, onEdit, onDelete, onOptimize, hasOptimization }: ProductCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <TrendingUp className="w-12 h-12" />
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {product.title}
          </h3>
          {hasOptimization && (
            <span className="flex items-center text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-2 whitespace-nowrap">
              <CheckCircle className="w-3 h-3 mr-1" />
              Optimized
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {product.description || 'No description'}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            {new Date(product.created_at).toLocaleDateString()}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOptimize(product)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Optimize"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
