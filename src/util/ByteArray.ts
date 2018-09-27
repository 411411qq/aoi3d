module base {
    export class ByteArray {
        public buffer:ArrayBuffer;
        private _pos:number = 0;
        private dataView:DataView;
        private isLitle:boolean;
        private type:number;

        constructor(buffer:ArrayBuffer, type:number) {
            this.type = type == null ? Endian.BIG_ENDIAN : type;
            this.buffer = buffer;
            this.dataView = new DataView(buffer);
            this.isLitle = this.type == Endian.LITTLE_ENDIAN;
        }

        public get pos():number {
            return this._pos;
        }

        public set pos(val:number) {
            this._pos = val;
        }
        public writeString(str:string):void
        {
            var len:number = str.length, i:number = 0;
            this.writeShort(len);
            for (i = 0; i < len; i++) {
                this.writeByte(str.charCodeAt(i));
            }
        }
        public readString():string {
            var str = "", i = 0;
            var strLen = this.readShort();
            for (i = 0; i < strLen; i++) {
                str += String.fromCharCode(this.readByte());
            }
            return str;
        }
        public writeShort(value:number)
        {
            this.dataView.setInt16(this._pos, value, this.isLitle);
            this._pos += 2;
        }
        public readShort():number {
            var rs = this.dataView.getInt16(this.pos, this.isLitle);
            this._pos += 2;
            return rs;
        }
        public writeByte(value:number)
        {
            this.dataView.setInt8(this._pos, value);
            this._pos += 1;
        }
        public readByte():number {
            var rs = this.dataView.getInt8(this.pos);
            this._pos += 1;
            return rs;
        }
        public writeInt(value:number)
        {
            this.dataView.setInt32(this._pos, value, this.isLitle);
            this._pos += 4;
        }
        public readInt():number {
            var rs = this.dataView.getInt32(this.pos, this.isLitle);
            this._pos += 4;
            return rs;
        }
        public writeUint(value:number)
        {
            this.dataView.setUint32(this._pos, value, this.isLitle);
            this._pos += 4;
        }
        public readUint():number {
            var rs = this.dataView.getUint32(this.pos);
            this._pos += 4;
            return rs;
        }
        public writeUshort(value:number)
        {
            this.dataView.setUint16(this._pos, value, this.isLitle);
            this._pos += 2;
        }
        public readUshort():number {
            var rs = this.dataView.getUint16(this.pos, this.isLitle);
            this._pos += 2;
            return rs;
        }
        public writeFloat32(value:number)
        {
            this.dataView.setFloat32(this._pos, value, this.isLitle);
            this._pos += 4;
        }
        public readFloat32():number {
            var rs = this.dataView.getFloat32(this.pos, this.isLitle);
            this._pos += 4;
            return rs;
        }
        public writeFloat64(value:number)
        {
            this.dataView.setFloat64(this._pos, value, this.isLitle);
            this._pos += 8;
        }
        public readFloat64():number {
            var rs = this.dataView.getFloat64(this.pos, this.isLitle);
            this._pos += 8;
            return rs;
        }
        public getSaveBuff():ArrayBuffer
        {
            return this.buffer.slice(0, this._pos);
        }
    }
    export class Endian {
        static BIG_ENDIAN = 1;
        static LITTLE_ENDIAN = 2;
    }
}