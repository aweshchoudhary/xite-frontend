"use client";

export default function ImageSelector({
  setSelectedImage,
  fieldName,
}: {
  setSelectedImage?: (image: File | null) => void;
  previewUrl?: string | null;
  fieldName?: string;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage?.(file);
    }
  };
  return (
    <div>
      <input
        type="file"
        id={fieldName ?? "image-selector"}
        accept="image/*"
        multiple={false}
        onChange={handleChange}
        className="sr-only"
      />
    </div>
  );
}
