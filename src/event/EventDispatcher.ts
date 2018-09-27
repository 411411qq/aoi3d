module base
{
    export class EventDispatcher
    {
        private __z_e_listeners:Object;
        constructor()
        {
            this.__z_e_listeners = {};
        }

        public addEventListener(type:string, owner:Object, fun:Function):void
        {
            var list = this.__z_e_listeners[type];
            if (list === undefined) {
                list = [];
                this.__z_e_listeners[type] = list;
            }
            var lis = {
                owner: owner,
                func: fun
            };
            list.push(lis);
        }

        public removeEventListener(type:string, owner:Object, fun:Function):void
        {
            var list = this.__z_e_listeners[type];
            if (list !== undefined) {
                var size = list.length;
                for (var i = 0; i < size; i++) {
                    var obj = list[i];
                    if (obj.func === fun && obj.owner === owner) {
                        list.splice(i, 1);
                        return;
                    }
                }
            }
        }

        public dispatchEvent(event:EventBase):void
        {
            event.curTarget = this;
            var type = event.type;
            var list = this.__z_e_listeners[type];
            if (list !== undefined) {
                var size = list.length;
                for (var i = 0; i < size; i++) {
                    var ef = list[i]; 
                    var fun = ef.func;
                    (fun as Function).call(ef.owner, event);
                }
            }
        }
    }
}