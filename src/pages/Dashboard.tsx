import { useState, useEffect } from 'react';
import { Plus, Search, Zap, CheckSquare, Archive } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Dashboard/Header';
import { ProductCard } from '../components/Products/ProductCard';
import { ProductForm } from '../components/Products/ProductForm';
import { OptimizationModal } from '../components/Optimization/OptimizationModal';
import { BulkOptimize } from '../components/Optimization/BulkOptimize';

interface Product {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string;
  alt_text: string;
  status: string;
  created_at: string;
}

interface Profile {
  company_name: string;
  subscription_tier: string;
  products_optimized_this_month: number;
  max_products_per_month: number;
}

export function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [optimizations, setOptimizations] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [optimizingProduct, setOptimizingProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showBulkOptimize, setShowBulkOptimize] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadProducts();
      loadOptimizations();
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

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const loadOptimizations = async () => {
    const { data } = await supabase
      .from('optimizations')
      .select('product_id')
      .eq('user_id', user!.id);

    if (data) {
      const optimizationMap: Record<string, boolean> = {};
      data.forEach(opt => {
        optimizationMap[opt.product_id] = true;
      });
      setOptimizations(optimizationMap);
    }
  };

  const handleAddProduct = async (productData: Omit<Product, 'id' | 'user_id' | 'status' | 'created_at'>) => {
    const { error } = await supabase
      .from('products')
      .insert({
        ...productData,
        user_id: user!.id
      });

    if (!error) {
      loadProducts();
      setShowProductForm(false);
    }
  };

  const handleUpdateProduct = async (productData: Omit<Product, 'id' | 'user_id' | 'status' | 'created_at'>) => {
    if (!editingProduct) return;

    const { error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', editingProduct.id);

    if (!error) {
      loadProducts();
      setEditingProduct(null);
      setShowProductForm(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await supabase.from('products').delete().eq('id', id);
      loadProducts();
      setSelectedProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleOptimize = (product: Product) => {
    setOptimizingProduct(product);
  };

  const handleApproveOptimization = async (optimization: {
    optimized_title: string;
    optimized_description: string;
    optimized_alt_text: string;
    score: number;
  }) => {
    if (!optimizingProduct) return;

    const { error } = await supabase.from('optimizations').insert({
      product_id: optimizingProduct.id,
      user_id: user!.id,
      ...optimization,
      status: 'approved'
    });

    if (!error) {
      await supabase.from('usage_logs').insert({
        user_id: user!.id,
        operation_type: 'optimize',
        products_count: 1
      });

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            products_optimized_this_month: profile.products_optimized_this_month + 1
          })
          .eq('id', user!.id);
      }

      loadProfile();
      loadOptimizations();
      setOptimizingProduct(null);
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleBulkOptimize = () => {
    if (selectedProducts.size === 0) {
      alert('Please select at least one product to optimize');
      return;
    }
    setShowBulkOptimize(true);
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedProductsList = Array.from(selectedProducts)
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as Product[];

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
            <h2 className="text-3xl font-bold text-gray-900">Products</h2>
            <p className="text-gray-600 mt-1">Manage and optimize your product catalog</p>
          </div>
          <div className="flex items-center space-x-3">
            {selectedProducts.size > 0 && (
              <button
                onClick={handleBulkOptimize}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition"
              >
                <Zap className="w-4 h-4" />
                <span>Optimize {selectedProducts.size}</span>
              </button>
            )}
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowProductForm(true);
              }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-4">
              <Archive className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No products found' : 'No products yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search query' : 'Get started by adding your first product'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowProductForm(true)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Product</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="relative">
                <div className="absolute top-4 left-4 z-10">
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <ProductCard
                  product={product}
                  onEdit={(p) => {
                    setEditingProduct(p);
                    setShowProductForm(true);
                  }}
                  onDelete={handleDeleteProduct}
                  onOptimize={handleOptimize}
                  hasOptimization={optimizations[product.id]}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {optimizingProduct && (
        <OptimizationModal
          product={optimizingProduct}
          onClose={() => setOptimizingProduct(null)}
          onApprove={handleApproveOptimization}
        />
      )}

      {showBulkOptimize && (
        <BulkOptimize
          products={selectedProductsList}
          onClose={() => setShowBulkOptimize(false)}
          onComplete={() => {
            setSelectedProducts(new Set());
            loadOptimizations();
          }}
        />
      )}
    </div>
  );
}
