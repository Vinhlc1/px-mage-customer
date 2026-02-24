"use client";

import Navbar from "@/components/Navbar";
import DevNotice from "@/components/DevNotice";
import { Sparkles, Shield, Zap } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="starfield" />
      <Navbar />
      <DevNotice feature="About" description="trang tĩnh — chưa có API." />
      
      <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 sm:mb-6">About Pandoora</h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            Where Norse Mythology Meets Modern Technology
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="card-glass p-6 sm:p-8 text-center">
            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-primary" />
            <h3 className="text-xl sm:text-2xl font-serif font-bold mb-3 sm:mb-4">Mystical Cards</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Each card tells a unique story from Norse mythology, beautifully illustrated and embedded with NFC technology.
            </p>
          </div>

          <div className="card-glass p-6 sm:p-8 text-center">
            <Zap className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-primary" />
            <h3 className="text-xl sm:text-2xl font-serif font-bold mb-3 sm:mb-4">NFC Technology</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Tap your card with any NFC-enabled device to unlock exclusive digital content and verify authenticity.
            </p>
          </div>

          <div className="card-glass p-6 sm:p-8 text-center">
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-primary" />
            <h3 className="text-xl sm:text-2xl font-serif font-bold mb-3 sm:mb-4">Collectible Value</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Limited edition cards with varying rarities. Trade, collect, and auction your cards with other enthusiasts.
            </p>
          </div>
        </div>

        <div className="card-glass p-6 sm:p-8 md:p-12 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-4 sm:mb-6 text-center">Our Story</h2>
          <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-muted-foreground">
            <p>
              Pandoora was born from a passion for Norse mythology and cutting-edge technology. 
              We believe that ancient stories deserve to be preserved and shared in innovative ways.
            </p>
            <p>
              Each card in our collection is carefully crafted with stunning artwork that brings 
              the gods and legends of Norse mythology to life. From Odin's wisdom to Thor's might, 
              every card tells a captivating story.
            </p>
            <p>
              Our NFC-enabled cards bridge the physical and digital worlds, allowing you to 
              experience these timeless tales in a whole new way. Build your collection, 
              participate in auctions, and connect with a community of fellow mythology enthusiasts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
