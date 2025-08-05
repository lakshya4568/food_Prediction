import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900">
                AI-Powered <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">Nutrition</span> Analysis at Your Fingertips
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Take a photo of your food and instantly get detailed nutritional information to help you make healthier choices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/predict" className="inline-flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <i className="fas fa-camera mr-2"></i>
                  Try Now
                </Link>
                <Link href="#how-it-works" className="inline-flex items-center justify-center px-8 py-4 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-bold rounded-lg transition-colors">
                  How It Works
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
                  <i className="fas fa-utensils text-6xl text-green-500"></i>
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900">Snap, Analyze, Track</h3>
                <p className="text-gray-600">Get instant nutrition insights from any meal</p>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 animate-bounce">
                <i className="fas fa-camera text-green-500 text-2xl mb-2 block"></i>
                <span className="text-sm font-medium">Snap</span>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4 animate-bounce" style={{animationDelay: '1s'}}>
                <i className="fas fa-brain text-blue-500 text-2xl mb-2 block"></i>
                <span className="text-sm font-medium">Analyze</span>
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 animate-bounce" style={{animationDelay: '2s'}}>
                <i className="fas fa-chart-pie text-purple-500 text-2xl mb-2 block"></i>
                <span className="text-sm font-medium">Track</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful <span className="text-green-500">Features</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover how NutriVision can transform your relationship with food
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-camera text-green-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Food Recognition</h3>
              <p className="text-gray-600">Our AI accurately identifies food items from photos with over 95% accuracy.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-calculator text-blue-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Nutrient Analysis</h3>
              <p className="text-gray-600">Get detailed macro and micronutrient breakdowns of your meals instantly.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-heart text-purple-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Health Insights</h3>
              <p className="text-gray-600">Receive personalized health recommendations based on your dietary needs.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-chart-line text-yellow-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Progress Tracking</h3>
              <p className="text-gray-600">Monitor your nutrition goals and track your healthy eating progress over time.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-mobile-alt text-red-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Mobile Friendly</h3>
              <p className="text-gray-600">Access nutrition analysis anywhere, anytime with our responsive web app.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-users text-indigo-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Support</h3>
              <p className="text-gray-600">Join a community of health-conscious individuals on their nutrition journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It <span className="text-green-500">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get nutrition analysis in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Take a Photo</h3>
              <p className="text-gray-600">Simply capture an image of your meal using your device&apos;s camera or upload an existing photo.</p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Analysis</h3>
              <p className="text-gray-600">Our advanced AI instantly identifies the food and calculates detailed nutritional information.</p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Results</h3>
              <p className="text-gray-600">Receive comprehensive nutrition data and personalized health recommendations instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-blue-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Nutrition?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already making healthier choices with NutriVision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login?signup=true" className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-500 hover:bg-gray-100 font-bold rounded-lg transition-colors shadow-lg">
              Get Started Free
            </Link>
            <Link href="/predict" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-green-500 font-bold rounded-lg transition-colors">
              Try Demo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 card p-4 animate-float" style={{animationDelay: '4s'}}>
                <i className="fas fa-chart-pie text-orange-500 text-2xl mb-2"></i>
                <span className="text-sm font-medium">Track</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-20">
            <path fill="#f0f9f0" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding bg-green-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">NutriVision</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of nutrition tracking with our advanced AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-8 text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <i className="fas fa-camera text-green-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Instant Recognition</h3>
              <p className="text-gray-600">
                Simply take a photo and our AI instantly identifies your food with 95% accuracy
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-8 text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <i className="fas fa-chart-pie text-blue-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Detailed Analytics</h3>
              <p className="text-gray-600">
                Get comprehensive nutritional breakdown including calories, macros, and vitamins
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-8 text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors">
                <i className="fas fa-heart text-orange-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Health Insights</h3>
              <p className="text-gray-600">
                Receive personalized recommendations based on your health goals and dietary needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to transform your nutrition tracking experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold">
                  1
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-200 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Take a Photo</h3>
              <p className="text-gray-600">
                Snap a quick photo of your meal using your phone camera. Our AI works with any angle or lighting.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold">
                  2
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-200 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI analyzes your food, identifying ingredients and calculating precise nutritional values.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold">
                  3
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-200 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Get Insights</h3>
              <p className="text-gray-600">
                Receive detailed nutritional information and personalized recommendations for your health goals.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/predict" className="btn btn-primary text-lg px-8 py-4">
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Nutrition?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of users who have already improved their health with NutriVision AI-powered nutrition analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth?signup=true" className="btn bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4">
              Get Started Free
            </Link>
            <Link href="/predict" className="btn btn-outline border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-4">
              Try Demo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}