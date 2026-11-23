# VTC INTECOM x NextJS 16

**Nextjs 16.0.10**

var mn = má»i ngÆ°á»i ^^

## Cau hinh hien tai

- `next.config.ts` hien dang de `output: "export"` cho base cat HTML tinh.
- `NEXT_PUBLIC_MODE='html'` la mode mac dinh cho ban cat HTML tinh.
- Anh local/CDN duoc cau hinh bang constant `MEDIA_MODE` trong `constants/base.ts`:
  - `0`: dung anh local trong `public`.
  - `1`: ghep URL voi `NEXT_PUBLIC_BASE_MEDIA`.
- Khong can xoa/comment `NEXT_PUBLIC_BASE_MEDIA` khi doi giua local va CDN.
- Component anh dung chung nam tai `components/common/Image/Image.tsx` va duoc import bang `app/image`.
- `SecureImage` moi nam tai `components/common/Image/SecureImage.tsx`.
- `FastImage` va API `fast-image` da duoc bo khoi base.

## Setup nhanh

Tao file env local tu file mau:

```bash
cp .env.example .env
yarn install
yarn dev
```

Tren Windows PowerShell:

```powershell
Copy-Item .env.example .env
yarn install
yarn dev
```

Luu y env:

- `.env` la file local, khong commit len git.
- `.env.example` chi chua placeholder de nguoi clone biet can bien nao.
- Cac bien secret nhu `KEY_SECURE_IMAGE`, `API_SECRET` chi dung phia server.
- Client signing dung `NEXT_PUBLIC_API_SECRET` theo contract public cua API.
- Cac bien `NEXT_PUBLIC_*` se bi bundle ra client/browser, khong dat secret chi danh cho server vao day.

# 1.BÃªn cáº¯t html

## ChÃº Ã½

- `next.config.ts` dang cau hinh `output: "export"` cho ban HTML tinh.
- Anh mac dinh dung local trong `public`; khi can CDN, doi `MEDIA_MODE` thanh `"1"` va cau hinh `NEXT_PUBLIC_BASE_MEDIA`.

## HÆ°á»›ng dáº«n

- vÃ­ dá»¥ trong component Template
- Äá»ƒ khai bÃ¡o 1 backgound, mn hÃ£y Ä‘áº·t tÃªn bg-TÃªn (vÃ­ dá»¥: className={`relative lg:p-10 p-4 bg-background-demo bg-contain w-[640px] bg-no-repeat bg-center lg:h-[410px]`})
  trong file tailwind.config.ts khai bÃ¡o nhÆ° vÃ­ dá»¥: "background-demo": renderUrlImage("/assets/images/bg_vuqy_demo.png"),
- vá»‹ trÃ­ Ä‘á»ƒ áº£nh luÃ´n lÃ  public/assets/images

### Setup popup:

- mn copy pháº§n khai bÃ¡o nÃ y, import cÃ¡c module cáº§n thiáº¿t (pháº§n import vscode sáº½ tá»± gá»£i Ã½, ko cáº§n cop cÅ©ng Ä‘Æ°á»£c)

```
import appSlice from "@/app/appSlice";
import { useAppDispatch } from "@/redux/hooks";
const dispatch = useAppDispatch();
const { updateModalState } = appSlice.actions;
```

### Má»Ÿ popup:

```
dispatch(updateModalState(<MessageTemplate message="Demo má»Ÿ popup" />));
```

### ÄÃ³ng popup

```
dispatch(updateModalState(null));
```

- popup cÃ³ thá»ƒ má»Ÿ vÃ  Ä‘Ã³ng táº¡i báº¥t kÃ¬ page hay component nÃ o cÅ©ng Ä‘Æ°á»£c
- css táº¡i globals.css náº¿u muá»‘n css chung cho toÃ n project, náº¿u muá»‘n style riÃªng cho page thÃ¬ mn táº¡o 1 file style.module.css cÃ¹ng cáº¥p vá»›i page, file nÃ y sáº½ chá»‰ Ã¡p dá»¥ng css cho page,
  sáº½ ko sá»£ bá»‹ Ä‘áº·t trÃ¹ng tÃªn,
- háº¡n cháº¿ dÃ¹ng jquery, chá»‰ sá»­ dá»¥ng trong trÆ°á»ng há»£p ko cÃ²n cÃ¡ch nÃ o khÃ¡c
- khi báº¯t Ä‘áº§u dá»±ng html hÃ£y xÃ³a component Template, comnponent nÃ y chá»‰ lÃ m vÃ­ dá»¥ Ä‘á»ƒ tham kháº£o

# 2.BÃªn dev

## ChÃº Ã½:

