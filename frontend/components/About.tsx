export default function About() {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About Us</h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                We are a leading company in power solutions and generators, specializing
                in providing the best generators from global brands PERKINS and CUMMINS.
                We offer comprehensive solutions for industrial, commercial, and residential sectors.
              </p>
              <p>
                With over 15 years of market experience, we have gained customer trust through
                our commitment to quality, reliability, and excellent service. Our team of
                specialized engineers and technicians is ready to provide full support in all
                project phases.
              </p>
              <p>
                We believe that reliable power is the foundation of success for any project,
                which is why we ensure the best technical solutions while maintaining the highest
                standards of quality and efficiency.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-gray-600">Customer Satisfaction</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80"
                alt="About Us"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Experience & Excellence</h3>
                <p className="text-lg">We provide the best solutions for all your needs</p>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-xl shadow-xl hidden lg:block">
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-sm">Technical Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

