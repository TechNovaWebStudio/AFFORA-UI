import React from 'react';
import Image from 'next/image';
import {
    Leaf,
    Eye,
    UserCheck,
    Globe,
    Award,
    Sun,
    Package,
    Truck,
    ShieldCheck,
    FlaskConical,
    Lock,
    RotateCcw,
    ArrowRight
} from 'lucide-react';

export default function AboutPage() {
    const stats = [
        { icon: Leaf, title: '10+', subtitle: 'Years of Experience' },
        { icon: UserCheck, title: '500+', subtitle: 'Farmers Empowered' },
        { icon: Leaf, title: '100%', subtitle: 'Natural & Pure Spices' },
        { icon: Globe, title: '25+', subtitle: 'Countries Served' },
        { icon: Award, title: 'Premium', subtitle: 'Quality Assured' },
    ];

    const journeySteps = [
        {
            step: '01',
            icon: Leaf,
            title: 'Sourced with Care',
            description: 'We partner with trusted farmers who grow spices naturally and responsibly.',
        },
        {
            step: '02',
            icon: Sun,
            title: 'Processed Naturally',
            description: 'Our spices are cleaned, sorted and processed with modern hygiene.',
        },
        {
            step: '03',
            icon: Package,
            title: 'Packed Fresh',
            description: 'We pack our spices in premium, eco-friendly packaging to lock in freshness and aroma.',
        },
        {
            step: '04',
            icon: Truck,
            title: 'Delivered to You',
            description: 'From our farms to your kitchen – delivered with care and trust.',
        },
    ];

    const valueProps = [
        {
            icon: Leaf,
            title: '100% Natural',
            description: 'No preservatives, no additives, just pure spices.',
        },
        {
            icon: ShieldCheck,
            title: 'Premium Quality',
            description: 'Handpicked spices with rich aroma and bold flavor.',
        },
        {
            icon: Leaf,
            title: 'Sustainably Sourced',
            description: 'Supporting Indian farmers and ethical farming practices.',
        },
        {
            icon: FlaskConical,
            title: 'Hygienic Process',
            description: 'Clean, safe and hygienic processing at every step.',
        },
        {
            icon: Truck,
            title: 'Fast Delivery',
            description: 'Quick and reliable delivery across India and worldwide.',
        },
    ];

    return (
        <main className="bg-[#FAF9F5] text-gray-800 font-sans min-h-screen py-8 px-4 sm:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto space-y-16">

               

                {/* Hero Section / Our Story */}
                <section className="relative bg-white rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
                    {/* Content Left */}
                    <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-center z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Leaf className="w-5 h-5 text-[#1e3a2b]" />
                            <div className="h-[2px] w-12 bg-[#c0a060]"></div>
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-serif text-[#1e3a2b] font-normal mb-4">
                            Our Story
                        </h1>

                        <p className="text-sm sm:text-base font-medium text-gray-700 mb-3">
                            From Indian farms to your kitchen, crafted with purity, passion and purpose.
                        </p>

                        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-8">
                            Affora was born from a passion for pure, authentic spices and a deep respect for Indian farming heritage. We believe great taste begins at the source.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-emerald-50 rounded-full text-[#1e3a2b]">
                                    <Leaf className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-900">Our Mission</h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        To deliver pure, natural and premium spices with every product we create.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-emerald-50 rounded-full text-[#1e3a2b]">
                                    <Eye className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-900">Our Vision</h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        To be a global symbol of Indian spices, trusted for purity, quality and sustainability.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Right with Gradient Blend */}
                    <div className="lg:col-span-7 relative min-h-[320px] lg:min-h-full">
                        <Image
                            src="/about.png" // Add your farmer photo in public folder
                            alt="Indian farmers harvesting in tea and spice field"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        {/* Soft Blend Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent hidden lg:block" />
                    </div>
                </section>

                {/* Stats Section */}
                <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-x-0 md:divide-x divide-gray-100">
                        {stats.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} className="flex flex-col items-center p-2">
                                    <div className="p-3 bg-emerald-50/60 rounded-full mb-3 text-[#1e3a2b]">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-gray-900">{item.title}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Our Journey Section */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-4 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-[2px] w-8 bg-[#c0a060]"></div>
                            <Leaf className="w-4 h-4 text-[#1e3a2b]" />
                        </div>

                        <h2 className="text-3xl font-serif text-[#1e3a2b]">Our Journey</h2>

                        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                            Affora started with a simple belief – spices should be natural, pure and full of life. From a small beginning, we've grown into a brand that brings the finest spices from Indian farms to kitchens around the world.
                        </p>

                        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1e3a2b] hover:bg-[#152a1f] text-white text-xs font-medium rounded-md transition-colors">
                            Our Process <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
                        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {/* Connector line for desktop */}
                            <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-[1px] bg-gray-200 -z-0" />

                            {journeySteps.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                                        <div className="p-4 bg-[#eef4f0] rounded-full text-[#1e3a2b] mb-4">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-xs font-semibold text-gray-400 mb-1">{item.step}</span>
                                        <h4 className="font-semibold text-xs sm:text-sm text-gray-900 mb-2">{item.title}</h4>
                                        <p className="text-[11px] text-gray-500 leading-normal">{item.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Why Choose Affora */}
                <section className="text-center space-y-8">
                    <h2 className="text-2xl sm:text-3xl font-serif text-[#1e3a2b]">Why Choose Affora?</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {valueProps.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
                                    <div className="p-3 bg-emerald-50 rounded-full text-[#1e3a2b] mb-4">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-semibold text-xs text-gray-900 mb-2">{item.title}</h4>
                                    <p className="text-[11px] text-gray-500 leading-normal">{item.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Call to Action Banner */}
                <section className="relative rounded-2xl overflow-hidden bg-[#0c311e] text-white p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 items-center min-h-[220px]">
                    <div className="relative z-10 mb-6 md:mb-0">
                        <Image
                            src="/spices-bowl.jpg" // Add your spice bowls background photo in public folder
                            alt="Assorted colorful spices"
                            fill
                            className="object-cover opacity-40 mix-blend-overlay"
                        />
                    </div>

                    <div className="relative z-20 md:col-start-2 space-y-4">
                        <h2 className="text-2xl sm:text-3xl font-serif leading-tight">
                            Bringing You the Finest Spices from India
                        </h2>
                        <p className="text-xs text-gray-200">Pure. Natural. Authentic.</p>

                        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#0c311e] hover:bg-gray-100 font-medium text-xs rounded-md transition-colors">
                            Shop Our Spices <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </section>

                {/* Feature Badges Bar */}
                <section className="bg-white rounded-xl p-6 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 divide-x-0 md:divide-x divide-gray-100">
                    <div className="flex items-center gap-3 justify-center p-2">
                        <Truck className="w-5 h-5 text-gray-700" />
                        <div className="text-left">
                            <h5 className="font-semibold text-xs text-gray-900">Free Shipping</h5>
                            <p className="text-[10px] text-gray-500">On orders above $50</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 justify-center p-2">
                        <Lock className="w-5 h-5 text-gray-700" />
                        <div className="text-left">
                            <h5 className="font-semibold text-xs text-gray-900">Secure Payment</h5>
                            <p className="text-[10px] text-gray-500">100% secure checkout</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 justify-center p-2">
                        <RotateCcw className="w-5 h-5 text-gray-700" />
                        <div className="text-left">
                            <h5 className="font-semibold text-xs text-gray-900">Easy Returns</h5>
                            <p className="text-[10px] text-gray-500">7 days return policy</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 justify-center p-2">
                        <Award className="w-5 h-5 text-gray-700" />
                        <div className="text-left">
                            <h5 className="font-semibold text-xs text-gray-900">Quality Guarantee</h5>
                            <p className="text-[10px] text-gray-500">100% Natural Spices</p>
                        </div>
                    </div>
                </section>

            </div>
            Main  </main>
    );
}