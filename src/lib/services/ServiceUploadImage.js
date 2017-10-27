export default function uploadImg(file) {
  const url = URL.createObjectURL(file);
  return Promise.resolve({
    url,
  });
}
