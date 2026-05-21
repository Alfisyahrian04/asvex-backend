const router =
require('express').Router();

router.get(
  '/',
  (req, res) => {

    res.json({

      success: true,

      uptime:
        process.uptime()

    });

  }
);

module.exports =
router;
