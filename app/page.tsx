import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import TopDirections from "@/components/TopDirections";
import BrandDirections from "@/components/BrandDirections";
import PartsDirections from "@/components/PartsDirections";
import PopularShowcase from "@/components/PopularShowcase";
import Categories from "@/components/Categories";
import LeadForm from "@/components/LeadForm";
import Contacts from "@/components/Contacts";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Categories />
        <LeadForm />
        <Contacts />
      </main>
    </>
  );
}
