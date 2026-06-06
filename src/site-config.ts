export const SiteConfig = {
  title: "Break Free",
  description: "Discover the hidden childhood patterns still influencing your relationships, decisions, and emotional well-being today.",
  prodUrl: "https://break-free-app.com",
  appId: "breakfree",
  domain: "break-free-app.com",
  appIcon: "/images/icon.png",
  company: {
    name: "Break Free",
    address: "",
  },
  brand: {
    primary: "#4ECDC4", // Teal - couleur principale du site original
  },
  team: {
    name: "Break Free",
    website: "https://break-free-app.com",
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
