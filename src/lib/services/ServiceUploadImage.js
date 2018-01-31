export default function uploadImg(file) {
  return new Promise(resolve => {
    const filereader = new FileReader();

    filereader.addEventListener('load', function() {
      resolve({
        src: filereader.result,
      });
    });

    filereader.readAsDataURL(file);
  });
}
