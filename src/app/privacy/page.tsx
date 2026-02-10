export default function Privacy() {
  return (
    <div className="min-h-screen ">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8 pt-30">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-400">Last Updated: Feb 2026</p>
        </div>

        {/* Introduction */}
        <section className="mb-12">
          <p className="text-gray-300 leading-relaxed">
            I built this photobooth to be a fun, creative tool that respects
            your digital footprint. Because this is a client-side application,
            all the "magic" happens right in your browser.
          </p>
        </section>

        {/* How it Works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">
            How your data is handled
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Unlike traditional apps that upload your media to a cloud server,
            this project uses your browser's local capabilities.
          </p>

          {/* Photos subsection */}
          <div className="mb-6 pl-6 border-l-2 border-gray-700">
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Your Photos
            </h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              When you take a photo, the image data stays in your computer's
              temporary memory (RAM). When you click "Download," the file is
              generated locally.
              <strong>
                {" "}
                I have zero access to your camera feed or the resulting images.
              </strong>
            </p>
          </div>

          {/* Camera Access subsection */}
          <div className="pl-6 border-l-2 border-gray-700">
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Camera Access
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Your browser will ask for camera permission. This is used solely
              to render the live preview on your screen. No video data is ever
              recorded or transmitted to an external server.
            </p>
          </div>
        </section>

        {/* No Tracking */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">
            No Tracking, No Cookies
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            I believe in a clean web experience. That means:
          </p>
          <ul className="space-y-2 ml-6 mb-6">
            <li className="text-gray-300">
              <span className="font-semibold">•</span> No tracking cookies
            </li>
            <li className="text-gray-300">
              <span className="font-semibold">•</span> No third-party
              advertisements
            </li>
            <li className="text-gray-300">
              <span className="font-semibold">•</span> No user accounts or login
              required
            </li>
          </ul>
          <p className="text-gray-300 leading-relaxed">
            If you choose to share your photos on social media, that happens
            through your own accounts and is subject to their privacy policies.
            This site won't do it for you.
          </p>
        </section>

        {/* Questions? */}
        <section className="p-6 bg-zinc-900 border rounded-lg">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Questions?</h2>
          <p className="text-gray-300 leading-relaxed">
            If you're curious about the code or how the local processing works,
            feel free to reach out at{" "}
            <a
              href="mailto:jamesanquillano@gmail.com"
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              jamesanquillano@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
