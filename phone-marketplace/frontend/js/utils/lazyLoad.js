export function lazyLoad() {

  const images =
    document.querySelectorAll(
      'img[data-src]'
    );

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            if (
              entry.isIntersecting
            ) {

              const img =
                entry.target;

              img.src =
                img.dataset.src;

              observer.unobserve(img);

            }

          }
        );

      }
    );

  images.forEach(
    img =>
      observer.observe(img)
  );

}
