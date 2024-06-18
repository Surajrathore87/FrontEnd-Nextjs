import { getServerSideSitemap } from 'next-sitemap';
import { callPostAPI } from '_services/CallAPI';

export const getServerSideProps = async (ctx) => {
  const siteUrl = process.env.WEBSITE_URL;

  const response = {
    singleDesignsSiteMap: null,
  };

  response.singleDesignsSiteMap = await callPostAPI(process.env.SITEMAP_DATA, {});

  if (response) {
    const designsArray = [];

    // Explore Category URL's
    response.singleDesignsSiteMap.data.individualDesigns.map((item) => {
      designsArray.push(
        {
          url: `${siteUrl}individual-design/${item.code}`,
          priority: 0.9,
        },
      );
    });
    // -------------------------

    const fields = [...designsArray];
    return getServerSideSitemap(ctx, fields);
  }
};

export default function Site() { }
