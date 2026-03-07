
import { Link } from "react-router-dom";
import footerImg from "../assets/images/navImg.png";

function FooterPage() {
  return (
    <footer className="w-full bg-[#FFF1F2] border border-[#FFE4E6]">
      <div className="flex flex-col max-w-2xl mx-auto gap-4 py-10 justify-center lg:px-0 px-4">
        
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
          
          {/* Logo + Description */}
          <div className="max-w-sm">
            <img
              src={footerImg}
              alt="taltula Beauty Logo"
              className="w-40"
            />    
          </div>

        </div>

      <div className="flex flex-col lg:flex-row justify-between">
         <p className="text-[#4C545F] font-urbanist md:text-[18px] text-sm font-normal leading-[30px] not-italic w-[395px]">
              Inspiring runners of all levels through content, events,
              coaching, and subscription boxes.
            </p>

<div className="flex  items-center lg:gap-12 gap-7 md:gap-4 lg:py-0 py-12">
  <Link to="/" className="text-[#696969] hover:text-[#AD5E5C] hover:border-b-2 border-[#AD5E5C] md:text-base text-sm  transition-colors">
    Home
  </Link>
  <Link to="/consult" className="text-[#696969] hover:text-[#AD5E5C] hover:border-b-2 border-[#AD5E5C] md:text-base text-sm transition-colors">
    Consult taltula
  </Link>
  <Link to="/exam" className="text-[#696969] hover:text-[#AD5E5C]  hover:border-b-2 border-[#AD5E5C] md:text-base text-sm transition-colors">
    taltula’s Daily Exam
  </Link>
</div>

      </div>
  


  <div className="flex flex-col  md:flex-row items-center py-6 pt-2 justify-between">
            <div className="flex items-center gap-12 lg:px-0 px-4">
            <Link to="/terms" className="hover:text-[#AD5E5C] text-[#1F2937] transition-colors md:text-base text-sm">
              Terms of Service
            </Link>
            <p className="bg-[#1F2937] h-1 w-1 rounded-full"></p>
            <Link to="/privacy" className="hover:text-[#AD5E5C] text-[#1F2937] transition-colors md:text-base text-sm">
              Privacy Policy
            </Link>
          </div>

          <p className="text-[#697079] lg:pt-0 pt-8 font-normal font-urbanist text-[18px] leading-[28px] not-italic">
            &copy; {new Date().getFullYear()} taltula Beauty. All rights reserved.
          </p>
        </div>



      </div>
    </footer>
  );
}

export default FooterPage;