
import Banner from "@/components/home/Banner";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";
import Featured from "@/components/home/Featured";


export default function Home() {
  return (
    <>
      <Banner />
      <Featured/>
      <WhyChooseUs />
      <Testimonials />
      <CallToAction />
    </> 
  );
}
