import React from 'react';
import { 
  Leaf, 
  Award, 
  Globe, 
  ShieldCheck, 
  Play, 
  Search, 
  CheckCircle, 
  PackageCheck, 
  Truck, 
  Star,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function OurStory() {
  return (
    <div className="bg-brand-bg text-brand-dark font-display">
      
      {/* 1. Breadcrumbs & Hero Section */}
      <section className="pt-8 pb-16 px-6 max-w-7xl mx-auto">
        <div className="text-xs text-brand-textSub mb-6 flex items-center gap-2">
          <span>Home</span> / <span className="text-brand-dark font-semibold">Our Story</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-widest text-brand-dark font-bold">
              OUR STORY
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-dark leading-tight">
              The Authentic <br />
              <span>Taste of India,</span> <br />
              Worldwide.
            </h1>
            <p className="text-brand-textSub text-sm md:text-base leading-relaxed">
              AFFORA is more than a brand — it is our promise to deliver the purest, most authentic Indian spices to kitchens around the world.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button className="bg-brand-dark text-white px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
                <Leaf className="w-4 h-4" /> Our Journey
              </button>
              <button className="border border-brand-dark text-brand-dark px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-brand-dark/5 transition-all">
                <Play className="w-4 h-4 fill-current" /> Watch Our Story
              </button>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:col-span-7 relative">
            <div className="rounded-3xl overflow-hidden shadow-lg border border-brand-light bg-brand-light">
              <img
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80"
                alt="Authentic Indian Spices"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Feature Cards Grid */}
      <section className="px-6 max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-brand-light p-6 rounded-2xl border border-brand-light text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-brand-dark">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-brand-dark mb-2">100% Natural</h3>
            <p className="text-xs text-brand-textSub leading-relaxed">No artificial colors, no preservatives, no compromises.</p>
          </div>

          <div className="bg-brand-light p-6 rounded-2xl border border-brand-light text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-brand-dark">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-brand-dark mb-2">Premium Quality</h3>
            <p className="text-xs text-brand-textSub leading-relaxed">Handpicked spices graded for purity and freshness.</p>
          </div>

          <div className="bg-brand-light p-6 rounded-2xl border border-brand-light text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-brand-dark">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-brand-dark mb-2">Worldwide Delivery</h3>
            <p className="text-xs text-brand-textSub leading-relaxed">Delivering authentic Indian spices to kitchens globally.</p>
          </div>

          <div className="bg-brand-light p-6 rounded-2xl border border-brand-light text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-brand-dark">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-brand-dark mb-2">Secure & Trusted</h3>
            <p className="text-xs text-brand-textSub leading-relaxed">Safe payments, secure packaging, trusted by thousands.</p>
          </div>
        </div>
      </section>

      {/* 3. Rooted in India Banner */}
      <section className="px-6 max-w-7xl mx-auto mb-20">
        <div className="bg-brand-light rounded-3xl p-8 lg:p-12 border border-brand-light grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 relative">
            <img
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
              alt="Farmer in Spice Field"
              className="rounded-2xl w-full h-[360px] object-cover shadow-sm"
            />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl flex items-center gap-3 border border-white/50 shadow-sm">
              <div className="w-8 h-8 bg-brand-dark rounded-full flex items-center justify-center text-white">
                <Leaf className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-brand-dark">100% Natural</p>
                <p className="text-[10px] text-brand-textSub">& Pure Harvest</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 lg:pl-6">
            <span className="text-xs uppercase tracking-widest text-brand-dark font-bold">OUR BEGINNINGS</span>
            <h2 className="text-3xl font-bold text-brand-dark">
              Rooted in India, <br />Inspired by Nature
            </h2>
            <p className="text-brand-textSub text-sm leading-relaxed">
              AFFORA was born from a simple belief — that the world deserves spices that are pure, natural and full of aroma. We work directly with farmers and spice growing communities across India to bring you the finest quality spices.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-brand-dark shrink-0 mt-1 shadow-sm">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-dark">Direct from Farmers</h4>
                  <p className="text-xs text-brand-textSub">We build strong relationships with farmers to ensure fair trade.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-brand-dark shrink-0 mt-1 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-dark">Traditional & Pure</h4>
                  <p className="text-xs text-brand-textSub">Cleaned, processed and packed using traditional methods.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-brand-dark shrink-0 mt-1 shadow-sm">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-dark">Freshness Guaranteed</h4>
                  <p className="text-xs text-brand-textSub">Hygienic packaging preserving freshness naturally.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-brand-dark shrink-0 mt-1 shadow-sm">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-dark">Responsible Sourcing</h4>
                  <p className="text-xs text-brand-textSub">Supporting sustainable farming communities ethically.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Map & Spice Origins */}
      <section className="px-6 max-w-7xl mx-auto mb-20 text-center">
        <span className="text-xs uppercase tracking-widest text-brand-dark font-bold">OUR JOURNEY</span>
        <h2 className="text-3xl font-bold text-brand-dark mt-2 mb-4">Where Our Spices Begin</h2>
        <p className="text-xs text-brand-textSub max-w-xl mx-auto mb-12">
          India is blessed with diverse climates and fertile soil that produce some of the world's finest spices.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left mb-12">
          <div className="bg-brand-light p-4 rounded-xl border border-brand-light flex items-center gap-3">
            <MapPin className="w-5 h-5 text-brand-dark shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-brand-dark">Kerala</h4>
              <p className="text-[11px] text-brand-textSub">Famous for High-Range Cardamom & Spices</p>
            </div>
          </div>
          <div className="bg-brand-light p-4 rounded-xl border border-brand-light flex items-center gap-3">
            <MapPin className="w-5 h-5 text-brand-dark shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-brand-dark">Karnataka</h4>
              <p className="text-[11px] text-brand-textSub">Known for Quality Pepper & Turmeric</p>
            </div>
          </div>
          <div className="bg-brand-light p-4 rounded-xl border border-brand-light flex items-center gap-3">
            <MapPin className="w-5 h-5 text-brand-dark shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-brand-dark">Tamil Nadu</h4>
              <p className="text-[11px] text-brand-textSub">Rich in Turmeric, Ginger & Spices</p>
            </div>
          </div>
          <div className="bg-brand-light p-4 rounded-xl border border-brand-light flex items-center gap-3">
            <MapPin className="w-5 h-5 text-brand-dark shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-brand-dark">Other Regions</h4>
              <p className="text-[11px] text-brand-textSub">Bringing the best from all over India</p>
            </div>
          </div>
        </div>

        {/* Spice Avatars */}
        <div className="flex flex-wrap justify-center items-center gap-8">
          {[
            { title: 'Black Pepper', img: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=200&q=80' },
            { title: 'Cardamom', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=200&q=80' },
            { title: 'Cloves', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=200&q=80' },
            { title: 'Dry Ginger', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=200&q=80' },
            { title: 'Turmeric', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=200&q=80' }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-brand-dark/20 p-1 mb-2 bg-brand-light">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="text-xs font-semibold text-brand-dark">{item.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Process Roadmap Step by Step */}
      <section className="px-6 max-w-7xl mx-auto mb-24 text-center">
        <span className="text-xs uppercase tracking-widest text-brand-dark font-bold">FROM FARM TO PACK</span>
        <h2 className="text-3xl font-bold text-brand-dark mt-2 mb-12">Our Process, Our Promise</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
          {[
            { num: '01', title: 'Carefully Sourced', desc: 'Spices harvested from the best farms.', icon: <Leaf className="w-4 h-4" /> },
            { num: '02', title: 'Quality Selected', desc: 'Every batch is inspected and graded.', icon: <Search className="w-4 h-4" /> },
            { num: '03', title: 'Naturally Processed', desc: 'Cleaned and processed traditional methods.', icon: <Sparkles className="w-4 h-4" /> },
            { num: '04', title: 'Quality Checked', desc: 'Multiple quality tests to ensure purity.', icon: <CheckCircle className="w-4 h-4" /> },
            { num: '05', title: 'Securely Packed', desc: 'Hygienic packaging to lock in freshness.', icon: <PackageCheck className="w-4 h-4" /> },
            { num: '06', title: 'Delivered Worldwide', desc: 'From India to your kitchen, fresh.', icon: <Truck className="w-4 h-4" /> }
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-brand-dark text-white flex items-center justify-center font-semibold text-xs mb-3 shadow-md">
                {step.num}
              </div>
              <h4 className="text-sm font-bold text-brand-dark mb-1">{step.title}</h4>
              <p className="text-[11px] text-brand-textSub leading-relaxed mb-3">{step.desc}</p>
              <div className="text-brand-dark bg-brand-light p-2 rounded-full">{step.icon}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Quality You Can Taste */}
      <section className="px-6 max-w-7xl mx-auto mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs uppercase tracking-widest text-brand-dark font-bold">OUR QUALITY PREMISE</span>
            <h2 className="text-3xl font-bold text-brand-dark">Quality You Can Taste</h2>
            <p className="text-xs text-brand-textSub leading-relaxed">
              We follow strict quality standards at every step to deliver spices that are pure, aromatic and full of natural goodness.
            </p>
            <button className="bg-brand-dark text-white px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 hover:opacity-90">
              Learn Read On Quality <Leaf className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Premium', sub: 'Flavors', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80' },
              { label: 'Natural', sub: 'Freshness', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80' },
              { label: 'Purity', sub: 'Checked', img: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=400&q=80' },
              { label: 'Hygienic', sub: 'Processing', img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80' },
              { label: 'Secure', sub: 'Packaging', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80' },
              { label: 'Quality', sub: 'Control', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80' }
            ].map((card, idx) => (
              <div key={idx} className="bg-brand-light rounded-xl overflow-hidden border border-brand-light shadow-sm">
                <img src={card.img} alt={card.label} className="w-full h-24 object-cover" />
                <div className="p-2.5 text-center">
                  <p className="text-xs font-bold text-brand-dark">{card.label}</p>
                  <p className="text-[10px] text-brand-textSub">{card.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Heritage Section */}
      <section className="px-6 max-w-7xl mx-auto mb-24">
        <div className="bg-brand-light rounded-3xl p-8 lg:p-12 border border-brand-light grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <img
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"
              alt="India Spice Heritage"
              className="rounded-2xl w-full h-[300px] object-cover"
            />
          </div>

          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase tracking-widest text-brand-dark font-bold">OUR SPICE HERITAGE</span>
            <h2 className="text-3xl font-bold text-brand-dark">
              India's Spice Heritage, <br />Shared With The World
            </h2>
            <p className="text-xs text-brand-textSub leading-relaxed">
              For centuries, India has been the land of spices. From ancient trade routes to modern kitchens, our rich heritage inspires everything we do. AFFORA carries that same legacy forward.
            </p>
            <button className="bg-brand-dark text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:opacity-90">
              Explore Our Products &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* 8. Stats Counters */}
      <section className="px-6 max-w-7xl mx-auto mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-y border-brand-light py-10">
          <div>
            <h3 className="text-3xl font-bold text-brand-dark mb-1">25+</h3>
            <p className="text-xs text-brand-textSub">Years of Heritage</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-brand-dark mb-1">500+</h3>
            <p className="text-xs text-brand-textSub">Farmer Partners</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-brand-dark mb-1">50+</h3>
            <p className="text-xs text-brand-textSub">Countries Served</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-brand-dark mb-1">100%</h3>
            <p className="text-xs text-brand-textSub">Natural Products</p>
          </div>
        </div>
      </section>

      {/* 9. Customer Testimonials */}
      <section className="px-6 max-w-7xl mx-auto mb-24 text-center">
        <span className="text-xs uppercase tracking-widest text-brand-dark font-bold">LOVED BY SPICE LOVERS</span>
        <h2 className="text-3xl font-bold text-brand-dark mt-2 mb-12">What Customers Say About AFFORA</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              text: '"The freshness and aroma of AFFORA spices is unmatched. You can truly taste the authenticity in every dish."',
              name: 'Priya Sharma',
              location: 'Mumbai, India',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
            },
            {
              text: '"AFFORA delivers premium quality spices right to our doorstep in the UK. Highly recommended!"',
              name: 'Raj Malhotra',
              location: 'London, UK',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
            },
            {
              text: '"From packaging to quality, everything is top notch. My go-to brand for Indian spices."',
              name: 'Neha Iyer',
              location: 'New Jersey, USA',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-brand-light p-6 rounded-2xl border border-brand-light shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-brand-textSub leading-relaxed mb-6 italic">{item.text}</p>
              </div>
              <div className="flex items-center gap-3">
                <img src={item.avatar} alt={item.name} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-brand-dark">{item.name}</h4>
                  <p className="text-[10px] text-brand-textSub">{item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Call to Action & Newsletter Section */}
      <section className="px-6 max-w-7xl mx-auto mb-20">
        <div className="relative rounded-3xl overflow-hidden bg-brand-dark text-white p-8 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 relative">
            
            {/* CTA Left */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Bring the Authentic <br />Taste of India Home
              </h2>
              <p className="text-xs text-white/80 max-w-md">
                Explore our collection of premium Indian spices.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button className="bg-white text-brand-dark px-6 py-3 rounded-full text-xs font-bold hover:bg-gray-100">
                  Shop Spices &rarr;
                </button>
                <button className="border border-white/40 text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-white/10">
                  Discover AFFORA
                </button>
              </div>
            </div>

            {/* Newsletter Right Container */}
            <div className="lg:col-span-6 bg-white/95 backdrop-blur-md rounded-2xl p-6 text-brand-dark shadow-xl">
              <h3 className="text-base font-bold mb-1">Stay Connected With AFFORA</h3>
              <p className="text-xs text-brand-textSub mb-4">Discover authentic spices, recipes and stories from India.</p>
              
              <div className="flex gap-2 mb-6">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-brand-light text-xs px-4 py-3 rounded-full flex-grow border border-brand-light focus:outline-none text-brand-dark placeholder:text-brand-textSub"
                />
                <button className="bg-brand-dark text-white text-xs px-5 py-3 rounded-full font-bold hover:opacity-90">
                  Subscribe
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-gray-100 pt-4 text-center">
                <div>
                  <Sparkles className="w-4 h-4 mx-auto text-brand-dark mb-1" />
                  <p className="text-[10px] text-brand-textSub">Exclusive online offers</p>
                </div>
                <div>
                  <Leaf className="w-4 h-4 mx-auto text-brand-dark mb-1" />
                  <p className="text-[10px] text-brand-textSub">New Arrivals</p>
                </div>
                <div>
                  <Award className="w-4 h-4 mx-auto text-brand-dark mb-1" />
                  <p className="text-[10px] text-brand-textSub">Spice & Recipes Articles</p>
                </div>
                <div>
                  <ShieldCheck className="w-4 h-4 mx-auto text-brand-dark mb-1" />
                  <p className="text-[10px] text-brand-textSub">10% off on first purchase online</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}