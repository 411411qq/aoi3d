module aoi
{
    import Object3DContainer = aoi.Object3DContainer;
    export class UiConainer extends Object3DContainer
    {
        constructor(val:boolean = false)
        {
            super(val);
        }

        public setChildIndex(child:Object3DContainer, index:number):void
        {
            var curIndex:number = this.m_children.indexOf(child);
            if(curIndex != -1)
            {
                this.m_children.splice(curIndex, 1);
                this.m_children.splice(index, 0, child);
            }
        }

        public swapChild(child1:Object3DContainer, child2:Object3DContainer):void
        {
            var curIndex1:number = this.m_children.indexOf(child1);
            var curIndex2:number = this.m_children.indexOf(child2);
            if(curIndex1 != -1 && curIndex2 != -1)
            {
                this.m_children[curIndex2] = child1;
                this.m_children[curIndex1] = child2;
            }
        }
    }
}