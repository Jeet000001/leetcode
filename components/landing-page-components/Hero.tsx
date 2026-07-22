"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars";
import { ChevronRight, Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center px-4">
      {/* Background */}
      <StarsBackground className="absolute inset-0 -z-10" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Badge */}
        <Badge
          variant="secondary"
          className="mb-8 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900"
        >
          <Star className="mr-2 h-4 w-4" />
          Join 10,000+ developers already coding
        </Badge>

        {/* Heading */}
        <h1 className="mb-8 text-4xl font-black leading-tight text-gray-900 md:text-6xl lg:text-7xl dark:text-white">
          Master{" "}
          <span className="inline-block rounded-2xl bg-amber-500 px-6 py-3 text-white shadow-lg -rotate-1">
            Problem
          </span>{" "}
          Solving
          <br />
          with{" "}
          <span className="inline-block rotate-1 rounded-2xl bg-indigo-600 px-6 py-3 text-white shadow-lg">
            Code
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mb-12 max-w-3xl text-lg text-gray-600 md:text-2xl dark:text-gray-300">
          Challenge yourself with thousands of coding problems, compete with
          developers worldwide, and accelerate your programming journey with
          real-time feedback and expert solutions.
        </p>

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="group bg-amber-500 text-white hover:bg-amber-600"
          >
            Start Coding Now
            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>

          <Button variant="outline" size="lg">
            Browse Problems
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;