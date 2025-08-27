import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Mail, MessageCircle, Clock, MapPin, Sparkles, ArrowLeft, Send } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    // You can add actual form submission logic here
    alert('Thank you for your message! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const goHome = () => {
    // You can replace this with your navigation logic
    window.location.href = '/'
  }

  return (
    <div
      className="min-h-screen relative bg-cover bg-repeat bg-center bg-fixed scroll-smooth"
      style={{ backgroundImage: 'url("bg.jpg")' }}
    >
      {/* Background Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#F0EEEA]/30" />
      
      {/* Content Container */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-6 lg:px-12 backdrop-blur-sm shadow-sm bg-[#F2C3B9]">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={goHome}>
            <div className="w-8 h-8 bg-gradient-to-br from-[#97B3AE] to-[#D2E0D3] rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#486856]">Welly</span>
          </div>
          
          <Button variant="ghost" className="text-[#486856] hover:bg-white/20" onClick={goHome}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </nav>

        {/* Hero Section */}
        <section className="text-center py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-light text-[black] mb-6 leading-tight">
              Get in
              <span className="block text-[#90745b]">Touch</span>
            </h1>
            <p className="text-xl text-[#769121] mb-8 max-w-2xl mx-auto leading-relaxed">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-light text-[black] mb-6">Let's Connect</h2>
                  <p className="text-lg text-[#6B8E7A] mb-8 leading-relaxed">
                    Whether you have questions about our wellness features, need support, or want to share feedback, 
                    we're here to help you on your journey to inner peace.
                  </p>
                </div>

                {/* Contact Cards */}
                <div className="space-y-6">
                  <Card className="border-none shadow-lg bg-gradient-to-br from-[#D2E0D3] to-[#F0EEEA] rounded-2xl">
                    <CardContent className="p-6 flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Mail className="w-6 h-6 text-[#486856]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#486856] mb-1">Email Us</h3>
                        <a 
                          href="mailto:hello@welly.com" 
                          className="text-[#97B3AE] hover:text-[#486856] transition-colors"
                        >
                          hello@welly.com
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-lg bg-gradient-to-br from-[#F2C3B9] to-[#F0DDD6] rounded-2xl">
                    <CardContent className="p-6 flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <MessageCircle className="w-6 h-6 text-[#486856]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#486856] mb-1">Support</h3>
                        <a 
                          href="mailto:support@welly.com" 
                          className="text-[#97B3AE] hover:text-[#486856] transition-colors"
                        >
                          support@welly.com
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-lg bg-gradient-to-br from-[#97B3AE] to-[#D2E0D3] rounded-2xl">
                    <CardContent className="p-6 flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Response Time</h3>
                        <p className="text-white/80">Usually within 24 hours</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-light text-[#486856] mb-6">Send us a Message</h3>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#486856] mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-[#D2E0D3] focus:border-[#97B3AE] focus:outline-none transition-colors bg-white/50"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#486856] mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-[#D2E0D3] focus:border-[#97B3AE] focus:outline-none transition-colors bg-white/50"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#486856] mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border-2 border-[#D2E0D3] focus:border-[#97B3AE] focus:outline-colors bg-white/50"
                          placeholder="What's this about?"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#486856] mb-2">
                          Message
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={5}
                          className="w-full px-4 py-3 rounded-xl border-2 border-[#D2E0D3] focus:border-[#97B3AE] focus:outline-none transition-colors bg-white/50 resize-vertical"
                          placeholder="Tell us how we can help..."
                        />
                      </div>
                      
                      <Button 
                        onClick={handleSubmit}
                        size="lg" 
                        className="w-full bg-[#97B3AE] hover:bg-[#486856] text-white px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:shadow-lg"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-light text-[black] mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-[#6B8E7A]">
                Quick answers to common questions
              </p>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-lg bg-white/60 backdrop-blur-sm rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-[#486856] mb-2">
                    How do I get started with Welly?
                  </h3>
                  <p className="text-[#6B8E7A]">
                    Simply sign up for a free account and begin exploring our wellness features. 
                    Start with journaling or gratitude check to begin your mindfulness journey.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-white/60 backdrop-blur-sm rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-[#486856] mb-2">
                    Is my data private and secure?
                  </h3>
                  <p className="text-[#6B8E7A]">
                    Absolutely. Your personal wellness data is encrypted and kept completely private. 
                    We never share your journal entries or personal information with third parties.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-white/60 backdrop-blur-sm rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-[#486856] mb-2">
                    Can I use Welly on my mobile device?
                  </h3>
                  <p className="text-[#6B8E7A]">
                    Yes! Welly is designed to work seamlessly across all devices. 
                    Access your wellness tools anytime, anywhere from your phone, tablet, or computer.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-[#97B3AE]/40">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-[#97B3AE] to-[#D2E0D3] rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="text-xl font-bold text-[#97B3AE]">Welly</span>
            </div>
            <div className="flex space-x-6 text-[#97B3AE]">
              <a href="#" className="hover:text-[#486856] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#486856] transition-colors">Terms</a>
              <a href="#" className="hover:text-[#486856] transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}