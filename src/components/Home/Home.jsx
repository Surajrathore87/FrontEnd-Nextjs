import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useAuth } from '_contexts/auth';
import { callAPI } from '_services/CallAPI';

const BenefitsYouGet = dynamic(import('./BenefitsYouGet'));
const Banner = dynamic(import('components/Home/Banner'));
const ExploreOurDesign = dynamic(import('components/Home/ExploreOurDesign'));
const TrendingMoreDesign = dynamic(import('components/Home/TrendingMoreDesign'));
const Testimonial = dynamic(import('components/Home/Testimonial'));
const DesignCollage = dynamic(import('components/Home/DesignCollage'));
const PageLoader = dynamic(import('components/Loaders/PageLoader'));
const ScrollToTop = dynamic(import('components/Home/ScrollToTop'));

function Home(props) {
  const { homePageData, categoryData, trendingDesignData } = props;
  const [isLoading, setIsLoading] = useState(true);
  const { setShowLogin, userDetails } = useAuth();
  useEffect(() => {
    if (Cookies.get('refCode') && !userDetails) {
      setShowLogin(true);
    }
    if (userDetails) {
      Cookies.remove('refCode');
    }
  }, [userDetails]);

  return (
    <>
      {homePageData && (
        <>
          <Banner
            sliderImages={homePageData.data.sliders}
            sliderImagePath={homePageData.data.image_path.slider_image_path_thumb}
            homepageContent={homePageData.data.home_configuration}
          />
          <BenefitsYouGet
            homepageContent={homePageData.data.home_configuration}
            homeImagePath={homePageData.data.image_path.homepage_image_path}
          />
          <DesignCollage
            homepageContent={homePageData.data.home_configuration}
            homeImagePath={homePageData.data.image_path.homepage_image_path}
          />
          <ExploreOurDesign
            categoriesData={categoryData.data.categories}
            categoryImagePath={categoryData.data.image_path_thumb}
          />
          <TrendingMoreDesign
            categoriesData={categoryData.data.trending_categories}
            trendingDesigns={trendingDesignData.data.designs}
            trendingImagePath={trendingDesignData.data.image_path}
          />
          <Testimonial
            testimonialContent={homePageData.data.testimonials}
            testimonialImagePath={homePageData.data.image_path.testimonial_image_path}
          />
          <ScrollToTop />
        </>
      )}
      {/* {isLoading && <PageLoader />} */}
    </>
  );
}
Home.propTypes = {
  homePageData: PropTypes.object,
  categoryData: PropTypes.object,
  trendingDesignData: PropTypes.object,
};
export default Home;
