export default function pageTransition() {

  document.body.animate(

    [

      {
        opacity: 0
      },

      {
        opacity: 1
      }

    ],

    {

      duration: 300

    }

  );

}
