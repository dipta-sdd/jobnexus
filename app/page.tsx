import Link from "next/link";
import {
  ArrowRight,
  BarChart2,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Globe,
  MessageSquare,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import homeFrame from '../public/home_frame.jpg';


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Freelance with{" "}
                <span className="text-emerald-600">confidence</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                The all-in-one platform for freelancers to manage clients, track
                projects, and get paid faster. Take control of your freelance
                business today.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="px-8 py-4 rounded-lg bg-emerald-600 text-white font-medium text-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium text-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                >
                  Log in
                </Link>
              </div>
              <div className="mt-8 flex items-center text-gray-500 dark:text-gray-400">
                <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
                <span>No credit card required</span>
                <CheckCircle className="h-5 w-5 text-emerald-500 ml-6 mr-2" />
                <span>14-day free trial</span>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={homeFrame}
                  alt="FreelanceHub Dashboard"
                  width={2000}
                  height={2000}
                  priority
                  quality={100}
                  className="w-full h-auto object-cover dark:invert"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-8">
            Trusted by freelancers worldwide
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-70">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-12">
                <img
                  src={`/placeholder.svg?height=48&width=120&text=LOGO ${i}`}
                  alt={`Company ${i}`}
                  className="h-full w-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Everything you need to succeed as a freelancer
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform provides all the tools you need to manage your
              freelance business efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart2 className="h-8 w-8 text-emerald-600" />,
                title: "Project Tracking",
                description:
                  "Track time, tasks, and milestones for all your projects in one place.",
              },
              {
                icon: <CreditCard className="h-8 w-8 text-emerald-600" />,
                title: "Invoicing & Payments",
                description:
                  "Create professional invoices and get paid faster with multiple payment options.",
              },
              {
                icon: <Users className="h-8 w-8 text-emerald-600" />,
                title: "Client Management",
                description:
                  "Organize client information, communication, and project history.",
              },
              {
                icon: <Calendar className="h-8 w-8 text-emerald-600" />,
                title: "Scheduling",
                description:
                  "Manage your availability and schedule meetings with clients effortlessly.",
              },
              {
                icon: <MessageSquare className="h-8 w-8 text-emerald-600" />,
                title: "Client Communication",
                description:
                  "Keep all client communications organized in one secure platform.",
              },
              {
                icon: <Globe className="h-8 w-8 text-emerald-600" />,
                title: "Contract Templates",
                description:
                  "Use legally-vetted contract templates customized for your business.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              How FreelanceHub works
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get started in minutes and transform how you manage your freelance
              business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create your account",
                description:
                  "Sign up for free and set up your profile with your services and portfolio.",
              },
              {
                step: "02",
                title: "Add your clients",
                description:
                  "Import existing clients or add new ones to start managing your relationships.",
              },
              {
                step: "03",
                title: "Start tracking projects",
                description:
                  "Create projects, track time, send invoices, and get paid - all in one place.",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg h-full">
                  <div className="text-5xl font-bold text-emerald-600 opacity-30 mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-emerald-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              What freelancers are saying
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of freelancers who have transformed their business
              with FreelanceHub.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "FreelanceHub has completely transformed how I manage my design business. I've saved hours on admin work and get paid faster than ever.",
                name: "Sarah Johnson",
                role: "Graphic Designer",
                image: "/placeholder.svg?height=80&width=80",
              },
              {
                quote:
                  "The invoicing and payment tracking features alone are worth it. I've reduced late payments by 75% since switching to FreelanceHub.",
                name: "Michael Chen",
                role: "Web Developer",
                image: "/placeholder.svg?height=80&width=80",
              },
              {
                quote:
                  "As a freelance writer juggling multiple clients, FreelanceHub keeps me organized and professional. My clients are impressed with how seamless everything is.",
                name: "Emma Rodriguez",
                role: "Content Writer",
                image: "/placeholder.svg?height=80&width=80",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Everything you need to know about FreelanceHub.
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                question: "How does the 14-day free trial work?",
                answer:
                  "You can sign up for FreelanceHub and use all features for 14 days without entering any payment information. At the end of your trial, you can choose a plan that fits your needs or continue with limited features on our free plan.",
              },
              {
                question: "Can I change plans later?",
                answer:
                  "Yes, you can upgrade, downgrade, or cancel your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, you'll receive credit towards your next billing cycle.",
              },
              {
                question: "Is there a limit to how many clients I can have?",
                answer:
                  "The Starter plan allows up to 5 clients. The Professional and Agency plans include unlimited clients. You can upgrade at any time if you need to add more clients.",
              },
              {
                question: "How secure is my data?",
                answer:
                  "We take security seriously. All data is encrypted in transit and at rest. We use industry-standard security practices and regular security audits to ensure your data is protected.",
              },
              {
                question: "Can I import my existing clients and projects?",
                answer:
                  "Yes, FreelanceHub allows you to import clients and projects from CSV files or directly from popular platforms like Trello, Asana, and QuickBooks.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-200 dark:border-gray-700 pb-8"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="py-16 mt-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: <Users className="h-10 w-10 text-emerald-600 mx-auto" />,
                stat: "10,000+",
                label: "Freelancers",
              },
              {
                icon: <Clock className="h-10 w-10 text-emerald-600 mx-auto" />,
                stat: "1.2M+",
                label: "Hours tracked",
              },
              {
                icon: (
                  <CreditCard className="h-10 w-10 text-emerald-600 mx-auto" />
                ),
                stat: "$50M+",
                label: "Payments processed",
              },
            ].map((item, index) => (
              <div key={index}>
                <div className="mb-4">{item.icon}</div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.stat}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
