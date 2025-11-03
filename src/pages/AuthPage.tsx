import { useState } from 'react';
import { LoginForm } from '../components/Auth/LoginForm';
import { SignUpForm } from '../components/Auth/SignUpForm';
import { Zap, TrendingUp, Target, BarChart3 } from 'lucide-react';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {isLogin ? (
            <LoginForm onToggle={() => setIsLogin(false)} />
          ) : (
            <SignUpForm onToggle={() => setIsLogin(true)} />
          )}
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-cyan-600 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center space-x-3 mb-8">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">SEO Hunter</h1>
              <p className="text-blue-100 text-sm">AI-Powered Product Optimization</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Boost Your Product Visibility in AI Search
          </h2>

          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Automatically optimize product titles, descriptions, and metadata for search engines and AI-powered search tools like ChatGPT and Perplexity.
          </p>

          <div className="space-y-4">
            <div className="flex items-start space-x-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">AI-Powered Optimization</h3>
                <p className="text-blue-100 text-sm">
                  Generate SEO-optimized content with advanced AI algorithms trained on best practices.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Bulk Operations</h3>
                <p className="text-blue-100 text-sm">
                  Optimize hundreds of products at once with preview and approve workflows.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">A/B Testing & Analytics</h3>
                <p className="text-blue-100 text-sm">
                  Test variations and track performance with built-in A/B testing and rollback snapshots.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white border-opacity-20">
            <p className="text-blue-100 text-sm">
              Trusted by businesses optimizing their products for the AI-first search era.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
