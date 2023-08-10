// src/routes/api/getById.js
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const path = require('path');

module.exports = async (req, res) => {
  const id = path.parse(req.url).name;
  const ownerId = req.user;
  const ext = path.extname(req.url);

  try {
    const fragment = new Fragment(await Fragment.byId(ownerId, id));

    if (ext) {
      if (fragment.isSupportedExtension(ext)) {
        res.status(200)
          .setHeader('content-type', fragment.convertContentType(ext))
          .send(await fragment.convertData(ext));
      } else {
        res.status(415)
          .json(createErrorResponse(415, `Fragment extension is not supported ${ext}`));
      }
    } else {
      res.status(200)
        .setHeader('content-type', fragment.type)
        .send(await fragment.getData());
    }
  } catch (error) {
    logger.error({ error }, 'error found, cannot get fragment by', { id });
    res.status(404).json(createErrorResponse(404, `failed to get fragment by id, error found, ${error}`));
  }

};
