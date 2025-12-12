export default function Services() {
  const services = [
    {
      icon: '🔌',
      title: 'Generator Installation',
      description:
        'Professional installation service by certified technicians with quality and safety guarantee',
    },
    {
      icon: '🔧',
      title: 'Regular Maintenance',
      description:
        'Comprehensive maintenance programs to ensure optimal performance and extend generator lifespan',
    },
    {
      icon: '⚙️',
      title: 'Repair Services',
      description:
        'Fast and effective repair service for all types of malfunctions with original parts availability',
    },
    {
      icon: '📋',
      title: 'Technical Consultations',
      description:
        'Expert consultations to choose the right generator for your project with feasibility studies',
    },
    {
      icon: '📦',
      title: 'Spare Parts',
      description:
        'Wide inventory of original spare parts for all generator types with quality guarantee',
    },
    {
      icon: '🎓',
      title: 'Training',
      description:
        'Comprehensive training programs for operators on proper use and maintenance of generators',
    },
  ]

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We provide a comprehensive range of services to ensure optimal performance of your generators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl border-2 border-blue-100 hover:border-blue-300 transition-all transform hover:-translate-y-2 duration-300"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Need Technical Consultation?
          </h3>
          <p className="text-xl mb-8 text-blue-100">
            Our team of experts is ready to help you choose the best solution for your project
          </p>
          <a
            href="#contact"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Book Free Consultation
          </a>
        </div>
      </div>
    </section>
  )
}

