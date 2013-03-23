
/// <reference path='definitions/node.d.ts'/>

declare module "./buffercursor" {
	class BufferCursor {
		constructor(_buffer);

		buffer: NodeBuffer;

		tell(): number;
		seek(_pos: number);
		eof(): bool;

		//note: NodeBuffer stuff
		write(string: string, length?: number, encoding?: string): number;
		toString(encoding?: string, start?: number, end?: number): string;
		length: number;
		copy(targetBuffer: NodeBuffer, targetStart?: number, sourceStart?: number, sourceEnd?: number): void;
		slice(length?: number): BufferCursor;
		readUInt8(noAsset?: bool): number;
		readUInt16LE(noAssert?: bool): number;
		readUInt16BE(noAssert?: bool): number;
		readUInt32LE(noAssert?: bool): number;
		readUInt32BE(noAssert?: bool): number;
		readInt8(noAssert?: bool): number;
		readInt16LE(noAssert?: bool): number;
		readInt16BE(noAssert?: bool): number;
		readInt32LE(noAssert?: bool): number;
		readInt32BE(noAssert?: bool): number;
		readFloatLE(noAssert?: bool): number;
		readFloatBE(noAssert?: bool): number;
		readDoubleLE(noAssert?: bool): number;
		readDoubleBE(noAssert?: bool): number;
		writeUInt8(value: number, noAssert?: bool): void;
		writeUInt16LE(value: number, noAssert?: bool): void;
		writeUInt16BE(value: number, noAssert?: bool): void;
		writeUInt32LE(value: number, noAssert?: bool): void;
		writeUInt32BE(value: number, noAssert?: bool): void;
		writeInt8(value: number, noAssert?: bool): void;
		writeInt16LE(value: number, noAssert?: bool): void;
		writeInt16BE(value: number, noAssert?: bool): void;
		writeInt32LE(value: number, noAssert?: bool): void;
		writeInt32BE(value: number, noAssert?: bool): void;
		writeFloatLE(value: number, noAssert?: bool): void;
		writeFloatBE(value: number, noAssert?: bool): void;
		writeDoubleLE(value: number, noAssert?: bool): void;
		writeDoubleBE(value: number, noAssert?: bool): void;
		fill(value: any, length: number): void;
	}
}