// components/layout/Footer.jsx
const Footer = () => (
  <footer className="bg-gray-800 text-white mt-12">
    <div className="container mx-auto p-4 text-center">
      <p>© {new Date().getFullYear()} Nesar</p>
      <p>
        <a href="/terms" className="text-indigo-400 hover:text-indigo-600">
          Terms of Service
        </a>{" "}
        |{" "}
        <a href="/privacy" className="text-indigo-400 hover:text-indigo-600">
          Privacy Policy
        </a>
      </p>
    </div>
  </footer>
);

export default Footer;
