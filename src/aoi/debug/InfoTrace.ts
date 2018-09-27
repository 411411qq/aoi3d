module aoi {
    export class InfoTrace
    {
        private infoTxt:HTMLDivElement;
        private infoList:Array<string>;
        constructor()
        {
            this.infoTxt = document.createElement("div");
            this.infoTxt.style.position = 'absolute';
            this.infoTxt.style.top = '150px';
            this.infoList = [];
            this.infoTxt.innerHTML = "";
            document.body.appendChild(this.infoTxt);
            GlobelConst.eventDispatcher.addEventListener("TRACE_INFO", this, this.onInfoTrace);
        }
        private onInfoTrace(obj:base.EventBase)
        {
            this.infoList.push(obj.data as string);
            while(this.infoList.length > 15)
            {
                this.infoList.shift();
            }
            var len:number = this.infoList.length;
            var str:string = "";
            for(var i:number = 0; i<len;i++)
            {
                str += "<font color=\"FFFFFF\">" + this.infoList[i] + "</font><br/>";
            }
            this.infoTxt.innerHTML = str;
        }
    }
}