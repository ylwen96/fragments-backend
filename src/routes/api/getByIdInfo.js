// src/routes/api/getByIdWithInfo.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  const id = req.params.id;
  const ownerId = req.user;

  try {
    const fragment = await Fragment.byId(ownerId, id);
    if (fragment) {
      res.status(200).json(createSuccessResponse({ fragment: fragment }));
    } else {
      res.status(404).json(createErrorResponse(404, 'fragment is not found'));
    }

  } catch (error) {
    logger.error({ error }, 'error found, cannot get fragment by', { id });
    res.status(404).json(createErrorResponse(404, `failed to get fragment by id, error found, ${error}`));
  }

};
