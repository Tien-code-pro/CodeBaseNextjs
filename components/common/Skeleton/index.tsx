import ContentLoader from "react-content-loader";

type LoaderProps = React.ComponentProps<typeof ContentLoader>;

const loaderColors = {
  backgroundColor: "#edf0f5",
  foregroundColor: "#d8deea",
};

const svgStyle = {
  width: "100%",
  height: "auto",
  display: "block",
};

const LoaderScreen = ({
  children,
  maxWidth = 1180,
}: {
  children: React.ReactNode;
  maxWidth?: number;
}) => {
  return (
    <main className="min-h-screen w-full bg-white px-4 py-8 md:px-8 lg:py-12">
      <div className="mx-auto w-full" style={{ maxWidth }}>
        {children}
      </div>
    </main>
  );
};

export const ContentPageLoader = (props: LoaderProps) => {
  return (
    <LoaderScreen>
      <ContentLoader
        speed={2}
        width={1180}
        height={720}
        viewBox="0 0 1180 720"
        style={svgStyle}
        {...loaderColors}
        {...props}
      >
        <rect x="0" y="0" rx="0" ry="0" width="1180" height="260" />
        <rect x="0" y="314" rx="0" ry="0" width="420" height="34" />
        <rect x="0" y="378" rx="0" ry="0" width="980" height="18" />
        <rect x="0" y="416" rx="0" ry="0" width="1080" height="18" />
        <rect x="0" y="454" rx="0" ry="0" width="820" height="18" />
        <rect x="0" y="530" rx="0" ry="0" width="560" height="150" />
        <rect x="620" y="530" rx="0" ry="0" width="560" height="150" />
      </ContentLoader>
    </LoaderScreen>
  );
};

export const LandingPageLoader = (props: LoaderProps) => {
  return (
    <LoaderScreen maxWidth={1280}>
      <ContentLoader
        speed={2}
        width={1280}
        height={820}
        viewBox="0 0 1280 820"
        style={svgStyle}
        {...loaderColors}
        {...props}
      >
        <rect x="0" y="0" rx="0" ry="0" width="1280" height="430" />
        <rect x="64" y="94" rx="0" ry="0" width="420" height="44" />
        <rect x="64" y="166" rx="0" ry="0" width="600" height="18" />
        <rect x="64" y="204" rx="0" ry="0" width="520" height="18" />
        <rect x="64" y="270" rx="0" ry="0" width="160" height="46" />
        <rect x="248" y="270" rx="0" ry="0" width="160" height="46" />
        <rect x="0" y="500" rx="0" ry="0" width="386" height="220" />
        <rect x="447" y="500" rx="0" ry="0" width="386" height="220" />
        <rect x="894" y="500" rx="0" ry="0" width="386" height="220" />
      </ContentLoader>
    </LoaderScreen>
  );
};

export const ListPageLoader = (props: LoaderProps) => {
  return (
    <LoaderScreen>
      <ContentLoader
        speed={2}
        width={1180}
        height={760}
        viewBox="0 0 1180 760"
        style={svgStyle}
        {...loaderColors}
        {...props}
      >
        <rect x="0" y="0" rx="0" ry="0" width="360" height="36" />
        <rect x="0" y="68" rx="0" ry="0" width="1180" height="1" />
        {[0, 1, 2, 3, 4].map((item) => {
          const y = 110 + item * 124;

          return (
            <g key={item}>
              <rect x="0" y={y} rx="0" ry="0" width="190" height="96" />
              <rect x="226" y={y + 6} rx="0" ry="0" width="520" height="24" />
              <rect x="226" y={y + 48} rx="0" ry="0" width="820" height="14" />
              <rect x="226" y={y + 78} rx="0" ry="0" width="620" height="14" />
            </g>
          );
        })}
      </ContentLoader>
    </LoaderScreen>
  );
};

export const GridPageLoader = (props: LoaderProps) => {
  return (
    <LoaderScreen>
      <ContentLoader
        speed={2}
        width={1180}
        height={820}
        viewBox="0 0 1180 820"
        style={svgStyle}
        {...loaderColors}
        {...props}
      >
        <rect x="0" y="0" rx="0" ry="0" width="300" height="34" />
        <rect x="880" y="0" rx="0" ry="0" width="300" height="34" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => {
          const col = item % 4;
          const row = Math.floor(item / 4);
          const x = col * 300;
          const y = 88 + row * 340;

          return (
            <g key={item}>
              <rect x={x} y={y} rx="0" ry="0" width="260" height="210" />
              <rect x={x} y={y + 238} rx="0" ry="0" width="210" height="18" />
              <rect x={x} y={y + 274} rx="0" ry="0" width="148" height="18" />
            </g>
          );
        })}
      </ContentLoader>
    </LoaderScreen>
  );
};

export const TablePageLoader = (props: LoaderProps) => {
  return (
    <LoaderScreen>
      <ContentLoader
        speed={2}
        width={1180}
        height={720}
        viewBox="0 0 1180 720"
        style={svgStyle}
        {...loaderColors}
        {...props}
      >
        <rect x="0" y="0" rx="0" ry="0" width="340" height="34" />
        <rect x="0" y="72" rx="0" ry="0" width="260" height="44" />
        <rect x="284" y="72" rx="0" ry="0" width="260" height="44" />
        <rect x="888" y="72" rx="0" ry="0" width="292" height="44" />
        <rect x="0" y="162" rx="0" ry="0" width="1180" height="48" />
        {[0, 1, 2, 3, 4, 5].map((item) => {
          const y = 234 + item * 70;

          return (
            <g key={item}>
              <rect x="0" y={y} rx="0" ry="0" width="1180" height="1" />
              <rect x="24" y={y + 24} rx="0" ry="0" width="180" height="16" />
              <rect x="280" y={y + 24} rx="0" ry="0" width="220" height="16" />
              <rect x="590" y={y + 24} rx="0" ry="0" width="180" height="16" />
              <rect x="990" y={y + 24} rx="0" ry="0" width="130" height="16" />
            </g>
          );
        })}
      </ContentLoader>
    </LoaderScreen>
  );
};

export const EventPageLoader = (props: LoaderProps) => {
  return (
    <LoaderScreen maxWidth={1280}>
      <ContentLoader
        speed={2}
        width={1280}
        height={860}
        viewBox="0 0 1280 860"
        style={svgStyle}
        {...loaderColors}
        {...props}
      >
        <rect x="0" y="0" rx="0" ry="0" width="1280" height="360" />
        <rect x="300" y="416" rx="0" ry="0" width="160" height="52" />
        <rect x="480" y="416" rx="0" ry="0" width="160" height="52" />
        <rect x="660" y="416" rx="0" ry="0" width="160" height="52" />
        <rect x="840" y="416" rx="0" ry="0" width="160" height="52" />
        <rect x="0" y="540" rx="0" ry="0" width="610" height="240" />
        <rect x="670" y="540" rx="0" ry="0" width="610" height="240" />
      </ContentLoader>
    </LoaderScreen>
  );
};

export const ShopGridLoader = GridPageLoader;
export const ShoppingLoader = ShopGridLoader;
