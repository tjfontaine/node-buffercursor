// Copyright 2012 Timothy J Fontaine <tjfontaine@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE

var VError = require('verror');

class BCO extends VError {
  constructor (length, pos, size) {
    super(
      'BufferCursorOverflow: length %d, position %d, size %d',
      length,
      pos,
      size
    );
    this.kind = 'BufferCursorOverflow';
    this.length = length;
    this.position = pos;
    this.size = size;
  }
};

class BufferCursor {
  static BufferCursorOverflow = BCO;

  #pos = 0;

  /**
   * @param {Buffer} buff
   */
  constructor (buff) {
    this.buffer = buff;
    this.length = buff.length;
  }

  /**
   * @param {number} step
   */
  #move (step) {
    this.#checkWrite(step);
    this.#pos += step;
    return this;
  }

  /**
   * @param {number} size
   */
  #checkWrite (size) {
    var shouldThrow = false;

    var length = this.length;
    var pos = this.#pos;

    if (size > length)
      shouldThrow = true;

    if (length - pos < size)
      shouldThrow = true;

    if (shouldThrow) {
      var bco = new BCO(length,
        pos,
        size);
      throw bco;
    }
  }

  /**
   * @param {number} pos
   */
  seek (pos) {
    if (pos < 0)
      throw new VError(new RangeError('Cannot seek before start of buffer'),
        'Negative seek values not allowed: %d', pos);

    if (pos > this.length)
      throw new VError(new RangeError('Trying to seek beyond buffer'),
        'Requested %d position is beyond length %d',
        pos, this.length);

    this.#pos = pos;
    return this;
  }

  eof () {
    return this.#pos === this.length;
  }

  toByteArray (method = 'readUInt8') {
    var arr = [], i, part = 1;

    if (method.indexOf('16') > 0)
      part = 2;
    else if (method.indexOf('32') > 0)
      part = 4;

    for (i = 0; i < this.buffer.length; i += part) {
      arr.push(this.buffer[method](i));
    }
    return arr;
  }

  tell () {
    return this.#pos;
  }

  /**
   * @param {number} [length]
   */
  slice (length) {
    var end, b;

    if (length === undefined) {
      end = this.length;
    } else {
      end = this.#pos + length;
    }

    b = new BufferCursor(this.buffer.subarray(this.#pos, end));
    this.seek(end);

    return b;
  }

  toString (encoding = 'utf8', length) {
    var end, ret;

    if (length === undefined) {
      end = this.length;
    } else {
      end = this.#pos + length;
    }

    ret = this.buffer.toString(encoding, this.#pos, end);
    this.seek(end);
    return ret;
  }

  // This method doesn't need to _checkWrite because Buffer implicitly truncates
  // to the length of the buffer, it's the only method in Node core that behaves
  // this way by default
  /**
   * @param {string} value
   * @param {number} length
   * @param {string} [encoding]
   */
  write (value, length, encoding) {
    var ret;

    ret = this.buffer.write(value, this.#pos, length, encoding);
    return this.#move(ret);
  }

  fill (value, length) {
    var end;

    if (length === undefined) {
      end = this.length;
    } else {
      end = this.#pos + length;
    }

    this.#checkWrite(end - this.#pos);

    this.buffer.fill(value, this.#pos, end);
    this.seek(end);
    return this;
  }

  // This prototype is not entirely like the upstream Buffer.copy, instead it
  // is the target buffer, and accepts the source buffer -- since the target
  // buffer knows its starting position
  copy (source, sourceStart, sourceEnd) {
    var sBC = source instanceof BufferCursor;

    if (isNaN(sourceEnd))
      sourceEnd = source.length;

    if (isNaN(sourceStart)) {
      if (sBC)
        sourceStart = source._pos;

      else
        sourceStart = 0;
    }

    var length = sourceEnd - sourceStart;

    this.#checkWrite(length);

    var buf = sBC ? source.buffer : source;

    buf.copy(this.buffer, this.#pos, sourceStart, sourceEnd);

    return this.#move(length);
  }

  readUInt8 () {
    var ret = this.buffer.readUInt8(this.#pos);
    this.#move(1);
    return ret;
  }

  readInt8 () {
    var ret = this.buffer.readInt8(this.#pos);
    this.#move(1);
    return ret;
  }

  readInt16BE () {
    var ret = this.buffer.readInt16BE(this.#pos);
    this.#move(2);
    return ret;
  }

  readInt16LE () {
    var ret = this.buffer.readInt16LE(this.#pos);
    this.#move(2);
    return ret;
  }

  readUInt16BE () {
    var ret = this.buffer.readUInt16BE(this.#pos);
    this.#move(2);
    return ret;
  }

  readUInt16LE () {
    var ret = this.buffer.readUInt16LE(this.#pos);
    this.#move(2);
    return ret;
  }

  readUInt32LE () {
    var ret = this.buffer.readUInt32LE(this.#pos);
    this.#move(4);
    return ret;
  }

  readUInt32BE () {
    var ret = this.buffer.readUInt32BE(this.#pos);
    this.#move(4);
    return ret;
  }

  readInt32LE () {
    var ret = this.buffer.readInt32LE(this.#pos);
    this.#move(4);
    return ret;
  }

  readInt32BE () {
    var ret = this.buffer.readInt32BE(this.#pos);
    this.#move(4);
    return ret;
  }

  readFloatBE () {
    var ret = this.buffer.readFloatBE(this.#pos);
    this.#move(4);
    return ret;
  }

  readFloatLE () {
    var ret = this.buffer.readFloatLE(this.#pos);
    this.#move(4);
    return ret;
  }

  readDoubleBE () {
    var ret = this.buffer.readDoubleBE(this.#pos);
    this.#move(8);
    return ret;
  }

  readDoubleLE () {
    var ret = this.buffer.readDoubleLE(this.#pos);
    this.#move(8);
    return ret;
  }

  writeUInt8 (value) {
    this.#checkWrite(1);
    this.buffer.writeUInt8(value, this.#pos);
    this.#move(1);
    return this;
  }

  writeInt8 (value) {
    this.#checkWrite(1);
    this.buffer.writeInt8(value, this.#pos);
    this.#move(1);
    return this;
  }

  writeUInt16BE (value) {
    this.#checkWrite(2);
    this.buffer.writeUInt16BE(value, this.#pos);
    this.#move(2);
    return this;
  }

  writeUInt16LE (value) {
    this.#checkWrite(2);
    this.buffer.writeUInt16LE(value, this.#pos);
    this.#move(2);
    return this;
  }

  writeInt16BE (value) {
    this.#checkWrite(2);
    this.buffer.writeInt16BE(value, this.#pos);
    this.#move(2);
    return this;
  }

  writeInt16LE (value) {
    this.#checkWrite(2);
    this.buffer.writeInt16LE(value, this.#pos);
    this.#move(2);
    return this;
  }

  writeUInt32BE (value) {
    this.#checkWrite(4);
    this.buffer.writeUInt32BE(value, this.#pos);
    this.#move(4);
    return this;
  }

  writeUInt32LE (value) {
    this.#checkWrite(4);
    this.buffer.writeUInt32LE(value, this.#pos);
    this.#move(4);
    return this;
  }

  writeInt32BE (value) {
    this.#checkWrite(4);
    this.buffer.writeInt32BE(value, this.#pos);
    this.#move(4);
    return this;
  }

  writeInt32LE (value) {
    this.#checkWrite(4);
    this.buffer.writeInt32LE(value, this.#pos);
    this.#move(4);
    return this;
  }

  writeFloatBE (value) {
    this.#checkWrite(4);
    this.buffer.writeFloatBE(value, this.#pos);
    this.#move(4);
    return this;
  }

  writeFloatLE (value) {
    this.#checkWrite(4);
    this.buffer.writeFloatLE(value, this.#pos);
    this.#move(4);
    return this;
  }

  writeDoubleBE (value) {
    this.#checkWrite(8);
    this.buffer.writeDoubleBE(value, this.#pos);
    this.#move(8);
    return this;
  }

  writeDoubleLE (value) {
    this.#checkWrite(8);
    this.buffer.writeDoubleLE(value, this.#pos);
    this.#move(8);
    return this;
  }
}

module.exports = BufferCursor;
