// Only Google profile photos are allowed in `images.remotePatterns`
// (next.config.js); other URLs would fail in the image optimizer.
export function isGoogleAvatar(
	image: string | null | undefined,
): image is string {
	return image?.startsWith("https://lh3.googleusercontent.com/") ?? false;
}
