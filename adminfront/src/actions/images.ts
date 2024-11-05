import Medusa from '@/services/api';
import { FormImage } from '@/types/common';

const splitImages = (
	images: FormImage[]
): { uploadImages: FormImage[]; existingImages: FormImage[] } => {
	const uploadImages: FormImage[] = [];
	const existingImages: FormImage[] = [];

	images.forEach((image) => {
		if (image.nativeFile) {
			uploadImages.push(image);
		} else {
			existingImages.push(image);
		}
	});

	return { uploadImages, existingImages };
};

/**
 * Prepares the images for upload by splitting them into existing and new images,
 * uploading the new images, and deleting any old images that are no longer needed.
 * @param images - An array of FormImage objects representing the images to be uploaded.
 * @param oldImagesUrls - An optional array of strings representing the URLs of old images to be deleted.
 * @returns An array of FormImage objects representing the result images after the upload and deletion process.
 */
export const prepareImages = async (
	images: FormImage[],
	oldImagesUrls: string[] | null
) => {
	console.log('oldImagesUrls:', oldImagesUrls);
	const { uploadImages, existingImages } = splitImages(images);

	let uploadedImgs: FormImage[] = [];
	if (uploadImages.length > 0) {
		const files = uploadImages.map((i) => i.nativeFile);
		uploadedImgs = await Medusa.uploads
			.create(files)
			.then(({ data }) => (data as any).uploads);
	}

	const resultImages = [...existingImages, ...uploadedImgs];

	// Make delete image
	if (oldImagesUrls?.length) {
		const newImagesUrls = resultImages?.map((img) => img.url) || [];
		const toDelete = oldImagesUrls.filter(
			(url) => !newImagesUrls.includes(url)
		);

		if (toDelete?.length) {
			await deleteImages(toDelete);
		}
	}

	return resultImages;
};

export const deleteImages = async (fileKeys: string[] | string) => {
	let payload = {};

	if (!fileKeys) {
		return;
	}
	if (typeof fileKeys === 'string') {
		const fileKey = new URL(fileKeys).pathname.split('/').pop();
		payload = { fileKey };
	}
	if (Array.isArray(fileKeys)) {
		const fileKey = fileKeys
			.map((url) => {
				if (typeof url === 'string')
					return new URL(url).pathname.split('/').pop();
				return null;
			})
			.filter(Boolean);
		payload = { fileKey: fileKey };
	}

	await Medusa.uploads.delete(payload);
};
