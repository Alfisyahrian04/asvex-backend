export function createObserver(
callback
) {

  return new IntersectionObserver(
    callback,
    {

      threshold: 0.2

    }
  );

}
