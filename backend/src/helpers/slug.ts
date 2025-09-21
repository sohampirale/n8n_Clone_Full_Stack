export function generateSlug(str:string) {
  if (!str) return "";

  return str
    .toString()                 // ensure it's a string
    .trim()                     // remove leading/trailing spaces
    .toLowerCase()              // convert to lowercase
    .replace(/\s+/g, "-")       // replace spaces (one or more) with dash
    .replace(/[^\w\-]+/g, "")  // remove all non-word chars except dash
    .replace(/\-\-+/g, "-")    // replace multiple dashes with single dash
    .replace(/^-+/, "")         // trim dash from start
    .replace(/-+$/, "");        // trim dash from end
}
