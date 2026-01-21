function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col">
     

      <main className="flex-grow bg-white">
        <section className="w-full py-16 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* LEFT CONTENT */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                ABOUT US
              </h2>

              <p className="text-gray-600 mb-4">
                MediQueue is a comprehensive digital healthcare appointment system
                developed to improve the way patients access medical services.
              </p>

              <p className="text-gray-600 mb-4">
                Designed with both patients and healthcare providers in mind,
                MediQueue supports efficient scheduling and clear communication.
              </p>

              <p className="text-gray-600 mb-8">
                Our mission is to support accessible, timely, and well-coordinated
                healthcare through thoughtful technology.
              </p>

              <div className="flex gap-4">
                <button className="bg-[#5aa7b4] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#4a97a4] transition">
                  Learn More
                </button>
                <button className="border border-[#5aa7b4] text-[#5aa7b4] px-6 py-3 rounded-md font-semibold hover:bg-[#eaf6f8] transition">
                  Watch Video ▶
                </button>
              </div>
            </div>

            {/* RIGHT IMAGE GRID */}
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/hospital.jpg"
                alt="Healthcare service"
                className="h-40 md:h-48 w-full object-cover rounded-xl shadow-sm hover:shadow-md transition"
              />
              <img
                src="/surgery.jpg"
                alt="Doctor consultation"
                className="h-40 md:h-48 w-full object-cover rounded-xl shadow-sm hover:shadow-md transition"
              />
              <img
                src="/hero.jpg"
                alt="Hospital environment"
                className="h-40 md:h-48 w-full object-cover rounded-xl shadow-sm hover:shadow-md transition"
              />
              <img
                src="/hero-2.jpg"
                alt="Medical team"
                className="h-40 md:h-48 w-full object-cover rounded-xl shadow-sm hover:shadow-md transition"
              />
            </div>

          </div>
        </section>
      </main>

     
    </div>
  );
}

export default AboutUs;
