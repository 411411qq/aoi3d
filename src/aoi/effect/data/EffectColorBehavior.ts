module aoi
{
    export class EffectColorBehavior extends EffectBehaviorData
    {
        private plu:PlunginColorChange;
        public list:EffectInsertList;
        constructor()
        {
            super();
            this.list = new aoi.EffectInsertList();
            this.list.circle = 1;
            var a:EffectBehaviorInsertData = new EffectBehaviorInsertData();
            a.lastTime = 500;
            a.valueX = 0.2;
            a.valueY = 1;
            a.valueZ = 2;
            this.list.insertList.push(a);

            var b:EffectBehaviorInsertData = new EffectBehaviorInsertData();
            b.lastTime = 500;
            b.valueX = 2;
            b.valueY = 0.5;
            b.valueZ = 1;
            this.list.insertList.push(b);
        }
        protected _update(item:EffectItem, pt:number):void
        {
            if(this.plu == null)
            {
                this.plu = new aoi.PlunginColorChange();
                item.addPlugin(this.plu);
            }
            this.list.startX = 1;
            this.list.startY = 1;
            this.list.startZ = 1;
            this.list.startW = 1;
            var obj:Object = this.list.getCurState(pt);
            this.plu.setColor(obj["x"], obj["y"], obj["z"], obj["w"]);
        }
    }
}