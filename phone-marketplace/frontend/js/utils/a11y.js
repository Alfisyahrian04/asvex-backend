export function trapFocus(
element
) {

  const focusable =
    element.querySelectorAll(
      'button,input,a'
    );

  if (
    focusable.length
  ) {

    focusable[0].focus();

  }

}
