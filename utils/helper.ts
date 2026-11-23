export function toSlug(str: string) {
  // Chuyển hết sang chữ thường
  str = str.toLowerCase();

  // xóa dấu
  str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, "a");
  str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, "e");
  str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, "i");
  str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, "o");
  str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, "u");
  str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, "y");
  str = str.replace(/(đ)/g, "d");

  // Xóa ký tự đặc biệt
  str = str.replace(/([^0-9a-z-\s])/g, "");

  // Xóa khoảng trắng thay bằng ký tự -
  str = str.replace(/(\s+)/g, "-");

  // Xóa ký tự - liên tiếp
  str = str.replace(/-+/g, "-");

  // xóa phần dự - ở đầu
  str = str.replace(/^-+/g, "");

  // xóa phần dư - ở cuối
  str = str.replace(/-+$/g, "");

  // return
  return str;
}

type ShareFacebookCallback = () => void | Promise<unknown>;

/**
 * Records the user's share intent, then opens Facebook Web Share.
 *
 * Call this function directly from the button click handler. The callback is
 * intentionally not awaited so `window.open` keeps the same user gesture on
 * mobile browsers. Facebook builds the preview from the URL's Open Graph tags.
 */
export function onShareFB(url: string, cb: ShareFacebookCallback): void;
export function onShareFB(
  url: string,
  caption: string,
  cb: ShareFacebookCallback
): void;
export function onShareFB(
  url: string,
  captionOrCallback: string | ShareFacebookCallback,
  legacyCallback?: ShareFacebookCallback
): void {
  const callback =
    typeof captionOrCallback === "function"
      ? captionOrCallback
      : legacyCallback;

  if (!callback) {
    throw new TypeError("onShareFB requires a callback");
  }

  try {
    void Promise.resolve(callback()).catch((error) => {
      console.error("onShareFB callback failed", error);
    });
  } catch (error) {
    console.error("onShareFB callback failed", error);
  }

  const facebookUrl = `https://www.facebook.com/sharer.php?u=${encodeURIComponent(
    url
  )}`;

  window.open(facebookUrl, "_blank", "toolbar=0,status=0,width=650,height=450");
}

export const upperCaseFirstLetter = (paragraph: string):string =>{
  const result = paragraph.split(" ").map((e)=>{
    return e.charAt(0).toUpperCase() + e.slice(1)
  })
  return result.join(" ")
}
