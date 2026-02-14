import slugify from "slugify";
const generateSlug = (text: string) => {
  if (!text || typeof text !== "string") return "";
  return slugify(text, { lower: true, strict: true });
};
export default generateSlug;
