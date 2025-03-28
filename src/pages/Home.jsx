import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Fotofolio</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover, save, and share beautiful photos from around the world
          </p>

          {!isAuthenticated ? (
            <div className="flex justify-center space-x-4">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border-2 border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:bg-opacity-10 transition duration-300"
              >
                Login
              </Link>
            </div>
          ) : (
            <Link
              to="/dashboard"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How Fotofolio Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔍",
                title: "Discover",
                description:
                  "Explore millions of beautiful photos from our community",
              },
              {
                icon: "❤️",
                title: "Save",
                description: "Save your favorite photos to organized boards",
              },
              {
                icon: "👥",
                title: "Share",
                description: "Connect with other photography enthusiasts",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Popular Photos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-200 rounded-lg overflow-hidden hover:scale-105 transition duration-300"
              >
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Photo {index + 1}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to={isAuthenticated ? "/explore" : "/register"}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300"
            >
              Explore More
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get inspired?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of photographers and creatives sharing their work
          </p>
          <Link
            to={isAuthenticated ? "/upload" : "/register"}
            className="inline-block bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
          >
            {isAuthenticated ? "Upload Your Photos" : "Join Now"}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
