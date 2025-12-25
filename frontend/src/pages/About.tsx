import { 
  CheckCircle, 
  Users, 
  Award, 
  TrendingUp, 
  Server, 
  Shield, 
  Zap,
  Globe,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-24 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="container-custom relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-6">
              <Server className="h-4 w-4" />
              <span>Trusted by 10,000+ businesses across India</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Powering India's
              <span className="block text-primary-400">Digital Infrastructure</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Since 2010, Mahalaxmi Enterprise has been India's trusted partner for enterprise-grade 
              servers, high-performance workstations, and cutting-edge technology solutions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg">
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Our Mission</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6 text-gray-900">
                Empowering Businesses with Technology Excellence
              </h2>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                At Mahalaxmi Enterprise, we're committed to providing businesses and individuals 
                with access to the highest quality computing hardware at competitive prices.
              </p>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                We understand that technology is the backbone of modern business, and our mission 
                is to ensure that you have the right tools to succeed in an increasingly digital world.
              </p>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                With over a decade of experience in the industry, we've built lasting relationships 
                with leading manufacturers and thousands of valued customers across India.
              </p>
              
              {/* Key points */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Shield, text: 'Certified Products' },
                  { icon: Zap, text: 'Fast Delivery' },
                  { icon: Users, text: 'Expert Support' },
                  { icon: Globe, text: 'Pan-India Service' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <span className="font-medium text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-600 to-primary-400 rounded-2xl opacity-10 blur-xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=500&fit=crop" 
                alt="Server Room" 
                className="relative rounded-2xl shadow-2xl w-full object-cover"
              />
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">15+ Years</p>
                    <p className="text-sm text-gray-500">Industry Experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-gray-900">
              Built on Strong Foundations
            </h2>
            <p className="text-gray-600">
              These core values guide everything we do, from selecting products to serving our customers.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: CheckCircle,
                title: 'Quality First',
                description: 'We source only from trusted manufacturers and rigorously test all products before delivery.',
                color: 'bg-blue-500',
              },
              {
                icon: Users,
                title: 'Customer Focus',
                description: 'Your satisfaction is our priority. We provide exceptional support at every step of your journey.',
                color: 'bg-green-500',
              },
              {
                icon: Award,
                title: 'Deep Expertise',
                description: 'Our team brings years of technical knowledge to help you make informed decisions.',
                color: 'bg-purple-500',
              },
              {
                icon: TrendingUp,
                title: 'Innovation',
                description: 'We stay ahead of technology trends to offer you the latest and most efficient solutions.',
                color: 'bg-orange-500',
              },
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group">
                <div className={`w-14 h-14 ${value.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <value.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: '15+', label: 'Years in Business', suffix: '' },
              { value: '10', label: 'Happy Customers', suffix: 'K+' },
              { value: '500', label: 'Products Available', suffix: '+' },
              { value: '24/7', label: 'Customer Support', suffix: '' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-primary-400 mb-2">
                  {stat.value}<span className="text-3xl">{stat.suffix}</span>
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Our Team</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-gray-900">
              Meet Our Leadership
            </h2>
            <p className="text-gray-600">
              Experienced professionals dedicated to delivering excellence in every interaction.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Rajesh Kumar',
                role: 'CEO & Founder',
                experience: '20+ years in enterprise technology',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
              },
              {
                name: 'Priya Sharma',
                role: 'Chief Technology Officer',
                experience: 'Expert in server architecture',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
              },
              {
                name: 'Amit Patel',
                role: 'Head of Customer Success',
                experience: 'Dedicated to customer satisfaction',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
              },
            ].map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative inline-block mb-4">
                  <div className="w-40 h-40 rounded-full overflow-hidden mx-auto ring-4 ring-gray-100 group-hover:ring-primary-100 transition-all">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-500">{member.experience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to upgrade your infrastructure?</h2>
              <p className="text-primary-100">Get in touch with our team for personalized recommendations.</p>
            </div>
            <Link to="/contact">
              <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Contact Us Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
