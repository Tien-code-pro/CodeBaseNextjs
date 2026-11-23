export const seoConfig = {
  siteName: "VTC Game", // Thay đổi theo tên game
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://yourgame.vtc.vn",
  defaultTitle: "Tên Game - Game Online Số 1 Việt Nam | VTC Game",
  defaultDescription:
    "Chơi [Tên Game] - Game online hấp dẫn nhất 2025. Đăng ký ngay để nhận quà tân thủ hấp dẫn. Cộng đồng game thủ Việt Nam đông đảo.",
  defaultKeywords: [
    "game online",
    "game VTC",
    "game Việt Nam",
    "[tên game]",
    "game nhập vai",
    "game mobile",
    "game PC",
    "game miễn phí",
    "tải game",
    "đăng ký game",
  ],

  // Social Media
  social: {
    facebook: "https://facebook.com/vtcgame",
    youtube: "https://youtube.com/@vtcgame",
    fanpage: "https://facebook.com/[game-fanpage]",
  },

  // Company Info
  company: {
    name: "Công ty Cổ phần Viễn Thông VTC",
    address: "Tầng 5 tòa nhà VTC Online, 18 Tam Trinh, Hai Bà Trưng, Hà Nội",
    phone: "1900 xxxx",
    email: "support@vtc.vn",
  },

  // Game-specific
  game: {
    genre: "MMORPG", // hoặc RPG, Action, Strategy, etc.
    platform: ["PC", "Mobile"], // ["PC"] hoặc ["Mobile"] hoặc cả hai
    ageRating: "12+", // 12+, 16+, 18+
    publisher: "VTC Game",
    releaseDate: "2025-01-01",
  },

  // Images
  images: {
    logo: "/images/logo.png",
    ogImage: "/images/og-image.jpg", // 1200x630px
    favicon: "/favicon.ico",
  },
};

// Metadata template cho các trang
export const getPageMetadata = (
  title?: string,
  description?: string,
  image?: string,
  keywords?: string[]
) => {
  const fullTitle = title
    ? `${title} | ${seoConfig.siteName}`
    : seoConfig.defaultTitle;

  const ogImage = image || `${seoConfig.siteUrl}${seoConfig.images.ogImage}`;

  return {
    title: fullTitle,
    description: description || seoConfig.defaultDescription,
    keywords: keywords || seoConfig.defaultKeywords,
    openGraph: {
      title: fullTitle,
      description: description || seoConfig.defaultDescription,
      url: seoConfig.siteUrl,
      siteName: seoConfig.siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description || seoConfig.defaultDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: seoConfig.siteUrl,
    },
  };
};
