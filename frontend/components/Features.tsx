export default function Features() {
  const features = [
    {
      icon: '⚡',
      title: 'High Efficiency',
      description: 'Highly efficient generators that save fuel and reduce operational costs',
    },
    {
      icon: '🛡️',
      title: 'Full Reliability',
      description: 'Robust and durable design ensures consistent performance in all conditions',
    },
    {
      icon: '🔧',
      title: 'Easy Maintenance',
      description: 'Simplified design facilitates maintenance and repairs with readily available parts',
    },
    {
      icon: '🌍',
      title: 'Eco-Friendly',
      description: 'Advanced technologies reduce emissions and meet environmental standards',
    },
    {
      icon: '📊',
      title: 'Smart Monitoring',
      description: 'Advanced monitoring systems to track performance and status in real-time',
    },
    {
      icon: '💼',
      title: 'Professional Service',
      description: 'Expert team available to support you through all project phases',
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose PERKINS + CUMMINS?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We provide integrated power solutions that combine quality, reliability, and excellent service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-2 duration-300"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

