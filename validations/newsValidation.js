import vine from "@vinejs/vine";

export const newsSchema = vine.object({
  title: vine.string().minLength(5).maxLength(100).required,
  description: vine.string().minLength(5).maxLength(1500).required,
  image: vine.string(),
});
