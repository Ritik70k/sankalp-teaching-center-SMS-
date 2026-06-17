import cloudinary from "../config/cloudinary";

export async function deleteCloudinaryImage(imageUrl: string) {
  try {
    if (!imageUrl || !imageUrl.includes("res.cloudinary.com")) return;

    const parts = imageUrl.split("/");
    const uploadIndex = parts.findIndex((p) => p === "upload");

    if (uploadIndex === -1) return;

    const publicIdWithVersion = parts.slice(uploadIndex + 2).join("/");

    const publicId = publicIdWithVersion.replace(/\.[^/.]+$/, "");

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
}