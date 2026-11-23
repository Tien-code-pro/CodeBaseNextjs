# VTC INTECOM x NextJS 16

**Nextjs 16.0.10**

var mn = mọi người ^^

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

---

## 1. Bên cắt HTML

### Chú ý

- `next.config.ts` dang cau hinh `output: "export"` cho ban HTML tinh.
- Anh mac dinh dung local trong `public`; khi can CDN, doi `MEDIA_MODE` thanh `"1"` va cau hinh `NEXT_PUBLIC_BASE_MEDIA`.

### Hướng dẫn

- Ví dụ trong component Template.
- Để khai báo 1 background, mn hãy đặt tên `bg-Tên`, ví dụ:

  ```tsx
  className={`relative lg:p-10 p-4 bg-background-demo bg-contain w-[640px] bg-no-repeat bg-center lg:h-[410px]`}
  ```

  Trong file `tailwind.config.ts` khai báo như ví dụ:

  ```ts
  "background-demo": renderUrlImage("/assets/images/bg_vuqy_demo.png"),
  ```

- Vị trí để ảnh luôn là `public/assets/images`.

### Setup popup

mn copy phần khai báo này, import các module cần thiết (phần import VSCode sẽ tự gợi ý, ko cần copy cũng được):

```tsx
import appSlice from "@/app/appSlice";
import { useAppDispatch } from "@/redux/hooks";

const dispatch = useAppDispatch();
const { updateModalState } = appSlice.actions;
```

#### Mở popup

```tsx
dispatch(updateModalState(<MessageTemplate message="Demo mở popup" />));
```

#### Đóng popup

```tsx
dispatch(updateModalState(null));
```

- Popup có thể mở và đóng tại bất kì page hay component nào cũng được.
- CSS tại `globals.css` nếu muốn CSS chung cho toàn project. Nếu muốn style riêng cho page thì mn tạo 1 file `style.module.css` cùng cấp với page, file này chỉ áp dụng CSS cho page đó, sẽ ko sợ bị đặt trùng tên.
- Hạn chế dùng jQuery, chỉ sử dụng trong trường hợp ko còn cách nào khác.
- Khi bắt đầu dựng HTML hãy xóa component Template, component này chỉ làm ví dụ để tham khảo.

---

## 2. Bên dev

### Chú ý

- Neu can build dang web/standalone, can cap nhat lai `next.config.ts` tu `output: "export"` sang cau hinh phu hop moi truong deploy.
- Auth token duoc khoi tao trong `components/common/Auth/AuthTokenProvider.tsx`, khong goi truc tiep trong `app/layout.tsx`.
- Mode HTML mac dinh se khong goi `requireAuth()` de tranh loi static export. Khi chuyen sang web/server, doi:

  ```env
  NEXT_PUBLIC_MODE='web'
  ```

- Neu web co chia path, cap nhat `basePath` trong `next.config.ts` va `NEXT_PUBLIC_BASE_PATH`.
- Runtime public env duoc khai bao trong `config/public-env.ts`. Dung `getClientPublicEnv()` o client va `process.env` o server. Root layout da render script tuong ung:

  ```tsx
  import { PublicEnv } from "@/config/public-env";

  <head>
    <PublicEnv />
  </head>;
  ```

### Hướng dẫn

Các hook có sẵn:

- Chuyển title thành slug (`toSlug`).
- Gọi hàm share Fb (`onShareFb`).
- Paging: truyền CSS được cắt vào props. `type1` là phân trang có dấu 3 chấm, `type2` là phân trang ko có dấu 3 chấm.
- Loading progress bar.
- Các hàm gọi số dư, đăng nhập. Khi muốn gọi lại số dư thì thay đổi state `refresh` của redux.

---

## Nghiệp vụ API

### API thông tin User

```http
POST {{domain}}/UserInfo
Authorization: Bearer Token
```

Request (JSON body):

```ts
interface RequestBackend {
  time: number;
  sign: string;
  makerCode: string;
  func: string;
  fromIP: string;
  data: Object;
  session?: string;
}
```

Response (JSON body):

```ts
interface Data<T> {
  code: number;
  mess: string;
  data: T;
}
```

### API Dịch vụ / Sự kiện

```http
POST {{domain}}/Event
Authorization: Bearer Token
```

