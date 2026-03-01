import { Link } from 'react-router-dom';

export default function Careers() {
  const jobs = [
    {
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      id: 0,
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      type: 'Full-time',
      id: 1,
    },
    {
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'San Francisco, CA',
      type: 'Full-time',
      id: 2,
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Full-time',
      id: 3,
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'San Francisco, CA',
      type: 'Full-time',
      id: 4,
    },
  ];

  interface Job {
    title: string;
    department: string;
    location: string;
    type: string;
    id: number;
  }

  const navigateToJob = (job: Job) => {
    // this should navigate to a detailed job description page
    alert(`Info on opening ${job.id} ${job.title} coming soon.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Join Our Team
        </h1>
        <p className="text-xl text-gray-600">
          Help us build the future of lost and found. We're looking for talented individuals who are passionate about making a difference.
        </p>
      </div>

      {/* Why Join Us */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Why Join Refind?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Make an Impact</h3>
              <p className="text-gray-600">
                Work on a product that helps millions of people recover their lost belongings.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Grow Your Skills</h3>
              <p className="text-gray-600">
                Collaborate with talented individuals and continuous learning opportunities.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Flexible Work</h3>
              <p className="text-gray-600">
                Enjoy flexible work arrangements that fit your lifestyle.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Competitive Benefits</h3>
              <p className="text-gray-600">
                Competitive salary, health insurance, and professional development.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Open Positions</h2>
        <div className="space-y-4">
          {jobs.map((job, idx) => (
            <div key={idx} onClick={() => navigateToJob(job)} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div  >
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                  </div>
                </div>
                {/* <button className="bg-primary-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors whitespace-nowrap">
                  Apply Now
                </button> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-orange-600 to-rose-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't see the right role?</h2>
          <p className="text-lg mb-6 text-primary-100">Send us your resume and tell us what you're interested in.</p>
          <a
            href="mailto:careers@refind.com"
            className="inline-block bg-white text-primary-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Send Your Resume
          </a>
        </div>
      </div>
    </div>
  );
}
