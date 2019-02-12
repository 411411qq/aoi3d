module base 
{
    export class MD5
    { 
        private static hexcase:number = 0;
        private static chrsz:number = 8;
        private static b64pad:string = "";

        public static hex_md5(s:string):string{ return MD5.binl2hex(MD5.core_md5(MD5.str2binl(s), s.length * MD5.chrsz));}
        public static b64_md5(s:string):string{ return MD5.binl2b64(MD5.core_md5(MD5.str2binl(s), s.length * MD5.chrsz));}
        public static str_md5(s:string):string{ return MD5.binl2str(MD5.core_md5(MD5.str2binl(s), s.length * MD5.chrsz));}
        public static hex_hmac_md5(key, data):string{ return MD5.binl2hex(MD5.core_hmac_md5(key, data)); }
        public static b64_hmac_md5(key, data):string{ return MD5.binl2b64(MD5.core_hmac_md5(key, data)); }
        public static str_hmac_md5(key, data):string{ return MD5.binl2str(MD5.core_hmac_md5(key, data)); }

        private static core_md5(x:Array<number>, len:number):Array<number>
        {
            /* append padding */
            x[len >> 5] |= 0x80 << ((len) % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;

            var a:number =  1732584193;
            var b:number = -271733879;
            var c:number = -1732584194;
            var d:number =  271733878;

            for(var i:number = 0; i < x.length; i += 16)
            {
                var olda:number = a;
                var oldb:number = b;
                var oldc:number = c;
                var oldd:number = d;

                a = MD5.md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
                d = MD5.md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
                c = MD5.md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
                b = MD5.md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
                a = MD5.md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
                d = MD5.md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
                c = MD5.md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
                b = MD5.md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
                a = MD5.md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
                d = MD5.md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
                c = MD5.md5_ff(c, d, a, b, x[i+10], 17, -42063);
                b = MD5.md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
                a = MD5.md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
                d = MD5.md5_ff(d, a, b, c, x[i+13], 12, -40341101);
                c = MD5.md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
                b = MD5.md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

                a = MD5.md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
                d = MD5.md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
                c = MD5.md5_gg(c, d, a, b, x[i+11], 14,  643717713);
                b = MD5.md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
                a = MD5.md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
                d = MD5.md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
                c = MD5.md5_gg(c, d, a, b, x[i+15], 14, -660478335);
                b = MD5.md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
                a = MD5.md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
                d = MD5.md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
                c = MD5.md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
                b = MD5.md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
                a = MD5.md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
                d = MD5.md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
                c = MD5.md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
                b = MD5.md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

                a = MD5.md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
                d = MD5.md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
                c = MD5.md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
                b = MD5.md5_hh(b, c, d, a, x[i+14], 23, -35309556);
                a = MD5.md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
                d = MD5.md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
                c = MD5.md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
                b = MD5.md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
                a = MD5.md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
                d = MD5.md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
                c = MD5.md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
                b = MD5.md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
                a = MD5.md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
                d = MD5.md5_hh(d, a, b, c, x[i+12], 11, -421815835);
                c = MD5.md5_hh(c, d, a, b, x[i+15], 16,  530742520);
                b = MD5.md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

                a = MD5.md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
                d = MD5.md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
                c = MD5.md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
                b = MD5.md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
                a = MD5.md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
                d = MD5.md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
                c = MD5.md5_ii(c, d, a, b, x[i+10], 15, -1051523);
                b = MD5.md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
                a = MD5.md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
                d = MD5.md5_ii(d, a, b, c, x[i+15], 10, -30611744);
                c = MD5.md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
                b = MD5.md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
                a = MD5.md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
                d = MD5.md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
                c = MD5.md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
                b = MD5.md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

                a = MD5.safe_add(a, olda);
                b = MD5.safe_add(b, oldb);
                c = MD5.safe_add(c, oldc);
                d = MD5.safe_add(d, oldd);
            }
            return Array(a, b, c, d);
        }
        private static md5_cmn(q, a, b, x, s, t)
        {
            return MD5.safe_add(MD5.bit_rol(MD5.safe_add(MD5.safe_add(a, q), MD5.safe_add(x, t)), s),b);
        }
        private static md5_ff(a:number, b:number, c:number, d:number, x:number, s:number, t:number):number
        {
            return MD5.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }
        private static md5_gg(a:number, b:number, c:number, d:number, x:number, s:number, t:number):number
        {
            return MD5.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }
        private static md5_hh(a:number, b:number, c:number, d:number, x:number, s:number, t:number):number
        {
            return MD5.md5_cmn(b ^ c ^ d, a, b, x, s, t);
        }
        private static md5_ii(a:number, b:number, c:number, d:number, x:number, s:number, t:number):number
        {
            return MD5.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        }
        private static core_hmac_md5(key:string, data:string):Array<number>
        {
            var bkey = MD5.str2binl(key);
            if(bkey.length > 16) bkey = MD5.core_md5(bkey, key.length * MD5.chrsz);

            var ipad = Array(16), opad = Array(16);
            for(var i = 0; i < 16; i++)
            {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }

            var hash = MD5.core_md5(ipad.concat(MD5.str2binl(data)), 512 + data.length * MD5.chrsz);
            return MD5.core_md5(opad.concat(hash), 512 + 128);
        }
        private static safe_add(x:number, y:number):number
        {
            var lsw:number = (x & 0xFFFF) + (y & 0xFFFF);
            var msw:number = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }
        private static bit_rol(num:number, cnt:number):number
        {
            return (num << cnt) | (num >>> (32 - cnt));
        }
        private static str2binl(str:string):Array<number>
        {
            var bin:Array<number> = Array();
            var mask:number = (1 << MD5.chrsz) - 1;
            for(var i:number = 0; i < str.length * MD5.chrsz; i += MD5.chrsz)
                bin[i>>5] |= (str.charCodeAt(i / MD5.chrsz) & mask) << (i%32);
            return bin;
        }
        private static binl2str(bin:Array<number>):string
        {
            var str:string = "";
            var mask:number = (1 << MD5.chrsz) - 1;
            for(var i = 0; i < bin.length * 32; i += MD5.chrsz)
                str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
            return str;
        }
        private static binl2hex(binarray:Array<number>):string
        {
            var hex_tab:string = MD5.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var str:string = "";
            for(var i = 0; i < binarray.length * 4; i++)
            {
                str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
                    hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
            }
            return str;
        }
        private static binl2b64(binarray:Array<number>):string
        {
            var tab:string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var str:string = "";
            for(var i = 0; i < binarray.length * 4; i += 3)
            {
                var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                            | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                            |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
                for(var j = 0; j < 4; j++)
                {
                    if(i * 8 + j * 6 > binarray.length * 32) str += MD5.b64pad;
                    else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
                }
            }
            return str;
        }
    }
}