Request (JSON body):

```ts
interface RequestBackend {
  time: number;
  sign: string;
  makerCode: string;
  func: string;
  fromIP: string;
  data: Object;
  session?: string;
}
```

Response (JSON body):

Loại dữ liệu đơn:

```ts
interface Data<T> {
  code: number;
  mess: string;
  data: T;
}
```

Loại dữ liệu danh sách:

```ts
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

---

## Nghiệp vụ Authen

**Chú ý: Để đảm bảo việc fetch API ở Server Side và Client Side được authen, Frontend cần phải fetch API authen từ phía Server Side.**

### Cơ chế sử dụng

_(Chưa có nội dung, bổ sung sau.)_

---

## Các tính năng tái sử dụng

### Each component

- Cho phép user tạo ra view loop nhiều element từ array data.
- Giúp hạn chế các warning và error trong quá trình loop các element vô danh (thiếu `key` hoặc thiếu `index`).

#### Hướng dẫn

```tsx
{
  list && (
    <Each
      of={list}
      render={(e, i) => (
        <Link className="m-5 text-black" key={i} href={`/demo/${e.LocationID}`}>
          {e.LocationName}
        </Link>
      )}
    />
  );
}
```

### UpperCase cụm từ trong đoạn văn

- Cho phép user truyền vào đoạn văn và trả về đoạn văn gồm các cụm từ có chữ cái đầu tiên in hoa.

```ts
upperCaseFirstLetter("thứ ba 26/03/2024, 17:03");
```

Output:

```text
Thứ Ba 26/03/2024, 17:03
```

### Link điều hướng Store Mobile

- Cho phép gắn link vào QR code để truy cập vào web và điều hướng đến store phù hợp với OS.

#### B1: Setup middleware

- Copy file `middleware.ts` từ `/application/middleware/middleware.ts` vào dir gốc của project.

#### B2: Config link store trên middleware

- Thay thế link store vào OS tương ứng:

```ts
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

#### B3: Dựng page tương ứng với routing điều hướng

Path `/app/tai-game`:

```tsx
import { logInfo } from "@/utils/log-helper";
import React from "react";

const TaiGame = ({ searchParams }: { searchParams: { os: string } }) => {
  logInfo("Page Tai Game", { searchParams });
  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "10%" }}>
        Xin Chào !!! Thiết bị: {searchParams.os}
      </h1>
      <div style={{ marginTop: "50%" }}></div>
    </div>
  );
};

export default TaiGame;
```

### Lazy Load Section One Page

#### Mô tả

Use-case cho trường hợp muốn load từng section trên web theo cuộn trang. Tối ưu tốc độ tải web và giúp web nhẹ hơn. SEO tối ưu hơn khi chỉ chấm điểm section được hiển thị mặc định.

#### Hướng dẫn

Chú ý: chỉ sử dụng cho client-side rendering.

```tsx
"use client";
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
);
```

- `Section1` là section mặc định được view.
- `TinMoi` là section được view theo nhu cầu, khi scroll trang.
- `useIntersectionObserver()` có 3 tham số:
  - `threshold`: độ trễ hiển thị.
  - `rootMargin`: độ lùi scroll trang. VD: `-200px` nghĩa là nếu user scroll đến trước 200px của section `TinMoi` thì section này sẽ được hiển thị trước.
  - `heightElement`: className tailwind để style chiều cao cho section.

---

## Docker - K8s & Jenkins

### Cấu trúc triển khai

#### Jenkins file

- File `jenkins.config.yaml` chứa `deploy_environment`, đại diện cho chế độ build của WEB:
  - Nếu là `prod` thì sẽ lấy env của file `.env.production.sample` để build.
  - Nếu là `beta` thì sẽ lấy env của file `.env.development.sample` để build.

#### Docker file

Bao gồm 4 stage:

- **Base**: chứa image của OS alpine và môi trường NodeJS.
- **deps**: chứa kịch bản cài đặt các package có trong project.
  - Chú ý: project phải có đủ `package.json` và (`yarn.lock` hoặc `package-lock.json`).
- **builder**: chứa kịch bản build project NextJS.
- **runner**: chứa kịch bản các câu lệnh để start application với build của stage builder.

```bash
docker build . -t webbase -f docker/beta/Dockerfile

docker-compose up
```
