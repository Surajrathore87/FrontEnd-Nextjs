const siteUrl = 'https://www.dsigndpo.com/';
// const siteUrl = 'http://localhost:3000/';
module.exports = {
  siteUrl,
  exclude: [
    '/404',
    '/ref',
    '/payment-status',
    '/home-interior-design-sitemap.xml',
    '/designs-sitemap.xml',
    '/grouped-design-sitemap.xml',
    '/individual-design-sitemap.xml',
  ],
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: [
          '/404',
          '/ref',
          '/payment-status',
          '/chat',
          '/favourites',
          '/home-interior-design-sitemap.xml',
          '/designs-sitemap.xml',
          '/grouped-design-sitemap.xml',
          '/individual-design-sitemap.xml',
        ],
      },
      { userAgent: '*', allow: '/' },
    ],
    additionalSitemaps: [
      `${siteUrl}explore-designs-sitemap.xml`,
      `${siteUrl}designs-sitemap.xml`,
      `${siteUrl}grouped-design-sitemap.xml`,
      `${siteUrl}individual-design-sitemap.xml`,
    ],
  },
};
