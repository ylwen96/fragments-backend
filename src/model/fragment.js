const { nanoid } = require('nanoid');
const contentType = require('content-type');
const logger = require('../logger')

const md = require('markdown-it')();
// convert large images in common formats to smaller, web-friendly JPEG, PNG, WebP, GIF and AVIF images of varying dimensions.
const sharp = require('sharp');

const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (id) {
      this.id = id;
    } else {
      this.id = nanoid();
    }

    if (!ownerId) {
      throw new Error(
        `owner id is required`
      );
    } else {
      this.ownerId = ownerId;
    }

    if (!type) {
      throw new Error(
        `type is required`
      );
    } else {
      if (Fragment.isSupportedType(type)) {
        this.type = type;
      } else {
        throw new Error(
          `type is invalid`
        );
      }
    }

    if (typeof size !== 'number' || size < 0) {
      throw new Error(
        `size must be number type and cannot be negative`
      );
    } else {
      this.size = size;
    }

    if (created) {
      this.created = created;
    } else {
      this.created = new Date().toISOString();
    }

    if (updated) {
      this.updated = updated;
    } else {
      this.updated = new Date().toISOString();
    }
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    try {
      const res = await listFragments(ownerId, expand);
      return res;
    } catch (error) {
      logger.error({ error }, 'fragment class, unable to find fragments by user', { ownerId });
      return [];
    }
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    try {
      const res = await readFragment(ownerId, id);
      if (res) {
        return res;
      } else {
        throw new Error(`No fragment found by id ${ownerId}`);
      }
    } catch (error) {
      logger.error({ error }, 'fragment class, unable to find fragments by id', { ownerId });
      throw new Error(`Error found, ${error}`);
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static delete(ownerId, id) {
    try {
      return deleteFragment(ownerId, id);
    } catch (error) {
      logger.error({ error }, 'something wrong, failed to delete');
      throw new Error(`Error found, ${error}`);
    }
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    try {
      this.updated = new Date().toISOString();
      return writeFragment(this);
    } catch (error) {
      logger.error({ error }, 'fragment class, failed to save');
      throw new Error(`Error found, ${error}`);
    }
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    try {
      return readFragmentData(this.ownerId, this.id);
    } catch (error) {
      logger.error({ error }, 'fragment class, failed to get data');
      throw new Error(`Error found, ${error}`);
    }
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    try {
      if (data) {
        this.updated = new Date().toISOString();
        this.size = data.length;
        await writeFragment(this);
        return writeFragmentData(this.ownerId, this.id, data);
      }
      else {
        return Promise.reject(new Error('Data invalid, please double check'));
      }
    } catch (error) {
      logger.error({ error }, 'fragment class, failed to set data');
      return Promise.reject(new Error(`Error found, ${error}`));
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    const type = new RegExp('^text/*');
    return type.test(this.type);
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    return new Array(this.type.split(';')[0]);
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    const type = new RegExp('^text/*');
    if (type.test(value) || value == 'application/json' || value == 'image/png' || value == 'image/jpeg' || value == 'image/webp' || value == 'image/gif') {
      return true;
    } else {
      return false;
    }
  }

  isSupportedExtension(value) {
    if (value == '.txt') {
      if (this.type == 'text/plain' || this.type == 'text/markdown' || this.type == 'text/html') {
        return true;
      } else {
        return false;
      }
    } else if (value == '.md') {
      if (this.type == 'text/markdown') {
        return true;
      } else {
        return false;
      }
    } else if (value == '.html') {
      if (this.type == 'text/markdown' || this.type == 'text/html') {
        return true;
      } else {
        return false;
      }
    } else if (value == '.json') {
      if (this.type == 'application/json') {
        return true;
      } else {
        return false;
      }
    }
    else if (value == '.png') {
      if (this.type == 'image/png') {
        return true
      } else {
        return false
      }
    }
    else if (value == '.jpg') {
      if (this.type == 'image/jpeg') {
        return true
      } else {
        return false
      }
    }
    else if (value == '.webp') {
      if (this.type == 'image/webp') {
        return true
      } else {
        return false
      }
    }
    else if (value == '.gif') {
      if (this.type == 'image/gif') {
        return true
      } else {
        return false
      }
    }
    else {
      return false;
    }
  }

  convertContentType(ext) {
    switch (ext) {
      case '.txt':
        return 'text/plain';
      case '.md':
        return 'text/markdown';
      case '.html':
        return 'text/html';
      case '.json':
        return 'application/json';
      case '.png':
        return 'image/png';
      case '.jpg':
        return 'image/jpg';
      case '.webp':
        return 'image/webp';
      case '.gif':
        return 'image/gif';
      default:
        return this.mimeType;
    }
  }

  async convertData(ext) {
    try {
      const data = await this.getData();
      switch (ext) {
        case ".txt":
          return data.toString();
        case (ext == ".html" && this.mimeType == "text/markdown"):
          return md.render(data.toString());
        case (ext == ".png"):
          return await sharp(data).png().toBuffer();
        case (ext == ".jpg"):
          return await sharp(data).jpeg().toBuffer();
        case (ext == ".webp"):
          return await sharp(data).webp().toBuffer();
        case (ext == ".gif"):
          return await sharp(data).gif().toBuffer();
        default:
          return "";
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports.Fragment = Fragment;
