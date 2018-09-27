module base
{
    export class Util {
        public static showEle(eles:Float32Array, limit:number = -1):void {
            var str = "";
            var i = 0, len = limit == -1 ? eles.length : limit;
            for (i = 0; i < len; i++) {
                str += eles[i] + ",";
            }
            console.log(str);
        }

        public static getTimer():number {
            return Date.now();
        }

        public static isChineseChar(str:string):boolean {
            var re = /[^\u4e00-\u9fa5]/;
            if (re.test(str)) return false;
            return true;
        }
        private static platformType:number = -1;
        private static loadedFiles:Object = {};
        public static inputText:HTMLInputElement;
        public static fileInput:HTMLInputElement;
        public static showTextInput(value:string, x:number, y:number, width:number = 200, height:number = 19):HTMLInputElement
        {
            var input:HTMLInputElement = Util.inputText;
            if(input == null)
            {
                input = document.createElement("input");
                input.setAttribute("type", "text");
                Util.inputText = input;
            }
            input.setAttribute("value", value);
            input.value = value;
            input.style.border = '2px';
            input.style.position = 'absolute';
            input.style.left = x + 'px';
            input.style.top = y + 'px';
            input.style.width = width + 'px';
            input.style.height = height + 'px';
            input.style.opacity = '0.5';
            input.style.backgroundColor = "transparent";
            input.size = 14;
            document.body.appendChild(input);
            return input;
        }
        public static hideTextInput():void
        {
            var input:HTMLInputElement = Util.inputText;
            if(input != null && document.body.contains(input))
            {
                document.body.removeChild(input);
            }
        }
        public static showFileBrowser(onchange:any):void
        {
            if(Util.fileInput == null)
            {
                Util.fileInput = document.createElement('input');
                Util.fileInput.setAttribute('id','_ef');
                Util.fileInput.setAttribute('type','file');
                Util.fileInput.setAttribute("style",'visibility:hidden');
            }
            Util.fileInput.onchange = onchange;
            document.body.appendChild(Util.fileInput);
            Util.fileInput.click();
        }
        public static hideFileBrowser():void
        {
            var input:HTMLInputElement = Util.fileInput;
            if(input != null && document.body.contains(input))
            {
                document.body.removeChild(input);
            }
        }
        public static loadScript(url):void
        {
            if(this.loadedFiles[url] == true)
            {
                return;
            }
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            document.body.appendChild(script);
            this.loadedFiles[url] = true;
        }
        public static saveFile(name:string, by:base.ByteArray):void
        {
            let blob = new Blob([by.getSaveBuff()], {type: "application/octet-binary"});
            let fileName = name;
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, fileName);
            } else {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
                window.URL.revokeObjectURL(link.href);
            }
        }

        public static getPlatform():number
        {
            if(Util.platformType == -1)
            {
                var u = navigator.userAgent;
                var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
                var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                if (isAndroid) 
                {
                    Util.platformType = aoi.Define.ANDROID;
                }
                else if (isiOS) 
                {
                    Util.platformType = aoi.Define.IOS;
                }
                else
                {
                    Util.platformType = aoi.Define.PC;
                }
            }
            return Util.platformType;
        }
        public static getMousePos(mouseEvent, index):Object
        {
            if(Util.getPlatform() == aoi.Define.PC)
            {
                return {x:mouseEvent.clientX, y:mouseEvent.clientY};
            }
            else
            {
                return {x:mouseEvent.changedTouches[index].clientX, y:mouseEvent.changedTouches[index].clientY};
            }
        }
    }
}