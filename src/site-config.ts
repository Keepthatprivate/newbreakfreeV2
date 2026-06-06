export const SiteConfig = {
  title: "BoilerSaaS",
  description: "Astrology and tarot readings for your soul",
  prodUrl: "https://boilersaas.com",
  appId: "boilersaas",
  domain: "boilersaas.com",
  appIcon: "/images/icon.png",
  company: {
    name: "BoiletSaaS",
    address: "911 Street, New York, NY, USA", // Remove if not needed
  },
  brand: {
    primary: "#007291", // You can adjust this to your brand color
  },
  team: {
    name: "Prenom",
    website: "https://boilersaas.com",
  },
  features: {
    /**
     * If enable, you need to specify the logic of upload here : src/features/images/uploadImageAction.tsx
     * You can use Vercel Blob Storage : https://vercel.com/docs/storage/vercel-blob
     * Or you can use Cloudflare R2 : https://mlv.sh/cloudflare-r2-tutorial
     * Or you can use AWS S3 : https://mlv.sh/aws-s3-tutorial
     */
    enableImageUpload: false as boolean,
    /**
     * If enable, the user will be redirected to `/orgs` when he visits the landing page at `/`
     * The logic is located in middleware.ts
     */
    enableLandingRedirection: true as boolean,
  },
};
