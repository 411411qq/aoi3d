module aoi {
    export class ReferenceBase extends base.EventDispatcher {
        public lastUseTime:number;
        public reference:Object;
        public lifeTime:number;
        constructor() {
            super();
            this.lastUseTime = 0;
            this.reference = {};
        }
        public initData(loaderData):void{
            this.lifeTime = loaderData.lifeTime;
            this.lastUseTime = GlobelConst.nowTime;
        }
        public haveEle():boolean {
            var key;
            for (key in this.reference) {
                return true;
            }
            return false;
        }

        public canDispose(checkTime:boolean):boolean {
            if (!this.haveEle()) {
                if (checkTime == false || GlobelConst.nowTime - this.lastUseTime > this.lifeTime) {
                    return true;
                }
            }
            return false;
        }

        public getOut(str:string):void {
            if (this.haveEle() == false) {
                this.workWhenFirstOneUse();
            }
            if (this.reference[str] == null) {
                this.reference[str] = 0;
            }
            var r_time = this.reference[str] + 1;
            this.reference[str] = r_time;
        }

        public returnTo(str:string):void {
            if (this.reference[str] == null) {
                return;
            }
            var r_time = this.reference[str] - 1;
            this.reference[str] = r_time;
            if (r_time == 0) {
                delete this.reference[str]
            }
            if (!this.haveEle()) {
                this.workWhenNoOneUse();
                this.lastUseTime = GlobelConst.nowTime;
            }
        }

        public workWhenFirstOneUse():void {
        }

        public workWhenNoOneUse():void {
        }
    }
}

