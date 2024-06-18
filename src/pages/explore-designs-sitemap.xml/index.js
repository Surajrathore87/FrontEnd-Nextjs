import { getServerSideSitemap } from 'next-sitemap';
import { callPostAPI } from '_services/CallAPI';

export const getServerSideProps = async (ctx) => {
  const siteUrl = process.env.WEBSITE_URL;

  const response = {
    categorySiteMap: null,
  };

  response.categorySiteMap = await callPostAPI(process.env.SITEMAP_DATA, {});

  if (response) {
    const categoryArray = [];

    // Explore Category URL's
    response.categorySiteMap.data.categories.map((item) => {
      categoryArray.push(
        {
          url: `${siteUrl}${item.slug}`,
          priority: 0.9,
        },
      );
    });
    // -------------------------

    const fields = [...categoryArray];
    return getServerSideSitemap(ctx, fields);
  }
};

export default function Site() { }