- Neu can build dang web/standalone, can cap nhat lai `next.config.ts` tu `output: "export"` sang cau hinh phu hop moi truong deploy.
- Auth token duoc khoi tao trong `components/common/Auth/AuthTokenProvider.tsx`, khong goi truc tiep trong `app/layout.tsx`.
- Mode HTML mac dinh se khong goi `requireAuth()` de tranh loi static export. Khi chuyen sang web/server, doi:
  ```
  NEXT_PUBLIC_MODE='web'
  ```
- Neu web co chia path, cap nhat `basePath` trong `next.config.ts` va `NEXT_PUBLIC_BASE_PATH`.
- Runtime public env duoc khai bao trong `config/public-env.ts`. Dung `getClientPublicEnv()` o client va `process.env` o server. Root layout da render script tuong ung:
  ```
  import { PublicEnv } from "@/config/public-env";
  <head>
    <PublicEnv />
  </head>
  ```

## HÆ°á»›ng dáº«n:

CÃ¡c hook cÃ³ sáºµn
-Chuyá»ƒn title thÃ nh slug (toSlug)
-Gá»i hÃ m share Fb (onShareFb)
-Paging: truyá»n css Ä‘Æ°á»£c cáº¯t vÃ o props, type1 lÃ  phÃ¢n trang cÃ³ 3 cháº¥m, type2 lÃ  phÃ¢n trang ko cÃ³ dáº¥u 3 cháº¥m
-loading progres bar
-cÃ¡c hÃ m gá»i sá»‘ dÆ°, Ä‘Äƒng nháº­p, khi muá»‘n gá»i láº¡i sá»‘ dÆ° thay Ä‘á»•i state refresh cá»§a redux

# Nghiá»‡p vá»¥ API

- API thÃ´ng tin User

```
POST {{domain}}/UserInfo
Authorization: Bearer Token
Request: (JSON body)
  interface RequestBackend {
    time: number;
    sign: string;
    makerCode: string;
    func: string;
    fromIP: string;
    data: Object;
    session?: string;
  }
Response: (JSON body)
  interface Data<T> {
    code: number;
    mess: string;
    data: T;
  }
```

- API Dá»‹ch vá»¥ / Sá»± kiá»‡n

```
POST {{domain}}/Event
Authorization: Bearer Token
Request: (JSON body)
  interface RequestBackend {
    time: number;
    sign: string;
    makerCode: string;
    func: string;
    fromIP: string;
    data: Object;
    session?: string;
  }
Response: (JSON body)
Loáº¡i dá»¯ liá»‡u Ä‘Æ¡n
  interface Data<T> {
    code: number;
    mess: string;
    data: T;
  }
Loáº¡i dá»¯ liá»‡u danh sÃ¡ch
  export interface MetaData<T> {
    code: number;
    mess: string;
    data: DataT<T>;
  }

  export interface DataT<T> {
    total: number;
    list: T[];
  }
```

# Nghiá»‡p vá»¥ Authen

**ChÃº Ã½: Äá»ƒ Ä‘áº£m báº£o viá»‡c fetch API á»Ÿ Server Side vÃ  Client Side Ä‘á»ƒ Ä‘Æ°á»£c authen, Frontend cáº§n pháº£i fetch API authen tá»« phÃ­a Server Side**

## CÆ¡ cháº¿ sá»­ dá»¥ng:

# CÃ¡c tÃ­nh nÄƒng tÃ¡i sá»­ dá»¥ng

## Each component

- Cho phÃ©p user táº¡o ra view loop nhiá»u element tá»« array data.
- GiÃºp háº¡n cháº¿ cÃ¡c warning vÃ  error trong quÃ¡ trÃ¬nh loop cÃ¡c element vÃ´ danh (thiáº¿u key hoáº·c thiáº¿u index).

### HÆ°á»›ng dáº«n

```
  {
    list && <Each of={list} render={(e, i) =>
      <Link
        className="m-5 text-black"
        key={i}
        href={`/demo/${e.LocationID}`}
      >
        {e.LocationName}
      </Link>
    } />
  }
```

## UpperCase cá»¥m tá»« trong Ä‘oáº¡n vÄƒn

- Cho phÃ©p user truyá»n vÃ o Ä‘oáº¡n vÄƒn vÃ  tráº£ vá» Ä‘oáº¡n vÄƒn gá»“m cÃ¡c cá»¥m tá»« cÃ³ chá»¯ cÃ¡i Ä‘áº§u tiÃªn in hoa

```
upperCaseFirstLetter("thá»© ba 26/03/2024, 17:03")
```

```
Output:
Thá»© Ba 26/03/2024, 17:03
```

## Link Ä‘iá»u hÆ°á»›ng Store Mobile

- Cho phÃ©p gáº¯n link vÃ o QR code Ä‘á»ƒ truy cáº­p vÃ o web vÃ  Ä‘iá»u hÆ°á»›ng Ä‘áº¿n store phÃ¹ há»£p vá»›i OS.

### HÆ°á»›ng dáº«n

#### B1: Setup middleware

- Copy file middleware.ts tá»« /application/middleware/middleware.ts vÃ o dir gá»‘c cá»§a project.

