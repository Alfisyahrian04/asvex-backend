const mongoose =
require('mongoose');

exports.withTransaction =
async callback => {

  const session =
    await mongoose.startSession();

  try {

    session.startTransaction();

    const result =
      await callback(session);

    await session.commitTransaction();

    return result;

  } catch (err) {

    await session.abortTransaction();

    throw err;

  } finally {

    session.endSession();

  }

};
