// src/routes/api/putById.js
const { createErrorResponse, createSuccessResponse } = require('../../response');
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const path = require('path');
const contentType = require('content-type');

module.exports = async (req, res) => {
  const type = contentType.parse(req.headers['content-type']).type;
  const id = path.parse(req.url).name;

  try {
    const fragment = new Fragment(await Fragment.byId(req.user, id));
    if (Fragment.isSupportedType(type)) {
      await fragment.save();
      await fragment.setData(req.body);
      res.status(200).json(createSuccessResponse({ fragment: fragment }));
    } else {
      logger.error('Content-Type is not supported');
      res.status(400).json(createErrorResponse(400, 'Content-Type is not supported'));
    }
  } catch (error) {
    logger.error({ error }, 'unable to update fragment, fragment not found', { id });
    res.status(404).json(createErrorResponse(404, 'unable to update fragment, fragment not found', { id }, { error }));
  }

};