#### B2: config link store trÃªn middleware

- Thay tháº¿ link store vÃ o OS tÆ°Æ¡ng á»©ng

```
    if (device.includes("iOS")) {
      return NextResponse.rewrite(
        new URL(
          `https://apps.apple.com/vn/app/ufc-si%C3%AAu-sao-b%C3%B3ng-%C4%91%C3%A1/id1572417749?l=vi`,
          request.url
        )
      );
    }
    return NextResponse.rewrite(
      new URL(
        `https://play.google.com/store/apps/details?id=ufc.sieusaobongda.bongda.sieusao.fifa.game.thethao.online.vtc.game`,
        request.url
      )
    );
```

#### B3: Dá»±ng page tÆ°Æ¡ng á»©ng vá»›i routing Ä‘iá»u hÆ°á»›ng

Path /app/tai-game

```
import { logInfo } from "@/utils/log-helper";
import { NextRequest } from "next/server";
import React from "react";

const TaiGame = ({ searchParams }: { searchParams: { os: string } }) => {
  logInfo("Page Tai Game", { searchParams });
  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "10%" }}>
        Xin ChÃ o !!! Thiáº¿t bá»‹: {searchParams.os}
      </h1>
      <div style={{ marginTop: "50%" }}></div>
    </div>
  );
};

export default TaiGame;

```

## Lazy Load Section One Page

### MÃ´ táº£:

Use-case cho trÆ°á»ng há»£p muá»‘n load tá»«ng section trÃªn web theo cuá»™n trang. Tá»‘i Æ°u tá»‘c Ä‘á»™ táº£i web vÃ  giÃºp web nháº¹ hÆ¡n. SEO tá»‘i Æ°u hÆ¡n khi chá»‰ cháº¥m Ä‘iá»ƒm section Ä‘Æ°á»£c hiá»‡n thá»‹ máº·c Ä‘á»‹nh.

### HÆ°á»›ng dáº«n:

ChÃº Ã½ chá»‰ sá»­ dá»¥ng cho client-side rendering

```
'use client'
import useIntersectionObserver from "@/components/hooks/useIntersectionObserver";
const [isInViewTinMoi, refTinMoi] = useIntersectionObserver(
    0.1,
    "-200px",
    "h-[1000px] lg:h-[200px]"
  );
return (
  <div>
    <Section1 />
    <div className={`opacity-0 h-[1000px] lg:h-[200px]`} ref={refTinMoi}>
      {isInViewTinMoi && <TinMoi />}
    </div>
  </div>
)
```

- Section1 sáº½ lÃ  section máº·c Ä‘á»‹nh Ä‘Æ°á»£c view.
- TinMoi lÃ  section Ä‘Æ°á»£c view theo nhu cáº§u theo scroll trang.
- useIntersectionObserver() cÃ³ 3 tham sá»‘
  - threshold lÃ  Ä‘á»™ trá»… hiá»ƒn thá»‹
  - rootMargin lÃ  Ä‘á»™ lÃ¹i scroll trang.
    - VD: -200px cÃ³ nghÄ©a lÃ  náº¿u user scroll Ä‘áº¿n trÆ°á»›c 200px cá»§a section TinMoi thÃ¬ section nÃ y sáº½ Ä‘Æ°á»£c hiá»ƒn thá»‹ trÆ°á»›c.
  - heightElement lÃ  className tailwind Ä‘á»ƒ style chiá»u cao cho section.

# Docker - K8s & Jenkins

## Cáº¥u trÃºc triá»ƒn khai:

### Jenkins file:

- File jenkins.config.yaml chá»©a deploy_environment Ä‘áº¡i diá»‡n cho cháº¿ Ä‘á»™i build cá»§a WEB.
  - Náº¿u lÃ  prod thÃ¬ sáº½ láº¥y env cá»§a file .env.production.sample Ä‘á»ƒ build.
  - Náº¿u lÃ  beta thÃ¬ sáº½ láº¥y env cá»§a file .env.development.sample Ä‘á»ƒ build.

### Docker file

Bao gá»“m 3 stage:

- Stage Base: chá»©a image cá»§a OS alpine vÃ  mÃ´i trÆ°á»ng NodeJS
- Stage deps: chá»©a ká»‹ch báº£n cÃ i Ä‘áº·t cÃ¡c package cÃ³ trong project
  - ChÃº Ã½ project pháº£i cÃ³ Ä‘á»§ package.json vÃ  (yarn.lock hoáº·c package-lock.json)
- Stage builder: chá»©a ká»‹ch báº£n build project NextJS
- Stage runner: chá»©a ká»‹ch báº£n cÃ¡c cÃ¢u lá»‡nh Ä‘á»ƒ start application vá»›i build cá»§a stage builder.

```bash
docker build . -t webbase -f docker/beta/Dockerfile

docker-compose up
```
