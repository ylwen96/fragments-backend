// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const ownerId = req.user;
  const expand = req.query.expand;

  try {
    const fragments = await Fragment.byUser(ownerId, expand > 0);
    res.status(200).json(createSuccessResponse({
      status: 'ok',
      fragments: fragments,
    }));
  } catch (error) {
    res.status(404).json(createErrorResponse(404, error));
  }
};
